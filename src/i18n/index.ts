/**
 * Colombian Spanish Translations System
 *
 * This module provides a comprehensive translation system specifically designed
 * for Colombian Spanish (es-CO) with cultural adaptations for Colombian users.
 *
 * Features:
 * - Colombian Spanish dialect and expressions
 * - Cultural context and terminology
 * - Geographic terms specific to Colombia
 * - Educational content adapted for Colombian students
 * - Accessibility support in Spanish
 * - Type-safe translation keys
 */

// Core translation functions and data
export {
  esCOTranslations as translations,
  getTranslation,
  interpolate,
  pluralize,
  formatColombianNumber,
  formatColombianCurrency,
  type TranslationKeys,
} from './translations';

// React context and hooks
export {
  TranslationProvider,
  useTranslations,
  useGameModeTranslations,
  useEducationalTranslations,
  useHintTranslations,
  useFeedbackTranslations,
  useAccessibilityTranslations,
  useCulturalTranslations,
  useRegionTranslations,
  useGameHeaderTranslations,
  useHintModalTranslations,
  useStatsTranslations,
} from './TranslationContext';

// Type definitions
export type {
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
  GameModeTranslations,
  HintSystemTranslations,
  FeedbackTranslations,
  ErrorTranslations,
  AccessibilityTranslations,
  CulturalContext,
  ProgressionTranslations,
  EducationalTranslations,
  MeasurementFormatting,
} from './types';

// Colombian cultural data and utilities
export * from './cultural';

// Default export for convenience
export { esCOTranslations as default } from './translations';