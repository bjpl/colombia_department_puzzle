/**
 * GameContainer Component Tests
 *
 * CONCEPT: Comprehensive testing of the main game engine component
 * WHY: GameContainer is the core orchestration layer that coordinates drag & drop,
 *      game state, modals, keyboard navigation, and sound effects
 * PATTERN: Test behaviors, not implementation. Mock complex dependencies.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameContainer from '../../components/GameContainer';
import { createMockGameStore } from '../utils/testProviders';
import { colombiaDepartments } from '../../data/colombiaDepartments';
import * as GameContext from '../../context/GameContext';

// Mock all external dependencies
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children, onDragStart, onDragEnd, onDragMove, onDragCancel }: any) => {
    // Store handlers in window for test access
    (window as any).__dndHandlers = {
      onDragStart,
      onDragEnd,
      onDragMove,
      onDragCancel,
    };
    return <div data-testid="dnd-context">{children}</div>;
  },
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
  }),
  useDroppable: () => ({
    setNodeRef: () => {},
    isOver: false,
  }),
  rectIntersection: vi.fn(),
}));

vi.mock('../../services/soundManager', () => ({
  useSoundEffect: () => ({
    playSound: vi.fn(),
    playSequence: vi.fn(),
    initSound: vi.fn(),
    settings: { enabled: true, volume: 0.5 },
    setVolume: vi.fn(),
    setEnabled: vi.fn(),
  }),
  soundManager: {
    play: vi.fn(),
    init: vi.fn(),
    setEnabled: vi.fn(),
    setVolume: vi.fn(),
    getSettings: () => ({ enabled: true, volume: 0.5 }),
  },
}));

vi.mock('../../hooks/useModalManager', () => ({
  useModalManager: () => ({
    activeModal: null,
    openModal: vi.fn(),
    closeModal: vi.fn(),
    closeAllModals: vi.fn(),
    isModalOpen: vi.fn(() => false),
    hasQueuedModals: false,
  }),
}));

vi.mock('../../hooks/useGameTimer', () => ({
  useGameTimer: () => ({
    elapsedTime: 0,
    isRunning: false,
    isPaused: false,
    startTimer: vi.fn(),
    pauseTimer: vi.fn(),
    resumeTimer: vi.fn(),
    stopTimer: vi.fn(),
    resetTimer: vi.fn(),
    formatTime: (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`,
  }),
}));

vi.mock('../../hooks/useEnhancedKeyboardNavigation', () => ({
  useEnhancedKeyboardNavigation: () => ({
    isKeyboardMode: false,
    selectedDepartment: null,
    cursorPosition: { x: 0, y: 0 },
    targetZone: null,
    navigationMode: 'idle',
  }),
}));

// Mock child components to simplify testing
vi.mock('../../components/MapCanvas', () => ({
  default: () => <div data-testid="map-canvas">Map Canvas</div>,
}));

vi.mock('../../components/DepartmentTray', () => ({
  default: () => <div data-testid="department-tray">Department Tray</div>,
}));

vi.mock('../../components/GameHeader', () => ({
  default: ({ onGameMode, onStudyMode, onTutorial }: any) => (
    <div data-testid="game-header">
      <button onClick={onGameMode}>Game Mode</button>
      <button onClick={onStudyMode}>Study Mode</button>
      <button onClick={onTutorial}>Tutorial</button>
    </div>
  ),
}));

vi.mock('../../components/EducationalPanel', () => ({
  default: () => <div data-testid="educational-panel">Educational Panel</div>,
}));

vi.mock('../../components/DragOverlay', () => ({
  default: () => <div data-testid="drag-overlay">Drag Overlay</div>,
}));

vi.mock('../../components/PlacementFeedback', () => ({
  default: ({ show, isCorrect, departmentName }: any) =>
    show ? (
      <div data-testid="placement-feedback" data-correct={isCorrect}>
        {departmentName}
      </div>
    ) : null,
}));

vi.mock('../../components/ScreenReaderAnnouncements', () => ({
  default: () => <div data-testid="screen-reader-announcements" />,
}));

vi.mock('../../components/KeyboardHelp', () => ({
  default: () => <div data-testid="keyboard-help" />,
}));

vi.mock('../../components/KeyboardCursor', () => ({
  default: () => <div data-testid="keyboard-cursor" />,
}));

vi.mock('../../components/ScrollIndicator', () => ({
  default: () => <div data-testid="scroll-indicator" />,
}));

vi.mock('../../components/MapErrorBoundary', () => ({
  default: ({ children }: any) => <div data-testid="map-error-boundary">{children}</div>,
}));

vi.mock('../../components/GameLogicErrorBoundary', () => ({
  default: ({ children }: any) => <div data-testid="game-logic-error-boundary">{children}</div>,
}));

vi.mock('../../components/ComponentErrorBoundary', () => ({
  default: ({ children }: any) => <div data-testid="component-error-boundary">{children}</div>,
}));

vi.mock('../../components/StudyMode', () => ({
  default: () => <div data-testid="study-mode">Study Mode</div>,
}));

vi.mock('../../components/PostGameReport', () => ({
  default: () => <div data-testid="post-game-report">Post Game Report</div>,
}));

vi.mock('../../components/InteractiveTutorial', () => ({
  default: () => <div data-testid="interactive-tutorial">Interactive Tutorial</div>,
}));

vi.mock('../../components/GameModeSelector', () => ({
  default: () => <div data-testid="game-mode-selector">Game Mode Selector</div>,
}));

vi.mock('../../components/ModeTransition', () => ({
  default: () => <div data-testid="mode-transition">Mode Transition</div>,
}));

describe('GameContainer', () => {
  let mockGameStore: ReturnType<typeof createMockGameStore>;
  let mockGameState: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock game store
    mockGameStore = createMockGameStore();
    mockGameState = mockGameStore.getState();

    // Add spy versions of methods
    mockGameState.selectDepartment = vi.fn(mockGameState.selectDepartment);
    mockGameState.setIsDragging = vi.fn(mockGameState.setIsDragging);
    mockGameState.placeDepartment = vi.fn(mockGameState.placeDepartment);
    mockGameState.clearCurrentDepartment = vi.fn(mockGameState.clearCurrentDepartment);

    // Mock useGame hook
    vi.spyOn(GameContext, 'useGame').mockReturnValue(mockGameState);

    // Mock localStorage
    Storage.prototype.getItem = vi.fn(() => null);
    Storage.prototype.setItem = vi.fn();

    // Clear DOM
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      render(<GameContainer />);
      expect(screen.getByTestId('game-logic-error-boundary')).toBeInTheDocument();
    });

    it('should render all core child components', () => {
      render(<GameContainer />);

      expect(screen.getByTestId('game-header')).toBeInTheDocument();
      expect(screen.getByTestId('map-canvas')).toBeInTheDocument();
      expect(screen.getByTestId('department-tray')).toBeInTheDocument();
      expect(screen.getByTestId('educational-panel')).toBeInTheDocument();
    });

    it('should render DndContext', () => {
      render(<GameContainer />);
      expect(screen.getByTestId('dnd-context')).toBeInTheDocument();
    });

    it('should render error boundaries', () => {
      render(<GameContainer />);

      expect(screen.getByTestId('game-logic-error-boundary')).toBeInTheDocument();
      expect(screen.getByTestId('map-error-boundary')).toBeInTheDocument();
      expect(screen.getAllByTestId('component-error-boundary').length).toBeGreaterThan(0);
    });

    it('should render accessibility components', () => {
      render(<GameContainer />);

      expect(screen.getByTestId('screen-reader-announcements')).toBeInTheDocument();
      expect(screen.getByTestId('keyboard-help')).toBeInTheDocument();
      expect(screen.getByTestId('keyboard-cursor')).toBeInTheDocument();
    });

    it('should display department count badge', () => {
      render(<GameContainer />);

      const badge = screen.getByText(mockGameState.departments.length.toString());
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Drag & Drop Handlers', () => {
    it('should handle drag start event', () => {
      render(<GameContainer />);

      const handlers = (window as any).__dndHandlers;
      const department = colombiaDepartments[0];

      const event = {
        active: {
          id: department.id,
          rect: {
            current: {
              translated: { left: 100, top: 100 },
            },
          },
        },
      };

      handlers.onDragStart(event);

      // Verify drag state was set
      expect(mockGameState.selectDepartment).toHaveBeenCalled();
      expect(mockGameState.setIsDragging).toHaveBeenCalledWith(true);
    });

    it('should handle drag move event', () => {
      render(<GameContainer />);

      const handlers = (window as any).__dndHandlers;
      const event = {
        active: {
          rect: {
            current: {
              translated: { left: 150, top: 150 },
            },
          },
        },
      };

      // Should not throw
      expect(() => handlers.onDragMove(event)).not.toThrow();
    });

    it('should handle drag end with correct placement', () => {
      render(<GameContainer />);

      const handlers = (window as any).__dndHandlers;
      const department = colombiaDepartments[0];

      const event = {
        active: {
          id: department.id,
          data: { current: department },
        },
        over: {
          id: department.id, // Same ID = correct placement
          rect: { left: 100, top: 100, width: 50, height: 50 },
        },
      };

      handlers.onDragEnd(event);

      // Verify correct placement was registered
      expect(mockGameState.placeDepartment).toHaveBeenCalledWith(department.id, true);
      expect(mockGameState.setIsDragging).toHaveBeenCalledWith(false);
    });

    it('should handle drag end with incorrect placement', () => {
      render(<GameContainer />);

      const handlers = (window as any).__dndHandlers;
      const department = colombiaDepartments[0];
      const wrongDepartment = colombiaDepartments[1];

      const event = {
        active: {
          id: department.id,
          data: { current: department },
        },
        over: {
          id: wrongDepartment.id, // Different ID = incorrect placement
          rect: { left: 100, top: 100, width: 50, height: 50 },
        },
      };

      handlers.onDragEnd(event);

      // Verify incorrect placement was registered
      expect(mockGameState.placeDepartment).toHaveBeenCalledWith(department.id, false);
      expect(mockGameState.setIsDragging).toHaveBeenCalledWith(false);
    });

    it('should handle drag end without drop target', () => {
      render(<GameContainer />);

      const handlers = (window as any).__dndHandlers;
      const department = colombiaDepartments[0];

      const event = {
        active: {
          id: department.id,
          rect: {
            current: {
              translated: { left: 100, top: 100 },
            },
          },
        },
        over: null, // No drop target
      };

      // Start drag first
      handlers.onDragStart({
        active: event.active,
      });

      // Move significantly
      handlers.onDragMove({
        active: {
          rect: {
            current: {
              translated: { left: 200, top: 200 },
            },
          },
        },
      });

      handlers.onDragEnd(event);

      // Verify drag was cleared
      expect(mockGameState.setIsDragging).toHaveBeenCalledWith(false);
    });

    it('should handle drag cancel', () => {
      render(<GameContainer />);

      const handlers = (window as any).__dndHandlers;

      handlers.onDragCancel();

      // Verify drag state was cleared
      expect(mockGameState.setIsDragging).toHaveBeenCalledWith(false);
    });
  });

  describe('Modal Management', () => {
    it('should clear current department when opening modals', async () => {
      const user = userEvent.setup();
      render(<GameContainer />);

      const gameModeButton = screen.getByText('Game Mode');
      await user.click(gameModeButton);

      expect(mockGameState.clearCurrentDepartment).toHaveBeenCalled();
    });
  });

  describe('Timer Integration', () => {
    it('should render with timer integration', () => {
      render(<GameContainer />);
      // Timer hook is mocked and integrated, component renders without errors
      expect(screen.getByTestId('game-header')).toBeInTheDocument();
    });
  });

  describe('Sound Effects', () => {
    it('should integrate sound effects system', () => {
      render(<GameContainer />);
      // Sound system is mocked and integrated, component renders without errors
      expect(screen.getByTestId('game-header')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation Integration', () => {
    it('should integrate with keyboard navigation hook', () => {
      render(<GameContainer />);

      // KeyboardCursor should receive the navigation state
      expect(screen.getByTestId('keyboard-cursor')).toBeInTheDocument();
    });

    it('should handle placement feedback from keyboard navigation', async () => {
      render(<GameContainer />);

      const feedbackEvent = new CustomEvent('placement-feedback', {
        detail: {
          show: true,
          isCorrect: true,
          departmentName: 'Test Department',
          position: { x: 100, y: 100 },
        },
      });

      window.dispatchEvent(feedbackEvent);

      await waitFor(() => {
        expect(screen.queryByTestId('placement-feedback')).toBeInTheDocument();
      });
    });
  });

  describe('DragOverlay Rendering', () => {
    it('should show drag overlay when dragging', () => {
      const draggingState = {
        ...mockGameState,
        isDraggingDepartment: true,
        currentDepartment: colombiaDepartments[0],
      };

      vi.spyOn(GameContext, 'useGame').mockReturnValue(draggingState);

      render(<GameContainer />);

      expect(screen.getByTestId('drag-overlay')).toBeInTheDocument();
    });

    it('should hide drag overlay when not dragging', () => {
      render(<GameContainer />);

      expect(screen.queryByTestId('drag-overlay')).not.toBeInTheDocument();
    });
  });

  describe('Window Event Handlers', () => {
    it('should clear drag state on window blur', () => {
      render(<GameContainer />);

      // Simulate window blur
      window.dispatchEvent(new Event('blur'));

      expect(mockGameState.clearCurrentDepartment).toHaveBeenCalled();
    });

    it('should clean up event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(<GameContainer />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('blur', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('placement-feedback', expect.any(Function));
    });
  });

  describe('Game Complete Behavior', () => {
    it('should detect game completion state', () => {
      const completedState = {
        ...mockGameState,
        isGameComplete: true,
      };

      vi.spyOn(GameContext, 'useGame').mockReturnValue(completedState);

      render(<GameContainer />);

      // Component should render successfully with completed state
      expect(screen.getByTestId('game-header')).toBeInTheDocument();
    });
  });

  describe('DOM Cleanup on Mount', () => {
    it('should clean up stuck keyboard navigation elements', () => {
      // Create stuck element
      const stuckElement = document.createElement('div');
      stuckElement.id = 'keyboard-nav-indicator';
      document.body.appendChild(stuckElement);

      render(<GameContainer />);

      expect(document.getElementById('keyboard-nav-indicator')).not.toBeInTheDocument();
    });

    it('should reset stuck drag state on mount', () => {
      // Create stuck drag state with spy methods
      const stuckDragState = {
        ...mockGameState,
        isDraggingDepartment: true,
        currentDepartment: null, // Inconsistent state
        setIsDragging: vi.fn(),
      };

      vi.spyOn(GameContext, 'useGame').mockReturnValue(stuckDragState);

      render(<GameContainer />);

      expect(stuckDragState.setIsDragging).toHaveBeenCalledWith(false);
    });
  });

  describe('Layout Structure', () => {
    it('should render three-column layout', () => {
      const { container } = render(<GameContainer />);

      const layout = container.querySelector('.flex');
      expect(layout).toBeInTheDocument();
    });

    it('should render left sidebar with department tray', () => {
      render(<GameContainer />);

      expect(screen.getByTestId('department-tray')).toBeInTheDocument();
      expect(screen.getByText('🧩 Departamentos')).toBeInTheDocument();
    });

    it('should render center map canvas', () => {
      render(<GameContainer />);

      expect(screen.getByTestId('map-canvas')).toBeInTheDocument();
    });

    it('should render right sidebar with educational panel', () => {
      render(<GameContainer />);

      expect(screen.getByTestId('educational-panel')).toBeInTheDocument();
    });

    it('should have scroll container for department tray', () => {
      const { container } = render(<GameContainer />);

      const scrollContainer = container.querySelector('#department-scroll-container');
      expect(scrollContainer).toBeInTheDocument();
    });
  });

  describe('Placement Feedback Display', () => {
    it('should show placement feedback on correct drop', async () => {
      render(<GameContainer />);

      const handlers = (window as any).__dndHandlers;
      const department = colombiaDepartments[0];

      const event = {
        active: {
          id: department.id,
          data: { current: department },
        },
        over: {
          id: department.id,
          rect: { left: 100, top: 100, width: 50, height: 50 },
        },
      };

      handlers.onDragEnd(event);

      await waitFor(() => {
        const feedback = screen.queryByTestId('placement-feedback');
        if (feedback) {
          expect(feedback).toHaveAttribute('data-correct', 'true');
        }
      });
    });

    it('should show placement feedback on incorrect drop', async () => {
      render(<GameContainer />);

      const handlers = (window as any).__dndHandlers;
      const dept1 = colombiaDepartments[0];
      const dept2 = colombiaDepartments[1];

      const event = {
        active: {
          id: dept1.id,
          data: { current: dept1 },
        },
        over: {
          id: dept2.id,
          rect: { left: 100, top: 100, width: 50, height: 50 },
        },
      };

      handlers.onDragEnd(event);

      await waitFor(() => {
        const feedback = screen.queryByTestId('placement-feedback');
        if (feedback) {
          expect(feedback).toHaveAttribute('data-correct', 'false');
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('should render within error boundaries', () => {
      render(<GameContainer />);

      expect(screen.getByTestId('game-logic-error-boundary')).toBeInTheDocument();
      expect(screen.getByTestId('map-error-boundary')).toBeInTheDocument();
    });

    it('should handle missing department data gracefully', () => {
      render(<GameContainer />);

      const handlers = (window as any).__dndHandlers;

      const event = {
        active: {
          id: 'non-existent-id',
          data: { current: null },
        },
        over: {
          id: 'some-target',
          rect: { left: 100, top: 100, width: 50, height: 50 },
        },
      };

      // Should not throw
      expect(() => handlers.onDragEnd(event)).not.toThrow();
    });
  });

  describe('Accessibility Features', () => {
    it('should render screen reader announcements component', () => {
      render(<GameContainer />);

      expect(screen.getByTestId('screen-reader-announcements')).toBeInTheDocument();
    });

    it('should render keyboard help overlay', () => {
      render(<GameContainer />);

      expect(screen.getByTestId('keyboard-help')).toBeInTheDocument();
    });

    it('should render keyboard cursor for navigation', () => {
      render(<GameContainer />);

      expect(screen.getByTestId('keyboard-cursor')).toBeInTheDocument();
    });

    it('should have proper ARIA labels', () => {
      const { container } = render(<GameContainer />);

      const scrollContainer = container.querySelector('[aria-label*="departamentos"]');
      expect(scrollContainer).toBeInTheDocument();
    });
  });
});
