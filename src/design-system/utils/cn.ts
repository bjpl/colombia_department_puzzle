import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function for combining class names
 * Simple implementation without external dependencies
 */

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

// If clsx is not available, use this simple fallback
export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}