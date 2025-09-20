import React, { createContext, useContext, ReactNode } from 'react';
import { TranslationKeys, esCOTranslations, getTranslation, interpolate, pluralize, formatColombianNumber } from './translations';

interface TranslationContextValue {
  t: (key: string, values?: Record<string, string | number>) => string;
  translations: TranslationKeys;
  locale: string;
  formatNumber: (num: number) => string;
  pluralize: (count: number, singular: string, plural: string) => string;
}

const TranslationContext = createContext<TranslationContextValue | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
  locale?: string;
  translations?: TranslationKeys;
}

export function TranslationProvider({
  children,
  locale = 'es-CO',
  translations = esCOTranslations
}: TranslationProviderProps) {
  const t = (key: string, values?: Record<string, string | number>): string => {
    const translation = getTranslation(key, translations);
    return values ? interpolate(translation, values) : translation;
  };

  const value: TranslationContextValue = {
    t,
    translations,
    locale,
    formatNumber: formatColombianNumber,
    pluralize,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationProvider');
  }
  return context;
}

// Convenience hook for getting specific translation sections
export function useGameModeTranslations() {
  const { translations } = useTranslations();
  return translations.gameModes;
}

export function useEducationalTranslations() {
  const { translations } = useTranslations();
  return translations.educational;
}

export function useHintTranslations() {
  const { translations } = useTranslations();
  return translations.hints;
}

export function useFeedbackTranslations() {
  const { translations } = useTranslations();
  return translations.feedback;
}

export function useAccessibilityTranslations() {
  const { translations } = useTranslations();
  return translations.accessibility;
}

export function useCulturalTranslations() {
  const { translations } = useTranslations();
  return translations.cultural;
}

// Specialized hooks for complex translations
export function useRegionTranslations() {
  const { translations, t } = useTranslations();

  const getRegionName = (regionKey: keyof typeof translations.regions.names): string => {
    return translations.regions.names[regionKey];
  };

  const getRegionDescription = (regionKey: keyof typeof translations.regions.descriptions): string => {
    return translations.regions.descriptions[regionKey];
  };

  const getDifficultyLabel = (difficultyKey: keyof typeof translations.regions.difficulty): string => {
    return translations.regions.difficulty[difficultyKey];
  };

  return {
    getRegionName,
    getRegionDescription,
    getDifficultyLabel,
    regions: translations.regions,
  };
}

export function useGameHeaderTranslations() {
  const { translations, t, formatNumber } = useTranslations();

  const getModeDisplay = (mode: string, regions?: string[]): string => {
    switch (mode) {
      case 'full':
        return translations.gameHeader.modeDisplays.full;
      case 'progression':
        return translations.gameHeader.modeDisplays.progression;
      case 'region':
        if (regions && regions.length > 0) {
          return `🗺️ ${regions.join(', ')}`;
        }
        return translations.gameHeader.modeDisplays.custom;
      default:
        return translations.gameHeader.modeDisplays.custom;
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatScore = (score: number): string => {
    return formatNumber(score);
  };

  return {
    ...translations.gameHeader,
    getModeDisplay,
    formatTime,
    formatScore,
  };
}

export function useHintModalTranslations() {
  const { translations, t } = useTranslations();

  const getHintCost = (level: number): string => {
    const costs = {
      1: '10 puntos',
      2: '25 puntos',
      3: '50 puntos',
    };
    return costs[level as keyof typeof costs] || '10 puntos';
  };

  const getCoastType = (departmentName: string): string => {
    const pacificCoasts = ['Chocó', 'Valle del Cauca', 'Cauca', 'Nariño'];
    return pacificCoasts.includes(departmentName)
      ? translations.hints.geographic.coastTypes.pacific
      : translations.hints.geographic.coastTypes.caribbean;
  };

  const getBorderCountry = (departmentName: string): string => {
    const borderMap: Record<string, keyof typeof translations.hints.geographic.borderCountries> = {
      'La Guajira': 'venezuela',
      'Norte de Santander': 'venezuela',
      'Arauca': 'venezuela',
      'Vichada': 'venezuela',
      'Guainía': 'venezuela',
      'Vaupés': 'brazil',
      'Amazonas': 'brazil',
      'Putumayo': 'peru',
      'Nariño': 'ecuador',
    };

    const countryKey = borderMap[departmentName];
    return countryKey ? translations.hints.geographic.borderCountries[countryKey] : '';
  };

  return {
    ...translations.hints,
    getHintCost,
    getCoastType,
    getBorderCountry,
  };
}

export function useStatsTranslations() {
  const { translations, formatNumber, pluralize } = useTranslations();

  const formatDepartmentCount = (count: number): string => {
    return `${formatNumber(count)} ${pluralize(count, 'departamento', 'departamentos')}`;
  };

  const formatRegionCount = (count: number): string => {
    return `${formatNumber(count)} ${pluralize(count, 'región', 'regiones')}`;
  };

  const formatStarCount = (count: number): string => {
    return `${formatNumber(count)} ${pluralize(count, 'estrella', 'estrellas')}`;
  };

  const formatAccuracy = (correct: number, total: number): string => {
    if (total === 0) return '0%';
    const percentage = Math.round((correct / total) * 100);
    return `${percentage}%`;
  };

  return {
    ...translations.educational.statistics,
    formatDepartmentCount,
    formatRegionCount,
    formatStarCount,
    formatAccuracy,
  };
}

// Default export for convenience
export default TranslationProvider;