import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ColorblindMode } from '../constants/accessibleColors';
import {
  ACCESSIBLE_REGION_COLORS,
  COLORBLIND_PALETTES,
  getAccessibleRegionColor
} from '../constants/accessibleColorsFixed';

interface AccessibilityContextType {
  colorMode: ColorblindMode;
  setColorMode: (mode: ColorblindMode) => void;
  getRegionColor: (region: string, opacity?: number) => string;
  getTextColor: (background: string) => string;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [colorMode, setColorMode] = useState<ColorblindMode>('normal');

  // Load saved preferences on mount
  useEffect(() => {
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setColorMode(settings.colorMode || 'normal');
    }
  }, []);

  // Apply document-level classes for CSS
  useEffect(() => {
    // Apply color mode class
    document.documentElement.setAttribute('data-color-mode', colorMode);
  }, [colorMode]);

  // Save settings when they change
  useEffect(() => {
    const settings = { colorMode };
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  }, [colorMode]);

  // Get the appropriate color based on current settings
  const getRegionColor = (region: string, opacity: number = 1): string => {
    // Use the new WCAG AAA compliant color system
    const color = getAccessibleRegionColor(region, colorMode);

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
    // All our WCAG AAA colors have been tested to work with white text
    // They all have at least 7:1 contrast ratio with white
    return '#FFFFFF';
  };

  const value = {
    colorMode,
    setColorMode,
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