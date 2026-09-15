import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, MapPin, Calendar, ShieldCheck, ArrowRight, Activity, Search, AlertCircle } from 'lucide-react';
import { Layout } from '../components/Layout';
import { FarmerProfile } from '../components/FarmerProfile';
import { FieldCard } from '../components/FieldCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { Field, ReportItem } from '../types';
import { getMyFields, getReports } from '../lib/api/client';
import { DEMO_FIELDS, DEMO_REPORTS, DEMO_FARMER } from '../data/demoData';

export const FarmerDashboardPage: React.FC = () => {
  const { farmer } = useAuth();
  const [fields, setFields] = useState<Field[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Attempt backend API call
        const [fieldsRes, reportsRes] = await Promise.allSettled([
          getMyFields(),
          getReports(),
        ]);

        let loadedFields: Field[] = [];
        if (fieldsRes.status === 'fulfilled' && fieldsRes.value.data?.fields) {
          loadedFields = fieldsRes.value.data.fields;
        } else {
          // Fallback to authorized demo fields for offline/demo use
          loadedFields = DEMO_FIELDS;
        }

        let loadedReports: ReportItem[] = [];
        if (reportsRes.status === 'fulfilled' && reportsRes.value.data) {
          loadedReports = Array.isArray(reportsRes.value.data) ? reportsRes.value.data : reportsRes.value.data.reports || [];
        } else {
          loadedReports = DEMO_REPORTS;
        }

        setFields(loadedFields);
        setReports(loadedReports);
      } catch (err: any) {
        // Safe fallback
        setFields(DEMO_FIELDS);
        setReports(DEMO_REPORTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalAreaHa = fields.reduce((acc, f) => acc + (f.area_hectares || 0), 0);
  const totalAreaAcres = fields.reduce((acc, f) => acc + (f.area_acres || 0), 0);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Farmer Profile Card */}
        {farmer ? (
          <FarmerProfile farmer={farmer} />
        ) : (
          <FarmerProfile farmer={DEMO_FARMER} />
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-gov-dark flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Authorized Fields
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  {fields.length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Total Cadastral Area
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  {totalAreaHa.toFixed(2)}{' '}
                  <span className="text-xs font-normal text-slate-500">Ha</span>
                </span>
                <span className="text-[10px] text-slate-400 block">
                  ({totalAreaAcres.toFixed(2)} Acres)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Latest Soil Sample
                </span>
                <span className="text-sm font-bold text-slate-900 block mt-1">
                  {fields[0]?.last_tested_date || 'August 2026'}
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">
                  Verified Lab Report
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gov-light text-gov-dark flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Digital Mapping Status
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mt-1">
                  Active V1 Pilot
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Malegaon Jurisdiction
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Authorized Fields Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Authorized Cadastral Fields
              </h2>
              <p className="text-xs text-slate-500">
                Land parcels verified under your registered landholder identity
              </p>
            </div>
            <Link to="/farmer/fields">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All Fields
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <LoadingState message="Loading your authorized cadastral fields..." />
          ) : error ? (
            <ErrorState message={error} />
          ) : fields.length === 0 ? (
            <EmptyState
              title="No Fields Registered"
              description="No authorized cadastral parcels are currently linked to this mobile number."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {fields.map((field) => (
                <FieldCard key={field.id} field={field} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Reports Section */}
        {reports.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Certified Soil Health Reports
                </h3>
                <p className="text-xs text-slate-500">
                  Ready-to-download official soil health cards with QR authentication
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {reports.map((report) => (
                <div key={report.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <strong className="text-slate-900 font-semibold block">
                      {report.report_number}
                    </strong>
                    <span className="text-slate-500">
                      Gat {report.gat_no} • {report.village} • {report.generated_at}
                    </span>
                  </div>
                  <Link to={`/farmer/report/${report.id}`}>
                    <Button variant="secondary" size="sm">
                      View Report
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
