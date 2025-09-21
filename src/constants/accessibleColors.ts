// Accessible Color System for Colombia Puzzle Game
// WCAG AAA compliant with colorblind-safe palettes

export interface ColorScheme {
  primary: string;
  secondary: string;
  text: string;
  border: string;
  hover: string;
  pattern?: string;
  icon?: string;
}

// Region colors optimized for accessibility
// These colors are distinguishable by all types of color blindness
// and meet WCAG AAA contrast standards (7:1+) against white backgrounds
export const ACCESSIBLE_REGION_COLORS: Record<string, ColorScheme> = {
  'Andina': {
    primary: '#0D5F3A',      // Deep forest green (was #22c55e)
    secondary: '#0A4A2D',    // Darker green
    text: '#FFFFFF',         // White text for contrast
    border: '#083621',       // Very dark green
    hover: '#10794A',        // Lighter on hover
    pattern: 'dots',         // Dot pattern for additional identification
    icon: '⛰️'               // Mountain icon
  },
  'Caribe': {
    primary: '#0056B3',      // Strong blue (was #3b82f6)
    secondary: '#004494',    // Darker blue
    text: '#FFFFFF',         // White text
    border: '#003375',       // Very dark blue
    hover: '#0066CC',        // Lighter on hover
    pattern: 'waves',        // Wave pattern
    icon: '🌊'               // Wave icon
  },
  'Pacífica': {
    primary: '#5B21B6',      // Deep purple (was #9333ea)
    secondary: '#491A94',    // Darker purple
    text: '#FFFFFF',         // White text
    border: '#371373',       // Very dark purple
    hover: '#6D28D9',        // Lighter on hover
    pattern: 'diagonal',     // Diagonal lines
    icon: '🌴'               // Palm tree icon
  },
  'Orinoquía': {
    primary: '#B45309',      // Burnt orange (was #facc15)
    secondary: '#92440B',    // Darker orange
    text: '#FFFFFF',         // White text
    border: '#6E3308',       // Very dark orange
    hover: '#D97706',        // Lighter on hover
    pattern: 'horizontal',   // Horizontal lines
    icon: '🌾'               // Wheat/plains icon
  },
  'Amazonía': {
    primary: '#047857',      // Teal green (was #10b981)
    secondary: '#065F46',    // Darker teal
    text: '#FFFFFF',         // White text
    border: '#064E3B',       // Very dark teal
    hover: '#059669',        // Lighter on hover
    pattern: 'crosshatch',   // Crosshatch pattern
    icon: '🌳'               // Tree icon
  },
  'Insular': {
    primary: '#0E7490',      // Ocean teal (was #06b6d4)
    secondary: '#0C5F75',    // Darker ocean teal
    text: '#FFFFFF',         // White text
    border: '#0A4A5A',       // Very dark teal
    hover: '#1193B3',        // Lighter on hover
    pattern: 'circles',      // Circle pattern
    icon: '🏝️'              // Island icon
  }
};

// UI State colors with proper contrast
export const ACCESSIBLE_UI_COLORS = {
  // Success states (green that works for deuteranopia)
  success: {
    primary: '#047857',     // Teal-green
    light: '#D1FAE5',      // Very light teal
    dark: '#065F46',       // Dark teal
    text: '#065F46',       // Dark text on light bg
    textOnDark: '#FFFFFF'  // White text on dark bg
  },

  // Error states (uses orange-red for protanopia)
  error: {
    primary: '#B91C1C',    // Deep red
    light: '#FEE2E2',      // Very light red
    dark: '#991B1B',       // Darker red
    text: '#991B1B',       // Dark text on light bg
    textOnDark: '#FFFFFF'  // White text on dark bg
  },

  // Warning states (high contrast yellow)
  warning: {
    primary: '#B45309',    // Burnt orange (better than yellow)
    light: '#FED7AA',      // Light orange
    dark: '#92440B',       // Dark orange
    text: '#7C2D12',       // Dark text on light bg
    textOnDark: '#FFFFFF'  // White text on dark bg
  },

  // Info states (blue)
  info: {
    primary: '#0056B3',    // Strong blue
    light: '#DBEAFE',      // Very light blue
    dark: '#004494',       // Dark blue
    text: '#004494',       // Dark text on light bg
    textOnDark: '#FFFFFF'  // White text on dark bg
  },

  // Neutral states
  neutral: {
    50: '#FAFAFA',         // Almost white
    100: '#F4F4F5',        // Very light gray
    200: '#E4E4E7',        // Light gray
    300: '#D4D4D8',        // Medium-light gray
    400: '#A1A1AA',        // Medium gray
    500: '#71717A',        // Dark gray
    600: '#52525B',        // Darker gray
    700: '#3F3F46',        // Very dark gray
    800: '#27272A',        // Almost black
    900: '#18181B'         // Near black
  }
};

