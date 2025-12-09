/**
 * TouchModeAdapter Component
 *
 * Wrapper component that implements progressive touch enhancement for mobile gameplay.
 * Intercepts DndContext on touch devices and implements tap-to-select → tap-to-place workflow.
 *
 * Interaction Modes:
 * - Touch (mobile): Tap chip → tap map (primary), long-press → drag (power user)
 * - Mouse (desktop): Traditional drag-and-drop (unchanged)
 *
 * @module TouchModeAdapter
 */

import React, { ReactNode, useState, useEffect, useCallback } from 'react';
import { useTouchGestures, InputMethod } from '../hooks/useTouchGestures';
import { prefersTouchMode } from '../utils/deviceDetection';
import { useGame } from '../context/GameContext';

/**
 * Props for TouchModeAdapter
 */
export interface TouchModeAdapterProps {
  children: ReactNode;
  /** Enable touch mode (auto-detected if not specified) */
  enabled?: boolean;
  /** Callback when touch mode is activated */
  onTouchModeActive?: (active: boolean) => void;
}

/**
 * TouchModeAdapter Component
 *
 * Wraps DepartmentTray to provide progressive touch enhancement.
 * Implements tap-to-select → tap-to-place workflow for touch devices.
 *
 * @example
 * ```tsx
 * <TouchModeAdapter>
 *   <DepartmentTray />
 * </TouchModeAdapter>
 * ```
 */
