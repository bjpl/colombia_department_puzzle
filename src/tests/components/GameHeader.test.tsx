/**
 * GameHeader Component Tests
 * Tests for game UI header with controls and stats
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameHeader from '../../components/layout/GameHeader';
import {
  renderWithProviders,
  createMockGameStore,
} from '../utils/testProviders';
import * as testProviders from '../utils/testProviders';

// Mock GameContext to use the test provider's useGame
vi.mock('../../context/GameContext', async () => {
  const actual = await vi.importActual<typeof testProviders>('../utils/testProviders');
  return {
    useGame: actual.useGame,
    GameProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// Mock sound manager
vi.mock('../../services/soundManager', () => ({
  useSoundEffect: () => ({
    playSound: vi.fn(),
    setEnabled: vi.fn(),
    settings: { enabled: true },
  }),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Play: () => <div>PlayIcon</div>,
  Pause: () => <div>PauseIcon</div>,
  Volume2: () => <div>Volume2Icon</div>,
  VolumeX: () => <div>VolumeXIcon</div>,
  Lightbulb: () => <div>LightbulbIcon</div>,
  RotateCcw: () => <div>RotateCcwIcon</div>,
  BookOpen: () => <div>BookOpenIcon</div>,
  Settings: () => <div>SettingsIcon</div>,
  HelpCircle: () => <div>HelpCircleIcon</div>,
}));

// Mock AccessibilitySettings component
vi.mock('../../components/AccessibilitySettings', () => ({
  default: () => <button>Accessibility</button>,
}));

describe('GameHeader', () => {
  let gameStore: ReturnType<typeof createMockGameStore>;

  beforeEach(() => {
    gameStore = createMockGameStore({
      score: 1500,
      elapsedTime: 120,
      hints: 2,
      placedDepartments: new Set(['antioquia', 'cundinamarca']),
      attempts: 3,
      isPaused: false,
      gameMode: { type: 'full' },
    });
  });

  describe('Branding', () => {
    it('should render app title', () => {
      renderWithProviders(<GameHeader />, { gameStore });

      expect(
        screen.getByText(/Rompecabezas de Colombia/i)
      ).toBeInTheDocument();
    });

    it('should show Colombia flag emoji', () => {
      renderWithProviders(<GameHeader />, { gameStore });

      expect(screen.getByText('🇨🇴')).toBeInTheDocument();
    });

    it('should display current game mode', () => {
      renderWithProviders(<GameHeader />, { gameStore });

      expect(screen.getByText(/Colombia Completa/i)).toBeInTheDocument();
    });

    it('should display regional mode names', () => {
      const store = createMockGameStore({
        gameMode: {
          type: 'region',
          selectedRegions: ['Andina', 'Caribe'],
        },
      });

      renderWithProviders(<GameHeader />, { gameStore: store });

      expect(screen.getByText(/Andina, Caribe/i)).toBeInTheDocument();
    });
  });

  describe('Stats Display', () => {
    it('should show current score', () => {
      renderWithProviders(<GameHeader />, { gameStore });

      expect(screen.getByText('1500')).toBeInTheDocument();
      expect(screen.getByText(/puntos/i)).toBeInTheDocument();
    });

    it('should show elapsed time', () => {
      renderWithProviders(<GameHeader />, { gameStore });

      expect(screen.getByText('2:00')).toBeInTheDocument(); // 120 seconds
      expect(screen.getByText(/tiempo/i)).toBeInTheDocument();
    });

    it('should format time correctly with padding', () => {
      const store = createMockGameStore({
        elapsedTime: 65, // 1:05
      });

      renderWithProviders(<GameHeader />, { gameStore: store });

      expect(screen.getByText('1:05')).toBeInTheDocument();
    });

    it('should show progress count', () => {
      renderWithProviders(<GameHeader />, { gameStore });

      expect(screen.getByText(/2\/33/i)).toBeInTheDocument(); // 2 placed out of 33
    });

    it('should show attempts count', () => {
      renderWithProviders(<GameHeader />, { gameStore });

      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText(/intentos/i)).toBeInTheDocument();
    });

    it('should show completion percentage', () => {
      renderWithProviders(<GameHeader />, { gameStore });

      const percentage = Math.round((2 / 33) * 100); // 6%
      expect(screen.getByText(`${percentage}%`)).toBeInTheDocument();
    });
  });

  describe('Hints Button', () => {
    it('should render hints button with count', () => {
      renderWithProviders(<GameHeader />, { gameStore });

      const hintsButton = screen.getByTitle(/pistas disponibles/i);
      expect(hintsButton).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // hints count badge
    });

    it('should have proper ARIA label', () => {
      renderWithProviders(<GameHeader />, { gameStore });

      const hintsButton = screen.getByLabelText(/2 pistas disponibles/i);
      expect(hintsButton).toBeInTheDocument();
    });

    it('should show zero hints when all used', () => {
      const store = createMockGameStore({
        hints: 0,
      });

      renderWithProviders(<GameHeader />, { gameStore: store });

      // Use aria-label to find the specific hints button with 0 count
      const hintsButton = screen.getByLabelText(/0 pistas disponibles/i);
      expect(hintsButton).toBeInTheDocument();
    });
  });

  describe('Sound Toggle', () => {
    it('should render sound toggle button', () => {
      renderWithProviders(<GameHeader />, { gameStore });

      const soundButton = screen.getByTitle(/Silenciar/i);
      expect(soundButton).toBeInTheDocument();
    });

    it('should toggle sound on click', async () => {
      const user = userEvent.setup();
      renderWithProviders(<GameHeader />, { gameStore });

      const soundButton = screen.getByTitle(/Silenciar/i);
      await user.click(soundButton);

      // Button should update
      expect(soundButton).toHaveAttribute('aria-pressed');
    });

    it('should have proper ARIA labels', () => {
      renderWithProviders(<GameHeader />, { gameStore });

      const soundButton = screen.getByLabelText(/Silenciar efectos de sonido/i);
      expect(soundButton).toBeInTheDocument();
    });
  });

  describe('Play/Pause Button', () => {
    it('should show pause button when game is running', () => {
      const store = createMockGameStore({
        isGameStarted: true,
        isPaused: false,
      });

      renderWithProviders(<GameHeader />, { gameStore: store });

      const pauseButton = screen.getByLabelText(/Pausar juego/i);
      expect(pauseButton).toBeInTheDocument();
    });

    it('should show play button when game is paused', () => {
      const store = createMockGameStore({
        isGameStarted: true,
        isPaused: true,
      });

      renderWithProviders(<GameHeader />, { gameStore: store });

      const playButton = screen.getByLabelText(/Reanudar juego/i);
      expect(playButton).toBeInTheDocument();
    });

    it('should call pauseGame when pause clicked', async () => {
      const user = userEvent.setup();
      const store = createMockGameStore({
        isGameStarted: true,
        isPaused: false,
      });
      const mockPauseGame = vi.fn();
      store.setState({ pauseGame: mockPauseGame });

      renderWithProviders(<GameHeader />, { gameStore: store });

      const pauseButton = screen.getByLabelText(/Pausar juego/i);
      await user.click(pauseButton);

      expect(mockPauseGame).toHaveBeenCalled();
    });

    it('should call resumeGame when play clicked', async () => {
      const user = userEvent.setup();
      const store = createMockGameStore({
        isGameStarted: true,
        isPaused: true,
      });
      const mockResumeGame = vi.fn();
      store.setState({ resumeGame: mockResumeGame });

      renderWithProviders(<GameHeader />, { gameStore: store });

      const playButton = screen.getByLabelText(/Reanudar juego/i);
      await user.click(playButton);

      expect(mockResumeGame).toHaveBeenCalled();
    });

    it('should start game if not started', async () => {
      const user = userEvent.setup();
      const store = createMockGameStore({
        isGameStarted: false,
        isPaused: false,
      });
      const mockStartGame = vi.fn();
      store.setState({ startGame: mockStartGame });

      renderWithProviders(<GameHeader />, { gameStore: store });

      // When game hasn't started, isPaused is false, so button shows "Pausar juego"
      // But the action will be to start the game instead
      const playPauseButton = screen.getByLabelText(/Pausar juego/i);
      await user.click(playPauseButton);

      expect(mockStartGame).toHaveBeenCalled();
    });
  });

  describe('Action Buttons', () => {
    it('should render reset button', () => {
      renderWithProviders(<GameHeader />, { gameStore });

      const resetButton = screen.getByLabelText(/Reiniciar el juego/i);
      expect(resetButton).toBeInTheDocument();
    });

    it('should call resetGame when reset clicked', async () => {
      const user = userEvent.setup();
      const mockResetGame = vi.fn();
      gameStore.setState({ resetGame: mockResetGame });

      renderWithProviders(<GameHeader />, { gameStore });

      const resetButton = screen.getByLabelText(/Reiniciar el juego/i);
      await user.click(resetButton);

      expect(mockResetGame).toHaveBeenCalled();
    });

    it('should render study mode button when callback provided', () => {
      const mockOnStudyMode = vi.fn();

      renderWithProviders(<GameHeader onStudyMode={mockOnStudyMode} />, {
        gameStore,
      });

      const studyButton = screen.getByLabelText(/Abrir modo de estudio/i);
      expect(studyButton).toBeInTheDocument();
    });

    it('should call onStudyMode when clicked', async () => {
      const user = userEvent.setup();
      const mockOnStudyMode = vi.fn();

      renderWithProviders(<GameHeader onStudyMode={mockOnStudyMode} />, {
        gameStore,
      });

      const studyButton = screen.getByLabelText(/Abrir modo de estudio/i);
      await user.click(studyButton);

      expect(mockOnStudyMode).toHaveBeenCalled();
    });

    it('should render game mode button when callback provided', () => {
      const mockOnGameMode = vi.fn();

      renderWithProviders(<GameHeader onGameMode={mockOnGameMode} />, {
        gameStore,
      });

      const modeButton = screen.getByLabelText(/Cambiar modo de juego/i);
      expect(modeButton).toBeInTheDocument();
    });

    it('should call onGameMode when clicked', async () => {
      const user = userEvent.setup();
      const mockOnGameMode = vi.fn();

      renderWithProviders(<GameHeader onGameMode={mockOnGameMode} />, {
        gameStore,
      });

      const modeButton = screen.getByLabelText(/Cambiar modo de juego/i);
      await user.click(modeButton);

      expect(mockOnGameMode).toHaveBeenCalled();
    });

    it('should render tutorial button when callback provided', () => {
      const mockOnTutorial = vi.fn();

      renderWithProviders(<GameHeader onTutorial={mockOnTutorial} />, {
        gameStore,
      });

      const tutorialButton = screen.getByLabelText(/Ver tutorial interactivo/i);
      expect(tutorialButton).toBeInTheDocument();
    });

    it('should call onTutorial when clicked', async () => {
      const user = userEvent.setup();
      const mockOnTutorial = vi.fn();

      renderWithProviders(<GameHeader onTutorial={mockOnTutorial} />, {
        gameStore,
      });

      const tutorialButton = screen.getByLabelText(/Ver tutorial interactivo/i);
      await user.click(tutorialButton);

      expect(mockOnTutorial).toHaveBeenCalled();
    });
  });

  describe('Progress Bar', () => {
    it('should render progress bar', () => {
      renderWithProviders(<GameHeader />, { gameStore });

      // Progress component renders with proper value
      const progressText = screen.getByText(/completado/i);
      expect(progressText).toBeInTheDocument();
    });

    it('should show correct progress percentage', () => {
      const store = createMockGameStore({
        placedDepartments: new Set(['dept1', 'dept2', 'dept3']),
        activeDepartments: Array(33).fill(null).map((_, i) => ({
          id: `dept${i}`,
          name: `Dept ${i}`,
          region: 'Andina',
          capital: 'City',
          area: 1000,
          population: 100000,
          trivia: 'Test trivia',
          coordinates: { lat: 4.0, lng: -74.0 },
        })),
      });

      renderWithProviders(<GameHeader />, { gameStore: store });

      const percentage = Math.round((3 / 33) * 100); // 9%
      expect(screen.getByText(`${percentage}%`)).toBeInTheDocument();
    });

    it('should update as departments are placed', () => {
      const mockDepts = Array(10).fill(null).map((_, i) => ({
        id: `dept${i}`,
        name: `Dept ${i}`,
        region: 'Andina',
        capital: 'City',
        area: 1000,
        population: 100000,
        trivia: 'Test trivia',
        coordinates: { lat: 4.0, lng: -74.0 },
      }));

      const store = createMockGameStore({
        placedDepartments: new Set(['dept1']),
        activeDepartments: mockDepts,
        departments: mockDepts,
      });

      // Override getFilteredDepartments to return the mock departments
      store.setState({
        getFilteredDepartments: () => mockDepts,
      });

      renderWithProviders(<GameHeader />, { gameStore: store });

      // 1/10 = 10%
      expect(screen.getByText('10%')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have banner role', () => {
      renderWithProviders(<GameHeader />, { gameStore });

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should have proper ARIA label for header', () => {
      renderWithProviders(<GameHeader />, { gameStore });

      const header = screen.getByLabelText(/Panel de control del juego/i);
      expect(header).toBeInTheDocument();
    });

    it('should render accessibility settings component', () => {
      renderWithProviders(<GameHeader />, { gameStore });

      const accessibilityButton = screen.getByText(/Accessibility/i);
      expect(accessibilityButton).toBeInTheDocument();
    });

    it('should have keyboard focusable buttons', async () => {
      const user = userEvent.setup();
      renderWithProviders(<GameHeader />, { gameStore });

      // Tab through buttons
      await user.tab();

      // First focusable button should receive focus
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Paused State', () => {
    it('should show paused indicator when game is paused', () => {
      const store = createMockGameStore({
        isPaused: true,
      });

      renderWithProviders(<GameHeader />, { gameStore: store });

      expect(screen.getByText(/pausado/i)).toBeInTheDocument();
    });

    it('should not show paused when game is running', () => {
      const store = createMockGameStore({
        isPaused: false,
      });

      renderWithProviders(<GameHeader />, { gameStore: store });

      expect(screen.queryByText(/pausado/i)).not.toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should hide text on small screens', () => {
      renderWithProviders(<GameHeader />, { gameStore });

      // "Pista" text should have sm:inline class for responsive hiding
      const hints = screen.getByText(/Pista/i);
      expect(hints).toHaveClass('hidden', 'sm:inline');
    });
  });

  describe('Game Mode Display', () => {
    it('should show progression mode display', () => {
      const store = createMockGameStore({
        gameMode: { type: 'progression' },
      });

      renderWithProviders(<GameHeader />, { gameStore: store });

      expect(screen.getByText(/Modo Aprendizaje/i)).toBeInTheDocument();
    });

    it('should show custom mode for unknown types', () => {
      const store = createMockGameStore({
        gameMode: { type: 'custom' as any },
      });

      renderWithProviders(<GameHeader />, { gameStore: store });

      expect(screen.getByText(/Personalizado/i)).toBeInTheDocument();
    });
  });
});
