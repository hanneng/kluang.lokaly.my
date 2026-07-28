'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

/**
 * Client providers.
 *
 * Kept to a single component so the server layout stays a server component and
 * the client boundary is explicit and small.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      // Colour transitions during a theme swap look like a bug, not a feature.
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
