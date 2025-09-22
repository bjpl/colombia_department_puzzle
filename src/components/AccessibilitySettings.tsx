import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ColorblindMode } from '../constants/accessibleColors';
import { useAccessibility } from '../context/AccessibilityContext';

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
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Use the accessibility context
  const {
    colorMode,
    highContrast,
    reducedMotion,
    setColorMode: updateColorMode,
    setHighContrast: updateHighContrast,
    setReducedMotion: updateReducedMotion
  } = useAccessibility();

  // Settings are now managed by the context, no need to load here

  // Calculate panel position to avoid viewport edges
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const panelWidth = 320; // Panel width
      const panelHeight = 500; // Approximate panel height
      const padding = 8; // Padding from edges

      // Calculate optimal position
      let left = buttonRect.left;
      let top = buttonRect.bottom + 8;

      // Check if panel would go off right edge
      if (left + panelWidth > window.innerWidth - padding) {
        // Align panel's right edge with button's right edge
        left = buttonRect.right - panelWidth;
      }

      // Check if panel would go off left edge
      if (left < padding) {
        left = padding;
      }

      // Check if panel would go off bottom edge
      if (top + panelHeight > window.innerHeight - padding) {
        // Position above button instead
        top = buttonRect.top - panelHeight - 8;
      }

      // Check if panel would go off top edge when positioned above
      if (top < padding) {
        // Keep below button but ensure it fits
        top = buttonRect.bottom + 8;
      }

      setPanelPosition({ top, left });
    }
  }, [isOpen]);

  // Close panel when clicking outside
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(event.target as Node) &&
            buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen]);


  const handleColorModeChange = (mode: ColorblindMode) => {
    updateColorMode(mode);
    onColorModeChange?.(mode);
  };

  const handleHighContrastToggle = () => {
    const newValue = !highContrast;
    updateHighContrast(newValue);
    onHighContrastToggle?.(newValue);
  };

  const handleReducedMotionToggle = () => {
    const newValue = !reducedMotion;
    updateReducedMotion(newValue);
    onReducedMotionToggle?.(newValue);
  };

  return (
    <>
      {/* Accessibility Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 border-2 border-gray-300 hover:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
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

      {/* Settings Panel - Rendered as Portal to escape container constraints */}
      {isOpen && createPortal(
        <div
          ref={panelRef}
          className="fixed w-80 bg-white rounded-lg shadow-2xl border-2 border-gray-200 p-4 z-[9999] max-h-[90vh] overflow-y-auto"
          style={{
            top: `${panelPosition.top}px`,
            left: `${panelPosition.left}px`,
            animation: 'fadeInScale 0.2s ease-out'
          }}
        >
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
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                  highContrast ? 'bg-sky-600' : 'bg-gray-300'
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
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                  reducedMotion ? 'bg-sky-600' : 'bg-gray-300'
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
        </div>,
        document.body
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}