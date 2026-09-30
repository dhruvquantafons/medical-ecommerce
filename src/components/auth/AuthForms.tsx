"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";
import { Field, FormError, PasswordField } from "./fields";

const email = z.string().trim().email("Enter a valid email address");
const password = z.string().min(8, "Password must be at least 8 characters");

type Errors = Record<string, string | undefined>;

function fieldErrors(result: { success: boolean; error?: z.ZodError }): Errors {
  if (result.success || !result.error) return {};
  return Object.fromEntries(result.error.issues.map((i) => [String(i.path[0]), i.message]));
}

function useSubmit() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function run(fn: () => Promise<string | null | void>) {
    setPending(true);
    setError(null);
    try {
      const message = await fn();
      if (message) setError(message);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }
  return { pending, error, run };
}

export function LoginForm({ next, notice }: { next: string; notice?: string }) {
  const router = useRouter();
  const { pending, error, run } = useSubmit();
  const [errors, setErrors] = useState<Errors>({});

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = z.object({ email, password: z.string().min(1, "Enter your password") }).safeParse(data);
    setErrors(fieldErrors(parsed));
    if (!parsed.success) return;
    run(async () => {
      const { error } = await authClient.signIn.email(parsed.data);
      if (error) return error.status === 401 ? "Incorrect email or password." : (error.message ?? "Could not sign in.");
      router.replace(next);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {notice && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-save">{notice}</p>}
      <FormError message={error} />
      <Field label="Email" name="email" type="email" autoComplete="email" error={errors.email} autoFocus />
      <PasswordField label="Password" name="password" autoComplete="current-password" error={errors.password} />
      <div className="text-right">
        <Link href="/forgot-password" className="text-xs font-semibold text-brand-700 hover:underline">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Log in"}
      </Button>
    </form>
  );
}

export function SignupForm({ next }: { next: string }) {
  const router = useRouter();
  const { pending, error, run } = useSubmit();
  const [errors, setErrors] = useState<Errors>({});

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = z.object({ name: z.string().trim().min(2, "Enter your full name").max(80), email, password }).safeParse(data);
    setErrors(fieldErrors(parsed));
    if (!parsed.success) return;
    run(async () => {
      const { error } = await authClient.signUp.email(parsed.data);
      if (error) return error.status === 422 ? "An account with this email already exists. Try logging in." : (error.message ?? "Could not create account.");
      router.replace(next);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <FormError message={error} />
      <Field label="Full name" name="name" autoComplete="name" error={errors.name} autoFocus />
      <Field label="Email" name="email" type="email" autoComplete="email" error={errors.email} />
      <PasswordField label="Password (min. 8 characters)" name="password" autoComplete="new-password" error={errors.password} />
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const { pending, error, run } = useSubmit();
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = z.object({ email }).safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    setErrors(fieldErrors(parsed));
    if (!parsed.success) return;
    run(async () => {
      const { error } = await authClient.requestPasswordReset({ email: parsed.data.email, redirectTo: "/reset-password" });
      if (error) return error.message ?? "Could not send reset link.";
      setSent(true);
    });
  }

  if (sent) {
    return (
      <p className="rounded-lg bg-green-50 px-3 py-3 text-sm text-save">
        If an account exists for that email, a password reset link is on its way. (Development: the link is printed in the server terminal.)
      </p>
    );
  }
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <FormError message={error} />
      <Field label="Email" name="email" type="email" autoComplete="email" error={errors.email} autoFocus />
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const { pending, error, run } = useSubmit();
  const [errors, setErrors] = useState<Errors>({});

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = z
      .object({ password, confirm: z.string() })
      .refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] })
      .safeParse(data);
    setErrors(fieldErrors(parsed));
    if (!parsed.success) return;
    run(async () => {
      const { error } = await authClient.resetPassword({ newPassword: parsed.data.password, token });
      if (error) return error.message ?? "This reset link is invalid or has expired.";
      router.replace("/login?reset=1");
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <FormError message={error} />
      <PasswordField label="New password (min. 8 characters)" name="password" autoComplete="new-password" error={errors.password} autoFocus />
      <PasswordField label="Confirm new password" name="confirm" autoComplete="new-password" error={errors.confirm} />
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Saving…" : "Set new password"}
      </Button>
    </form>
  );
}
