/**
 * Test fixtures for component testing
 * Provides static test data for Colombia geography and game entities
 */

export interface Department {
  id: string;
  name: string;
  region: string;
}

/**
 * Sample Colombian departments for testing
 * Includes representatives from each region
 */
export const DEPARTMENTS: Department[] = [
  { id: 'antioquia', name: 'Antioquia', region: 'Andina' },
  { id: 'cundinamarca', name: 'Cundinamarca', region: 'Andina' },
  { id: 'atlantico', name: 'Atlántico', region: 'Caribe' },
  { id: 'bolivar', name: 'Bolívar', region: 'Caribe' },
  { id: 'valle', name: 'Valle del Cauca', region: 'Pacífico' },
  { id: 'choco', name: 'Chocó', region: 'Pacífico' },
  { id: 'meta', name: 'Meta', region: 'Orinoquía' },
  { id: 'casanare', name: 'Casanare', region: 'Orinoquía' },
  { id: 'amazonas', name: 'Amazonas', region: 'Amazonía' },
  { id: 'vaupes', name: 'Vaupés', region: 'Amazonía' },
  { id: 'sanandres', name: 'San Andrés y Providencia', region: 'Insular' },
];

/**
 * Colombian geographic regions
 */
export const REGIONS = [
  'Andina',
  'Caribe',
  'Pacífico',
  'Orinoquía',
  'Amazonía',
  'Insular',
] as const;

export type Region = typeof REGIONS[number];

/**
 * Sample game difficulty levels
 */
export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;

export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];

/**
 * Sample game modes
 */
export const GAME_MODES = ['practice', 'timed', 'challenge'] as const;

export type GameMode = typeof GAME_MODES[number];
