import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { getTown } from '@/lib/town/context';

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'revalidation not configured' }, { status: 503 });
  }
  if (request.headers.get('x-revalidate-secret') !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let tag: string | undefined;
  try {
    const body = await request.json();
    if (body && typeof body.tag === 'string') tag = body.tag;
  } catch {
    // No/invalid body
  }

  const town = await getTown();
  const target = tag ?? `town:${town.slug}`;
  revalidateTag(target);

  return NextResponse.json({ revalidated: true, tag: target, now: Date.now() });
}
