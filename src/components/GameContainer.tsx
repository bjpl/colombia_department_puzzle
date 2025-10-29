import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragMoveEvent, rectIntersection } from '@dnd-kit/core';
import MapCanvas from './MapCanvas';
import DepartmentTray from './DepartmentTray';
import GameHeader from './GameHeader';
import EducationalPanel from './EducationalPanel';
import DragOverlay from './DragOverlay';
import PlacementFeedback from './PlacementFeedback';
import ScreenReaderAnnouncements from './ScreenReaderAnnouncements';
import { useGame } from '../context/GameContext';
// Lazy load StudyMode for better initial bundle size (~14 KB savings)
const StudyMode = lazy(() => import('./StudyMode'));
import StudyModeLoading from './StudyModeLoading';
// Lazy load InteractiveTutorial - shown once per user (~15-20 KB savings)
const InteractiveTutorial = lazy(() => import('./InteractiveTutorial'));
import { useSoundEffect } from '../services/soundManager';
import PostGameReport from './PostGameReport';
import GameModeSelector, { GameModeConfig } from './GameModeSelector';
// Removed QuickStartFlow - using InteractiveTutorial for simplicity
import ModeTransition from './ModeTransition';
import KeyboardHelp from './KeyboardHelp';
import MapErrorBoundary from './MapErrorBoundary';
import GameLogicErrorBoundary from './GameLogicErrorBoundary';
import ComponentErrorBoundary from './ComponentErrorBoundary';
import { useModalManager } from '../hooks/useModalManager';
import { useGameTimer } from '../hooks/useGameTimer';
import { useEnhancedKeyboardNavigation } from '../hooks/useEnhancedKeyboardNavigation';
import KeyboardCursor from './KeyboardCursor';
import MobileGameLayout from './MobileGameLayout';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { MEDIA_QUERIES } from '../constants/responsive';
// Touch Interaction from Agent 1
import TouchModeAdapter from './TouchModeAdapter';
import { prefersTouchMode } from '../utils/deviceDetection';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  colors,
  spacing,
  textStyles,
  shadows
} from '../design-system';

