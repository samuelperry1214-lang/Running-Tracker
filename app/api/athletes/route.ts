import { NextResponse } from 'next/server';
import { SEED_ATHLETES } from '@/lib/athletes-seed';
import { Athlete } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const KV_KEY = 'running-tracker:athletes';

// Lazy-load Vercel KV so the app works without it (falls back gracefully)
async function kvGet(): Promise<Athlete[] | null> {
  try {
    const { kv } = await import('@vercel/kv');
    return await kv.get<Athlete[]>(KV_KEY);
  } catch {
    return null;
  }
}

async function kvSet(athletes: Athlete[]): Promise<void> {
  try {
    const { kv } = await import('@vercel/kv');
    await kv.set(KV_KEY, athletes);
  } catch {
    // KV not configured — client will use localStorage fallback
  }
}

export async function GET() {
  const stored = await kvGet();
  const athletes = stored ?? SEED_ATHLETES;
  return NextResponse.json({ athletes, source: stored ? 'kv' : 'seed' });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const athletes: Athlete[] = Array.isArray(body.athletes) ? body.athletes : SEED_ATHLETES;
    await kvSet(athletes);
    return NextResponse.json({ ok: true, count: athletes.length });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
