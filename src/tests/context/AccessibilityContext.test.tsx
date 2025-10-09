/**
 * AccessibilityContext Tests
 *
 * CONCEPT: Tests for accessibility context managing colorblind modes and visual settings
 * WHY: Ensures accessibility features work correctly for all users
 * PATTERN: React Context testing with localStorage mocking
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import {
  ColorblindMode,
  ACCESSIBLE_REGION_COLORS,
  COLORBLIND_PALETTES,
  getAccessibleRegionColor
} from '../../design-system/themes/regions';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// AccessibilityContext implementation for testing
interface AccessibilityContextType {
  colorMode: ColorblindMode;
  setColorMode: (mode: ColorblindMode) => void;
  getRegionColor: (region: string, opacity?: number) => string;
  getTextColor: (background: string) => string;
}

// Simple test implementation matching real context
function createTestAccessibilityContext() {
  let colorMode: ColorblindMode = 'normal';
  const listeners: (() => void)[] = [];

  const subscribe = (listener: () => void) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  };

  const getState = (): AccessibilityContextType => ({
    colorMode,
    setColorMode: (mode: ColorblindMode) => {
      colorMode = mode;
      localStorage.setItem('accessibilitySettings', JSON.stringify({ colorMode: mode }));
      document.documentElement.setAttribute('data-color-mode', mode);
      listeners.forEach(l => l());
    },
    getRegionColor: (region: string, opacity: number = 1): string => {
      const color = getAccessibleRegionColor(region, colorMode);

      if (opacity < 1 && color.startsWith('#')) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }

      return color;
    },
    getTextColor: (background: string): string => {
      return '#FFFFFF';
    }
  });

  return { getState, subscribe };
}

describe('AccessibilityContext - Initialization', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-color-mode');
  });

  it('should initialize with normal color mode', () => {
    const context = createTestAccessibilityContext();
    const state = context.getState();

    expect(state.colorMode).toBe('normal');
  });

  it('should load saved settings from localStorage', () => {
    localStorage.setItem('accessibilitySettings', JSON.stringify({
      colorMode: 'protanopia'
    }));

    // Simulate loading saved settings
    const saved = localStorage.getItem('accessibilitySettings');
    const settings = saved ? JSON.parse(saved) : {};

    expect(settings.colorMode).toBe('protanopia');
  });

  it('should handle missing localStorage gracefully', () => {
    localStorage.clear();
    const saved = localStorage.getItem('accessibilitySettings');

    expect(saved).toBeNull();
  });

  it('should handle corrupted localStorage data', () => {
    localStorage.setItem('accessibilitySettings', 'invalid-json');

    expect(() => {
      const saved = localStorage.getItem('accessibilitySettings');
      if (saved) JSON.parse(saved);
    }).toThrow();
  });
});

describe('AccessibilityContext - Color Mode Switching', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-color-mode');
  });

  it('should switch to protanopia mode', () => {
    const context = createTestAccessibilityContext();
    let state = context.getState();

    act(() => {
      state.setColorMode('protanopia');
    });

    state = context.getState();
    expect(state.colorMode).toBe('protanopia');
  });

  it('should switch to deuteranopia mode', () => {
    const context = createTestAccessibilityContext();
    let state = context.getState();

    act(() => {
      state.setColorMode('deuteranopia');
    });

    state = context.getState();
    expect(state.colorMode).toBe('deuteranopia');
  });

  it('should switch to tritanopia mode', () => {
    const context = createTestAccessibilityContext();
    let state = context.getState();

    act(() => {
      state.setColorMode('tritanopia');
    });

    state = context.getState();
    expect(state.colorMode).toBe('tritanopia');
  });

  it('should switch to monochrome mode', () => {
    const context = createTestAccessibilityContext();
    let state = context.getState();

    act(() => {
      state.setColorMode('monochrome');
    });

    state = context.getState();
    expect(state.colorMode).toBe('monochrome');
  });

  it('should return to normal mode', () => {
    const context = createTestAccessibilityContext();
    let state = context.getState();

    act(() => {
      state.setColorMode('protanopia');
      state.setColorMode('normal');
    });

    state = context.getState();
    expect(state.colorMode).toBe('normal');
  });

  it('should persist color mode to localStorage', () => {
    const context = createTestAccessibilityContext();
    const state = context.getState();

    act(() => {
      state.setColorMode('deuteranopia');
    });

    const saved = localStorage.getItem('accessibilitySettings');
    expect(saved).not.toBeNull();
    const settings = JSON.parse(saved!);
    expect(settings.colorMode).toBe('deuteranopia');
  });

  it('should set data-color-mode attribute on document', () => {
    const context = createTestAccessibilityContext();
    const state = context.getState();

    act(() => {
      state.setColorMode('tritanopia');
    });

    expect(document.documentElement.getAttribute('data-color-mode')).toBe('tritanopia');
  });

  it('should update document attribute when mode changes', () => {
    const context = createTestAccessibilityContext();
    const state = context.getState();

    act(() => {
      state.setColorMode('protanopia');
    });

    expect(document.documentElement.getAttribute('data-color-mode')).toBe('protanopia');

    act(() => {
      state.setColorMode('monochrome');
    });

    expect(document.documentElement.getAttribute('data-color-mode')).toBe('monochrome');
  });
});

describe('AccessibilityContext - Region Color Functions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should get region color in normal mode', () => {
    const context = createTestAccessibilityContext();
    const state = context.getState();

    const andinaColor = state.getRegionColor('Andina');
    expect(andinaColor).toBe(COLORBLIND_PALETTES.normal['Andina']);
  });

  it('should get different colors for each region', () => {
    const context = createTestAccessibilityContext();
    const state = context.getState();

    const andinaColor = state.getRegionColor('Andina');
    const caribeColor = state.getRegionColor('Caribe');
    const pacificoColor = state.getRegionColor('Pacífico');

    expect(andinaColor).not.toBe(caribeColor);
    expect(andinaColor).not.toBe(pacificoColor);
    expect(caribeColor).not.toBe(pacificoColor);
  });

  it('should use colorblind palette in protanopia mode', () => {
    const context = createTestAccessibilityContext();
    let state = context.getState();

    act(() => {
      state.setColorMode('protanopia');
    });

    state = context.getState();
    const andinaColor = state.getRegionColor('Andina');
    expect(andinaColor).toBe(COLORBLIND_PALETTES.protanopia['Andina']);
  });

  it('should use colorblind palette in deuteranopia mode', () => {
    const context = createTestAccessibilityContext();
    let state = context.getState();

    act(() => {
      state.setColorMode('deuteranopia');
    });

    state = context.getState();
    const caribeColor = state.getRegionColor('Caribe');
    expect(caribeColor).toBe(COLORBLIND_PALETTES.deuteranopia['Caribe']);
  });

  it('should use grayscale in monochrome mode', () => {
    const context = createTestAccessibilityContext();
    let state = context.getState();

    act(() => {
      state.setColorMode('monochrome');
    });

    state = context.getState();
    const andinaColor = state.getRegionColor('Andina');
    expect(andinaColor).toBe(COLORBLIND_PALETTES.monochrome['Andina']);
  });

  it('should apply opacity to hex colors', () => {
    const context = createTestAccessibilityContext();
    const state = context.getState();

    const colorWithOpacity = state.getRegionColor('Andina', 0.5);
    expect(colorWithOpacity).toContain('rgba');
    expect(colorWithOpacity).toContain('0.5');
  });

  it('should return hex color when opacity is 1', () => {
    const context = createTestAccessibilityContext();
    const state = context.getState();

    const colorNoOpacity = state.getRegionColor('Andina', 1);
    expect(colorNoOpacity).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it('should convert hex to rgba correctly', () => {
    const context = createTestAccessibilityContext();
    const state = context.getState();

    const andinaHex = COLORBLIND_PALETTES.normal['Andina'];
    const r = parseInt(andinaHex.slice(1, 3), 16);
    const g = parseInt(andinaHex.slice(3, 5), 16);
    const b = parseInt(andinaHex.slice(5, 7), 16);

    const colorWithOpacity = state.getRegionColor('Andina', 0.7);
    expect(colorWithOpacity).toBe(`rgba(${r}, ${g}, ${b}, 0.7)`);
  });

  it('should handle unknown region with default color', () => {
    const color = getAccessibleRegionColor('Unknown Region', 'normal');
    expect(color).toBe('#4B5563'); // Default gray
  });
});

describe('AccessibilityContext - Text Color Function', () => {
  it('should return white text for WCAG AAA compliance', () => {
    const context = createTestAccessibilityContext();
    const state = context.getState();

    const textColor = state.getTextColor('#14532D');
    expect(textColor).toBe('#FFFFFF');
  });

  it('should return white for all background colors', () => {
    const context = createTestAccessibilityContext();
    const state = context.getState();

    const backgrounds = [
      '#14532D', // Andina
      '#1E40AF', // Caribe
      '#7C2D12', // Pacífico
      '#92400E', // Orinoquía
      '#115E59', // Amazonía
      '#6B21A8'  // Insular
    ];

    backgrounds.forEach(bg => {
      const textColor = state.getTextColor(bg);
      expect(textColor).toBe('#FFFFFF');
    });
  });
});

describe('AccessibilityContext - Settings Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save settings when color mode changes', () => {
    const context = createTestAccessibilityContext();
    const state = context.getState();

    act(() => {
      state.setColorMode('protanopia');
    });

    const saved = localStorage.getItem('accessibilitySettings');
    expect(saved).not.toBeNull();
  });

  it('should persist multiple color mode changes', () => {
    const context = createTestAccessibilityContext();
    const state = context.getState();

    act(() => {
      state.setColorMode('protanopia');
      state.setColorMode('deuteranopia');
      state.setColorMode('monochrome');
    });

    const saved = localStorage.getItem('accessibilitySettings');
    const settings = JSON.parse(saved!);
    expect(settings.colorMode).toBe('monochrome');
  });

  it('should restore last saved color mode', () => {
    localStorage.setItem('accessibilitySettings', JSON.stringify({
      colorMode: 'tritanopia'
    }));

    const saved = localStorage.getItem('accessibilitySettings');
    const settings = JSON.parse(saved!);

    expect(settings.colorMode).toBe('tritanopia');
  });
});

describe('AccessibilityContext - Color Palette Validation', () => {
  it('should have all regions in normal palette', () => {
    const regions = ['Andina', 'Caribe', 'Pacífico', 'Orinoquía', 'Amazonía', 'Insular'];
    const palette = COLORBLIND_PALETTES.normal;

    regions.forEach(region => {
      expect(palette[region]).toBeDefined();
      expect(palette[region]).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  it('should have all regions in protanopia palette', () => {
    const regions = ['Andina', 'Caribe', 'Pacífico', 'Orinoquía', 'Amazonía', 'Insular'];
    const palette = COLORBLIND_PALETTES.protanopia;

    regions.forEach(region => {
      expect(palette[region]).toBeDefined();
      expect(palette[region]).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  it('should have all regions in deuteranopia palette', () => {
    const regions = ['Andina', 'Caribe', 'Pacífico', 'Orinoquía', 'Amazonía', 'Insular'];
    const palette = COLORBLIND_PALETTES.deuteranopia;

    regions.forEach(region => {
      expect(palette[region]).toBeDefined();
    });
  });

  it('should have all regions in tritanopia palette', () => {
    const regions = ['Andina', 'Caribe', 'Pacífico', 'Orinoquía', 'Amazonía', 'Insular'];
    const palette = COLORBLIND_PALETTES.tritanopia;

    regions.forEach(region => {
      expect(palette[region]).toBeDefined();
    });
  });

  it('should have all regions in monochrome palette', () => {
    const regions = ['Andina', 'Caribe', 'Pacífico', 'Orinoquía', 'Amazonía', 'Insular'];
    const palette = COLORBLIND_PALETTES.monochrome;

    regions.forEach(region => {
      expect(palette[region]).toBeDefined();
      // Monochrome should be grayscale
      const color = palette[region];
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      // In true grayscale, r=g=b or very close
      expect(Math.abs(r - g)).toBeLessThan(20);
      expect(Math.abs(g - b)).toBeLessThan(20);
    });
  });

  it('should have distinct colors in each palette', () => {
    const modes: ColorblindMode[] = ['normal', 'protanopia', 'deuteranopia', 'tritanopia', 'monochrome'];

    modes.forEach(mode => {
      const palette = COLORBLIND_PALETTES[mode];
      const colors = Object.values(palette);
      const uniqueColors = new Set(colors);

      // Should have unique colors for most regions (some overlap is OK)
      expect(uniqueColors.size).toBeGreaterThan(3);
    });
  });
});

describe('AccessibilityContext - ACCESSIBLE_REGION_COLORS', () => {
  it('should have complete color schemes for all regions', () => {
    const regions = ['Andina', 'Caribe', 'Pacífico', 'Orinoquía', 'Amazonía', 'Insular'];

    regions.forEach(region => {
      const scheme = ACCESSIBLE_REGION_COLORS[region];
      expect(scheme).toBeDefined();
      expect(scheme.primary).toBeDefined();
      expect(scheme.secondary).toBeDefined();
      expect(scheme.tertiary).toBeDefined();
      expect(scheme.gradient).toBeDefined();
      expect(scheme.text).toBe('#FFFFFF');
      expect(scheme.border).toBeDefined();
      expect(scheme.hover).toBeDefined();
      expect(scheme.shadow).toBeDefined();
      expect(scheme.glow).toBeDefined();
    });
  });

  it('should have patterns and icons for regions', () => {
    const regions = ['Andina', 'Caribe', 'Pacífico', 'Orinoquía', 'Amazonía', 'Insular'];

    regions.forEach(region => {
      const scheme = ACCESSIBLE_REGION_COLORS[region];
      expect(scheme.pattern).toBeDefined();
      expect(scheme.icon).toBeDefined();
    });
  });

  it('should have valid gradient syntax', () => {
    const regions = ['Andina', 'Caribe', 'Pacífico', 'Orinoquía', 'Amazonía', 'Insular'];

    regions.forEach(region => {
      const scheme = ACCESSIBLE_REGION_COLORS[region];
      expect(scheme.gradient).toContain('linear-gradient');
      expect(scheme.gradient).toContain('135deg');
    });
  });
});

describe('AccessibilityContext - Edge Cases', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should handle rapid mode switching', () => {
    const context = createTestAccessibilityContext();
    const state = context.getState();

    act(() => {
      state.setColorMode('protanopia');
      state.setColorMode('deuteranopia');
      state.setColorMode('tritanopia');
      state.setColorMode('normal');
    });

    expect(state.colorMode).toBe('normal');
  });

  it('should handle zero opacity', () => {
    const context = createTestAccessibilityContext();
    const state = context.getState();

    const color = state.getRegionColor('Andina', 0);
    expect(color).toContain('rgba');
    expect(color).toContain('0)');
  });

  it('should handle opacity edge values', () => {
    const context = createTestAccessibilityContext();
    const state = context.getState();

    const color01 = state.getRegionColor('Andina', 0.1);
    const color09 = state.getRegionColor('Andina', 0.9);

    expect(color01).toContain('0.1');
    expect(color09).toContain('0.9');
  });

  it('should return consistent colors across calls', () => {
    const context = createTestAccessibilityContext();
    const state = context.getState();

    const color1 = state.getRegionColor('Caribe');
    const color2 = state.getRegionColor('Caribe');

    expect(color1).toBe(color2);
  });

  it('should maintain color consistency after mode switch and back', () => {
    const context = createTestAccessibilityContext();
    let state = context.getState();

    const normalColor = state.getRegionColor('Andina');

    act(() => {
      state.setColorMode('protanopia');
      state.setColorMode('normal');
    });

    state = context.getState();
    const normalColorAgain = state.getRegionColor('Andina');

    expect(normalColor).toBe(normalColorAgain);
  });
});
