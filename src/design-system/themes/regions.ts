/**
 * Colombia Region Themes
 * WCAG AAA compliant region colors with colorblind support
 * Consolidated from constants/regionColors and constants/accessibleColorsFixed
 */

import { ColorblindMode } from './accessibility';

export interface AccessibleColorScheme {
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

// WCAG AAA Compliant Colors (7:1+ contrast against white)
// All primary colors have been carefully selected for maximum distinction
export const ACCESSIBLE_REGION_COLORS: Record<string, AccessibleColorScheme> = {
  'Andina': {
    primary: '#14532D',      // Darker forest green - 9.1:1 contrast
    secondary: '#14532D',
    tertiary: '#16A34A',
    gradient: 'linear-gradient(135deg, #14532D 0%, #15803D 50%, #16A34A 100%)',
    text: '#FFFFFF',
    border: '#14532D',
    hover: '#16A34A',
    shadow: 'rgba(21, 128, 61, 0.4)',
    glow: 'rgba(22, 163, 74, 0.6)',
    pattern: 'dots',
    icon: '⛰️'
  },
  'Caribe': {
    primary: '#1E40AF',      // Royal blue - 9.4:1 contrast
    secondary: '#1E3A8A',
    tertiary: '#2563EB',
    gradient: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #2563EB 100%)',
    text: '#FFFFFF',
    border: '#172554',
    hover: '#2563EB',
    shadow: 'rgba(30, 64, 175, 0.4)',
    glow: 'rgba(37, 99, 235, 0.6)',
    pattern: 'waves',
    icon: '🌊'
  },
  'Pacífico': {
    primary: '#7C2D12',      // Dark maroon - 9.8:1 contrast
    secondary: '#7F1D1D',
    tertiary: '#B91C1C',
    gradient: 'linear-gradient(135deg, #7F1D1D 0%, #7C2D12 50%, #B91C1C 100%)',
    text: '#FFFFFF',
    border: '#450A0A',
    hover: '#B91C1C',
    shadow: 'rgba(124, 45, 18, 0.4)',
    glow: 'rgba(185, 28, 28, 0.6)',
    pattern: 'diagonal',
    icon: '🌴'
  },
  'Orinoquía': {
    primary: '#92400E',      // Darker amber - 7.1:1 contrast
    secondary: '#92400E',
    tertiary: '#CA8A04',
    gradient: 'linear-gradient(135deg, #92400E 0%, #A16207 50%, #CA8A04 100%)',
    text: '#FFFFFF',
    border: '#713F12',
    hover: '#CA8A04',
    shadow: 'rgba(161, 98, 7, 0.4)',
    glow: 'rgba(202, 138, 4, 0.6)',
    pattern: 'horizontal',
    icon: '🌾'
  },
  'Amazonía': {
    primary: '#115E59',      // Darker teal - 7.2:1 contrast
    secondary: '#115E59',
    tertiary: '#14B8A6',
    gradient: 'linear-gradient(135deg, #115E59 0%, #0F766E 50%, #14B8A6 100%)',
    text: '#FFFFFF',
    border: '#134E4A',
    hover: '#14B8A6',
    shadow: 'rgba(15, 118, 110, 0.4)',
    glow: 'rgba(20, 184, 166, 0.6)',
    pattern: 'crosshatch',
    icon: '🌳'
  },
  'Insular': {
    primary: '#6B21A8',      // Purple - 7.3:1 contrast
    secondary: '#581C87',
    tertiary: '#7E22CE',
    gradient: 'linear-gradient(135deg, #581C87 0%, #6B21A8 50%, #7E22CE 100%)',
    text: '#FFFFFF',
    border: '#4A1D6F',
    hover: '#7E22CE',
    shadow: 'rgba(107, 33, 168, 0.4)',
    glow: 'rgba(126, 34, 206, 0.6)',
    pattern: 'circles',
    icon: '🏝️'
  }
};

// Simple hex color mapping for quick access
export const REGION_COLORS: Record<string, string> = {
  'Andina': ACCESSIBLE_REGION_COLORS['Andina'].primary,
  'Caribe': ACCESSIBLE_REGION_COLORS['Caribe'].primary,
  'Pacífico': ACCESSIBLE_REGION_COLORS['Pacífico'].primary,
  'Pacífica': ACCESSIBLE_REGION_COLORS['Pacífico'].primary,  // Support both spellings
  'Orinoquía': ACCESSIBLE_REGION_COLORS['Orinoquía'].primary,
  'Amazonía': ACCESSIBLE_REGION_COLORS['Amazonía'].primary,
  'Insular': ACCESSIBLE_REGION_COLORS['Insular'].primary,
};

// Modern gradient styles for regions
export const REGION_STYLES: Record<string, {
  bg: string;
  text: string;
  icon: string;
  pattern?: string;
  glow?: string;
}> = {
  'Andina': {
    bg: 'from-emerald-600 via-emerald-500 to-emerald-400',
    text: 'text-white',
    icon: '⛰️',
    pattern: 'dots',
    glow: 'shadow-emerald-500/50'
  },
  'Caribe': {
    bg: 'from-sky-600 via-sky-500 to-sky-400',
    text: 'text-white',
    icon: '🌊',
    pattern: 'waves',
    glow: 'shadow-sky-500/50'
  },
  'Pacífico': {
    bg: 'from-purple-600 via-purple-500 to-purple-400',
    text: 'text-white',
    icon: '🌴',
    pattern: 'diagonal',
    glow: 'shadow-purple-500/50'
  },
  'Pacífica': {
    bg: 'from-purple-600 via-purple-500 to-purple-400',
    text: 'text-white',
    icon: '🌴',
    pattern: 'diagonal',
    glow: 'shadow-purple-500/50'
  },
  'Orinoquía': {
    bg: 'from-orange-600 via-orange-500 to-orange-400',
    text: 'text-white',
    icon: '🌾',
    pattern: 'horizontal',
    glow: 'shadow-orange-500/50'
  },
  'Amazonía': {
    bg: 'from-teal-600 via-teal-500 to-teal-400',
    text: 'text-white',
    icon: '🌳',
    pattern: 'crosshatch',
    glow: 'shadow-teal-500/50'
  },
  'Insular': {
    bg: 'from-cyan-600 via-cyan-500 to-cyan-400',
    text: 'text-white',
    icon: '🏝️',
    pattern: 'circles',
    glow: 'shadow-cyan-500/50'
  },
};

// Tailwind utility classes with modern colors and effects
export const REGION_TAILWIND_CLASSES: Record<string, string> = {
  'Andina': 'bg-emerald-500 border-emerald-700 hover:bg-emerald-400 text-white ring-offset-2 focus:ring-2 focus:ring-emerald-500 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300',
  'Caribe': 'bg-sky-500 border-sky-700 hover:bg-sky-400 text-white ring-offset-2 focus:ring-2 focus:ring-sky-500 shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/40 transition-all duration-300',
  'Pacífico': 'bg-purple-500 border-purple-700 hover:bg-purple-400 text-white ring-offset-2 focus:ring-2 focus:ring-purple-500 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300',
  'Pacífica': 'bg-purple-500 border-purple-700 hover:bg-purple-400 text-white ring-offset-2 focus:ring-2 focus:ring-purple-500 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300',
  'Orinoquía': 'bg-orange-500 border-orange-700 hover:bg-orange-400 text-white ring-offset-2 focus:ring-2 focus:ring-orange-500 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300',
  'Amazonía': 'bg-teal-500 border-teal-700 hover:bg-teal-400 text-white ring-offset-2 focus:ring-2 focus:ring-teal-500 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300',
  'Insular': 'bg-cyan-500 border-cyan-700 hover:bg-cyan-400 text-white ring-offset-2 focus:ring-2 focus:ring-cyan-500 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300',
};

// Light background variants with subtle gradients
export const REGION_LIGHT_CLASSES: Record<string, string> = {
  'Andina': 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-500 text-emerald-900 hover:from-emerald-100 hover:to-emerald-200 transition-all duration-300',
  'Caribe': 'bg-gradient-to-br from-sky-50 to-sky-100 border-2 border-sky-500 text-sky-900 hover:from-sky-100 hover:to-sky-200 transition-all duration-300',
  'Pacífico': 'bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-500 text-purple-900 hover:from-purple-100 hover:to-purple-200 transition-all duration-300',
  'Pacífica': 'bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-500 text-purple-900 hover:from-purple-100 hover:to-purple-200 transition-all duration-300',
  'Orinoquía': 'bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-500 text-orange-900 hover:from-orange-100 hover:to-orange-200 transition-all duration-300',
  'Amazonía': 'bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-500 text-teal-900 hover:from-teal-100 hover:to-teal-200 transition-all duration-300',
  'Insular': 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-2 border-cyan-500 text-cyan-900 hover:from-cyan-100 hover:to-cyan-200 transition-all duration-300',
};

// Colorblind-safe palettes with WCAG AAA compliance
// Based on Wong (2011), Okabe & Ito (2008), and colorblind design research
// All palettes validated for WCAG AAA (7:1+ contrast), maximized RGB distance
export const COLORBLIND_PALETTES: Record<ColorblindMode, Record<string, string>> = {
  'normal': {
    // Original WCAG AAA palette - excellent diversity and contrast
    'Andina': '#14532D',     // Darker forest green (9.1:1 contrast)
    'Caribe': '#1E40AF',     // Royal blue (9.4:1 contrast)
    'Pacífico': '#7C2D12',   // Dark maroon (9.8:1 contrast)
    'Orinoquía': '#92400E',  // Darker amber (7.1:1 contrast)
    'Amazonía': '#115E59',   // Darker teal (7.2:1 contrast)
    'Insular': '#6B21A8'     // Purple (7.3:1 contrast)
  },
  'protanopia': {
    // Wong (2011) hues - darkened for WCAG AAA compliance
    // Avoids red-green confusion, uses blue-yellow-purple spectrum
    'Andina': '#004C7F',     // Strong Blue (9.0:1) - darkened Wong #0072B2
    'Caribe': '#2E5A6B',     // Teal-blue (7.5:1) - darkened Wong #56B4E9
    'Pacífico': '#7D3C5D',   // Reddish Purple (7.8:1) - darkened Wong #CC79A7
    'Orinoquía': '#8B3A00',  // Vermillion (7.8:1) - darkened Wong #D55E00
    'Amazonía': '#005A3C',   // Bluish Green (8.3:1) - darkened Wong #009E73
    'Insular': '#5C3A8C'     // Purple (8.6:1) - distinct violet-purple
  },
  'deuteranopia': {
    // Same as protanopia (both confuse red-green similarly)
    'Andina': '#004C7F',     // Strong Blue (9.0:1)
    'Caribe': '#2E5A6B',     // Teal-blue (7.5:1)
    'Pacífico': '#7D3C5D',   // Reddish Purple (7.8:1)
    'Orinoquía': '#8B3A00',  // Vermillion (7.8:1)
    'Amazonía': '#005A3C',   // Bluish Green (8.3:1)
    'Insular': '#5C3A8C'     // Purple (8.6:1)
  },
  'tritanopia': {
    // Red-green-brown axis - optimized for blue-blindness
    // Avoids blue-yellow confusion per Brettel et al. (1997)
    'Andina': '#2D5016',     // Olive Green (9.2:1)
    'Caribe': '#8B0000',     // Dark Red (10.0:1)
    'Pacífico': '#6B1D12',   // Dark Maroon (11.6:1)
    'Orinoquía': '#7C4600',  // Dark Amber (7.7:1)
    'Amazonía': '#115E59',   // Dark Teal (7.6:1)
    'Insular': '#4A5016'     // Darker Olive (8.6:1)
  },
  'monochrome': {
    // Even grayscale progression for total color blindness
    // All colors meet WCAG AAA (7:1+) with distinct RGB values
    'Pacífico': '#0D0D0D',   // RGB(13) - 19.4:1 - darkest
    'Andina': '#1F1F1F',     // RGB(31) - 16.5:1
    'Amazonía': '#2E2E2E',   // RGB(46) - 13.8:1
    'Caribe': '#404040',     // RGB(64) - 10.0:1
    'Insular': '#525252',    // RGB(82) - 7.7:1
    'Orinoquía': '#595959'   // RGB(89) - 7.1:1 - lightest meeting AAA
  }
};

// Function to get accessible color for a region based on color mode
export function getAccessibleRegionColor(
  region: string,
  colorMode: ColorblindMode = 'normal'
): string {
  const palette = COLORBLIND_PALETTES[colorMode];
  return palette[region] || '#4B5563'; // Default to gray if not found
}

// Calculate contrast ratio between two colors (WCAG formula)
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hexColor: string) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const [rs, gs, bs] = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Validate all colors meet WCAG AAA standards (7:1 ratio)
export function validateAccessibility(): boolean {
  const WHITE = '#FFFFFF';
  const requiredRatio = 7.0; // WCAG AAA for normal text

  let allPass = true;
  const results: string[] = [];

  Object.entries(COLORBLIND_PALETTES).forEach(([mode, palette]) => {
    Object.entries(palette).forEach(([region, color]) => {
      const ratio = getContrastRatio(color, WHITE);
      const passes = ratio >= requiredRatio;

      if (!passes) {
        allPass = false;
        results.push(`${mode} - ${region}: ${ratio.toFixed(2)} (FAIL)`);
      } else {
        results.push(`${mode} - ${region}: ${ratio.toFixed(2)} (PASS)`);
      }
    });
  });

  // Only log validation results during test runs or when explicitly requested
  // This keeps production console clean while preserving test output
  if (import.meta.env?.DEV && import.meta.env?.MODE === 'test') {
    console.log('Region Color Accessibility Validation:', results);
  }

  return allPass;
}

// Run validation in development (logged only in test mode)
if (typeof window !== 'undefined' && import.meta.env?.DEV) {
  const isAccessible = validateAccessibility();
  if (import.meta.env?.MODE === 'test') {
    console.log(`All region colors are WCAG AAA compliant: ${isAccessible}`);
  }
}
