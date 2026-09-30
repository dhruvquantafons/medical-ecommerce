import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "./auth";

/** The current session (or null), cached for the duration of a request. */
export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

/** Redirects to /login (returning to `next` afterwards) when nobody is signed in. */
export async function requireUser(next: string) {
  const session = await getSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(next)}`);
  return session.user;
}

/** Admin-only pages and actions: anyone else gets a 404, so the admin area isn't advertised. */
export async function requireAdmin() {
  const session = await getSession();
  if (session?.user.role !== "admin") notFound();
  return session.user;
}

/** For server actions / route handlers that must not redirect. */
export async function currentUser() {
  return (await getSession())?.user ?? null;
}
