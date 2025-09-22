import { useEffect, useState, useRef } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragMoveEvent, rectIntersection } from '@dnd-kit/core';
import { Department } from '../data/colombiaDepartments';
import MapCanvas from './MapCanvas';
import DepartmentTray from './DepartmentTray';
import GameHeader from './GameHeader';
import EducationalPanel from './EducationalPanel';
import DragOverlay from './DragOverlay';
import PlacementFeedback from './PlacementFeedback';
import ScreenReaderAnnouncements from './ScreenReaderAnnouncements';
import { useGame } from '../context/GameContext';
import StudyMode from './StudyMode';
import { useSoundEffect } from '../services/soundManager';
import PostGameReport from './PostGameReport';
import InteractiveTutorial from './InteractiveTutorial';
import GameModeSelector, { GameModeConfig } from './GameModeSelector';
// Removed QuickStartFlow - using InteractiveTutorial for simplicity
import ModeTransition from './ModeTransition';
import KeyboardHelp from './KeyboardHelp';
import ScrollIndicator from './ScrollIndicator';
import MapErrorBoundary from './MapErrorBoundary';
import GameLogicErrorBoundary from './GameLogicErrorBoundary';
import ComponentErrorBoundary from './ComponentErrorBoundary';
import { normalizeId, departmentNameMap } from '../utils/nameNormalizer';
import { storage } from '../services/storage';
import { useModalManager } from '../hooks/useModalManager';
import { useGameTimer } from '../hooks/useGameTimer';
import { useEnhancedKeyboardNavigation } from '../hooks/useEnhancedKeyboardNavigation';
import { keyboardManager } from '../services/keyboardManager';
import KeyboardCursor from './KeyboardCursor';

