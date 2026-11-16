import { SearchX } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { ButtonLink } from "@/components/ui/button";

/** Fallback for URLs outside the store layout (the store has its own not-found with full header). */
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
      <Logo />
      <SearchX className="mt-6 size-14 text-ink-subtle" />
      <h1 className="text-xl font-bold">Page not found</h1>
      <p className="text-sm text-muted-foreground">The page you are looking for doesn&apos;t exist.</p>
      <ButtonLink href="/" className="mt-2">Back to home</ButtonLink>
    </div>
  );
}
