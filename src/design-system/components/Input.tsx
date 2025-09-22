import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

/**
 * Modern Input Component - Clean form input with consistent styling
 */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    variant = 'default',
    fullWidth = false,
    leftIcon,
    rightIcon,
    type,
    ...props
  }, ref) => {
    const hasIcons = leftIcon || rightIcon;

    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        <input
          type={type}
          className={cn(
            // Base styles
            'flex h-10 rounded-lg border border-gray-200 bg-white px-3 py-2',
            'text-sm text-gray-900 placeholder:text-gray-500',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',

            // Icon padding
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',

            // Variant styles
            variant === 'error' && [
              'border-error-500 focus:ring-error-500',
              'text-error-900 placeholder:text-error-500',
            ],

            // Full width
            fullWidth && 'w-full',

            className
          )}
          ref={ref}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };