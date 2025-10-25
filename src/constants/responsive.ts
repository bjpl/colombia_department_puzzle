/**
 * Responsive Design System - Breakpoints and Layout Constants
 *
 * These values are used across the application for responsive behavior.
 * Other agents (Touch, PWA, Components, Testing) depend on these constants.
 *
 * Design Philosophy:
 * - Mobile-first approach (design for smallest screen first)
 * - Touch-friendly targets (44px minimum on mobile per Apple/Google guidelines)
 * - Progressive enhancement (add features as screen size increases)
 */

/**
 * Responsive Breakpoints
 *
 * Usage:
 * - Mobile: 0-767px (phones in portrait/landscape)
 * - Tablet: 768-1023px (tablets, small laptops)
 * - Desktop: 1024px+ (large screens)
 */
export const BREAKPOINTS = {
  mobile: {
    max: 1023, // Increased to catch phones in landscape (was 767)
    minTouchTarget: 44, // Apple Human Interface Guidelines
    spacing: 16, // Comfortable for thumbs
  },
  tablet: {
    min: 1024, // Now starts at old desktop breakpoint
    max: 1279, // Standard tablet/small laptop range
    minTouchTarget: 44, // Still touch-first
    spacing: 20, // Slightly more room
  },
  desktop: {
    min: 1280, // Large screens only (was 1024)
    minTouchTarget: 32, // Mouse precision allows smaller targets
    spacing: 24, // Generous spacing
  },
} as const;

/**
 * Bottom Sheet Snap Points
 *
 * Three states for mobile bottom drawer:
 * - collapsed: Shows peek (one row of departments)
 * - half: Working height for browsing departments
 * - full: Maximum expansion (leaves room for header)
 */
export const BOTTOM_SHEET_SNAP_POINTS = {
  collapsed: 120, // px - Show hint that more content exists
  half: '50vh', // Comfortable browsing height
  full: '85vh', // Max - maintains header visibility
} as const;

/**
 * Mobile Layout Dimensions
 */
export const MOBILE_LAYOUT = {
  headerHeight: 56, // px - Standard mobile app header
  dragHandleHeight: 44, // px - Touch target for handle (WCAG AAA compliant - 44px minimum)
  dragHandleWidth: 44, // px - Touch target width (WCAG AAA compliant - 44px minimum)
  backdropBlur: 8, // px - For floating header
  transitionDuration: 300, // ms - Smooth but not sluggish
  swipeThreshold: 50, // px - Minimum drag distance to trigger snap
  velocityThreshold: 0.5, // px/ms - Fast swipe triggers snap
} as const;

/**
 * Tablet Layout Dimensions (Hybrid Mode)
 */
export const TABLET_LAYOUT = {
  headerHeight: 64, // px - Slightly larger than mobile
  sidebarWidth: 320, // px - Comfortable for department cards
  spacing: 20, // px
} as const;

/**
 * Safe Area Insets (iOS notches, Android gestures)
 *
 * Use with CSS: env(safe-area-inset-top) etc.
 */
export const SAFE_AREA = {
  top: 'env(safe-area-inset-top, 0px)',
  right: 'env(safe-area-inset-right, 0px)',
  bottom: 'env(safe-area-inset-bottom, 0px)',
  left: 'env(safe-area-inset-left, 0px)',
} as const;

/**
 * Animation Spring Physics
 *
 * For smooth, natural feeling animations
 */
export const SPRING_CONFIG = {
  // Responsive spring - quick but not jarring
  default: {
    tension: 300,
    friction: 30,
  },
  // Gentle spring - smooth and fluid
  gentle: {
    tension: 200,
    friction: 25,
  },
  // Stiff spring - immediate response
  stiff: {
    tension: 400,
    friction: 40,
  },
} as const;

/**
 * Z-Index Layers
 *
 * Maintains consistent stacking context
 */
export const Z_INDEX = {
  base: 1,
  header: 100,
  bottomSheet: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
} as const;

/**
 * Media Query Strings
 *
 * Pre-formatted for use in CSS or matchMedia()
 *
 * CRITICAL: Mobile query now catches all phones including landscape mode
 * - Phones in portrait: 320-430px (always mobile)
 * - Phones in landscape: 640-932px (now detected as mobile!)
 * - Tablets: 1024-1279px
 * - Desktop: 1280px+
 */
export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.mobile.max}px)`, // Now 1023px - catches phone landscape
  tablet: `(min-width: ${BREAKPOINTS.tablet.min}px) and (max-width: ${BREAKPOINTS.tablet.max}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop.min}px)`,
  touch: '(hover: none) and (pointer: coarse)',
  mouse: '(hover: hover) and (pointer: fine)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  darkMode: '(prefers-color-scheme: dark)',
} as const;

/**
 * Helper Functions
 */

/**
 * Check if viewport is mobile size
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= BREAKPOINTS.mobile.max;
}

/**
 * Check if viewport is tablet size
 */
export function isTabletViewport(): boolean {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= BREAKPOINTS.tablet.min && width <= BREAKPOINTS.tablet.max;
}

/**
 * Check if viewport is desktop size
 */
export function isDesktopViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS.desktop.min;
}

/**
 * Get current viewport category
 */
export function getViewportCategory(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width <= BREAKPOINTS.mobile.max) return 'mobile';
  if (width <= BREAKPOINTS.tablet.max) return 'tablet';
  return 'desktop';
}

/**
 * Check if device supports touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}
