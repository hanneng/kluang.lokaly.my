/**
 * Emits JSON-LD.
 *
 * `null` entries are dropped so callers can pass conditional builders (e.g.
 * `faqJsonLd()` returns null when there are no FAQs) without guarding.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | null | Array<Record<string, unknown> | null> }) {
  const nodes = (Array.isArray(data) ? data : [data]).filter(
    (node): node is Record<string, unknown> => node !== null,
  );

  if (nodes.length === 0) return null;

  return (
    <>
      {nodes.map((node, index) => (
        <script
          key={index}
          type="application/ld+json"
          // JSON.stringify output is escaped for the one character that can
          // break out of a <script> block.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(node).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  );
}
