/**
 * Modern Design System - Shadow Tokens
 * Subtle elevation system for depth and hierarchy
 */

export const shadows = {
  // Tailwind-compatible shadow scale
  none: 'none',

  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  // Subtle shadow for cards, chips
  // Use for: Cards at rest, department chips

  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  // Standard shadow
  // Use for: Hover states, dropdowns

  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  // Medium shadow for elevated elements
  // Use for: Raised cards, bottom sheet

  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  // Large shadow for floating elements
  // Use for: Modals, popovers, tooltips

  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  // Extra large shadow for overlays
  // Use for: Dialogs, overlays

  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  // Dramatic shadow for emphasis
  // Use for: Hero cards, emphasized modals

  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  // Inner shadow for depth
  // Use for: Active/pressed states, inset elements
} as const;

// Semantic shadows for specific use cases
export const semanticShadows = {
  // Cards
  card: {
    default: shadows.sm,
    hover: shadows.md,
    elevated: shadows.lg,
  },

  // Buttons
  button: {
    default: shadows.sm,
    hover: shadows.md,
    active: shadows.inner,
  },

  // Modals and overlays
  overlay: {
    modal: shadows.xl,
    popover: shadows.lg,
    tooltip: shadows.md,
    dropdown: shadows.lg,
  },

  // Game-specific elements
  game: {
    departmentChip: shadows.sm,
    departmentChipHover: shadows.md,
    departmentChipDragging: shadows.xl,
    mapRegion: shadows.inner,
    header: shadows.sm,
    bottomSheet: shadows['2xl'],
  },

  // Feedback elements
  feedback: {
    success: '0 0 0 3px rgba(34, 197, 94, 0.1)',     // Green glow
    error: '0 0 0 3px rgba(239, 68, 68, 0.1)',       // Red glow
    warning: '0 0 0 3px rgba(245, 158, 11, 0.1)',    // Amber glow
    focus: '0 0 0 3px rgba(59, 130, 246, 0.1)',      // Blue glow
  },
} as const;

// Colored shadows for emphasis
export const coloredShadows = {
  // Brand colored shadows
  brand: {
    sm: '0 1px 3px 0 rgb(59 130 246 / 0.1)',
    md: '0 4px 6px -1px rgb(59 130 246 / 0.1)',
    lg: '0 10px 15px -3px rgb(59 130 246 / 0.15)',
  },

  // Success colored shadows
  success: {
    sm: '0 1px 3px 0 rgb(34 197 94 / 0.1)',
    md: '0 4px 6px -1px rgb(34 197 94 / 0.1)',
    lg: '0 10px 15px -3px rgb(34 197 94 / 0.15)',
  },

  // Error colored shadows
  error: {
    sm: '0 1px 3px 0 rgb(239 68 68 / 0.1)',
    md: '0 4px 6px -1px rgb(239 68 68 / 0.1)',
    lg: '0 10px 15px -3px rgb(239 68 68 / 0.15)',
  },
} as const;

// Alias semanticShadows as shadowTokens for consistency with other tokens
export const shadowTokens = semanticShadows;

export type ShadowScale = typeof shadows;
export type ShadowTokens = typeof shadowTokens;
export type SemanticShadows = typeof semanticShadows;
export type ColoredShadows = typeof coloredShadows;
