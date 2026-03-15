import { NextResponse } from 'next/server';
import { scrapeAllNews } from '@/lib/scrapers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const news = await scrapeAllNews();
    return NextResponse.json({ news, fetchedAt: new Date().toISOString() });
  } catch (err) {
    console.error('News fetch error:', err);
    return NextResponse.json({ news: [], error: String(err), fetchedAt: new Date().toISOString() }, { status: 200 });
  }
}
