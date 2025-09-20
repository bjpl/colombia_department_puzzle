import React, { useMemo } from 'react';
import { GameModeConfig } from './GameModeSelector';
import { useGame } from '../context/GameContext';

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
  difficulty: 'easier' | 'same' | 'harder' | 'next';
  icon: string;
  unlockMessage?: string;
  progressPath: string[];
}

const REGION_DIFFICULTY = {
  'Insular': 1,      // 1 department
  'Pacífica': 2,     // 3 departments
  'Orinoquía': 3,    // 4 departments
  'Amazonía': 4,     // 5 departments
  'Caribe': 5,       // 7 departments
  'Andina': 6,       // 10 departments
  'Full': 10         // 33 departments
};

const REGION_DEPARTMENT_COUNT: Record<string, number> = {
  'Insular': 1,
  'Pacífica': 3,
  'Orinoquía': 4,
  'Amazonía': 5,
  'Caribe': 7,
  'Andina': 10
};

export default function NextChallengeRecommender({
  currentMode,
  performance,
  onSelectChallenge,
  onViewProgress
}: NextChallengeRecommenderProps) {

  const recommendations = useMemo((): ChallengeRecommendation[] => {
    const recs: ChallengeRecommendation[] = [];
    const { accuracy, hintsUsed, timeInSeconds } = performance;

    // Determine performance level
    const performanceLevel = accuracy >= 90 && hintsUsed === 0 ? 'excellent' :
                           accuracy >= 75 ? 'good' :
                           accuracy >= 50 ? 'fair' : 'needs-practice';

    // Get current difficulty
    const getCurrentDifficulty = () => {
      if (currentMode.type === 'full') return 10;
      if (currentMode.type === 'progression') return 0; // Special handling
      if (currentMode.type === 'region' && currentMode.selectedRegions) {
        const totalDepts = currentMode.selectedRegions.reduce((sum, region) =>
          sum + (REGION_DEPARTMENT_COUNT[region] || 0), 0);
        return Math.min(totalDepts / 3, 10);
      }
      return 5;
    };

    const currentDifficulty = getCurrentDifficulty();

    // CASE 1: Just completed Insular (1 department) - beginner
    if (currentMode.type === 'region' &&
        currentMode.selectedRegions?.length === 1 &&
        currentMode.selectedRegions[0] === 'Insular') {

      // Always suggest next step
      recs.push({
        mode: { type: 'region', selectedRegions: ['Pacífica'] },
        title: '🌊 Continuar a Región Pacífica',
        description: 'Siguiente desafío: 3 departamentos costeros',
        difficulty: 'next',
        icon: '➡️',
        progressPath: [
          '✅ Insular completado',
          '👉 Pacífica (actual)',
          '📍 Orinoquía',
          '📍 Amazonía'
        ]
      });

      if (performanceLevel === 'excellent') {
        recs.push({
          mode: { type: 'region', selectedRegions: ['Insular', 'Pacífica'] },
          title: '🎯 Combinar Insular + Pacífica',
          description: 'Practica ambas regiones juntas (4 departamentos)',
          difficulty: 'harder',
          icon: '🔀',
          progressPath: [
            '✅ Dominar islas y costa',
            '📍 Expandir a más regiones'
          ]
        });
      }

      // Add study mode for other regions
      recs.push({
        mode: { type: 'region', selectedRegions: ['Orinoquía'] },
        title: '📚 Explorar Orinoquía',
        description: 'Aprende la región de los llanos (4 departamentos)',
        difficulty: 'next',
        icon: '🗺️',
        progressPath: [
          '📖 Estudiar nuevas regiones',
          '🎮 Practicar gradualmente'
        ]
      });
    }

    // CASE 2: Completed Pacífica or small region combo
    else if (currentMode.type === 'region' && currentMode.selectedRegions) {
      const regionsCompleted = currentMode.selectedRegions;
      const totalDepts = regionsCompleted.reduce((sum, r) =>
        sum + (REGION_DEPARTMENT_COUNT[r] || 0), 0);

      if (totalDepts <= 4) {
        // Suggest next logical regions
        if (!regionsCompleted.includes('Orinoquía')) {
          recs.push({
            mode: { type: 'region', selectedRegions: ['Orinoquía'] },
            title: '🏞️ Conquistar Orinoquía',
            description: 'Región de los llanos orientales (4 departamentos)',
            difficulty: 'next',
            icon: '➡️',
            progressPath: [
              `✅ ${regionsCompleted.join(', ')} completado`,
              '👉 Orinoquía',
              '📍 Amazonía',
              '📍 Caribe'
            ]
          });
        }

        if (!regionsCompleted.includes('Amazonía')) {
          recs.push({
            mode: { type: 'region', selectedRegions: ['Amazonía'] },
            title: '🌳 Explorar Amazonía',
            description: 'La selva amazónica (5 departamentos)',
            difficulty: 'harder',
            icon: '🆙',
            progressPath: [
              '📚 Estudiar región amazónica',
              '🎮 Practicar departamentos selváticos'
            ]
          });
        }

        // Combine regions for more challenge
        recs.push({
          mode: { type: 'region', selectedRegions: [...regionsCompleted, 'Orinoquía'] },
          title: '🔗 Combinar Regiones',
          description: `Practica ${regionsCompleted.join(' + ')} + Orinoquía juntas`,
          difficulty: 'harder',
          icon: '💪',
          progressPath: [
            '🎯 Dominar múltiples regiones',
            '📈 Aumentar complejidad'
          ]
        });
      }

      // Medium difficulty completed (5-10 departments)
      else if (totalDepts <= 10) {
        if (!regionsCompleted.includes('Caribe')) {
          recs.push({
            mode: { type: 'region', selectedRegions: ['Caribe'] },
            title: '🏖️ Región Caribe',
            description: 'Costa norte de Colombia (7 departamentos)',
            difficulty: performanceLevel === 'excellent' ? 'same' : 'harder',
            icon: '🌴',
            progressPath: [
              '✅ Regiones básicas dominadas',
              '👉 Caribe',
              '📍 Andina',
              '🎯 País completo'
            ]
          });
        }

        if (!regionsCompleted.includes('Andina')) {
          recs.push({
            mode: { type: 'region', selectedRegions: ['Andina'] },
            title: '⛰️ Desafío Andino',
            description: 'La región más compleja (10 departamentos)',
            difficulty: 'harder',
            icon: '🏔️',
            unlockMessage: performanceLevel !== 'excellent' ?
              'Mejora tu precisión para desbloquear' : undefined,
            progressPath: [
              '📚 Estudiar región montañosa',
              '🎯 El mayor desafío regional'
            ]
          });
        }

        // Progressive combination
        const allEasyRegions = ['Insular', 'Pacífica', 'Orinoquía', 'Amazonía'];
        const missingEasy = allEasyRegions.filter(r => !regionsCompleted.includes(r));
        if (missingEasy.length > 0) {
          recs.push({
            mode: { type: 'region', selectedRegions: [...regionsCompleted, ...missingEasy] },
            title: '📊 Consolidar Conocimiento',
            description: 'Todas las regiones que conoces juntas',
            difficulty: 'harder',
            icon: '🎓',
            progressPath: [
              '✅ Integrar todo lo aprendido',
              '📈 Preparación para modo completo'
            ]
          });
        }
      }
    }

    // CASE 3: Completed Andina or Caribe (harder regions)
    else if (currentMode.type === 'region' &&
             currentMode.selectedRegions?.some(r => ['Andina', 'Caribe'].includes(r))) {

      // Ready for full country
      recs.push({
        mode: { type: 'full' },
        title: '🇨🇴 Desafío Colombia Completo',
        description: '¡Todos los 33 departamentos!',
        difficulty: 'harder',
        icon: '🏆',
        unlockMessage: performanceLevel === 'needs-practice' ?
          'Practica más antes de intentar el desafío completo' : undefined,
        progressPath: [
          '✅ Regiones dominadas',
          '🎯 DESAFÍO FINAL',
          '🏆 Maestro de Colombia'
        ]
      });

      // Mix and match for variety
      const otherRegions = ['Insular', 'Pacífica', 'Orinoquía', 'Amazonía']
        .filter(r => !currentMode.selectedRegions?.includes(r));

      if (otherRegions.length > 0) {
        recs.push({
          mode: { type: 'region', selectedRegions: otherRegions },
          title: '🔄 Repasar Otras Regiones',
          description: `Refuerza: ${otherRegions.slice(0, 2).join(', ')}...`,
          difficulty: 'easier',
          icon: '📝',
          progressPath: [
            '📚 Repasar regiones anteriores',
            '💯 Perfeccionar conocimiento'
          ]
        });
      }
    }

    // CASE 4: Completed full country
    else if (currentMode.type === 'full') {
      if (performanceLevel === 'excellent') {
        recs.push({
          mode: { type: 'full' },
          title: '⚡ Modo Velocidad',
          description: 'Completa en menos de 3 minutos',
          difficulty: 'harder',
          icon: '⏱️',
          progressPath: [
            '✅ Maestro de geografía',
            '🎯 Romper récords de tiempo'
          ]
        });
      }

      // Practice specific weak regions
      if (accuracy < 90) {
        recs.push({
          mode: { type: 'region', selectedRegions: ['Andina'] },
          title: '🎯 Perfeccionar Región Andina',
          description: 'Practica la región más difícil',
          difficulty: 'easier',
          icon: '📚',
          progressPath: [
            '📖 Reforzar puntos débiles',
            '💯 Alcanzar 100% precisión'
          ]
        });
      }

      // New challenge modes
      recs.push({
        mode: { type: 'full' },
        title: '🎲 Modo Aleatorio',
        description: 'Orden aleatorio de departamentos',
        difficulty: 'same',
        icon: '🔀',
        progressPath: [
          '🎮 Nuevos desafíos',
          '🧠 Mantener habilidades'
        ]
      });
    }

    // CASE 5: Progressive mode
    else if (currentMode.type === 'progression') {
      // This mode has built-in progression
      recs.push({
        mode: { type: 'progression' },
        title: '📈 Continuar Progreso',
        description: 'Sigue tu camino de aprendizaje personalizado',
        difficulty: 'next',
        icon: '✨',
        progressPath: [
          '📚 Aprendizaje adaptativo',
          '🎯 Desbloquear nuevas regiones',
          '🏆 Completar todas las etapas'
        ]
      });
    }

    // Always add a "View Progress" option
    if (recs.length === 0) {
      // Fallback recommendation
      recs.push({
        mode: { type: 'region', selectedRegions: ['Pacífica'] },
        title: '🌊 Explorar Nueva Región',
        description: 'Descubre la región Pacífica',
        difficulty: 'next',
        icon: '🗺️',
        progressPath: ['📚 Continuar aprendiendo']
      });
    }

    return recs;
  }, [currentMode, performance]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 shadow-lg">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          🚀 ¿Qué sigue?
        </h3>
        <p className="text-gray-600">
          Basado en tu rendimiento, aquí están tus próximos desafíos:
        </p>
      </div>

      {/* Performance Summary */}
      <div className="bg-white/50 rounded-lg p-3 mb-4">
        <div className="flex justify-around text-sm">
          <div>
            <span className="text-gray-500">Precisión:</span>
            <span className={`ml-2 font-bold ${
              performance.accuracy >= 90 ? 'text-green-600' :
              performance.accuracy >= 75 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {performance.accuracy}%
            </span>
          </div>
          <div>
            <span className="text-gray-500">Tiempo:</span>
            <span className="ml-2 font-bold text-blue-600">
              {Math.floor(performance.timeInSeconds / 60)}:{(performance.timeInSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Pistas:</span>
            <span className="ml-2 font-bold text-purple-600">
              {performance.hintsUsed}
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg p-4 border-2 transition-all cursor-pointer
              ${rec.unlockMessage ? 'opacity-60 border-gray-300' : 'hover:shadow-md hover:border-blue-400 border-gray-200'}
              ${rec.difficulty === 'next' ? 'ring-2 ring-green-400 ring-offset-2' : ''}
            `}
            onClick={() => !rec.unlockMessage && onSelectChallenge(rec.mode)}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{rec.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-lg">{rec.title}</h4>
                  {rec.difficulty === 'harder' && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Más difícil</span>}
                  {rec.difficulty === 'next' && <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded animate-pulse">Recomendado</span>}
                  {rec.difficulty === 'easier' && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Repaso</span>}
                </div>
                <p className="text-gray-600 text-sm mb-2">{rec.description}</p>

                {rec.unlockMessage ? (
                  <p className="text-red-500 text-xs italic">{rec.unlockMessage}</p>
                ) : (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">Tu camino:</div>
                    <div className="flex flex-wrap gap-1">
                      {rec.progressPath.map((step, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-1 rounded ${
                            step.startsWith('✅') ? 'bg-green-100 text-green-700' :
                            step.startsWith('👉') ? 'bg-blue-100 text-blue-700 font-semibold' :
                            step.startsWith('🎯') ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {step}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Full Progress Button */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={onViewProgress}
          className="w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
        >
          <span>📊</span>
          <span>Ver Mi Progreso Completo</span>
        </button>
      </div>
    </div>
  );
}