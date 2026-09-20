import React from 'react';
import { Beaker, Leaf, Zap, Shield, HelpCircle, Activity } from 'lucide-react';
import { SoilParameterValue, SoilDataSource } from '../../types';

interface SoilNutrientCardProps {
  parameter: SoilParameterValue;
}

export const SoilNutrientCard: React.FC<SoilNutrientCardProps> = ({ parameter }) => {
  const isAvailable = parameter.value !== null && parameter.value !== undefined;

  // Icon selector based on key
  const getIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case 'ph':
        return <Beaker className="w-4 h-4 text-emerald-600" />;
      case 'organic_carbon':
      case 'oc':
        return <Leaf className="w-4 h-4 text-amber-600" />;
      case 'ec':
        return <Zap className="w-4 h-4 text-blue-600" />;
      default:
        return <span className="font-bold text-xs uppercase text-slate-700">{key.slice(0, 2)}</span>;
    }
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('good') || s.includes('normal') || s.includes('sufficient') || s.includes('abundant')) {
      return {
        cardBg: 'bg-emerald-50/40 border-emerald-200/80',
        badgeBg: 'bg-emerald-100 text-emerald-800',
        textColor: 'text-emerald-900',
      };
    }
    if (s.includes('medium') || s.includes('moderate') || s.includes('alkaline')) {
      return {
        cardBg: 'bg-amber-50/40 border-amber-200/80',
        badgeBg: 'bg-amber-100 text-amber-800',
        textColor: 'text-amber-900',
      };
    }
    if (s.includes('low') || s.includes('deficient') || s.includes('acidic')) {
      return {
        cardBg: 'bg-rose-50/40 border-rose-200/80',
        badgeBg: 'bg-rose-100 text-rose-800',
        textColor: 'text-rose-900',
      };
    }
    return {
      cardBg: 'bg-slate-50 border-slate-200',
      badgeBg: 'bg-slate-100 text-slate-700',
      textColor: 'text-slate-900',
    };
  };

  const colors = getStatusColor(parameter.status);

  const getSourceBadge = (source?: SoilDataSource) => {
    switch (source) {
      case 'LAB_OBSERVATION':
        return (
          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
            Lab
          </span>
        );
      case 'DSM_PREDICTION':
        return (
          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
            DSM
          </span>
        );
      case 'IMPORTED_DATA':
        return (
          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
            Imported
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`p-3.5 rounded-xl border transition-all ${colors.cardBg} flex flex-col justify-between`}>
      <div>
        <div className="flex items-start justify-between gap-1 mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-2xs">
              {getIcon(parameter.key)}
            </div>
            <span className="text-[11px] font-semibold text-slate-700 leading-tight">
              {parameter.name}
            </span>
          </div>
          {getSourceBadge(parameter.data_source)}
        </div>

        <div className="my-2 flex items-baseline gap-1">
          {isAvailable ? (
            <>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                {parameter.value}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {parameter.unit}
              </span>
            </>
          ) : (
            <span className="text-xs italic text-slate-400">
              Not available
            </span>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px]">
        <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${colors.badgeBg}`}>
          {isAvailable ? parameter.status : 'Pending'}
        </span>

        {parameter.benchmark_min !== undefined && parameter.benchmark_max !== undefined && (
          <span className="text-[10px] text-slate-400" title="Target Range">
            {parameter.benchmark_min} - {parameter.benchmark_max}
          </span>
        )}
      </div>
    </div>
  );
};
