import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message, subMessage }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-gov-light border-t-gov-dark animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-gov-dark rounded-full"></div>
        </div>
      </div>
      <h4 className="text-sm font-semibold text-slate-800">
        {message || t('common.loading', 'Loading GIS & Soil Data...')}
      </h4>
      {subMessage && (
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          {subMessage}
        </p>
      )}
    </div>
  );
};
