import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 py-4 border-b border-slate-100 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <h3 className={`text-base font-semibold text-slate-900 ${className}`}>
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <p className={`text-xs text-slate-500 mt-0.5 ${className}`}>
      {children}
    </p>
  );
};

export const CardBody: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
};
