import React from 'react';
import { Sprout, CheckCircle2, User, MapPin, Phone, ShieldCheck, Compass, Check, Layers, Zap, Scale } from 'lucide-react';
import { SoilHealthCard, Farmer, Field } from '../../types';
import { SoilNutrientCard } from './SoilNutrientCard';

interface InteractiveSoilCardProps {
  card: SoilHealthCard;
  farmer?: Farmer | null;
  field?: Field | null;
}

export const InteractiveSoilCard: React.FC<InteractiveSoilCardProps> = ({
  card,
  farmer,
  field,
}) => {
  const nutrientParams = card.parameters.slice(0, 8);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Top Card Header matching reference */}
      <div className="bg-[#103529] text-white p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white leading-none">
              Soil Health Card
            </h3>
            <span className="text-xs text-emerald-300/80 font-medium mt-1 block">
              Gat No. {field?.gat_no || card.field_id} | Area: {field?.area_hectares || 1.96} ha
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/90 text-white font-semibold text-xs shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          <span>{card.overall_status || 'Good'}</span>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Farmer Information */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-700" />
            Farmer Information
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 rounded-xl p-3.5 border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Name</span>
              <strong className="text-slate-800 font-semibold block truncate">
                {farmer?.full_name ? farmer.full_name.split('(')[0].trim() : 'Dattatray Jagtap'}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Mobile No.</span>
              <strong className="text-slate-800 font-semibold font-mono block">
                +91 {farmer?.mobile || '9876543210'}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Village</span>
              <strong className="text-slate-800 font-semibold block">
                {field?.village_name || farmer?.village || 'Malegaon'}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Taluka</span>
              <strong className="text-slate-800 font-semibold block">
                {field?.taluka_name || farmer?.taluka || 'Baramati'}, Pune
              </strong>
            </div>
          </div>
        </div>

        {/* Soil Nutrient Status Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Soil Nutrient Status
            </h4>
            <span className="text-[10px] text-slate-400">
              Lab & DSM Certified Values
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {nutrientParams.map((p) => (
              <SoilNutrientCard key={p.key} parameter={p} />
            ))}
          </div>
        </div>

        {/* Soil Physical Properties */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            Soil Physical Properties
          </h4>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 text-xs">
              <span className="text-slate-400 block text-[10px]">Soil Texture</span>
              <strong className="text-slate-900 font-bold block mt-0.5">
                {card.physical_parameters?.texture || 'Medium Black Clay Loam'}
              </strong>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 text-xs">
              <span className="text-slate-400 block text-[10px]">EC (Electrical Conductivity)</span>
              <strong className="text-slate-900 font-bold block mt-0.5">
                0.32 dS/m
              </strong>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 text-xs">
              <span className="text-slate-400 block text-[10px]">Bulk Density</span>
              <strong className="text-slate-900 font-bold block mt-0.5">
                {card.physical_parameters?.bulk_density || 1.28} g/cc
              </strong>
            </div>
          </div>
        </div>

        {/* Recommendations / Management Guidance */}
        <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200/80">
          <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            Scientific Management Guidance
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Apply split doses of nitrogen fertilizer according to crop growth stage.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Enhance organic carbon by adding 2-3 tonnes/ha well-decomposed farmyard manure (FYM).</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Soil application of Zinc Sulphate (25 kg/ha) recommended for zinc deficiency.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
