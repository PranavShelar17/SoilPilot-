import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { MapContainer } from '../components/MapContainer';
import {
  FileSpreadsheet,
  BarChart3,
  Map as MapIcon,
  Lightbulb,
  MapPin,
  Calendar,
  Layers,
  User,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { DEMO_FIELDS, DEMO_SOIL_CARDS, DEMO_FARMER } from '../data/demoData';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { useTranslation } from 'react-i18next';

export const FieldDetails: React.FC = () => {
  const { fieldId } = useParams<{ fieldId: string }>();
  const { farmer, user } = useAuth();
  const { t, i18n } = useTranslation();
  const isMr = i18n.language.startsWith('mr');

  const currentFarmer = farmer || user?.farmer || DEMO_FARMER;
  const farmerName = currentFarmer.full_name?.split('(')[0].trim() || 'Pradip Bhauso Shelar';

  const numericId = parseInt(fieldId || '104', 10);
  const field = DEMO_FIELDS.find((f) => f.id === numericId || f.gat_no === fieldId) || DEMO_FIELDS[0];
  const soilCard = DEMO_SOIL_CARDS[field.id] || DEMO_SOIL_CARDS[104];

  return (
    <AppLayout
      headerTitle={t('fieldDetails.title')}
      headerSubtitle={`Gat No. ${field.gat_no} • ${field.village_name}, ${field.taluka_name}`}
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Link
                to="/farmer/fields"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                title="Back to My Farm"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {isMr ? `गट क्र. ${field.gat_no}` : `Gat No. ${field.gat_no}`}
                {field.sub_division ? `/${field.sub_division}` : ''}
              </h1>
              <StatusBadge status={field.overall_status || 'Good'} />
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#2A7C13]" />
              {field.village_name}, {field.taluka_name}, {field.district_name}, Maharashtra
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/farmer/field/${field.id}/soil-health`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2A7C13] hover:bg-[#22650f] text-white text-xs font-bold shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{t('fieldDetails.viewSoilCard')}</span>
            </Link>

            <Link
              to="/farmer/soil-analysis"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF8CF] hover:bg-[#FBE6C2] text-[#2A7C13] text-xs font-bold border border-[#FBE6C2] transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span>{t('fieldDetails.viewSoilAnalysis')}</span>
            </Link>
          </div>
        </div>

        {/* Two-Column Layout: Left Details Panels, Right GIS Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 5 cols: Farmer, Owner, and Field Attributes */}
          <div className="lg:col-span-5 space-y-4">
            {/* Farmer & Owner Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                <User className="w-4 h-4 text-[#2A7C13]" />
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  {t('fieldDetails.farmerOwnerInfo')}
                </h2>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t('myFarm.farmerName')}</span>
                  <strong className="text-slate-900 font-bold">{farmerName}</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t('myFarm.ownerName')}</span>
                  <strong className="text-slate-900 font-bold">
                    {field.owner_name?.split('(')[0].trim() || farmerName}
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t('myFarm.ownerRelation')}</span>
                  <span className="font-semibold text-[#2A7C13]">
                    {field.owner_relation || 'Self Owner'}
                  </span>
                </div>

                {field.owner_contact && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{t('myFarm.ownerContact')}</span>
                    <span className="font-mono text-slate-800">{field.owner_contact}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Field Cadastral Attributes */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                <Layers className="w-4 h-4 text-[#2A7C13]" />
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  {t('fieldDetails.fieldInfo')}
                </h2>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t('myFarm.gatNo')}</span>
                  <strong className="text-slate-900 font-bold">{field.gat_no}</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t('myFarm.fieldArea')}</span>
                  <strong className="text-slate-900 font-black">
                    {field.area_acres} {t('fieldDetails.acres')} ({field.area_hectares} {t('fieldDetails.hectares')})
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t('myFarm.village')}</span>
                  <span className="text-slate-800 font-medium">{field.village_name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t('myFarm.taluka')} / {t('myFarm.district')}</span>
                  <span className="text-slate-800 font-medium">{field.taluka_name}, {field.district_name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t('fieldDetails.latitude')} / {t('fieldDetails.longitude')}</span>
                  <span className="text-slate-800 font-mono text-[11px]">
                    {field.centroid?.[0].toFixed(4)}° N, {field.centroid?.[1].toFixed(4)}° E
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t('fieldDetails.soilClassification')}</span>
                  <span className="text-slate-800 font-semibold">{field.soil_type || 'Medium Black Soil'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t('dashboard.cropPattern')}</span>
                  <span className="text-slate-800 font-medium">{field.crop_pattern}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t('fieldDetails.irrigationSource')}</span>
                  <span className="text-slate-800 font-medium">{field.irrigation_source}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t('fieldDetails.lastTestedDate')}</span>
                  <span className="text-slate-800 font-semibold">{field.last_tested_date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 7 cols: Actual GIS Field Map with Polygon */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-[#2A7C13]" />
                <h2 className="text-sm font-black text-slate-900 tracking-tight">
                  {t('fieldDetails.cadastralMap')}
                </h2>
              </div>
              <span className="text-[11px] font-bold text-[#2A7C13] bg-[#FFF8CF] px-2.5 py-0.5 rounded-full border border-[#FBE6C2]">
                WGS84 • EPSG:4326
              </span>
            </div>

            <div className="h-96 w-full rounded-xl overflow-hidden border border-slate-200">
              <MapContainer
                fields={[field]}
                selectedFieldId={field.id}
                interactive={true}
                showBoundary={true}
                height="100%"
              />
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              {isMr
                ? 'नकाशावर दाखवलेली सीमा या गटाची प्रत्यक्ष भौमितिक सीमा दर्शवते.'
                : 'Polygon boundary rendered from authenticated geospatial coordinates. Displays actual cadastral perimeter.'}
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default FieldDetails;
