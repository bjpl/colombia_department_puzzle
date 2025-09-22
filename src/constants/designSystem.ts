/**
 * Colombia Puzzle Game - Modern Design System
 *
 * Design Philosophy:
 * - Clean, minimal interface inspired by Linear, Vercel, Stripe
 * - Subtle depth through careful shadow usage
 * - Consistent interactive states
 * - Accessibility-first with WCAG AAA compliance
 * - Performance through CSS variables and minimal complexity
 */

// ============================================
// COLOR SYSTEM
// ============================================

export const colors = {
  // Brand Colors - Modern, sophisticated palette
  brand: {
    50: '#F0F9FF',   // Lightest brand tint
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',  // Primary brand color
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
    950: '#082F49'   // Darkest brand shade
  },

  // Semantic Colors - Clear, purposeful usage
  semantic: {
    success: {
      light: '#DCFCE7',
      DEFAULT: '#22C55E',
      dark: '#15803D',
      contrast: '#FFFFFF'
    },
    warning: {
      light: '#FEF3C7',
      DEFAULT: '#F59E0B',
      dark: '#92400E',
      contrast: '#FFFFFF'
    },
    error: {
      light: '#FEE2E2',
      DEFAULT: '#EF4444',
      dark: '#991B1B',
      contrast: '#FFFFFF'
    },
    info: {
      light: '#DBEAFE',
      DEFAULT: '#3B82F6',
      dark: '#1E40AF',
      contrast: '#FFFFFF'
    }
  },

  // Neutral Grays - Modern scale
  gray: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
    950: '#09090B'
  },

  // Interactive States
  interactive: {
    primary: '#0EA5E9',      // Primary actions
    primaryHover: '#0284C7',
    primaryActive: '#0369A1',

    secondary: '#71717A',    // Secondary actions
    secondaryHover: '#52525B',
    secondaryActive: '#3F3F46',

    ghost: 'transparent',    // Ghost buttons
    ghostHover: '#F4F4F5',
    ghostActive: '#E4E4E7',

    disabled: '#D4D4D8',
    disabledText: '#A1A1AA'
  },

  // Surface Colors
  surface: {
    background: '#FFFFFF',
    backgroundAlt: '#FAFAFA',
    card: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
    border: '#E4E4E7',
    divider: '#E4E4E7'
  }
};

// ============================================
// TYPOGRAPHY SYSTEM
// ============================================

export const typography = {
  // Font families
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'JetBrains Mono, monospace'
  },

  // Font sizes with line heights
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],      // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
  },

  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  }
};

// ============================================
// SPACING SYSTEM
// ============================================

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
};

// ============================================
// BORDER RADIUS SYSTEM
// ============================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px - Subtle rounding
  DEFAULT: '0.5rem', // 8px - Default for cards, buttons
  md: '0.75rem',    // 12px - Medium components
  lg: '1rem',       // 16px - Large components
  xl: '1.5rem',     // 24px - Extra large
  full: '9999px'    // Pills, circular elements
};

// ============================================
// SHADOWS SYSTEM
// ============================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Colored shadows for emphasis
  brand: '0 4px 14px 0 rgba(14, 165, 233, 0.3)',
  success: '0 4px 14px 0 rgba(34, 197, 94, 0.3)',
  error: '0 4px 14px 0 rgba(239, 68, 68, 0.3)',

  // Inset shadows
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  'inner-lg': 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.1)'
};

// ============================================
// ANIMATIONS
// ============================================

export const animations = {
  // Durations
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms'
  },

  // Easing functions
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },

  // Predefined animations
  transitions: {
    all: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'background-color 200ms, border-color 200ms, color 200ms, fill 200ms, stroke 200ms',
    opacity: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

// ============================================
// COMPONENT STYLES
// ============================================

export const components = {
  // Button styles
  button: {
    base: 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',

    variants: {
      primary: `bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 focus:ring-brand-500`,
      secondary: `bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-500`,
      outline: `border-2 border-gray-300 bg-transparent hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-500`,
      ghost: `bg-transparent hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-500`,
      danger: `bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-500`
    },

    sizes: {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-base rounded-md',
      lg: 'px-6 py-3 text-lg rounded-lg',
      xl: 'px-8 py-4 text-xl rounded-lg'
    }
  },

  // Card styles
  card: {
    base: 'bg-white rounded-lg border border-gray-200 shadow-sm',
    hover: 'hover:shadow-md hover:border-gray-300 transition-all',
    padding: {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8'
    }
  },

  // Input styles
  input: {
    base: 'w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-gray-100 disabled:cursor-not-allowed',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    sizes: {
      sm: 'px-2 py-1 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg'
    }
  },

  // Modal styles
  modal: {
    overlay: 'fixed inset-0 bg-black bg-opacity-50 z-40',
    content: 'fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 max-w-lg w-full max-h-[90vh] overflow-auto',
    header: 'px-6 py-4 border-b border-gray-200',
    body: 'px-6 py-4',
    footer: 'px-6 py-4 border-t border-gray-200 flex justify-end gap-3'
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const utils = {
  // Generate consistent class names
  cn: (...classes: (string | undefined | null | boolean)[]) => {
    return classes.filter(Boolean).join(' ');
  },

  // Get semantic color based on state
  getSemanticColor: (type: 'success' | 'warning' | 'error' | 'info') => {
    return colors.semantic[type];
  },

  // Generate button classes
  getButtonClasses: (variant: keyof typeof components.button.variants, size: keyof typeof components.button.sizes) => {
    return `${components.button.base} ${components.button.variants[variant]} ${components.button.sizes[size]}`;
  }
};

// ============================================
// ACCESSIBILITY UTILITIES
// ============================================

export const a11y = {
  // Focus visible styles
  focusVisible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',

  // Screen reader only
  srOnly: 'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0',

  // Minimum touch target size
  minTouchTarget: 'min-h-[44px] min-w-[44px]',

  // High contrast mode support
  highContrast: {
    border: 'contrast-more:border-2 contrast-more:border-gray-900',
    text: 'contrast-more:text-gray-900',
    background: 'contrast-more:bg-white'
  }
};

// Export default theme object
export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  components,
  utils,
  a11y
};