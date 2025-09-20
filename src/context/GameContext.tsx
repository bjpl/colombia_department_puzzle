import React, { createContext, useContext, ReactNode } from 'react';
import { create } from 'zustand';
import { Department, colombiaDepartments } from '../data/colombiaDepartments';

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

  placeDepartment: (departmentId: string, correct: boolean) => {
    set((state) => {
      const newPlaced = new Set(state.placedDepartments);

      if (correct) {
        newPlaced.add(departmentId);
        const newScore = state.score + Math.max(100 - state.attempts * 10, 10);
        const isComplete = newPlaced.size === colombiaDepartments.length;

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