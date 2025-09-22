/**
 * Modern Design System - Shadow Tokens
 * Subtle, layered shadows for depth and elevation
 */

export const shadows = {
  // Base shadow scale
  none: 'none',

  // Subtle shadows for cards and buttons
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',

  // Inner shadows
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

// Semantic shadow tokens
export const shadowTokens = {
  // Interactive elements
  button: {
    default: shadows.sm,
    hover: shadows.md,
    active: shadows.xs,
    focus: '0 0 0 3px rgb(59 130 246 / 0.15)', // Blue focus ring
  },

  // Cards and panels
  card: {
    default: shadows.sm,
    hover: shadows.lg,
    elevated: shadows.xl,
  },

  // Modals and overlays
  modal: shadows['2xl'],
  dropdown: shadows.lg,
  tooltip: shadows.md,

  // Floating elements
  floating: shadows.xl,

  // Game-specific shadows
  game: {
    piece: shadows.md,
    pieceHover: shadows.lg,
    pieceActive: shadows.xs,
    map: shadows.sm,
    header: shadows.sm,
  },
} as const;

export type ShadowScale = typeof shadows;
export type ShadowTokens = typeof shadowTokens;