/**
 * Type definitions for the Colombian Spanish translations system
 * Ensures type safety when using translations throughout the application
 */

export type Locale = 'es-CO' | 'es-ES' | 'en-US';

export type RegionKey = 'Insular' | 'Pacífica' | 'Orinoquía' | 'Amazonía' | 'Caribe' | 'Andina';

export type DifficultyKey = 'easy' | 'medium' | 'hard' | 'expert';

export type GameModeType = 'full' | 'region' | 'study' | 'progression';

export type HintLevel = 1 | 2 | 3;

export interface ColombianDepartment {
  name: string;
  capital: string;
  region: RegionKey;
  area: number;
  population: number;
  trivia: string;
}

export interface RegionInfo {
  id: RegionKey;
  name: string;
  departments: number;
  difficulty: DifficultyKey;
  color: string;
  unlockRequirement: number;
  description?: string;
}

export interface GameStats {
  score: number;
  attempts: number;
  placedDepartments: number;
  totalDepartments: number;
  elapsedTime: number;
  hintsUsed: number;
  accuracy: number;
}

export interface TranslationParams {
  [key: string]: string | number;
}

export interface CulturalAdaptation {
  departmentName: string;
  culturalNote: string;
  alternativeNames?: string[];
  pronunciation?: string;
  culturalSignificance?: string;
}

// Colombian Spanish specific types
export interface ColombianExpressions {
  greeting: string;
  encouragement: string;
  celebration: string;
  instruction: string;
}

export interface GeographicTerminology {
  coast: 'Pacífico' | 'Caribe' | 'Atlántico';
  region: RegionKey;
  climate: 'tropical' | 'templado' | 'frío' | 'páramo';
  terrain: 'montaña' | 'llano' | 'selva' | 'costa' | 'isla';
}

// Translation utility types
export type TranslationFunction = (key: string, params?: TranslationParams) => string;

export type PluralizationFunction = (count: number, singular: string, plural: string) => string;

export type NumberFormatter = (num: number) => string;

// Component-specific translation interfaces
export interface GameModeTranslations {
  title: string;
  subtitle: string;
  modes: {
    full: {
      title: string;
      description: string;
      badge: string;
    };
    regions: {
      title: string;
      description: string;
      badge: string;
      recommended: string;
    };
    study: {
      title: string;
      description: string;
      badge: string;
    };
  };
}

export interface HintSystemTranslations {
  levels: {
    [K in HintLevel]: {
      title: string;
      description: string;
      cost: string;
    };
  };
  geographic: {
    coastTypes: Record<string, string>;
    borderCountries: Record<string, string>;
    characteristics: Record<string, string>;
  };
}

export interface FeedbackTranslations {
  positive: string[];
  negative: string[];
  neutral: string[];
  completion: string[];
  encouragement: string[];
}

// Error handling types
export interface ErrorTranslations {
  gameErrors: Record<string, string>;
  validationErrors: Record<string, string>;
  networkErrors: Record<string, string>;
  browserErrors: Record<string, string>;
}

// Accessibility types
export interface AccessibilityTranslations {
  ariaLabels: Record<string, string>;
  roleDescriptions: Record<string, string>;
  instructions: Record<string, string>;
  statusMessages: Record<string, string>;
}

// Colombian cultural context types
export interface CulturalContext {
  expressions: {
    agreement: string[];
    disagreement: string[];
    surprise: string[];
    encouragement: string[];
  };
  greetings: {
    formal: string[];
    informal: string[];
    timeOfDay: Record<string, string>;
  };
  regionalVariations: {
    [region in RegionKey]: {
      accent?: string;
      commonExpressions: string[];
      culturalNotes: string[];
    };
  };
}

// Game progression types
export interface ProgressionTranslations {
  levels: {
    beginner: string;
    intermediate: string;
    advanced: string;
    expert: string;
  };
  achievements: {
    [key: string]: {
      title: string;
      description: string;
      congratulation: string;
    };
  };
}

// Educational content types
export interface EducationalTranslations {
  departmentFacts: Record<string, string[]>;
  historicalContext: Record<string, string>;
  geographicalFeatures: Record<string, string>;
  culturalHighlights: Record<string, string>;
}

// Time and measurement formatting types
export interface MeasurementFormatting {
  distance: (km: number) => string;
  area: (km2: number) => string;
  population: (count: number) => string;
  time: (seconds: number) => string;
  percentage: (value: number) => string;
}

export default {
  Locale,
  RegionKey,
  DifficultyKey,
  GameModeType,
  HintLevel,
  ColombianDepartment,
  RegionInfo,
  GameStats,
  TranslationParams,
  CulturalAdaptation,
  ColombianExpressions,
  GeographicTerminology,
  TranslationFunction,
  PluralizationFunction,
  NumberFormatter,
};