const PKT_OFFSET = "+05:00";

/**
 * OAuth Token Refresh - Google Calendar Integration
 *
 * ENVIRONMENT SETUP REQUIRED:
 * - GOOGLE_CLIENT_ID: From Google Cloud Console > Credentials
 * - GOOGLE_CLIENT_SECRET: From Google Cloud Console > Credentials
 * - GOOGLE_REFRESH_TOKEN: Generated via OAuth2 flow (see re-auth guide below)
 * - GOOGLE_CALENDAR_ID: Calendar ID to create events in (or "primary")
 *
 * RE-AUTHENTICATION GUIDE (if token revoked):
 * 1. Visit Google Cloud Console: https://console.cloud.google.com/apis/credentials
 * 2. Ensure OAuth consent screen is configured (External or Internal)
 * 3. Verify Google Calendar API is enabled: APIs & Services > Enabled APIs
 * 4. Check OAuth credentials exist and are not deleted/recreated
 * 5. Generate new refresh token via OAuth2 playground or manual flow
 * 6. Update .env.local with new GOOGLE_REFRESH_TOKEN value
 * 7. Restart Next.js dev server to load new environment variables
 */
async function getGoogleAccessToken() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  const missingVars: string[] = [];
  if (!clientId) missingVars.push("GOOGLE_CLIENT_ID");
  if (!clientSecret) missingVars.push("GOOGLE_CLIENT_SECRET");
  if (!refreshToken) missingVars.push("GOOGLE_REFRESH_TOKEN");

  if (missingVars.length > 0) {
    console.error("[Calendar Auth] Missing environment variables:", missingVars.join(", "));
    throw new Error(`Missing Google OAuth environment variables: ${missingVars.join(", ")}`);
  }

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        refresh_token: refreshToken!,
        grant_type: "refresh_token",
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.access_token) {
      console.error("[Calendar Auth] OAuth2 Token Refresh Failed", {
        status: response.status,
        error: data.error,
        errorDescription: data.error_description,
        hint:
          data.error === "invalid_grant"
            ? "Refresh token revoked or expired. See RE-AUTHENTICATION GUIDE in source."
            : "Check Google Cloud Console credentials and API enablement.",
      });

      throw new Error(data.error_description || data.error || "Failed to refresh Google access token");
    }

    return data.access_token as string;
  } catch (error) {
    console.error("[Calendar Auth] Token refresh exception:", error);
    throw error;
  }
}

function to24HourTime(time: string) {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    throw new Error("Invalid booking time format");
  }

  let hours = Number(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${minutes}:00`;
}

export function createEventTimes(date: string, time: string) {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Invalid booking date format");
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const startDateTime = `${year}-${month}-${day}T${to24HourTime(time)}${PKT_OFFSET}`;
  const endDateTime = new Date(new Date(startDateTime).getTime() + 30 * 60 * 1000).toISOString();

  return {
    start: startDateTime,
    end: endDateTime,
  };
}

interface CalendarEvent {
  id: string;
  hangoutLink?: string;
  conferenceData?: {
    createRequest?: { status?: { statusCode?: string } };
    entryPoints?: { entryPointType: string; uri: string }[];
  };
}

function extractMeetLink(event: CalendarEvent): string {
  return (
    event.hangoutLink ||
    event.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === "video")?.uri ||
    ""
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Polls the event a few times until Google finishes provisioning the Meet
 * conference. `conferenceData.createRequest.status.statusCode` starts as
 * "pending" — reading `hangoutLink` before it flips to "success" can hand
 * back a room code that isn't actually live yet ("Invalid video call name"
 * when the guest opens it a few seconds later).
 */
async function waitForConferenceLink(
  calendarId: string,
  eventId: string,
  accessToken: string,
  attempts = 5,
  delayMs = 1500
): Promise<string> {
  for (let i = 0; i < attempts; i++) {
    await sleep(delayMs);
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!res.ok) continue;
    const event: CalendarEvent = await res.json();
    const statusCode = event.conferenceData?.createRequest?.status?.statusCode;
    const link = extractMeetLink(event);
    if (statusCode === "success" && link) return link;
  }
  return "";
}

export interface CreateMeetEventParams {
  name: string;
  email: string;
  date: string;
  time: string;
  summary?: string;
  description?: string;
}

/**
 * Creates a calendar event with a Google Meet conference attached, and
 * returns a Meet link that's actually confirmed as provisioned (never a
 * "pending" link that 404s as "Invalid video call name").
 */
export async function createGoogleMeetEvent({
  name,
  email,
  date,
  time,
  summary,
  description,
}: CreateMeetEventParams): Promise<string> {
  const accessToken = await getGoogleAccessToken();
  const calendarId = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID || "primary");
  const eventTimes = createEventTimes(date, time);

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1&sendUpdates=all`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: summary || `Discovery Call — ${name}`,
        description: description || `Discovery call booking from Quishub website.\n\nName: ${name}\nEmail: ${email}`,
        start: {
          dateTime: eventTimes.start,
          timeZone: "Asia/Karachi",
        },
        end: {
          dateTime: eventTimes.end,
          timeZone: "Asia/Karachi",
        },
        attendees: [{ email }],
        conferenceData: {
          createRequest: {
            requestId: `quishub-${Date.now()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      }),
    }
  );

  const data: CalendarEvent & { error?: { message?: string } } = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to create Google Calendar event");
  }

  const statusCode = data.conferenceData?.createRequest?.status?.statusCode;
  let meetLink = extractMeetLink(data);

  if (statusCode !== "success" || !meetLink) {
    meetLink = (await waitForConferenceLink(calendarId, data.id, accessToken)) || meetLink;
  }

  if (!meetLink) {
    throw new Error("Google Meet conference was not provisioned in time");
  }

  return meetLink;
}
