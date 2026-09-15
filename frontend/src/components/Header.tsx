import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, User, LogOut, LayoutDashboard, Trees, Menu, X, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from './Button';
import { useTranslation } from 'react-i18next';

export const Header: React.FC = () => {
  const { farmer, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#2A7C13] flex items-center justify-center text-white shadow-xs group-hover:bg-[#22650f] transition-colors">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-[#2A7C13]">
                  SoilPilot
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold bg-[#FFF8CF] text-[#2A7C13] border border-[#FBE6C2] rounded-md">
                  DSM Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none">
                {t('app.subtitle')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                isActive('/')
                  ? 'text-[#2A7C13] bg-[#FFF8CF]/60 border border-[#FBE6C2]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/farmer/dashboard"
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                    isActive('/farmer/dashboard')
                      ? 'text-[#2A7C13] bg-[#FFF8CF]/60 border border-[#FBE6C2]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#2A7C13]" />
                  {t('nav.dashboard')}
                </Link>
                <Link
                  to="/farmer/fields"
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                    isActive('/farmer/fields')
                      ? 'text-[#2A7C13] bg-[#FFF8CF]/60 border border-[#FBE6C2]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Trees className="w-3.5 h-3.5 text-[#2A7C13]" />
                  {t('nav.myFarm')}
                </Link>
              </>
            ) : null}
          </nav>

          {/* Right Controls: Language Switcher & Farmer Auth */}
          <div className="hidden sm:flex items-center gap-3">
            <LanguageSwitcher />

            {isAuthenticated && farmer ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="text-right hidden lg:block">
                  <div className="text-xs font-bold text-slate-800 truncate max-w-[150px]">
                    {farmer.full_name.split('(')[0].trim()}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center justify-end gap-1">
                    <MapPin className="w-2.5 h-2.5 text-[#2A7C13]" />
                    {farmer.village}
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<LogOut className="w-3.5 h-3.5" />}
                  onClick={handleLogout}
                  title="Logout"
                >
                  {t('nav.logout')}
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<User className="w-3.5 h-3.5" />}
                onClick={() => navigate('/farmer/login')}
              >
                {t('auth.farmerLogin')}
              </Button>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 sm:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#FFF8CF]/50"
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/farmer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#FFF8CF]/50"
              >
                {t('nav.dashboard')}
              </Link>
              <Link
                to="/farmer/fields"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#FFF8CF]/50"
              >
                {t('nav.myFarm')}
              </Link>
              <div className="pt-2 border-t border-slate-100">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  leftIcon={<LogOut className="w-3.5 h-3.5" />}
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  {t('nav.logout')}
                </Button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100">
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                leftIcon={<User className="w-3.5 h-3.5" />}
                onClick={() => {
                  navigate('/farmer/login');
                  setMobileMenuOpen(false);
                }}
              >
                {t('auth.farmerLogin')}
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
