import { NextRequest, NextResponse } from "next/server";
import {
  sendEmail,
  fromAddress,
  isEmailConfigured,
  renderEmailLayout,
  emailInfoBlock,
  escapeHtml,
} from "@/lib/email";
import { createGoogleMeetEvent } from "@/lib/googleCalendar";

export async function POST(req: NextRequest) {
  try {
    const { name, email, date, time } = await req.json();

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!isEmailConfigured()) {
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    const meetLink = await createGoogleMeetEvent({ name, email, date, time });
    const notifyEmail =
      process.env.BOOKING_NOTIFY_EMAIL || process.env.SMTP_USER || "";

    // ── 1. Send notification email to team ──────────────────────────────────
    const notifyResult = await sendEmail({
      from: fromAddress("Quishub Booking"),
      replyTo: email,
      to: notifyEmail,
      subject: `🗓️ New Discovery Call Booking — ${name}`,
      html: renderEmailLayout({
        eyebrow: "Quishub",
        heading: "New Discovery Call Request",
        footerText: "Calendar invite and Google Meet link have been generated automatically.",
        bodyHtml: `
          ${emailInfoBlock("Name", escapeHtml(name))}
          ${emailInfoBlock("Email", escapeHtml(email))}
          ${emailInfoBlock("Date", escapeHtml(date))}
          ${emailInfoBlock("Time", `${escapeHtml(time)} (PKT)`)}
          ${emailInfoBlock("Google Meet", `<a href="${meetLink}" style="color:#7c3aed; text-decoration: underline; word-break: break-all;">${meetLink}</a>`)}
        `,
      }),
    });

    if (!notifyResult.success) {
      throw new Error(notifyResult.error);
    }

    // ── 2. Send confirmation email to client ────────────────────────────────
    const confirmResult = await sendEmail({
      from: fromAddress("Quishub"),
      to: email,
      subject: `Your Discovery Call is Booked — ${date} at ${time}`,
      html: renderEmailLayout({
        eyebrow: "Quishub",
        heading: `You're booked, ${escapeHtml(name)}! 🎉`,
        bodyHtml: `
          <p style="font-size: 15px; line-height: 1.6; color: #160E20; margin: 0 0 18px 0;">
            Your 30-minute discovery call has been scheduled for:
          </p>
          ${emailInfoBlock("Scheduled time", `${escapeHtml(date)}<br/><span style="font-weight:400; color:#6b6477;">${escapeHtml(time)} (PKT, UTC+5)</span>`)}
          ${emailInfoBlock("Join the call here", `<a href="${meetLink}" style="color:#7c3aed; text-decoration: underline; word-break: break-all;">${meetLink}</a>`)}
          <p style="font-size: 14px; line-height: 1.6; color: #6b6477;">
            A calendar invite has also been sent to your email. If you need to reschedule, reply to this email.
          </p>
        `,
      }),
    });

    // The client confirmation is best-effort: the team was already notified.
    if (!confirmResult.success) {
      console.error("Booking confirmation email failed:", confirmResult.error);
    }

    // ── 3. Send Mattermost notification ─────────────────────────────────────
    const webhookUrl = process.env.MATTERMOST_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `### 🗓️ New Discovery Call Booking\n| Field | Details |\n|---|---|\n| **Name** | ${name} |\n| **Email** | ${email} |\n| **Date** | ${date} |\n| **Time** | ${time} (PKT) |\n| **Google Meet** | ${meetLink} |\n\n_Calendar invite and Google Meet link generated automatically._`,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    // Enhanced error logging to capture authentication failures
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const isAuthError = errorMessage.toLowerCase().includes("token") || 
                        errorMessage.toLowerCase().includes("auth") ||
                        errorMessage.toLowerCase().includes("refresh") ||
                        errorMessage.toLowerCase().includes("revoked") ||
                        errorMessage.toLowerCase().includes("invalid_grant");
    
    console.error("[Booking API] Error Details:", {
      timestamp: new Date().toISOString(),
      isAuthenticationError: isAuthError,
      errorMessage: errorMessage,
      environmentCheck: {
        hasClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasRefreshToken: !!process.env.GOOGLE_REFRESH_TOKEN,
        hasCalendarId: !!process.env.GOOGLE_CALENDAR_ID,
      },
      hint: isAuthError 
        ? "Token revoked or expired. Run re-authentication flow to generate new GOOGLE_REFRESH_TOKEN."
        : "Check server logs for full error details.",
    });
    
    console.error("Booking API error:", error);
    
    // Return user-friendly message with specific auth guidance
    let userMessage = errorMessage;
    if (isAuthError) {
      userMessage = "Calendar authentication error. Please contact support or try booking via email at hello@quishub.com";
    }
    
    return NextResponse.json(
      { error: userMessage },
      { status: 500 }
    );
  }
}
