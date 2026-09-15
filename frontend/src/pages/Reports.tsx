import React from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { FileText, Download, Eye, ShieldCheck, Calendar, MapPin } from 'lucide-react';
import { DEMO_REPORTS } from '../data/demoData';

export const Reports: React.FC = () => {
  return (
    <AppLayout headerTitle="Official Reports" headerSubtitle="Authorized Soil Health Cards & Scientific Certificates">
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Generated Soil Health Documents
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Certified digital Soil Health Cards with QR authentication generated under SoilPilot Digital Soil Mapping System
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF8CF] text-[#2A7C13] border border-[#FBE6C2]">
              {DEMO_REPORTS.length} Certified Reports
            </span>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {DEMO_REPORTS.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-[#76C457] transition-colors">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF8CF] text-[#2A7C13] flex items-center justify-center border border-[#FBE6C2]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#2A7C13]/10 text-[#2A7C13]">
                    Official DSM
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {report.report_type}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  {report.report_number}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Cadastral Gat</span>
                    <strong className="text-slate-800 font-bold">Gat {report.gat_no}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Village</span>
                    <span className="text-slate-800">{report.village}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Issue Date</span>
                    <span className="text-slate-800">{report.generated_at}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <Link
                  to={`/farmer/report/${report.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#2A7C13] hover:bg-[#236810] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Report</span>
                </Link>

                <Link
                  to={`/farmer/report/${report.id}`}
                  className="p-2 bg-slate-100 hover:bg-[#FBE6C2] text-slate-700 hover:text-[#2A7C13] rounded-lg transition-colors"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Reports;
