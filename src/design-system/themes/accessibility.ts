/**
 * Accessibility Theme System
 * Colorblind modes and high-contrast themes
 */

// Colorblind mode types
export type ColorblindMode = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome';

// Focus visible styles for keyboard navigation
export const focusVisible = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2';

// Screen reader only utility
export const srOnly = 'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 [clip:rect(0,0,0,0)]';

// Minimum touch target size (WCAG 2.5.5 AAA)
export const minTouchTarget = 'min-h-[44px] min-w-[44px]';

// High contrast theme
export const highContrastTheme = {
  background: '#000000',
  foreground: '#FFFFFF',
  border: '#FFFFFF',
  interactive: '#FFFF00',  // High contrast yellow
};

// Accessibility patterns for visual distinction (SVG patterns)
export const accessibilityPatterns = {
  dots: {
    id: 'dots-pattern',
    d: 'M 0 0 L 10 0 L 10 10 L 0 10 Z',  // Placeholder - actual SVG pattern
  },
  waves: {
    id: 'waves-pattern',
    d: 'M 0 5 Q 2.5 0, 5 5 T 10 5',  // Placeholder
  },
  diagonal: {
    id: 'diagonal-pattern',
    d: 'M 0 0 L 10 10',  // Placeholder
  },
  horizontal: {
    id: 'horizontal-pattern',
    d: 'M 0 5 L 10 5',  // Placeholder
  },
  crosshatch: {
    id: 'crosshatch-pattern',
    d: 'M 0 0 L 10 10 M 0 10 L 10 0',  // Placeholder
  },
  circles: {
    id: 'circles-pattern',
    cx: 5,
    cy: 5,
    r: 3,  // Placeholder
  },
};

export type AccessibilityPatterns = typeof accessibilityPatterns;