export default function GameContainer() {
  const game = useGame();
  const modal = useModalManager();
  const timer = useGameTimer();
  const sound = useSoundEffect();

  // Responsive layout detection
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);

  // Touch interaction detection (Agent 1)
  const isTouchMode = prefersTouchMode();

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

  // Clean up any lingering DOM elements from old keyboard navigation
  useEffect(() => {
    // Remove any stuck keyboard navigation indicators
    const oldIndicator = document.getElementById('keyboard-nav-indicator');
    if (oldIndicator) {
      oldIndicator.remove();
    }

    // Also check for any elements with the specific classes
    const blueBoxes = document.querySelectorAll('.bg-sky-500.text-white.px-3.py-2.rounded-lg');
    blueBoxes.forEach(box => {
      if (box.textContent?.includes('Caquetá') || box.querySelector('.text-2xl')) {
        box.remove();
      }
    });

    // Reset any stuck drag state
    if (game.isDraggingDepartment && !game.currentDepartment) {
      game.setIsDragging(false);
    }

    // Clean up any stuck DragOverlay elements
    const dragOverlays = document.querySelectorAll('[class*="inline-flex"][class*="px-3"][class*="py-1"][class*="rounded-md"]');
    dragOverlays.forEach(overlay => {
      const parent = overlay.parentElement;
      if (parent && parent.style.position === 'fixed' && parent.style.zIndex) {
        parent.remove();
      }
    });
  }, []);

  // Reset stuck drag state on mount only
  useEffect(() => {
    // Reset drag state if it's stuck
    if (game.isDraggingDepartment && !game.currentDepartment) {
      game.setIsDragging(false);
    }
  }, []); // Only run once on mount

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

  // Removed automatic tutorial display to prevent modal queue issues
  // Users can access tutorial via the header button if needed

  // Listen for placement feedback from keyboard navigation
  useEffect(() => {
    const handlePlacementFeedback = (event: CustomEvent) => {
      const { show, isCorrect, departmentName, position } = event.detail;

      // Reset first to ensure re-trigger
      setPlacementFeedback({ show: false, isCorrect: false, departmentName: '', position: { x: 0, y: 0 } });

      // Then set new values after a brief delay
      setTimeout(() => {
        setPlacementFeedback({ show, isCorrect, departmentName, position });
        // Play sound effect
        if (isCorrect) {
          sound.playSound('correct');
        } else {
          sound.playSound('incorrect');
        }
      }, 10);
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
    // Clear any keyboard navigation state when starting mouse drag
    (window as any).__keyboardNavTarget = null;

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
          position: rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight / 2 }
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
      {/* Mobile Layout - Full screen map with bottom sheet */}
      {isMobile ? (
        <DndContext
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          collisionDetection={rectIntersection}
          autoScroll={false}
        >
          {/* Touch Mode Adapter - enables tap-to-place on touch devices (Agent 1) */}
          <TouchModeAdapter enabled={isTouchMode}>
            <MobileGameLayout />
          </TouchModeAdapter>

          {/* Drag Overlay for visual feedback - only show during mouse drag */}
          {game.isDraggingDepartment && <DragOverlay />}
        </DndContext>
      ) : (
        // Desktop Layout - Original side-by-side layout
        <div
          className="min-h-screen"
          style={{
            background: `linear-gradient(to bottom right, ${colors.brand[50]}, ${colors.success[50]})`
          }}
        >
          <div
            className="container mx-auto max-w-[1400px]"
            style={{ padding: spacing[4] }}
          >
            <GameHeader
              onGameMode={() => {
                game.clearCurrentDepartment(); // Clear any active drag
                modal.closeAllModals(); // Clear any queued modals first
                setTimeout(() => modal.openModal('gameMode'), 0); // Open after clearing
              }}
              onStudyMode={() => {
                game.clearCurrentDepartment(); // Clear any active drag
                modal.closeAllModals(); // Clear any queued modals first
                setTimeout(() => modal.openModal('study'), 0); // Open after clearing
              }}
              onTutorial={() => {
                game.clearCurrentDepartment(); // Clear any active drag
                modal.closeAllModals(); // Clear any queued modals first
                setTimeout(() => modal.openModal('tutorial'), 0); // Open after clearing
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
            <div
              className="flex"
              style={{
                marginTop: spacing[4],
                gap: spacing[3],
                paddingLeft: spacing[4],
                paddingRight: spacing[4],
                height: 'calc(100vh - 140px)',
                maxWidth: '100vw'
              }}
            >

            {/* Left Sidebar - Ultra-Compact Department Chips */}
            <ComponentErrorBoundary componentName="Department Tray">
              <Card
                variant="default"
                padding="sm"
                className="flex-shrink-0 relative"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  width: '208px',
                  maxHeight: '100%'
                }}
              >
                <CardHeader
                  className="border-b flex items-center justify-between sticky top-0 z-10"
                  style={{
                    backgroundColor: colors.surface.background,
                    paddingBottom: spacing[1],
                    marginBottom: spacing[2],
                    borderColor: colors.surface.border
                  }}
                >
                  <CardTitle
                    style={{
                      fontSize: textStyles.caption.fontSize[0],
                      fontWeight: textStyles.ui.medium.fontWeight,
                      color: colors.text.primary
                    }}
                  >
                    🧩 Departamentos
                  </CardTitle>
                  <Badge
                    variant="info"
                    size="sm"
                    style={{
                      fontSize: textStyles.caption.fontSize[0],
                      backgroundColor: colors.brand[100],
                      color: colors.brand[700]
                    }}
                  >
                    {game.departments.filter(d => !game.placedDepartments.has(d.id)).length}
                  </Badge>
                </CardHeader>
                <div
                  className="overflow-y-auto scroll-smooth"
                  style={{ maxHeight: 'calc(100vh - 200px)', overflowX: 'hidden' }}
                  id="department-scroll-container"
                  role="region"
                  aria-label="Lista de departamentos"
                >
                  <DepartmentTray layout="ultra-compact" />

                  {/* Scroll hint at bottom */}
                  <div
                    className="text-center"
                    style={{
                      paddingTop: spacing[2],
                      paddingBottom: spacing[2],
                      fontSize: '10px',
                      color: colors.text.tertiary
                    }}
                  >
                    ↑↓ Flechas para scroll
                  </div>
                </div>
              </Card>
            </ComponentErrorBoundary>

            {/* Center - MAXIMIZED Map Canvas */}
            <MapErrorBoundary>
              <Card
                variant="elevated"
                padding="sm"
                className="flex-1 flex items-center justify-center"
                style={{
                  minHeight: '600px',
                  boxShadow: shadows.lg
                }}
              >
                <MapCanvas />
              </Card>
            </MapErrorBoundary>

            {/* Right Sidebar - Ultra-Minimal Educational Panel */}
            <ComponentErrorBoundary componentName="Educational Panel">
              <Card
                variant="default"
                padding="sm"
                className="flex-shrink-0 flex flex-col h-full"
                style={{
                  width: '208px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                <CardContent className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
                  <EducationalPanel compact={true} />
                </CardContent>
              </Card>
            </ComponentErrorBoundary>
            </div>

            {/* Drag Overlay for visual feedback - only show during mouse drag */}
            {game.isDraggingDepartment && <DragOverlay />}
          </DndContext>
          </div>
        </div>
      )}

      {/* Shared Components - Rendered for both mobile and desktop */}

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
              try {
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
              } catch (error) {
                // Keep console.error for production error handling
                console.error('GameContainer: Error in onSelectMode:', error);
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
          <Suspense fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="animate-pulse text-white text-lg">Cargando tutorial...</div>
            </div>
          }>
            <InteractiveTutorial
              onComplete={() => {
                modal.closeAllModals(); // Simply close without showing any other modal
              }}
              onSkip={() => {
                modal.closeAllModals(); // Simply close without showing any other modal
              }}
            />
          </Suspense>
        )}
        {modal.isModalOpen('study') && (
          <Suspense fallback={<StudyModeLoading />}>
            <StudyMode
              onClose={() => {
                game.clearCurrentDepartment();
                modal.closeAllModals(); // Use closeAllModals to clear any queued modals
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
          </Suspense>
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
    </GameLogicErrorBoundary>
  );
}