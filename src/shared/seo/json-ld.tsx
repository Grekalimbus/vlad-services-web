export function JsonLd({ data }: { data: unknown }) {
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) return null;
  return (
    <script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
