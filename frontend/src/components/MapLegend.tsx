import React from 'react';

interface MapLegendProps {
  className?: string;
}

export const MapLegend: React.FC<MapLegendProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg p-3 shadow-md text-xs space-y-2 ${className}`}>
      <div className="font-semibold text-slate-800 border-b border-slate-100 pb-1">
        GIS Map Layers
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500/30 border-2 border-emerald-600"></span>
        <span className="text-slate-700">Authorized Cadastral Plot</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shadow-xs"></span>
        <span className="text-slate-700">Centroid / Sample Point</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3.5 h-1 border-t-2 border-dashed border-slate-400"></span>
        <span className="text-slate-500">Village Boundary (Malegaon)</span>
      </div>
    </div>
  );
};
