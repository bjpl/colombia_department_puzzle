// Shared region color constants used across the application
// Modern, beautiful, and WCAG AAA compliant colors

import { ACCESSIBLE_REGION_COLORS } from './accessibleColorsFixed';

// Legacy colors (for reference - DO NOT USE)
const LEGACY_COLORS = {
  'Andina': 'lime-400', // Old: Lime Green (poor contrast)
  'Caribe': 'blue-300', // Old: Light Blue (poor contrast)
  'Pacífico': 'purple-200', // Old: Light Purple (very poor contrast)
  'Orinoquía': 'yellow-300', // Old: Yellow (fails WCAG)
  'Amazonía': 'green-300', // Old: Light Green (poor contrast)
  'Insular': 'cyan-300', // Old: Cyan (poor contrast)
};

// Modern beautiful color mapping - WCAG AAA compliant
export const REGION_COLORS: Record<string, string> = {
  'Andina': ACCESSIBLE_REGION_COLORS['Andina'].primary,      // Forest green
  'Caribe': ACCESSIBLE_REGION_COLORS['Caribe'].primary,      // Royal blue
  'Pacífico': ACCESSIBLE_REGION_COLORS['Pacífico'].primary,  // Dark maroon
  'Pacífica': ACCESSIBLE_REGION_COLORS['Pacífico'].primary,  // Dark maroon (support both spellings)
  'Orinoquía': ACCESSIBLE_REGION_COLORS['Orinoquía'].primary, // Golden amber
  'Amazonía': ACCESSIBLE_REGION_COLORS['Amazonía'].primary,   // Teal
  'Insular': ACCESSIBLE_REGION_COLORS['Insular'].primary,    // Purple
};

// Modern beautiful gradient styles with vibrant colors
export const REGION_STYLES: Record<string, { bg: string; text: string; icon: string; pattern?: string; glow?: string }> = {
  'Andina': {
    bg: 'from-emerald-600 via-emerald-500 to-emerald-400',  // Modern emerald gradient
    text: 'text-white',
    icon: ACCESSIBLE_REGION_COLORS['Andina'].icon || '⛰️',
    pattern: ACCESSIBLE_REGION_COLORS['Andina'].pattern,
    glow: 'shadow-emerald-500/50'
  },
  'Caribe': {
    bg: 'from-sky-600 via-sky-500 to-sky-400',  // Vibrant sky gradient
    text: 'text-white',
    icon: ACCESSIBLE_REGION_COLORS['Caribe'].icon || '🌊',
    pattern: ACCESSIBLE_REGION_COLORS['Caribe'].pattern,
    glow: 'shadow-sky-500/50'
  },
  'Pacífico': {
    bg: 'from-purple-600 via-purple-500 to-purple-400',  // Modern purple gradient
    text: 'text-white',
    icon: ACCESSIBLE_REGION_COLORS['Pacífico'].icon || '🌴',
    pattern: ACCESSIBLE_REGION_COLORS['Pacífico'].pattern,
    glow: 'shadow-purple-500/50'
  },
  'Pacífica': {
    bg: 'from-purple-600 via-purple-500 to-purple-400',  // Modern purple gradient
    text: 'text-white',
    icon: ACCESSIBLE_REGION_COLORS['Pacífico'].icon || '🌴',
    pattern: ACCESSIBLE_REGION_COLORS['Pacífico'].pattern,
    glow: 'shadow-purple-500/50'
  },
  'Orinoquía': {
    bg: 'from-orange-600 via-orange-500 to-orange-400',  // Sunset orange gradient
    text: 'text-white',
    icon: ACCESSIBLE_REGION_COLORS['Orinoquía'].icon || '🌾',
    pattern: ACCESSIBLE_REGION_COLORS['Orinoquía'].pattern,
    glow: 'shadow-orange-500/50'
  },
  'Amazonía': {
    bg: 'from-teal-600 via-teal-500 to-teal-400',  // Tropical teal gradient
    text: 'text-white',
    icon: ACCESSIBLE_REGION_COLORS['Amazonía'].icon || '🌳',
    pattern: ACCESSIBLE_REGION_COLORS['Amazonía'].pattern,
    glow: 'shadow-teal-500/50'
  },
  'Insular': {
    bg: 'from-cyan-600 via-cyan-500 to-cyan-400',  // Ocean cyan gradient
    text: 'text-white',
    icon: ACCESSIBLE_REGION_COLORS['Insular'].icon || '🏝️',
    pattern: ACCESSIBLE_REGION_COLORS['Insular'].pattern,
    glow: 'shadow-cyan-500/50'
  },
};

// Modern Tailwind classes with beautiful colors and effects
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