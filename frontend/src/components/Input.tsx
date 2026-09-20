import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:border-transparent ${
            leftIcon ? 'pl-10' : ''
          } ${rightIcon ? 'pr-10' : ''} ${
            error
              ? 'border-red-300 focus:ring-red-400'
              : 'border-slate-300 focus:ring-gov-primary'
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 pointer-events-none text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
