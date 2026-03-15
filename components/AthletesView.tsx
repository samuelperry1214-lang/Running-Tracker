'use client';
import { useState, useMemo } from 'react';
import { Athlete, Discipline } from '@/lib/types';

interface Props {
  athletes: Athlete[];
  onUpdate: (athletes: Athlete[]) => void;
}

const DISCIPLINE_GROUPS = [
  { label: 'All', disciplines: [] as Discipline[] },
  { label: '800m', disciplines: ['800m'] as Discipline[] },
  { label: '1500m / Mile', disciplines: ['1500m', 'Mile', '3000m'] as Discipline[] },
  { label: '5K / 10K', disciplines: ['5000m', '10000m', 'Steeplechase', 'Cross Country'] as Discipline[] },
  { label: 'HM / Marathon', disciplines: ['Half Marathon', 'Marathon', 'Road'] as Discipline[] },
];

const HOME_FLAG: Record<string, string> = {
  ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', WAL: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', NIR: '🇬🇧', GB: '🇬🇧',
};

export default function AthletesView({ athletes, onUpdate }: Props) {
  const [discFilter, setDiscFilter] = useState<string>('All');
  const [natFilter, setNatFilter] = useState<'all' | 'GB' | 'international'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'M' | 'F'>('all');
  const [addName, setAddName] = useState('');
  const [addNat, setAddNat] = useState<'GB' | 'international'>('GB');
  const [addDisc, setAddDisc] = useState<string>('800m');
  const [addGender, setAddGender] = useState<'M' | 'F'>('M');
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return athletes.filter(a => {
      if (natFilter !== 'all' && a.nationality !== natFilter) return false;
      if (genderFilter !== 'all' && a.gender !== genderFilter) return false;
      if (discFilter !== 'All') {
        const group = DISCIPLINE_GROUPS.find(g => g.label === discFilter);
        if (group && group.disciplines.length > 0) {
          if (!a.disciplines.some(d => group.disciplines.includes(d))) return false;
        }
      }
      return true;
    });
  }, [athletes, natFilter, discFilter, genderFilter]);

  const gbAthletes = filtered.filter(a => a.nationality === 'GB');
  const intlAthletes = filtered.filter(a => a.nationality === 'international');

  function removeAthlete(id: string) {
    onUpdate(athletes.filter(a => a.id !== id));
  }

  function addAthlete() {
    if (!addName.trim()) return;
    const newAthlete: Athlete = {
      id: `custom-${Date.now()}`,
      name: addName.trim(),
      nationality: addNat,
      gender: addGender,
      disciplines: [addDisc as Discipline],
      active: true,
    };
    onUpdate([...athletes, newAthlete]);
    setAddName('');
  }

  const AthleteRow = ({ athlete }: { athlete: Athlete }) => (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-cream group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-medium text-gray-900">{athlete.name}</span>
          {athlete.homeNation && (
            <span className="text-base" title={athlete.homeNation}>{HOME_FLAG[athlete.homeNation] ?? ''}</span>
          )}
          {athlete.notes && athlete.nationality === 'international' && (
            <span className="text-[11px] text-gray-400">{athlete.notes}</span>
          )}
          {athlete.marquee && (
            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1 rounded font-medium">★</span>
          )}
          {athlete.contractPro && (
            <span className="text-[10px] bg-green-100 text-green-700 px-1 rounded font-medium">Pro</span>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {athlete.disciplines.map(d => (
            <span key={d} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{d}</span>
          ))}
        </div>
        {athlete.notes && athlete.nationality === 'GB' && (
          <p className="text-[11px] text-amber-600 mt-0.5">{athlete.notes}</p>
        )}
      </div>
      <button
        onClick={() => removeAthlete(athlete.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded flex-shrink-0"
        title="Remove from tracker"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-card p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
        <div className="flex flex-wrap gap-2">
          {(['all', 'GB', 'international'] as const).map(n => (
            <button key={n} onClick={() => setNatFilter(n)}
              className={`text-sm px-3 py-1 rounded-full font-medium ${natFilter === n ? 'bg-track-blue text-white' : 'bg-cream text-gray-600 hover:bg-cream-dark'}`}>
              {n === 'all' ? 'All nations' : n === 'GB' ? '🇬🇧 British' : '🌍 International'}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'M', 'F'] as const).map(g => (
            <button key={g} onClick={() => setGenderFilter(g)}
              className={`text-sm px-3 py-1 rounded-full font-medium ${genderFilter === g ? 'bg-track-blue text-white' : 'bg-cream text-gray-600 hover:bg-cream-dark'}`}>
              {g === 'all' ? 'All' : g === 'M' ? 'Men' : 'Women'}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {DISCIPLINE_GROUPS.map(g => (
            <button key={g.label} onClick={() => setDiscFilter(g.label)}
              className={`text-sm px-3 py-1 rounded-full font-medium ${discFilter === g.label ? 'bg-track-blue text-white' : 'bg-cream text-gray-600 hover:bg-cream-dark'}`}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add Athlete */}
      <div className="bg-white rounded-xl shadow-card p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Add Athlete</h3>
        <div className="flex flex-wrap gap-2 items-end">
          <input
            type="text"
            placeholder="Full name"
            value={addName}
            onChange={e => setAddName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addAthlete()}
            className="flex-1 min-w-[160px] text-sm border border-gray-200 rounded-lg px-3 py-2 bg-cream focus:outline-none focus:ring-2 focus:ring-track-blue focus:border-transparent"
          />
          <select value={addNat} onChange={e => setAddNat(e.target.value as 'GB' | 'international')}
            className="text-sm border border-gray-200 rounded-lg px-2 py-2 bg-cream focus:outline-none focus:ring-2 focus:ring-track-blue">
            <option value="GB">🇬🇧 British</option>
            <option value="international">🌍 International</option>
          </select>
          <select value={addGender} onChange={e => setAddGender(e.target.value as 'M' | 'F')}
            className="text-sm border border-gray-200 rounded-lg px-2 py-2 bg-cream focus:outline-none focus:ring-2 focus:ring-track-blue">
            <option value="M">Men</option>
            <option value="F">Women</option>
          </select>
          <select value={addDisc} onChange={e => setAddDisc(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-2 py-2 bg-cream focus:outline-none focus:ring-2 focus:ring-track-blue">
            {['800m','1500m','Mile','3000m','5000m','10000m','Half Marathon','Marathon','Steeplechase','400m H'].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <button
            onClick={addAthlete}
            disabled={!addName.trim()}
            className="px-4 py-2 bg-track-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Add
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* British Athletes */}
        {(natFilter === 'all' || natFilter === 'GB') && (
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">🇬🇧 British Athletes</h3>
              <span className="text-xs text-gray-400">{gbAthletes.length} tracked</span>
            </div>
            <div className="p-2 divide-y divide-gray-50">
              {gbAthletes.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">No athletes match filters</p>
              ) : (
                gbAthletes.map(a => <AthleteRow key={a.id} athlete={a} />)
              )}
            </div>
          </div>
        )}

        {/* International Athletes */}
        {(natFilter === 'all' || natFilter === 'international') && (
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">🌍 International Athletes</h3>
              <span className="text-xs text-gray-400">{intlAthletes.length} tracked</span>
            </div>
            <div className="p-2 divide-y divide-gray-50">
              {intlAthletes.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">No athletes match filters</p>
              ) : (
                intlAthletes.map(a => <AthleteRow key={a.id} athlete={a} />)
              )}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        {athletes.length} total athletes tracked · Changes sync automatically
      </p>
    </div>
  );
}
