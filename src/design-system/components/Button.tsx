import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';
import { TouchFeedback } from '../../components/ui/TouchFeedback';
import { FeedbackType } from '../../hooks/useTouchFeedback';

/**
 * Modern Button Component - Clean Linear/Vercel Style
 * Mobile-optimized with 44px minimum touch targets
 * Includes touch feedback (haptics + visual ripple)
 *
 * Standards:
 * - WCAG 2.5.5 (AAA): 44×44px minimum touch target
 * - iOS HIG: 44×44pt minimum
 * - Material Design: 48×48dp (we use 44 for consistency)
 */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  touchFeedback?: boolean;
  feedbackType?: FeedbackType;
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
  // Mobile: Enforce 44px minimum height for touch targets
  // Desktop: Can be smaller for better visual density
  sm: 'px-3 py-1.5 text-sm font-medium min-h-[44px] md:min-h-[32px] md:h-8',
  md: 'px-4 py-2 text-sm font-medium min-h-[44px] md:h-10',
  lg: 'px-6 py-2.5 text-base font-medium min-h-[44px] md:h-12',
};

const iconOnlySizes = {
  // Icon-only buttons: Exact 44×44px on mobile
  sm: 'min-w-[44px] min-h-[44px] p-0 md:w-8 md:h-8 md:min-w-0 md:min-h-0',
  md: 'min-w-[44px] min-h-[44px] p-0 md:w-10 md:h-10 md:min-w-0 md:min-h-0',
  lg: 'min-w-[44px] min-h-[44px] p-0 md:w-12 md:h-12 md:min-w-0 md:min-h-0',
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
    touchFeedback = true,
    feedbackType = 'tap',
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;
    const isIconOnly = icon && !children;

    const buttonElement = (
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

          // Mobile touch feedback: Scale down slightly on active
          'active:scale-[0.97] active:shadow-inner',

          // Variant styles
          buttonVariants[variant],

          // Size styles - Different for icon-only vs text buttons
          isIconOnly ? iconOnlySizes[size] : buttonSizes[size],

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

    // Wrap with touch feedback if enabled and not disabled
    if (touchFeedback && !isDisabled) {
      return (
        <TouchFeedback
          type={feedbackType}
          enabled={touchFeedback}
          className="inline-flex"
        >
          {buttonElement}
        </TouchFeedback>
      );
    }

    return buttonElement;
  }
);

Button.displayName = 'Button';

export { Button };