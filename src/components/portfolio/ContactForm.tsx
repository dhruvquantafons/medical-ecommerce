"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { submitPartnerInquiryAction } from "@/app/portfolio/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatefulButton } from "@/components/ui/stateful-button";
import { Textarea } from "@/components/ui/textarea";

export const audiences = ["Customer", "Doctor or pharmacist", "Distributor", "Other"] as const;

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\+?[\d\s()-]{7,20}$/.test(v), "Enter a valid phone number, or leave it empty."),
  audience: z.enum(audiences, { message: "Choose the option that describes you." }),
  message: z.string().trim().min(10, "Write a message of at least 10 characters."),
});

type Values = z.input<typeof schema>;

/*
 * Contact form (changeui.md Problem 15). It posts to the existing server action
 * (src/app/portfolio/actions.ts, unchanged): "I am a" goes in the action's organisation field and the
 * optional phone number is added to the top of the message, so no backend change is needed.
 * TODO(owner): confirm the inbox that receives these messages (EMAIL_ADMIN, or site.supportEmail).
 */
export function ContactForm({ defaultMessage = "" }: { defaultMessage?: string }) {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", audience: undefined, message: defaultMessage },
    mode: "onTouched",
  });

  async function onSubmit(v: Values) {
    setServerError("");
    const phone = v.phone?.trim();
    try {
      const res = await submitPartnerInquiryAction({
        name: v.name.trim(),
        email: v.email.trim(),
        pharmacyName: v.audience!,
        message: phone ? `Phone: ${phone}\n\n${v.message.trim()}` : v.message.trim(),
      });
      if (res.success) {
        setSent(true);
        form.reset();
      } else {
        setServerError(res.error || "Your message could not be sent. Please try again.");
      }
    } catch {
      setServerError("Your message could not be sent. Please check your connection and try again.");
    }
  }

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-start gap-3 rounded-card border border-line bg-background p-6 md:p-8">
        <CheckCircle2 aria-hidden className="size-8 text-success" />
        <h2 className="text-xl font-medium text-ink">Message sent</h2>
        <p className="text-[15px] text-ink-muted">Thank you. We have received your message and will reply by email.</p>
        <Button variant="outline" onClick={() => setSent(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  const { errors, isSubmitting } = form.formState;

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="rounded-card border border-line bg-background p-6 md:p-8">
      <FieldGroup className="gap-5">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="contact-name">Full name</FieldLabel>
          <Input id="contact-name" autoComplete="name" aria-invalid={!!errors.name} {...form.register("name")} />
          <FieldError errors={[errors.name]} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="contact-email">Email</FieldLabel>
            <Input id="contact-email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...form.register("email")} />
            <FieldError errors={[errors.email]} />
          </Field>
          <Field data-invalid={!!errors.phone}>
            <FieldLabel htmlFor="contact-phone">
              Phone <span className="font-normal text-ink-muted">(optional)</span>
            </FieldLabel>
            <Input id="contact-phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} {...form.register("phone")} />
            <FieldError errors={[errors.phone]} />
          </Field>
        </div>

        <Field data-invalid={!!errors.audience}>
          <FieldLabel htmlFor="contact-audience">I am a</FieldLabel>
          <Controller
            control={form.control}
            name="audience"
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger id="contact-audience" aria-invalid={!!errors.audience} onBlur={field.onBlur} className="w-full">
                  <SelectValue placeholder="Choose one" />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.audience]} />
        </Field>

        <Field data-invalid={!!errors.message}>
          <FieldLabel htmlFor="contact-message">Message</FieldLabel>
          <Textarea id="contact-message" rows={6} aria-invalid={!!errors.message} {...form.register("message")} />
          <FieldError errors={[errors.message]} />
        </Field>

        {serverError && (
          <p role="alert" className="rounded-control border border-danger/30 bg-danger/5 px-4 py-3 text-[15px] text-danger">
            {serverError}
          </p>
        )}

        <StatefulButton type="submit" size="lg" loading={isSubmitting} loadingLabel="Sending…" className="self-start">
          Send message
        </StatefulButton>
      </FieldGroup>
    </form>
  );
}
