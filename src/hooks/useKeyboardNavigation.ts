import { useEffect, useRef, useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { Department } from '../types/game';
import { keyboardManager } from '../services/keyboardManager';
import { SoundManager } from '../services/soundManager';

/**
 * CONCEPT: Advanced Keyboard Navigation System
 * WHY: Essential for accessibility and power users - full keyboard control
 * PATTERN: Integration with centralized keyboard manager for consistent handling
 */

interface KeyboardNavigationState {
  selectedDepartment: Department | null;
  isMoving: boolean;
  position: { x: number; y: number };
  targetZone: string | null;
}

export function useKeyboardNavigation() {
  const game = useGame();
  const sound = SoundManager.getInstance();
  const [navState, setNavState] = useState<KeyboardNavigationState>({
    selectedDepartment: null,
    isMoving: false,
    position: { x: 0, y: 0 },
    targetZone: null,
  });

  const undoStack = useRef<Department[]>([]);
  const redoStack = useRef<Department[]>([]);

  const moveStep = 10; // Pixels to move per arrow key press
  const fastMoveStep = 50; // Pixels to move with Shift+Arrow
  const precisionMoveStep = 2; // Pixels for precision mode (Ctrl+Arrow)

  // Handle movement actions
  const handleMovement = useCallback((direction: string, fast: boolean = false, precision: boolean = false) => {
    if (!navState.isMoving || !navState.selectedDepartment) return;

    const step = precision ? precisionMoveStep : (fast ? fastMoveStep : moveStep);
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
  }, [navState]);

  // Handle undo/redo
  const handleUndo = useCallback(() => {
    if (undoStack.current.length > 0) {
      const lastDepartment = undoStack.current.pop();
      if (lastDepartment) {
        redoStack.current.push(lastDepartment);
        // Remove from placed departments
        game.placedDepartments.delete(lastDepartment.id);
        sound.playSound('hint', 0.3);
        announceToScreenReader(`Acción deshecha: ${lastDepartment.name} removido`);
      }
    }
  }, [game, sound]);

  const handleRedo = useCallback(() => {
    if (redoStack.current.length > 0) {
      const department = redoStack.current.pop();
      if (department) {
        undoStack.current.push(department);
        game.placeDepartment(department.id, true);
        sound.playSound('hint', 0.3);
        announceToScreenReader(`Acción rehecha: ${department.name} colocado`);
      }
    }
  }, [game, sound]);

  useEffect(() => {
    // Set keyboard context
    keyboardManager.setContext(navState.isMoving ? 'game' : 'menu');

    // Register custom handlers for keyboard actions
    const handleKeyboardAction = (e: CustomEvent) => {
      const { action, event } = e.detail;

      switch (action) {
        case 'select':
        case 'select-alt': {
          event.preventDefault();

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
              sound.playSound('pickup', 0.5);
              announceToScreenReader(`${department.name} seleccionado. Use las flechas para mover, Enter para colocar, Escape para cancelar.`);
            }
          } else if (navState.isMoving && navState.targetZone) {
            // Place the department
            const isCorrect = navState.selectedDepartment?.id === navState.targetZone;
            if (navState.targetZone && navState.selectedDepartment) {
              game.placeDepartment(navState.targetZone, isCorrect);
              sound.playSound(isCorrect ? 'correct' : 'incorrect');
              if (isCorrect) {
                undoStack.current.push(navState.selectedDepartment);
                redoStack.current = [];
              }
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
            event.preventDefault();
            game.clearCurrentDepartment();
            setNavState({
              selectedDepartment: null,
              isMoving: false,
              position: { x: 0, y: 0 },
              targetZone: null,
            });
            sound.playSound('drop', 0.3);
            announceToScreenReader('Selección cancelada');
          }
          break;
        }

        // Movement actions
        case 'move-up':
        case 'move-up-fast':
        case 'move-up-vi':
        case 'move-up-wasd':
          handleMovement('up', action.includes('fast'), event.ctrlKey);
          break;
        case 'move-down':
        case 'move-down-fast':
        case 'move-down-vi':
        case 'move-down-wasd':
          handleMovement('down', action.includes('fast'), event.ctrlKey);
          break;
        case 'move-left':
        case 'move-left-fast':
        case 'move-left-vi':
        case 'move-left-wasd':
          handleMovement('left', action.includes('fast'), event.ctrlKey);
          break;
        case 'move-right':
        case 'move-right-fast':
        case 'move-right-vi':
        case 'move-right-wasd':
          handleMovement('right', action.includes('fast'), event.ctrlKey);
          break;

        // Game actions
        case 'hint': {
          if (game.hints > 0 && game.currentDepartment) {
            event.preventDefault();
            game.useHint();
            sound.playSound('hint');
            announceToScreenReader(`Pista usada. ${game.hints} pistas restantes.`);
          }
          break;
        }

        case 'restart': {
          event.preventDefault();
          if (confirm('¿Estás seguro de que quieres reiniciar el juego?')) {
            undoStack.current = [];
            redoStack.current = [];
            game.resetGame();
            sound.playSound('star', 0.5);
            announceToScreenReader('Juego reiniciado');
          }
          break;
        }

        case 'undo':
          handleUndo();
          break;

        case 'redo':
          handleRedo();
          break;

        case 'pause': {
          event.preventDefault();
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

        // Sound controls
        case 'mute-toggle': {
          const newEnabled = !sound.isEnabled();
          sound.setEnabled(newEnabled);
          announceToScreenReader(newEnabled ? 'Sonido activado' : 'Sonido desactivado');
          break;
        }

        case 'volume-up': {
          const newVolume = Math.min(1, sound.getMasterVolume() + 0.1);
          sound.setMasterVolume(newVolume);
          announceToScreenReader(`Volumen: ${Math.round(newVolume * 100)}%`);
          break;
        }

        case 'volume-down': {
          const newVolume = Math.max(0, sound.getMasterVolume() - 0.1);
          sound.setMasterVolume(newVolume);
          announceToScreenReader(`Volumen: ${Math.round(newVolume * 100)}%`);
          break;
        }
      }
    };

    window.addEventListener('keyboard-action', handleKeyboardAction as EventListener);
    return () => {
      window.removeEventListener('keyboard-action', handleKeyboardAction as EventListener);
    };
  }, [game, navState, handleMovement, handleUndo, handleRedo, sound]);

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