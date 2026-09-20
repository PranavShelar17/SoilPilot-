import React from 'react';
import { SoilParameterValue, SoilDataSource } from '../../types';

interface SoilParameterTableProps {
  parameters: SoilParameterValue[];
}

export const SoilParameterTable: React.FC<SoilParameterTableProps> = ({ parameters }) => {
  const renderSourceBadge = (source?: SoilDataSource) => {
    switch (source) {
      case 'LAB_OBSERVATION':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            LAB OBSERVATION
          </span>
        );
      case 'DSM_PREDICTION':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            DSM PREDICTION
          </span>
        );
      case 'IMPORTED_DATA':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            IMPORTED DATA
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-50 text-slate-500 border border-slate-200">
            RECORDED
          </span>
        );
    }
  };

  const renderStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('good') || s.includes('normal') || s.includes('sufficient') || s.includes('abundant')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          {status}
        </span>
      );
    }
    if (s.includes('medium') || s.includes('moderate') || s.includes('alkaline')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
          {status}
        </span>
      );
    }
    if (s.includes('low') || s.includes('deficient') || s.includes('acidic')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
        {status}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left text-xs text-slate-700">
        <thead className="bg-[#103529] text-white uppercase text-[10px] tracking-wider font-semibold">
          <tr>
            <th scope="col" className="px-4 py-3">Sr. No.</th>
            <th scope="col" className="px-4 py-3">Parameter (घटक)</th>
            <th scope="col" className="px-4 py-3">Test Value</th>
            <th scope="col" className="px-4 py-3">Unit</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3">Data Source</th>
            <th scope="col" className="px-4 py-3">Interpretation (अर्थ)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {parameters.map((p, idx) => {
            const isAvailable = p.value !== null && p.value !== undefined;
            return (
              <tr key={p.key || idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-500">{p.sr_no || idx + 1}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  <div>{p.name}</div>
                  {p.name_mr && <div className="text-[11px] text-slate-500 font-normal">{p.name_mr}</div>}
                </td>
                <td className="px-4 py-3 font-mono font-bold text-slate-900">
                  {isAvailable ? p.value : <span className="text-slate-400 italic font-sans font-normal">Not available</span>}
                </td>
                <td className="px-4 py-3 text-slate-500">{p.unit}</td>
                <td className="px-4 py-3">{isAvailable ? renderStatusBadge(p.status) : <span className="text-slate-400">Pending</span>}</td>
                <td className="px-4 py-3">{renderSourceBadge(p.data_source)}</td>
                <td className="px-4 py-3 max-w-xs text-slate-600">
                  {p.interpretation || 'No specific interpretation recorded.'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
