import { NextResponse } from 'next/server';
import { scrapePo10RecentMeetings, scrapePo10MeetingResults } from '@/lib/scrapers';
import { RaceResult } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get('days') ?? '14', 10);
  const meetingId = searchParams.get('meetingId');

  try {
    if (meetingId) {
      const results = await scrapePo10MeetingResults(meetingId);
      return NextResponse.json({ results, fetchedAt: new Date().toISOString() });
    }

    const meetings = await scrapePo10RecentMeetings(days);
    // Fetch results for up to 5 most recent meetings in parallel
    const top = meetings.slice(0, 5);
    const settled = await Promise.allSettled(
      top.map(m => scrapePo10MeetingResults(m.id).then(results => ({ meeting: m, results })))
    );

    const groups: { meeting: { name: string; id: string; date: string }; results: RaceResult[] }[] = [];
    for (const s of settled) {
      if (s.status === 'fulfilled') groups.push(s.value);
    }

    return NextResponse.json({
      meetings: top,
      groups,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Results fetch error:', err);
    return NextResponse.json({ meetings: [], groups: [], error: String(err), fetchedAt: new Date().toISOString() }, { status: 200 });
  }
}
