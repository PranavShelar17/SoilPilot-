import React, { useState, useMemo } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { SoilMap } from '../components/map/SoilMap';
import { Layers, Info, MapPin, Check, Trees, Sparkles, AlertCircle } from 'lucide-react';
import { DEMO_FIELDS, DEMO_SOIL_CARDS } from '../data/demoData';
import { useTranslation } from 'react-i18next';

interface DsmPropertyConfig {
  key: string;
  name: string;
  nameMr: string;
  propertyCategory: string;
  depth: string;
  unit: string;
  minVal: number;
  maxVal: number;
  lowThreshold: string;
  mediumThreshold: string;
  highThreshold: string;
  modelVersion: string;
  accuracyR2: number;
  description: string;
  descriptionMr: string;
}

const DSM_SUPPORTED_PROPERTIES: DsmPropertyConfig[] = [
  {
    key: 'ph',
    name: 'Soil pH',
    nameMr: 'मातीचा सामू (pH)',
    propertyCategory: 'Chemical Reaction',
    depth: '0 - 15 cm',
    unit: 'pH',
    minVal: 6.0,
    maxVal: 8.8,
    lowThreshold: '< 6.50 (Acidic)',
    mediumThreshold: '6.50 - 7.50 (Neutral)',
    highThreshold: '> 7.50 (Alkaline)',
    modelVersion: 'DSM-RF-v1.4',
    accuracyR2: 0.81,
    description: 'Continuous spatial prediction of topsoil pH using Random Forest calibrated with Sentinel-2 covariates.',
    descriptionMr: 'सॅटेलाइट माहिती व रँडम फॉरेस्ट मॉडेलद्वारे मातीच्या सामूचे अचूक नकाशा वितरण.'
  },
  {
    key: 'ec',
    name: 'Electrical Conductivity (EC)',
    nameMr: 'विद्युत चालकता (EC)',
    propertyCategory: 'Salinity',
    depth: '0 - 15 cm',
    unit: 'dS/m',
    minVal: 0.1,
    maxVal: 1.2,
    lowThreshold: '< 0.50 (Low)',
    mediumThreshold: '0.50 - 1.00 (Normal)',
    highThreshold: '> 1.00 (Saline)',
    modelVersion: 'DSM-XGB-v2.1',
    accuracyR2: 0.78,
    description: 'Soil salinity mapping calibrated to Baramati command area root zones.',
    descriptionMr: 'बारामती परिसरातील क्षारतेचे नकाशा वितरण.'
  },
  {
    key: 'oc',
    name: 'Organic Carbon (OC)',
    nameMr: 'सेंद्रिय कर्ब (OC)',
    propertyCategory: 'Organic Matter',
    depth: '0 - 30 cm',
    unit: '%',
    minVal: 0.25,
    maxVal: 1.10,
    lowThreshold: '< 0.50% (Low)',
    mediumThreshold: '0.50 - 0.75% (Medium)',
    highThreshold: '> 0.75% (High)',
    modelVersion: 'DSM-RF-v1.6',
    accuracyR2: 0.84,
    description: 'Digital mapping of soil organic carbon for fertility assessment.',
    descriptionMr: 'जमिनीच्या सुपीकतेसाठी सेंद्रिय कर्बाचे डिजिटल मॅपिंग.'
  },
  {
    key: 'n',
    name: 'Available Nitrogen (N)',
    nameMr: 'उपलब्ध नत्र (N)',
    propertyCategory: 'Macro Nutrient',
    depth: '0 - 15 cm',
    unit: 'kg/ha',
    minVal: 140,
    maxVal: 380,
    lowThreshold: '< 280 kg/ha (Low)',
    mediumThreshold: '280 - 560 kg/ha (Medium)',
    highThreshold: '> 560 kg/ha (High)',
    modelVersion: 'DSM-EN-v1.2',
    accuracyR2: 0.74,
    description: 'Spatial distribution of plant-available mineral nitrogen.',
    descriptionMr: 'उपलब्ध नत्राचे क्षेत्रनिहाय वितरण.'
  },
  {
    key: 'p',
    name: 'Available Phosphorus (P)',
    nameMr: 'उपलब्ध स्फुरद (P)',
    propertyCategory: 'Macro Nutrient',
    depth: '0 - 15 cm',
    unit: 'kg/ha',
    minVal: 8,
    maxVal: 35,
    lowThreshold: '< 14.0 kg/ha (Low)',
    mediumThreshold: '14.0 - 28.0 kg/ha (Medium)',
    highThreshold: '> 28.0 kg/ha (High)',
    modelVersion: 'DSM-RF-v1.3',
    accuracyR2: 0.77,
    description: 'Olsen extractable phosphorus prediction calibrated across Malegaon clay soils.',
    descriptionMr: 'माळेगाव परिसरातील स्फुरदाचे डिजिटल वितरण.'
  },
  {
    key: 'k',
    name: 'Available Potassium (K)',
    nameMr: 'उपलब्ध पालाश (K)',
    propertyCategory: 'Macro Nutrient',
    depth: '0 - 15 cm',
    unit: 'kg/ha',
    minVal: 160,
    maxVal: 480,
    lowThreshold: '< 140 kg/ha (Low)',
    mediumThreshold: '140 - 280 kg/ha (Medium)',
    highThreshold: '> 280 kg/ha (High)',
    modelVersion: 'DSM-RF-v1.5',
    accuracyR2: 0.86,
    description: 'High native potassium concentration map derived from basaltic parent rock minerals.',
    descriptionMr: 'बेसाल्ट काळ्या जमिनीतील उपलब्ध पालाश नकाशा.'
  },
  {
    key: 'clay',
    name: 'Clay Content (%)',
    nameMr: 'चिकणमाती प्रमाण (%)',
    propertyCategory: 'Soil Texture',
    depth: '0 - 30 cm',
    unit: '%',
    minVal: 20,
    maxVal: 55,
    lowThreshold: '< 30% (Light)',
    mediumThreshold: '30 - 45% (Clay Loam)',
    highThreshold: '> 45% (Heavy Clay)',
    modelVersion: 'DSM-ML-v2.0',
    accuracyR2: 0.88,
    description: 'Granulometric clay fraction prediction influencing soil moisture holding capacity.',
    descriptionMr: 'चिकणमातीचे प्रमाण व जलधारण क्षमतेचे डिजिटल वितरण.'
  },
  {
    key: 'sand',
    name: 'Sand Content (%)',
    nameMr: 'वालुकामय प्रमाण (%)',
    propertyCategory: 'Soil Texture',
    depth: '0 - 30 cm',
    unit: '%',
    minVal: 10,
    maxVal: 45,
    lowThreshold: '< 20% (Fine)',
    mediumThreshold: '20 - 45% (Medium)',
    highThreshold: '> 45% (Coarse)',
    modelVersion: 'DSM-ML-v2.0',
    accuracyR2: 0.82,
    description: 'Coarse fraction distribution across the cadastral landscape.',
    descriptionMr: 'जमिनीतील वाळूचे प्रमाण.'
  },
  {
    key: 'silt',
    name: 'Silt Content (%)',
    nameMr: 'गाळ / पोयटा प्रमाण (%)',
    propertyCategory: 'Soil Texture',
    depth: '0 - 30 cm',
    unit: '%',
    minVal: 15,
    maxVal: 40,
    lowThreshold: '< 20% (Low)',
    mediumThreshold: '20 - 40% (Medium)',
    highThreshold: '> 40% (High)',
    modelVersion: 'DSM-ML-v2.0',
    accuracyR2: 0.79,
    description: 'Medium grain silt fraction prediction.',
    descriptionMr: 'पोयट्याचे मोजलेले प्रमाण.'
  },
  {
    key: 'cec',
    name: 'Cation Exchange Capacity (CEC)',
    nameMr: 'धनायन विनिमय क्षमता (CEC)',
    propertyCategory: 'Chemical Fertility',
    depth: '0 - 30 cm',
    unit: 'meq/100g',
    minVal: 25,
    maxVal: 65,
    lowThreshold: '< 25 meq/100g (Low)',
    mediumThreshold: '25 - 50 meq/100g (Medium)',
    highThreshold: '> 50 meq/100g (High)',
    modelVersion: 'DSM-CEC-v1.0',
    accuracyR2: 0.83,
    description: 'Cation buffering capacity predicting nutrient holding capacity of black clay soil.',
    descriptionMr: 'जमिनीची अन्नद्रव्ये धरून ठेवण्याची क्षमता (CEC).'
  },
  {
    key: 'bulk_density',
    name: 'Bulk Density',
    nameMr: 'जमिनीची घनता (Bulk Density)',
    propertyCategory: 'Physical Compaction',
    depth: '0 - 30 cm',
    unit: 'g/cm³',
    minVal: 1.15,
    maxVal: 1.45,
    lowThreshold: '< 1.15 g/cm³ (Porous)',
    mediumThreshold: '1.15 - 1.40 g/cm³ (Good)',
    highThreshold: '> 1.40 g/cm³ (Compacted)',
    modelVersion: 'DSM-PTF-v1.1',
    accuracyR2: 0.76,
    description: 'Pedotransfer function estimate of soil compaction and root penetration resistance.',
    descriptionMr: 'मुळांच्या वाढीसाठी मातीची घनता व सच्छिद्रता.'
  }
];

