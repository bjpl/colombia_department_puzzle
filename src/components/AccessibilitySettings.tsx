import React, { useState, useEffect } from 'react';
import { ColorblindMode, HIGH_CONTRAST_COLORS } from '../constants/accessibleColors';

interface AccessibilitySettingsProps {
  onColorModeChange?: (mode: ColorblindMode) => void;
  onHighContrastToggle?: (enabled: boolean) => void;
  onReducedMotionToggle?: (enabled: boolean) => void;
}

export default function AccessibilitySettings({
  onColorModeChange,
  onHighContrastToggle,
  onReducedMotionToggle
}: AccessibilitySettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [colorMode, setColorMode] = useState<ColorblindMode>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Load saved preferences
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

  // Save preferences
  const saveSettings = (settings: any) => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  };

  const handleColorModeChange = (mode: ColorblindMode) => {
    setColorMode(mode);
    saveSettings({ colorMode: mode, highContrast, reducedMotion });
    onColorModeChange?.(mode);
  };

  const handleHighContrastToggle = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    saveSettings({ colorMode, highContrast: newValue, reducedMotion });
    onHighContrastToggle?.(newValue);

    // Apply high contrast styles to document
    if (newValue) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const handleReducedMotionToggle = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    saveSettings({ colorMode, highContrast, reducedMotion: newValue });
    onReducedMotionToggle?.(newValue);

    // Apply reduced motion styles to document
    if (newValue) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  return (
    <div className="relative">
      {/* Accessibility Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 border-2 border-gray-300 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Configuración de accesibilidad"
        aria-expanded={isOpen}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-700"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 1.54l4.24 4.24M20.46 20.46l-4.24-4.24M1.54 20.46l4.24-4.24" />
        </svg>
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="absolute top-12 right-0 w-80 bg-white rounded-lg shadow-xl border-2 border-gray-200 p-4 z-50">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Configuración de Accesibilidad
          </h3>

          {/* Color Vision Mode */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Modo de visión de color
            </label>
            <select
              value={colorMode}
              onChange={(e) => handleColorModeChange(e.target.value as ColorblindMode)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="normal">Visión normal</option>
              <option value="protanopia">Protanopia (sin rojo)</option>
              <option value="deuteranopia">Deuteranopia (sin verde)</option>
              <option value="tritanopia">Tritanopia (sin azul)</option>
              <option value="monochrome">Monocromático</option>
            </select>
            <p className="text-xs text-gray-600 mt-1">
              Ajusta los colores para diferentes tipos de daltonismo
            </p>
          </div>

          {/* High Contrast Toggle */}
          <div className="mb-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-gray-700">
                  Alto contraste
                </span>
                <p className="text-xs text-gray-600">
                  Aumenta el contraste para mejor visibilidad
                </p>
              </div>
              <button
                role="switch"
                aria-checked={highContrast}
                onClick={handleHighContrastToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  highContrast ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="mb-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-gray-700">
                  Reducir movimiento
                </span>
                <p className="text-xs text-gray-600">
                  Minimiza animaciones y transiciones
                </p>
              </div>
              <button
                role="switch"
                aria-checked={reducedMotion}
                onClick={handleReducedMotionToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  reducedMotion ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    reducedMotion ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Keyboard Shortcuts Info */}
          <div className="border-t pt-3 mt-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Atajos de teclado
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>
                <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded">Tab</kbd>
                {' '}Navegar entre elementos
              </li>
              <li>
                <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded">Enter</kbd>
                {' '}Seleccionar elemento
              </li>
              <li>
                <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded">Esc</kbd>
                {' '}Cerrar diálogos
              </li>
            </ul>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}