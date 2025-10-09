/**
 * Modern Design System - Border Radius Tokens
 * Consistent rounded corners for modern aesthetic
 */

export const radius = {
  // Tailwind-compatible radius scale
  none: '0px',
  sm: '0.125rem',     // 2px - Subtle rounding
  DEFAULT: '0.25rem', // 4px - Default rounding
  md: '0.375rem',     // 6px - Medium rounding
  lg: '0.5rem',       // 8px - Large rounding (buttons, badges)
  xl: '0.75rem',      // 12px - Extra large (cards, inputs)
  '2xl': '1rem',      // 16px - Very large (modals, panels)
  '3xl': '1.5rem',    // 24px - Extra rounded
  full: '9999px',     // Fully rounded (pills, circular buttons)
} as const;

// Semantic radius tokens for specific use cases
export const semanticRadius = {
  // Interactive elements
  button: {
    sm: radius.lg,      // 8px
    md: radius.lg,      // 8px
    lg: radius.lg,      // 8px
    pill: radius.full,  // Fully rounded
  },

  // Content containers
  card: {
    default: radius.xl,   // 12px
    large: radius['2xl'], // 16px
  },

  // Form elements
  input: {
    default: radius.lg,  // 8px
    large: radius.xl,    // 12px
  },

  // Modal and overlay
  modal: {
    default: radius['2xl'],  // 16px
    large: radius['3xl'],    // 24px
  },

  // Small elements
  badge: radius.lg,          // 8px
  tag: radius.md,            // 6px
  chip: radius.full,         // Fully rounded

  // Game-specific elements
  game: {
    departmentChip: radius.xl,        // 12px
    map: radius.none,                 // Sharp edges for map
    panel: radius['2xl'],             // 16px
    bottomSheet: '16px 16px 0 0',     // Rounded top only
  },
} as const;

// Component-specific radius configurations
export const componentRadius = {
  // Bottom sheet: rounded top corners only
  bottomSheet: {
    topLeft: radius['2xl'],
    topRight: radius['2xl'],
    bottomLeft: radius.none,
    bottomRight: radius.none,
  },

  // Department chip: consistent rounding
  departmentChip: {
    all: radius.xl,  // 12px all corners
  },

  // Modal: large rounded corners
  dialog: {
    all: radius['2xl'],  // 16px all corners
  },

  // Cards: moderate rounding
  card: {
    all: radius.xl,  // 12px all corners
  },
} as const;

// Alias semanticRadius as radiusTokens for consistency with other tokens
export const radiusTokens = semanticRadius;

export type RadiusScale = typeof radius;
export type RadiusTokens = typeof radiusTokens;
export type SemanticRadius = typeof semanticRadius;
export type ComponentRadius = typeof componentRadius;
