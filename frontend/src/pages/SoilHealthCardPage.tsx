import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { SoilHealthCard } from '../components/SoilHealthCard';
import { ArrowLeft, FileSpreadsheet } from 'lucide-react';
import { DEMO_FIELDS, DEMO_SOIL_CARDS, DEMO_FARMER } from '../data/demoData';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const SoilHealthCardPage: React.FC = () => {
  const { fieldId } = useParams<{ fieldId?: string }>();
  const { farmer, user } = useAuth();
  const { t, i18n } = useTranslation();
  const isMr = i18n.language.startsWith('mr');

  const currentFarmer = farmer || user?.farmer || DEMO_FARMER;

  const [selectedFieldId, setSelectedFieldId] = useState<number>(
    fieldId ? parseInt(fieldId, 10) : 104
  );

  const field =
    DEMO_FIELDS.find((f) => f.id === selectedFieldId) || DEMO_FIELDS[0];

  const soilCard =
    DEMO_SOIL_CARDS[field.id] || DEMO_SOIL_CARDS[104];

  return (
    <AppLayout
      headerTitle={t('soilHealthCard.title')}
      headerSubtitle="SoilPilot Digital Soil Mapping & Soil Health Records"
    >
      <div className="space-y-6">
        {/* Top Navigation & Plot Switcher Strip */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <Link
              to="/farmer/dashboard"
              className="p-2 rounded-xl border border-slate-200 hover:bg-[#FFF8CF]/50 text-slate-700 transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h2 className="text-base font-black text-slate-900 leading-tight">
                {isMr ? `मृदा आरोग्य पत्रिका — गट क्र. ${field.gat_no}` : `Soil Health Card — Gat No. ${field.gat_no}`}
              </h2>
              <p className="text-xs text-slate-500">
                {field.village_name}, {field.taluka_name}, {field.district_name} • Sample: {soilCard.sample_code}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <label htmlFor="soil-card-plot-select" className="text-xs font-bold text-slate-700 whitespace-nowrap">
              {t('dashboard.selectPlot')}:
            </label>
            <select
              id="soil-card-plot-select"
              value={field.id}
              onChange={(e) => setSelectedFieldId(parseInt(e.target.value, 10))}
              className="px-3.5 py-2 text-xs font-bold text-[#2A7C13] bg-[#FFF8CF]/40 border border-[#FBE6C2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
            >
              {DEMO_FIELDS.map((f) => (
                <option key={f.id} value={f.id}>
                  Gat No. {f.gat_no} ({f.area_acres} Acres - {f.village_name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* The Digital Soil Health Card */}
        <SoilHealthCard
          card={soilCard}
          farmer={currentFarmer}
          field={field}
          reportId={`rep-${field.id}-01`}
        />
      </div>
    </AppLayout>
  );
};

export default SoilHealthCardPage;
