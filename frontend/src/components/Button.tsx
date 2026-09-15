import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-[#2A7C13] hover:bg-[#22650f] text-white focus:ring-[#76C457] shadow-xs active:scale-[0.99]',
    secondary: 'bg-[#FFF8CF] hover:bg-[#FBE6C2] text-[#2A7C13] border border-[#FBE6C2] font-semibold focus:ring-[#76C457] shadow-xs',
    outline: 'bg-transparent hover:bg-[#FFF8CF]/60 text-[#2A7C13] border border-[#2A7C13] focus:ring-[#76C457]',
    ghost: 'bg-transparent hover:bg-[#FFF8CF]/50 text-slate-700 hover:text-[#2A7C13] focus:ring-[#76C457]',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-xs',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
