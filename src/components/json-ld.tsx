/**
 * Emits JSON-LD. Rendered from a server component so the markup is in
 * the initial HTML where crawlers and answer engines can read it without
 * executing JavaScript.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Escape `<` so no sequence can prematurely close the script tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
