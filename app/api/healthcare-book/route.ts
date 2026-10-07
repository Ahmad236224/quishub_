import { NextRequest, NextResponse } from "next/server";
import {
  sendEmail,
  fromAddress,
  isEmailConfigured,
  renderEmailLayout,
  emailInfoBlock,
  emailButton,
  escapeHtml,
} from "@/lib/email";
import { createGoogleMeetEvent } from "@/lib/googleCalendar";

const ADMIN_INBOX =
  process.env.HEALTHCARE_NOTIFY_EMAIL ||
  process.env.SMTP_USER ||
  "quishub@gmail.com";

/* ------------------------------------------------------------------ */
/*  Email templates — shared Quishub layout                           */
/* ------------------------------------------------------------------ */
function clientEmail(opts: {
  name: string;
  practice: string;
  schedule: string;
  bottleneck: string;
  meetingLink: string;
}) {
  const { name, practice, schedule, bottleneck, meetingLink } = opts;
  return renderEmailLayout({
    eyebrow: "Quishub Healthcare",
    heading: "Your diagnostic call is confirmed",
    footerText: "Quishub · Healthcare Workflow Software · Reply to this email for any changes.",
    bodyHtml: `
      <p style="font-size: 16px; line-height: 1.55; margin: 0 0 14px 0;">Hi ${escapeHtml(name)},</p>
      <p style="font-size: 15px; line-height: 1.6; color: #6b6477; margin: 0 0 18px 0;">
        Thank you for requesting a clinical workflow diagnostic call with Quishub. We&rsquo;ve reserved your slot. No pitch, no charge &mdash; 15 focused minutes on where ${escapeHtml(practice)} is losing hours.
      </p>
      ${emailInfoBlock("Scheduled time", escapeHtml(schedule))}
      ${emailInfoBlock("Video meeting", `<a href="${meetingLink}" style="color: #7c3aed; text-decoration: underline; word-break: break-all; font-weight: 600;">${meetingLink}</a>`)}
      <div style="margin: 0 0 22px 0;">${emailButton(meetingLink, "Join the call")}</div>
      <div style="padding-top: 18px; border-top: 1px solid rgba(22,14,32,0.10);">
        <div style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #6b6477; font-weight: 700; margin-bottom: 6px;">What you shared</div>
        <div style="font-size: 14px; color: #6b6477; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(bottleneck)}</div>
      </div>
    `,
  });
}

function adminEmail(opts: {
  name: string;
  practice: string;
  email: string;
  schedule: string;
  bottleneck: string;
  meetingLink: string;
}) {
  const { name, practice, email, schedule, bottleneck, meetingLink } = opts;
  return renderEmailLayout({
    eyebrow: "Quishub Healthcare",
    heading: `${name} — ${practice}`,
    footerText: "New healthcare lead, submitted via the diagnostic booking form.",
    bodyHtml: `
      ${emailInfoBlock("Doctor", escapeHtml(name))}
      ${emailInfoBlock("Practice", escapeHtml(practice))}
      ${emailInfoBlock("Email", `<a href="mailto:${escapeHtml(email)}" style="color: #7c3aed; text-decoration: underline;">${escapeHtml(email)}</a>`)}
      ${emailInfoBlock("Scheduled", escapeHtml(schedule))}
      ${emailInfoBlock("Meeting", `<a href="${meetingLink}" style="color: #7c3aed; text-decoration: underline; word-break: break-all;">${meetingLink}</a>`)}
      ${emailInfoBlock("Bottleneck", `<span style="font-weight:400; white-space: pre-wrap;">${escapeHtml(bottleneck)}</span>`)}
    `,
  });
}

/* ------------------------------------------------------------------ */
/*  POST handler                                                      */
/* ------------------------------------------------------------------ */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const practice = String(body?.practice || "").trim();
    const email = String(body?.email || "").trim();
    const schedule = String(body?.schedule || "").trim();
    const isoDate = String(body?.isoDate || "").trim();
    const time = String(body?.time || "").trim();
    const bottleneck = String(body?.bottleneck || "").trim();

    if (!name || !practice || !email || !schedule || !isoDate || !time || !bottleneck) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (!isEmailConfigured()) {
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    let meetingLink: string;
    try {
      meetingLink = await createGoogleMeetEvent({
        name,
        email,
        date: isoDate,
        time,
        summary: `Clinical Workflow Diagnostic — ${name} (${practice})`,
        description: `Healthcare diagnostic call booked from the Quishub website.\n\nName: ${name}\nPractice: ${practice}\nEmail: ${email}\nBottleneck: ${bottleneck}`,
      });
    } catch (err) {
      console.error("Healthcare Google Meet creation failed:", err);
      return NextResponse.json(
        { error: "Could not create a video meeting. Please try again or email hello@quishub.com." },
        { status: 502 }
      );
    }

    /* -------------------------------------------------------------- */
    /*  Run all three side-effects concurrently                       */
    /* -------------------------------------------------------------- */
    const sender = fromAddress("Quishub Healthcare");

    const clientMail = sendEmail({
      from: sender,
      to: email,
      subject: `Your clinical workflow diagnostic call is confirmed`,
      html: clientEmail({ name, practice, schedule, bottleneck, meetingLink }),
    });

    const adminMail = sendEmail({
      from: sender,
      to: ADMIN_INBOX,
      replyTo: email,
      subject: `🩺 New healthcare lead — ${name} (${practice})`,
      html: adminEmail({ name, practice, email, schedule, bottleneck, meetingLink }),
    });

    const mattermostText =
      `### 🚀 **New High-Value Healthcare Lead Dispatched!**\n` +
      `- **Name:** ${name}\n` +
      `- **Practice:** ${practice}\n` +
      `- **Email:** ${email}\n` +
      `- **Scheduled Time:** ${schedule}\n` +
      `- **Clinical Pain Point:** ${bottleneck}\n` +
      `- **Live Video Meeting Space:** ${meetingLink}`;

    const webhookUrl = process.env.MATTERMOST_WEBHOOK_URL;
    const mattermostPing = webhookUrl
      ? fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: mattermostText }),
        }).catch((err) => {
          console.error("Mattermost notify failed:", err);
        })
      : Promise.resolve();

    const [clientResult, adminResult] = await Promise.all([
      clientMail,
      adminMail,
      mattermostPing,
    ]);

    if (!clientResult.success || !adminResult.success) {
      const clientErr = clientResult.success ? null : clientResult.error;
      const adminErr = adminResult.success ? null : adminResult.error;
      console.error("Healthcare booking email failed:", {
        client: clientErr ?? "ok",
        admin: adminErr ?? "ok",
      });
      const detail = clientErr || adminErr || "unknown";
      return NextResponse.json(
        { error: `Email delivery failed: ${detail}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, meetingLink });
  } catch (error: unknown) {
    console.error("Healthcare booking API error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to process booking. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
