/**
 * Modern Design System - Border Radius Tokens
 * Consistent rounded corners for modern aesthetics
 */

export const radius = {
  none: '0px',
  sm: '0.125rem',     // 2px
  base: '0.25rem',    // 4px
  md: '0.375rem',     // 6px
  lg: '0.5rem',       // 8px
  xl: '0.75rem',      // 12px
  '2xl': '1rem',      // 16px
  '3xl': '1.5rem',    // 24px
  full: '9999px',     // Perfect circle/pill
} as const;

// Semantic radius tokens
export const radiusTokens = {
  // Interactive elements
  button: {
    sm: radius.md,      // 6px
    md: radius.lg,      // 8px
    lg: radius.xl,      // 12px
    pill: radius.full,  // Full rounded
  },

  // Cards and containers
  card: radius.xl,      // 12px
  panel: radius['2xl'], // 16px
  modal: radius['2xl'], // 16px

  // Form elements
  input: radius.lg,     // 8px
  select: radius.lg,    // 8px
  checkbox: radius.sm,  // 2px

  // Game-specific elements
  game: {
    piece: radius.lg,     // 8px
    header: radius.xl,    // 12px
    badge: radius.full,   // Full rounded
    progress: radius.full, // Full rounded
  },

  // Badges and pills
  badge: radius.full,   // Full rounded
  tag: radius.md,       // 6px

  // Avatar and profile images
  avatar: radius.full,  // Circle

  // Feedback elements
  alert: radius.lg,     // 8px
  toast: radius.xl,     // 12px
} as const;

export type RadiusScale = typeof radius;
export type RadiusTokens = typeof radiusTokens;