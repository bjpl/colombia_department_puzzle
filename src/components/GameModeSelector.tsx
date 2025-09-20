import { useState } from 'react';

interface GameModeSelectorProps {
  onSelectMode: (mode: GameModeConfig) => void;
  onClose: () => void;
  userStats?: UserRegionStats;
}

export interface GameModeConfig {
  type: 'full' | 'region' | 'progression';
  selectedRegions?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface UserRegionStats {
  unlockedRegions: Set<string>;
  regionProgress: Map<string, { stars: number; bestTime: number; attempts: number }>;
  totalStars: number;
}

const REGIONS = [
  { id: 'Insular', name: 'Insular', departments: 1, difficulty: 'Fácil', color: '#10b981', unlockRequirement: 0 },
  { id: 'Pacífica', name: 'Pacífica', departments: 4, difficulty: 'Fácil', color: '#e9d5ff', unlockRequirement: 0 },
  { id: 'Orinoquía', name: 'Orinoquía', departments: 4, difficulty: 'Medio', color: '#fef3c7', unlockRequirement: 1 },
  { id: 'Amazonía', name: 'Amazonía', departments: 6, difficulty: 'Medio', color: '#86efac', unlockRequirement: 2 },
  { id: 'Caribe', name: 'Caribe', departments: 8, difficulty: 'Difícil', color: '#93c5fd', unlockRequirement: 3 },
  { id: 'Andina', name: 'Andina', departments: 10, difficulty: 'Experto', color: '#bef264', unlockRequirement: 5 },
];

export default function GameModeSelector({ onSelectMode, onClose, userStats }: GameModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<'full' | 'region' | 'progression' | null>(null);
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());
  const [showRegionSelector, setShowRegionSelector] = useState(false);

  const getTotalStars = () => userStats?.totalStars || 0;

  const isRegionUnlocked = (region: typeof REGIONS[0]) => {
    if (!userStats) return region.unlockRequirement === 0;
    return getTotalStars() >= region.unlockRequirement;
  };

  const handleModeSelect = (mode: 'full' | 'region' | 'progression') => {
    setSelectedMode(mode);
    if (mode === 'region') {
      setShowRegionSelector(true);
    } else {
      onSelectMode({ type: mode });
    }
  };

  const toggleRegionSelection = (regionId: string) => {
    const newSelection = new Set(selectedRegions);
    if (newSelection.has(regionId)) {
      newSelection.delete(regionId);
    } else {
      newSelection.add(regionId);
    }
    setSelectedRegions(newSelection);
  };

  const confirmRegionSelection = () => {
    if (selectedRegions.size > 0) {
      onSelectMode({
        type: 'region',
        selectedRegions: Array.from(selectedRegions)
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto transform transition-all">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                ¿Cómo quieres jugar?
              </h1>
              <p className="text-gray-600">
                Elige tu modo de juego para aprender la geografía de Colombia
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {!showRegionSelector ? (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Full Country Mode */}
              <button
                onClick={() => handleModeSelect('full')}
                className="relative group transform transition-all hover:scale-105"
              >
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all">
                  <div className="text-4xl mb-4">🌎</div>
                  <h3 className="text-xl font-bold mb-2">Colombia Completa</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Juega con los 33 departamentos. El desafío completo.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full">Experto</span>
                    <span className="text-gray-500">33 departamentos</span>
                  </div>
                </div>
              </button>

              {/* Region Mode */}
              <button
                onClick={() => handleModeSelect('region')}
                className="relative group transform transition-all hover:scale-105"
              >
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200 hover:border-green-400 transition-all">
                  <div className="text-4xl mb-4">🗺️</div>
                  <h3 className="text-xl font-bold mb-2">Por Regiones</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Practica con regiones específicas a tu ritmo.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">Flexible</span>
                    <span className="text-gray-500">1-10 departamentos</span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full font-bold">
                  Recomendado
                </div>
              </button>

              {/* Progressive Mode */}
              <button
                onClick={() => handleModeSelect('progression')}
                className="relative group transform transition-all hover:scale-105"
              >
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all">
                  <div className="text-4xl mb-4">🎓</div>
                  <h3 className="text-xl font-bold mb-2">Modo Aprendizaje</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Progresión guiada de fácil a difícil.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">Progresivo</span>
                    <span className="text-gray-500">Con tutoriales</span>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setShowRegionSelector(false)}
                  className="text-sm text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-1"
                >
                  ← Volver a modos
                </button>
                <h2 className="text-2xl font-bold mb-2">Selecciona las Regiones</h2>
                <p className="text-gray-600">
                  Elige una o más regiones para practicar.
                  {userStats && ` Tienes ${getTotalStars()} ⭐ estrellas.`}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {REGIONS.map(region => {
                  const isUnlocked = isRegionUnlocked(region);
                  const isSelected = selectedRegions.has(region.id);
                  const progress = userStats?.regionProgress.get(region.id);

                  return (
                    <button
                      key={region.id}
                      onClick={() => isUnlocked && toggleRegionSelection(region.id)}
                      disabled={!isUnlocked}
                      className={`
                        relative rounded-xl p-4 border-2 transition-all transform
                        ${isUnlocked
                          ? isSelected
                            ? 'border-blue-500 bg-blue-50 scale-105'
                            : 'border-gray-200 hover:border-gray-400 bg-white hover:scale-105'
                          : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                        }
                      `}
                    >
                      <div
                        className="absolute top-0 left-0 w-full h-1 rounded-t-xl"
                        style={{ backgroundColor: region.color }}
                      />

                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{region.name}</h3>
                        {!isUnlocked && (
                          <div className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                            🔒 {region.unlockRequirement} ⭐
                          </div>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        {region.departments} departamento{region.departments > 1 ? 's' : ''}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`
                          text-xs px-2 py-1 rounded-full
                          ${region.difficulty === 'Fácil' ? 'bg-green-100 text-green-700' :
                            region.difficulty === 'Medio' ? 'bg-yellow-100 text-yellow-700' :
                            region.difficulty === 'Difícil' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'}
                        `}>
                          {region.difficulty}
                        </span>

                        {progress && (
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map(star => (
                              <span
                                key={star}
                                className={`text-lg ${
                                  star <= progress.stars
                                    ? 'text-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              >
                                ⭐
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {isSelected && (
                        <div className="absolute -top-2 -right-2 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {selectedRegions.size > 0
                    ? `${selectedRegions.size} región${selectedRegions.size > 1 ? 'es' : ''} seleccionada${selectedRegions.size > 1 ? 's' : ''}`
                    : 'Selecciona al menos una región'
                  }
                </div>
                <button
                  onClick={confirmRegionSelection}
                  disabled={selectedRegions.size === 0}
                  className={`
                    px-6 py-3 rounded-lg font-bold transition-all
                    ${selectedRegions.size > 0
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  Comenzar Juego
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}