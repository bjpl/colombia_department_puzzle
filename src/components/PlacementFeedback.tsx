import React, { useEffect, useState } from 'react';

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
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-bounce`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className={`
        px-4 py-2 rounded-lg shadow-lg font-semibold text-white
        ${isCorrect
          ? 'bg-gradient-to-r from-green-500 to-green-600'
          : 'bg-gradient-to-r from-red-500 to-red-600'
        }
        animate-pulse
      `}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">
            {isCorrect ? '✅' : '❌'}
          </span>
          <span>
            {isCorrect
              ? `¡Correcto! ${departmentName}`
              : 'Ubicación incorrecta'}
          </span>
        </div>
      </div>

      {/* Ripple effect */}
      <div className={`
        absolute inset-0 rounded-full
        ${isCorrect ? 'bg-green-400' : 'bg-red-400'}
        animate-ping opacity-75
      `} />
    </div>
  );
}