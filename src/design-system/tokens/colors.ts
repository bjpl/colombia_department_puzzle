/**
 * Modern Design System - Color Tokens
 * Inspired by Linear/Vercel clean aesthetics
 */

export const colors = {
  // Neutral grays - Primary semantic colors
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },

  // Primary brand colors
  brand: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Primary blue
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Semantic colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Colombia theme colors (optional, for cultural elements)
  colombia: {
    yellow: '#fcd116',
    blue: '#003893',
    red: '#ce1126',
  },

  // Surface colors for clean interfaces
  surface: {
    background: '#ffffff',
    muted: '#fafafa',
    subtle: '#f5f5f5',
    ui: '#f0f0f0',
    border: '#e5e5e5',
    ring: '#e0e7ff',
  },

  // Interactive states
  interactive: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    primaryActive: '#1d4ed8',
    secondary: '#f5f5f5',
    secondaryHover: '#e5e5e5',
    secondaryActive: '#d4d4d4',
  },

  // Text colors
  text: {
    primary: '#171717',
    secondary: '#525252',
    tertiary: '#a3a3a3',
    inverse: '#ffffff',
    brand: '#3b82f6',
    success: '#16a34a',
    warning: '#d97706',
    error: '#dc2626',
  },
} as const;

export type ColorScale = typeof colors;
export type ColorToken = keyof ColorScale;