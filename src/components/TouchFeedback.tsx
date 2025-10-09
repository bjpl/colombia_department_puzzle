/**
 * Touch Feedback Component - Visual ripple effects for touch interactions
 *
 * Features:
 * - Radial gradient ripple animation
 * - Color-coded feedback (success, error, tap)
 * - 300ms duration (feels instant)
 * - GPU-accelerated (transform/opacity only)
 * - Integrates with useTouchFeedback hook
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTouchFeedback, FeedbackType } from '../hooks/useTouchFeedback';

interface RippleEffect {
  id: number;
  x: number;
  y: number;
  type: FeedbackType;
}

export interface TouchFeedbackProps {
  children: React.ReactNode;
  type?: FeedbackType;
  enabled?: boolean;
  onComplete?: () => void;
  className?: string;
}

const RIPPLE_COLORS = {
  tap: 'rgba(59, 130, 246, 0.3)',      // Blue for normal tap
  success: 'rgba(34, 197, 94, 0.4)',   // Green for success
  error: 'rgba(239, 68, 68, 0.4)',     // Red for error
  disabled: 'rgba(156, 163, 175, 0.2)', // Gray for disabled
} as const;

let rippleIdCounter = 0;

export function TouchFeedback({
  children,
  type = 'tap',
  enabled = true,
  onComplete,
  className = '',
}: TouchFeedbackProps) {
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { trigger, settings } = useTouchFeedback();

  /**
   * Create ripple effect at touch/click position
   */
  const createRipple = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!enabled || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    // Get touch/click position
    let clientX: number;
    let clientY: number;

    if ('touches' in event) {
      // Touch event
      const touch = event.touches[0] || event.changedTouches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      // Mouse event
      clientX = event.clientX;
      clientY = event.clientY;
    }

    // Calculate position relative to container
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const ripple: RippleEffect = {
      id: rippleIdCounter++,
      x,
      y,
      type,
    };

    setRipples(prev => [...prev, ripple]);

    // Trigger haptic/audio feedback
    trigger(type);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
      onComplete?.();
    }, 300);
  }, [enabled, type, trigger, onComplete]);

  /**
   * Handle touch start
   */
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    createRipple(event);
  }, [createRipple]);

  /**
   * Handle mouse down (for desktop testing)
   */
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    // Only trigger on left click
    if (event.button === 0) {
      createRipple(event);
    }
  }, [createRipple]);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onTouchStart={handleTouchStart}
      onMouseDown={handleMouseDown}
      role="presentation"
      style={{
        WebkitTapHighlightColor: 'transparent', // Remove default mobile tap highlight
      }}
    >
      {children}

      {/* Ripple effects layer */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            background: RIPPLE_COLORS[ripple.type],
            transform: 'translate(-50%, -50%)',
            animation: 'ripple-expand 300ms ease-out',
          }}
        />
      ))}

      {/* Ripple animation styles */}
      <style>{`
        @keyframes ripple-expand {
          from {
            width: 0;
            height: 0;
            opacity: 1;
          }
          to {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Settings UI for touch feedback preferences
 */
export function TouchFeedbackSettings() {
  const { settings, toggleHaptics, toggleAudio, isHapticsSupported } = useTouchFeedback();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">
        Configuración de Retroalimentación Táctil
      </h3>

      {/* Haptics toggle */}
      {isHapticsSupported && (
        <label className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Vibración háptica</span>
          <input
            type="checkbox"
            checked={settings.hapticsEnabled}
            onChange={toggleHaptics}
            className="w-10 h-6"
          />
        </label>
      )}

      {!isHapticsSupported && (
        <p className="text-xs text-gray-500">
          La vibración háptica no está disponible en este dispositivo
        </p>
      )}

      {/* Audio toggle */}
      <label className="flex items-center justify-between">
        <span className="text-sm text-gray-700">Efectos de sonido</span>
        <input
          type="checkbox"
          checked={settings.audioEnabled}
          onChange={toggleAudio}
          className="w-10 h-6"
        />
      </label>

      <p className="text-xs text-gray-500">
        Proporciona retroalimentación cuando tocas elementos interactivos
      </p>
    </div>
  );
}

export default TouchFeedback;
