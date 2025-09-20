import React, { useMemo } from 'react';
import { GameModeConfig } from './GameModeSelector';

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
    <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">¿Qué sigue?</h3>
        <p className="text-sm text-gray-600">
          Elige tu próximo desafío
        </p>
      </div>

      <div className="grid gap-3">
        {recommendations.map((rec, index) => (
          <button
            key={index}
            onClick={() => onSelectChallenge(rec.mode)}
            className="flex items-center gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-all hover:scale-[1.02] text-left"
          >
            <div className="text-2xl">{rec.icon}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">{rec.title}</h4>
              <p className="text-sm text-gray-600">{rec.description}</p>
            </div>
            <div className="text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onViewProgress}
        className="mt-4 w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
      >
        Ver mi progreso completo →
      </button>
    </div>
  );
}