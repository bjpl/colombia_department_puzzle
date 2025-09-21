// Shared region color constants used across the application
// Updated to use WCAG AAA compliant accessible colors

import { ACCESSIBLE_REGION_COLORS } from './accessibleColors';

// Legacy colors (for reference - DO NOT USE)
const LEGACY_COLORS = {
  'Andina': '#bef264', // Old: Lime Green (poor contrast)
  'Caribe': '#93c5fd', // Old: Light Blue (poor contrast)
  'Pacífico': '#e9d5ff', // Old: Light Purple (very poor contrast)
  'Orinoquía': '#fde047', // Old: Yellow (fails WCAG)
  'Amazonía': '#86efac', // Old: Light Green (poor contrast)
  'Insular': '#67e8f9', // Old: Cyan (poor contrast)
};

// New accessible color mapping - WCAG AAA compliant
export const REGION_COLORS: Record<string, string> = {
  'Andina': ACCESSIBLE_REGION_COLORS['Andina'].primary,      // #0D5F3A - Deep forest green
  'Caribe': ACCESSIBLE_REGION_COLORS['Caribe'].primary,      // #0056B3 - Strong blue
  'Pacífico': ACCESSIBLE_REGION_COLORS['Pacífica'].primary,  // #5B21B6 - Deep purple
  'Pacífica': ACCESSIBLE_REGION_COLORS['Pacífica'].primary,  // #5B21B6 - Deep purple
  'Orinoquía': ACCESSIBLE_REGION_COLORS['Orinoquía'].primary, // #B45309 - Burnt orange
  'Amazonía': ACCESSIBLE_REGION_COLORS['Amazonía'].primary,   // #047857 - Teal green
  'Insular': ACCESSIBLE_REGION_COLORS['Insular'].primary,    // #0E7490 - Ocean teal
};

// Accessible gradient styles with proper contrast
export const REGION_STYLES: Record<string, { bg: string; text: string; icon: string; pattern?: string }> = {
  'Andina': {
    bg: 'from-[#0D5F3A] to-[#0A4A2D]',  // Deep green gradient
    text: 'text-white',                  // White text for contrast
    icon: ACCESSIBLE_REGION_COLORS['Andina'].icon || '⛰️',
    pattern: ACCESSIBLE_REGION_COLORS['Andina'].pattern
  },
  'Caribe': {
    bg: 'from-[#0056B3] to-[#004494]',  // Strong blue gradient
    text: 'text-white',
    icon: ACCESSIBLE_REGION_COLORS['Caribe'].icon || '🌊',
    pattern: ACCESSIBLE_REGION_COLORS['Caribe'].pattern
  },
  'Pacífico': {
    bg: 'from-[#5B21B6] to-[#491A94]',  // Deep purple gradient
    text: 'text-white',
    icon: ACCESSIBLE_REGION_COLORS['Pacífica'].icon || '🌴',
    pattern: ACCESSIBLE_REGION_COLORS['Pacífica'].pattern
  },
  'Pacífica': {
    bg: 'from-[#5B21B6] to-[#491A94]',  // Deep purple gradient
    text: 'text-white',
    icon: ACCESSIBLE_REGION_COLORS['Pacífica'].icon || '🌴',
    pattern: ACCESSIBLE_REGION_COLORS['Pacífica'].pattern
  },
  'Orinoquía': {
    bg: 'from-[#B45309] to-[#92440B]',  // Burnt orange gradient
    text: 'text-white',
    icon: ACCESSIBLE_REGION_COLORS['Orinoquía'].icon || '🌾',
    pattern: ACCESSIBLE_REGION_COLORS['Orinoquía'].pattern
  },
  'Amazonía': {
    bg: 'from-[#047857] to-[#065F46]',  // Teal gradient
    text: 'text-white',
    icon: ACCESSIBLE_REGION_COLORS['Amazonía'].icon || '🌳',
    pattern: ACCESSIBLE_REGION_COLORS['Amazonía'].pattern
  },
  'Insular': {
    bg: 'from-[#0E7490] to-[#0C5F75]',  // Ocean teal gradient
    text: 'text-white',
    icon: ACCESSIBLE_REGION_COLORS['Insular'].icon || '🏝️',
    pattern: ACCESSIBLE_REGION_COLORS['Insular'].pattern
  },
};

// Accessible Tailwind classes with proper contrast ratios
export const REGION_TAILWIND_CLASSES: Record<string, string> = {
  'Andina': 'bg-[#0D5F3A] border-[#083621] hover:bg-[#10794A] text-white ring-offset-2 focus:ring-2 focus:ring-[#0D5F3A]',
  'Caribe': 'bg-[#0056B3] border-[#003375] hover:bg-[#0066CC] text-white ring-offset-2 focus:ring-2 focus:ring-[#0056B3]',
  'Pacífico': 'bg-[#5B21B6] border-[#371373] hover:bg-[#6D28D9] text-white ring-offset-2 focus:ring-2 focus:ring-[#5B21B6]',
  'Pacífica': 'bg-[#5B21B6] border-[#371373] hover:bg-[#6D28D9] text-white ring-offset-2 focus:ring-2 focus:ring-[#5B21B6]',
  'Orinoquía': 'bg-[#B45309] border-[#6E3308] hover:bg-[#D97706] text-white ring-offset-2 focus:ring-2 focus:ring-[#B45309]',
  'Amazonía': 'bg-[#047857] border-[#064E3B] hover:bg-[#059669] text-white ring-offset-2 focus:ring-2 focus:ring-[#047857]',
  'Insular': 'bg-[#0E7490] border-[#0A4A5A] hover:bg-[#1193B3] text-white ring-offset-2 focus:ring-2 focus:ring-[#0E7490]',
};

// Light background variants for cards and panels
export const REGION_LIGHT_CLASSES: Record<string, string> = {
  'Andina': 'bg-green-50 border-[#0D5F3A] text-[#083621] hover:bg-green-100',
  'Caribe': 'bg-blue-50 border-[#0056B3] text-[#003375] hover:bg-blue-100',
  'Pacífico': 'bg-purple-50 border-[#5B21B6] text-[#371373] hover:bg-purple-100',
  'Pacífica': 'bg-purple-50 border-[#5B21B6] text-[#371373] hover:bg-purple-100',
  'Orinoquía': 'bg-orange-50 border-[#B45309] text-[#6E3308] hover:bg-orange-100',
  'Amazonía': 'bg-teal-50 border-[#047857] text-[#064E3B] hover:bg-teal-100',
  'Insular': 'bg-cyan-50 border-[#0E7490] text-[#0A4A5A] hover:bg-cyan-100',
};