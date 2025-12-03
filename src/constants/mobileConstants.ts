/**
 * Mobile UI Constants and Breakpoints
 *
 * Standards compliance:
 * - WCAG 2.5.5 (AAA): 44×44px minimum touch targets
 * - iOS Human Interface Guidelines: 44×44pt minimum
 * - Material Design: 48×48dp (we use 44 for iOS consistency)
 */

// Import from responsive.ts for internal use
// Use these for all responsive layout decisions
import { BREAKPOINTS as RESPONSIVE_BREAKPOINTS } from './responsive';
export { getViewportCategory } from './responsive';

/**
 * Responsive breakpoints
 * NOTE: For responsive layout breakpoints, use BREAKPOINTS from './responsive.ts'
 * These are Tailwind-style utility breakpoints for CSS classes only
 * The canonical breakpoints for mobile/tablet/desktop detection are in responsive.ts
 */
export const TAILWIND_BREAKPOINTS = {
  sm: 640,   // Small devices (phones, 640px and up)
  md: 768,   // Medium devices (tablets, 768px and up)
  lg: 1024,  // Large devices (desktops, 1024px and up)
  xl: 1280,  // Extra large devices (1280px and up)
  '2xl': 1536, // 2X Extra large devices (1536px and up)
} as const;

/**
 * Touch target standards
 */
export const TOUCH_STANDARDS = {
  // Minimum touch target size
  minTouchTarget: 44,      // 44×44px (iOS HIG / WCAG 2.5.5 AAA)
  recommendedTarget: 48,   // 48×48px (Material Design)

  // Minimum spacing between touch targets
  minSpacing: 16,          // 16px between tappable elements
  recommendedSpacing: 24,  // 24px for comfortable spacing

  // Icon sizes for different button sizes
  iconSizes: {
    sm: 16,  // Small icons (16×16px)
    md: 20,  // Medium icons (20×20px)
    lg: 24,  // Large icons (24×24px)
  },
} as const;

/**
 * Mobile typography scale
 */
export const MOBILE_TYPOGRAPHY = {
  // Base font sizes (px)
  base: 16,              // Base font 16px (readable without zoom)
  heading: {
    h1: 24,              // Mobile H1
    h2: 20,              // Mobile H2
    h3: 18,              // Mobile H3
    h4: 16,              // Mobile H4
  },
  body: {
    large: 18,           // Large body text
    base: 16,            // Standard body text
    small: 14,           // Small text
  },
  caption: 12,           // Caption/helper text
  button: 16,            // Button text

  // Line heights
  lineHeight: {
    tight: 1.2,          // Headings
    base: 1.5,           // Body text
    relaxed: 1.75,       // Long-form reading
  },
} as const;

/**
 * Thumb zones for one-handed mobile use
 * Based on reach analysis for average hand size
 */
export const THUMB_ZONES = {
  easy: {
    description: 'bottom 1/3',
    range: [0.67, 1.0],  // 67-100% from top
    use: 'Primary actions, navigation',
  },
  stretch: {
    description: 'middle 1/3',
    range: [0.33, 0.67], // 33-67% from top
    use: 'Secondary actions, content',
  },
  hard: {
    description: 'top 1/3',
    range: [0.0, 0.33],  // 0-33% from top
    use: 'Infrequent actions only',
  },
} as const;

/**
 * Animation standards for mobile
 * Optimized for 60fps performance
 */
export const MOBILE_ANIMATIONS = {
  // Duration in milliseconds
  duration: {
    instant: 100,        // Feels immediate
    fast: 200,           // Quick feedback
    normal: 300,         // Standard transitions
    slow: 500,           // Deliberate, attention-drawing
  },

  // Easing functions
  easing: {
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',  // Material standard
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)', // Enter screen
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',   // Exit screen
    sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',      // Crisp movement
  },

  // Performance guidelines
  performance: {
    targetFps: 60,       // Target frame rate
    maxDuration: 300,    // Max animation duration for instant feel
    budgetMs: 16.67,     // Frame budget at 60fps (1000ms / 60fps)
  },
} as const;

/**
 * Safe area insets for notched devices
 * iOS and Android safe areas
 */
export const SAFE_AREA = {
  // CSS environment variables
  top: 'env(safe-area-inset-top)',
  bottom: 'env(safe-area-inset-bottom)',
  left: 'env(safe-area-inset-left)',
  right: 'env(safe-area-inset-right)',

  // Common values for development
  fallback: {
    top: 44,      // iOS notch area
    bottom: 34,   // iOS home indicator area
    left: 0,      // No side notches (yet)
    right: 0,     // No side notches (yet)
  },
} as const;

/**
 * Mobile header/footer heights
 */
export const MOBILE_CHROME = {
  header: {
    compact: 56,         // Compact mobile header (56px)
    standard: 64,        // Standard mobile header (64px)
  },
  bottomNav: {
    standard: 56,        // Bottom navigation (56px)
    withSafeArea: 90,    // Bottom nav + safe area (56 + 34)
  },
  tabBar: {
    standard: 48,        // Tab bar height (48px)
  },
} as const;

/**
 * Mobile spacing scale
 * Based on 4px grid system
 */
export const MOBILE_SPACING = {
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 16,   // 16px
  lg: 24,   // 24px
  xl: 32,   // 32px
  '2xl': 48,  // 48px
  '3xl': 64,  // 64px
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
  max: 9999,
} as const;

/**
 * Mobile viewport detection utilities
 * Uses RESPONSIVE_BREAKPOINTS from responsive.ts for consistency
 */
export const isMobileViewport = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= RESPONSIVE_BREAKPOINTS.mobile.max;
};

export const isTabletViewport = (): boolean => {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= RESPONSIVE_BREAKPOINTS.tablet.min && width <= RESPONSIVE_BREAKPOINTS.tablet.max;
};

export const isDesktopViewport = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= RESPONSIVE_BREAKPOINTS.desktop.min;
};

/**
 * Get current viewport type
 */
export type ViewportType = 'mobile' | 'tablet' | 'desktop';

export const getViewportType = (): ViewportType => {
  if (isMobileViewport()) return 'mobile';
  if (isTabletViewport()) return 'tablet';
  return 'desktop';
};

/**
 * Utility: Check if device supports touch
 */
export const isTouchDevice = (): boolean => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - legacy IE/Edge support, property may not exist
    navigator.msMaxTouchPoints > 0
  );
};

/**
 * Utility: Check if device has hover capability
 */
export const hasHoverCapability = (): boolean => {
  return window.matchMedia('(hover: hover)').matches;
};

/**
 * Utility: Check if reduced motion is preferred
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Utility: Get safe animation duration based on user preferences
 */
export const getSafeAnimationDuration = (normalDuration: number): number => {
  return prefersReducedMotion() ? 0 : normalDuration;
};
