export type Discipline =
  | '800m' | '1500m' | 'Mile' | '3000m' | '5000m' | '10000m'
  | 'Half Marathon' | 'Marathon' | 'Steeplechase' | 'Cross Country'
  | '400m' | '400m H' | '110m H' | '100m' | '200m' | 'Road';

export type Nationality = 'GB' | 'international';

export interface Athlete {
  id: string;
  name: string;
  nationality: Nationality;
  disciplines: Discipline[];
  gender: 'M' | 'F';
  powerof10Id?: string;
  active: boolean;
  marquee?: boolean; // keep even if injured/ranking dropped
  contractPro?: boolean; // marathon/road pros with contracts
  notes?: string;
  homeNation?: string; // ENG / SCO / WAL / NIR
}

export type RaceLevel =
  | 'diamond_league'
  | 'world_athletics_series'
  | 'world_majors'
  | 'national_championship'
  | 'uk_athletics'
  | 'road'
  | 'international';

export interface Race {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  endDate?: string;
  location: string;
  country: string;
  disciplines: Discipline[];
  level: RaceLevel;
  url?: string;
  broadcastInfo?: string;
  confirmedAthletes?: string[];
  source?: string;
}

export interface ResultEntry {
  position: number | string;
  athleteName: string;
  nationality?: string;
  performance: string;
  wind?: string;
  pb?: boolean;
  sb?: boolean;
}

export interface RaceResult {
  id: string;
  raceName: string;
  date: string;
  location: string;
  discipline: Discipline;
  gender?: 'M' | 'F' | 'Mixed';
  results: ResultEntry[];
  source?: string;
  url?: string;
  meetingId?: string;
}

export type NewsSource = 'BBC' | 'Guardian' | 'Athletics Weekly' | 'British Athletics' | 'World Athletics';

export interface NewsItem {
  id: string;
  title: string;
  summary?: string;
  url: string;
  source: NewsSource;
  publishedAt: string; // ISO datetime
  imageUrl?: string;
}
