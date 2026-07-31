'use server';

import { z } from 'zod';
import { getTown } from '@/lib/town/context';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';
import { getPool, isPostgresConfigured } from '@/lib/db/pool';

export interface NewsletterState {
  status: 'idle' | 'success' | 'error';
  message?: string;
}

const schema = z.object({
  email: z.string().trim().toLowerCase().email('That does not look like a valid email address.'),
  // Honeypot: must be empty.
  company: z.string().max(0).optional().or(z.literal('')),
});

export async function subscribeToNewsletter(
  _previous: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = schema.safeParse({
    email: formData.get('email'),
    company: formData.get('company') ?? '',
  });

  if (!parsed.success) {
    // Bots that trip the honeypot get the success message, not a hint.
    if (formData.get('company')) return { status: 'success', message: 'Thanks — you are on the list.' };
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Please check the address and try again.',
    };
  }

  const town = await getTown();

  if (process.env.DATA_SOURCE === 'postgres' && isPostgresConfigured()) {
    try {
      await getPool().query(
        `insert into newsletter_subscribers (town_slug, email, source)
         values ($1, $2, 'website')
         on conflict (town_slug, email) do nothing`,
        [town.slug, parsed.data.email],
      );
    } catch (err) {
      console.error('[newsletter] subscribe failed', err);
      return { status: 'error', message: 'Something went wrong on our side. Please try again shortly.' };
    }
    return { status: 'success', message: 'Thanks — you are on the list.' };
  }

  if (!isSupabaseConfigured()) {
    // Development: no store configured. Say so honestly rather than pretending.
    console.info(`[newsletter] would subscribe ${parsed.data.email} to ${town.slug}`);
    return {
      status: 'success',
      message: 'Thanks — you are on the list. (Development mode: not actually stored.)',
    };
  }

  const { error } = await getSupabaseAdmin()
    .from('newsletter_subscribers')
    .upsert(
      { town_slug: town.slug, email: parsed.data.email, source: 'website' },
      { onConflict: 'town_slug,email', ignoreDuplicates: true },
    );

  if (error) {
    console.error('[newsletter] subscribe failed', error);
    return { status: 'error', message: 'Something went wrong on our side. Please try again shortly.' };
  }

  return { status: 'success', message: 'Thanks — you are on the list.' };
}
