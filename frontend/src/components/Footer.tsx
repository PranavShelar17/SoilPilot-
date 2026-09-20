import React from 'react';
import { Sprout, Database, FileText, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      {/* Upper footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Identity & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#2A7C13] flex items-center justify-center text-white">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-black text-[#2A7C13] tracking-tight leading-none block">
                  SoilPilot
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {t('app.subtitle')}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md">
              High-precision Digital Soil Mapping (DSM) and Soil Health Card platform providing agricultural plot-level soil fertility intelligence, nutrient diagnostics, and precision advisory directly to farmers.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-[#2A7C13] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#76C457]" />
              <span>Cadastral Precision Mapping & Scientific Soil Diagnostics</span>
            </div>
          </div>

          {/* Pilot Scope */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Pilot Coverage
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li><strong className="text-slate-800 font-semibold">District:</strong> Pune</li>
              <li><strong className="text-slate-800 font-semibold">Taluka:</strong> Baramati</li>
              <li><strong className="text-slate-800 font-semibold">Pilot Village:</strong> Malegaon</li>
              <li className="text-[11px] text-slate-400 mt-2">Expansion across Pune district in progress</li>
            </ul>
          </div>

          {/* Scientific Standards */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Scientific Standards
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#2A7C13]" />
                <span>Standard Soil Taxonomy</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#2A7C13]" />
                <span>Validated Soil Test Rules</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-[#2A7C13]" />
                <span>Digital Soil Mapping (DSM) ML Models</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#fbfcf9] border-t border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} SoilPilot — Digital Soil Mapping & Soil Health Portal. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
            <span>SoilPilot V1</span>
            <span>•</span>
            <span>Cadastral GIS Precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