export function TouchModeAdapter({
  children,
  enabled,
  onTouchModeActive
}: TouchModeAdapterProps) {
  const game = useGame();
  const [selectedChipId, setSelectedChipId] = useState<string | null>(null);
  const [isTouchMode, setIsTouchMode] = useState(false);
  const [longPressActive, setLongPressActive] = useState(false);

  /**
   * Determine if touch mode should be active
   */
  useEffect(() => {
    const shouldUseTouchMode = enabled !== undefined ? enabled : prefersTouchMode();
    setIsTouchMode(shouldUseTouchMode);
    onTouchModeActive?.(shouldUseTouchMode);
  }, [enabled, onTouchModeActive]);

  /**
   * Listen for interaction mode changes
   */
  useEffect(() => {
    const handleModeChange = () => {
      const shouldUseTouchMode = enabled !== undefined ? enabled : prefersTouchMode();
      setIsTouchMode(shouldUseTouchMode);
      onTouchModeActive?.(shouldUseTouchMode);
    };

    window.addEventListener('interaction-mode-changed', handleModeChange);
    return () => window.removeEventListener('interaction-mode-changed', handleModeChange);
  }, [enabled, onTouchModeActive]);

  /**
   * Handle chip tap/click
   */
  const handleChipInteraction = useCallback((chipId: string, _inputMethod: InputMethod) => {
    // Skip if not in touch mode
    if (!isTouchMode || longPressActive) {
      return;
    }

    // Tap same chip → deselect
    if (selectedChipId === chipId) {
      setSelectedChipId(null);
      game.clearCurrentDepartment();
      return;
    }

    // Tap different chip → select it
    setSelectedChipId(chipId);
    const department = game.departments.find(d => d.id === chipId);
    if (department) {
      game.selectDepartment(department);

      // Announce selection to screen readers
      const announcement = `${department.name} seleccionado. Toca el mapa para colocar.`;
      window.dispatchEvent(new CustomEvent('screen-reader-announcement', {
        detail: { message: announcement, priority: 'polite' }
      }));
    }
  }, [isTouchMode, longPressActive, selectedChipId, game]);

  /**
   * Handle map tap/click
   */
  const handleMapInteraction = useCallback((targetId: string, position: { x: number; y: number }) => {
    // Skip if not in touch mode or no chip selected
    if (!isTouchMode || !selectedChipId || longPressActive) {
      return;
    }

    // Place the selected chip at the tapped location
    const isCorrect = selectedChipId === targetId;

    // Trigger placement with feedback
    game.placeDepartment(selectedChipId, isCorrect);

    // Show visual feedback at tap position
    window.dispatchEvent(new CustomEvent('placement-feedback', {
      detail: {
        show: true,
        isCorrect,
        departmentName: game.departments.find(d => d.id === selectedChipId)?.name || selectedChipId,
        position
      }
    }));

    // Clear selection
    setSelectedChipId(null);
  }, [isTouchMode, selectedChipId, longPressActive, game]);

  /**
   * Setup gesture handlers for touch interactions
   */
  const { handlers: chipGestureHandlers } = useTouchGestures({
    onTap: (e) => {
      // Find which chip was tapped
      const target = e.target as HTMLElement;
      const chipElement = target.closest('[data-department-id]') as HTMLElement;

      if (chipElement) {
        const chipId = chipElement.dataset.departmentId;
        if (chipId) {
          handleChipInteraction(chipId, e.inputMethod);
        }
      }
    },
    onLongPress: (e) => {
      // Long press activates drag mode
      setLongPressActive(true);
      const target = e.target as HTMLElement;
      const chipElement = target.closest('[data-department-id]') as HTMLElement;

      if (chipElement) {
        const chipId = chipElement.dataset.departmentId;
        const department = game.departments.find(d => d.id === chipId);

        if (department) {
          // Announce drag mode activation
          const announcement = `Modo arrastre activado para ${department.name}. Arrastra al mapa.`;
          window.dispatchEvent(new CustomEvent('screen-reader-announcement', {
            detail: { message: announcement, priority: 'assertive' }
          }));

          // Let the existing DndContext handle the drag
          game.selectDepartment(department);
          game.setIsDragging(true);
        }
      }
    },
    onDragEnd: () => {
      // Reset long press mode when drag completes
      setLongPressActive(false);
    },
    onCancel: () => {
      // Reset long press mode on cancel
      setLongPressActive(false);
    }
  });

  /**
   * Setup gesture handlers for map interactions
   */
  const { handlers: mapGestureHandlers } = useTouchGestures({
    onTap: (e) => {
      // Find which map region was tapped
      const target = e.target as HTMLElement;
      const mapElement = target.closest('[data-droppable-id]') as HTMLElement;

      if (mapElement) {
        const targetId = mapElement.dataset.droppableId;
        if (targetId) {
          handleMapInteraction(targetId, { x: e.currentX, y: e.currentY });
        }
      }
    }
  });

  /**
   * Inject gesture handlers into children
   */
  const enhancedChildren = React.Children.map(children, child => {
    if (!React.isValidElement(child)) {
      return child;
    }

    // Check if this is the DepartmentTray component
    if (child.type && typeof child.type !== 'string') {
      const componentName = (child.type as any).name || '';

      if (componentName === 'DepartmentTray') {
        // Wrap DepartmentTray with touch gesture handlers
        return (
          <div
            {...chipGestureHandlers}
            style={{ touchAction: isTouchMode ? 'none' : 'auto' }}
            data-touch-mode={isTouchMode}
          >
            {React.cloneElement(child, {
              // Pass selected chip ID to highlight it
              selectedChipId: isTouchMode ? selectedChipId : undefined
            } as any)}
          </div>
        );
      }

      if (componentName === 'MapCanvas') {
        // Wrap MapCanvas with touch gesture handlers
        return (
          <div
            {...mapGestureHandlers}
            style={{ touchAction: isTouchMode ? 'none' : 'auto' }}
          >
            {child}
          </div>
        );
      }
    }

    return child;
  });

  // Add visual feedback for selected chip in touch mode
  useEffect(() => {
    if (!isTouchMode || !selectedChipId) {
      return;
    }

    // Add selected class to chip
    const chipElement = document.querySelector(`[data-department-id="${selectedChipId}"]`);
    if (chipElement) {
      chipElement.classList.add('touch-selected');

      // Add pulsing animation
      const style = document.createElement('style');
      style.textContent = `
        .touch-selected {
          animation: touch-pulse 1s ease-in-out infinite;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5) !important;
          transform: scale(1.05);
          z-index: 10;
        }

        @keyframes touch-pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.3); }
        }
      `;
      document.head.appendChild(style);

      // Cleanup
      return () => {
        chipElement.classList.remove('touch-selected');
        style.remove();
      };
    }
  }, [isTouchMode, selectedChipId]);

  return <>{enhancedChildren}</>;
}

/**
 * Hook to check if touch mode is currently active
 */
export function useTouchModeActive(): boolean {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const checkTouchMode = () => {
      setIsActive(prefersTouchMode());
    };

    checkTouchMode();
    window.addEventListener('interaction-mode-changed', checkTouchMode);
    window.addEventListener('resize', checkTouchMode);

    return () => {
      window.removeEventListener('interaction-mode-changed', checkTouchMode);
      window.removeEventListener('resize', checkTouchMode);
    };
  }, []);

  return isActive;
}

export default TouchModeAdapter;
