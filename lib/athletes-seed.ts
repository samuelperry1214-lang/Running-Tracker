import { Athlete } from './types';

export const SEED_ATHLETES: Athlete[] = [
  // ─── BRITISH MEN: 800m ───────────────────────────────────────────────────
  {
    id: 'max-burgin',
    name: 'Max Burgin',
    nationality: 'GB', gender: 'M',
    disciplines: ['800m'],
    homeNation: 'ENG', active: true, marquee: true,
  },
  {
    id: 'ben-pattison',
    name: 'Ben Pattison',
    nationality: 'GB', gender: 'M',
    disciplines: ['800m', '1500m'],
    homeNation: 'ENG', active: true, marquee: true,
  },
  {
    id: 'daniel-rowden',
    name: 'Daniel Rowden',
    nationality: 'GB', gender: 'M',
    disciplines: ['800m'],
    homeNation: 'ENG', active: true,
  },
  {
    id: 'elliot-giles',
    name: 'Elliot Giles',
    nationality: 'GB', gender: 'M',
    disciplines: ['800m'],
    homeNation: 'ENG', active: true, marquee: true,
  },
  {
    id: 'jamie-webb',
    name: 'Jamie Webb',
    nationality: 'GB', gender: 'M',
    disciplines: ['800m'],
    homeNation: 'WAL', active: true,
  },
  {
    id: 'oliver-dustin',
    name: 'Oliver Dustin',
    nationality: 'GB', gender: 'M',
    disciplines: ['800m', '1500m'],
    homeNation: 'ENG', active: true,
  },
  {
    id: 'callum-elson',
    name: 'Callum Elson',
    nationality: 'GB', gender: 'M',
    disciplines: ['800m'],
    homeNation: 'ENG', active: true,
  },
  {
    id: 'jack-crabtree',
    name: 'Jack Crabtree',
    nationality: 'GB', gender: 'M',
    disciplines: ['800m'],
    homeNation: 'ENG', active: true,
  },
  {
    id: 'scott-beattie',
    name: 'Scott Beattie',
    nationality: 'GB', gender: 'M',
    disciplines: ['800m'],
    homeNation: 'SCO', active: true,
  },
  {
    id: 'kyle-langford',
    name: 'Kyle Langford',
    nationality: 'GB', gender: 'M',
    disciplines: ['800m'],
    homeNation: 'ENG', active: true,
  },
  // Wheeler twins – please verify correct first names / Po10 IDs
  {
    id: 'wheeler-twin-1',
    name: 'Wheeler Twin 1',
    nationality: 'GB', gender: 'M',
    disciplines: ['800m'],
    homeNation: 'ENG', active: true,
    notes: 'Please update name via Athletes tab',
  },
  {
    id: 'wheeler-twin-2',
    name: 'Wheeler Twin 2',
    nationality: 'GB', gender: 'M',
    disciplines: ['800m'],
    homeNation: 'ENG', active: true,
    notes: 'Please update name via Athletes tab',
  },

  // ─── BRITISH MEN: 1500m / Mile ───────────────────────────────────────────
  {
    id: 'josh-kerr',
    name: 'Josh Kerr',
    nationality: 'GB', gender: 'M',
    disciplines: ['1500m', 'Mile', '3000m'],
    homeNation: 'SCO', active: true, marquee: true,
  },
  {
    id: 'jake-wightman',
    name: 'Jake Wightman',
    nationality: 'GB', gender: 'M',
    disciplines: ['1500m', 'Mile'],
    homeNation: 'SCO', active: true, marquee: true,
  },
  {
    id: 'neil-gourley',
    name: 'Neil Gourley',
    nationality: 'GB', gender: 'M',
    disciplines: ['1500m', 'Mile'],
    homeNation: 'SCO', active: true,
  },
  {
    id: 'george-mills',
    name: 'George Mills',
    nationality: 'GB', gender: 'M',
    disciplines: ['1500m', 'Mile', '5000m'],
    homeNation: 'ENG', active: true,
  },
  {
    id: 'charlie-grice',
    name: "Charlie Da'Vall Grice",
    nationality: 'GB', gender: 'M',
    disciplines: ['1500m', 'Mile', '5000m'],
    homeNation: 'ENG', active: true,
  },
  {
    id: 'piers-copeland',
    name: 'Piers Copeland',
    nationality: 'GB', gender: 'M',
    disciplines: ['1500m', '5000m'],
    homeNation: 'ENG', active: true,
  },

  // ─── BRITISH MEN: 5000m / 10000m ─────────────────────────────────────────
  {
    id: 'marc-scott',
    name: 'Marc Scott',
    nationality: 'GB', gender: 'M',
    disciplines: ['5000m', '10000m', 'Half Marathon'],
    homeNation: 'ENG', active: true, marquee: true,
  },
  {
    id: 'jack-rowe',
    name: 'Jack Rowe',
    nationality: 'GB', gender: 'M',
    disciplines: ['5000m', '10000m'],
    homeNation: 'ENG', active: true,
  },
  {
    id: 'patrick-dever',
    name: 'Patrick Dever',
    nationality: 'GB', gender: 'M',
    disciplines: ['5000m', '10000m'],
    homeNation: 'SCO', active: true,
  },
  {
    id: 'andrew-butchart',
    name: 'Andrew Butchart',
    nationality: 'GB', gender: 'M',
    disciplines: ['5000m', '10000m'],
    homeNation: 'SCO', active: true,
  },
  {
    id: 'tom-mortimer',
    name: 'Tom Mortimer',
    nationality: 'GB', gender: 'M',
    disciplines: ['5000m', '10000m'],
    homeNation: 'ENG', active: true,
  },

  // ─── BRITISH MEN: Marathon / Road ────────────────────────────────────────
  {
    id: 'emile-cairess',
    name: 'Emile Cairess',
    nationality: 'GB', gender: 'M',
    disciplines: ['5000m', '10000m', 'Half Marathon', 'Marathon'],
    homeNation: 'ENG', active: true, marquee: true, contractPro: true,
  },
  {
    id: 'phil-sesemann',
    name: 'Phil Sesemann',
    nationality: 'GB', gender: 'M',
    disciplines: ['Half Marathon', 'Marathon'],
    homeNation: 'ENG', active: true, contractPro: true,
  },
  {
    id: 'jake-smith',
    name: 'Jake Smith',
    nationality: 'GB', gender: 'M',
    disciplines: ['Half Marathon', 'Marathon'],
    homeNation: 'WAL', active: true, contractPro: true,
  },
  {
    id: 'callum-hawkins',
    name: 'Callum Hawkins',
    nationality: 'GB', gender: 'M',
    disciplines: ['Half Marathon', 'Marathon'],
    homeNation: 'SCO', active: true, marquee: true, contractPro: true,
  },
  {
    id: 'jonny-mellor',
    name: 'Jonny Mellor',
    nationality: 'GB', gender: 'M',
    disciplines: ['Half Marathon', 'Marathon'],
    homeNation: 'ENG', active: true, contractPro: true,
  },
  {
    id: 'mahamed-mahamed',
    name: 'Mahamed Mahamed',
    nationality: 'GB', gender: 'M',
    disciplines: ['5000m', '10000m', 'Half Marathon', 'Marathon'],
    homeNation: 'ENG', active: true, contractPro: true,
  },
  {
    id: 'ben-connor',
    name: 'Ben Connor',
    nationality: 'GB', gender: 'M',
    disciplines: ['Half Marathon', 'Marathon'],
    homeNation: 'ENG', active: true, contractPro: true,
  },
  {
    id: 'robbie-simpson',
    name: 'Robbie Simpson',
    nationality: 'GB', gender: 'M',
    disciplines: ['Half Marathon', 'Marathon'],
    homeNation: 'SCO', active: true, contractPro: true,
  },

  // ─── BRITISH WOMEN: 800m ─────────────────────────────────────────────────
  {
    id: 'jemma-reekie',
    name: 'Jemma Reekie',
    nationality: 'GB', gender: 'F',
    disciplines: ['800m', '1500m'],
    homeNation: 'SCO', active: true, marquee: true,
  },
  {
    id: 'isabelle-boffey',
    name: 'Isabelle Boffey',
    nationality: 'GB', gender: 'F',
    disciplines: ['800m'],
    homeNation: 'ENG', active: true,
  },
  {
    id: 'georgia-bell',
    name: 'Georgia Bell',
    nationality: 'GB', gender: 'F',
    disciplines: ['800m', '1500m'],
    homeNation: 'SCO', active: true,
  },
  {
    id: 'phoebe-gill',
    name: 'Phoebe Gill',
    nationality: 'GB', gender: 'F',
    disciplines: ['800m'],
    homeNation: 'ENG', active: true, marquee: true,
  },
  {
    id: 'erin-wallace',
    name: 'Erin Wallace',
    nationality: 'GB', gender: 'F',
    disciplines: ['800m', '1500m', '3000m'],
    homeNation: 'SCO', active: true,
  },

  // ─── BRITISH WOMEN: 1500m / Mile ─────────────────────────────────────────
  {
    id: 'laura-muir',
    name: 'Laura Muir',
    nationality: 'GB', gender: 'F',
    disciplines: ['1500m', 'Mile'],
    homeNation: 'SCO', active: true, marquee: true,
  },
  {
    id: 'melissa-courtney-bryant',
    name: 'Melissa Courtney-Bryant',
    nationality: 'GB', gender: 'F',
    disciplines: ['1500m', '3000m', '5000m'],
    homeNation: 'WAL', active: true,
  },
  {
    id: 'katie-snowden',
    name: 'Katie Snowden',
    nationality: 'GB', gender: 'F',
    disciplines: ['800m', '1500m'],
    homeNation: 'ENG', active: true,
  },

  // ─── BRITISH WOMEN: 5000m / Distance ─────────────────────────────────────
  {
    id: 'megan-keith',
    name: 'Megan Keith',
    nationality: 'GB', gender: 'F',
    disciplines: ['5000m', '10000m'],
    homeNation: 'SCO', active: true,
  },

  // ─── BRITISH WOMEN: Marathon / Road ──────────────────────────────────────
  {
    id: 'charlotte-purdue',
    name: 'Charlotte Purdue',
    nationality: 'GB', gender: 'F',
    disciplines: ['Half Marathon', 'Marathon'],
    homeNation: 'ENG', active: true, contractPro: true,
  },
  {
    id: 'lily-partridge',
    name: 'Lily Partridge',
    nationality: 'GB', gender: 'F',
    disciplines: ['Half Marathon', 'Marathon'],
    homeNation: 'ENG', active: true, contractPro: true,
  },
  {
    id: 'steph-davis',
    name: 'Steph Twell',
    nationality: 'GB', gender: 'F',
    disciplines: ['5000m', 'Half Marathon', 'Marathon'],
    homeNation: 'SCO', active: true, contractPro: true,
  },

  // ─── INTERNATIONAL: 800m ─────────────────────────────────────────────────
  {
    id: 'emmanuel-korir',
    name: 'Emmanuel Korir',
    nationality: 'international', gender: 'M',
    disciplines: ['800m', '1500m'],
    active: true, marquee: true, notes: 'Kenya',
  },
  {
    id: 'marco-arop',
    name: 'Marco Arop',
    nationality: 'international', gender: 'M',
    disciplines: ['800m'],
    active: true, marquee: true, notes: 'Canada',
  },
  {
    id: 'djamel-sedjati',
    name: 'Djamel Sedjati',
    nationality: 'international', gender: 'M',
    disciplines: ['800m'],
    active: true, marquee: true, notes: 'Algeria',
  },
  {
    id: 'femke-bol',
    name: 'Femke Bol',
    nationality: 'international', gender: 'F',
    disciplines: ['400m', '400m H', '800m'],
    active: true, marquee: true, notes: 'Netherlands',
  },

  // ─── INTERNATIONAL: 1500m / Mile ─────────────────────────────────────────
  {
    id: 'jakob-ingebrigtsen',
    name: 'Jakob Ingebrigtsen',
    nationality: 'international', gender: 'M',
    disciplines: ['1500m', 'Mile', '3000m', '5000m'],
    active: true, marquee: true, notes: 'Norway',
  },
  {
    id: 'cole-hocker',
    name: 'Cole Hocker',
    nationality: 'international', gender: 'M',
    disciplines: ['1500m', 'Mile'],
    active: true, marquee: true, notes: 'USA',
  },
  {
    id: 'yomif-kejelcha',
    name: 'Yomif Kejelcha',
    nationality: 'international', gender: 'M',
    disciplines: ['1500m', '3000m', '5000m'],
    active: true, marquee: true, notes: 'Ethiopia',
  },
  {
    id: 'narve-nordas',
    name: 'Narve Gilje Nordås',
    nationality: 'international', gender: 'M',
    disciplines: ['1500m', 'Mile', '5000m'],
    active: true, notes: 'Norway',
  },

  // ─── INTERNATIONAL: 5000m / 10000m ───────────────────────────────────────
  {
    id: 'grant-fisher',
    name: 'Grant Fisher',
    nationality: 'international', gender: 'M',
    disciplines: ['5000m', '10000m'],
    active: true, marquee: true, notes: 'USA',
  },
  {
    id: 'berihu-aregawi',
    name: 'Berihu Aregawi',
    nationality: 'international', gender: 'M',
    disciplines: ['5000m', '10000m'],
    active: true, marquee: true, notes: 'Ethiopia',
  },
  {
    id: 'joshua-cheptegei',
    name: 'Joshua Cheptegei',
    nationality: 'international', gender: 'M',
    disciplines: ['5000m', '10000m', 'Road'],
    active: true, marquee: true, notes: 'Uganda',
  },

  // ─── INTERNATIONAL: Marathon ──────────────────────────────────────────────
  {
    id: 'eliud-kipchoge',
    name: 'Eliud Kipchoge',
    nationality: 'international', gender: 'M',
    disciplines: ['Marathon'],
    active: true, marquee: true, notes: 'Kenya',
  },
  {
    id: 'tigist-assefa',
    name: 'Tigist Assefa',
    nationality: 'international', gender: 'F',
    disciplines: ['Marathon'],
    active: true, marquee: true, notes: 'Ethiopia',
  },
  {
    id: 'ruth-chepngetich',
    name: 'Ruth Chepngetich',
    nationality: 'international', gender: 'F',
    disciplines: ['Marathon'],
    active: true, marquee: true, notes: 'Kenya',
  },

  // ─── INTERNATIONAL: 400m Hurdles ─────────────────────────────────────────
  {
    id: 'karsten-warholm',
    name: 'Karsten Warholm',
    nationality: 'international', gender: 'M',
    disciplines: ['400m H'],
    active: true, marquee: true, notes: 'Norway',
  },
  {
    id: 'rai-benjamin',
    name: 'Rai Benjamin',
    nationality: 'international', gender: 'M',
    disciplines: ['400m H'],
    active: true, marquee: true, notes: 'USA',
  },
  {
    id: 'sydney-mclaughlin',
    name: 'Sydney McLaughlin-Levrone',
    nationality: 'international', gender: 'F',
    disciplines: ['400m H', '400m'],
    active: true, marquee: true, notes: 'USA',
  },
];
