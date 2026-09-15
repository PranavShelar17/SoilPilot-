import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subvalue?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subvalue,
  icon,
  badge,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-start justify-between gap-4 transition-all hover:border-[#76C457]/50 ${className}`}
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            {value}
          </h3>
          {badge}
        </div>
        {subvalue && (
          <p className="text-xs text-slate-500">{subvalue}</p>
        )}
      </div>

      {icon && (
        <div className="w-10 h-10 rounded-xl bg-[#FFF8CF] border border-[#FBE6C2] flex items-center justify-center text-[#2A7C13] flex-shrink-0 shadow-2xs">
          {icon}
        </div>
      )}
    </div>
  );
};
