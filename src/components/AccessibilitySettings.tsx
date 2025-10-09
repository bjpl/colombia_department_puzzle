import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ColorblindMode } from '../constants/accessibleColors';
import { useAccessibility } from '../context/AccessibilityContext';
import { useTouchFeedback } from '../hooks/useTouchFeedback';
import {
  Button, Card, CardContent, Badge
} from '../design-system';

interface AccessibilitySettingsProps {
  onColorModeChange?: (mode: ColorblindMode) => void;
}

export default function AccessibilitySettings({
  onColorModeChange
}: AccessibilitySettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Use the accessibility context
  const {
    colorMode,
    setColorMode: updateColorMode
  } = useAccessibility();

  // Touch feedback settings
  const { settings: touchSettings, toggleHaptics, toggleAudio, isHapticsSupported } = useTouchFeedback();

  // Settings are now managed by the context, no need to load here

  // Listen for keyboard shortcut 'a' to open accessibility settings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if 'a' key is pressed without modifiers
      if (e.key === 'a' && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
        // Don't trigger if typing in an input field
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
          return;
        }
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  return (
    <>
      {/* Accessibility Button */}
      <Button
        ref={buttonRef}
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-white shadow-md border-2 border-neutral-300"
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
          className="text-neutral-600"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 1.54l4.24 4.24M20.46 20.46l-4.24-4.24M1.54 20.46l4.24-4.24" />
        </svg>
      </Button>

      {/* Settings Panel - Rendered as Portal to escape container constraints */}
      {isOpen && createPortal(
        <Card
          ref={panelRef}
          variant="default"
          className="fixed w-80 z-[9999] max-h-[90vh] overflow-y-auto border-2 border-neutral-200"
          style={{
            top: `${panelPosition.top}px`,
            left: `${panelPosition.left}px`,
            animation: 'fadeInScale 0.2s ease-out'
          }}
        >
          <CardContent className="p-4">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">
            Configuración de Accesibilidad
          </h3>

          {/* Color Vision Mode */}
          <div className="mb-4">
            <label htmlFor="color-mode-select" className="block text-sm font-semibold text-neutral-600 mb-2">
              Modo de visión de color
            </label>
            <select
              id="color-mode-select"
              value={colorMode}
              onChange={(e) => handleColorModeChange(e.target.value as ColorblindMode)}
              className="w-full py-2 px-3 border-2 border-neutral-300 rounded-md text-base"
            >
              <option value="normal">Visión normal</option>
              <option value="protanopia">Protanopia (sin rojo)</option>
              <option value="deuteranopia">Deuteranopia (sin verde)</option>
              <option value="tritanopia">Tritanopia (sin azul)</option>
              <option value="monochrome">Monocromático</option>
            </select>
            <p className="text-sm text-neutral-600 mt-1">
              Ajusta los colores para diferentes tipos de daltonismo
            </p>
          </div>

          {/* Touch Feedback Settings */}
          <div className="border-t border-neutral-200 pt-3 mt-3">
            <h4 className="text-sm font-semibold text-neutral-600 mb-2">
              Retroalimentación Táctil
            </h4>

            {/* Haptic Feedback Toggle */}
            {isHapticsSupported && (
              <div className="mb-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Vibración háptica</span>
                  <input
                    type="checkbox"
                    checked={touchSettings.hapticsEnabled}
                    onChange={toggleHaptics}
                    className="w-10 h-6 rounded-full"
                  />
                </label>
                <p className="text-xs text-neutral-500 mt-1">
                  Vibración cuando tocas elementos interactivos
                </p>
              </div>
            )}

            {!isHapticsSupported && (
              <p className="text-xs text-neutral-500 mb-3">
                La vibración háptica no está disponible en este dispositivo
              </p>
            )}

            {/* Audio Feedback Toggle */}
            <div className="mb-2">
              <label className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Efectos de sonido</span>
                <input
                  type="checkbox"
                  checked={touchSettings.audioEnabled}
                  onChange={toggleAudio}
                  className="w-10 h-6 rounded-full"
                />
              </label>
              <p className="text-xs text-neutral-500 mt-1">
                Sonidos de clic al interactuar con botones
              </p>
            </div>
          </div>


          {/* Keyboard Shortcuts Info */}
          <div className="border-t border-neutral-200 pt-3 mt-3">
            <h4 className="text-sm font-semibold text-neutral-600 mb-2">
              Atajos de teclado
            </h4>
            <ul className="text-sm text-neutral-600 flex flex-col gap-1">
              <li>
                <Badge variant="secondary" className="bg-neutral-100 border border-neutral-300 rounded-sm">Tab</Badge>
                {' '}Navegar entre elementos
              </li>
              <li>
                <Badge variant="secondary" className="bg-neutral-100 border border-neutral-300 rounded-sm">Enter</Badge>
                {' '}Seleccionar elemento
              </li>
              <li>
                <Badge variant="secondary" className="bg-neutral-100 border border-neutral-300 rounded-sm">Esc</Badge>
                {' '}Cerrar diálogos
              </li>
            </ul>
          </div>

          {/* Close Button */}
          <Button
            variant="secondary"
            onClick={() => setIsOpen(false)}
            className="mt-4 w-full bg-neutral-100 text-neutral-600"
          >
            Cerrar
          </Button>
        </CardContent>
        </Card>,
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