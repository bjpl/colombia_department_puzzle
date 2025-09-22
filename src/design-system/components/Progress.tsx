import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

/**
 * Modern Progress Component - Clean progress indicator
 */

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
}

const progressSizes = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const progressVariants = {
  default: 'bg-gray-900',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
};

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({
    className,
    value,
    max = 100,
    size = 'md',
    variant = 'default',
    showLabel = false,
    label,
    ...props
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {showLabel && (
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">
              {label || 'Progress'}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(percentage)}%
            </span>
          </div>
        )}

        <div
          className={cn(
            'w-full bg-gray-200 rounded-full overflow-hidden',
            progressSizes[size]
          )}
        >
          <div
            className={cn(
              'transition-all duration-500 ease-out rounded-full',
              progressSizes[size],
              progressVariants[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };