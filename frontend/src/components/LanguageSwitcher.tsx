import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const setLanguage = (lang: 'en' | 'mr') => {
    i18n.changeLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
  };

  return (
    <div className={`inline-flex items-center bg-[#FFF8CF]/60 p-1 rounded-xl border border-[#FBE6C2] text-xs font-medium ${className}`}>
      <div className="flex items-center px-1.5 text-[#2A7C13]">
        <Globe className="w-3.5 h-3.5" />
      </div>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-lg transition-all ${
          currentLang.startsWith('en')
            ? 'bg-[#2A7C13] text-white font-bold shadow-xs'
            : 'text-slate-700 hover:text-[#2A7C13] hover:bg-white/50'
        }`}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage('mr')}
        className={`px-2.5 py-1 rounded-lg transition-all ${
          currentLang.startsWith('mr')
            ? 'bg-[#2A7C13] text-white font-bold shadow-xs'
            : 'text-slate-700 hover:text-[#2A7C13] hover:bg-white/50'
        }`}
      >
        मराठी
      </button>
    </div>
  );
};
