import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { colombiaDepartments } from '../../data/colombiaDepartments';
import { createMockGameStore } from '../utils/testProviders';

/**
 * Game Flow Integration Tests
 *
 * CONCEPT: End-to-end tests for complete game workflows
 * WHY: Ensures all game mechanics work together correctly
 * PATTERN: Integration testing with mock Zustand store
 */

describe('Game Flow Integration', () => {
  let gameStore: ReturnType<typeof createMockGameStore>;

  beforeEach(() => {
    gameStore = createMockGameStore();
  });

  describe('Complete Game Session', () => {
    it('should complete a full game flow', () => {
      const { result: game } = renderHook(() => gameStore());

      // Initial state
      expect(game.current.score).toBe(0);
      expect(game.current.placedDepartments.size).toBe(0);
      expect(game.current.isGameComplete).toBe(false);
      expect(game.current.hints).toBe(3);

      // Select first department
      const firstDept = colombiaDepartments[0];
      act(() => {
        game.current.selectDepartment(firstDept);
      });

      expect(game.current.currentDepartment).toEqual(firstDept);
      expect(game.current.isGameStarted).toBe(true);

      // Place correctly
      act(() => {
        game.current.placeDepartment(firstDept.id, true);
      });

      expect(game.current.placedDepartments.has(firstDept.id)).toBe(true);
      expect(game.current.score).toBe(100);
      expect(game.current.currentDepartment).toBeNull();
    });

    it('should handle incorrect placements', () => {
      const { result: game } = renderHook(() => gameStore());

      const dept = colombiaDepartments[0];
      act(() => {
        game.current.selectDepartment(dept);
      });

      // Place incorrectly
      act(() => {
        game.current.placeDepartment('wrong-id', false);
      });

      expect(game.current.placedDepartments.size).toBe(0);
      expect(game.current.attempts).toBe(1);
      expect(game.current.score).toBe(0);
    });

    it('should use hints and deduct points', () => {
      const { result: game } = renderHook(() => gameStore());

      act(() => {
        game.current.selectDepartment(colombiaDepartments[0]);
        game.current.placeDepartment(colombiaDepartments[0].id, true);
      });

      const initialScore = game.current.score;
      const initialHints = game.current.hints;

      act(() => {
        game.current.consumeHint();
      });

      expect(game.current.hints).toBe(initialHints - 1);
      expect(game.current.score).toBe(initialScore - 50);
    });
  });

  describe('Game State Management', () => {
    it('should handle start/pause/resume flow', () => {
      const { result: game } = renderHook(() => gameStore());

      expect(game.current.isGameStarted).toBe(false);
      expect(game.current.isPaused).toBe(false);

      act(() => {
        game.current.startGame();
      });

      expect(game.current.isGameStarted).toBe(true);

      act(() => {
        game.current.pauseGame();
      });

      expect(game.current.isPaused).toBe(true);

      act(() => {
        game.current.resumeGame();
      });

      expect(game.current.isPaused).toBe(false);
    });

    it('should reset game to initial state', () => {
      const { result: game } = renderHook(() => gameStore());

      // Make some changes
      act(() => {
        game.current.selectDepartment(colombiaDepartments[0]);
        game.current.placeDepartment(colombiaDepartments[0].id, true);
        game.current.consumeHint();
      });

      expect(game.current.placedDepartments.size).toBe(1);
      expect(game.current.score).toBe(50); // 100 - 50 from hint

      // Reset
      act(() => {
        game.current.resetGame();
      });

      expect(game.current.placedDepartments.size).toBe(0);
      expect(game.current.score).toBe(0);
      expect(game.current.hints).toBe(3);
      expect(game.current.currentDepartment).toBeNull();
      expect(game.current.isGameComplete).toBe(false);
    });
  });

  describe('Game Mode Configuration', () => {
    it('should switch between game modes', () => {
      const { result: game } = renderHook(() => gameStore());

      // Start with full mode
      expect(game.current.gameMode.type).toBe('full');

      // Switch to region mode
      act(() => {
        game.current.setGameMode({
          type: 'region',
          selectedRegions: ['Andina'],
        });
      });

      expect(game.current.gameMode.type).toBe('region');
      expect(game.current.gameMode.selectedRegions).toContain('Andina');
    });

    it('should filter departments by selected region', () => {
      const { result: game } = renderHook(() => gameStore());

      act(() => {
        game.current.setGameMode({
          type: 'region',
          selectedRegions: ['Insular'],
        });
      });

      const filtered = game.current.getFilteredDepartments();
      expect(filtered.every(d => d.region === 'Insular')).toBe(true);
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.length).toBeLessThan(colombiaDepartments.length);
    });
  });

  describe('Win Condition', () => {
    it('should mark game as complete when all departments placed', () => {
      // Create a small test scenario with only 2 departments
      const testStore = createMockGameStore({
        activeDepartments: colombiaDepartments.slice(0, 2),
      });

      const { result: game } = renderHook(() => testStore());

      expect(game.current.isGameComplete).toBe(false);

      // Place first department
      act(() => {
        game.current.selectDepartment(game.current.activeDepartments[0]);
        game.current.placeDepartment(game.current.activeDepartments[0].id, true);
      });

      expect(game.current.isGameComplete).toBe(false);

      // Place second department
      act(() => {
        game.current.selectDepartment(game.current.activeDepartments[1]);
        game.current.placeDepartment(game.current.activeDepartments[1].id, true);
      });

      expect(game.current.isGameComplete).toBe(true);
    });
  });

  describe('Score Calculation', () => {
    it('should calculate score based on attempts', () => {
      const { result: game } = renderHook(() => gameStore());

      const dept = colombiaDepartments[0];

      // Place correctly on first try
      act(() => {
        game.current.selectDepartment(dept);
        game.current.placeDepartment(dept.id, true);
      });

      expect(game.current.score).toBe(100); // Base score, 0 attempts

      // Next department with some attempts
      const dept2 = colombiaDepartments[1];
      act(() => {
        game.current.selectDepartment(dept2);
      });

      // Make 3 incorrect attempts
      act(() => {
        game.current.placeDepartment('wrong1', false);
        game.current.selectDepartment(dept2);
        game.current.placeDepartment('wrong2', false);
        game.current.selectDepartment(dept2);
        game.current.placeDepartment('wrong3', false);
      });

      expect(game.current.attempts).toBe(3);

      // Now place correctly
      act(() => {
        game.current.selectDepartment(dept2);
        game.current.placeDepartment(dept2.id, true);
      });

      // Score should be 100 + (100 - 3*10) = 170
      expect(game.current.score).toBeGreaterThan(100);
    });
  });
});
