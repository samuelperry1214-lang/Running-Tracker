'use client';
import { useState } from 'react';
import { RaceResult, ResultEntry } from '@/lib/types';

interface Props {
  loading: boolean;
  groups: { meeting: { name: string; id: string; date: string }; results: RaceResult[] }[];
  trackedAthletes: string[];
}

function highlightIfTracked(name: string, tracked: string[]): boolean {
  const lower = name.toLowerCase();
  return tracked.some(t => lower.includes(t.split(' ').pop()!.toLowerCase()));
}

const FLAG: Record<string, string> = {
  GBR: '🇬🇧', GB: '🇬🇧', ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', WAL: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', NIR: '🇬🇧',
  USA: '🇺🇸', KEN: '🇰🇪', ETH: '🇪🇹', NOR: '🇳🇴', NED: '🇳🇱', ALG: '🇩🇿', UGA: '🇺🇬',
};

export default function ResultsView({ loading, groups, trackedAthletes }: Props) {
  const [filter, setFilter] = useState<'all' | 'tracked'>('tracked');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <svg className="w-8 h-8 animate-spin mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <p>Loading results from Power of 10…</p>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg mb-2">No recent results found</p>
        <p className="text-sm">Try clicking Refresh — data comes from Power of 10</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Show:</span>
        {(['tracked', 'all'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm px-3 py-1 rounded-full font-medium transition-colors ${filter === f
              ? 'bg-track-blue text-white'
              : 'bg-white text-gray-600 hover:bg-cream-dark border border-gray-200'
              }`}
          >
            {f === 'tracked' ? 'Tracked athletes' : 'All results'}
          </button>
        ))}
      </div>

      {groups.map(({ meeting, results }) => {
        const filtered = results.map(rr => ({
          ...rr,
          results: filter === 'tracked'
            ? rr.results.filter(e => highlightIfTracked(e.athleteName, trackedAthletes))
            : rr.results,
        })).filter(rr => rr.results.length > 0);

        if (filtered.length === 0) return null;

        return (
          <div key={meeting.id} className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{meeting.name}</h3>
                <p className="text-xs text-gray-400">{meeting.date} · Power of 10</p>
              </div>
              <a
                href={`https://www.thepowerof10.info/results/results.aspx?meetingid=${meeting.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-track-blue hover:underline"
              >
                Full results →
              </a>
            </div>

            {filtered.map(rr => (
              <div key={rr.id} className="px-4 py-3 border-b border-gray-50 last:border-0">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {rr.discipline} {rr.gender === 'F' ? '(Women)' : rr.gender === 'M' ? '(Men)' : ''}
                </h4>
                <div className="space-y-1">
                  {rr.results.slice(0, 15).map((entry, i) => {
                    const isTracked = highlightIfTracked(entry.athleteName, trackedAthletes);
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-2 text-sm py-0.5 rounded px-1 ${isTracked ? 'bg-blue-50' : ''}`}
                      >
                        <span className="w-6 text-right text-gray-400 text-xs font-mono flex-shrink-0">
                          {entry.position}
                        </span>
                        <span className={`flex-1 font-medium ${isTracked ? 'text-track-blue' : 'text-gray-800'}`}>
                          {entry.athleteName}
                          {isTracked && <span className="ml-1 text-[10px] bg-track-blue/10 text-track-blue px-1 rounded">tracked</span>}
                        </span>
                        {entry.nationality && (
                          <span className="text-xs flex-shrink-0">{FLAG[entry.nationality] ?? entry.nationality}</span>
                        )}
                        <span className="font-mono text-sm text-gray-900 flex-shrink-0">{entry.performance}</span>
                        {entry.pb && <span className="text-[10px] font-bold text-track-red flex-shrink-0">PB</span>}
                        {entry.sb && !entry.pb && <span className="text-[10px] font-bold text-track-orange flex-shrink-0">SB</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
