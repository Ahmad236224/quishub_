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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, projectType, budget, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    if (!isEmailConfigured()) {
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    const notifyEmail =
      process.env.BOOKING_NOTIFY_EMAIL || process.env.SMTP_USER || "";

    // ── 1. Send notification email to team ──────────────────────────────────
    const notifyResult = await sendEmail({
      from: fromAddress("Quishub Contact"),
      replyTo: email,
      to: notifyEmail,
      subject: `📩 New Contact Form Message — ${name}`,
      html: renderEmailLayout({
        eyebrow: "Quishub",
        heading: "New Contact Form Submission",
        footerText: "Submitted via the Quishub contact form.",
        bodyHtml: `
          ${emailInfoBlock("Name", escapeHtml(name))}
          ${emailInfoBlock("Email", escapeHtml(email))}
          ${phone ? emailInfoBlock("Phone", escapeHtml(phone)) : ""}
          ${company ? emailInfoBlock("Company", escapeHtml(company)) : ""}
          ${projectType ? emailInfoBlock("Project Type", escapeHtml(projectType)) : ""}
          ${budget ? emailInfoBlock("Budget", escapeHtml(budget)) : ""}
          ${emailInfoBlock("Message", `<span style="font-weight:400; white-space: pre-wrap;">${escapeHtml(message)}</span>`)}
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
      subject: `We received your message — Thanks for reaching out, ${name}!`,
      html: renderEmailLayout({
        eyebrow: "Quishub",
        heading: `Thanks for reaching out, ${escapeHtml(name)}! 🎉`,
        bodyHtml: `
          <p style="font-size: 15px; line-height: 1.6; color: ${`#160E20`}; margin: 0 0 18px 0;">
            We've received your message and will get back to you within 24 hours with an honest assessment of your project.
          </p>
          ${emailInfoBlock("Your Message", `<span style="font-weight:400; white-space: pre-wrap;">${escapeHtml(message)}</span>`)}
          <p style="font-size: 15px; line-height: 1.6; color: #6b6477; margin: 18px 0;">
            In the meantime, feel free to book a discovery call directly if you'd prefer to speak sooner:
          </p>
          <div style="text-align: center;">
            ${emailButton("https://quishub.com/contact", "Book a Discovery Call")}
          </div>
        `,
      }),
    });

    // The client confirmation is best-effort: the team was already notified.
    if (!confirmResult.success) {
      console.error("Contact confirmation email failed:", confirmResult.error);
    }

    // ── 3. Send Mattermost notification ─────────────────────────────────────
    const webhookUrl = process.env.MATTERMOST_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `### 📩 New Contact Form Message
| Field | Details |
|---|---|
| **Name** | ${name} |
| **Email** | ${email} |
| **Phone** | ${phone || "—"} |
| **Company** | ${company || "—"} |
| **Project Type** | ${projectType || "—"} |
| **Budget** | ${budget || "—"} |

**Message:**
${message.substring(0, 500)}${message.length > 500 ? "..." : ""}`,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Contact API error:", error);
    const message = error instanceof Error ? error.message : "Failed to send message. Please try again.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
