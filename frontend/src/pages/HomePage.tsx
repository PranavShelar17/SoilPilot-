import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, Database, ArrowRight, CheckCircle2, ChevronRight, Layers, FileCheck } from 'lucide-react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { FieldSearch } from '../components/FieldSearch';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { isAuthenticated, farmer } = useAuth();
  const navigate = useNavigate();
  const searchSectionRef = useRef<HTMLDivElement>(null);

  const scrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 pt-16 pb-20 lg:pt-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8CF] border border-[#FBE6C2] text-xs font-bold text-[#2A7C13]">
              <span className="w-2 h-2 rounded-full bg-[#76C457] animate-pulse"></span>
              Precision Digital Soil Mapping GIS System
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Scientific Soil Intelligence{' '}
              <span className="text-[#2A7C13] block mt-1">
                For Every Cadastral Gat Plot
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Delivering high-resolution digital soil mapping, verified laboratory observations, and authentic Soil Health Cards mapped directly to official village land records.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {isAuthenticated ? (
                <Link to="/farmer/dashboard">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Open Farmer Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/farmer/login">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Farmer Login
                  </Button>
                </Link>
              )}

              <Button
                variant="secondary"
                size="lg"
                leftIcon={<MapPin className="w-5 h-5 text-[#2A7C13]" />}
                onClick={scrollToSearch}
              >
                Find My Field
              </Button>
            </div>

            {/* Supporting Trust Indicators */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2A7C13] flex-shrink-0" />
                <span>Cadastral Precision</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2A7C13] flex-shrink-0" />
                <span>Lab & DSM Data</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2A7C13] flex-shrink-0" />
                <span>Authoritative Access</span>
              </div>
            </div>
          </div>

          {/* Full-Width Hierarchical Location Card */}
          <div ref={searchSectionRef} className="w-full">
            <FieldSearch />
          </div>
        </div>
      </section>

      {/* Core Scientific Pillars */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-semibold text-[#2A7C13] uppercase tracking-wider mb-2">
              Scientific Architecture
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Transforming Soil Testing with Digital Mapping
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              SoilPilot bridges physical soil lab testing with spatial Digital Soil Mapping (DSM) algorithms to provide continuous soil insight at the parcel level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="w-12 h-12 rounded-lg bg-[#FFF8CF] text-[#2A7C13] border border-[#FBE6C2] flex items-center justify-center mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Cadastral Boundary Mapping
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Field polygons are directly aligned with verified cadastral land records. Farmers can visually inspect their plot boundaries on satellite and street basemaps.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="w-12 h-12 rounded-lg bg-[#FFF8CF] text-[#2A7C13] border border-[#FBE6C2] flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Certified Soil Observations
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete chemical and nutrient profiles including pH, EC, Organic Carbon, Macro, Secondary, and Micro nutrients tested by precision agricultural laboratories.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="w-12 h-12 rounded-lg bg-[#FBE6C2] text-[#2A7C13] border border-[#76C457]/40 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Digital Soil Mapping (DSM)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Advanced spatial interpolation models estimate continuous soil properties across cadastral zones where direct physical samples are in testing transit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pilot Scope & Scientific Trust Strip */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#2A7C13] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-semibold text-[#FFF8CF] uppercase tracking-wider">
                Active Implementation
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                Baramati Pilot Project — Village Malegaon
              </h3>
              <p className="text-xs sm:text-sm text-slate-100 max-w-xl">
                Serving verified landholders across Pune District. Login with your registered mobile number to immediately access authorized cadastral field health cards.
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link to="/farmer/login">
                <Button
                  variant="secondary"
                  size="md"
                  className="bg-white text-[#2A7C13] hover:bg-[#FFF8CF] font-semibold border-none"
                >
                  Verify via Mobile OTP
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
