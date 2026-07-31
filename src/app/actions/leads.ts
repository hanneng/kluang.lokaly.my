'use server';

import { z } from 'zod';
import { getTown } from '@/lib/town/context';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';
import { getPool, isPostgresConfigured } from '@/lib/db/pool';

export interface LeadState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  /** Field-level errors, keyed by input name. */
  errors?: Record<string, string>;
}

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(120),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address.'),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  business: z.string().trim().max(160).optional().or(z.literal('')),
  packageId: z.enum(['featured', 'premium', 'sponsoredArticle', 'other']).optional(),
  message: z.string().trim().min(10, 'Tell us a little more — at least 10 characters.').max(4000),
  company: z.string().max(0).optional().or(z.literal('')),
});

/**
 * Handles both the Advertise and Contact forms.
 *
 * Stores the enquiry; it does not send email. Notifying the sales inbox is a
 * separate, deliberate step (a Supabase trigger or a scheduled job) so that a
 * form submission can never fire outbound mail on its own.
 */
export async function submitLead(_previous: LeadState, formData: FormData): Promise<LeadState> {
  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') ?? '',
    business: formData.get('business') ?? '',
    packageId: formData.get('packageId') ?? undefined,
    message: formData.get('message'),
    company: formData.get('company') ?? '',
  });

  if (!parsed.success) {
    if (formData.get('company')) return { status: 'success', message: 'Thanks — we will be in touch.' };

    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === 'string' && !errors[key]) errors[key] = issue.message;
    }
    return { status: 'error', message: 'Please fix the highlighted fields.', errors };
  }

  const town = await getTown();
  const kind = formData.get('kind') === 'advertise' ? 'advertise' : 'contact';

  if (process.env.DATA_SOURCE === 'postgres' && isPostgresConfigured()) {
    try {
      await getPool().query(
        `insert into leads (town_slug, kind, name, email, phone, business_name, package_id, message)
         values ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          town.slug,
          kind,
          parsed.data.name,
          parsed.data.email,
          parsed.data.phone || null,
          parsed.data.business || null,
          parsed.data.packageId ?? null,
          parsed.data.message,
        ],
      );
    } catch (err) {
      console.error('[lead] insert failed', err);
      return {
        status: 'error',
        message: 'Something went wrong on our side. Please email us directly instead.',
      };
    }
    return {
      status: 'success',
      message: 'Thanks — we have your enquiry and will reply within two working days.',
    };
  }

  if (!isSupabaseConfigured()) {
    console.info(`[lead:${kind}] ${town.slug}`, { ...parsed.data, company: undefined });
    return {
      status: 'success',
      message: 'Thanks — we have your message. (Development mode: not actually stored.)',
    };
  }

  const { error } = await getSupabaseAdmin().from('leads').insert({
    town_slug: town.slug,
    kind,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    business_name: parsed.data.business || null,
    package_id: parsed.data.packageId ?? null,
    message: parsed.data.message,
  });

  if (error) {
    console.error('[lead] insert failed', error);
    return {
      status: 'error',
      message: 'Something went wrong on our side. Please email us directly instead.',
    };
  }

  return {
    status: 'success',
    message: 'Thanks — we have your enquiry and will reply within two working days.',
  };
}
