import React from 'react';
import { History } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HistoryItem {
  date: string;
  label: string;
  isLatest?: boolean;
}

interface SoilTestHistoryCardProps {
  records?: HistoryItem[];
  viewAllLink?: string;
}

export const SoilTestHistoryCard: React.FC<SoilTestHistoryCardProps> = ({
  records = [
    { date: '15 Aug 2026', label: 'Latest Record', isLatest: true },
    { date: '12 Feb 2025', label: 'Previous Record' },
    { date: '15 Jan 2024', label: 'Previous Record' },
  ],
  viewAllLink = '/farmer/reports',
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-700" />
          <h4 className="text-sm font-bold text-slate-900">
            Soil Health Card History
          </h4>
        </div>
        <Link
          to={viewAllLink}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3 relative pl-3 text-xs">
        {/* Timeline vertical bar */}
        <div className="absolute left-1 top-2 bottom-2 w-0.5 bg-slate-200"></div>

        {records.map((item, idx) => (
          <div key={idx} className="relative flex items-center justify-between pl-4">
            {/* Timeline dot */}
            <div
              className={`absolute -left-1.5 w-2.5 h-2.5 rounded-full border-2 ${
                item.isLatest
                  ? 'bg-emerald-600 border-emerald-200 ring-2 ring-emerald-100'
                  : 'bg-slate-300 border-white'
              }`}
            ></div>

            <span className="font-semibold text-slate-800">{item.date}</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                item.isLatest
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
