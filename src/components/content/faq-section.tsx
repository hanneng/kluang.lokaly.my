import type { FaqItem } from '@/types/content';

/**
 * FAQ accordion.
 *
 * Native `<details>` so it works without JavaScript and stays open when a
 * visitor uses in-page find. The matching FAQPage JSON-LD is emitted by the
 * page from the same array.
 */
export function FaqSection({
  faqs,
  title = 'Frequently asked questions',
}: {
  faqs: FaqItem[];
  title?: string;
}) {
  if (faqs.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="mb-4 text-2xl font-bold">
        {title}
      </h2>

      <div className="divide-y divide-[var(--line)] overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-2">
        {faqs.map((faq) => (
          <details key={faq.question} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium hover:bg-surface-3">
              {faq.question}
              <span
                aria-hidden="true"
                className="shrink-0 text-xl text-ink-subtle transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="px-5 pb-5 pt-0 text-ink-muted">{faq.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
