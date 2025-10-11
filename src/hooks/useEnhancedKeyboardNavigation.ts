import { useEffect, useState, useCallback, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Department } from '../types/game';

/**
 * CONCEPT: Enhanced Keyboard Navigation for Drag & Drop
 * WHY: Provides seamless keyboard control that integrates with mouse DnD
 * PATTERN: State machine for keyboard navigation modes
 */

interface NavigationState {
  mode: 'idle' | 'selecting' | 'moving' | 'placing';
  selectedDepartment: Department | null;
  focusedIndex: number;
  cursorPosition: { x: number; y: number };
  targetZone: string | null;
  lastMousePosition: { x: number; y: number };
}

export function useEnhancedKeyboardNavigation() {
  const game = useGame();
  const [placementFeedback, setPlacementFeedback] = useState<any>(null);
  const [navState, setNavState] = useState<NavigationState>({
    mode: 'idle',
    selectedDepartment: null,
    focusedIndex: -1, // Start with -1 so first Tab goes to index 0
    cursorPosition: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    targetZone: null,
    lastMousePosition: { x: 0, y: 0 }
  });

  const availableDepartmentsRef = useRef<Department[]>([]);
  const moveSpeed = { normal: 15, fast: 40, precision: 5 }; // No need for ref, constant values
  const animationFrameRef = useRef<number | null>(null);

  // Use refs to access current state in event handlers
  const navStateRef = useRef(navState);
  navStateRef.current = navState;
  const gameRef = useRef(game);
  gameRef.current = game;

  // Update available departments
  useEffect(() => {
    const filtered = game.getFilteredDepartments();
    availableDepartmentsRef.current = filtered.filter(
      dept => !gameRef.current.placedDepartments.has(dept.id)
    );
  }, [game.placedDepartments]);

  // Smooth movement animation
  const animateMovement = useCallback((targetX: number, targetY: number) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const animate = () => {
      setNavState(prev => {
        if (prev.mode !== 'moving') return prev;

        const dx = targetX - prev.cursorPosition.x;
        const dy = targetY - prev.cursorPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 1) {
          return { ...prev, cursorPosition: { x: targetX, y: targetY } };
        }

        const speed = 0.2; // Smoothing factor
        const newX = prev.cursorPosition.x + dx * speed;
        const newY = prev.cursorPosition.y + dy * speed;

        // Check for drop zones
        const element = document.elementFromPoint(newX, newY);
        const dropZone = element?.closest('[data-department-drop-zone]');
        const zoneId = dropZone?.getAttribute('data-department-drop-zone') || null;

        animationFrameRef.current = requestAnimationFrame(animate);

        return {
          ...prev,
          cursorPosition: { x: newX, y: newY },
          targetZone: zoneId
        };
      });
    };

    animate();
  }, []);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // PRIORITY: If we're in moving mode and using arrow keys, handle it here first
      if (navStateRef.current.mode === 'moving' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation(); // Stop ALL other handlers

        const { shiftKey, ctrlKey } = e;

        // Use precision speed when already over a zone for fine-tuning
        const isOverZone = navStateRef.current.targetZone !== null;
        const baseSpeed = isOverZone ? moveSpeed.precision : moveSpeed.normal;

        const speed = ctrlKey
          ? moveSpeed.precision
          : shiftKey
            ? moveSpeed.fast
            : baseSpeed;

        let newX = navStateRef.current.cursorPosition.x;
        let newY = navStateRef.current.cursorPosition.y;

        switch (e.key) {
          case 'ArrowUp': newY -= speed; break;
          case 'ArrowDown': newY += speed; break;
          case 'ArrowLeft': newX -= speed; break;
          case 'ArrowRight': newX += speed; break;
        }

        // Constrain to viewport
        newX = Math.max(50, Math.min(window.innerWidth - 50, newX));
        newY = Math.max(50, Math.min(window.innerHeight - 50, newY));

        // Enhanced drop zone detection with better accuracy
        let zoneId = null;
        let detectionMethod = '';

        // Method 1: Direct hit test - hide ALL cursor elements first
        const cursorElements = document.querySelectorAll('.fixed.pointer-events-none');
        cursorElements.forEach(el => (el as HTMLElement).style.visibility = 'hidden');

        // Also hide the detection radius indicator specifically
        const radiusIndicators = document.querySelectorAll('.fixed.pointer-events-none.z-40, .fixed.pointer-events-none.z-\\[60\\]');
        radiusIndicators.forEach(el => (el as HTMLElement).style.visibility = 'hidden');

        // Get ALL elements at the exact crosshair point
        const elementsAtPoint = document.elementsFromPoint ?
          document.elementsFromPoint(newX, newY) :
          [document.elementFromPoint(newX, newY)];

        // Restore visibility
        cursorElements.forEach(el => (el as HTMLElement).style.visibility = '');
        radiusIndicators.forEach(el => (el as HTMLElement).style.visibility = '');

        // Check all elements at point for drop zones - prioritize direct hits
        for (const element of elementsAtPoint) {
          if (element && element.hasAttribute('data-department-drop-zone')) {
            zoneId = element.getAttribute('data-department-drop-zone');
            detectionMethod = 'direct-element';
            break;
          } else if (element) {
            const dropZone = element.closest('[data-department-drop-zone]');
            if (dropZone) {
              zoneId = dropZone.getAttribute('data-department-drop-zone');
              detectionMethod = 'closest-parent';
              break;
            }
          }
        }

        // Method 2: Only use proximity if no direct hit found
        if (!zoneId) {
          const allZones = document.querySelectorAll('[data-department-drop-zone]');
          let bestMatch = null;
          let bestMatchDistance = Infinity;
          let insideZone = null;

          for (const zone of allZones) {
            const rect = zone.getBoundingClientRect();

            // Check if cursor is INSIDE the bounding box (no padding for accuracy)
            if (newX >= rect.left && newX <= rect.right &&
                newY >= rect.top && newY <= rect.bottom) {
              insideZone = zone;
              zoneId = zone.getAttribute('data-department-drop-zone');
              detectionMethod = 'inside-bounds';
              break;  // Prioritize being inside bounds
            }

            // Track closest zone as fallback
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distance = Math.sqrt(Math.pow(newX - centerX, 2) + Math.pow(newY - centerY, 2));

            if (distance < bestMatchDistance) {
              bestMatchDistance = distance;
              bestMatch = zone;
            }
          }

          // Only use proximity as last resort, with stricter threshold
          if (!zoneId && bestMatch && bestMatchDistance < 40) {  // Reduced from 50
            zoneId = bestMatch.getAttribute('data-department-drop-zone');
            detectionMethod = 'proximity-fallback';

            // Optional: Snap to center when very close (within 20 pixels) and using Ctrl
            if (bestMatchDistance < 20 && ctrlKey) {
              const rect = bestMatch.getBoundingClientRect();
              newX = rect.left + rect.width / 2;
              newY = rect.top + rect.height / 2;
            }
          }
        }

        // Only show target zone if it's not already placed
        const finalZoneId = zoneId && !gameRef.current.placedDepartments.has(zoneId) ? zoneId : null;

        setNavState(prev => ({
          ...prev,
          cursorPosition: { x: newX, y: newY },
          targetZone: finalZoneId
        }));

        // Set global variable for map highlighting
        (window as any).__keyboardNavTarget = finalZoneId;

        return; // Exit early - we've handled this
      }

      const { key, shiftKey, ctrlKey } = e;

      // Tab navigation through departments - let browser handle it naturally
      if (key === 'Tab') {
        // Don't prevent default - let Tab work normally for focus navigation
        // Just track the focused element
        setNavState(prev => ({ ...prev, mode: 'selecting' }));
        return;
      }

      // Enter/Space to pick up or place
      if ((key === 'Enter' || key === ' ') && e.target instanceof HTMLElement) {
        // Prevent default for space to avoid page scroll
        if (key === ' ') {
          e.preventDefault();
        }

        if (navStateRef.current.mode === 'selecting' || navStateRef.current.mode === 'idle') {
          // Pick up department
          const deptId = e.target.getAttribute('data-department-id');
          if (deptId) {
            const department = gameRef.current.departments.find(d => d.id === deptId);
            if (department && !gameRef.current.placedDepartments.has(department.id)) {

              // Start cursor closer to the map center, not at the department
              // Map is roughly in the center of the viewport
              const mapCenterX = window.innerWidth / 2;
              const mapCenterY = window.innerHeight / 2;
              // Start slightly to the left of center for better visibility
              const startX = mapCenterX - 100;
              const startY = mapCenterY;

              // Check if we're already over a drop zone at start position
              const startElement = document.elementFromPoint(startX, startY);
              const startDropZone = startElement?.closest('[data-department-drop-zone]');
              const startZoneId = startDropZone?.getAttribute('data-department-drop-zone') || null;

              setNavState({
                mode: 'moving',
                selectedDepartment: department,
                focusedIndex: navStateRef.current.focusedIndex,
                cursorPosition: { x: startX, y: startY },
                targetZone: startZoneId,
                lastMousePosition: { x: 0, y: 0 }
              });

              // Set initial global target
              (window as any).__keyboardNavTarget = startZoneId;

              // Don't use game.selectDepartment as it sets isDragging
              // We'll handle placement directly when Enter is pressed
              announceToScreenReader(`${department.name} levantado. Use las flechas para mover. Enter para colocar.`);
            }
          }
        } else if (navStateRef.current.mode === 'moving' && navStateRef.current.selectedDepartment) {
          // Place department
          const isCorrect = navStateRef.current.targetZone === navStateRef.current.selectedDepartment.id;

          if (navStateRef.current.targetZone) {
            // Start game if needed
            if (!gameRef.current.isGameStarted) {
              gameRef.current.startGame();
            }
            // Don't use selectDepartment - directly place without setting currentDepartment
            // This prevents the DragOverlay from showing
            gameRef.current.placeDepartment(navStateRef.current.selectedDepartment.id, isCorrect);

            // Trigger placement feedback using custom event
            window.dispatchEvent(new CustomEvent('placement-feedback', {
              detail: {
                show: true,
                isCorrect,
                departmentName: navStateRef.current.selectedDepartment.name,
                position: navStateRef.current.cursorPosition
              }
            }));

            if (isCorrect) {
              announceToScreenReader(`¡Correcto! ${navStateRef.current.selectedDepartment.name} colocado.`);
            } else {
              announceToScreenReader(`Incorrecto. ${navStateRef.current.selectedDepartment.name} no va ahí.`);
            }
          } else {
            // No target zone - just announce
            announceToScreenReader(`No hay zona de destino. Mueva el cursor sobre el mapa.`);
          }

          // Reset to selection mode
          setNavState(prev => ({
            ...prev,
            mode: 'idle',
            selectedDepartment: null,
            targetZone: null
          }));
          // Clear global target
          (window as any).__keyboardNavTarget = null;
          // Don't call clearCurrentDepartment as we're not using drag state
        }
        return;
      }

      // Escape to cancel
      if (key === 'Escape' && navStateRef.current.mode === 'moving') {
        e.preventDefault();
        setNavState(prev => ({
          ...prev,
          mode: 'idle',
          selectedDepartment: null,
          targetZone: null
        }));
        // Clear global target
        (window as any).__keyboardNavTarget = null;
        // Don't call clearCurrentDepartment as we're not using drag state
        announceToScreenReader('Selección cancelada');
        return;
      }

      // Arrow key movement is now handled at the top of the function for priority

      // Number keys for quick region focus
      if (/^[1-6]$/.test(key) && navStateRef.current.mode !== 'moving') {
        const regions = ['Andina', 'Caribe', 'Pacífico', 'Orinoquía', 'Amazonía', 'Insular'];
        const regionIndex = parseInt(key) - 1;

        if (regionIndex < regions.length) {
          const regionDepts = availableDepartmentsRef.current.filter(
            d => d.region === regions[regionIndex]
          );

          if (regionDepts.length > 0) {
            const element = document.querySelector(`[data-department-id="${regionDepts[0].id}"]`) as HTMLElement;
            element?.focus();
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            announceToScreenReader(`Región ${regions[regionIndex]}, ${regionDepts.length} departamentos`);
          }
        }
      }
    };

    // Track mouse movement to switch modes
    const handleMouseMove = (e: MouseEvent) => {
      if (navStateRef.current.mode === 'moving') {
        const distance = Math.sqrt(
          Math.pow(e.clientX - navStateRef.current.lastMousePosition.x, 2) +
          Math.pow(e.clientY - navStateRef.current.lastMousePosition.y, 2)
        );

        // If mouse moved significantly, switch to mouse mode
        if (distance > 50) {
          setNavState(prev => ({
            ...prev,
            mode: 'idle',
            selectedDepartment: null,
            targetZone: null
          }));
          // Clear the global keyboard target to remove outline
          (window as any).__keyboardNavTarget = null;
        }
      }

      setNavState(prev => ({
        ...prev,
        lastMousePosition: { x: e.clientX, y: e.clientY }
      }));
    };

    // Clear keyboard state on mouse click
    const handleMouseClick = () => {
      if (navStateRef.current.mode === 'moving' || navStateRef.current.targetZone) {
        setNavState(prev => ({
          ...prev,
          mode: 'idle',
          selectedDepartment: null,
          targetZone: null
        }));
        // Clear the global keyboard target to remove outline
        (window as any).__keyboardNavTarget = null;
      }
    };

    // Use capture phase for arrow keys to intercept before any bubbling handlers
    window.addEventListener('keydown', handleKeyDown, true); // true = capture phase
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true); // Match capture phase
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []); // Remove dependencies to prevent re-registering on every state change

  return {
    isKeyboardMode: navState.mode === 'moving',
    selectedDepartment: navState.selectedDepartment,
    cursorPosition: navState.cursorPosition,
    targetZone: navState.targetZone,
    navigationMode: navState.mode
  };
}

// Helper functions
function announceToScreenReader(message: string) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'assertive');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

function createSuccessAnimation(position: { x: number; y: number }) {
  const element = document.createElement('div');
  element.className = 'fixed pointer-events-none z-50';
  element.style.left = `${position.x}px`;
  element.style.top = `${position.y}px`;
  element.style.transform = 'translate(-50%, -50%)';
  element.innerHTML = `
    <div class="text-6xl animate-bounce">✅</div>
  `;

  document.body.appendChild(element);
  setTimeout(() => element.remove(), 1000);
}

function createErrorAnimation(position: { x: number; y: number }) {
  const element = document.createElement('div');
  element.className = 'fixed pointer-events-none z-50';
  element.style.left = `${position.x}px`;
  element.style.top = `${position.y}px`;
  element.style.transform = 'translate(-50%, -50%)';
  element.innerHTML = `
    <div class="text-6xl animate-pulse text-red-500">❌</div>
  `;

  document.body.appendChild(element);
  setTimeout(() => element.remove(), 1000);
}