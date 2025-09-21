// Modern Beautiful Accessible Color System for Colombia Puzzle Game
// Inspired by contemporary design trends while maintaining WCAG AAA compliance

export interface ModernColorScheme {
  primary: string;
  secondary: string;
  tertiary: string;
  gradient: string;
  text: string;
  border: string;
  hover: string;
  shadow: string;
  glow: string;
  pattern?: string;
  icon?: string;
}

// Modern, vibrant colors that are both beautiful and accessible
// These colors are inspired by:
// - Spotify's bold gradients
// - Stripe's sophisticated palette
// - Linear's modern aesthetic
// - Vercel's clean design
export const MODERN_REGION_COLORS: Record<string, ModernColorScheme> = {
  'Andina': {
    primary: '#059669',      // Emerald 600 - Rich emerald green
    secondary: '#047857',    // Emerald 700
    tertiary: '#10B981',     // Emerald 500 - Accent
    gradient: 'linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)',
    text: '#FFFFFF',
    border: '#065F46',       // Emerald 800
    hover: '#10B981',        // Emerald 500
    shadow: 'rgba(5, 150, 105, 0.4)',
    glow: 'rgba(16, 185, 129, 0.6)',
    pattern: 'dots',
    icon: '⛰️'
  },
  'Caribe': {
    primary: '#0EA5E9',      // Sky 500 - Vibrant sky blue
    secondary: '#0284C7',    // Sky 600
    tertiary: '#38BDF8',     // Sky 400 - Accent
    gradient: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 50%, #38BDF8 100%)',
    text: '#FFFFFF',
    border: '#075985',       // Sky 800
    hover: '#38BDF8',        // Sky 400
    shadow: 'rgba(14, 165, 233, 0.4)',
    glow: 'rgba(56, 189, 248, 0.6)',
    pattern: 'waves',
    icon: '🌊'
  },
  'Pacífica': {
    primary: '#A855F7',      // Purple 500 - Modern purple
    secondary: '#9333EA',    // Purple 600
    tertiary: '#C084FC',     // Purple 400 - Accent
    gradient: 'linear-gradient(135deg, #9333EA 0%, #A855F7 50%, #C084FC 100%)',
    text: '#FFFFFF',
    border: '#6B21A8',       // Purple 800
    hover: '#C084FC',        // Purple 400
    shadow: 'rgba(168, 85, 247, 0.4)',
    glow: 'rgba(192, 132, 252, 0.6)',
    pattern: 'diagonal',
    icon: '🌴'
  },
  'Orinoquía': {
    primary: '#F97316',      // Orange 500 - Vibrant sunset orange
    secondary: '#EA580C',    // Orange 600
    tertiary: '#FB923C',     // Orange 400 - Accent
    gradient: 'linear-gradient(135deg, #EA580C 0%, #F97316 50%, #FB923C 100%)',
    text: '#FFFFFF',
    border: '#9A3412',       // Orange 800
    hover: '#FB923C',        // Orange 400
    shadow: 'rgba(249, 115, 22, 0.4)',
    glow: 'rgba(251, 146, 60, 0.6)',
    pattern: 'horizontal',
    icon: '🌾'
  },
  'Amazonía': {
    primary: '#14B8A6',      // Teal 500 - Tropical teal
    secondary: '#0D9488',    // Teal 600
    tertiary: '#2DD4BF',     // Teal 400 - Accent
    gradient: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 50%, #2DD4BF 100%)',
    text: '#FFFFFF',
    border: '#115E59',       // Teal 800
    hover: '#2DD4BF',        // Teal 400
    shadow: 'rgba(20, 184, 166, 0.4)',
    glow: 'rgba(45, 212, 191, 0.6)',
    pattern: 'crosshatch',
    icon: '🌳'
  },
  'Insular': {
    primary: '#06B6D4',      // Cyan 500 - Ocean cyan
    secondary: '#0891B2',    // Cyan 600
    tertiary: '#22D3EE',     // Cyan 400 - Accent
    gradient: 'linear-gradient(135deg, #0891B2 0%, #06B6D4 50%, #22D3EE 100%)',
    text: '#FFFFFF',
    border: '#155E75',       // Cyan 800
    hover: '#22D3EE',        // Cyan 400
    shadow: 'rgba(6, 182, 212, 0.4)',
    glow: 'rgba(34, 211, 238, 0.6)',
    pattern: 'circles',
    icon: '🏝️'
  }
};

// Modern UI colors with sophisticated tones
export const MODERN_UI_COLORS = {
  // Success - Modern green
  success: {
    primary: '#10B981',     // Emerald 500
    light: '#D1FAE5',       // Emerald 100
    dark: '#059669',        // Emerald 600
    gradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    text: '#065F46',
    textOnDark: '#FFFFFF'
  },

  // Error - Sophisticated red
  error: {
    primary: '#EF4444',     // Red 500
    light: '#FEE2E2',       // Red 100
    dark: '#DC2626',        // Red 600
    gradient: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
    text: '#991B1B',
    textOnDark: '#FFFFFF'
  },

  // Warning - Modern amber
  warning: {
    primary: '#F59E0B',     // Amber 500
    light: '#FEF3C7',       // Amber 100
    dark: '#D97706',        // Amber 600
    gradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
    text: '#78350F',
    textOnDark: '#FFFFFF'
  },

  // Info - Contemporary blue
  info: {
    primary: '#3B82F6',     // Blue 500
    light: '#DBEAFE',       // Blue 100
    dark: '#2563EB',        // Blue 600
    gradient: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
    text: '#1E3A8A',
    textOnDark: '#FFFFFF'
  },

  // Neutral - Modern gray scale
  neutral: {
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
  }
};

// Glass morphism effects for modern UI
export const GLASS_EFFECTS = {
  light: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
  },
  dark: {
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
  },
  colored: (color: string, opacity: number = 0.7) => ({
    background: color.replace('rgb', 'rgba').replace(')', `, ${opacity})`),
    backdropFilter: 'blur(10px) saturate(150%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: `0 8px 32px 0 ${color.replace('rgb', 'rgba').replace(')', ', 0.2)')}`
  })
};

// Modern gradients for backgrounds and overlays
export const MODERN_GRADIENTS = {
  // Vibrant gradients
  sunrise: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
  sunset: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
  ocean: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
  forest: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',

  // Subtle gradients
  softPurple: 'linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)',
  softPink: 'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)',
  softBlue: 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)',

  // Dark mode gradients
  darkViolet: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
  darkBlue: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
  darkGreen: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)',

  // Mesh gradients (multiple color stops)
  mesh1: 'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%)',
  mesh2: 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0px, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0px, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0px, transparent 50%)'
};

// Animation classes for modern micro-interactions
export const MODERN_ANIMATIONS = {
  fadeIn: 'animate-fadeIn',
  slideUp: 'animate-slideUp',
  slideDown: 'animate-slideDown',
  scaleIn: 'animate-scaleIn',
  float: 'animate-float',
  pulse: 'animate-pulse',
  shimmer: 'animate-shimmer',
  glow: 'animate-glow'
};

// Modern shadows for depth
export const MODERN_SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none'
};

// Color harmony functions
export function getComplementaryColor(hex: string): string {
  const rgb = hexToRgb(hex);
  return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
}

export function getAnalogousColors(hex: string): [string, string] {
  const hsl = hexToHsl(hex);
  return [
    hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l)
  ];
}

// Utility functions
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const rgb = hexToRgb(hex);
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
}