import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ColorblindMode,
  COLORBLIND_PALETTES,
  HIGH_CONTRAST_COLORS
} from '../constants/accessibleColors';
import { MODERN_REGION_COLORS } from '../constants/modernAccessibleColors';

interface AccessibilityContextType {
  colorMode: ColorblindMode;
  highContrast: boolean;
  reducedMotion: boolean;
  setColorMode: (mode: ColorblindMode) => void;
  setHighContrast: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  getRegionColor: (region: string, opacity?: number) => string;
  getTextColor: (background: string) => string;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [colorMode, setColorMode] = useState<ColorblindMode>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Load saved preferences on mount
  useEffect(() => {
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setColorMode(settings.colorMode || 'normal');
      setHighContrast(settings.highContrast || false);
      setReducedMotion(settings.reducedMotion || false);
    }

    // Check system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

    if (prefersReducedMotion) setReducedMotion(true);
    if (prefersHighContrast) setHighContrast(true);
  }, []);

  // Apply document-level classes for CSS
  useEffect(() => {
    // Apply high contrast class
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Apply reduced motion class
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }

    // Apply color mode class
    document.documentElement.setAttribute('data-color-mode', colorMode);
  }, [highContrast, reducedMotion, colorMode]);

  // Save settings when they change
  useEffect(() => {
    const settings = { colorMode, highContrast, reducedMotion };
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  }, [colorMode, highContrast, reducedMotion]);

  // Get the appropriate color based on current settings
  const getRegionColor = (region: string, opacity: number = 1): string => {
    let color: string;

    if (highContrast) {
      // Use high contrast colors - note the nested structure
      color = HIGH_CONTRAST_COLORS.regions[region] || HIGH_CONTRAST_COLORS.regions['Andina'] || '#000000';
    } else if (colorMode !== 'normal') {
      // Use colorblind-safe palette
      const palette = COLORBLIND_PALETTES[colorMode];
      color = palette[region] || palette.default || '#6B7280';
    } else {
      // Use modern beautiful colors
      const regionColors = MODERN_REGION_COLORS[region] || MODERN_REGION_COLORS['Andina'];
      color = regionColors.primary;
    }

    // Apply opacity if needed
    if (opacity < 1 && color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    return color;
  };

  // Get appropriate text color based on background
  const getTextColor = (background: string): string => {
    if (highContrast) {
      return '#000000'; // Always black text in high contrast mode
    }
    // For normal mode, return white (components handle this internally)
    return '#FFFFFF';
  };

  const value = {
    colorMode,
    highContrast,
    reducedMotion,
    setColorMode,
    setHighContrast,
    setReducedMotion,
    getRegionColor,
    getTextColor
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}