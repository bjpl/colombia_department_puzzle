import { useEffect, useState } from 'react';
import { Department } from '../types/game';

/**
 * CONCEPT: Visual Keyboard Cursor for Drag & Drop
 * WHY: Provides clear visual feedback for keyboard navigation
 * PATTERN: Floating cursor that follows keyboard movement
 */

interface KeyboardCursorProps {
  position: { x: number; y: number };
  selectedDepartment: Department | null;
  isActive: boolean;
  targetZone: string | null;
}

export default function KeyboardCursor({
  position,
  selectedDepartment,
  isActive,
  targetZone
}: KeyboardCursorProps) {
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    if (targetZone) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 500);
      return () => clearTimeout(timer);
    }
  }, [targetZone]);

  if (!isActive || !selectedDepartment) {
    return null;
  }

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      aria-hidden="true"
    >
      {/* Main cursor */}
      <div className="relative">
        {/* Animated rings */}
        <div className="absolute inset-0 -m-8">
          <div className="w-24 h-24 border-4 border-blue-400 rounded-full animate-ping opacity-30" />
        </div>

        {/* Target indicator when over a zone */}
        {targetZone && (
          <div className="absolute inset-0 -m-12">
            <div className={`w-32 h-32 border-4 ${
              targetZone === selectedDepartment.id
                ? 'border-green-500'
                : 'border-yellow-500'
            } rounded-full ${showPulse ? 'animate-pulse' : ''}`} />
          </div>
        )}

        {/* Department card */}
        <div className={`
          bg-white shadow-2xl rounded-lg p-3 border-3
          ${targetZone === selectedDepartment.id
            ? 'border-green-500 ring-4 ring-green-300'
            : targetZone
              ? 'border-yellow-500 ring-4 ring-yellow-300'
              : 'border-blue-500 ring-4 ring-blue-300'
          }
          transition-all duration-200
        `}>
          <div className="flex items-center gap-2">
            <div className="text-2xl">📍</div>
            <div>
              <div className="font-bold text-gray-800">{selectedDepartment.name}</div>
              <div className="text-xs text-gray-600">{selectedDepartment.capital}</div>
            </div>
          </div>

          {/* Status indicator */}
          <div className="mt-2 text-xs text-center">
            {targetZone === selectedDepartment.id ? (
              <span className="text-green-600 font-bold">✓ Ubicación correcta</span>
            ) : targetZone ? (
              <span className="text-yellow-600">Zona: {targetZone}</span>
            ) : (
              <span className="text-blue-600">Use las flechas para mover</span>
            )}
          </div>
        </div>

        {/* Crosshair */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          width="40"
          height="40"
        >
          <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="2" className="text-blue-500 opacity-50" />
          <line x1="0" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="2" className="text-blue-500 opacity-50" />
          <circle cx="20" cy="20" r="3" fill="currentColor" className="text-blue-600" />
        </svg>
      </div>

      {/* Instructions */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
        <div className="flex items-center gap-4">
          <span>↑↓←→ Mover</span>
          <span>⇧+Flechas Rápido</span>
          <span>Enter Colocar</span>
          <span>Esc Cancelar</span>
        </div>
      </div>
    </div>
  );
}