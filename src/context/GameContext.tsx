import React, { createContext, useContext, ReactNode } from 'react';
import { create } from 'zustand';
import { Department, colombiaDepartments } from '../data/colombiaDepartments';
import { GameModeConfig } from '../components/GameModeSelector';

interface RegionProgress {
  attemptCount: number;
  bestTime: number;
  bestAccuracy: number;
  stars: 0 | 1 | 2 | 3;
  unlockedAt?: Date;
}

interface GameState {
  // Game state
  departments: Department[];
  placedDepartments: Set<string>;
  currentDepartment: Department | null;
  score: number;
  attempts: number;
  hints: number;
  isGameComplete: boolean;
  startTime: number | null;
  elapsedTime: number;
  isPaused: boolean;
  isGameStarted: boolean;

  // Regional mode state
  gameMode: GameModeConfig;
  activeDepartments: Department[];
  regionProgress: Map<string, RegionProgress>;
  totalStars: number;

  // Actions
  placeDepartment: (departmentId: string, correct: boolean) => void;
  selectDepartment: (department: Department) => void;
  clearCurrentDepartment: () => void;
  useHint: () => void;
  deductPoints: (points: number) => void;
  resetGame: () => void;
  updateElapsedTime: (time: number) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;

  // Regional mode actions
  setGameMode: (mode: GameModeConfig) => void;
  updateRegionProgress: (region: string, progress: Partial<RegionProgress>) => void;
  getFilteredDepartments: () => Department[];
}

const useGameStore = create<GameState>((set, get) => ({
  departments: colombiaDepartments,
  placedDepartments: new Set(),
  currentDepartment: null,
  score: 0,
  attempts: 0,
  hints: 3,
  isGameComplete: false,
  startTime: null,
  elapsedTime: 0,
  isPaused: false,
  isGameStarted: false,

  // Regional mode state initialization
  gameMode: { type: 'full' },
  activeDepartments: colombiaDepartments,
  regionProgress: new Map(),
  totalStars: 0,

  placeDepartment: (departmentId: string, correct: boolean) => {
    set((state) => {
      const newPlaced = new Set(state.placedDepartments);

      if (correct) {
        newPlaced.add(departmentId);
        const newScore = state.score + Math.max(100 - state.attempts * 10, 10);
        // Check completion against active departments, not all departments
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
        currentDepartment: null  // Clear current department after incorrect placement too
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
      currentDepartment: null
    });
  },

  useHint: () => {
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
    set({
      placedDepartments: new Set(),
      currentDepartment: null,
      score: 0,
      attempts: 0,
      hints: 3,
      isGameComplete: false,
      startTime: null,
      elapsedTime: 0,
      isPaused: false,
      isGameStarted: false
    });
  },

  updateElapsedTime: (time: number) => {
    set({ elapsedTime: time });
  },

  startGame: () => {
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

  // Regional mode actions
  setGameMode: (mode: GameModeConfig) => {
    const state = get();
    let activeDepartments: Department[];

    if (mode.type === 'full') {
      activeDepartments = colombiaDepartments;
    } else if (mode.type === 'region' && mode.selectedRegions) {
      // Filter departments by selected regions
      activeDepartments = colombiaDepartments.filter(dept =>
        mode.selectedRegions!.some(region =>
          dept.region === region ||
          (region === 'Pacífica' && dept.region === 'Pacífico') ||
          (region === 'Pacífico' && dept.region === 'Pacífica')
        )
      );
    } else if (mode.type === 'progression') {
      // Start with easiest region for progression mode
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
      hints: mode.type === 'progression' ? 5 : 3, // More hints for learning mode
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

      // Calculate total stars
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

interface GameContextType {
  gameState: GameState;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const gameState = useGameStore();

  return (
    <GameContext.Provider value={{ gameState }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context.gameState;
}