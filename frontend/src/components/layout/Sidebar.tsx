import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Trees,
  FileSpreadsheet,
  Map,
  BarChart3,
  Lightbulb,
  FileText,
  User,
  LogOut,
  Sprout,
  X,
  Globe
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/');
    if (onCloseMobile) onCloseMobile();
  };

  const toggleLanguage = () => {
    const next = i18n.language.startsWith('mr') ? 'en' : 'mr';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  };

  const navItems = [
    {
      to: '/farmer/dashboard',
      label: t('nav.dashboard'),
      icon: LayoutDashboard,
    },
    {
      to: '/farmer/fields',
      label: t('nav.myFarm'),
      icon: Trees,
    },
    {
      to: '/farmer/soil-health',
      label: t('nav.soilHealthCard'),
      icon: FileSpreadsheet,
    },
    {
      to: '/farmer/soil-maps',
      label: t('nav.digitalSoilMaps'),
      icon: Map,
    },
    {
      to: '/farmer/soil-analysis',
      label: t('nav.soilAnalysis'),
      icon: BarChart3,
    },
    {
      to: '/farmer/recommendations',
      label: t('nav.recommendations'),
      icon: Lightbulb,
    },
    {
      to: '/farmer/reports',
      label: t('nav.reports'),
      icon: FileText,
    },
    {
      to: '/farmer/profile',
      label: t('nav.profile'),
      icon: User,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container: Primary Deep Green #2A7C13 */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-60 bg-[#2A7C13] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-[#22650f] shadow-lg md:shadow-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Navigation list */}
        <div className="p-3.5 space-y-3">
          {/* Mobile header inside drawer */}
          <div className="flex md:hidden items-center justify-between pb-3 border-b border-[#22650f]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FFF8CF] flex items-center justify-center text-[#2A7C13]">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xs text-white uppercase tracking-wider">
                SoilPilot
              </span>
            </div>
            <button onClick={onCloseMobile} className="text-emerald-200 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#76C457] text-white shadow-sm font-bold'
                        : 'text-emerald-100 hover:bg-[#22650f] hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-3.5 space-y-2 border-t border-[#22650f]">
          {/* Quick Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-emerald-100 hover:text-white hover:bg-[#22650f] w-full transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-emerald-300" />
              <span>{t('nav.language')}</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-[#FFF8CF] text-[#2A7C13] font-bold text-[10px]">
              {i18n.language.startsWith('mr') ? 'मराठी' : 'English'}
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-emerald-100 hover:text-white hover:bg-[#22650f] w-full transition-colors"
          >
            <LogOut className="w-4 h-4 text-emerald-300" />
            <span>{t('nav.logout')}</span>
          </button>

          {/* SoilPilot brand mark */}
          <div className="pt-2 border-t border-[#22650f]/60 flex items-center gap-2 text-[11px] text-emerald-100">
            <div className="w-6 h-6 rounded-lg bg-[#FFF8CF] flex items-center justify-center text-[#2A7C13] flex-shrink-0">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight">
              <span className="block font-bold text-white text-[10px]">SoilPilot</span>
              <span className="text-[9px] text-emerald-200">Digital Soil Mapping & Health</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
