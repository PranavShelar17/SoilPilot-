import React from 'react';
import { User, MapPin, Phone, Shield, CheckCircle } from 'lucide-react';
import { Farmer } from '../types';

interface FarmerProfileProps {
  farmer: Farmer;
  className?: string;
}

export const FarmerProfile: React.FC<FarmerProfileProps> = ({ farmer, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-6 shadow-sm ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gov-light text-gov-dark flex items-center justify-center font-bold text-lg border border-gov-dark/20">
            {farmer.full_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {farmer.full_name}
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                <CheckCircle className="w-3 h-3" />
                Verified Landholder
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized Cadastral Beneficiary
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-100 text-xs">
        <div>
          <span className="text-slate-500 block text-[11px] flex items-center gap-1">
            <Phone className="w-3 h-3 text-slate-400" />
            Registered Mobile
          </span>
          <strong className="text-slate-800 font-mono mt-0.5 block">
            +91 {farmer.mobile}
          </strong>
        </div>

        <div>
          <span className="text-slate-500 block text-[11px] flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            Cadastral Village
          </span>
          <strong className="text-slate-800 mt-0.5 block">
            {farmer.village}
          </strong>
        </div>

        <div>
          <span className="text-slate-500 block text-[11px]">Taluka & District</span>
          <strong className="text-slate-800 mt-0.5 block">
            {farmer.taluka}, {farmer.district}
          </strong>
        </div>

        <div>
          <span className="text-slate-500 block text-[11px] flex items-center gap-1">
            <Shield className="w-3 h-3 text-slate-400" />
            State Jurisdiction
          </span>
          <strong className="text-slate-800 mt-0.5 block">
            {farmer.state}
          </strong>
        </div>
      </div>
    </div>
  );
};
