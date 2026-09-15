import React from 'react';
import { Menu, Sprout, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface TopHeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
  subtitle?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onToggleSidebar,
  title,
  subtitle,
}) => {
  const { farmer, user } = useAuth();
  const { t } = useTranslation();

  const displayFarmerName =
    farmer?.full_name?.split('(')[0].trim() ||
    user?.farmer?.full_name?.split('(')[0].trim() ||
    'Pradip Bhauso Shelar';

  const initial = displayFarmerName.charAt(0).toUpperCase();

  const headerTitle = title || t('app.name');
  const headerSubtitle = subtitle || t('app.subtitle');

  return (
    <header className="bg-white text-slate-800 h-16 px-4 sm:px-6 flex items-center justify-between border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile Drawer Trigger + SoilPilot Logo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-[#2A7C13] hover:bg-[#FFF8CF]/60 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/farmer/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#2A7C13] flex items-center justify-center text-white shadow-xs group-hover:bg-[#22650f] transition-colors">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-[#2A7C13] tracking-tight leading-none">
                SoilPilot
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold bg-[#FFF8CF] text-[#2A7C13] border border-[#FBE6C2] rounded-md">
                DSM Portal
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
              {headerSubtitle}
            </span>
          </div>
        </Link>
      </div>

      {/* Right: Language Switcher + Farmer Profile Info */}
      <div className="flex items-center gap-3 sm:gap-4">
        <LanguageSwitcher />

        <Link
          to="/farmer/profile"
          className="flex items-center gap-2.5 pl-2 border-l border-slate-200 group"
          title="Profile & Settings"
        >
          <div className="w-8 h-8 rounded-full bg-[#2A7C13] text-white flex items-center justify-center font-black text-xs shadow-2xs group-hover:bg-[#76C457] transition-colors">
            {initial}
          </div>
          <div className="hidden md:block text-right leading-tight">
            <span className="block text-xs font-bold text-slate-900 group-hover:text-[#2A7C13] transition-colors truncate max-w-[150px]">
              {displayFarmerName}
            </span>
            <span className="text-[10px] text-slate-500 font-medium block">
              Farmer Profile
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};
