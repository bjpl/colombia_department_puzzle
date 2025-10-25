import { useState, useRef, useEffect, ReactNode, useCallback } from 'react';
import {
  BOTTOM_SHEET_SNAP_POINTS,
  MOBILE_LAYOUT,
  Z_INDEX,
  SAFE_AREA,
} from '../constants/responsive';
import { colors, spacing } from '../design-system';

/**
 * Bottom Sheet Snap Point Type
 */
export type SnapPoint = 'collapsed' | 'half' | 'full';

/**
 * Bottom Sheet Props
 */
interface BottomSheetProps {
  children: ReactNode;
  initialSnapPoint?: SnapPoint;
  onSnapChange?: (snapPoint: SnapPoint) => void;
  className?: string;
}

/**
 * Convert snap point name to pixel value
 */
function getSnapPointValue(snapPoint: SnapPoint): number {
  if (typeof window === 'undefined') return 0;

  const value = BOTTOM_SHEET_SNAP_POINTS[snapPoint];
  if (typeof value === 'number') return value;

  // Parse vh values
  const vh = window.innerHeight;
  const percentage = parseInt(value.replace('vh', ''));
  return (vh * percentage) / 100;
}

/**
 * BottomSheet Component
 *
 * A swipeable bottom drawer with three snap points (collapsed, half, full).
 * Supports touch gestures with spring physics for smooth animations.
 *
 * Features:
 * - Touch/drag gestures (swipe up/down)
 * - Three snap points with smooth transitions
 * - Backdrop tap to collapse
 * - Keyboard accessible (Escape to collapse)
 * - Safe area handling (iOS notch, Android gestures)
 * - 60fps GPU-accelerated animations
 *
 * @example
 * <BottomSheet initialSnapPoint="collapsed" onSnapChange={(point) => console.log(point)}>
 *   <DepartmentTray />
 * </BottomSheet>
 */
