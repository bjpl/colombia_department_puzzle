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
      {/* Simple floating pill only */}
      <div className={`
        bg-white shadow-lg rounded-md px-2 py-1 border-2
        ${targetZone
          ? 'border-purple-500 ring-2 ring-purple-300'  // Neutral indicator for any drop zone
          : 'border-blue-500'
        }
        transition-all duration-200
      `}>
        <div className="flex items-center gap-1">
          <span className="text-sm">📍</span>
          <span className="font-semibold text-xs">{selectedDepartment.name}</span>
        </div>
      </div>

      {/* Compact instructions - only show briefly */}
      {targetZone && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-90">
          <span className="text-purple-300">Enter para colocar aquí</span>
        </div>
      )}
    </div>
  );
}