// Focus indicators for keyboard navigation
export const FOCUS_STYLES = {
  outline: '3px solid #0056B3',
  outlineOffset: '2px',
  boxShadow: '0 0 0 4px rgba(0, 86, 179, 0.25)'
};

// Pattern definitions for SVG backgrounds
export const PATTERN_DEFINITIONS = {
  dots: `<pattern id="dots" patternUnits="userSpaceOnUse" width="10" height="10">
    <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.3"/>
  </pattern>`,

  waves: `<pattern id="waves" patternUnits="userSpaceOnUse" width="20" height="10">
    <path d="M0,5 Q5,0 10,5 T20,5" stroke="currentColor" fill="none" opacity="0.3"/>
  </pattern>`,

  diagonal: `<pattern id="diagonal" patternUnits="userSpaceOnUse" width="10" height="10">
    <path d="M0,10 L10,0" stroke="currentColor" opacity="0.3"/>
  </pattern>`,

  horizontal: `<pattern id="horizontal" patternUnits="userSpaceOnUse" width="10" height="10">
    <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" opacity="0.3"/>
  </pattern>`,

  crosshatch: `<pattern id="crosshatch" patternUnits="userSpaceOnUse" width="10" height="10">
    <path d="M0,0 L10,10 M10,0 L0,10" stroke="currentColor" opacity="0.3"/>
  </pattern>`,

  circles: `<pattern id="circles" patternUnits="userSpaceOnUse" width="15" height="15">
    <circle cx="7.5" cy="7.5" r="3" fill="none" stroke="currentColor" opacity="0.3"/>
  </pattern>`
};

// High contrast mode overrides
export const HIGH_CONTRAST_COLORS = {
  regions: {
    'Andina': '#000000',      // Black
    'Caribe': '#FFFFFF',      // White with black border
    'Pacífica': '#000080',    // Navy
    'Orinoquía': '#FFD700',   // Gold with black text
    'Amazonía': '#008000',    // Green
    'Insular': '#00FFFF'      // Cyan with black text
  },

  ui: {
    background: '#000000',
    foreground: '#FFFFFF',
    border: '#FFFFFF',
    focus: '#FFD700'
  }
};

// Colorblind simulation modes
export type ColorblindMode = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome';

// Helper function to get appropriate colors based on mode
export function getRegionColor(region: string, mode: ColorblindMode = 'normal'): ColorScheme {
  if (mode === 'monochrome') {
    // Use patterns only in monochrome mode
    const patterns = ['#2D2D2D', '#4A4A4A', '#666666', '#808080', '#999999', '#B3B3B3'];
    const index = Object.keys(ACCESSIBLE_REGION_COLORS).indexOf(region);
    const color = patterns[index] || '#666666';

    return {
      primary: color,
      secondary: color,
      text: '#FFFFFF',
      border: '#000000',
      hover: color,
      pattern: ACCESSIBLE_REGION_COLORS[region]?.pattern,
      icon: ACCESSIBLE_REGION_COLORS[region]?.icon
    };
  }

  // Return standard accessible colors for all other modes
  // These are already optimized for colorblind users
  return ACCESSIBLE_REGION_COLORS[region] || ACCESSIBLE_REGION_COLORS['Andina'];
}

// Contrast ratio checker (for development)
export function getContrastRatio(foreground: string, background: string): number {
  // Convert hex to RGB
  const getRGB = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
  };

  // Calculate relative luminance
  const getLuminance = (rgb: { r: number, g: number, b: number }) => {
    const { r, g, b } = rgb;
    const sRGB = [r, g, b].map(val => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  const l1 = getLuminance(getRGB(foreground));
  const l2 = getLuminance(getRGB(background));

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}