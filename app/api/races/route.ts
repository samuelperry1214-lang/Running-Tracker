import { NextResponse } from 'next/server';
import { getSeededRaces, scrapeBritishAthleticsCalendar } from '@/lib/scrapers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const seeded = getSeededRaces();

  let live: typeof seeded = [];
  try {
    live = await scrapeBritishAthleticsCalendar();
  } catch (err) {
    console.error('BA calendar scrape failed:', err);
  }

  // Merge: seeded + live, deduplicate by name+date
  const seen = new Set<string>();
  const all = [...seeded, ...live].filter(r => {
    const key = `${r.name}|${r.date}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by date
  all.sort((a, b) => a.date.localeCompare(b.date));

  return NextResponse.json({ races: all, fetchedAt: new Date().toISOString() });
}
