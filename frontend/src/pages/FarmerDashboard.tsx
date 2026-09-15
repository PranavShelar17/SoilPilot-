import React, { useState } from 'react';
import {
  Sprout,
  Trees,
  FileSpreadsheet,
  Map,
  BarChart3,
  Lightbulb,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { PlotMapCard } from '../components/gis/PlotMapCard';
import { FieldSearch } from '../components/FieldSearch';
import { StatusBadge } from '../components/StatusBadge';
import { StatCard } from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { Field, SoilHealthCard as ISoilHealthCard } from '../types';
import { DEMO_FIELDS, DEMO_SOIL_CARDS, DEMO_FARMER } from '../data/demoData';
import { useTranslation } from 'react-i18next';

export const FarmerDashboard: React.FC = () => {
  const { farmer, user } = useAuth();
  const { t, i18n } = useTranslation();
  const isMr = i18n.language.startsWith('mr');

  const currentFarmer = farmer || user?.farmer || DEMO_FARMER;
  const farmerName = currentFarmer.full_name?.split('(')[0].trim() || 'Pradip Bhauso Shelar';

  // Selected Field / Plot state
  const [selectedFieldId, setSelectedFieldId] = useState<number>(104);

  const activeField: Field =
    DEMO_FIELDS.find((f) => f.id === selectedFieldId) || DEMO_FIELDS[0];

  const activeSoilCard: ISoilHealthCard =
    DEMO_SOIL_CARDS[activeField.id] || DEMO_SOIL_CARDS[104];

  const handleSelectField = (id: number | string) => {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    setSelectedFieldId(numericId);
  };

  return (
    <AppLayout
      headerTitle="SoilPilot"
      headerSubtitle="Digital Soil Mapping & Soil Health Portal"
    >
      <div className="space-y-6">
        {/* 1. Welcome Header Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-[#FFF8CF] border border-[#FBE6C2] flex items-center justify-center text-[#2A7C13] shadow-2xs">
              <Sprout className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#2A7C13] uppercase tracking-wider">
                  SoilPilot • {isMr ? 'शेतकरी डॅशबोर्ड' : 'Farmer Dashboard'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#FFF8CF] text-[#2A7C13] border border-[#FBE6C2] rounded-md">
                  {t('app.demo_badge')}
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {t('dashboard.greeting', { name: farmerName })}
              </h1>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span>{t('myFarm.village')}: <strong className="text-slate-800 font-bold">{currentFarmer.village}</strong></span>
                <span>•</span>
                <span>{t('myFarm.taluka')}: <strong className="text-slate-800 font-bold">{currentFarmer.taluka}</strong></span>
                <span>•</span>
                <span>{t('myFarm.district')}: <strong className="text-slate-800 font-bold">{currentFarmer.district}</strong></span>
              </p>
            </div>
          </div>

          {/* Plot Switcher dropdown */}
          <div className="w-full md:w-auto flex items-center gap-2 self-stretch md:self-auto bg-[#FFF8CF]/40 border border-[#FBE6C2] p-2 rounded-xl">
            <label htmlFor="dashboard-plot-select" className="text-xs font-bold text-slate-700 whitespace-nowrap pl-1">
              {t('dashboard.selectPlot')}:
            </label>
            <select
              id="dashboard-plot-select"
              value={activeField.id}
              onChange={(e) => handleSelectField(Number(e.target.value))}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-black text-[#2A7C13] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
            >
              {DEMO_FIELDS.map((f) => (
                <option key={f.id} value={f.id}>
                  Gat No. {f.gat_no} ({f.area_acres} Acres - {f.village_name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Hierarchical Location & Field Search */}
        <FieldSearch onSelectField={handleSelectField} />

        {/* 3. Top Key Stat Cards for Selected Plot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label={t('myFarm.gatNo')}
            value={`Gat ${activeField.gat_no}`}
            subvalue={`${activeField.village_name}, ${activeField.taluka_name}`}
            icon={<Trees className="w-5 h-5 text-[#2A7C13]" />}
          />

          <StatCard
            label={t('dashboard.area')}
            value={`${activeField.area_acres} Acres`}
            subvalue={`(${activeField.area_hectares} Hectares)`}
            icon={<Map className="w-5 h-5 text-[#2A7C13]" />}
          />

          <StatCard
            label={t('dashboard.overallStatus')}
            value={activeSoilCard.overall_status || 'Good'}
            badge={<StatusBadge status={activeSoilCard.overall_status || 'Good'} />}
            subvalue={`Tested: ${activeSoilCard.sampling_date}`}
            icon={<FileSpreadsheet className="w-5 h-5 text-[#2A7C13]" />}
          />

          <StatCard
            label={t('myFarm.ownerName')}
            value={activeField.owner_name?.split('(')[0].trim() || farmerName}
            subvalue={activeField.owner_relation || 'Self Owner'}
            icon={<ShieldCheck className="w-5 h-5 text-[#2A7C13]" />}
          />
        </div>

        {/* 4. GIS Field Cadastral Map + Soil Health Summary Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 cols: MapLibre GIS Field Map with real boundary */}
          <div className="lg:col-span-7">
            <PlotMapCard field={activeField} />
          </div>

          {/* Right 5 cols: Soil Health Overview for active field */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#2A7C13]" />
                <h2 className="text-sm font-black text-slate-900 tracking-tight">
                  {t('dashboard.soilHealthSummary')}
                </h2>
              </div>
              <Link
                to={`/farmer/field/${activeField.id}/soil-health`}
                className="text-xs font-bold text-[#2A7C13] hover:underline inline-flex items-center gap-1"
              >
                <span>{t('soilHealthCard.printCard')}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Quick parameter list */}
            <div className="space-y-2.5">
              {activeSoilCard.parameters.slice(0, 6).map((param) => (
                <div
                  key={param.key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#fbfcf9] border border-slate-100 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800 block">
                      {isMr ? param.name_mr : param.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Ref: {isMr ? (param.reference_range_mr || param.reference_range) : param.reference_range}
                    </span>
                  </div>

                  <div className="text-right flex items-center gap-2">
                    <span className="font-black text-slate-900">
                      {param.value != null ? `${param.value} ${param.unit}` : t('common.notAvailable')}
                    </span>
                    <StatusBadge status={param.status} />
                  </div>
                </div>
              ))}
            </div>

            <Link
              to={`/farmer/field/${activeField.id}/soil-health`}
              className="w-full py-2.5 px-4 rounded-xl bg-[#FFF8CF] hover:bg-[#FBE6C2] text-[#2A7C13] font-bold text-xs border border-[#FBE6C2] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>{t('dashboard.viewSoilCard')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 5. Quick Actions Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            {t('dashboard.quickActions')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to={`/farmer/field/${activeField.id}/soil-health`}
              className="p-4 rounded-2xl bg-[#FFF8CF]/50 hover:bg-[#FFF8CF] border border-[#FBE6C2] transition-all group flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2A7C13] text-white flex items-center justify-center flex-shrink-0 group-hover:bg-[#76C457] transition-colors">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 group-hover:text-[#2A7C13] transition-colors">
                  {t('dashboard.viewSoilCard')}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isMr ? '२१ घटक तपासणी अहवाल' : '21 Soil Parameter Report'}
                </p>
              </div>
            </Link>

            <Link
              to="/farmer/soil-maps"
              className="p-4 rounded-2xl bg-[#FFF8CF]/50 hover:bg-[#FFF8CF] border border-[#FBE6C2] transition-all group flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2A7C13] text-white flex items-center justify-center flex-shrink-0 group-hover:bg-[#76C457] transition-colors">
                <Map className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 group-hover:text-[#2A7C13] transition-colors">
                  {t('dashboard.viewDigitalMaps')}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isMr ? 'उच्च दर्जाचे GIS थर' : 'High-Res Nutrient Rasters'}
                </p>
              </div>
            </Link>

            <Link
              to="/farmer/soil-analysis"
              className="p-4 rounded-2xl bg-[#FFF8CF]/50 hover:bg-[#FFF8CF] border border-[#FBE6C2] transition-all group flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2A7C13] text-white flex items-center justify-center flex-shrink-0 group-hover:bg-[#76C457] transition-colors">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 group-hover:text-[#2A7C13] transition-colors">
                  {t('nav.soilAnalysis')}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isMr ? 'गटनिहाय तुलनात्मक आलेख' : 'Plot-Specific Science Graphs'}
                </p>
              </div>
            </Link>

            <Link
              to="/farmer/recommendations"
              className="p-4 rounded-2xl bg-[#FFF8CF]/50 hover:bg-[#FFF8CF] border border-[#FBE6C2] transition-all group flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2A7C13] text-white flex items-center justify-center flex-shrink-0 group-hover:bg-[#76C457] transition-colors">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 group-hover:text-[#2A7C13] transition-colors">
                  {t('dashboard.viewRecommendations')}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isMr ? 'माती व्यवस्थापन सल्ला' : 'Soil Health Advisory'}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default FarmerDashboard;
