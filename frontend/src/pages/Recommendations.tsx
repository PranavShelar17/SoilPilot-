import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import {
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Sprout,
  ShieldCheck,
  Layers,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { DEMO_FIELDS, DEMO_SOIL_CARDS } from '../data/demoData';
import { StatusBadge } from '../components/StatusBadge';
import { useTranslation } from 'react-i18next';

export const Recommendations: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isMr = i18n.language.startsWith('mr');

  const [selectedFieldId, setSelectedFieldId] = useState<number>(104);

  const field = DEMO_FIELDS.find((f) => f.id === selectedFieldId) || DEMO_FIELDS[0];
  const soilCard = DEMO_SOIL_CARDS[field.id];

  if (!soilCard || !soilCard.parameters || soilCard.parameters.length === 0) {
    return (
      <AppLayout
        headerTitle={t('recommendations.title')}
        headerSubtitle={t('recommendations.subtitle')}
      >
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <h1 className="text-xl font-black text-slate-900">
              {t('recommendations.title')}
            </h1>
            <div className="flex items-center gap-2">
              <label htmlFor="recom-empty-select" className="text-xs font-bold text-slate-700">
                {t('dashboard.selectPlot')}:
              </label>
              <select
                id="recom-empty-select"
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
              {t('recommendations.notAvailableYet')}
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {t('recommendations.pendingMessage')}
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Extract plot-specific constraints from the actual soil test parameters
  const deficientParams = soilCard.parameters.filter(
    (p) => p.status === 'Low' || p.status === 'Deficient' || p.status === 'Alkaline'
  );

  return (
    <AppLayout
      headerTitle={t('recommendations.title')}
      headerSubtitle={t('recommendations.subtitle')}
    >
      <div className="space-y-6">
        {/* Top Header Card with Plot Switcher */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {isMr ? `मृदा व्यवस्थापन सल्ला — गट क्र. ${field.gat_no}` : `Soil Health Advisory — Gat ${field.gat_no}`}
              </h1>
              <StatusBadge status={soilCard.overall_status || 'Good'} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2A7C13]" />
              <span>{field.village_name}, {field.taluka_name}</span>
              <span>•</span>
              <Calendar className="w-3.5 h-3.5 text-[#2A7C13]" />
              <span>Tested: <strong>{soilCard.sampling_date}</strong></span>
            </p>
          </div>

          {/* Plot Switcher */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto bg-[#FFF8CF]/40 border border-[#FBE6C2] p-2 rounded-xl">
            <label htmlFor="recom-plot-select" className="text-xs font-bold text-slate-700 whitespace-nowrap pl-1">
              {t('dashboard.selectPlot')}:
            </label>
            <select
              id="recom-plot-select"
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

        {/* 1. Soil Condition Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <Sprout className="w-4 h-4 text-[#2A7C13]" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              {t('recommendations.soilCondition')}
            </h2>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            {isMr
              ? `गट क्र. ${field.gat_no} ची जमीन ${field.soil_type || 'मध्यम काळी'} प्रकारची असून, एकंदर स्थिती '${soilCard.overall_status || 'Good'}' आहे. जमिनीतील सामू (pH), सेंद्रिय कर्ब आणि मुख्य अन्नद्रव्यांच्या तपासणीनुसार खालील तांत्रिक मार्गदर्शन लागू होते.`
              : `Gat No. ${field.gat_no} comprises ${field.soil_type || 'Medium Black Soil'} with an overall status rated as '${soilCard.overall_status || 'Good'}'. Based on verified laboratory observations and validated regional soil rules, the following management practices are advised.`}
          </p>
        </div>

        {/* 2. Key Soil Constraints / Deficiencies Identified */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              {t('recommendations.keyIssues')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {deficientParams.map((param) => (
              <div
                key={param.key}
                className="p-3.5 rounded-xl bg-[#FFF8CF]/40 border border-[#FBE6C2] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">
                    {isMr ? param.name_mr : param.name}
                  </span>
                  <StatusBadge status={param.status} />
                </div>
                <div className="text-xs font-black text-slate-800">
                  {param.value} {param.unit}
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  {isMr ? (param.interpretation_mr || param.interpretation) : param.interpretation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Soil Improvement & Management Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Organic Matter & Carbon */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <Layers className="w-4 h-4 text-[#2A7C13]" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                {t('recommendations.organicMatter')}
              </h3>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#76C457] flex-shrink-0 mt-0.5" />
                <span>
                  {isMr
                    ? 'हिरवळीची खते (ताग / ढेंच्या) पेरून ५० व्या दिवशी जमिनीत गाडा, ज्यामुळे सेंद्रिय कर्ब वाढेल.'
                    : 'Practice green manuring with Sunhemp or Dhaincha and incorporate at 50 days to elevate organic carbon reserves.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#76C457] flex-shrink-0 mt-0.5" />
                <span>
                  {isMr
                    ? 'चांगले कुजलेले शेणखत किंवा कंपोस्ट खत १० ते १२ टन प्रति हेक्टर जमिनीत मिसळा.'
                    : 'Incorporate well-decomposed Farm Yard Manure (FYM) or vermicompost @ 10-12 tonnes/ha before sowing.'}
                </span>
              </li>
            </ul>
          </div>

          {/* Nutrient Management Guidance */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <Lightbulb className="w-4 h-4 text-[#2A7C13]" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                {t('recommendations.nutrientManagement')}
              </h3>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#76C457] flex-shrink-0 mt-0.5" />
                <span>
                  {isMr
                    ? 'नत्रयुक्त खते एकाच वेळी न देता २ ते ३ हप्त्यांमध्ये विभागून द्या.'
                    : 'Split application of nitrogen fertilizers across 2-3 growth stages to reduce volatilization losses in alkaline soil.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#76C457] flex-shrink-0 mt-0.5" />
                <span>
                  {isMr
                    ? 'जस्त (झिंक) ची कमतरता भरून काढण्यासाठी झिंक सल्फेट २५ किलो/हेक्टर जमिनीत टाकावे.'
                    : 'Soil application of Zinc Sulphate @ 25 kg/ha with FYM to overcome micronutrient deficiency.'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Recommendations;
