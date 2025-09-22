import { useEffect, useState } from 'react';
import { Department } from '../types/game';
import {
  colors, spacing, textStyles, shadows
} from '../design-system';

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
        <div style={{
          backgroundColor: colors.neutral[50],
          boxShadow: shadows.xl,
          borderRadius: borderRadius.lg,
          padding: `${spacing[2]} ${spacing[4]}`,
          border: `2px solid ${colors.brand[500]}`
        }}>
          <div className="flex items-center gap-2">
            <span className="text-lg">⌨️</span>
            <div className="flex items-baseline gap-2">
              <span style={{
                fontSize: textStyles.body.small.fontSize[0],
                color: colors.neutral[500],
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Moviendo:
              </span>
              <span style={{
                fontWeight: textStyles.body.medium.fontWeight,
                fontSize: textStyles.body.medium.fontSize[0]
              }}>
                {selectedDepartment.name}
              </span>
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
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '2.5rem',
            height: '2px',
            backgroundColor: colors.danger[500]
          }}
        />
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '2px',
            height: '2.5rem',
            backgroundColor: colors.danger[500]
          }}
        />
        {/* Center dot */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 animate-pulse"
          style={{
            width: '1rem',
            height: '1rem',
            borderRadius: '50%',
            backgroundColor: targetZone ? colors.success[500] : colors.danger[500],
            boxShadow: targetZone
              ? `0 0 0 4px ${colors.success[300]}`
              : `0 0 0 2px ${colors.danger[300]}`,
            transition: 'all 0.2s'
          }}
        />
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
          <div
            className="absolute inset-0 rounded-full border border-dashed opacity-15"
            style={{ borderColor: colors.neutral[300] }}
          />
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
          <div
            className="animate-pulse"
            style={{
              backgroundColor: colors.secondary[600],
              color: colors.neutral[50],
              fontSize: textStyles.body.small.fontSize[0],
              padding: `${spacing[1]} ${spacing[2]}`,
              borderRadius: '9999px',
              boxShadow: shadows.lg,
              whiteSpace: 'nowrap',
              fontWeight: textStyles.body.semibold.fontWeight
            }}
          >
            Enter ↵
          </div>
        </div>
      )}

      {/* DEBUG: Show detected zone ID */}
      {targetZone && process.env.NODE_ENV === 'development' && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: `${position.x}px`,
            top: `${position.y + 50}px`,
            transform: 'translateX(-50%)',
            backgroundColor: colors.neutral[950],
            color: colors.neutral[50],
            fontSize: '10px',
            padding: `${spacing[1]} ${spacing[2]}`,
            borderRadius: borderRadius.md
          }}
        >
          Detected: {targetZone}
        </div>
      )}
    </>
  );
}