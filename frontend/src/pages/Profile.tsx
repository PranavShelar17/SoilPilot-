import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { User, Phone, MapPin, Shield, Globe, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_FARMER } from '../data/demoData';

export const Profile: React.FC = () => {
  const { farmer, currentLanguage, changeLanguage } = useAuth();
  const currentFarmer = farmer || DEMO_FARMER;

  return (
    <AppLayout headerTitle="Farmer Profile" headerSubtitle="Account Credentials & Landholder Identity">
      <div className="max-w-4xl space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#2A7C13] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                {currentFarmer.full_name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    {currentFarmer.full_name}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF8CF] text-[#2A7C13] border border-[#FBE6C2]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Registered SoilPilot Landholder • Pune District
                </p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] mb-1">
                Registered Mobile Number
              </span>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-mono font-semibold">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>+91 {currentFarmer.mobile}</span>
                <span className="ml-auto text-[10px] text-[#2A7C13] bg-[#FFF8CF] px-2 py-0.5 rounded font-sans font-semibold border border-[#FBE6C2]">
                  OTP Verified
                </span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-1">
                Aadhaar Reference Token
              </span>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-mono">
                <Lock className="w-4 h-4 text-slate-400" />
                <span>{currentFarmer.aadhaar_hash || 'XXXX-XXXX-7842'}</span>
                <span className="ml-auto text-[10px] text-slate-500 font-sans">
                  Encrypted
                </span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-1">
                Cadastral Village Jurisdiction
              </span>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{currentFarmer.village}, Taluka {currentFarmer.taluka}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-1">
                State & District Jurisdiction
              </span>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium">
                <Shield className="w-4 h-4 text-slate-400" />
                <span>{currentFarmer.district}, {currentFarmer.state}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Portal Language & Preferences */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-[#2A7C13]" />
            <h3 className="text-sm font-bold text-slate-900">
              Language & Portal Preferences
            </h3>
          </div>

          <p className="text-xs text-slate-600">
            Choose your preferred language for Soil Health Cards, portal menus, and cadastral notifications:
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => changeLanguage('en')}
              className={`flex-1 p-4 rounded-xl border text-xs font-semibold text-center transition-all ${
                currentLanguage === 'en'
                  ? 'bg-[#2A7C13] text-white border-transparent shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="block text-base mb-0.5">English</span>
              <span className={currentLanguage === 'en' ? 'text-emerald-100' : 'text-slate-400'}>
                Default scientific terms
              </span>
            </button>

            <button
              type="button"
              onClick={() => changeLanguage('mr')}
              className={`flex-1 p-4 rounded-xl border text-xs font-semibold text-center transition-all ${
                currentLanguage === 'mr'
                  ? 'bg-[#2A7C13] text-white border-transparent shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="block text-base mb-0.5">मराठी (Marathi)</span>
              <span className={currentLanguage === 'mr' ? 'text-emerald-100' : 'text-slate-400'}>
                मराठी भाषा प्राधान्य
              </span>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
