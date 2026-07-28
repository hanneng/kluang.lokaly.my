import { renderMarkdown } from '@/lib/markdown';
import { cn } from '@/lib/utils';

/**
 * Renders an editorial Markdown body.
 *
 * `dangerouslySetInnerHTML` is safe here because `renderMarkdown` escapes all
 * input before applying its own fixed rule set — see `src/lib/markdown.ts`.
 */
export function Prose({ body, className }: { body: string; className?: string }) {
  return (
    <div
      className={cn('prose', className)}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
    />
  );
}
