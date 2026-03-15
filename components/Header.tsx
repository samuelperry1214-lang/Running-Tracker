'use client';

interface HeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
  lastUpdated: string | null;
}

export default function Header({ onRefresh, refreshing, lastUpdated }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="hoka-stripe" />
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-tight text-gray-900">British Running Tracker</span>
            <span className="text-xs text-gray-400 font-normal">
              800m → Marathon · Live data
            </span>
          </div>
          {/* Mini discipline key */}
          <div className="hidden md:flex items-center gap-1.5 ml-4 text-xs">
            {[
              { color: 'bg-track-red', label: '800m' },
              { color: 'bg-track-orange', label: '1500m' },
              { color: 'bg-track-yellow', label: '5K/10K' },
              { color: 'bg-track-green', label: 'HM' },
              { color: 'bg-track-blue', label: 'Mar' },
              { color: 'bg-track-purple', label: 'Intl' },
            ].map(({ color, label }) => (
              <span key={label} className="flex items-center gap-1 text-gray-500">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="hidden sm:block text-xs text-gray-400">
              Updated {new Date(lastUpdated).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-track-blue text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {refreshing ? 'Loading…' : 'Refresh'}
          </button>
        </div>
      </div>
    </header>
  );
}
