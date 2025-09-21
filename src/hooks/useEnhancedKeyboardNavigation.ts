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

  // Update available departments
  useEffect(() => {
    const filtered = game.getFilteredDepartments();
    availableDepartmentsRef.current = filtered.filter(
      dept => !game.placedDepartments.has(dept.id)
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
      if (navState.mode === 'moving' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation(); // Stop ALL other handlers

        const { shiftKey, ctrlKey } = e;
        const speed = ctrlKey
          ? moveSpeed.precision
          : shiftKey
            ? moveSpeed.fast
            : moveSpeed.normal;

        let newX = navState.cursorPosition.x;
        let newY = navState.cursorPosition.y;

        switch (e.key) {
          case 'ArrowUp': newY -= speed; break;
          case 'ArrowDown': newY += speed; break;
          case 'ArrowLeft': newX -= speed; break;
          case 'ArrowRight': newX += speed; break;
        }

        // Constrain to viewport
        newX = Math.max(50, Math.min(window.innerWidth - 50, newX));
        newY = Math.max(50, Math.min(window.innerHeight - 50, newY));

        animateMovement(newX, newY);
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

        if (navState.mode === 'selecting' || navState.mode === 'idle') {
          // Pick up department
          const deptId = e.target.getAttribute('data-department-id');
          if (deptId) {
            const department = game.departments.find(d => d.id === deptId);
            if (department && !game.placedDepartments.has(department.id)) {

              // Start cursor closer to the map center, not at the department
              // Map is roughly in the center of the viewport
              const mapCenterX = window.innerWidth / 2;
              const mapCenterY = window.innerHeight / 2;
              // Start slightly to the left of center for better visibility
              const startX = mapCenterX - 100;
              const startY = mapCenterY;

              setNavState({
                mode: 'moving',
                selectedDepartment: department,
                focusedIndex: navState.focusedIndex,
                cursorPosition: { x: startX, y: startY },
                targetZone: null,
                lastMousePosition: { x: 0, y: 0 }
              });

              // Don't use game.selectDepartment as it sets isDragging
              // We'll handle placement directly when Enter is pressed
              announceToScreenReader(`${department.name} levantado. Use las flechas para mover. Enter para colocar.`);
            }
          }
        } else if (navState.mode === 'moving' && navState.selectedDepartment) {
          // Place department
          const isCorrect = navState.targetZone === navState.selectedDepartment.id;

          if (navState.targetZone) {
            // Set current department right before placement
            game.selectDepartment(navState.selectedDepartment);
            // Pass the selected department's ID
            game.placeDepartment(navState.selectedDepartment.id, isCorrect);

            if (isCorrect) {
              announceToScreenReader(`¡Correcto! ${navState.selectedDepartment.name} colocado.`);
              createSuccessAnimation(navState.cursorPosition);
            } else {
              announceToScreenReader(`Incorrecto. ${navState.selectedDepartment.name} no va ahí.`);
              createErrorAnimation(navState.cursorPosition);
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
          // Don't call clearCurrentDepartment as we're not using drag state
        }
        return;
      }

      // Escape to cancel
      if (key === 'Escape' && navState.mode === 'moving') {
        e.preventDefault();
        setNavState(prev => ({
          ...prev,
          mode: 'idle',
          selectedDepartment: null,
          targetZone: null
        }));
        // Don't call clearCurrentDepartment as we're not using drag state
        announceToScreenReader('Selección cancelada');
        return;
      }

      // Arrow key movement is now handled at the top of the function for priority

      // Number keys for quick region focus
      if (/^[1-6]$/.test(key) && navState.mode !== 'moving') {
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
      if (navState.mode === 'moving') {
        const distance = Math.sqrt(
          Math.pow(e.clientX - navState.lastMousePosition.x, 2) +
          Math.pow(e.clientY - navState.lastMousePosition.y, 2)
        );

        // If mouse moved significantly, switch to mouse mode
        if (distance > 50) {
          setNavState(prev => ({
            ...prev,
            mode: 'idle',
            selectedDepartment: null
          }));
        }
      }

      setNavState(prev => ({
        ...prev,
        lastMousePosition: { x: e.clientX, y: e.clientY }
      }));
    };

    // Use capture phase for arrow keys to intercept before any bubbling handlers
    window.addEventListener('keydown', handleKeyDown, true); // true = capture phase
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true); // Match capture phase
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [navState, game, animateMovement]);

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