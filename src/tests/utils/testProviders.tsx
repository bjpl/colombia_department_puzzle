/**
 * Test Utilities - Mock Providers for Testing
 *
 * CONCEPT: Reusable test utilities for wrapping components with required contexts
 * WHY: GameContext and AccessibilityContext are required by many components
 * PATTERN: Higher-order component pattern for test providers
 */

import React, { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { create } from 'zustand';
import { Department, colombiaDepartments } from '../../data/colombiaDepartments';
import { GameModeConfig } from '../../components/feedback/GameModeSelector';

// Mock GameContext types (matching real implementation)
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

// Mock AccessibilityContext types
interface AccessibilityState {
  colorMode: 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  fontSize: 'small' | 'medium' | 'large';

  setColorMode: (mode: AccessibilityState['colorMode']) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleScreenReaderMode: () => void;
  setFontSize: (size: AccessibilityState['fontSize']) => void;
  getRegionColor: (region: string) => string;
}

// Create mock Zustand store for GameContext
export function createMockGameStore(initialState?: Partial<GameState>) {
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
          return {
            placedDepartments: newPlaced,
            score: state.score + 100,
            currentDepartment: null,
            isGameComplete: newPlaced.size === state.activeDepartments.length,
          };
        }
        return { attempts: state.attempts + 1, currentDepartment: null };
      });
    },

    selectDepartment: (department: Department) => {
      const state = get();
      if (!state.isGameStarted) {
        set({ isGameStarted: true, startTime: Date.now() });
      }
      set({ currentDepartment: department });
    },

    clearCurrentDepartment: () => set({ currentDepartment: null, isDraggingDepartment: false }),
    setIsDragging: (isDragging: boolean) => set({ isDraggingDepartment: isDragging }),
    consumeHint: () => set((state) => ({ hints: Math.max(0, state.hints - 1), score: Math.max(0, state.score - 50) })),
    deductPoints: (points: number) => set((state) => ({ score: Math.max(0, state.score - points) })),

    resetGame: () => set({
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
    }),

    updateElapsedTime: (time: number) => set({ elapsedTime: time }),
    startGame: () => set({ isGameStarted: true, startTime: Date.now() }),
    pauseGame: () => set({ isPaused: true }),
    resumeGame: () => set({ isPaused: false }),
    setGameMode: (mode: GameModeConfig) => set({ gameMode: mode }),
    updateRegionProgress: (region: string, progress: Partial<RegionProgress>) => {
      const state = get();
      const newProgress = new Map(state.regionProgress);
      const existing = newProgress.get(region) || { attemptCount: 0, bestTime: 0, bestAccuracy: 0, stars: 0 };
      newProgress.set(region, { ...existing, ...progress });
      set({ regionProgress: newProgress });
    },
    getFilteredDepartments: () => {
      const state = get();
      if (state.gameMode.type === 'full') return state.departments;
      if (state.gameMode.type === 'region' && state.gameMode.selectedRegions) {
        return state.departments.filter(d => state.gameMode.selectedRegions?.includes(d.region));
      }
      return state.departments;
    },
  }));
}

// Create mock AccessibilityContext store
export function createMockAccessibilityStore(initialState?: Partial<AccessibilityState>) {
  return create<AccessibilityState>((set) => ({
    colorMode: 'default',
    highContrast: false,
    reducedMotion: false,
    screenReaderMode: false,
    fontSize: 'medium',
    ...initialState,

    setColorMode: (mode) => set({ colorMode: mode }),
    toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
    toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
    toggleScreenReaderMode: () => set((state) => ({ screenReaderMode: !state.screenReaderMode })),
    setFontSize: (size) => set({ fontSize: size }),
    getRegionColor: (region: string) => {
      // Simple color mapping for tests
      const colorMap: Record<string, string> = {
        'Andina': '#3b82f6',
        'Caribe': '#10b981',
        'Pacífico': '#8b5cf6',
        'Orinoquía': '#f59e0b',
        'Amazonía': '#14b8a6',
        'Insular': '#ec4899',
      };
      return colorMap[region] || '#6b7280';
    },
  }));
}

// React Context for tests
const GameContext = React.createContext<GameState | null>(null);
const AccessibilityContext = React.createContext<AccessibilityState | null>(null);

export function GameProvider({ children, store }: { children: ReactNode; store?: ReturnType<typeof createMockGameStore> }) {
  const defaultStore = createMockGameStore();
  const gameStore = store || defaultStore;
  const gameState = gameStore();

  return (
    <GameContext.Provider value={gameState}>
      {children}
    </GameContext.Provider>
  );
}

export function AccessibilityProvider({ children, store }: { children: ReactNode; store?: ReturnType<typeof createMockAccessibilityStore> }) {
  const defaultStore = createMockAccessibilityStore();
  const accessibilityStore = store || defaultStore;
  const accessibilityState = accessibilityStore();

  return (
    <AccessibilityContext.Provider value={accessibilityState}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// Combined provider for components that need both contexts
export function AllProviders({ children, gameStore, accessibilityStore }: {
  children: ReactNode;
  gameStore?: ReturnType<typeof createMockGameStore>;
  accessibilityStore?: ReturnType<typeof createMockAccessibilityStore>;
}) {
  return (
    <GameProvider store={gameStore}>
      <AccessibilityProvider store={accessibilityStore}>
        {children}
      </AccessibilityProvider>
    </GameProvider>
  );
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  gameStore?: ReturnType<typeof createMockGameStore>;
  accessibilityStore?: ReturnType<typeof createMockAccessibilityStore>;
  providerType?: 'game' | 'accessibility' | 'all';
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    gameStore,
    accessibilityStore,
    providerType = 'all',
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  let Wrapper: React.ComponentType<{ children: ReactNode }>;

  if (providerType === 'game') {
    const GameProviderWrapper = ({ children }: { children: ReactNode }) =>
      <GameProvider store={gameStore}>{children}</GameProvider>;
    GameProviderWrapper.displayName = 'GameProviderWrapper';
    Wrapper = GameProviderWrapper;
  } else if (providerType === 'accessibility') {
    const AccessibilityProviderWrapper = ({ children }: { children: ReactNode }) =>
      <AccessibilityProvider store={accessibilityStore}>{children}</AccessibilityProvider>;
    AccessibilityProviderWrapper.displayName = 'AccessibilityProviderWrapper';
    Wrapper = AccessibilityProviderWrapper;
  } else {
    const AllProvidersWrapper = ({ children }: { children: ReactNode }) => (
      <AllProviders gameStore={gameStore} accessibilityStore={accessibilityStore}>
        {children}
      </AllProviders>
    );
    AllProvidersWrapper.displayName = 'AllProvidersWrapper';
    Wrapper = AllProvidersWrapper;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Hook to use mock GameContext in tests
export function useGame() {
  const context = React.useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}

// Hook to use mock AccessibilityContext in tests
export function useAccessibility() {
  const context = React.useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}
