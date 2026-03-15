'use client';
import { useState, useMemo } from 'react';
import { Race, Discipline } from '@/lib/types';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday, parseISO, isAfter, isBefore
} from 'date-fns';

interface Props {
  races: Race[];
}

const DISCIPLINE_COLOR: Record<string, string> = {
  '800m': 'bg-track-red',
  '1500m': 'bg-track-orange',
  'Mile': 'bg-track-orange',
  '3000m': 'bg-track-yellow',
  '5000m': 'bg-track-yellow',
  '10000m': 'bg-track-yellow',
  'Half Marathon': 'bg-track-green',
  'Marathon': 'bg-track-blue',
  'Cross Country': 'bg-track-lime',
  'Steeplechase': 'bg-track-teal',
  '400m H': 'bg-track-indigo',
  'Road': 'bg-track-green',
};

const LEVEL_BADGE: Record<string, { label: string; cls: string }> = {
  diamond_league: { label: 'Diamond League', cls: 'bg-blue-100 text-blue-800' },
  world_athletics_series: { label: 'World Athletics', cls: 'bg-purple-100 text-purple-800' },
  world_majors: { label: 'World Major', cls: 'bg-yellow-100 text-yellow-800' },
  national_championship: { label: 'National Champs', cls: 'bg-red-100 text-red-800' },
  uk_athletics: { label: 'UK Athletics', cls: 'bg-green-100 text-green-800' },
  road: { label: 'Road Race', cls: 'bg-gray-100 text-gray-700' },
  international: { label: 'International', cls: 'bg-indigo-100 text-indigo-800' },
};

function disciplineColor(disciplines: Discipline[]): string {
  for (const d of disciplines) {
    if (DISCIPLINE_COLOR[d]) return DISCIPLINE_COLOR[d];
  }
  return 'bg-gray-400';
}

