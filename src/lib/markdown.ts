/**
 * Minimal Markdown renderer for editorial bodies.
 *
 * Deliberately small and dependency-free. Input is HTML-escaped *first*, then a
 * fixed set of block and inline rules is applied, so authored content can never
 * inject markup — important once listings are editable by business owners.
 *
 * Supported: h2–h4, paragraphs, unordered/ordered lists, blockquote, hr,
 * bold, italic, inline code, links. Anything else renders as plain text.
 */

const escapeHtml = (input: string): string =>
  input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Only http(s), mailto, tel and site-relative links are allowed through. */
function safeHref(raw: string): string | null {
  const href = raw.trim();
  if (/^(https?:\/\/|mailto:|tel:|\/)/i.test(href)) return href;
  return null;
}

function renderInline(text: string): string {
  let out = text;

  // Links: [label](href)
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label: string, href: string) => {
    const safe = safeHref(href);
    if (!safe) return label;
    const external = /^https?:\/\//i.test(safe);
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${safe}"${attrs}>${label}</a>`;
  });

  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');

  return out;
}

export function renderMarkdown(input: string): string {
  const escaped = escapeHtml(input.replace(/\r\n/g, '\n'));
  const lines = escaped.split('\n');
  const html: string[] = [];

  let paragraph: string[] = [];
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let quote: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    html.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!listType || listItems.length === 0) return;
    const items = listItems.map((item) => `<li>${renderInline(item)}</li>`).join('');
    html.push(`<${listType}>${items}</${listType}>`);
    listItems = [];
    listType = null;
  };

  const flushQuote = () => {
    if (quote.length === 0) return;
    html.push(`<blockquote><p>${renderInline(quote.join(' '))}</p></blockquote>`);
    quote = [];
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
    flushQuote();
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.trim() === '') {
      flushAll();
      continue;
    }

    const heading = /^(#{2,4})\s+(.*)$/.exec(line);
    if (heading) {
      flushAll();
      const level = heading[1]!.length;
      html.push(`<h${level}>${renderInline(heading[2]!)}</h${level}>`);
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      flushAll();
      html.push('<hr />');
      continue;
    }

    const quoteMatch = /^&gt;\s?(.*)$/.exec(line);
    if (quoteMatch) {
      flushParagraph();
      flushList();
      quote.push(quoteMatch[1]!);
      continue;
    }

    const unordered = /^[-*]\s+(.*)$/.exec(line);
    if (unordered) {
      flushParagraph();
      flushQuote();
      if (listType !== 'ul') flushList();
      listType = 'ul';
      listItems.push(unordered[1]!);
      continue;
    }

    const ordered = /^\d+[.)]\s+(.*)$/.exec(line);
    if (ordered) {
      flushParagraph();
      flushQuote();
      if (listType !== 'ol') flushList();
      listType = 'ol';
      listItems.push(ordered[1]!);
      continue;
    }

    flushList();
    flushQuote();
    paragraph.push(line.trim());
  }

  flushAll();
  return html.join('\n');
}

/** Strip Markdown to plain text — used for meta descriptions and previews. */
export function markdownToText(input: string): string {
  return input
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
