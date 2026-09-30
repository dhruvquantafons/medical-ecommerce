import { SearchX } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
      <SearchX className="size-14 text-gray-300" />
      <h1 className="text-xl font-bold">Page not found</h1>
      <p className="text-sm text-muted">The page or product you are looking for doesn&apos;t exist.</p>
      <ButtonLink href="/" className="mt-2">Back to home</ButtonLink>
    </div>
  );
}
