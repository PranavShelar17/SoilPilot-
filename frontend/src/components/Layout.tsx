import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* SoilPilot Scientific Trust Strip */}
      <div className="bg-[#2A7C13] text-white text-xs py-1.5 px-4 border-b border-[#76C457]/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#FFF8CF]"></span>
            <span className="font-semibold text-white tracking-wide">
              SoilPilot • Digital Soil Mapping (DSM) & Soil Health Portal
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-[#FFF8CF]">
            <span>High-Resolution 30m DSM Grids</span>
            <span>•</span>
            <span>Pune District Cadastre</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <Header />

      {/* Primary Content Container */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
