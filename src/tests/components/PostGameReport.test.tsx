/**
 * PostGameReport Component Tests
 * Tests for end game summary and achievements
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PostGameReport from '../../components/feedback/PostGameReport';
import { createMockGameStore } from '../utils/testProviders';
import { storage } from '../../services/storage';

// Mock GameContext
const mockUseGame = vi.fn();
vi.mock('../../context/GameContext', () => ({
  useGame: () => mockUseGame(),
}));

// Mock storage
vi.mock('../../services/storage', () => ({
  storage: {
    getActiveProfile: vi.fn(() => ({
      id: 'test-profile',
      name: 'Test User',
      stats: {
        highScore: 2500,
        bestTime: 400,
        gamesPlayed: 5,
      },
    })),
    saveSession: vi.fn(),
    getSessions: vi.fn(() => []),
  },
}));

// Mock NextChallengeRecommender
vi.mock('../../components/NextChallengeRecommender', () => ({
  default: ({ onSelectChallenge, onViewProgress }: any) => (
    <div>
      <button onClick={() => onSelectChallenge({ type: 'region', selectedRegions: ['Andina'] })}>
        Select Challenge
      </button>
      <button onClick={onViewProgress}>View Progress</button>
    </div>
  ),
}));

describe('PostGameReport', () => {
  const mockOnClose = vi.fn();
  const mockOnPlayAgain = vi.fn();
  const mockOnStudyMode = vi.fn();
  const mockOnSelectMode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render game completion message', () => {
      const gameStore = createMockGameStore({
        score: 3000,
        elapsedTime: 250,
        attempts: 5,
        hints: 2,
        placedDepartments: new Set(['antioquia', 'cundinamarca']),
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(screen.getByText(/Juego Completado/i)).toBeInTheDocument();
    });

    it('should display final score', () => {
      const gameStore = createMockGameStore({
        score: 3200,
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(screen.getByText('3200')).toBeInTheDocument();
      expect(screen.getByText(/Puntuación Final/i)).toBeInTheDocument();
    });

    it('should display total time', () => {
      const gameStore = createMockGameStore({
        elapsedTime: 185, // 3:05
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(screen.getByText('3:05')).toBeInTheDocument();
      expect(screen.getByText(/Tiempo Total/i)).toBeInTheDocument();
    });

    it('should display accuracy percentage', () => {
      const gameStore = createMockGameStore({
        placedDepartments: new Set(['antioquia']),
        attempts: 3,
        activeDepartments: [
          {
            id: 'antioquia',
            name: 'Antioquia',
            region: 'Andina',
            capital: 'Medellín',
            area: 63612,
            population: 6677930,
            trivia: 'Test trivia',
            coordinates: { lat: 7.0, lng: -75.5 },
          },
        ],
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      // Accuracy = correct / (attempts + correct)
      expect(screen.getByText(/Precisión/i)).toBeInTheDocument();
    });

    it('should display hints used', () => {
      const gameStore = createMockGameStore({
        hints: 1, // Started with 3, used 2
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText(/Pistas Usadas/i)).toBeInTheDocument();
    });
  });

  describe('Achievements', () => {
    it('should show Perfect achievement when no mistakes', () => {
      const gameStore = createMockGameStore({
        attempts: 0,
        placedDepartments: new Set(['antioquia', 'cundinamarca']),
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(screen.getByText(/Perfecto/i)).toBeInTheDocument();
      expect(screen.getByText(/Completa sin errores/i)).toBeInTheDocument();
    });

    it('should show No Hints achievement when no hints used', () => {
      const gameStore = createMockGameStore({
        hints: 3, // No hints used
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(screen.getByText(/Sin Ayuda/i)).toBeInTheDocument();
    });

    it('should show Speedrun achievement for fast completion', () => {
      const gameStore = createMockGameStore({
        elapsedTime: 250, // Under 300 seconds (5 minutes)
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(screen.getByText(/Velocista/i)).toBeInTheDocument();
    });

    it('should show Master achievement for high score', () => {
      const gameStore = createMockGameStore({
        score: 3500, // Over 3000
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(screen.getByText(/Maestro/i)).toBeInTheDocument();
    });

    it('should not show achievements section when none earned', () => {
      const gameStore = createMockGameStore({
        score: 1000,
        elapsedTime: 500,
        attempts: 5,
        hints: 1,
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(screen.queryByText(/Logros Obtenidos/i)).not.toBeInTheDocument();
    });
  });

  describe('Records', () => {
    it('should show new high score badge', () => {
      const gameStore = createMockGameStore({
        score: 3000, // Higher than mock profile's 2500
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(screen.getByText(/¡NUEVO!/i)).toBeInTheDocument();
    });

    it('should show new best time badge', () => {
      const gameStore = createMockGameStore({
        elapsedTime: 300, // Better than mock profile's 400
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(screen.getByText(/¡RÉCORD!/i)).toBeInTheDocument();
    });
  });

  describe('Detailed Statistics', () => {
    it('should show departments placed correctly', () => {
      const gameStore = createMockGameStore({
        placedDepartments: new Set(['antioquia', 'cundinamarca']),
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(screen.getByText(/Departamentos Correctos:/i)).toBeInTheDocument();
      expect(screen.getByText(/2\/33/)).toBeInTheDocument();
    });

    it('should show failed attempts', () => {
      const gameStore = createMockGameStore({
        attempts: 12,
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(screen.getByText(/Intentos Fallidos:/i)).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('should calculate average time per department', () => {
      const gameStore = createMockGameStore({
        elapsedTime: 330, // 330 seconds / 33 departments = 10 seconds
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
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(screen.getByText(/Tiempo Promedio\/Depto:/i)).toBeInTheDocument();
    });
  });

  describe('Performance Summary', () => {
    it('should show excellent message for high accuracy', () => {
      const gameStore = createMockGameStore({
        placedDepartments: new Set(['antioquia', 'cundinamarca']),
        attempts: 0, // 100% accuracy
        activeDepartments: [
          {
            id: 'antioquia',
            name: 'Antioquia',
            region: 'Andina',
            capital: 'Medellín',
            area: 63612,
            population: 6677930,
            trivia: 'Test trivia',
            coordinates: { lat: 7.0, lng: -75.5 },
          },
          {
            id: 'cundinamarca',
            name: 'Cundinamarca',
            region: 'Andina',
            capital: 'Bogotá',
            area: 24210,
            population: 3000000,
            trivia: 'Test trivia',
            coordinates: { lat: 5.0, lng: -74.0 },
          },
        ],
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(screen.getByText(/Excelente trabajo/i)).toBeInTheDocument();
    });

    it('should show practice message for medium accuracy', () => {
      const gameStore = createMockGameStore({
        placedDepartments: new Set(['antioquia']),
        attempts: 5, // Lower accuracy
        activeDepartments: [
          {
            id: 'antioquia',
            name: 'Antioquia',
            region: 'Andina',
            capital: 'Medellín',
            area: 63612,
            population: 6677930,
            trivia: 'Test trivia',
            coordinates: { lat: 7.0, lng: -75.5 },
          },
        ],
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(screen.getByText(/Sigue practicando/i)).toBeInTheDocument();
    });

    it('should show speed bonus message for fast completion', () => {
      const gameStore = createMockGameStore({
        elapsedTime: 150, // Under 180 seconds
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(screen.getByText(/Increíble velocidad/i)).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('should have Play Again button', () => {
      const gameStore = createMockGameStore();
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(
        screen.getByRole('button', { name: /Jugar de Nuevo/i })
      ).toBeInTheDocument();
    });

    it('should call onPlayAgain when clicked', async () => {
      const user = userEvent.setup();
      const gameStore = createMockGameStore();
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      const button = screen.getByRole('button', { name: /Jugar de Nuevo/i });
      await user.click(button);

      expect(mockOnPlayAgain).toHaveBeenCalledTimes(1);
    });

    it('should have Study Mode button', () => {
      const gameStore = createMockGameStore();
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(
        screen.getByRole('button', { name: /Modo Estudio/i })
      ).toBeInTheDocument();
    });

    it('should call onStudyMode when clicked', async () => {
      const user = userEvent.setup();
      const gameStore = createMockGameStore();
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      const button = screen.getByRole('button', { name: /Modo Estudio/i });
      await user.click(button);

      expect(mockOnStudyMode).toHaveBeenCalledTimes(1);
    });

    it('should have Close button', () => {
      const gameStore = createMockGameStore();
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(screen.getByText('✕')).toBeInTheDocument();
    });

    it('should call onClose when close button clicked', async () => {
      const user = userEvent.setup();
      const gameStore = createMockGameStore();
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      const button = screen.getByRole('button', { name: '✕' });
      await user.click(button);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Challenge Recommendations', () => {
    it('should show recommendations when onSelectMode provided', () => {
      const gameStore = createMockGameStore();
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
          onSelectMode={mockOnSelectMode}
        />
      );

      expect(screen.getByText(/Select Challenge/i)).toBeInTheDocument();
    });

    it('should hide recommendations when View Progress clicked', async () => {
      const user = userEvent.setup();
      const gameStore = createMockGameStore();
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
          onSelectMode={mockOnSelectMode}
        />
      );

      const viewProgressButton = screen.getByText(/View Progress/i);
      await user.click(viewProgressButton);

      // Recommendations should be hidden
      expect(screen.queryByText(/Select Challenge/i)).not.toBeInTheDocument();
    });
  });

  describe('Session Persistence', () => {
    it('should save game session on mount', () => {
      const gameStore = createMockGameStore({
        score: 2800,
        elapsedTime: 300,
        placedDepartments: new Set(['antioquia']),
        hints: 2,
        attempts: 5,
        startTime: Date.now() - 300000,
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      expect(storage.saveSession).toHaveBeenCalled();
    });
  });

  describe('Score Color Coding', () => {
    it('should use green for high scores', () => {
      const gameStore = createMockGameStore({
        score: 3500,
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      const scoreElement = screen.getByText('3500');
      expect(scoreElement).toHaveClass('text-green-600');
    });

    it('should use yellow for medium scores', () => {
      const gameStore = createMockGameStore({
        score: 2200,
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      const scoreElement = screen.getByText('2200');
      expect(scoreElement).toHaveClass('text-yellow-600');
    });

    it('should use gray for low scores', () => {
      const gameStore = createMockGameStore({
        score: 1500,
      });
      mockUseGame.mockReturnValue(gameStore.getState());

      render(
        <PostGameReport
          onClose={mockOnClose}
          onPlayAgain={mockOnPlayAgain}
          onStudyMode={mockOnStudyMode}
        />
      );

      const scoreElement = screen.getByText('1500');
      expect(scoreElement).toHaveClass('text-gray-600');
    });
  });
});