export default function CalendarView({ races }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const monthsToShow = 3;

  const months = useMemo(() =>
    Array.from({ length: monthsToShow }, (_, i) => addMonths(currentMonth, i)),
    [currentMonth]
  );

  function getRacesForDay(date: Date): Race[] {
    return races.filter(r => {
      const raceDate = parseISO(r.date);
      const raceEnd = r.endDate ? parseISO(r.endDate) : raceDate;
      return (isSameDay(date, raceDate) || (isAfter(date, raceDate) && isBefore(date, raceEnd)) || isSameDay(date, raceEnd));
    });
  }

  const upcomingRaces = useMemo(() => {
    const today = new Date();
    return races
      .filter(r => !isBefore(parseISO(r.date), today) || isSameDay(parseISO(r.date), today))
      .slice(0, 12);
  }, [races]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* ─── Calendar Grid ──────────────────────────────────────── */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentMonth(m => subMonths(m, 1))}
            className="p-1.5 rounded-lg hover:bg-cream-dark text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-700 w-36 text-center">
            {format(currentMonth, 'MMMM yyyy')} – {format(addMonths(currentMonth, monthsToShow - 1), 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth(m => addMonths(m, 1))}
            className="p-1.5 rounded-lg hover:bg-cream-dark text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="ml-2 text-xs px-2 py-1 rounded bg-cream-dark text-gray-600 hover:bg-gray-200"
          >
            Today
          </button>
        </div>

        {months.map(month => {
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);
          const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
          const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

          const days: Date[] = [];
          let d = calStart;
          while (!isAfter(d, calEnd)) {
            days.push(d);
            d = addDays(d, 1);
          }

          return (
            <div key={month.toISOString()} className="bg-white rounded-xl shadow-card p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">{format(month, 'MMMM yyyy')}</h3>
              <div className="grid grid-cols-7 gap-px text-center text-xs text-gray-400 mb-1">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                  <div key={d} className="py-1 font-medium">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-px">
                {days.map(day => {
                  const dayRaces = getRacesForDay(day);
                  const inMonth = isSameMonth(day, month);
                  const today = isToday(day);

                  return (
                    <div
                      key={day.toISOString()}
                      className={`cal-day min-h-[52px] rounded-lg p-1 text-xs ${inMonth ? 'text-gray-800' : 'text-gray-300'
                        } ${today ? 'ring-2 ring-track-blue bg-blue-50' : ''} ${dayRaces.length > 0 && inMonth ? 'has-race' : ''}`}
                      onClick={() => dayRaces.length > 0 && inMonth && setSelectedRace(dayRaces[0])}
                    >
                      <span className={`text-xs font-medium ${today ? 'text-track-blue' : ''}`}>
                        {format(day, 'd')}
                      </span>
                      {inMonth && dayRaces.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-0.5">
                          {dayRaces.slice(0, 3).map((r, i) => (
                            <span
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${disciplineColor(r.disciplines)}`}
                              title={r.name}
                            />
                          ))}
                          {dayRaces.length > 3 && <span className="text-gray-400">+{dayRaces.length - 3}</span>}
                        </div>
                      )}
                      {inMonth && dayRaces.length > 0 && (
                        <div className="hidden md:block mt-0.5">
                          {dayRaces.slice(0, 1).map(r => (
                            <div key={r.id} className="text-[10px] leading-tight text-gray-600 truncate" title={r.name}>
                              {r.name.replace('Diamond League – ', 'DL ').replace('Championships', 'Champs')}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Sidebar: Upcoming Events ───────────────────────────── */}
      <div className="w-full lg:w-80 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Upcoming</h3>
        {upcomingRaces.map(race => (
          <button
            key={race.id}
            onClick={() => setSelectedRace(race)}
            className="w-full text-left bg-white rounded-xl shadow-card p-3.5 hover:shadow-card-hover border border-transparent hover:border-gray-200"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                  <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${disciplineColor(race.disciplines)}`} />
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                    {format(parseISO(race.date), 'd MMM')}
                    {race.endDate && ` – ${format(parseISO(race.endDate), 'd MMM')}`}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 leading-tight">{race.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{race.location}, {race.country}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {race.disciplines.slice(0, 4).map(d => (
                    <span key={d} className="text-[10px] bg-cream px-1.5 py-0.5 rounded text-gray-600">{d}</span>
                  ))}
                </div>
              </div>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 ${LEVEL_BADGE[race.level]?.cls ?? 'bg-gray-100 text-gray-600'}`}>
                {LEVEL_BADGE[race.level]?.label ?? race.level}
              </span>
            </div>
            {race.broadcastInfo && (
              <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-500">
                <svg className="w-3 h-3 text-track-green flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                {race.broadcastInfo}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* ─── Race Detail Modal ──────────────────────────────────── */}
      {selectedRace && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedRace(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${LEVEL_BADGE[selectedRace.level]?.cls ?? 'bg-gray-100 text-gray-600'}`}>
                  {LEVEL_BADGE[selectedRace.level]?.label}
                </span>
                <h2 className="text-xl font-bold mt-1.5 leading-tight">{selectedRace.name}</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {format(parseISO(selectedRace.date), 'EEEE d MMMM yyyy')}
                  {selectedRace.endDate && ` – ${format(parseISO(selectedRace.endDate), 'd MMMM yyyy')}`}
                </p>
                <p className="text-sm text-gray-600 font-medium mt-0.5">{selectedRace.location}, {selectedRace.country}</p>
              </div>
              <button onClick={() => setSelectedRace(null)} className="text-gray-400 hover:text-gray-600 ml-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Disciplines</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRace.disciplines.map(d => (
                    <span key={d} className={`text-xs font-medium text-white px-2 py-1 rounded-full ${disciplineColor([d])}`}>{d}</span>
                  ))}
                </div>
              </div>

              {selectedRace.broadcastInfo && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">How to Watch</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-700 bg-green-50 rounded-lg p-2.5">
                    <svg className="w-4 h-4 text-track-green flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    {selectedRace.broadcastInfo}
                  </div>
                </div>
              )}

              {selectedRace.confirmedAthletes && selectedRace.confirmedAthletes.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Confirmed Athletes</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedRace.confirmedAthletes.map(a => (
                      <span key={a} className="text-xs bg-cream px-2 py-0.5 rounded text-gray-700">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedRace.url && (
                <a
                  href={selectedRace.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-sm font-medium text-track-blue hover:underline mt-2"
                >
                  Official website →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
