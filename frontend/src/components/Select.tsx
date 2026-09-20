import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: Option[];
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', options, children, error, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 appearance-none pr-10 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
            error
              ? 'border-red-300 focus:ring-red-400'
              : 'border-slate-300 focus:ring-gov-primary'
          } ${className}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
