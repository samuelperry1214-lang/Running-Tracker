import * as cheerio from 'cheerio';
import { XMLParser } from 'fast-xml-parser';
import { NewsItem, Race, RaceResult, ResultEntry, Discipline } from './types';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function fetchText(url: string, timeoutMs = 12000): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' },
    signal: AbortSignal.timeout(timeoutMs),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

// ─── RSS helper ──────────────────────────────────────────────────────────────
function parseRSS(xml: string, source: NewsItem['source']): NewsItem[] {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const feed = parser.parse(xml);
  const channel = feed?.rss?.channel ?? feed?.feed;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawItems: Record<string, any>[] = Array.isArray(channel?.item)
    ? channel.item
    : channel?.item
    ? [channel.item]
    : Array.isArray(channel?.entry)
    ? channel.entry
    : channel?.entry
    ? [channel.entry]
    : [];

  return rawItems.slice(0, 20).map((item, i) => {
    const title = String(item.title ?? '');
    const link = String(item.link?.['#text'] ?? item.link ?? item.guid ?? '');
    const pubDate = String(item.pubDate ?? item.published ?? item.updated ?? new Date().toISOString());
    const summary = String(item.description ?? item.summary ?? item['media:description'] ?? '').replace(/<[^>]+>/g, '').slice(0, 280);
    const imageUrl = (item['media:thumbnail'] as { '@_url'?: string } | undefined)?.['@_url'] ??
      (item['media:content'] as { '@_url'?: string } | undefined)?.['@_url'] ??
      undefined;

    const parsedDate = new Date(pubDate);
    const isoDate = isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();

    return {
      id: `${source}-${i}-${Date.now()}`,
      title: title.replace(/<[^>]+>/g, '').trim(),
      summary: summary.trim() || undefined,
      url: link,
      source,
      publishedAt: isoDate,
      imageUrl,
    } as NewsItem;
  }).filter(n => n.title.length > 3);
}

// ─── NEWS SCRAPERS ────────────────────────────────────────────────────────────

export async function scrapeBBCNews(): Promise<NewsItem[]> {
  const xml = await fetchText('https://feeds.bbci.co.uk/sport/athletics/rss.xml');
  return parseRSS(xml, 'BBC');
}

export async function scrapeGuardianNews(): Promise<NewsItem[]> {
  const xml = await fetchText('https://www.theguardian.com/sport/athletics/rss');
  return parseRSS(xml, 'Guardian');
}

export async function scrapeAthleticsWeeklyNews(): Promise<NewsItem[]> {
  const xml = await fetchText('https://athleticsweekly.com/feed/');
  return parseRSS(xml, 'Athletics Weekly');
}

