/**
 * useDragHandlers Hook
 * Encapsulates drag-and-drop logic for the puzzle game
 * SPARC: Architecture - Separation of concerns for drag handling
 *
 * This hook manages all drag state and handlers for the Colombia puzzle game.
 * It integrates with the game context, sound effects, and provides placement
 * feedback for user interactions.
 */

import { useState, useRef, useCallback } from 'react';
import { DragEndEvent, DragStartEvent, DragMoveEvent } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';
import { useSoundEffect } from '../services/soundManager';

interface PlacementFeedback {
  show: boolean;
  isCorrect: boolean;
  departmentName: string;
  position: { x: number; y: number };
}

/**
 * Custom hook for managing drag-and-drop interactions
 *
 * Responsibilities:
 * - Track drag state (start position, distance dragged)
 * - Handle drag lifecycle events (start, move, end, cancel)
 * - Provide visual feedback for placement attempts
 * - Integrate with game context for department management
 * - Trigger appropriate sound effects
 *
 * @returns Placement feedback state, setter, and drag event handlers
 */
export function useDragHandlers() {
  const game = useGame();
  const sound = useSoundEffect();

  // State for visual feedback on placement attempts
  const [placementFeedback, setPlacementFeedback] = useState<PlacementFeedback>({
    show: false,
    isCorrect: false,
    departmentName: '',
    position: { x: 0, y: 0 }
  });

  // Track whether user has actually dragged (vs just clicked)
  const [hasDraggedDistance, setHasDraggedDistance] = useState(false);

  // Store initial drag position to calculate distance
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  /**
   * Handle drag start event
   * - Clear keyboard navigation state
   * - Select department in game context
   * - Set dragging state
   * - Play pickup sound
   * - Store initial position
   */
  const handleDragStart = useCallback((event: DragStartEvent) => {
    // Clear any keyboard navigation state when starting mouse drag
    (window as any).__keyboardNavTarget = null;

    const departmentId = event.active.id as string;
    const department = game.departments.find(d => d.id === departmentId);

    if (department) {
      game.selectDepartment(department);
      game.setIsDragging(true);
      sound.playSound('pickup', 0.5);
    }

    // Store initial position to track if actual dragging occurs
    dragStartPos.current = {
      x: event.active.rect.current.translated?.left || 0,
      y: event.active.rect.current.translated?.top || 0
    };

    setHasDraggedDistance(false);
  }, [game, sound]);

  /**
   * Handle drag move event
   * - Check if user has dragged more than 5 pixels (threshold for actual drag)
   * - Update hasDraggedDistance state when threshold exceeded
   */
  const handleDragMove = useCallback((event: DragMoveEvent) => {
    // Check if user has dragged more than 5 pixels (threshold for actual drag)
    if (!hasDraggedDistance && dragStartPos.current) {
      const currentX = event.active.rect.current.translated?.left || 0;
      const currentY = event.active.rect.current.translated?.top || 0;

      const distance = Math.sqrt(
        Math.pow(currentX - dragStartPos.current.x, 2) +
        Math.pow(currentY - dragStartPos.current.y, 2)
      );

      if (distance > 5) {
        setHasDraggedDistance(true);
      }
    }
  }, [hasDraggedDistance]);

  /**
   * Handle drag end event
   * - Clear dragging state
   * - Check if placement is correct
   * - Show visual feedback
   * - Update game state
   * - Play appropriate sound effect
   * - Handle edge cases (no target, just clicked)
   */
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    // Always clear dragging state when drag ends
    game.setIsDragging(false);

    if (over) {
      // Get the IDs directly - they should now match
      const draggedId = active.id as string;
      const targetId = over.id as string;

      // Get the department data - try all possible sources
      const draggedDepartment = game.currentDepartment ||
                               game.departments.find(d => d.id === draggedId) ||
                               game.activeDepartments?.find(d => d.id === draggedId) ||
                               active.data?.current;

      // Get a readable department name - ALWAYS provide something
      let departmentName = '';
      if (draggedDepartment?.name) {
        departmentName = draggedDepartment.name;
      } else if (draggedId) {
        // Format the ID as a readable name (e.g., "la-guajira" -> "La Guajira")
        departmentName = draggedId
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      } else {
        departmentName = 'el departamento';
      }

      // Check if the placement is correct - simple comparison now
      const isCorrect = draggedId === targetId;

      // Show placement feedback
      const rect = (event.over as DragEndEvent['over'] & { rect?: DOMRect })?.rect;

      // Reset feedback first to ensure it shows on consecutive attempts
      setPlacementFeedback(prev => ({ ...prev, show: false }));

      // Then show new feedback after a brief delay
      setTimeout(() => {
        setPlacementFeedback({
          show: true,
          isCorrect,
          departmentName: departmentName,
          position: rect
            ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
            : { x: window.innerWidth / 2, y: window.innerHeight / 2 }
        });
      }, 10);

      if (isCorrect) {
        // Correct placement - use the department ID
        game.placeDepartment(draggedId, true);
        sound.playSound('correct');
      } else {
        // Incorrect placement
        game.placeDepartment(draggedId, false);
        sound.playSound('incorrect');
      }
    } else {
      // No target - user cancelled the drag or dropped in empty space
      // Only clear if user actually dragged (not just clicked)
      if (hasDraggedDistance) {
        game.clearCurrentDepartment();
      }
      // If just clicked without dragging, keep the department selected
    }

    // Reset drag tracking
    setHasDraggedDistance(false);
    dragStartPos.current = null;
  }, [game, sound, hasDraggedDistance]);

  /**
   * Handle drag cancel event
   * - User pressed ESC or drag was cancelled
   * - Clear dragging state
   * - Only clear selection if actually dragged
   */
  const handleDragCancel = useCallback(() => {
    // User pressed ESC or drag was cancelled
    // Always clear dragging state
    game.setIsDragging(false);

    // Only clear selection if actually dragged
    if (hasDraggedDistance) {
      game.clearCurrentDepartment();
    }

    // Reset drag tracking
    setHasDraggedDistance(false);
    dragStartPos.current = null;
  }, [game, hasDraggedDistance]);

  return {
    placementFeedback,
    setPlacementFeedback,
    handlers: {
      onDragStart: handleDragStart,
      onDragMove: handleDragMove,
      onDragEnd: handleDragEnd,
      onDragCancel: handleDragCancel,
    }
  };
}