export default function BottomSheet({
  children,
  initialSnapPoint = 'collapsed',
  onSnapChange,
  className = '',
}: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState<SnapPoint>(initialSnapPoint);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const initialHeight = useRef<number>(0);

  // Calculate current height based on snap point and drag offset
  const currentHeight = getSnapPointValue(currentSnap) - dragOffset;

  /**
   * Determine nearest snap point based on current height and velocity
   */
  const getNearestSnapPoint = useCallback((height: number, velocity: number): SnapPoint => {
    const collapsed = getSnapPointValue('collapsed');
    const half = getSnapPointValue('half');
    const full = getSnapPointValue('full');

    // Fast swipe up (positive velocity) - expand to next snap point
    if (velocity > MOBILE_LAYOUT.velocityThreshold) {
      if (currentSnap === 'collapsed') return 'half';
      if (currentSnap === 'half') return 'full';
      return 'full';
    }

    // Fast swipe down (negative velocity) - collapse to previous snap point
    if (velocity < -MOBILE_LAYOUT.velocityThreshold) {
      if (currentSnap === 'full') return 'half';
      if (currentSnap === 'half') return 'collapsed';
      return 'collapsed';
    }

    // No significant velocity - snap to nearest point
    const distToCollapsed = Math.abs(height - collapsed);
    const distToHalf = Math.abs(height - half);
    const distToFull = Math.abs(height - full);

    const minDist = Math.min(distToCollapsed, distToHalf, distToFull);

    if (minDist === distToCollapsed) return 'collapsed';
    if (minDist === distToHalf) return 'half';
    return 'full';
  }, [currentSnap]);

  /**
   * Handle touch start
   */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartY.current = touch.clientY;
    touchStartTime.current = Date.now();
    initialHeight.current = getSnapPointValue(currentSnap);
    setIsDragging(true);
  }, [currentSnap]);

  /**
   * Handle touch move
   */
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const deltaY = touchStartY.current - touch.clientY;

    // Update drag offset (positive = dragging up, negative = dragging down)
    setDragOffset(deltaY);
  }, [isDragging]);

  /**
   * Handle touch end
   */
  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;

    const dragDuration = Date.now() - touchStartTime.current;
    const velocity = dragOffset / dragDuration; // px/ms

    const newHeight = currentHeight;
    const newSnap = getNearestSnapPoint(newHeight, velocity);

    // Update snap point
    setCurrentSnap(newSnap);
    setDragOffset(0);
    setIsDragging(false);

    // Notify parent
    if (onSnapChange && newSnap !== currentSnap) {
      onSnapChange(newSnap);
    }
  }, [isDragging, dragOffset, currentHeight, currentSnap, getNearestSnapPoint, onSnapChange]);

  /**
   * Handle mouse events (for desktop testing)
   */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    touchStartY.current = e.clientY;
    touchStartTime.current = Date.now();
    initialHeight.current = getSnapPointValue(currentSnap);
    setIsDragging(true);
  }, [currentSnap]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaY = touchStartY.current - e.clientY;
    setDragOffset(deltaY);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    const dragDuration = Date.now() - touchStartTime.current;
    const velocity = dragOffset / dragDuration;

    const newHeight = currentHeight;
    const newSnap = getNearestSnapPoint(newHeight, velocity);

    setCurrentSnap(newSnap);
    setDragOffset(0);
    setIsDragging(false);

    if (onSnapChange && newSnap !== currentSnap) {
      onSnapChange(newSnap);
    }
  }, [isDragging, dragOffset, currentHeight, currentSnap, getNearestSnapPoint, onSnapChange]);

  // Attach mouse event listeners for desktop
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  /**
   * Handle backdrop click (collapse sheet)
   */
  const handleBackdropClick = useCallback(() => {
    if (currentSnap !== 'collapsed') {
      setCurrentSnap('collapsed');
      if (onSnapChange) {
        onSnapChange('collapsed');
      }
    }
  }, [currentSnap, onSnapChange]);

  /**
   * Handle keyboard events
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && currentSnap !== 'collapsed') {
        setCurrentSnap('collapsed');
        if (onSnapChange) {
          onSnapChange('collapsed');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSnap, onSnapChange]);

  // Calculate transform for smooth animation
  const transform = isDragging
    ? `translateY(calc(100% - ${currentHeight}px))`
    : `translateY(calc(100% - ${getSnapPointValue(currentSnap)}px))`;

  // Backdrop opacity based on sheet height
  const maxHeight = getSnapPointValue('full');
  const backdropOpacity = isDragging
    ? Math.min(0.5, (currentHeight / maxHeight) * 0.5)
    : Math.min(0.5, (getSnapPointValue(currentSnap) / maxHeight) * 0.5);

  return (
    <>
      {/* Backdrop - tap to collapse */}
      <div
        className="fixed inset-0 transition-opacity pointer-events-auto"
        style={{
          backgroundColor: colors.gray[900],
          opacity: backdropOpacity,
          zIndex: Z_INDEX.bottomSheet - 1,
          display: currentSnap === 'collapsed' ? 'none' : 'block',
          transitionDuration: isDragging ? '0ms' : `${MOBILE_LAYOUT.transitionDuration}ms`,
        }}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`fixed left-0 right-0 bottom-0 rounded-t-3xl shadow-2xl ${className}`}
        style={{
          backgroundColor: colors.surface.background,
          zIndex: Z_INDEX.bottomSheet,
          transform,
          willChange: 'transform',
          transition: isDragging
            ? 'none'
            : `transform ${MOBILE_LAYOUT.transitionDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
          paddingBottom: SAFE_AREA.bottom,
          touchAction: 'none', // Prevent browser scroll during drag
          maxHeight: '90vh', // Safety limit
        }}
        role="dialog"
        aria-label="Departamentos disponibles"
        aria-modal={currentSnap !== 'collapsed'}
      >
        {/* Drag Handle */}
        <div
          className="flex justify-center items-center cursor-grab active:cursor-grabbing"
          style={{
            height: MOBILE_LAYOUT.dragHandleHeight,
            paddingTop: spacing[3],
            paddingBottom: spacing[2],
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          role="button"
          tabIndex={0}
          aria-label={`Desliza ${currentSnap === 'collapsed' ? 'arriba' : 'abajo'} para ${currentSnap === 'collapsed' ? 'expandir' : 'colapsar'}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              const next: SnapPoint =
                currentSnap === 'collapsed' ? 'half' :
                currentSnap === 'half' ? 'full' : 'collapsed';
              setCurrentSnap(next);
              if (onSnapChange) onSnapChange(next);
            }
          }}
        >
          {/* Handle Indicator (gray pill) */}
          <div
            style={{
              width: '32px',
              height: '4px',
              borderRadius: '2px',
              backgroundColor: colors.gray[300],
            }}
            aria-hidden="true"
          />
        </div>

        {/* Content */}
        <div
          className="overflow-y-auto overflow-x-hidden"
          style={{
            height: `calc(${getSnapPointValue(currentSnap)}px - ${MOBILE_LAYOUT.dragHandleHeight}px - ${spacing[3]})`,
            padding: `0 ${spacing[4]} ${spacing[4]}`,
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
