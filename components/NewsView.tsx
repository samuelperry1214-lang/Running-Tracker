'use client';
import { useState } from 'react';
import { NewsItem, NewsSource } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  loading: boolean;
  news: NewsItem[];
}

const SOURCE_COLOR: Record<NewsSource, string> = {
  BBC: 'bg-red-100 text-red-700',
  Guardian: 'bg-blue-100 text-blue-700',
  'Athletics Weekly': 'bg-green-100 text-green-700',
  'British Athletics': 'bg-purple-100 text-purple-700',
  'World Athletics': 'bg-orange-100 text-orange-700',
};

const SOURCES: NewsSource[] = ['BBC', 'Guardian', 'Athletics Weekly', 'British Athletics', 'World Athletics'];

export default function NewsView({ loading, news }: Props) {
  const [activeSource, setActiveSource] = useState<NewsSource | 'All'>('All');

  const filtered = activeSource === 'All' ? news : news.filter(n => n.source === activeSource);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <svg className="w-8 h-8 animate-spin mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <p>Fetching athletics news…</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Source filter */}
      <div className="flex flex-wrap gap-2">
        {(['All', ...SOURCES] as const).map(s => (
          <button
            key={s}
            onClick={() => setActiveSource(s)}
            className={`text-sm px-3 py-1 rounded-full font-medium transition-colors ${activeSource === s
              ? 'bg-track-blue text-white'
              : 'bg-white text-gray-600 hover:bg-cream-dark border border-gray-200'
              }`}
          >
            {s} {s !== 'All' && news.filter(n => n.source === s).length > 0 && (
              <span className="ml-1 text-[10px] opacity-70">{news.filter(n => n.source === s).length}</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p>No news found from this source. Try refreshing.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(item => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-xl shadow-card hover:shadow-card-hover overflow-hidden flex flex-col"
          >
            {item.imageUrl && (
              <div className="h-40 overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${SOURCE_COLOR[item.source] ?? 'bg-gray-100 text-gray-600'}`}>
                  {item.source}
                </span>
                <span className="text-[11px] text-gray-400">
                  {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-2 group-hover:text-track-blue line-clamp-3">
                {item.title}
              </h3>
              {item.summary && (
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 flex-1">{item.summary}</p>
              )}
              <div className="mt-3 text-xs text-track-blue font-medium group-hover:underline">
                Read more →
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
