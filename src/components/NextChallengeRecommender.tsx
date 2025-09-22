import React, { useMemo } from 'react';
import { GameModeConfig } from './GameModeSelector';
import {
  Button, Card, CardHeader, CardTitle, CardContent, Badge,
  colors, spacing, textStyles, shadows
} from '../design-system';

interface NextChallengeRecommenderProps {
  currentMode: GameModeConfig;
  performance: {
    score: number;
    accuracy: number;
    timeInSeconds: number;
    hintsUsed: number;
    attempts: number;
  };
  onSelectChallenge: (mode: GameModeConfig) => void;
  onViewProgress: () => void;
}

interface ChallengeRecommendation {
  mode: GameModeConfig;
  title: string;
  description: string;
  icon: string;
}

// Simple regional progression order
const REGION_PROGRESSION = [
  { id: 'Insular', name: 'Insular', departments: 1 },
  { id: 'Pacífica', name: 'Pacífica', departments: 3 },
  { id: 'Orinoquía', name: 'Orinoquía', departments: 4 },
  { id: 'Amazonía', name: 'Amazonía', departments: 5 },
  { id: 'Caribe', name: 'Caribe', departments: 7 },
  { id: 'Andina', name: 'Andina', departments: 10 }
];

export default function NextChallengeRecommender({
  currentMode,
  performance,
  onSelectChallenge,
  onViewProgress
}: NextChallengeRecommenderProps) {

  const recommendations = useMemo((): ChallengeRecommendation[] => {
    const recs: ChallengeRecommendation[] = [];
    const { accuracy } = performance;

    // SIMPLIFIED LOGIC: Just suggest next region in progression
    if (currentMode.type === 'region' && currentMode.selectedRegions) {
      const currentRegions = currentMode.selectedRegions;

      // Find the highest region completed
      let highestIndex = -1;
      currentRegions.forEach(region => {
        const index = REGION_PROGRESSION.findIndex(r => r.id === region);
        if (index > highestIndex) highestIndex = index;
      });

      // Suggest next region if not at the end
      if (highestIndex < REGION_PROGRESSION.length - 1) {
        const nextRegion = REGION_PROGRESSION[highestIndex + 1];
        recs.push({
          mode: { type: 'region', selectedRegions: [nextRegion.id] },
          title: `🗺️ Continuar con ${nextRegion.name}`,
          description: `Próximo desafío: ${nextRegion.departments} departamentos`,
          icon: '➡️'
        });
      }

      // If completed Andina (last region), suggest full country
      if (currentRegions.includes('Andina')) {
        recs.push({
          mode: { type: 'full' },
          title: '🇨🇴 Colombia Completa',
          description: '¡Desafío final con todos los 33 departamentos!',
          icon: '🏆'
        });
      }

      // Always offer to practice current regions again
      recs.push({
        mode: currentMode,
        title: '🔄 Practicar de Nuevo',
        description: accuracy < 90 ? 'Mejora tu precisión' : 'Mejora tu velocidad',
        icon: '🎯'
      });

      // Offer study mode
      recs.push({
        mode: { type: 'study' },
        title: '📚 Modo Estudio',
        description: 'Aprende más sobre las regiones',
        icon: '📖'
      });
    }

    // For full country mode
    else if (currentMode.type === 'full') {
      // Practice specific regions if accuracy is low
      if (accuracy < 90) {
        recs.push({
          mode: { type: 'region', selectedRegions: ['Andina'] },
          title: '🎯 Practicar Región Andina',
          description: 'Refuerza la región más difícil',
          icon: '📚'
        });
      }

      // Speed challenge
      recs.push({
        mode: { type: 'full' },
        title: '⏱️ Desafío de Velocidad',
        description: 'Intenta completarlo más rápido',
        icon: '🏃'
      });

      // Play again
      recs.push({
        mode: currentMode,
        title: '🔄 Jugar de Nuevo',
        description: 'Intenta superar tu puntuación',
        icon: '🎮'
      });
    }

    return recs;
  }, [currentMode, performance]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card variant="default" style={{ marginTop: spacing[6], padding: spacing[6], background: 'linear-gradient(to right, rgb(219 234 254), rgb(240 253 244))' }}>
      <CardHeader style={{ marginBottom: spacing[4] }}>
        <CardTitle style={{ fontSize: textStyles.heading.medium.fontSize[0], fontWeight: 'bold', color: colors.text.primary }}>¿Qué sigue?</CardTitle>
        <p style={{ fontSize: textStyles.body.small.fontSize[0], color: colors.text.secondary }}>
          Elige tu próximo desafío
        </p>
      </CardHeader>

      <CardContent style={{ display: 'grid', gap: spacing[3] }}>
        {recommendations.map((rec, index) => (
          <Button
            key={index}
            variant="secondary"
            onClick={() => onSelectChallenge(rec.mode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[4],
              padding: spacing[4],
              backgroundColor: colors.background,
              textAlign: 'left',
              height: 'auto',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: textStyles.heading.large.fontSize[0] }}>{rec.icon}</div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: 'semibold', color: colors.text.primary }}>{rec.title}</h4>
              <p style={{ fontSize: textStyles.body.small.fontSize[0], color: colors.text.secondary }}>{rec.description}</p>
            </div>
            <div style={{ color: colors.text.disabled }}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Button>
        ))}
      </CardContent>

      <Button
        variant="ghost"
        onClick={onViewProgress}
        style={{
          marginTop: spacing[4],
          width: '100%',
          fontSize: textStyles.body.small.fontSize[0],
          color: colors.text.secondary
        }}
      >
        Ver mi progreso completo →
      </Button>
    </Card>
  );
}