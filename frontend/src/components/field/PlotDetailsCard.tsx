import React from 'react';
import { FileText } from 'lucide-react';

interface PlotDetailsCardProps {
  gatNo: string;
  areaHa: number;
  landType?: string;
  cropCurrent?: string;
  lastUpdated?: string;
}

export const PlotDetailsCard: React.FC<PlotDetailsCardProps> = ({
  gatNo,
  areaHa,
  landType = 'Agricultural',
  cropCurrent = 'Sugarcane',
  lastUpdated = '15 Aug 2026',
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <FileText className="w-4 h-4 text-emerald-700" />
        <h4 className="text-sm font-bold text-slate-900">
          Plot Details
        </h4>
      </div>

      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Gat No.</span>
          <strong className="text-slate-900 font-bold">{gatNo}</strong>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500">Area</span>
          <strong className="text-slate-900 font-bold">{areaHa} ha</strong>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500">Land Type</span>
          <span className="text-slate-800 font-medium">{landType}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500">Crop (Current)</span>
          <span className="text-slate-800 font-medium">{cropCurrent}</span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <span className="text-slate-500">Last Updated</span>
          <span className="text-slate-700 font-medium">{lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};
