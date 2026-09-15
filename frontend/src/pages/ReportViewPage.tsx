import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, ShieldCheck, Download, FileText, CheckCircle2 } from 'lucide-react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { SoilHealthCard } from '../components/SoilHealthCard';
import { DEMO_FIELDS, DEMO_SOIL_CARDS, DEMO_FARMER, DEMO_REPORTS } from '../data/demoData';
import { useAuth } from '../context/AuthContext';
import { Field, SoilHealthCard as ISoilHealthCard, ReportItem } from '../types';

export const ReportViewPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const { farmer } = useAuth();

  const [report, setReport] = useState<ReportItem | null>(null);
  const [field, setField] = useState<Field | null>(null);
  const [soilCard, setSoilCard] = useState<ISoilHealthCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Find matching report or extract field
    const matchReport = DEMO_REPORTS.find((r) => r.id === reportId) || DEMO_REPORTS[0];
    setReport(matchReport);

    const matchField = DEMO_FIELDS.find((f) => f.id === matchReport.field_id) || DEMO_FIELDS[0];
    setField(matchField);

    const matchCard = DEMO_SOIL_CARDS[matchField.id] || DEMO_SOIL_CARDS[104];
    setSoilCard(matchCard);

    setIsLoading(false);
  }, [reportId]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !report || !field || !soilCard) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <LoadingState message="Generating Certified Soil Health Card PDF..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Controls (hidden during print) */}
        <div className="print:hidden flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <Link to={`/farmer/field/${field.id}`}>
            <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Field Map
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline">
              Official Verification Token: <strong className="font-mono text-slate-800">{report.public_token}</strong>
            </span>
            <Button variant="primary" size="sm" leftIcon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
              Print / Save PDF
            </Button>
          </div>
        </div>

        {/* Printable Soil Health Card Sheet */}
        <div className="bg-white border border-[#76C457]/40 rounded-2xl p-8 shadow-sm print:border-none print:shadow-none print:p-0">
          {/* SoilPilot Official Header */}
          <div className="border-b-2 border-[#2A7C13] pb-6 mb-6 text-center space-y-1">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2A7C13]"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#2A7C13]">
                SoilPilot • Digital Soil Mapping & Soil Health Portal
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#2A7C13]"></span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-[#2A7C13] uppercase">
              Digital Soil Mapping & Soil Health Certificate
            </h1>
            <p className="text-xs font-semibold text-slate-600">
              मृदा आरोग्य पत्रिका • Cadastral DSM GIS Field Intelligence System
            </p>

            <div className="pt-3 flex flex-wrap items-center justify-between text-xs text-slate-600 border-t border-slate-100 mt-4">
              <span><strong>Certificate No:</strong> {report.report_number}</span>
              <span><strong>Date of Issue:</strong> {report.generated_at}</span>
              <span className="flex items-center gap-1 text-[#2A7C13] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2A7C13]" />
                SoilPilot Verified
              </span>
            </div>
          </div>

          {/* Soil Health Card Component Body */}
          <SoilHealthCard
            card={soilCard}
            farmer={farmer || DEMO_FARMER}
            field={field}
          />

          {/* Signatures & Certification Seal */}
          <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-center">
            <div className="space-y-1">
              <div className="h-12 flex items-end justify-center font-serif italic text-slate-700">
                Verified Soil Analyst
              </div>
              <div className="border-t border-slate-300 pt-1 font-semibold text-slate-800">
                Precision Soil Testing Lab
              </div>
              <span className="text-[10px] text-slate-400">SoilPilot Analytical Division</span>
            </div>

            <div className="space-y-1">
              <div className="h-12 flex items-end justify-center font-serif italic text-slate-700">
                Authorized GIS Officer
              </div>
              <div className="border-t border-slate-300 pt-1 font-semibold text-slate-800">
                Cadastral DSM GIS Division
              </div>
              <span className="text-[10px] text-slate-400">Pune District Cadastre</span>
            </div>

            <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-2 rounded-xl border border-[#FBE6C2] bg-[#FFF8CF]/40">
              <ShieldCheck className="w-6 h-6 text-[#2A7C13] mb-1" />
              <span className="font-mono text-[10px] text-slate-700 font-semibold">{report.public_token}</span>
              <span className="text-[9px] text-[#2A7C13] font-medium">Digital Authenticity QR & Key</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