export async function scrapeAllNews(): Promise<NewsItem[]> {
  const results = await Promise.allSettled([
    scrapeBBCNews(),
    scrapeGuardianNews(),
    scrapeAthleticsWeeklyNews(),
  ]);

  const items: NewsItem[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') items.push(...r.value);
  }

  // Sort newest first
  return items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// ─── RACE CALENDAR ───────────────────────────────────────────────────────────

// Known major events seeded — supplements live scraping
export function getSeededRaces(): Race[] {
  return [
    {
      id: 'wic-2026',
      name: 'World Indoor Athletics Championships',
      date: '2026-03-20', endDate: '2026-03-22',
      location: 'Nanjing', country: 'China',
      disciplines: ['800m', '1500m', 'Mile', '3000m', '5000m', '400m', '400m H'],
      level: 'world_athletics_series',
      url: 'https://worldathletics.org',
      broadcastInfo: 'BBC iPlayer / Eurosport',
      source: 'seeded',
    },
    {
      id: 'london-marathon-2026',
      name: 'TCS London Marathon',
      date: '2026-04-26',
      location: 'London', country: 'UK',
      disciplines: ['Marathon'],
      level: 'world_majors',
      url: 'https://www.virginmoneylondonmarathon.com',
      broadcastInfo: 'BBC One from 09:00',
      source: 'seeded',
    },
    {
      id: 'bath-half-2026',
      name: 'Bath Half Marathon',
      date: '2026-03-15',
      location: 'Bath', country: 'UK',
      disciplines: ['Half Marathon'],
      level: 'road',
      url: 'https://www.bathhalf.co.uk',
      broadcastInfo: 'No broadcast – live results at Power of 10',
      source: 'seeded',
    },
    {
      id: 'great-city-games-2026',
      name: 'Great City Games Manchester',
      date: '2026-05-16',
      location: 'Manchester', country: 'UK',
      disciplines: ['Mile', '1500m', '800m'],
      level: 'uk_athletics',
      broadcastInfo: 'Channel 4 / More4',
      source: 'seeded',
    },
    {
      id: 'dl-doha-2026',
      name: 'Diamond League – Doha',
      date: '2026-05-15',
      location: 'Doha', country: 'Qatar',
      disciplines: ['800m', '1500m', 'Mile', '5000m', '400m H'],
      level: 'diamond_league',
      broadcastInfo: 'Discovery+ / Eurosport',
      source: 'seeded',
    },
    {
      id: 'dl-oslo-2026',
      name: 'Diamond League – Oslo (Bislett Games)',
      date: '2026-05-28',
      location: 'Oslo', country: 'Norway',
      disciplines: ['800m', '1500m', 'Mile', '5000m', '10000m', '400m H', 'Steeplechase'],
      level: 'diamond_league',
      broadcastInfo: 'Discovery+ / Eurosport',
      source: 'seeded',
    },
    {
      id: 'dl-rome-2026',
      name: 'Diamond League – Rome (Golden Gala)',
      date: '2026-06-11',
      location: 'Rome', country: 'Italy',
      disciplines: ['800m', '1500m', '5000m', '10000m', '400m H'],
      level: 'diamond_league',
      broadcastInfo: 'Discovery+ / Eurosport',
      source: 'seeded',
    },
    {
      id: 'dl-paris-2026',
      name: 'Diamond League – Paris',
      date: '2026-07-03',
      location: 'Paris', country: 'France',
      disciplines: ['800m', '1500m', 'Mile', '5000m', '400m H'],
      level: 'diamond_league',
      broadcastInfo: 'Discovery+ / Eurosport',
      source: 'seeded',
    },
    {
      id: 'british-champs-2026',
      name: 'British Athletics Championships',
      date: '2026-06-27', endDate: '2026-06-28',
      location: 'Manchester', country: 'UK',
      disciplines: ['800m', '1500m', 'Mile', '5000m', '10000m', '400m', '400m H'],
      level: 'national_championship',
      broadcastInfo: 'BBC Two / BBC iPlayer',
      source: 'seeded',
    },
    {
      id: 'great-north-run-2026',
      name: 'Great North Run',
      date: '2026-09-13',
      location: 'Newcastle-South Shields', country: 'UK',
      disciplines: ['Half Marathon'],
      level: 'road',
      url: 'https://www.greatrun.org/great-north-run',
      broadcastInfo: 'BBC One from 10:30',
      source: 'seeded',
    },
    {
      id: 'berlin-marathon-2026',
      name: 'BMW Berlin Marathon',
      date: '2026-09-27',
      location: 'Berlin', country: 'Germany',
      disciplines: ['Marathon'],
      level: 'world_majors',
      broadcastInfo: 'Eurosport / RBB live stream',
      source: 'seeded',
    },
    {
      id: 'chicago-marathon-2026',
      name: 'Chicago Marathon',
      date: '2026-10-11',
      location: 'Chicago', country: 'USA',
      disciplines: ['Marathon'],
      level: 'world_majors',
      broadcastInfo: 'WGN America / FloTrack',
      source: 'seeded',
    },
    {
      id: 'new-york-marathon-2026',
      name: 'TCS New York City Marathon',
      date: '2026-11-01',
      location: 'New York', country: 'USA',
      disciplines: ['Marathon'],
      level: 'world_majors',
      broadcastInfo: 'ESPN / FloTrack',
      source: 'seeded',
    },
    {
      id: 'dl-london-2026',
      name: 'Diamond League – London (Anniversary Games)',
      date: '2026-07-18', endDate: '2026-07-19',
      location: 'London', country: 'UK',
      disciplines: ['800m', '1500m', 'Mile', '5000m', '10000m', '400m H', 'Steeplechase'],
      level: 'diamond_league',
      broadcastInfo: 'BBC Two / BBC iPlayer',
      source: 'seeded',
    },
    {
      id: 'dl-monaco-2026',
      name: 'Diamond League – Monaco (Herculis)',
      date: '2026-07-11',
      location: 'Monaco', country: 'Monaco',
      disciplines: ['1500m', 'Mile', '5000m', '400m H'],
      level: 'diamond_league',
      broadcastInfo: 'Discovery+ / Eurosport',
      source: 'seeded',
    },
    {
      id: 'european-champs-2026',
      name: 'European Athletics Championships',
      date: '2026-08-11', endDate: '2026-08-16',
      location: 'Madrid', country: 'Spain',
      disciplines: ['800m', '1500m', 'Mile', '5000m', '10000m', 'Marathon', 'Half Marathon', '400m H', 'Steeplechase'],
      level: 'world_athletics_series',
      broadcastInfo: 'BBC iPlayer / Eurosport',
      source: 'seeded',
    },
    {
      id: 'uk-road-relays-2026',
      name: 'UK Road Relays',
      date: '2026-04-18',
      location: 'Sutton Coldfield', country: 'UK',
      disciplines: ['Road'],
      level: 'national_championship',
      source: 'seeded',
    },
    {
      id: 'edinburgh-marathon-2026',
      name: 'Edinburgh Marathon Festival',
      date: '2026-05-24',
      location: 'Edinburgh', country: 'UK',
      disciplines: ['Marathon', 'Half Marathon'],
      level: 'road',
      source: 'seeded',
    },
    {
      id: 'manchester-marathon-2026',
      name: 'Asda Foundation Manchester Marathon',
      date: '2026-04-05',
      location: 'Manchester', country: 'UK',
      disciplines: ['Marathon'],
      level: 'road',
      source: 'seeded',
    },
  ];
}

// Scrape British Athletics competition calendar
export async function scrapeBritishAthleticsCalendar(): Promise<Race[]> {
  const html = await fetchText('https://www.britishathletics.org.uk/competitions/');
  const $ = cheerio.load(html);
  const races: Race[] = [];

  // Try various selectors BA uses
  const selectors = ['.competition-item', '.event-item', '.fixture', 'article', '.card'];
  for (const sel of selectors) {
    if ($(sel).length > 0) {
      $(sel).each((i, el) => {
        const name = $(el).find('h2, h3, .title, .name').first().text().trim();
        const dateText = $(el).find('.date, time, [datetime]').first().attr('datetime') ?? $(el).find('.date').first().text().trim();
        const location = $(el).find('.location, .venue').first().text().trim();
        const url = $(el).find('a').first().attr('href');

        if (!name) return;

        const parsed = new Date(dateText);
        const date = isNaN(parsed.getTime())
          ? new Date().toISOString().split('T')[0]
          : parsed.toISOString().split('T')[0];

        races.push({
          id: `ba-${i}`,
          name,
          date,
          location: location || 'UK',
          country: 'UK',
          disciplines: ['800m', '1500m', '5000m'],
          level: 'uk_athletics',
          url: url ? (url.startsWith('http') ? url : `https://www.britishathletics.org.uk${url}`) : undefined,
          source: 'British Athletics',
        });
      });
      if (races.length > 0) break;
    }
  }

  return races;
}

// ─── POWER OF 10 RESULTS ──────────────────────────────────────────────────────

function disciplineFromString(s: string): Discipline {
  const map: Record<string, Discipline> = {
    '800': '800m', '1500': '1500m', 'mile': 'Mile', 'mi': 'Mile',
    '3000': '3000m', '5000': '5000m', '10000': '10000m',
    'hm': 'Half Marathon', 'half': 'Half Marathon',
    'mar': 'Marathon', 'marathon': 'Marathon',
    'steeple': 'Steeplechase', 'sc': 'Steeplechase',
    'xc': 'Cross Country',
    '400h': '400m H', '110h': '110m H',
  };
  const lower = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [k, v] of Object.entries(map)) {
    if (lower.includes(k)) return v;
  }
  return 'Road';
}

