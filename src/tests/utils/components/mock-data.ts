/**
 * Mock data generators for component testing
 * Provides factory functions for creating test data with sensible defaults
 */

export interface MockDepartment {
  id: string;
  name: string;
  capital: string;
  region: string;
  population: number;
}

export interface MockGameState {
  score: number;
  hintsUsed: number;
  correctPlacements: number;
  timeElapsed: number;
  isComplete: boolean;
}

export interface MockUser {
  id: string;
  email: string;
  displayName: string;
}

/**
 * Creates a mock department with optional overrides
 *
 * @param overrides - Partial department properties to override defaults
 * @returns Complete mock department object
 *
 * @example
 * ```typescript
 * const dept = mockDepartment({ name: 'Bogotá D.C.' });
 * ```
 */
export const mockDepartment = (overrides: Partial<MockDepartment> = {}): MockDepartment => ({
  id: 'dept-1',
  name: 'Antioquia',
  capital: 'Medellín',
  region: 'Andina',
  population: 6407102,
  ...overrides,
});

/**
 * Creates a mock game state with optional overrides
 *
 * @param overrides - Partial game state properties to override defaults
 * @returns Complete mock game state object
 *
 * @example
 * ```typescript
 * const state = mockGameState({ score: 100, isComplete: true });
 * ```
 */
export const mockGameState = (overrides: Partial<MockGameState> = {}): MockGameState => ({
  score: 0,
  hintsUsed: 0,
  correctPlacements: 0,
  timeElapsed: 0,
  isComplete: false,
  ...overrides,
});

/**
 * Creates a mock user with optional overrides
 *
 * @param overrides - Partial user properties to override defaults
 * @returns Complete mock user object
 *
 * @example
 * ```typescript
 * const user = mockUser({ displayName: 'John Doe' });
 * ```
 */
export const mockUser = (overrides: Partial<MockUser> = {}): MockUser => ({
  id: 'user-1',
  email: 'test@example.com',
  displayName: 'Test User',
  ...overrides,
});
