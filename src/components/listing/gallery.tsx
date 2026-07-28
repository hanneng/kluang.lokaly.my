'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { MediaAsset } from '@/types/content';

/**
 * Image gallery with a lightbox.
 *
 * Thumbnails are lazy; only the lightbox image is loaded at full size, and only
 * once it is opened. Keyboard: arrows navigate, Escape closes.
 */
export function Gallery({ images, title }: { images: MediaAsset[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null ? null : (current + delta + images.length) % images.length,
      ),
    [images.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openIndex, close, step]);

  if (images.length === 0) return null;

  const active = openIndex === null ? null : images[openIndex];

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <li key={`${image.src}-${index}`}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-3"
              aria-label={`View image ${index + 1} of ${images.length}: ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} gallery`}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close gallery"
            className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="size-5" aria-hidden="true" />
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous image"
                className="absolute left-4 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
                aria-label="Next image"
                className="absolute right-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </>
          ) : null}

          <figure
            className="relative max-h-[85vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[3/2] w-full">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="100vw"
                className="rounded-xl object-contain"
              />
            </div>
            <figcaption className="mt-3 text-center text-sm text-white/70">
              {active.alt}
              {active.credit ? ` · ${active.credit}` : ''}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
