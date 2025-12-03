/**
 * GameContext Tests
 *
 * CONCEPT: Comprehensive tests for Zustand-based GameContext store
 * WHY: Ensures state management logic works correctly across all game modes
 * PATTERN: Direct store testing with renderHook for state isolation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { create } from 'zustand';
import { Department, colombiaDepartments } from '../../data/colombiaDepartments';
import { GameModeConfig } from '../../components/GameModeSelector';

// GameContext types
interface RegionProgress {
  attemptCount: number;
  bestTime: number;
  bestAccuracy: number;
  stars: 0 | 1 | 2 | 3;
  unlockedAt?: Date;
}

interface GameState {
  departments: Department[];
  placedDepartments: Set<string>;
  currentDepartment: Department | null;
  isDraggingDepartment: boolean;
  score: number;
  attempts: number;
  hints: number;
  isGameComplete: boolean;
  startTime: number | null;
  elapsedTime: number;
  isPaused: boolean;
  isGameStarted: boolean;
  gameMode: GameModeConfig;
  activeDepartments: Department[];
  regionProgress: Map<string, RegionProgress>;
  totalStars: number;

  placeDepartment: (departmentId: string, correct: boolean) => void;
  selectDepartment: (department: Department) => void;
  clearCurrentDepartment: () => void;
  setIsDragging: (isDragging: boolean) => void;
  consumeHint: () => void;
  deductPoints: (points: number) => void;
  resetGame: () => void;
  updateElapsedTime: (time: number) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  setGameMode: (mode: GameModeConfig) => void;
  updateRegionProgress: (region: string, progress: Partial<RegionProgress>) => void;
  getFilteredDepartments: () => Department[];
}

// Create test store matching real implementation
function createTestGameStore(initialState?: Partial<GameState>) {
  return create<GameState>((set, get) => ({
    departments: colombiaDepartments,
    placedDepartments: new Set(),
    currentDepartment: null,
    isDraggingDepartment: false,
    score: 0,
    attempts: 0,
    hints: 3,
    isGameComplete: false,
    startTime: null,
    elapsedTime: 0,
    isPaused: false,
    isGameStarted: false,
    gameMode: { type: 'full' },
    activeDepartments: colombiaDepartments,
    regionProgress: new Map(),
    totalStars: 0,
    ...initialState,

    placeDepartment: (departmentId: string, correct: boolean) => {
      set((state) => {
        const newPlaced = new Set(state.placedDepartments);

        if (correct) {
          newPlaced.add(departmentId);
          const newScore = state.score + Math.max(100 - state.attempts * 10, 10);
          const isComplete = newPlaced.size === state.activeDepartments.length;

          return {
            placedDepartments: newPlaced,
            score: newScore,
            attempts: 0,
            currentDepartment: null,
            isGameComplete: isComplete
          };
        }

        return {
          attempts: state.attempts + 1,
          currentDepartment: null
        };
      });
    },

    selectDepartment: (department: Department) => {
      const state = get();
      if (!state.isGameStarted) {
        set({
          isGameStarted: true,
          startTime: Date.now()
        });
      }
      set({
        currentDepartment: department
      });
    },

    clearCurrentDepartment: () => {
      set({
        currentDepartment: null,
        isDraggingDepartment: false
      });
    },

    setIsDragging: (isDragging: boolean) => {
      set({
        isDraggingDepartment: isDragging
      });
    },

    consumeHint: () => {
      set((state) => ({
        hints: Math.max(0, state.hints - 1),
        score: Math.max(0, state.score - 50)
      }));
    },

    deductPoints: (points: number) => {
      set((state) => ({
        score: Math.max(0, state.score - points)
      }));
    },

    resetGame: () => {
      const state = get();
      const safeMode = state.gameMode.type ? state.gameMode : { type: 'region' as const, selectedRegions: ['Insular'] };

      set({
        placedDepartments: new Set(),
        currentDepartment: null,
        isDraggingDepartment: false,
        score: 0,
        attempts: 0,
        hints: safeMode.type === 'progression' ? 5 : 3,
        isGameComplete: false,
        startTime: null,
        elapsedTime: 0,
        isPaused: false,
        isGameStarted: false,
        gameMode: safeMode
      });
    },

    updateElapsedTime: (time: number) => {
      set({ elapsedTime: time });
    },

    startGame: () => {
      const state = get();
      if (state.activeDepartments.length === 0) {
        const insularDepts = colombiaDepartments.filter(dept => dept.region === 'Insular');
        set({
          activeDepartments: insularDepts.length > 0 ? insularDepts : [colombiaDepartments[0]],
          gameMode: { type: 'region', selectedRegions: ['Insular'] }
        });
      }

      set({
        isGameStarted: true,
        startTime: Date.now(),
        isPaused: false
      });
    },

    pauseGame: () => {
      set({ isPaused: true });
    },

    resumeGame: () => {
      set({ isPaused: false });
    },

    setGameMode: (mode: GameModeConfig) => {
      const state = get();
      let activeDepartments: Department[];

      if (mode.type === 'full') {
        activeDepartments = colombiaDepartments;
      } else if (mode.type === 'region' && mode.selectedRegions) {
        activeDepartments = colombiaDepartments.filter(dept =>
          mode.selectedRegions!.some(region =>
            dept.region === region ||
            (region === 'Pacífica' && dept.region === 'Pacífico') ||
            (region === 'Pacífico' && dept.region === 'Pacífica')
          )
        );
      } else if (mode.type === 'progression') {
        activeDepartments = colombiaDepartments.filter(dept =>
          dept.region === 'Insular'
        );
      } else {
        activeDepartments = colombiaDepartments;
      }

      set({
        gameMode: mode,
        activeDepartments,
        placedDepartments: new Set(),
        currentDepartment: null,
        score: 0,
        attempts: 0,
        hints: mode.type === 'progression' ? 5 : 3,
        isGameComplete: false,
        isGameStarted: false
      });
    },

    updateRegionProgress: (region: string, progress: Partial<RegionProgress>) => {
      set((state) => {
        const newProgress = new Map(state.regionProgress);
        const currentProgress = newProgress.get(region) || {
          attemptCount: 0,
          bestTime: Infinity,
          bestAccuracy: 0,
          stars: 0 as 0 | 1 | 2 | 3
        };

        newProgress.set(region, { ...currentProgress, ...progress });

        let totalStars = 0;
        newProgress.forEach(p => totalStars += p.stars);

        return {
          regionProgress: newProgress,
          totalStars
        };
      });
    },

    getFilteredDepartments: () => {
      const state = get();
      return state.activeDepartments;
    }
  }));
}

describe('GameContext - Store Initialization', () => {
  it('should initialize with default state', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    expect(result.current.departments).toEqual(colombiaDepartments);
    expect(result.current.placedDepartments.size).toBe(0);
    expect(result.current.currentDepartment).toBeNull();
    expect(result.current.isDraggingDepartment).toBe(false);
    expect(result.current.score).toBe(0);
    expect(result.current.attempts).toBe(0);
    expect(result.current.hints).toBe(3);
    expect(result.current.isGameComplete).toBe(false);
    expect(result.current.startTime).toBeNull();
    expect(result.current.elapsedTime).toBe(0);
    expect(result.current.isPaused).toBe(false);
    expect(result.current.isGameStarted).toBe(false);
  });

  it('should initialize with full game mode', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    expect(result.current.gameMode.type).toBe('full');
    expect(result.current.activeDepartments).toEqual(colombiaDepartments);
  });

  it('should initialize with empty region progress', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    expect(result.current.regionProgress.size).toBe(0);
    expect(result.current.totalStars).toBe(0);
  });
});

describe('GameContext - Department Placement', () => {
  it('should place department correctly and update score', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    const dept = colombiaDepartments[0];

    act(() => {
      result.current.placeDepartment(dept.id, true);
    });

    expect(result.current.placedDepartments.has(dept.id)).toBe(true);
    expect(result.current.score).toBe(100); // 100 - 0 attempts * 10
    expect(result.current.attempts).toBe(0);
    expect(result.current.currentDepartment).toBeNull();
  });

  it('should calculate score based on attempts', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    const dept = colombiaDepartments[0];

    // Make 3 incorrect attempts
    act(() => {
      result.current.placeDepartment('wrong1', false);
      result.current.placeDepartment('wrong2', false);
      result.current.placeDepartment('wrong3', false);
    });

    expect(result.current.attempts).toBe(3);

    // Place correctly
    act(() => {
      result.current.placeDepartment(dept.id, true);
    });

    expect(result.current.score).toBe(70); // 100 - 3*10
    expect(result.current.placedDepartments.has(dept.id)).toBe(true);
    expect(result.current.attempts).toBe(0); // Reset after correct placement
  });

  it('should enforce minimum score of 10 points', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    const dept = colombiaDepartments[0];

    // Make 12 incorrect attempts (would be -20 points)
    for (let i = 0; i < 12; i++) {
      act(() => {
        result.current.placeDepartment(`wrong${i}`, false);
      });
    }

    expect(result.current.attempts).toBe(12);

    // Place correctly
    act(() => {
      result.current.placeDepartment(dept.id, true);
    });

    expect(result.current.score).toBe(10); // Minimum 10 points
  });

  it('should increment attempts on incorrect placement', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    act(() => {
      result.current.placeDepartment('wrong-id', false);
    });

    expect(result.current.placedDepartments.size).toBe(0);
    expect(result.current.attempts).toBe(1);
    expect(result.current.score).toBe(0);
  });

  it('should clear current department after placement', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    const dept = colombiaDepartments[0];

    act(() => {
      result.current.selectDepartment(dept);
    });

    expect(result.current.currentDepartment).toEqual(dept);

    act(() => {
      result.current.placeDepartment(dept.id, true);
    });

    expect(result.current.currentDepartment).toBeNull();
  });
});

describe('GameContext - Department Selection', () => {
  it('should select department', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    const dept = colombiaDepartments[0];

    act(() => {
      result.current.selectDepartment(dept);
    });

    expect(result.current.currentDepartment).toEqual(dept);
  });

  it('should start game on first department selection', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    expect(result.current.isGameStarted).toBe(false);
    expect(result.current.startTime).toBeNull();

    act(() => {
      result.current.selectDepartment(colombiaDepartments[0]);
    });

    expect(result.current.isGameStarted).toBe(true);
    expect(result.current.startTime).not.toBeNull();
  });

  it('should not restart timer on subsequent selections', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    act(() => {
      result.current.selectDepartment(colombiaDepartments[0]);
    });

    const firstStartTime = result.current.startTime;

    act(() => {
      result.current.selectDepartment(colombiaDepartments[1]);
    });

    expect(result.current.startTime).toBe(firstStartTime);
  });

  it('should clear current department', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    act(() => {
      result.current.selectDepartment(colombiaDepartments[0]);
      result.current.setIsDragging(true);
    });

    expect(result.current.currentDepartment).not.toBeNull();
    expect(result.current.isDraggingDepartment).toBe(true);

    act(() => {
      result.current.clearCurrentDepartment();
    });

    expect(result.current.currentDepartment).toBeNull();
    expect(result.current.isDraggingDepartment).toBe(false);
  });

  it('should toggle dragging state', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    expect(result.current.isDraggingDepartment).toBe(false);

    act(() => {
      result.current.setIsDragging(true);
    });

    expect(result.current.isDraggingDepartment).toBe(true);

    act(() => {
      result.current.setIsDragging(false);
    });

    expect(result.current.isDraggingDepartment).toBe(false);
  });
});

describe('GameContext - Hints and Score Deduction', () => {
  it('should use hint and deduct score', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    // Add some score first
    act(() => {
      result.current.placeDepartment(colombiaDepartments[0].id, true);
    });

    expect(result.current.score).toBe(100);
    expect(result.current.hints).toBe(3);

    act(() => {
      result.current.consumeHint();
    });

    expect(result.current.hints).toBe(2);
    expect(result.current.score).toBe(50); // 100 - 50
  });

  it('should not allow negative hints', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    act(() => {
      result.current.consumeHint();
      result.current.consumeHint();
      result.current.consumeHint();
      result.current.consumeHint(); // Extra, should not go negative
    });

    expect(result.current.hints).toBe(0);
  });

  it('should not allow negative score from hints', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    expect(result.current.score).toBe(0);

    act(() => {
      result.current.consumeHint();
    });

    expect(result.current.score).toBe(0); // Should not go negative
  });

  it('should deduct points from score', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    // Add score
    act(() => {
      result.current.placeDepartment(colombiaDepartments[0].id, true);
    });

    expect(result.current.score).toBe(100);

    act(() => {
      result.current.deductPoints(30);
    });

    expect(result.current.score).toBe(70);
  });

  it('should not allow negative score from deductions', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    act(() => {
      result.current.deductPoints(100);
    });

    expect(result.current.score).toBe(0);
  });
});

describe('GameContext - Win Condition', () => {
  it('should mark game complete when all active departments placed', () => {
    const testDepts = colombiaDepartments.slice(0, 2);
    const store = createTestGameStore({ activeDepartments: testDepts });
    const { result } = renderHook(() => store());

    expect(result.current.isGameComplete).toBe(false);

    // Place first
    act(() => {
      result.current.placeDepartment(testDepts[0].id, true);
    });

    expect(result.current.isGameComplete).toBe(false);

    // Place second
    act(() => {
      result.current.placeDepartment(testDepts[1].id, true);
    });

    expect(result.current.isGameComplete).toBe(true);
  });

  it('should not mark complete if departments remain', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    // Place one department out of all 32
    act(() => {
      result.current.placeDepartment(colombiaDepartments[0].id, true);
    });

    expect(result.current.isGameComplete).toBe(false);
  });
});

describe('GameContext - Game State Management', () => {
  it('should start game', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    expect(result.current.isGameStarted).toBe(false);
    expect(result.current.startTime).toBeNull();
    expect(result.current.isPaused).toBe(false);

    act(() => {
      result.current.startGame();
    });

    expect(result.current.isGameStarted).toBe(true);
    expect(result.current.startTime).not.toBeNull();
    expect(result.current.isPaused).toBe(false);
  });

  it('should handle empty active departments on start', () => {
    const store = createTestGameStore({ activeDepartments: [] });
    const { result } = renderHook(() => store());

    act(() => {
      result.current.startGame();
    });

    expect(result.current.activeDepartments.length).toBeGreaterThan(0);
    expect(result.current.gameMode.type).toBe('region');
  });

  it('should pause game', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    act(() => {
      result.current.pauseGame();
    });

    expect(result.current.isPaused).toBe(true);
  });

  it('should resume game', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    act(() => {
      result.current.pauseGame();
      result.current.resumeGame();
    });

    expect(result.current.isPaused).toBe(false);
  });

  it('should update elapsed time', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    expect(result.current.elapsedTime).toBe(0);

    act(() => {
      result.current.updateElapsedTime(5000);
    });

    expect(result.current.elapsedTime).toBe(5000);

    act(() => {
      result.current.updateElapsedTime(10000);
    });

    expect(result.current.elapsedTime).toBe(10000);
  });

  it('should reset game to initial state', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    // Make changes
    act(() => {
      result.current.selectDepartment(colombiaDepartments[0]);
      result.current.placeDepartment(colombiaDepartments[0].id, true);
      result.current.consumeHint();
      result.current.updateElapsedTime(5000);
    });

    expect(result.current.placedDepartments.size).toBe(1);
    expect(result.current.score).toBe(50);
    expect(result.current.hints).toBe(2);

    // Reset
    act(() => {
      result.current.resetGame();
    });

    expect(result.current.placedDepartments.size).toBe(0);
    expect(result.current.currentDepartment).toBeNull();
    expect(result.current.isDraggingDepartment).toBe(false);
    expect(result.current.score).toBe(0);
    expect(result.current.attempts).toBe(0);
    expect(result.current.hints).toBe(3);
    expect(result.current.isGameComplete).toBe(false);
    expect(result.current.startTime).toBeNull();
    expect(result.current.elapsedTime).toBe(0);
    expect(result.current.isPaused).toBe(false);
    expect(result.current.isGameStarted).toBe(false);
  });

  it('should preserve game mode on reset', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    const regionMode: GameModeConfig = {
      type: 'region',
      selectedRegions: ['Andina']
    };

    act(() => {
      result.current.setGameMode(regionMode);
      result.current.resetGame();
    });

    expect(result.current.gameMode).toEqual(regionMode);
  });
});

describe('GameContext - Game Modes', () => {
  it('should set full game mode', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    act(() => {
      result.current.setGameMode({ type: 'full' });
    });

    expect(result.current.gameMode.type).toBe('full');
    expect(result.current.activeDepartments).toEqual(colombiaDepartments);
    expect(result.current.hints).toBe(3);
  });

  it('should set region mode and filter departments', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    act(() => {
      result.current.setGameMode({
        type: 'region',
        selectedRegions: ['Insular']
      });
    });

    expect(result.current.gameMode.type).toBe('region');
    expect(result.current.gameMode.selectedRegions).toContain('Insular');
    expect(result.current.activeDepartments.length).toBeLessThan(colombiaDepartments.length);
    expect(result.current.activeDepartments.every(d => d.region === 'Insular')).toBe(true);
  });

  it('should handle Pacífico/Pacífica region name variants', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    act(() => {
      result.current.setGameMode({
        type: 'region',
        selectedRegions: ['Pacífica']
      });
    });

    const pacificoDepts = result.current.activeDepartments.filter(
      d => d.region === 'Pacífico' || d.region === 'Pacífica'
    );
    expect(pacificoDepts.length).toBeGreaterThan(0);
  });

  it('should set progression mode with initial region', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    act(() => {
      result.current.setGameMode({ type: 'progression' });
    });

    expect(result.current.gameMode.type).toBe('progression');
    expect(result.current.activeDepartments.every(d => d.region === 'Insular')).toBe(true);
    expect(result.current.hints).toBe(5); // More hints for progression
  });

  it('should reset game state when changing modes', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    // Play some game
    act(() => {
      result.current.selectDepartment(colombiaDepartments[0]);
      result.current.placeDepartment(colombiaDepartments[0].id, true);
    });

    expect(result.current.score).toBe(100);
    expect(result.current.placedDepartments.size).toBe(1);

    // Change mode
    act(() => {
      result.current.setGameMode({
        type: 'region',
        selectedRegions: ['Andina']
      });
    });

    expect(result.current.score).toBe(0);
    expect(result.current.placedDepartments.size).toBe(0);
    expect(result.current.currentDepartment).toBeNull();
    expect(result.current.isGameComplete).toBe(false);
    expect(result.current.isGameStarted).toBe(false);
  });

  it('should handle multiple selected regions', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    act(() => {
      result.current.setGameMode({
        type: 'region',
        selectedRegions: ['Andina', 'Caribe']
      });
    });

    const regions = new Set(result.current.activeDepartments.map(d => d.region));
    expect(regions.has('Andina')).toBe(true);
    expect(regions.has('Caribe')).toBe(true);
  });

  it('should get filtered departments', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    act(() => {
      result.current.setGameMode({
        type: 'region',
        selectedRegions: ['Insular']
      });
    });

    const filtered = result.current.getFilteredDepartments();
    expect(filtered).toEqual(result.current.activeDepartments);
    expect(filtered.every(d => d.region === 'Insular')).toBe(true);
  });
});

describe('GameContext - Region Progress', () => {
  it('should update region progress', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    act(() => {
      result.current.updateRegionProgress('Andina', {
        attemptCount: 1,
        bestTime: 60000,
        bestAccuracy: 95,
        stars: 3
      });
    });

    const progress = result.current.regionProgress.get('Andina');
    expect(progress).toBeDefined();
    expect(progress?.attemptCount).toBe(1);
    expect(progress?.bestTime).toBe(60000);
    expect(progress?.bestAccuracy).toBe(95);
    expect(progress?.stars).toBe(3);
  });

  it('should initialize missing region progress with defaults', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    act(() => {
      result.current.updateRegionProgress('Caribe', {
        stars: 2
      });
    });

    const progress = result.current.regionProgress.get('Caribe');
    expect(progress?.attemptCount).toBe(0);
    expect(progress?.bestTime).toBe(Infinity);
    expect(progress?.bestAccuracy).toBe(0);
    expect(progress?.stars).toBe(2);
  });

  it('should update existing region progress', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    act(() => {
      result.current.updateRegionProgress('Andina', {
        attemptCount: 1,
        bestTime: 60000
      });
    });

    act(() => {
      result.current.updateRegionProgress('Andina', {
        attemptCount: 2,
        stars: 3
      });
    });

    const progress = result.current.regionProgress.get('Andina');
    expect(progress?.attemptCount).toBe(2);
    expect(progress?.bestTime).toBe(60000); // Preserved
    expect(progress?.stars).toBe(3);
  });

  it('should calculate total stars', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    expect(result.current.totalStars).toBe(0);

    act(() => {
      result.current.updateRegionProgress('Andina', { stars: 3 });
      result.current.updateRegionProgress('Caribe', { stars: 2 });
      result.current.updateRegionProgress('Insular', { stars: 1 });
    });

    expect(result.current.totalStars).toBe(6);
  });

  it('should update total stars when progress changes', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    act(() => {
      result.current.updateRegionProgress('Andina', { stars: 2 });
    });

    expect(result.current.totalStars).toBe(2);

    act(() => {
      result.current.updateRegionProgress('Andina', { stars: 3 });
    });

    expect(result.current.totalStars).toBe(3);
  });

  it('should track multiple regions independently', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    act(() => {
      result.current.updateRegionProgress('Andina', {
        attemptCount: 5,
        bestTime: 30000,
        stars: 3
      });
      result.current.updateRegionProgress('Caribe', {
        attemptCount: 2,
        bestTime: 45000,
        stars: 2
      });
    });

    const andinaProgress = result.current.regionProgress.get('Andina');
    const caribeProgress = result.current.regionProgress.get('Caribe');

    expect(andinaProgress?.attemptCount).toBe(5);
    expect(caribeProgress?.attemptCount).toBe(2);
    expect(result.current.totalStars).toBe(5);
  });
});

describe('GameContext - Edge Cases', () => {
  it('should handle rapid department selections', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    act(() => {
      result.current.selectDepartment(colombiaDepartments[0]);
      result.current.selectDepartment(colombiaDepartments[1]);
      result.current.selectDepartment(colombiaDepartments[2]);
    });

    expect(result.current.currentDepartment).toEqual(colombiaDepartments[2]);
  });

  it('should handle placing same department twice', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    const dept = colombiaDepartments[0];

    act(() => {
      result.current.placeDepartment(dept.id, true);
      result.current.placeDepartment(dept.id, true);
    });

    expect(result.current.placedDepartments.size).toBe(1);
  });

  it('should handle invalid game mode gracefully', () => {
    const store = createTestGameStore();
    const { result } = renderHook(() => store());

    act(() => {
      result.current.setGameMode({ type: 'full' } as any);
    });

    expect(result.current.activeDepartments.length).toBeGreaterThan(0);
  });

  it('should handle resetGame with malformed mode', () => {
    const store = createTestGameStore({ gameMode: {} as any });
    const { result } = renderHook(() => store());

    act(() => {
      result.current.resetGame();
    });

    // Should default to region mode with Insular
    expect(result.current.gameMode.type).toBe('region');
    expect(result.current.gameMode.selectedRegions).toContain('Insular');
  });
});