export async function scrapePo10RecentMeetings(days = 7): Promise<{ name: string; id: string; date: string }[]> {
  const today = new Date();
  const from = new Date(today);
  from.setDate(today.getDate() - days);

  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}%2F${String(d.getMonth() + 1).padStart(2, '0')}%2F${d.getFullYear()}`;

  const url = `https://www.thepowerof10.info/results/resultslookup.aspx?datefrom=${fmt(from)}&dateto=${fmt(today)}`;
  const html = await fetchText(url);
  const $ = cheerio.load(html);

  const meetings: { name: string; id: string; date: string }[] = [];

  $('a[href*="meetingid="]').each((_, el) => {
    const href = $(el).attr('href') ?? '';
    const match = href.match(/meetingid=(\d+)/i);
    if (!match) return;
    const name = $(el).text().trim();
    if (!name) return;
    meetings.push({ name, id: match[1], date: today.toISOString().split('T')[0] });
  });

  return meetings;
}

export async function scrapePo10MeetingResults(meetingId: string): Promise<RaceResult[]> {
  const url = `https://www.thepowerof10.info/results/results.aspx?meetingid=${meetingId}`;
  const html = await fetchText(url);
  const $ = cheerio.load(html);

  const results: RaceResult[] = [];

  // Po10 uses tables with event headers
  let currentEvent = 'Road';
  let currentGender: 'M' | 'F' | 'Mixed' = 'M';

  $('table').each((ti, table) => {
    // Look for event header row
    const header = $(table).find('tr').first().text().trim();
    if (/^\d|[MF]\s/i.test(header)) {
      const entries: ResultEntry[] = [];

      $(table).find('tr').each((ri, row) => {
        if (ri === 0) return; // skip header row
        const cells = $(row).find('td');
        if (cells.length < 3) return;

        const pos = $(cells[0]).text().trim();
        const name = $(cells[1]).text().trim();
        const perf = $(cells[2]).text().trim();
        if (!name || !perf) return;

        entries.push({
          position: isNaN(Number(pos)) ? pos : Number(pos),
          athleteName: name,
          performance: perf,
        });
      });

      if (entries.length > 0) {
        results.push({
          id: `po10-${meetingId}-${ti}`,
          raceName: currentEvent,
          date: new Date().toISOString().split('T')[0],
          location: 'UK',
          discipline: disciplineFromString(currentEvent),
          gender: currentGender,
          results: entries,
          source: 'Power of 10',
          url,
          meetingId,
        });
      }
    } else {
      currentEvent = header || currentEvent;
      currentGender = header.includes(' W ') || header.startsWith('W ') ? 'F' : 'M';
    }
  });

  // Fallback: try .divResultsWindowContents
  if (results.length === 0) {
    const entries: ResultEntry[] = [];
    $('td').each((_, td) => {
      const text = $(td).text().trim();
      if (/^\d+:\d+/.test(text) || /^\d+\.\d+/.test(text)) {
        // performance cell
        const row = $(td).closest('tr');
        const cells = row.find('td');
        if (cells.length >= 3) {
          entries.push({
            position: $(cells[0]).text().trim(),
            athleteName: $(cells[1]).text().trim(),
            performance: text,
          });
        }
      }
    });
    if (entries.length > 0) {
      results.push({
        id: `po10-${meetingId}-fallback`,
        raceName: 'Race Results',
        date: new Date().toISOString().split('T')[0],
        location: 'UK',
        discipline: 'Road',
        results: entries,
        source: 'Power of 10',
        url,
        meetingId,
      });
    }
  }

  return results;
}

