import React from 'react';
import { SoilParameterValue, SoilDataSource } from '../types';

interface SoilParameterCardProps {
  parameter: SoilParameterValue;
  showCategory?: boolean;
}

export const SoilParameterCard: React.FC<SoilParameterCardProps> = ({ parameter }) => {
  const isAvailable = parameter.value !== null && parameter.value !== undefined;

  const renderSourceBadge = (source: SoilDataSource) => {
    switch (source) {
      case 'LAB_OBSERVATION':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            LAB OBSERVATION
          </span>
        );
      case 'DSM_PREDICTION':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            DSM PREDICTION
          </span>
        );
      case 'IMPORTED_DATA':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            IMPORTED DATA
          </span>
        );
      default:
        return null;
    }
  };

  const renderStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('good') || s.includes('normal') || s.includes('sufficient') || s.includes('abundant')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
          {status}
        </span>
      );
    }
    if (s.includes('medium') || s.includes('moderate') || s.includes('alkaline')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          {status}
        </span>
      );
    }
    if (s.includes('low') || s.includes('deficient') || s.includes('acidic')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition-colors shadow-xs">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 leading-tight">
            {parameter.name}
          </h4>
          <span className="text-xs text-slate-500 font-normal">
            {parameter.name_mr}
          </span>
        </div>
        {renderSourceBadge(parameter.data_source)}
      </div>

      {/* Value & Status */}
      <div className="flex items-baseline justify-between mt-3 mb-2">
        <div className="flex items-baseline gap-1">
          {isAvailable ? (
            <>
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                {typeof parameter.value === 'number' ? parameter.value : parameter.value}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {parameter.unit}
              </span>
            </>
          ) : (
            <span className="text-sm italic font-medium text-slate-400">
              Not available
            </span>
          )}
        </div>
        {isAvailable && renderStatusBadge(parameter.status)}
      </div>

      {/* Benchmark Range */}
      {parameter.benchmark_min !== undefined && parameter.benchmark_max !== undefined && (
        <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
          <span>Standard Target:</span>
          <span className="font-medium text-slate-700">
            {parameter.benchmark_min} - {parameter.benchmark_max} {parameter.unit}
          </span>
        </div>
      )}

      {/* Interpretation */}
      {parameter.interpretation && isAvailable && (
        <p className="text-[11px] text-slate-600 mt-1.5 line-clamp-2">
          {parameter.interpretation}
        </p>
      )}
    </div>
  );
};
