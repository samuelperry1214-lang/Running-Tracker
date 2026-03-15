'use client';
import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import CalendarView from '@/components/CalendarView';
import ResultsView from '@/components/ResultsView';
import NewsView from '@/components/NewsView';
import AthletesView from '@/components/AthletesView';
import { Race, NewsItem, Athlete, RaceResult } from '@/lib/types';
import { SEED_ATHLETES } from '@/lib/athletes-seed';

type Tab = 'calendar' | 'results' | 'news' | 'athletes';

interface ResultsGroup {
  meeting: { name: string; id: string; date: string };
  results: RaceResult[];
}

const ATHLETES_STORAGE_KEY = 'brt:athletes:v1';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('calendar');
  const [races, setRaces] = useState<Race[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [resultGroups, setResultGroups] = useState<ResultsGroup[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>(SEED_ATHLETES);

  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // ── Load athletes (KV → fallback localStorage → fallback seed) ──────────────
  useEffect(() => {
    async function loadAthletes() {
      try {
        const res = await fetch('/api/athletes');
        if (res.ok) {
          const data = await res.json();
          if (data.athletes?.length) {
            setAthletes(data.athletes);
            return;
          }
        }
      } catch { /* ignore */ }

      // Fallback: localStorage
      try {
        const stored = localStorage.getItem(ATHLETES_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAthletes(parsed);
          }
        }
      } catch { /* ignore */ }
    }
    loadAthletes();
  }, []);

  // ── Persist athletes whenever they change ────────────────────────────────────
  const saveAthletes = useCallback(async (updated: Athlete[]) => {
    setAthletes(updated);
    // localStorage as immediate fallback
    try { localStorage.setItem(ATHLETES_STORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
    // KV via API
    try {
      await fetch('/api/athletes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ athletes: updated }),
      });
    } catch { /* ignore */ }
  }, []);

  // ── Fetch functions ──────────────────────────────────────────────────────────
  const fetchCalendar = useCallback(async () => {
    setLoadingCalendar(true);
    try {
      const res = await fetch('/api/races');
      if (res.ok) {
        const data = await res.json();
        setRaces(data.races ?? []);
      }
    } catch (e) { console.error(e); }
    finally { setLoadingCalendar(false); }
  }, []);

  const fetchNews = useCallback(async () => {
    setLoadingNews(true);
    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const data = await res.json();
        setNews(data.news ?? []);
      }
    } catch (e) { console.error(e); }
    finally { setLoadingNews(false); }
  }, []);

  const fetchResults = useCallback(async () => {
    setLoadingResults(true);
    try {
      const res = await fetch('/api/results?days=14');
      if (res.ok) {
        const data = await res.json();
        setResultGroups(data.groups ?? []);
      }
    } catch (e) { console.error(e); }
    finally { setLoadingResults(false); }
  }, []);

  // ── Initial load on tab open ─────────────────────────────────────────────────
  useEffect(() => {
    if (races.length === 0) fetchCalendar();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (activeTab === 'news' && news.length === 0) fetchNews();
  }, [activeTab]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (activeTab === 'results' && resultGroups.length === 0) fetchResults();
  }, [activeTab]);  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Refresh all ─────────────────────────────────────────────────────────────
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchCalendar(), fetchNews(), fetchResults()]);
    setLastUpdated(new Date().toISOString());
    setRefreshing(false);
  }, [fetchCalendar, fetchNews, fetchResults]);

  const trackedAthleteNames = athletes.map(a => a.name);

  const TABS: { id: Tab; label: string }[] = [
    { id: 'calendar', label: 'Calendar' },
    { id: 'results', label: 'Results' },
    { id: 'news', label: 'News' },
    { id: 'athletes', label: 'Athletes' },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <Header onRefresh={handleRefresh} refreshing={refreshing} lastUpdated={lastUpdated} />

      {/* Tab navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-[57px] z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                  ? 'border-track-blue text-track-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                  }`}
              >
                {tab.label}
                {tab.id === 'results' && resultGroups.length > 0 && (
                  <span className="ml-1.5 text-[10px] bg-track-red text-white rounded-full px-1.5 py-0.5 font-bold">
                    {resultGroups.length}
                  </span>
                )}
                {tab.id === 'news' && news.length > 0 && (
                  <span className="ml-1.5 text-[10px] bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5">
                    {news.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'calendar' && (
          loadingCalendar && races.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <svg className="w-8 h-8 animate-spin mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Loading calendar…
            </div>
          ) : (
            <CalendarView races={races} />
          )
        )}

        {activeTab === 'results' && (
          <ResultsView
            loading={loadingResults}
            groups={resultGroups}
            trackedAthletes={trackedAthleteNames}
          />
        )}

        {activeTab === 'news' && (
          <NewsView loading={loadingNews} news={news} />
        )}

        {activeTab === 'athletes' && (
          <AthletesView athletes={athletes} onUpdate={saveAthletes} />
        )}
      </main>

      <footer className="mt-12 pb-6 text-center text-xs text-gray-400 space-y-1">
        <div>Data: Power of 10 · BBC Sport · The Guardian · Athletics Weekly · British Athletics</div>
        <div>British Running Tracker · Personal use only</div>
      </footer>
    </div>
  );
}
