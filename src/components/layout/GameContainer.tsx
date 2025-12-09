import { useEffect, useState, lazy, Suspense } from 'react';
import { DndContext, rectIntersection } from '@dnd-kit/core';
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
// Lazy load PostGameReport - only shown after game completion (~25 KB savings)
const PostGameReport = lazy(() => import('./PostGameReport'));
// Lazy load GameModeSelector - only shown when user selects mode (~20 KB savings)
const GameModeSelector = lazy(() => import('./GameModeSelector'));
import type { GameModeConfig } from './GameModeSelector';
import ModeTransition from './ModeTransition';
import KeyboardHelp from './KeyboardHelp';
import MapErrorBoundary from './MapErrorBoundary';
import GameLogicErrorBoundary from './GameLogicErrorBoundary';
import ComponentErrorBoundary from './ComponentErrorBoundary';
import { useGameTimer } from '../hooks/useGameTimer';
import { useEnhancedKeyboardNavigation } from '../hooks/useEnhancedKeyboardNavigation';
import KeyboardCursor from './KeyboardCursor';
import MobileGameLayout from './MobileGameLayout';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { MEDIA_QUERIES } from '../constants/responsive';
// Touch Interaction
import TouchModeAdapter from './TouchModeAdapter';
import { prefersTouchMode } from '../utils/deviceDetection';
// Extracted hooks for drag handling and modal orchestration (SPARC: Refinement)
import { useDragHandlers } from '../hooks/useDragHandlers';
import { useModalOrchestration, MODAL_NAMES } from '../hooks/useModalOrchestration';
import { TIMING } from '../constants/gameConfig';
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
  const timer = useGameTimer();
  const sound = useSoundEffect();

  // Modal orchestration with safe state management (extracted hook)
  const { safeOpenModal, safeCloseModal, safeCloseAllModals, isModalOpen } = useModalOrchestration();

  // Drag handlers with placement feedback (extracted hook)
  const { placementFeedback, setPlacementFeedback, handlers: dragHandlers } = useDragHandlers();

  // Responsive layout detection
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);

  // Touch interaction detection
  const isTouchMode = prefersTouchMode();

  // Enhanced keyboard navigation for drag & drop
  const enhancedNav = useEnhancedKeyboardNavigation();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Note: Drag state reset is now handled by useDragHandlers hook

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.isGameStarted, game.isPaused, game.isGameComplete]);

  // Update game elapsed time
  useEffect(() => {
    if (timer.elapsedTime !== game.elapsedTime) {
      game.updateElapsedTime(timer.elapsedTime);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.elapsedTime]);

  // Reset timer when game is reset
  useEffect(() => {
    // If game elapsed time is 0 but timer is still running or has time, reset the timer
    if (game.elapsedTime === 0 && !game.isGameStarted && (timer.isRunning || timer.elapsedTime > 0)) {
      timer.resetTimer();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clear drag state when window loses focus
  useEffect(() => {
    const handleBlur = () => {
      game.clearCurrentDepartment();
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show post-game report when game completes
  useEffect(() => {
    if (game.isGameComplete && !isModalOpen(MODAL_NAMES.POST_GAME)) {
      safeOpenModal(MODAL_NAMES.POST_GAME);
      sound.playSound('win');
    }
  }, [game.isGameComplete, isModalOpen, safeOpenModal, sound]);

  // Note: Drag handlers (handleDragStart, handleDragMove, handleDragEnd, handleDragCancel)
  // are now provided by useDragHandlers hook via dragHandlers object

  return (
    <GameLogicErrorBoundary>
      {/* Mobile Layout - Full screen map with bottom sheet */}
      {isMobile ? (
        <DndContext
          onDragStart={dragHandlers.onDragStart}
          onDragMove={dragHandlers.onDragMove}
          onDragEnd={dragHandlers.onDragEnd}
          onDragCancel={dragHandlers.onDragCancel}
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
              onGameMode={() => safeOpenModal(MODAL_NAMES.GAME_MODE)}
              onStudyMode={() => safeOpenModal(MODAL_NAMES.STUDY)}
              onTutorial={() => safeOpenModal(MODAL_NAMES.TUTORIAL)}
            />

          <DndContext
            onDragStart={dragHandlers.onDragStart}
            onDragMove={dragHandlers.onDragMove}
            onDragEnd={dragHandlers.onDragEnd}
            onDragCancel={dragHandlers.onDragCancel}
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
                    <span aria-hidden="true">🧩 </span>Departamentos
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
                    aria-hidden="true"
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

      {/* Modals - using useModalOrchestration hook for safe state management */}
      {isModalOpen(MODAL_NAMES.GAME_MODE) && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="animate-pulse text-white text-lg">Cargando modos...</div>
          </div>
        }>
          <GameModeSelector
            onSelectMode={(mode) => {
              try {
                if (mode.type === 'study') {
                  safeCloseModal();
                  safeOpenModal(MODAL_NAMES.STUDY);
                } else {
                  game.setGameMode(mode);
                  safeCloseModal();
                  game.resetGame();
                }
              } catch (error) {
                console.error('GameContainer: Error in onSelectMode:', error);
              }
            }}
            onClose={() => safeCloseModal()}
            userStats={{
              unlockedRegions: new Set(['Insular', 'Pacífica', 'Orinoquía', 'Amazonía', 'Caribe', 'Andina']),
              regionProgress: new Map(
                Array.from(game.regionProgress.entries()).map(([key, value]) => [
                  key,
                  { stars: value.stars, bestTime: value.bestTime, attempts: value.attemptCount }
                ])
              ),
              totalStars: game.totalStars
            }}
          />
        </Suspense>
        )}
        {isModalOpen(MODAL_NAMES.TUTORIAL) && (
          <Suspense fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="animate-pulse text-white text-lg">Cargando tutorial...</div>
            </div>
          }>
            <InteractiveTutorial
              onComplete={() => safeCloseAllModals()}
              onSkip={() => safeCloseAllModals()}
            />
          </Suspense>
        )}
        {isModalOpen(MODAL_NAMES.STUDY) && (
          <Suspense fallback={<StudyModeLoading />}>
            <StudyMode
              onClose={() => safeCloseAllModals()}
              onStartGame={() => {
                safeCloseModal();
                setTransitionConfig({ from: 'study', to: 'game', mode: game.gameMode });
                setShowTransition(true);
                setTimeout(() => game.resetGame(), TIMING.modeTransitionMs);
              }}
              onSelectMode={(mode) => {
                game.setGameMode(mode);
                safeCloseModal();
                setTransitionConfig({ from: 'study', to: 'game', mode });
                setShowTransition(true);
                setTimeout(() => game.resetGame(), TIMING.modeTransitionMs);
              }}
            />
          </Suspense>
        )}
        {isModalOpen(MODAL_NAMES.POST_GAME) && (
          <Suspense fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="animate-pulse text-white text-lg">Cargando reporte...</div>
            </div>
          }>
            <PostGameReport
            onClose={() => safeCloseModal()}
            onPlayAgain={() => {
              safeCloseModal();
              game.resetGame();
            }}
            onStudyMode={() => {
              safeCloseModal();
              safeOpenModal(MODAL_NAMES.STUDY);
              game.resetGame();
            }}
            onSelectMode={(mode) => {
              game.setGameMode(mode);
              safeCloseModal();
              setTransitionConfig({ from: 'complete', to: 'next', mode });
              setShowTransition(true);
              setTimeout(() => game.resetGame(), TIMING.modeTransitionMs);
            }}
          />
          </Suspense>
        )}
    </GameLogicErrorBoundary>
  );
}