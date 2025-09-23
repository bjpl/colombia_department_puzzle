import React, { useEffect, useState } from 'react';
import {
  colors, spacing, textStyles, shadows, animations
} from '../design-system';

interface PlacementFeedbackProps {
  show: boolean;
  isCorrect: boolean;
  departmentName?: string;
  position?: { x: number; y: number };
}

export default function PlacementFeedback({
  show,
  isCorrect,
  departmentName,
  position = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
}: PlacementFeedbackProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      console.log('PlacementFeedback: Showing feedback', { isCorrect, departmentName, position });
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, isCorrect, departmentName]); // Added deps to re-trigger on changes

  if (!isVisible) return null;

  return (
    <div
      className={`fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-bounce`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      <div
        className={`animate-pulse py-2 px-4 rounded-lg shadow-lg font-semibold text-neutral-50 ${
          isCorrect
            ? 'bg-gradient-to-r from-success-500 to-success-600'
            : 'bg-gradient-to-r from-danger-500 to-danger-600'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">
            {isCorrect ? '✅' : '❌'}
          </span>
          <span>
            {isCorrect
              ? `¡Correcto! ${departmentName}`
              : departmentName ? `Intenta de nuevo con ${departmentName}` : 'Ubicación incorrecta'}
          </span>
        </div>
      </div>

      {/* Ripple effect */}
      <div
        className={`absolute inset-0 rounded-full animate-ping opacity-75 ${
          isCorrect ? 'bg-success-400' : 'bg-danger-400'
        }`}
      />
    </div>
  );
}