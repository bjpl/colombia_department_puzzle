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
    <>
      {/* Detection radius indicator - subtle visual aid */}
      <div
        className="fixed pointer-events-none z-40"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
          width: '100px',
          height: '100px',
        }}
        aria-hidden="true"
      >
        <div className={`
          absolute inset-0 rounded-full border-2 border-dashed
          ${targetZone ? 'border-purple-400 opacity-50' : 'border-gray-300 opacity-30'}
          animate-pulse
        `} />
      </div>

      {/* Cursor pill */}
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
        aria-hidden="true"
      >
        {/* Simple floating pill with enhanced visibility */}
        <div className={`
          bg-white shadow-xl rounded-md px-3 py-1.5 border-2
          ${targetZone
            ? 'border-purple-500 ring-4 ring-purple-300 scale-110'  // Stronger feedback when over zone
            : 'border-blue-500 ring-2 ring-blue-200'
          }
          transition-all duration-200
        `}>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">📍</span>
            <span className="font-bold text-xs">{selectedDepartment.name}</span>
          </div>
        </div>

        {/* Instructions with better visibility */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          {targetZone ? (
            <div className="bg-purple-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap font-semibold animate-pulse">
              ✓ Enter para colocar
            </div>
          ) : (
            <div className="bg-gray-700 text-gray-200 text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-75">
              ↑↓←→ Mover • Ctrl=Preciso • Shift=Rápido
            </div>
          )}
        </div>
      </div>
    </>
  );
}