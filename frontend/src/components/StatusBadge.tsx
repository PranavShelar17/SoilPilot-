import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const norm = (status || '').toLowerCase().trim();

  let colorClasses = 'bg-[#FFF8CF] text-[#2A7C13] border-[#FBE6C2]';

  if (
    norm.includes('good') ||
    norm.includes('normal') ||
    norm.includes('sufficient') ||
    norm.includes('verified') ||
    norm.includes('चांगली') ||
    norm.includes('योग्य') ||
    norm.includes('सुरक्षित') ||
    norm.includes('पुरेसे') ||
    norm.includes('प्रमाणित')
  ) {
    colorClasses = 'bg-[#f4faee] text-[#2A7C13] border-[#76C457]/50';
  } else if (
    norm.includes('medium') ||
    norm.includes('moderate') ||
    norm.includes('मध्यम')
  ) {
    colorClasses = 'bg-[#FFF8CF] text-[#2A7C13] border-[#FBE6C2]';
  } else if (
    norm.includes('low') ||
    norm.includes('deficient') ||
    norm.includes('critical') ||
    norm.includes('alkaline') ||
    norm.includes('acidic') ||
    norm.includes('saline') ||
    norm.includes('कमी') ||
    norm.includes('कमतरता') ||
    norm.includes('अल्कधर्मी') ||
    norm.includes('आम्लधर्मी')
  ) {
    colorClasses = 'bg-[#FBE6C2] text-slate-900 border-[#f5d9a4]';
  } else if (
    norm.includes('very high') ||
    norm.includes('abundant') ||
    norm.includes('खूप जास्त') ||
    norm.includes('भरपूर')
  ) {
    colorClasses = 'bg-[#eaf5e4] text-[#1c550d] border-[#76C457] font-extrabold';
  } else if (
    norm.includes('not available') ||
    norm.includes('उपलब्ध नाही') ||
    norm.includes('pending')
  ) {
    colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors ${colorClasses} ${className}`}
    >
      {status || 'Not Available'}
    </span>
  );
};
