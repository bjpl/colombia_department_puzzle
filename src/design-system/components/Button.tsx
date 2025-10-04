import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

/**
 * Modern Button Component - Clean Linear/Vercel Style
 * Consistent design across all button instances
 */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const buttonVariants = {
  primary: [
    'bg-sky-500 text-white',  // Using brand.500 equivalent
    'hover:bg-sky-600',       // Using brand.600 equivalent
    'focus:ring-2 focus:ring-sky-500 focus:ring-offset-2',
    'disabled:bg-gray-300 disabled:text-gray-500',
    'active:bg-sky-700',      // Using brand.700 equivalent
    'shadow-sm hover:shadow-md transition-all duration-200',
  ].join(' '),

  secondary: [
    'bg-gray-100 text-gray-900 border border-gray-200',
    'hover:bg-gray-50 hover:border-gray-300',
    'focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    'disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-100',
    'active:bg-gray-200',
    'transition-all duration-200',
  ].join(' '),

  ghost: [
    'bg-transparent text-gray-700',
    'hover:bg-gray-100',
    'focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    'disabled:text-gray-400',
    'active:bg-gray-200',
    'transition-all duration-200',
  ].join(' '),

  danger: [
    'bg-red-500 text-white',  // Using semantic.error.DEFAULT equivalent
    'hover:bg-red-600',
    'focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
    'disabled:bg-red-300 disabled:text-red-100',
    'active:bg-red-700',      // Using semantic.error.dark equivalent
    'shadow-sm hover:shadow-md transition-all duration-200',
  ].join(' '),
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm font-medium h-8',
  md: 'px-4 py-2 text-sm font-medium h-10',
  lg: 'px-6 py-2.5 text-base font-medium h-12',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'secondary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    children,
    disabled,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'rounded-lg font-medium',
          'transition-all duration-200 ease-out',
          'focus:outline-none focus:ring-offset-white',
          'disabled:cursor-not-allowed disabled:opacity-60',

          // Variant styles
          buttonVariants[variant],

          // Size styles
          buttonSizes[size],

          // Full width
          fullWidth && 'w-full',

          // Custom className
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className={cn(
              'animate-spin',
              size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4',
              children ? 'mr-2' : ''
            )}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {!loading && icon && iconPosition === 'left' && (
          <span className={cn(
            size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4',
            children ? 'mr-2' : ''
          )}>
            {icon}
          </span>
        )}

        {children}

        {!loading && icon && iconPosition === 'right' && (
          <span className={cn(
            size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4',
            children ? 'ml-2' : ''
          )}>
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };