import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { Department } from '../types/game';
import { keyboardManager } from '../services/keyboardManager';

/**
 * CONCEPT: Keyboard Navigation for Accessibility
 * WHY: Essential for users who cannot use a mouse
 * PATTERN: Simple keyboard event handling for game controls
 */

interface KeyboardNavigationState {
  selectedDepartment: Department | null;
  isMoving: boolean;
  position: { x: number; y: number };
  targetZone: string | null;
}

export function useKeyboardNavigation() {
  const game = useGame();
  const [navState, setNavState] = useState<KeyboardNavigationState>({
    selectedDepartment: null,
    isMoving: false,
    position: { x: 0, y: 0 },
    targetZone: null,
  });

  const moveStep = 10; // Pixels to move per arrow key press
  const fastMoveStep = 50; // Pixels to move with Shift+Arrow

  // Handle movement
  const handleMovement = (direction: string, fast: boolean = false) => {
    if (!navState.isMoving || !navState.selectedDepartment) return;

    const step = fast ? fastMoveStep : moveStep;
    const newPosition = { ...navState.position };

    switch (direction) {
      case 'up':
        newPosition.y = Math.max(0, newPosition.y - step);
        break;
      case 'down':
        newPosition.y = Math.min(window.innerHeight, newPosition.y + step);
        break;
      case 'left':
        newPosition.x = Math.max(0, newPosition.x - step);
        break;
      case 'right':
        newPosition.x = Math.min(window.innerWidth, newPosition.x + step);
        break;
    }

    // Check if we're over a drop zone
    const elementAtPosition = document.elementFromPoint(newPosition.x, newPosition.y);
    const dropZone = elementAtPosition?.closest('[data-department-drop-zone]');
    const targetZone = dropZone?.getAttribute('data-department-drop-zone') || null;

    setNavState(prev => ({
      ...prev,
      position: newPosition,
      targetZone,
    }));

    // Announce position to screen reader
    if (targetZone) {
      announceToScreenReader(`Sobre zona de ${targetZone}`);
    }
  };

  useEffect(() => {
    // Handle keyboard actions from the keyboard manager
    const handleKeyboardAction = (e: CustomEvent) => {
      const { action, event } = e.detail;

      switch (action) {
        case 'select': {
          // Check if we're focused on a department in the tray
          const focusedElement = document.activeElement;
          if (focusedElement?.hasAttribute('data-department-id')) {
            const deptId = focusedElement.getAttribute('data-department-id');
            const department = game.departments.find(d => d.id === deptId);

            if (department && !game.placedDepartments.has(department.id)) {
              // Start moving mode
              setNavState({
                selectedDepartment: department,
                isMoving: true,
                position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
                targetZone: null,
              });
              game.selectDepartment(department);
              announceToScreenReader(`${department.name} seleccionado. Use las flechas para mover, Enter para colocar, Escape para cancelar.`);
            }
          } else if (navState.isMoving && navState.targetZone) {
            // Place the department
            const isCorrect = navState.selectedDepartment?.id === navState.targetZone;
            if (navState.targetZone && navState.selectedDepartment) {
              game.placeDepartment(navState.targetZone, isCorrect);
              announceToScreenReader(
                isCorrect
                  ? `¡Correcto! ${navState.selectedDepartment.name} colocado correctamente.`
                  : `Incorrecto. ${navState.selectedDepartment.name} no va ahí. Intenta de nuevo.`
              );
            }
            // Reset navigation state
            setNavState({
              selectedDepartment: null,
              isMoving: false,
              position: { x: 0, y: 0 },
              targetZone: null,
            });
          }
          break;
        }

        case 'cancel': {
          if (navState.isMoving) {
            game.clearCurrentDepartment();
            setNavState({
              selectedDepartment: null,
              isMoving: false,
              position: { x: 0, y: 0 },
              targetZone: null,
            });
            announceToScreenReader('Selección cancelada');
          }
          break;
        }

        // Movement actions
        case 'move-up':
          handleMovement('up', false);
          break;
        case 'move-up-fast':
          handleMovement('up', true);
          break;
        case 'move-down':
          handleMovement('down', false);
          break;
        case 'move-down-fast':
          handleMovement('down', true);
          break;
        case 'move-left':
          handleMovement('left', false);
          break;
        case 'move-left-fast':
          handleMovement('left', true);
          break;
        case 'move-right':
          handleMovement('right', false);
          break;
        case 'move-right-fast':
          handleMovement('right', true);
          break;

        // Game actions
        case 'hint': {
          if (game.hints > 0 && game.currentDepartment) {
            game.useHint();
            announceToScreenReader(`Pista usada. ${game.hints} pistas restantes.`);
          }
          break;
        }

        case 'restart': {
          if (confirm('¿Estás seguro de que quieres reiniciar el juego?')) {
            game.resetGame();
            announceToScreenReader('Juego reiniciado');
          }
          break;
        }

        case 'pause': {
          if (game.isPaused) {
            game.resumeGame();
            announceToScreenReader('Juego resumido');
          } else {
            game.pauseGame();
            announceToScreenReader('Juego pausado');
          }
          break;
        }

        // Region quick access
        case 'region-1':
        case 'region-2':
        case 'region-3':
        case 'region-4':
        case 'region-5':
        case 'region-6': {
          if (game.gameMode.type === 'region') {
            event.preventDefault();
            const regions = ['Andina', 'Caribe', 'Pacífico', 'Orinoquía', 'Amazonía', 'Insular'];
            const regionIndex = parseInt(action.split('-')[1]) - 1;
            if (regionIndex < regions.length) {
              announceToScreenReader(`Enfocando región ${regions[regionIndex]}`);
              // Focus first department of that region
              const regionDepts = game.departments.filter(d => d.region === regions[regionIndex]);
              if (regionDepts.length > 0) {
                const firstDept = document.querySelector(`[data-department-id="${regionDepts[0].id}"]`) as HTMLElement;
                firstDept?.focus();
              }
            }
          }
          break;
        }

        // Sound control
        case 'mute': {
          // Toggle mute in sound settings
          const soundSettings = JSON.parse(localStorage.getItem('soundSettings') || '{}');
          soundSettings.enabled = !soundSettings.enabled;
          localStorage.setItem('soundSettings', JSON.stringify(soundSettings));
          announceToScreenReader(soundSettings.enabled ? 'Sonido activado' : 'Sonido desactivado');
          break;
        }
      }
    };

    window.addEventListener('keyboard-action', handleKeyboardAction as EventListener);
    return () => {
      window.removeEventListener('keyboard-action', handleKeyboardAction as EventListener);
    };
  }, [game, navState]);

  // Visual indicator for keyboard navigation mode
  useEffect(() => {
    if (navState.isMoving && navState.selectedDepartment) {
      // Create or update visual indicator
      let indicator = document.getElementById('keyboard-nav-indicator');
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'keyboard-nav-indicator';
        indicator.className = 'fixed z-50 pointer-events-none';
        document.body.appendChild(indicator);
      }

      indicator.style.left = `${navState.position.x}px`;
      indicator.style.top = `${navState.position.y}px`;
      indicator.style.transform = 'translate(-50%, -50%)';
      indicator.innerHTML = `
        <div class="bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <span class="text-2xl">📍</span>
          <span class="font-semibold">${navState.selectedDepartment.name}</span>
        </div>
        <div class="absolute inset-0 border-4 border-blue-500 rounded-lg animate-pulse"></div>
      `;

      return () => {
        if (indicator && indicator.parentNode) {
          indicator.parentNode.removeChild(indicator);
        }
      };
    }
  }, [navState]);

  return {
    isKeyboardMode: navState.isMoving,
    selectedDepartment: navState.selectedDepartment,
    position: navState.position,
    targetZone: navState.targetZone,
  };
}

/**
 * Helper function to announce messages to screen readers
 */
function announceToScreenReader(message: string) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'assertive');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement is made
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement);
    }
  }, 1000);
}