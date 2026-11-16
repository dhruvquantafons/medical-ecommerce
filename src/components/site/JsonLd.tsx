/** Structured data for search engines. Not visible on the page. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  // Escape "<" so product text can never close the script element.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
