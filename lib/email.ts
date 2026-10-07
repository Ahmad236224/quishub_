import nodemailer from "nodemailer";
import type { Transporter, SentMessageInfo } from "nodemailer";

/**
 * Shared SMTP transport for all transactional mail.
 *
 * Defaults target Gmail SMTP; override with SMTP_HOST / SMTP_PORT for another
 * provider. Port 465 implies an implicit TLS connection, anything else uses
 * STARTTLS.
 */
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;

let transporter: Transporter | null = null;

/**
 * Lazily build the transport.
 *
 * Deliberately not created at module scope so a machine without SMTP
 * credentials can still run `next build`.
 */
function getTransporter(): Transporter {
  if (!isEmailConfigured()) {
    throw new Error("SMTP_USER / SMTP_PASS are not configured");
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });
  }
  return transporter;
}

/** True when the app has everything it needs to send mail. */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

/** Sender address, e.g. `"Quishub" <hello@quishub.com>`. */
export function fromAddress(displayName?: string): string {
  const address = process.env.SMTP_USER || "";
  return displayName ? `"${displayName}" <${address}>` : address;
}

/* ==========================================================================
   Shared HTML email layout
   --------------------------------------------------------------------------
   One canonical template used by every transactional email (booking,
   contact, healthcare booking). Forces `color-scheme: light` so Gmail /
   Apple Mail don't apply their own automatic dark-mode recoloring — that
   auto-recolor is what previously made the same email look different
   (and sometimes broken) across light/dark clients.
   ========================================================================== */

export const BRAND = {
  primary: "#7c3aed",
  primaryEnd: "#2563eb",
  ink: "#160E20",
  paper: "#E5E5E4",
  white: "#FFFFFF",
  muted: "#6b6477",
  border: "rgba(22,14,32,0.10)",
  logoUrl: "https://quishub.com/quishub-logo-light.png",
} as const;

/** Escapes user-supplied strings before interpolating into email HTML. */
export function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** A labeled value row/card used inside email bodies. */
export function emailInfoBlock(label: string, valueHtml: string): string {
  return `
    <div style="background: ${BRAND.white}; border: 1px solid ${BRAND.border}; border-radius: 12px; padding: 16px 20px; margin: 0 0 14px 0;">
      <div style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: ${BRAND.muted}; font-weight: 700; margin-bottom: 6px;">${label}</div>
      <div style="font-size: 15px; font-weight: 600; color: ${BRAND.ink};">${valueHtml}</div>
    </div>`;
}

/** A gradient pill CTA button. */
export function emailButton(href: string, label: string): string {
  return `<a href="${href}" style="display: inline-block; background-color: ${BRAND.primary}; background: linear-gradient(90deg, ${BRAND.primary}, ${BRAND.primaryEnd}); color: ${BRAND.white}; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 999px;">${label}</a>`;
}

/**
 * Wraps `bodyHtml` in the shared Quishub email shell: logo header, light
 * card body, footer. `bodyHtml` should be pre-escaped where it contains
 * user input.
 */
export function renderEmailLayout(opts: {
  eyebrow: string;
  heading: string;
  bodyHtml: string;
  footerText?: string;
}): string {
  const { eyebrow, heading, bodyHtml, footerText } = opts;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0; padding:0; background:${BRAND.paper};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${BRAND.paper}" style="background:${BRAND.paper};">
  <tr>
    <td align="center" style="padding: 32px 16px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" bgcolor="${BRAND.white}" style="width:560px; max-width:100%; background:${BRAND.white}; border: 1px solid ${BRAND.border}; border-radius: 16px; overflow: hidden; font-family: -apple-system, Segoe UI, Inter, Arial, sans-serif; color: ${BRAND.ink};">
        <tr>
          <td bgcolor="${BRAND.primary}" style="background-color: ${BRAND.primary}; background: linear-gradient(90deg, ${BRAND.primary}, ${BRAND.primaryEnd}); padding: 24px 32px;">
            <img src="${BRAND.logoUrl}" alt="Quishub" height="28" style="display:block; height:28px; width:auto; border:0; margin-bottom: 14px;" />
            <div style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.85); font-weight: 700;">${escapeHtml(eyebrow)}</div>
            <div style="font-size: 22px; color: ${BRAND.white}; font-weight: 600; margin-top: 6px;">${escapeHtml(heading)}</div>
          </td>
        </tr>
        <tr>
          <td style="padding: 28px 32px;">
            ${bodyHtml}
          </td>
        </tr>
        <tr>
          <td bgcolor="${BRAND.paper}" style="background: ${BRAND.paper}; padding: 16px 32px; font-size: 12px; color: ${BRAND.muted};">
            ${footerText ? escapeHtml(footerText) : "Quishub &middot; hello@quishub.com"}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string | string[];
  /** Overrides the SMTP_USER default. Accepts a bare or display-name address. */
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

export type SendEmailResult =
  | { success: true; data: SentMessageInfo }
  | { success: false; error: string };

/**
 * Send a transactional email over SMTP.
 *
 * Never throws: transport and delivery failures are normalised into
 * `{ success: false, error }` so call sites can decide how to react.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
  from,
  cc,
  bcc,
}: SendEmailParams): Promise<SendEmailResult> {
  if (!html && !text) {
    return { success: false, error: "Email requires either `html` or `text` content" };
  }

  try {
    const data = await getTransporter().sendMail({
      from: from || fromAddress(),
      to,
      subject,
      ...(html ? { html } : {}),
      ...(text ? { text } : {}),
      ...(replyTo ? { replyTo } : {}),
      ...(cc ? { cc } : {}),
      ...(bcc ? { bcc } : {}),
    });

    return { success: true, data };
  } catch (err: unknown) {
    console.error("[email] Send failed:", err);
    const message = err instanceof Error ? err.message : "Failed to send email";
    return { success: false, error: message };
  }
}
