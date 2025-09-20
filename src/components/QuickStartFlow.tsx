import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GameModeConfig } from './GameModeSelector';

interface QuickStartFlowProps {
  onComplete: (mode: GameModeConfig) => void;
  onSkip: () => void;
}

type UserLevel = 'beginner' | 'intermediate' | 'expert';
type LearningStyle = 'visual' | 'practice' | 'systematic';

interface UserProfile {
  level: UserLevel | null;
  style: LearningStyle | null;
  goal: 'learn' | 'challenge' | 'review' | null;
}

const QuickStartFlow: React.FC<QuickStartFlowProps> = ({ onComplete, onSkip }) => {
  const game = useGame();
  const [step, setStep] = useState<'welcome' | 'level' | 'style' | 'goal' | 'recommendation'>('welcome');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    level: null,
    style: null,
    goal: null
  });

  const getRecommendation = (): { mode: GameModeConfig; description: string; path: string[] } => {
    const { level, style, goal } = userProfile;

    // Beginner recommendations
    if (level === 'beginner') {
      if (style === 'visual') {
        return {
          mode: { type: 'region', selectedRegions: ['Insular'] },
          description: 'Comienza con la región más simple (1 departamento) usando el mapa visual',
          path: ['📚 Estudiar Insular', '🎯 Practicar Insular', '🗺️ Expandir a Pacífica']
        };
      }
      if (style === 'practice') {
        return {
          mode: { type: 'region', selectedRegions: ['Insular', 'Pacífica'] },
          description: 'Aprende haciendo con las regiones más fáciles',
          path: ['🎮 Jugar Insular', '📚 Revisar errores', '🎮 Jugar Pacífica']
        };
      }
      return {
        mode: { type: 'progression' },
        description: 'Sigue el camino de aprendizaje progresivo guiado',
        path: ['📖 Tutorial', '📚 Estudiar sistemáticamente', '🎮 Practicar por niveles']
      };
    }

    // Intermediate recommendations
    if (level === 'intermediate') {
      if (goal === 'challenge') {
        return {
          mode: { type: 'region', selectedRegions: ['Andina'] },
          description: 'Desafíate con la región más compleja (10 departamentos)',
          path: ['📚 Revisar Andina', '🎯 Modo desafío', '🏆 Superar récord']
        };
      }
      if (goal === 'review') {
        return {
          mode: { type: 'region', selectedRegions: ['Caribe', 'Pacífica'] },
          description: 'Refuerza las regiones costeras',
          path: ['📚 Estudiar costas', '🎮 Practicar mixto', '✅ Dominar regiones']
        };
      }
      return {
        mode: { type: 'region', selectedRegions: ['Orinoquía', 'Amazonía'] },
        description: 'Explora las regiones orientales menos conocidas',
        path: ['🗺️ Descubrir oriente', '📚 Aprender culturas', '🎮 Practicar']
      };
    }

    // Expert recommendations
    if (level === 'expert') {
      return {
        mode: { type: 'full' },
        description: 'Domina el mapa completo de Colombia con todos los departamentos',
        path: ['🚀 Juego completo', '⏱️ Contra reloj', '🏆 Perfección 100%']
      };
    }

    // Default recommendation
    return {
      mode: { type: 'progression' },
      description: 'Comienza con el modo de aprendizaje progresivo',
      path: ['📚 Estudiar', '🎮 Practicar', '🏆 Dominar']
    };
  };

  const handleComplete = () => {
    const recommendation = getRecommendation();
    onComplete(recommendation.mode);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
            style={{
              width: `${
                step === 'welcome' ? 20 :
                step === 'level' ? 40 :
                step === 'style' ? 60 :
                step === 'goal' ? 80 :
                100
              }%`
            }}
          />
        </div>

        <div className="p-8">
          {/* Welcome Step */}
          {step === 'welcome' && (
            <div className="text-center space-y-6">
              <div className="text-6xl">🇨🇴</div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                ¡Bienvenido al Rompecabezas de Colombia!
              </h2>
              <p className="text-lg text-gray-600">
                Te ayudaremos a encontrar el mejor modo de juego para ti
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <button
                  onClick={() => setStep('level')}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Comenzar →
                </button>
                <button
                  onClick={onSkip}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Omitir
                </button>
              </div>
            </div>
          )}

          {/* Level Assessment */}
          {step === 'level' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">
                ¿Cuánto conoces sobre los departamentos de Colombia?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setUserProfile(prev => ({ ...prev, level: 'beginner' }));
                    setStep('style');
                  }}
                  className="w-full p-6 text-left bg-gradient-to-r from-green-50 to-blue-50 rounded-xl hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🌱</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-700">Principiante</h3>
                      <p className="text-gray-600">
                        Conozco algunos departamentos principales
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setUserProfile(prev => ({ ...prev, level: 'intermediate' }));
                    setStep('style');
                  }}
                  className="w-full p-6 text-left bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🌿</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-blue-700">Intermedio</h3>
                      <p className="text-gray-600">
                        Conozco la mayoría pero necesito práctica
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setUserProfile(prev => ({ ...prev, level: 'expert' }));
                    setStep('goal');
                  }}
                  className="w-full p-6 text-left bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🌳</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-purple-700">Experto</h3>
                      <p className="text-gray-600">
                        Conozco todos los departamentos y sus ubicaciones
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Learning Style */}
          {step === 'style' && userProfile.level !== 'expert' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">
                ¿Cómo prefieres aprender?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setUserProfile(prev => ({ ...prev, style: 'visual' }));
                    setStep('goal');
                  }}
                  className="w-full p-6 text-left bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">👁️</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-cyan-700">Visual</h3>
                      <p className="text-gray-600">
                        Prefiero ver mapas y colores para memorizar
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setUserProfile(prev => ({ ...prev, style: 'practice' }));
                    setStep('goal');
                  }}
                  className="w-full p-6 text-left bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🎮</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-orange-700">Práctica</h3>
                      <p className="text-gray-600">
                        Aprendo mejor jugando y practicando
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setUserProfile(prev => ({ ...prev, style: 'systematic' }));
                    setStep('goal');
                  }}
                  className="w-full p-6 text-left bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">📊</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-indigo-700">Sistemático</h3>
                      <p className="text-gray-600">
                        Prefiero un enfoque estructurado paso a paso
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Goal Selection */}
          {step === 'goal' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">
                ¿Cuál es tu objetivo hoy?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setUserProfile(prev => ({ ...prev, goal: 'learn' }));
                    setStep('recommendation');
                  }}
                  className="w-full p-6 text-left bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">📚</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-700">Aprender</h3>
                      <p className="text-gray-600">
                        Quiero estudiar y memorizar los departamentos
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setUserProfile(prev => ({ ...prev, goal: 'challenge' }));
                    setStep('recommendation');
                  }}
                  className="w-full p-6 text-left bg-gradient-to-r from-red-50 to-orange-50 rounded-xl hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🏆</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-red-700">Desafío</h3>
                      <p className="text-gray-600">
                        Quiero poner a prueba mis conocimientos
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setUserProfile(prev => ({ ...prev, goal: 'review' }));
                    setStep('recommendation');
                  }}
                  className="w-full p-6 text-left bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🔄</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-blue-700">Repasar</h3>
                      <p className="text-gray-600">
                        Quiero reforzar lo que ya sé
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Recommendation */}
          {step === 'recommendation' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">✨</div>
                <h2 className="text-2xl font-bold mb-2">
                  ¡Perfecto! Tenemos el modo ideal para ti
                </h2>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  Recomendación Personalizada
                </h3>
                <p className="text-gray-600 mb-4">
                  {getRecommendation().description}
                </p>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">
                    Tu camino de aprendizaje:
                  </h4>
                  <div className="space-y-2">
                    {getRecommendation().path.map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="text-gray-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleComplete}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Comenzar Ahora →
                </button>
                <button
                  onClick={() => setStep('welcome')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cambiar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickStartFlow;