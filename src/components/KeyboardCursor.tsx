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
      {/* Fixed department label in upper center (near drag tooltip) */}
      <div
        className="fixed pointer-events-none z-50 top-16 left-1/2 transform -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="bg-white shadow-xl rounded-lg px-4 py-2 border-2 border-sky-500">
          <div className="flex items-center gap-2">
            <span className="text-lg">⌨️</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Moviendo:</span>
              <span className="font-bold text-base">{selectedDepartment.name}</span>
            </div>
          </div>
        </div>
      </div>

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
        <div className="absolute w-10 h-[2px] bg-red-500 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-[2px] h-10 bg-red-500 -translate-x-1/2 -translate-y-1/2" />
        {/* Center dot */}
        <div className={`
          absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2
          ${targetZone
            ? 'bg-green-500 ring-4 ring-green-300 animate-pulse'
            : 'bg-red-500 ring-2 ring-red-300'
          }
          transition-all duration-200
        `} />
      </div>

      {/* Detection helper circle - very subtle */}
      {!targetZone && (
        <div
          className="fixed pointer-events-none z-40"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: '60px',
          }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 rounded-full border border-dashed border-gray-300 opacity-15" />
        </div>
      )}

      {/* Minimal instruction when over a zone */}
      {targetZone && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: `${position.x}px`,
            top: `${position.y + 30}px`,
            transform: 'translateX(-50%)',
          }}
          aria-hidden="true"
        >
          <div className="bg-violet-600 text-white text-xs px-2 py-1 rounded-full shadow-lg whitespace-nowrap font-semibold animate-pulse">
            Enter ↵
          </div>
        </div>
      )}

      {/* DEBUG: Show detected zone ID */}
      {targetZone && process.env.NODE_ENV === 'development' && (
        <div
          className="fixed pointer-events-none z-50 bg-black text-white text-[10px] px-2 py-1 rounded"
          style={{
            left: `${position.x}px`,
            top: `${position.y + 50}px`,
            transform: 'translateX(-50%)',
          }}
        >
          Detected: {targetZone}
        </div>
      )}
    </>
  );
}