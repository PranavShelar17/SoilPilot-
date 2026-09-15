import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { FieldCard } from '../components/FieldCard';
import { Search, Trees, User, Phone, MapPin, ShieldCheck, Hash } from 'lucide-react';
import { DEMO_FIELDS, DEMO_FARMER } from '../data/demoData';
import { Field } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const FarmerFields: React.FC = () => {
  const { farmer, user } = useAuth();
  const { t, i18n } = useTranslation();
  const isMr = i18n.language.startsWith('mr');

  const currentFarmer = farmer || user?.farmer || DEMO_FARMER;
  const farmerName = currentFarmer.full_name?.split('(')[0].trim() || 'Pradip Bhauso Shelar';

  const [fields] = useState<Field[]>(DEMO_FIELDS);
  const [search, setSearch] = useState('');

  const filtered = fields.filter(
    (f) =>
      f.gat_no.toLowerCase().includes(search.toLowerCase()) ||
      f.village_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout headerTitle={t('myFarm.title')} headerSubtitle={t('myFarm.subtitle')}>
      <div className="space-y-6">
        {/* 1. Farmer Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-[#FFF8CF] border border-[#FBE6C2] flex items-center justify-center text-[#2A7C13]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                {t('myFarm.farmerDetails')}
              </h2>
              <p className="text-[11px] text-slate-500">
                {isMr ? 'अधिकृत शेतकरी प्रोफाइल माहिती' : 'Authorized Farmer Profile & Authentication'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <div className="p-3 rounded-xl bg-[#fbfcf9] border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t('myFarm.farmerName')}
              </span>
              <strong className="text-sm font-black text-slate-900 block mt-0.5">
                {farmerName}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-[#fbfcf9] border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t('myFarm.mobile')}
              </span>
              <strong className="text-sm font-black text-slate-900 block mt-0.5 font-mono">
                +91 {currentFarmer.mobile || '9876543210'}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-[#fbfcf9] border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t('myFarm.farmerId')}
              </span>
              <strong className="text-sm font-black text-slate-900 block mt-0.5 font-mono">
                SP-MH-PUN-{currentFarmer.id || '101'}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-[#fbfcf9] border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t('myFarm.village')} & {t('myFarm.taluka')}
              </span>
              <strong className="text-sm font-black text-slate-900 block mt-0.5">
                {currentFarmer.village}, {currentFarmer.taluka}
              </strong>
            </div>
          </div>
        </div>

        {/* 2. My Fields Section Header & Search */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Trees className="w-5 h-5 text-[#2A7C13]" />
              <h2 className="text-base font-black text-slate-900">
                {t('myFarm.myFields')}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isMr
                ? 'आपल्या अधिकृत खात्याशी जोडलेले सर्व शेतजमीन गट'
                : 'All agricultural parcels registered under your cultivator profile'}
            </p>
          </div>

          <div className="w-full sm:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t('myFarm.searchFields')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2A7C13] transition-all"
            />
          </div>
        </div>

        {/* 3. Fields Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((field) => (
              <FieldCard key={field.id} field={field} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            {t('myFarm.noFieldsFound')}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default FarmerFields;