export default function GameContainer() {
  const game = useGame();
  const modal = useModalManager();
  const timer = useGameTimer();
  const sound = useSoundEffect();

  // Enhanced keyboard navigation for drag & drop
  const enhancedNav = useEnhancedKeyboardNavigation();
  const [placementFeedback, setPlacementFeedback] = useState({
    show: false,
    isCorrect: false,
    departmentName: '',
    position: { x: 0, y: 0 }
  });
  const [hasDraggedDistance, setHasDraggedDistance] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  // Enhanced flow states
  const [showTransition, setShowTransition] = useState(false);
  const [transitionConfig, setTransitionConfig] = useState<{ from: string; to: string; mode: GameModeConfig } | null>(null);

  // Initialize sound system on first user interaction
  useEffect(() => {
    const initSoundOnInteraction = () => {
      sound.initSound();
      // Remove listener after first interaction
      document.removeEventListener('click', initSoundOnInteraction);
      document.removeEventListener('touchstart', initSoundOnInteraction);
    };

    // Add listeners for first user interaction
    document.addEventListener('click', initSoundOnInteraction);
    document.addEventListener('touchstart', initSoundOnInteraction);

    // Cleanup
    return () => {
      document.removeEventListener('click', initSoundOnInteraction);
      document.removeEventListener('touchstart', initSoundOnInteraction);
    };
  }, []);

  // Sync timer with game state
  useEffect(() => {
    if (game.isGameStarted && !game.isPaused && !game.isGameComplete) {
      if (!timer.isRunning) {
        timer.startTimer();
      } else if (timer.isPaused) {
        timer.resumeTimer();
      }
    } else if (game.isPaused && timer.isRunning && !timer.isPaused) {
      timer.pauseTimer();
    } else if (game.isGameComplete && timer.isRunning) {
      timer.stopTimer();
    }
  }, [game.isGameStarted, game.isPaused, game.isGameComplete]);

  // Update game elapsed time
  useEffect(() => {
    if (timer.elapsedTime !== game.elapsedTime) {
      game.updateElapsedTime(timer.elapsedTime);
    }
  }, [timer.elapsedTime]);

  // Reset timer when game is reset
  useEffect(() => {
    // If game elapsed time is 0 but timer is still running or has time, reset the timer
    if (game.elapsedTime === 0 && !game.isGameStarted && (timer.isRunning || timer.elapsedTime > 0)) {
      timer.resetTimer();
    }
  }, [game.elapsedTime, game.isGameStarted]);

  // Check for first-time player and show tutorial
  useEffect(() => {
    const settings = storage.getSettings();
    const profile = storage.getActiveProfile();

    // Show tutorial for first-time users or those who haven't seen it
    if (!settings.tutorialShown || !profile || (!profile.stats?.gamesPlayed || profile.stats.gamesPlayed === 0)) {
      modal.openModal('tutorial');
    }
  }, []);

  // Listen for placement feedback from keyboard navigation
  useEffect(() => {
    const handlePlacementFeedback = (event: CustomEvent) => {
      console.log('Received placement-feedback event:', event.detail);
      const { show, isCorrect, departmentName, position } = event.detail;
      setPlacementFeedback({ show, isCorrect, departmentName, position });
      // Play sound effect
      if (isCorrect) {
        sound.playSound('correct');
      } else {
        sound.playSound('incorrect');
      }
    };

    window.addEventListener('placement-feedback', handlePlacementFeedback as EventListener);
    return () => {
      window.removeEventListener('placement-feedback', handlePlacementFeedback as EventListener);
    };
  }, []);

  // Clear drag state when window loses focus
  useEffect(() => {
    const handleBlur = () => {
      game.clearCurrentDepartment();
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  // Show post-game report when game completes
  useEffect(() => {
    if (game.isGameComplete && !modal.isModalOpen('postGame')) {
      modal.openModal('postGame');
      sound.playSound('win');
    }
  }, [game.isGameComplete]);

  const handleDragStart = (event: DragStartEvent) => {
    const departmentId = event.active.id as string;
    const department = game.departments.find(d => d.id === departmentId);
    if (department) {
      game.selectDepartment(department);
      game.setIsDragging(true); // Set dragging state to true
      sound.playSound('pickup', 0.5);
    }
    // Store initial position to track if actual dragging occurs
    dragStartPos.current = {
      x: event.active.rect.current.translated?.left || 0,
      y: event.active.rect.current.translated?.top || 0
    };
    setHasDraggedDistance(false);
  };

  const handleDragMove = (event: DragMoveEvent) => {
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
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Always clear dragging state when drag ends
    game.setIsDragging(false);

    if (over) {
      // Get the IDs directly - they should now match
      const draggedId = active.id as string;
      const targetId = over.id as string;

      // Get the department data
      const draggedDepartment = active.data.current as Department;

      // Check if the placement is correct - simple comparison now
      const isCorrect = draggedId === targetId;

      // Show placement feedback
      const rect = (event.over as DragEndEvent['over'] & { rect?: DOMRect })?.rect;
      setPlacementFeedback({
        show: true,
        isCorrect,
        departmentName: isCorrect ? (draggedDepartment?.name || '') : '',
        position: rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight / 2 }
      });

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
  };

  const handleDragCancel = () => {
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
  };

  return (
    <GameLogicErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto p-4 max-w-[1400px]">
        <GameHeader
          onGameMode={() => {
            game.clearCurrentDepartment(); // Clear any active drag
            modal.openModal('gameMode');
          }}
          onStudyMode={() => {
            game.clearCurrentDepartment(); // Clear any active drag
            modal.openModal('study');
          }}
          onTutorial={() => {
            game.clearCurrentDepartment(); // Clear any active drag
            modal.openModal('tutorial');
          }}
        />

        <DndContext
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          collisionDetection={rectIntersection}
          autoScroll={false}
        >
          {/* MAXIMIZED Layout: Full-screen map with minimal sidebars */}
          <div className="mt-4 flex gap-3 px-4" style={{ height: 'calc(100vh - 140px)', maxWidth: '100vw' }}>

            {/* Left Sidebar - Ultra-Compact Department Chips */}
            <ComponentErrorBoundary componentName="Department Tray">
              <div className="bg-white/90 rounded-lg shadow p-2 flex-shrink-0 relative" style={{ width: '208px', maxHeight: '100%' }}>
                <h3 className="text-xs font-bold mb-2 bg-white z-10 pb-1 border-b flex items-center justify-between sticky top-0">
                  <span>🧩 Departamentos</span>
                  <span className="text-xs bg-blue-100 px-1.5 py-0.5 rounded-full">
                    {game.departments.filter(d => !game.placedDepartments.has(d.id)).length}
                  </span>
                </h3>
                <div
                  className="overflow-y-auto scroll-smooth"
                  style={{ maxHeight: 'calc(100vh - 200px)', overflowX: 'hidden' }}
                  id="department-scroll-container"
                  onKeyDown={(e) => {
                    // Only allow scrolling if not in keyboard navigation mode (moving a department)
                    if (enhancedNav.isKeyboardMode) {
                      return; // Don't scroll when moving a department with arrow keys
                    }

                    // Arrow keys for scrolling within the container
                    if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      e.currentTarget.scrollTop -= 50;
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      e.currentTarget.scrollTop += 50;
                    } else if (e.key === 'Home') {
                      e.preventDefault();
                      e.currentTarget.scrollTop = 0;
                    } else if (e.key === 'End') {
                      e.preventDefault();
                      e.currentTarget.scrollTop = e.currentTarget.scrollHeight;
                    }
                  }}
                  tabIndex={-1}
                  aria-label="Lista de departamentos. Use las flechas arriba/abajo para desplazarse"
                >
                  <DepartmentTray layout="ultra-compact" />

                  {/* Scroll hint at bottom */}
                  <div className="text-center py-2 text-[10px] text-gray-400">
                    ↑↓ Flechas para scroll
                  </div>
                </div>
              </div>
            </ComponentErrorBoundary>

            {/* Center - MAXIMIZED Map Canvas */}
            <MapErrorBoundary>
              <div className="flex-1 bg-white rounded-lg shadow-lg p-2 flex items-center justify-center" style={{ minHeight: '600px' }}>
                <MapCanvas />
              </div>
            </MapErrorBoundary>

            {/* Right Sidebar - Ultra-Minimal Educational Panel */}
            <ComponentErrorBoundary componentName="Educational Panel">
              <div className="w-52 bg-white/90 rounded-lg shadow p-2 flex-shrink-0 flex flex-col h-full">
                <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
                  <EducationalPanel compact={true} />
                </div>
              </div>
            </ComponentErrorBoundary>
          </div>

          {/* Drag Overlay for visual feedback - only show during mouse drag */}
          {game.isDraggingDepartment && <DragOverlay />}
        </DndContext>

        {/* Placement Feedback */}
        <PlacementFeedback {...placementFeedback} />

        {/* Screen Reader Announcements */}
        <ScreenReaderAnnouncements />

        {/* Keyboard Help Overlay */}
        <KeyboardHelp />

        {/* Visual keyboard cursor */}
        <KeyboardCursor
          position={enhancedNav.cursorPosition}
          selectedDepartment={enhancedNav.selectedDepartment}
          isActive={enhancedNav.isKeyboardMode}
          targetZone={enhancedNav.targetZone}
        />

        {/* Mode Transition Animation */}
        {showTransition && transitionConfig && (
          <ModeTransition
            from={transitionConfig.from}
            to={transitionConfig.to}
            mode={transitionConfig.mode}
            onComplete={() => {
              setShowTransition(false);
              setTransitionConfig(null);
            }}
          />
        )}

        {/* Modals */}
        {modal.isModalOpen('gameMode') && (
          <GameModeSelector
            onSelectMode={(mode) => {
              if (mode.type === 'study') {
                // Open Study Mode instead of starting game
                modal.closeModal();
                modal.openModal('study');
              } else {
                // Start game with selected mode
                game.setGameMode(mode);
                modal.closeModal();
                game.resetGame();
              }
            }}
            onClose={() => modal.closeModal()}
            userStats={{
              unlockedRegions: new Set(['Insular', 'Pacífica', 'Orinoquía', 'Amazonía', 'Caribe', 'Andina']), // All regions unlocked
              regionProgress: game.regionProgress,
              totalStars: game.totalStars
            }}
          />
        )}
        {modal.isModalOpen('tutorial') && (
          <InteractiveTutorial
            onComplete={() => {
              modal.closeModal();
              // After tutorial, show mode selector for first-time users
              const profile = storage.getActiveProfile();
              if (!profile || !profile.stats?.gamesPlayed || profile.stats.gamesPlayed === 0) {
                modal.openModal('gameMode');
              }
            }}
            onSkip={() => {
              modal.closeModal();
              // If skipping tutorial, also show mode selector for first-time users
              const profile = storage.getActiveProfile();
              if (!profile || !profile.stats?.gamesPlayed || profile.stats.gamesPlayed === 0) {
                modal.openModal('gameMode');
              }
            }}
          />
        )}
        {modal.isModalOpen('study') && (
          <StudyMode
            onClose={() => {
              game.clearCurrentDepartment();
              modal.closeModal();
            }}
            onStartGame={() => {
              game.clearCurrentDepartment();
              modal.closeModal();
              setTransitionConfig({ from: 'study', to: 'game', mode: game.gameMode });
              setShowTransition(true);
              setTimeout(() => game.resetGame(), 500);
            }}
            onSelectMode={(mode) => {
              game.setGameMode(mode);
              modal.closeModal();
              setTransitionConfig({ from: 'study', to: 'game', mode });
              setShowTransition(true);
              setTimeout(() => game.resetGame(), 500);
            }}
          />
        )}
        {modal.isModalOpen('postGame') && (
          <PostGameReport
            onClose={() => {
              game.clearCurrentDepartment();
              modal.closeModal();
            }}
            onPlayAgain={() => {
              game.clearCurrentDepartment();
              modal.closeModal();
              game.resetGame();
            }}
            onStudyMode={() => {
              game.clearCurrentDepartment();
              modal.closeModal();
              modal.openModal('study');
              game.resetGame();
            }}
            onSelectMode={(mode) => {
              game.setGameMode(mode);
              modal.closeModal();
              setTransitionConfig({ from: 'complete', to: 'next', mode });
              setShowTransition(true);
              setTimeout(() => game.resetGame(), 500);
            }}
          />
        )}
      </div>
    </div>
    </GameLogicErrorBoundary>
  );
}