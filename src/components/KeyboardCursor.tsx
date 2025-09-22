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
      {/* EXACT TARGET POINT - The actual crosshair that needs to be over the department */}
      <div
        className="fixed pointer-events-none z-[60]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
        aria-hidden="true"
      >
        {/* Crosshair lines */}
        <div className="absolute w-8 h-[2px] bg-red-500 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-[2px] h-8 bg-red-500 -translate-x-1/2 -translate-y-1/2" />
        {/* Center dot */}
        <div className={`
          absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2
          ${targetZone
            ? 'bg-green-500 ring-4 ring-green-300 animate-pulse'
            : 'bg-red-500 ring-2 ring-red-300'
          }
          transition-all duration-200
        `} />
      </div>

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

      {/* Department name pill - offset above the crosshair */}
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: `${position.x}px`,
          top: `${position.y - 35}px`, // Offset above the crosshair
          transform: 'translateX(-50%)',
        }}
        aria-hidden="true"
      >
        {/* Floating pill with department name */}
        <div className={`
          bg-white shadow-xl rounded-md px-3 py-1.5 border-2
          ${targetZone
            ? 'border-purple-500 ring-4 ring-purple-300 scale-110'  // Stronger feedback when over zone
            : 'border-blue-500 ring-2 ring-blue-200'
          }
          transition-all duration-200
        `}>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">📦</span>
            <span className="font-bold text-xs">{selectedDepartment.name}</span>
          </div>
        </div>

      </div>

      {/* Instructions positioned below the crosshair */}
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: `${position.x}px`,
          top: `${position.y + 25}px`, // Below the crosshair
          transform: 'translateX(-50%)',
        }}
        aria-hidden="true"
      >
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
    </>
  );
}