export const DigitalSoilMaps: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isMr = i18n.language.startsWith('mr');

  const [selectedFieldId, setSelectedFieldId] = useState<number>(104);
  const [selectedPropertyKey, setSelectedPropertyKey] = useState<string>('ph');

  // Currently selected Field
  const field = useMemo(() => {
    return DEMO_FIELDS.find((f) => f.id === selectedFieldId) || DEMO_FIELDS[0];
  }, [selectedFieldId]);

  // Soil card for current field
  const soilCard = useMemo(() => {
    return DEMO_SOIL_CARDS[field.id] || DEMO_SOIL_CARDS[104];
  }, [field.id]);

  // Selected DSM property config
  const selectedConfig = useMemo(() => {
    return DSM_SUPPORTED_PROPERTIES.find((p) => p.key === selectedPropertyKey) || DSM_SUPPORTED_PROPERTIES[0];
  }, [selectedPropertyKey]);

  // Extract plot value for the selected property
  const currentPlotValue = useMemo(() => {
    if (!soilCard) return null;

    if (selectedConfig.key === 'clay') return soilCard.physical_parameters?.clay_percentage ?? 42.3;
    if (selectedConfig.key === 'sand') return soilCard.physical_parameters?.sand_percentage ?? 24.5;
    if (selectedConfig.key === 'silt') return soilCard.physical_parameters?.silt_percentage ?? 33.2;
    if (selectedConfig.key === 'bulk_density') return soilCard.physical_parameters?.bulk_density ?? 1.28;
    if (selectedConfig.key === 'cec') return 48.5;

    const matchedParam = soilCard.parameters?.find((p) => p.key.toLowerCase() === selectedConfig.key.toLowerCase());
    return matchedParam?.value ?? null;
  }, [soilCard, selectedConfig]);

  const hasData = currentPlotValue !== null && currentPlotValue !== undefined;

  return (
    <AppLayout
      headerTitle={isMr ? 'डिजिटल मृदा नकाशे' : 'Digital Soil Maps'}
      headerSubtitle={
        isMr
          ? 'आपल्या निवडलेल्या शेतासाठी मातीचे गुणधर्म आणि अवकाशीय फरक एक्सप्लोर करा.'
          : 'Explore soil properties and spatial variation for your selected field.'
      }
    >
      <div className="space-y-6">
        {/* 1. Page Header & Top Selection Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {isMr ? 'डिजिटल मृदा नकाशे' : 'Digital Soil Maps'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {isMr
                  ? 'आपल्या निवडलेल्या शेतासाठी मातीचे गुणधर्म आणि अवकाशीय फरक एक्सप्लोर करा.'
                  : 'Explore soil properties and spatial variation for your selected field.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFF8CF] text-[#2A7C13] border border-[#FBE6C2]">
                30m DSM High-Resolution Grid
              </span>
            </div>
          </div>

          {/* Controls Bar: SELECT FIELD and SELECT SOIL PROPERTY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {/* SELECT FIELD */}
            <div>
              <label htmlFor="select-field" className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                {isMr ? 'शेत निवडा (Select Field)' : 'Select Field'}
              </label>
              <select
                id="select-field"
                value={field.id}
                onChange={(e) => setSelectedFieldId(Number(e.target.value))}
                className="w-full h-12 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#2A7C13] focus:border-[#2A7C13] transition-all cursor-pointer"
              >
                {DEMO_FIELDS.map((f) => (
                  <option key={f.id} value={f.id}>
                    Gat {f.gat_no} — {f.village_name}, Taluka {f.taluka_name} ({f.area_acres} Acres)
                  </option>
                ))}
              </select>
            </div>

            {/* SELECT SOIL PROPERTY */}
            <div>
              <label htmlFor="select-soil-property" className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                {isMr ? 'मातीचा गुणधर्म निवडा (Select Soil Property)' : 'Select Soil Property'}
              </label>
              <select
                id="select-soil-property"
                value={selectedPropertyKey}
                onChange={(e) => setSelectedPropertyKey(e.target.value)}
                className="w-full h-12 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-[#2A7C13] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#2A7C13] focus:border-[#2A7C13] transition-all cursor-pointer"
              >
                {DSM_SUPPORTED_PROPERTIES.map((prop) => (
                  <option key={prop.key} value={prop.key}>
                    {isMr ? `${prop.nameMr} (${prop.depth})` : `${prop.name} (${prop.depth})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. Map Container with Explicit Usable Height */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2A7C13]"></span>
              <h2 className="text-base font-black text-slate-900">
                {isMr ? selectedConfig.nameMr : selectedConfig.name} — Gat No. {field.gat_no}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">{isMr ? 'मोजलेले मूल्य' : 'Measured Value'}:</span>
              {hasData ? (
                <span className="font-mono font-black text-sm text-[#2A7C13] bg-[#FFF8CF] px-3 py-1 rounded-xl border border-[#FBE6C2]">
                  {currentPlotValue} {selectedConfig.unit}
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                  N/A
                </span>
              )}
            </div>
          </div>

          {/* Real MapLibre Map */}
          {hasData ? (
            <div className="w-full h-[520px] min-h-[460px] rounded-xl overflow-hidden border border-slate-200">
              <SoilMap
                geometry={field.geometry}
                centroid={field.centroid}
                height="520px"
                fieldGatNo={field.gat_no}
                villageName={field.village_name}
                areaHa={field.area_hectares}
                selectedDsmProperty={selectedConfig.key}
                selectedDsmValue={currentPlotValue}
                propertyUnit={selectedConfig.unit}
                interactive={true}
                showBoundary={true}
              />
            </div>
          ) : (
            <div className="w-full h-[320px] rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="w-10 h-10 text-slate-400 mb-2" />
              <h3 className="text-sm font-bold text-slate-800">
                DSM data is not available for this property.
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                No calibrated spatial interpolation layer was found for {selectedConfig.name} on Gat No. {field.gat_no}.
              </p>
            </div>
          )}

          {/* Boundary status line */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>
              {field.geometry
                ? `${isMr ? 'अधिकृत सीमा' : 'Cadastral Boundary'}: Gat ${field.gat_no} (${field.area_acres} Acres / ${field.area_hectares} Ha)`
                : 'Field boundary is not available.'}
            </span>
            <span className="font-mono text-[10px] text-slate-400">Resolution: 30m Grid</span>
          </div>
        </div>

        {/* 3. Legend & Field Information Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Legend for Selected Property (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#2A7C13]" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  {isMr ? 'नकाशा सूची (Legend)' : 'Property Legend'}
                </h3>
              </div>
              <span className="text-xs font-bold text-[#2A7C13]">
                {selectedConfig.name}
              </span>
            </div>

            <p className="text-xs text-slate-600">
              {isMr ? selectedConfig.descriptionMr : selectedConfig.description}
            </p>

            {/* Dynamic 3-tier classification thresholds corresponding to selected property */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-[#fbfcf9] border border-slate-200 text-center">
                <span className="w-3.5 h-3.5 rounded-full bg-[#facc15] mx-auto block mb-1.5 border border-yellow-600"></span>
                <span className="text-[11px] font-bold text-slate-800 block">Low</span>
                <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                  {selectedConfig.lowThreshold}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#FFF8CF]/40 border border-[#FBE6C2] text-center">
                <span className="w-3.5 h-3.5 rounded-full bg-[#76C457] mx-auto block mb-1.5 border border-[#2A7C13]"></span>
                <span className="text-[11px] font-bold text-[#2A7C13] block">Medium / Optimal</span>
                <span className="text-[10px] text-slate-600 font-mono block mt-0.5">
                  {selectedConfig.mediumThreshold}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#fbfcf9] border border-slate-200 text-center">
                <span className="w-3.5 h-3.5 rounded-full bg-[#2A7C13] mx-auto block mb-1.5 border border-black/20"></span>
                <span className="text-[11px] font-bold text-slate-800 block">High</span>
                <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                  {selectedConfig.highThreshold}
                </span>
              </div>
            </div>
          </div>

          {/* Field Information (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-[#2A7C13]" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                {isMr ? 'शेत तपशील (Field Information)' : 'Field Information'}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Gat Number</span>
                <strong className="text-slate-900 font-black text-sm block mt-0.5">
                  Gat {field.gat_no}
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Village</span>
                <strong className="text-slate-900 font-bold text-sm block mt-0.5">
                  {field.village_name}
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Taluka</span>
                <strong className="text-slate-900 font-bold text-sm block mt-0.5">
                  {field.taluka_name}
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">District</span>
                <strong className="text-slate-900 font-bold text-sm block mt-0.5">
                  {field.district_name}
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Total Area</span>
                <strong className="text-slate-900 font-bold text-sm block mt-0.5">
                  {field.area_acres} Ac ({field.area_hectares} Ha)
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Soil Classification</span>
                <strong className="text-[#2A7C13] font-bold text-xs block mt-0.5 truncate" title={field.soil_type}>
                  {field.soil_type?.split('(')[0].trim() || 'Clay Loam'}
                </strong>
              </div>
            </div>

            {/* Model Metadata strip */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
              <span>Model Algorithm: <strong className="font-mono text-slate-800">{selectedConfig.modelVersion}</strong></span>
              <span>Model Accuracy: <strong className="text-[#2A7C13] font-black">{selectedConfig.accuracyR2} R²</strong></span>
              <span>Depth: <strong className="text-slate-800">{selectedConfig.depth}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DigitalSoilMaps;
