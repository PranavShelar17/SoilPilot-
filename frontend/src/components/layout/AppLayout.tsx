import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

interface AppLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  headerTitle,
  headerSubtitle,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f8] text-slate-800 font-sans">
      {/* Top Header */}
      <TopHeader
        onToggleSidebar={() => setMobileOpen(!mobileOpen)}
        title={headerTitle}
        subtitle={headerSubtitle}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
