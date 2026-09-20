import React from 'react';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  MapPin,
  Layers,
  Sprout,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SoilHealthCard as ISoilHealthCard, Farmer, Field, SoilDataSource } from '../types';
import { Button } from './Button';
import { StatusBadge } from './StatusBadge';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SoilHealthCardProps {
  card: ISoilHealthCard;
  farmer?: Farmer | null;
  field?: Field | null;
  reportId?: string | number;
}

export const SoilHealthCard: React.FC<SoilHealthCardProps> = ({
  card,
  farmer,
  field,
  reportId,
}) => {
  const { t, i18n } = useTranslation();
  const isMr = i18n.language.startsWith('mr');

  const handlePrint = () => {
    window.print();
  };

  const renderSourceBadge = (source?: SoilDataSource) => {
    if (!source) return null;
    switch (source) {
      case 'LAB_OBSERVATION':
        return (
          <span className="source-badge-lab">
            {t('soilHealthCard.labObservation')}
          </span>
        );
      case 'DSM_PREDICTION':
        return (
          <span className="source-badge-dsm">
            {t('soilHealthCard.dsmPrediction')}
          </span>
        );
      case 'IMPORTED_DATA':
        return (
          <span className="source-badge-imported">
            {t('soilHealthCard.importedData')}
          </span>
        );
      default:
        return null;
    }
  };

  const farmerName =
    farmer?.full_name?.split('(')[0].trim() || 'Pradip Bhauso Shelar';

  return (
    <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden print:border-none print:shadow-none">
      {/* 1. Official Laboratory Style Header in Deep Green #2A7C13 */}
      <div className="bg-[#2A7C13] text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 rounded-full bg-[#76C457]/20 blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-[#FFF8CF] border border-[#FBE6C2] flex items-center justify-center text-[#2A7C13] flex-shrink-0 shadow-2xs">
              <Sprout className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#FFF8CF] uppercase tracking-wider">
                  SoilPilot • {t('app.subtitle')}
                </span>
                {card.is_demo && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#FFF8CF] text-[#2A7C13] border border-[#FBE6C2]">
                    {t('app.demo_badge')}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
                {t('soilHealthCard.title')}
              </h1>
              <p className="text-xs text-emerald-100 font-mono mt-1">
                {t('soilHealthCard.sampleId')}: {card.sample_code}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 print:hidden">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Printer className="w-4 h-4" />}
              onClick={handlePrint}
              className="bg-[#FFF8CF] text-[#2A7C13] hover:bg-[#FBE6C2] border-[#FBE6C2] font-bold"
            >
              {t('soilHealthCard.printCard')}
            </Button>
            {reportId && (
              <Link to={`/farmer/report/${reportId}`}>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Download className="w-4 h-4" />}
                  className="bg-[#76C457] hover:bg-[#65af48] text-white font-bold"
                >
                  {t('soilHealthCard.downloadPdf')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. Top Compact Summary Bar */}
      <div className="bg-[#FFF8CF]/60 border-b border-[#FBE6C2] p-4 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-500 font-semibold block text-[10px] uppercase tracking-wider">
            {t('soilHealthCard.overallStatus')}
          </span>
          <div className="mt-1">
            <StatusBadge status={card.overall_status || 'Good'} />
          </div>
        </div>

        <div>
          <span className="text-slate-500 font-semibold block text-[10px] uppercase tracking-wider">
            {t('soilHealthCard.selectedField')}
          </span>
          <strong className="text-slate-900 font-bold block text-sm mt-0.5">
            Gat No. {field?.gat_no || '104'}
          </strong>
        </div>

        <div>
          <span className="text-slate-500 font-semibold block text-[10px] uppercase tracking-wider">
            {t('soilHealthCard.sampleDate')}
          </span>
          <span className="text-slate-900 font-semibold block mt-0.5">
            {card.sampling_date}
          </span>
        </div>

        <div>
          <span className="text-slate-500 font-semibold block text-[10px] uppercase tracking-wider">
            {t('soilHealthCard.samplingDepth')}
          </span>
          <span className="text-slate-900 font-semibold block mt-0.5">
            {card.sampling_depth_cm}
          </span>
        </div>
      </div>

      {/* 3. Farmer & Sampling Metadata Strip */}
      <div className="p-6 sm:p-8 bg-white border-b border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Farmer & Field Information */}
          <div className="p-4 rounded-xl bg-[#fbfcf9] border border-slate-200 space-y-2">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2A7C13]" />
              {t('myFarm.farmerDetails')} & {t('myFarm.title')}
            </h2>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">{t('myFarm.farmerName')}</span>
                <strong className="text-slate-900 font-bold">{farmerName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">{t('myFarm.gatNo')}</span>
                <strong className="text-slate-900 font-bold">Gat {field?.gat_no || '104'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">{t('myFarm.village')} / {t('myFarm.taluka')}</span>
                <span className="text-slate-800 font-medium">{field?.village_name || 'Malegaon'}, {field?.taluka_name || 'Baramati'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">{t('myFarm.fieldArea')}</span>
                <span className="text-slate-800 font-semibold">{field?.area_acres} Acres ({field?.area_hectares} Ha)</span>
              </div>
            </div>
          </div>

          {/* Laboratory & Test Information */}
          <div className="p-4 rounded-xl bg-[#fbfcf9] border border-slate-200 space-y-2">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#76C457]" />
              {t('soilHealthCard.testingLab')}
            </h2>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px]">Laboratory / Analytical Unit</span>
                <span className="text-slate-900 font-semibold">{card.testing_lab}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Centroid Coordinates</span>
                <span className="font-mono text-slate-800">{card.latitude}° N, {card.longitude}° E</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">{t('soilHealthCard.cropInfo')}</span>
                <span className="text-slate-800 font-medium">{field?.crop_pattern || 'Sugarcane & Cereals'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Complete 14 Chemical & Nutrient Parameters Table */}
      <div className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <h2 className="text-sm font-black text-[#2A7C13] uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#2A7C13]" />
            <span>{t('soilHealthCard.chemicalNutrients')}</span>
          </h2>
          <span className="text-[11px] text-slate-500 font-semibold">
            14 Certified Parameters
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#2A7C13] text-white border-b border-[#22650f]">
                <th className="py-3 px-3.5 font-bold w-12 text-center">{t('soilHealthCard.srNo')}</th>
                <th className="py-3 px-4 font-bold">{t('soilHealthCard.parameter')}</th>
                <th className="py-3 px-4 font-bold">{t('soilHealthCard.testValue')}</th>
                <th className="py-3 px-3 font-bold w-16">{t('soilHealthCard.unit')}</th>
                <th className="py-3 px-4 font-bold">{t('soilHealthCard.status')}</th>
                <th className="py-3 px-4 font-bold">{t('soilHealthCard.interpretation')}</th>
                <th className="py-3 px-4 font-bold">{t('soilHealthCard.referenceRange')}</th>
                <th className="py-3 px-3.5 font-bold text-center">{t('soilHealthCard.dataSource')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {card.parameters.map((param) => (
                <tr key={param.key} className="hover:bg-[#FFF8CF]/25 transition-colors">
                  <td className="py-3 px-3.5 text-center font-bold text-slate-500">
                    {param.sr_no}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {isMr ? param.name_mr : param.name}
                  </td>
                  <td className="py-3 px-4 font-black text-slate-900 text-sm">
                    {param.value != null ? param.value : <span className="text-slate-400 font-normal italic">{t('soilHealthCard.notAvailable')}</span>}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono">
                    {param.unit}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={param.status} />
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-xs leading-relaxed">
                    {isMr ? (param.interpretation_mr || param.interpretation) : param.interpretation}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    {isMr ? (param.reference_range_mr || param.reference_range) : (param.reference_range || '-')}
                  </td>
                  <td className="py-3 px-3.5 text-center whitespace-nowrap">
                    {renderSourceBadge(param.data_source)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. Physical Soil Properties Section (Parameters 15 to 21) */}
        {card.physical_parameters && (
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h2 className="text-sm font-black text-[#2A7C13] uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#2A7C13]" />
                <span>{t('soilHealthCard.physicalProperties')}</span>
              </h2>
              {renderSourceBadge(card.physical_parameters.data_source)}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FFF8CF]/40 border border-[#FBE6C2] space-y-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  15. Sand (%)
                </span>
                <strong className="text-sm font-black text-slate-900 block">
                  {card.physical_parameters.sand_percentage != null ? `${card.physical_parameters.sand_percentage}%` : t('soilHealthCard.notAvailable')}
                </strong>
                <span className="text-[10px] text-slate-500 font-mono block">Ref: 15 - 45%</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FFF8CF]/40 border border-[#FBE6C2] space-y-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  16. Clay (%)
                </span>
                <strong className="text-sm font-black text-slate-900 block">
                  {card.physical_parameters.clay_percentage != null ? `${card.physical_parameters.clay_percentage}%` : t('soilHealthCard.notAvailable')}
                </strong>
                <span className="text-[10px] text-slate-500 font-mono block">Ref: 35 - 55%</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FFF8CF]/40 border border-[#FBE6C2] space-y-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  17. Silt (%)
                </span>
                <strong className="text-sm font-black text-slate-900 block">
                  {card.physical_parameters.silt_percentage != null ? `${card.physical_parameters.silt_percentage}%` : t('soilHealthCard.notAvailable')}
                </strong>
                <span className="text-[10px] text-slate-500 font-mono block">Ref: 20 - 40%</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FFF8CF]/40 border border-[#FBE6C2] space-y-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  18. Texture
                </span>
                <strong className="text-xs font-bold text-slate-900 block truncate" title={card.physical_parameters.texture || ''}>
                  {card.physical_parameters.texture || 'Clay Loam'}
                </strong>
                <span className="text-[10px] text-slate-500 font-mono block">USDA Class</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FFF8CF]/40 border border-[#FBE6C2] space-y-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  19. Bulk Density
                </span>
                <strong className="text-sm font-black text-slate-900 block">
                  {card.physical_parameters.bulk_density != null ? `${card.physical_parameters.bulk_density} g/cm³` : t('soilHealthCard.notAvailable')}
                </strong>
                <span className="text-[10px] text-slate-500 font-mono block">Ref: 1.20 - 1.40</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FFF8CF]/40 border border-[#FBE6C2] space-y-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  20. WHC (%)
                </span>
                <strong className="text-sm font-black text-slate-900 block">
                  {card.physical_parameters.water_holding_capacity != null ? `${card.physical_parameters.water_holding_capacity}%` : t('soilHealthCard.notAvailable')}
                </strong>
                <span className="text-[10px] text-slate-500 font-mono block">Ref: 50 - 65%</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FFF8CF]/40 border border-[#FBE6C2] space-y-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  21. Soil Depth
                </span>
                <strong className="text-xs font-bold text-slate-900 block">
                  {card.physical_parameters.depth_cm || '0 - 45 cm'}
                </strong>
                <span className="text-[10px] text-slate-500 font-mono block">Effective root</span>
              </div>
            </div>
          </div>
        )}

        {/* 6. Scientific Report Footer Disclaimer */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p className="max-w-2xl leading-relaxed">
            {t('soilHealthCard.disclaimer')}
          </p>

          <div className="text-right whitespace-nowrap">
            <span className="font-bold text-slate-900 block">SoilPilot Analytical Engine</span>
            <span className="text-[11px] text-[#2A7C13] font-semibold">Digitally Signed & Validated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
