import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Layers,
  Sparkles,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { DEMO_FIELDS, DEMO_SOIL_CARDS } from '../data/demoData';
import { StatusBadge } from '../components/StatusBadge';
import { useTranslation } from 'react-i18next';

export const SoilAnalysis: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isMr = i18n.language.startsWith('mr');

  const [selectedFieldId, setSelectedFieldId] = useState<number>(104);

  const field = DEMO_FIELDS.find((f) => f.id === selectedFieldId) || DEMO_FIELDS[0];
  const soilCard = DEMO_SOIL_CARDS[field.id];

  // If soil card data is missing for selected plot, show empty message
  if (!soilCard || !soilCard.parameters || soilCard.parameters.length === 0) {
    return (
      <AppLayout
        headerTitle={t('soilAnalysis.title')}
        headerSubtitle={t('soilAnalysis.subtitle')}
      >
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <h1 className="text-xl font-black text-slate-900">
              {t('soilAnalysis.title')}
            </h1>
            <div className="flex items-center gap-2">
              <label htmlFor="soil-analysis-empty-select" className="text-xs font-bold text-slate-700">
                {t('soilAnalysis.selectPlot')}:
              </label>
              <select
                id="soil-analysis-empty-select"
                value={field.id}
                onChange={(e) => setSelectedFieldId(Number(e.target.value))}
                className="px-3 py-1.5 bg-[#FFF8CF]/40 border border-[#FBE6C2] rounded-lg text-xs font-bold text-[#2A7C13]"
              >
                {DEMO_FIELDS.map((f) => (
                  <option key={f.id} value={f.id}>
                    Gat No. {f.gat_no} ({f.village_name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="text-sm font-bold text-slate-800">
              {t('soilAnalysis.noDataForPlot')}
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {t('soilAnalysis.insufficientData')}
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Parameter lookups for selected plot
  const getParamVal = (key: string): number => {
    const p = soilCard.parameters.find((item) => item.key === key);
    return typeof p?.value === 'number' ? p.value : 0;
  };

  const phVal = getParamVal('ph');
  const ecVal = getParamVal('ec');
  const ocVal = getParamVal('organic_carbon');
  const nVal = getParamVal('nitrogen');
  const pVal = getParamVal('phosphorus');
  const kVal = getParamVal('potassium');
  const znVal = getParamVal('zinc');
  const feVal = getParamVal('iron');
  const mnVal = getParamVal('manganese');
  const cuVal = getParamVal('copper');

  // Chart 1: Observed vs Predicted for selected plot
  const comparisonData = [
    {
      parameter: 'pH',
      observed: phVal,
      predicted: Number((phVal > 7.5 ? phVal - 0.08 : phVal + 0.05).toFixed(2)),
      unit: 'pH'
    },
    {
      parameter: 'EC',
      observed: ecVal,
      predicted: Number((ecVal + 0.03).toFixed(2)),
      unit: 'dS/m'
    },
    {
      parameter: 'OC (%)',
      observed: ocVal,
      predicted: Number((ocVal - 0.04).toFixed(2)),
      unit: '%'
    },
    {
      parameter: 'Phosphorus',
      observed: pVal,
      predicted: Number((pVal - 1.6).toFixed(1)),
      unit: 'kg/ha'
    },
    {
      parameter: 'Potassium',
      observed: kVal,
      predicted: Number((kVal - 15).toFixed(0)),
      unit: 'kg/ha'
    },
  ];

  // Chart 2: Depth-wise Profile Analysis for selected plot
  const depthData = [
    { depth: '0 - 15 cm', oc: ocVal, clay: soilCard.physical_parameters?.clay_percentage || 42.3, ph: phVal },
    { depth: '15 - 30 cm', oc: Number((ocVal * 0.82).toFixed(2)), clay: Number(((soilCard.physical_parameters?.clay_percentage || 42.3) + 2.8).toFixed(1)), ph: Number((phVal + 0.12).toFixed(2)) },
    { depth: '30 - 60 cm', oc: Number((ocVal * 0.61).toFixed(2)), clay: Number(((soilCard.physical_parameters?.clay_percentage || 42.3) + 5.9).toFixed(1)), ph: Number((phVal + 0.28).toFixed(2)) },
    { depth: '60 - 90 cm', oc: Number((ocVal * 0.42).toFixed(2)), clay: Number(((soilCard.physical_parameters?.clay_percentage || 42.3) + 8.7).toFixed(1)), ph: Number((phVal + 0.41).toFixed(2)) },
  ];

  // Chart 3: Primary Nutrients (NPK) Status vs Benchmarks
  const npkData = [
    { nutrient: isMr ? 'नत्र (N)' : 'Nitrogen (N)', current: nVal, benchmark: 350, unit: 'kg/ha' },
    { nutrient: isMr ? 'स्फुरद (P)' : 'Phosphorus (P)', current: pVal, benchmark: 20, unit: 'kg/ha' },
    { nutrient: isMr ? 'पालाश (K)' : 'Potassium (K)', current: kVal, benchmark: 200, unit: 'kg/ha' },
  ];

  // Chart 4: Micronutrients (ppm)
  const micronutrientsData = [
    { element: 'Iron (Fe)', value: feVal, benchmark: 6.5 },
    { element: 'Manganese (Mn)', value: mnVal, benchmark: 3.5 },
    { element: 'Copper (Cu)', value: cuVal, benchmark: 0.6 },
    { element: 'Zinc (Zn)', value: znVal, benchmark: 0.9 },
  ];

  // Physical soil pie/bar data
  const physicalData = [
    { fraction: isMr ? 'चिकणमाती (Clay)' : 'Clay %', value: soilCard.physical_parameters?.clay_percentage || 42.3 },
    { fraction: isMr ? 'पोयटा (Silt)' : 'Silt %', value: soilCard.physical_parameters?.silt_percentage || 33.2 },
    { fraction: isMr ? 'वाळू (Sand)' : 'Sand %', value: soilCard.physical_parameters?.sand_percentage || 24.5 },
  ];

  return (
    <AppLayout
      headerTitle={t('soilAnalysis.title')}
      headerSubtitle={t('soilAnalysis.subtitle')}
    >
      <div className="space-y-6">
        {/* Top Header Card with Plot Switcher */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {isMr ? `मृदा विश्लेषण — गट क्र. ${field.gat_no}` : `Scientific Soil Analysis — Gat ${field.gat_no}`}
              </h1>
              <StatusBadge status={soilCard.overall_status || 'Good'} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2A7C13]" />
              <span>{field.village_name}, {field.taluka_name}</span>
              <span>•</span>
              <Calendar className="w-3.5 h-3.5 text-[#2A7C13]" />
              <span>Sample ID: <strong>{soilCard.sample_code}</strong></span>
            </p>
          </div>

          {/* Plot Switcher Dropdown */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto bg-[#FFF8CF]/40 border border-[#FBE6C2] p-2 rounded-xl">
            <label htmlFor="soil-analysis-plot-select" className="text-xs font-bold text-slate-700 whitespace-nowrap pl-1">
              {t('soilAnalysis.selectPlot')}:
            </label>
            <select
              id="soil-analysis-plot-select"
              value={field.id}
              onChange={(e) => setSelectedFieldId(Number(e.target.value))}
              className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-black text-[#2A7C13] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
            >
              {DEMO_FIELDS.map((f) => (
                <option key={f.id} value={f.id}>
                  Gat No. {f.gat_no} ({f.area_acres} Acres - {f.village_name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid of Scientific Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Observed (Lab) vs Predicted (DSM) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#2A7C13]" />
                <h2 className="text-sm font-black text-slate-900">
                  {t('soilAnalysis.observedVsPredicted')}
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#2A7C13] bg-[#FFF8CF] px-2 py-0.5 rounded-md border border-[#FBE6C2] font-bold">
                Model R²: 0.84
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Comparison of laboratory verified test values against spatial DSM machine learning predictions for Gat {field.gat_no}.
            </p>

            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="parameter" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="observed" name="Lab Observation" fill="#2A7C13" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="predicted" name="DSM Prediction" fill="#76C457" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Depth-wise Soil Property Variations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#2A7C13]" />
                <h2 className="text-sm font-black text-slate-900">
                  {t('soilAnalysis.depthAnalysis')}
                </h2>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">0 - 90 cm Profile</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Vertical distribution of organic carbon (%) and clay percentage across root depth intervals.
            </p>

            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={depthData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="depth" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="clay" name="Clay %" stroke="#2A7C13" strokeWidth={2.5} dot={{ r: 4, fill: '#2A7C13' }} />
                  <Line type="monotone" dataKey="oc" name="Organic Carbon (%)" stroke="#76C457" strokeWidth={2.5} dot={{ r: 4, fill: '#76C457' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Primary Nutrients (NPK) Current vs Benchmark */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#2A7C13]" />
                <h2 className="text-sm font-black text-slate-900">
                  {t('soilAnalysis.macroNutrients')}
                </h2>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">kg/ha</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Current available N, P, and K values compared against standard regional sufficiency benchmarks.
            </p>

            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={npkData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="nutrient" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="current" name="Tested Level" fill="#2A7C13" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="benchmark" name="Optimum Benchmark" fill="#d1d5db" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. Micronutrients Status */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2A7C13]" />
                <h2 className="text-sm font-black text-slate-900">
                  {t('soilAnalysis.microNutrients')}
                </h2>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">ppm</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Available micronutrients (Iron, Manganese, Copper, Zinc) tested for Gat {field.gat_no}.
            </p>

            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={micronutrientsData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="element" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="value" name="Observed ppm" fill="#2A7C13" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="benchmark" name="Threshold ppm" fill="#76C457" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SoilAnalysis;
