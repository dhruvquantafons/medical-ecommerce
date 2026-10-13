"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/mail";
import {
  getPartnerInquiryAdminEmail,
  getPartnerInquiryUserConfirmationEmail,
} from "@/lib/email-templates";
import { site } from "@/config/site";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please provide a valid email address"),
  pharmacyName: z.string().trim().min(2, "Pharmacy name is required"),
  message: z.string().trim().optional(),
});

export type ContactFormState = {
  success?: boolean;
  error?: string;
};

export async function submitPartnerInquiryAction(
  formData: { name: string; email: string; pharmacyName: string; message?: string }
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse(formData);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Invalid input";
    return { success: false, error: firstError };
  }

  const { name, email, pharmacyName, message } = parsed.data;

  // 1. Notify internal staff / admin
  const adminRecipient = process.env.EMAIL_ADMIN?.trim() || site.supportEmail;
  await sendEmail({
    to: adminRecipient,
    subject: `[Partner Inquiry] ${pharmacyName} — ${name}`,
    html: getPartnerInquiryAdminEmail({ name, email, pharmacyName, message }),
    replyTo: email,
  });

  // 2. Send acknowledgment to the requester
  await sendEmail({
    to: email,
    subject: `Thank you for contacting ${site.name}`,
    html: getPartnerInquiryUserConfirmationEmail({ name }),
  });

  return { success: true };
}
