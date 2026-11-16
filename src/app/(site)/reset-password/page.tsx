import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Reset password", robots: { index: false } };

export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : "";
  const invalid = !token || sp.error;
  return (
    <AuthShell title="Set a new password" footer={<Link href="/login" className="font-semibold text-brand-700 hover:underline">Back to login</Link>}>
      {invalid ? (
        <p className="rounded-lg bg-red-50 px-3 py-3 text-sm text-red-700">
          This reset link is invalid or has expired.{" "}
          <Link href="/forgot-password" className="font-semibold underline">Request a new one</Link>.
        </p>
      ) : (
        <ResetPasswordForm token={token} />
      )}
    </AuthShell>
  );
}
