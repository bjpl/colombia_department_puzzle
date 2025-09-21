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

  // Only show cursor for keyboard navigation, not mouse drag
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
      {/* Compact cursor */}
      <div className="relative">
        {/* Small animated ring */}
        <div className="absolute inset-0 -m-4">
          <div className="w-12 h-12 border-2 border-blue-400 rounded-full animate-ping opacity-30" />
        </div>

        {/* Target indicator when over a zone - smaller */}
        {targetZone && (
          <div className="absolute inset-0 -m-6">
            <div className={`w-16 h-16 border-2 ${
              targetZone === selectedDepartment.id
                ? 'border-green-500'
                : 'border-red-400'
            } rounded-full ${showPulse ? 'animate-pulse' : ''}`} />
          </div>
        )}

        {/* Minimal department pill */}
        <div className={`
          bg-white shadow-lg rounded-md px-2 py-1 border-2
          ${targetZone === selectedDepartment.id
            ? 'border-green-500'
            : targetZone
              ? 'border-red-400'
              : 'border-blue-500'
          }
          transition-all duration-200
        `}>
          <div className="flex items-center gap-1">
            <span className="text-sm">📍</span>
            <span className="font-semibold text-xs">{selectedDepartment.name}</span>
          </div>
        </div>

        {/* Small crosshair dot */}
        <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          <div className="w-2 h-2 bg-blue-600 rounded-full" />
        </div>
      </div>

      {/* Compact instructions - only show briefly */}
      {targetZone && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-90">
          {targetZone === selectedDepartment.id ? (
            <span className="text-green-400">✓ Enter para colocar</span>
          ) : (
            <span className="text-red-400">✗ Zona incorrecta</span>
          )}
        </div>
      )}
    </div>
  );
}