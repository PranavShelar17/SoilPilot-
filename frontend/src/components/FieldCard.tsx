import React from 'react';
import { MapPin, ArrowRight, Calendar, User, ShieldCheck } from 'lucide-react';
import { Field } from '../types';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { useTranslation } from 'react-i18next';

interface FieldCardProps {
  field: Field;
}

export const FieldCard: React.FC<FieldCardProps> = ({ field }) => {
  const { t, i18n } = useTranslation();
  const isMr = i18n.language.startsWith('mr');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-[#76C457] hover:shadow-md transition-all p-5 flex flex-col justify-between shadow-xs">
      <div>
        {/* Header: Gat Number & Status */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF8CF] border border-[#FBE6C2] text-[#2A7C13] flex items-center justify-center font-black text-sm">
              #{field.gat_no}
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 leading-tight">
                {isMr ? `गट क्र. ${field.gat_no}` : `Gat No. ${field.gat_no}`}
                {field.sub_division ? `/${field.sub_division}` : ''}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#2A7C13]" />
                {field.village_name}, {field.taluka_name}, {field.district_name}
              </p>
            </div>
          </div>

          <StatusBadge status={field.overall_status || 'Good'} />
        </div>

        {/* Ownership Relationship */}
        <div className="p-2.5 rounded-xl bg-[#fbfcf9] border border-slate-100 text-xs mb-3 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <User className="w-3 h-3 text-[#2A7C13]" />
              <span>{t('myFarm.ownerName')}:</span>
            </span>
            <strong className="text-slate-900 font-bold truncate max-w-[170px]">
              {field.owner_name?.split('(')[0].trim() || 'Pradip Bhauso Shelar'}
            </strong>
          </div>
          {field.owner_relation && (
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>{t('myFarm.ownerRelation')}:</span>
              <span className="font-semibold text-[#2A7C13]">{field.owner_relation}</span>
            </div>
          )}
        </div>

        {/* Field Details Grid */}
        <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-[#FFF8CF]/30 rounded-xl text-xs border border-[#FBE6C2]/60">
          <div>
            <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">
              {t('myFarm.fieldArea')}
            </span>
            <strong className="text-slate-900 font-black block">
              {field.area_acres} Acres ({field.area_hectares} Ha)
            </strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">
              {t('dashboard.soilType')}
            </span>
            <strong className="text-slate-800 font-bold block truncate" title={field.soil_type}>
              {field.soil_type ? field.soil_type.split('(')[0].trim() : 'Medium Black Soil'}
            </strong>
          </div>
          {field.crop_pattern && (
            <div className="col-span-2 pt-1.5 border-t border-[#FBE6C2]/80">
              <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">
                {t('dashboard.cropPattern')}
              </span>
              <span className="text-slate-800 font-semibold block truncate">
                {field.crop_pattern}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="text-[11px] text-slate-500 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-[#2A7C13]" />
          <span>{field.last_tested_date || '15 Aug 2026'}</span>
        </div>

        <Link
          to={`/farmer/field/${field.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A7C13] hover:bg-[#22650f] text-white font-bold text-xs shadow-2xs transition-colors"
        >
          <span>{t('myFarm.viewField')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
