import nodemailer from "nodemailer";
import { site } from "@/config/site";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

/**
 * Creates and caches the Nodemailer transporter using SMTP environment variables.
 * If credentials are not yet provided, logs a message in development mode.
 */
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465 (SSL), false for 587 / STARTTLS
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Universal email dispatch utility for the platform.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const transporter = getTransporter();
  const fromAddress = process.env.EMAIL_FROM || `${site.name} <no-reply@syncytiumhealth.com>`;

  if (!transporter) {
    console.warn(
      `\n⚠️ [EMAIL SERVICE - SMTP PENDING] SMTP credentials not fully configured in environment.\n` +
      `-> To: ${Array.isArray(to) ? to.join(", ") : to}\n` +
      `-> Subject: ${subject}\n` +
      `-> HTML length: ${html.length} chars\n`
    );
    return {
      success: true,
      messageId: "dev-simulated-message-id",
    };
  }

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, " "),
      html,
      replyTo,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("[EMAIL SERVICE] Failed to send email via SMTP:", error);
    return { success: false, error: error?.message || "Unknown SMTP error" };
  }
}