export async function scrapeAthleteRecentResults(athleteName: string): Promise<{ pos: string; perf: string; event: string; meeting: string; date: string; url: string }[]> {
  const [surname, ...rest] = athleteName.split(' ').reverse();
  const firstname = rest.reverse().join(' ');
  const searchUrl = `https://www.thepowerof10.info/athletes/athleteslookup.aspx?surname=${encodeURIComponent(surname)}&firstname=${encodeURIComponent(firstname)}`;
  const html = await fetchText(searchUrl);
  const $ = cheerio.load(html);

  // Get first athlete profile link
  const profileLink = $('a[href*="profile.aspx?athleteid="]').first().attr('href');
  if (!profileLink) return [];

  const profileUrl = profileLink.startsWith('http')
    ? profileLink
    : `https://www.thepowerof10.info${profileLink}`;

  const profileHtml = await fetchText(profileUrl);
  const $p = cheerio.load(profileHtml);

  const results: { pos: string; perf: string; event: string; meeting: string; date: string; url: string }[] = [];

  $p('table tr').each((_, row) => {
    const cells = $p(row).find('td');
    if (cells.length < 5) return;
    const pos = $p(cells[0]).text().trim();
    const perf = $p(cells[1]).text().trim();
    const event = $p(cells[2]).text().trim();
    const meeting = $p(cells[4]).text().trim();
    const date = $p(cells[5]).text().trim();
    if (!perf || !event) return;
    results.push({ pos, perf, event, meeting, date, url: profileUrl });
  });

  return results.slice(0, 10);
}
