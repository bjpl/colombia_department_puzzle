import { useState } from 'react';
import {
  Button, Card, CardHeader, CardTitle, CardContent, Badge,
  colors, spacing, textStyles, shadows, radius
} from '../design-system';

interface GameModeSelectorProps {
  onSelectMode: (mode: GameModeConfig) => void;
  onClose: () => void;
  userStats?: UserRegionStats;
}

export interface GameModeConfig {
  type: 'full' | 'region' | 'study';
  selectedRegions?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface UserRegionStats {
  unlockedRegions: Set<string>;
  regionProgress: Map<string, { stars: number; bestTime: number; attempts: number }>;
  totalStars: number;
}

const REGIONS = [
  { id: 'Insular', name: 'Insular', departments: 1, difficulty: 'Fácil', color: 'emerald-500', unlockRequirement: 0 },
  { id: 'Pacífica', name: 'Pacífica', departments: 4, difficulty: 'Fácil', color: 'purple-200', unlockRequirement: 0 },
  { id: 'Orinoquía', name: 'Orinoquía', departments: 4, difficulty: 'Medio', color: 'amber-100', unlockRequirement: 1 },
  { id: 'Amazonía', name: 'Amazonía', departments: 6, difficulty: 'Medio', color: 'green-300', unlockRequirement: 2 },
  { id: 'Caribe', name: 'Caribe', departments: 8, difficulty: 'Difícil', color: 'blue-300', unlockRequirement: 3 },
  { id: 'Andina', name: 'Andina', departments: 10, difficulty: 'Experto', color: 'lime-400', unlockRequirement: 5 },
];

export default function GameModeSelector({ onSelectMode, onClose, userStats }: GameModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<'full' | 'region' | 'study' | null>(null);
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());
  const [showRegionSelector, setShowRegionSelector] = useState(false);

  const getTotalStars = () => userStats?.totalStars || 0;

  const isRegionUnlocked = (region: typeof REGIONS[0]) => {
    // All regions are now unlocked for free practice
    return true;
  };

  const handleModeSelect = (mode: 'full' | 'region' | 'study') => {
    console.log('GameModeSelector: handleModeSelect called with mode:', mode);
    setSelectedMode(mode);
    if (mode === 'region') {
      console.log('GameModeSelector: Showing region selector');
      setShowRegionSelector(true);
    } else {
      console.log('GameModeSelector: Calling onSelectMode with mode:', mode);
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
    console.log('GameModeSelector: confirmRegionSelection called with regions:', Array.from(selectedRegions));
    if (selectedRegions.size > 0) {
      const config = {
        type: 'region' as const,
        selectedRegions: Array.from(selectedRegions)
      };
      console.log('GameModeSelector: Calling onSelectMode with config:', config);
      onSelectMode(config);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ backgroundColor: colors.overlay }}>
      <Card variant="default" className="max-w-4xl w-full max-h-[90vh] overflow-auto transition-all">
        <CardContent className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent leading-relaxed pb-1">
                Elige Tu Modo de Juego
              </h1>
              <p className="text-gray-600">
                Tres formas simples de aprender los departamentos de Colombia
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-600 text-2xl leading-none"
            >
              ×
            </Button>
          </div>

          {!showRegionSelector ? (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Full Country Mode */}
              <Button
                variant="secondary"
                onClick={() => handleModeSelect('full')}
                className="relative transition-all h-auto"
              >
                <Card variant="default" className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg p-6 border-2 border-sky-200 transition-all duration-200">
                  <div className="text-4xl mb-4">🌎</div>
                  <h3 className="text-xl font-bold mb-2">Colombia Completa</h3>
                  <p style={{ fontSize: textStyles.body.small.fontSize[0], color: colors.text.secondary, marginBottom: spacing[4] }}>
                    Todos los 33 departamentos de una vez. ¡El desafío completo!
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing[2] }}>
                    <Badge variant="secondary" className="bg-sky-100 text-sky-800">33 departamentos</Badge>
                  </div>
                </Card>
              </Button>

              {/* Region Mode */}
              <Button
                variant="secondary"
                onClick={() => handleModeSelect('region')}
                className="relative transition-all h-auto"
              >
                <Card variant="default" className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-2 border-green-200 transition-all duration-200">
                  <div className="text-4xl mb-4">🗺️</div>
                  <h3 className="text-xl font-bold mb-2">Por Regiones</h3>
                  <p style={{ fontSize: textStyles.body.small.fontSize[0], color: colors.text.secondary, marginBottom: spacing[4] }}>
                    Elige regiones específicas para practicar paso a paso.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing[2] }}>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">1-10 departamentos</Badge>
                  </div>
                </Card>
                <Badge
                  variant="primary"
                  style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: colors.warning, fontSize: textStyles.body.small.fontSize[0], fontWeight: 'bold' }}
                >
                  Recomendado
                </Badge>
              </Button>

              {/* Study Mode */}
              <Button
                variant="secondary"
                onClick={() => handleModeSelect('study')}
                className="relative transition-all h-auto"
              >
                <Card variant="default" className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border-2 border-purple-200 transition-all duration-200">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="text-xl font-bold mb-2">Modo Estudio</h3>
                  <p style={{ fontSize: textStyles.body.small.fontSize[0], color: colors.text.secondary, marginBottom: spacing[4] }}>
                    Aprende primero, luego practica. Ideal para principiantes.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing[2] }}>
                    <Badge variant="secondary" className="bg-violet-100 text-violet-800">Aprendizaje</Badge>
                  </div>
                </Card>
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRegionSelector(false)}
                  style={{ fontSize: textStyles.body.small.fontSize[0], color: colors.text.secondary, marginBottom: spacing[4], display: 'flex', alignItems: 'center', gap: spacing[1] }}
                >
                  ← Volver a modos
                </Button>
                <h2 style={{ fontSize: textStyles.heading.h1.fontSize[0], fontWeight: textStyles.heading.h1.fontWeight, marginBottom: spacing[2] }}>Selecciona las Regiones</h2>
                <p style={{ color: colors.text.secondary }}>
                  Elige una o más regiones para practicar.
                  {userStats && ` Tienes ${getTotalStars()} ⭐ estrellas.`}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                {REGIONS.map(region => {
                  const isUnlocked = isRegionUnlocked(region);
                  const isSelected = selectedRegions.has(region.id);
                  const progress = userStats?.regionProgress.get(region.id);

                  return (
                    <Button
                      key={region.id}
                      variant="secondary"
                      onClick={() => toggleRegionSelection(region.id)}
                      style={{
                        position: 'relative',
                        borderRadius: radius.lg,
                        padding: spacing[4],
                        paddingTop: spacing[3],
                        border: `2px solid ${isSelected ? colors.brand[500] : colors.border}`,
                        backgroundColor: isSelected ? colors.brand[50] : colors.background,
                        transition: 'all 0.2s',
                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                        height: 'auto',
                        minHeight: '140px',
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '4px',
                          borderRadius: `${radius.lg} ${radius.lg} 0 0`,
                          backgroundColor: region.color
                        }}
                      />

                      <div className="flex flex-col" style={{ marginTop: spacing[2] }}>
                        <h3 style={{
                          fontWeight: textStyles.heading.h3.fontWeight,
                          fontSize: textStyles.heading.h3.fontSize[0],
                          marginBottom: spacing[2]
                        }}>
                          {region.name}
                        </h3>
                        <div style={{
                          fontSize: textStyles.body.small.fontSize[0],
                          color: colors.text.secondary,
                          marginBottom: spacing[3],
                          lineHeight: 1.5
                        }}>
                          <span style={{ fontWeight: 600 }}>{region.departments}</span>
                          <span style={{ marginLeft: spacing[1] }}>departamento{region.departments > 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between" style={{ marginTop: 'auto' }}>
                        <Badge
                          variant="secondary"
                          style={{
                            fontSize: textStyles.body.small.fontSize[0],
                            padding: `${spacing[1]} ${spacing[2]}`,
                            backgroundColor:
                              region.difficulty === 'Fácil' ? 'rgb(220 252 231)' :
                              region.difficulty === 'Medio' ? 'rgb(254 243 199)' :
                              region.difficulty === 'Difícil' ? 'rgb(254 215 170)' :
                              'rgb(254 202 202)',
                            color:
                              region.difficulty === 'Fácil' ? 'rgb(21 128 61)' :
                              region.difficulty === 'Medio' ? 'rgb(161 98 7)' :
                              region.difficulty === 'Difícil' ? 'rgb(194 65 12)' :
                              'rgb(220 38 38)',
                            fontWeight: 600
                          }}
                        >
                          {region.difficulty}
                        </Badge>

                        {progress && (
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map(star => (
                              <span
                                key={star}
                                style={{
                                  fontSize: textStyles.heading.h4.fontSize[0],
                                  color: star <= progress.stars ? colors.warning : colors.text.disabled
                                }}
                              >
                                ⭐
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          backgroundColor: colors.brand[500],
                          color: colors.text.primary,
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: textStyles.body.small.fontSize[0],
                          fontWeight: 'bold'
                        }}>
                          ✓
                        </div>
                      )}
                    </Button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center">
                <div style={{ fontSize: textStyles.body.small.fontSize[0], color: colors.text.secondary }}>
                  {selectedRegions.size > 0
                    ? `${selectedRegions.size} región${selectedRegions.size > 1 ? 'es' : ''} seleccionada${selectedRegions.size > 1 ? 's' : ''}`
                    : 'Selecciona al menos una región'
                  }
                </div>
                <Button
                  variant={selectedRegions.size > 0 ? 'primary' : 'secondary'}
                  size="lg"
                  onClick={confirmRegionSelection}
                  disabled={selectedRegions.size === 0}
                  style={{
                    background: selectedRegions.size > 0 ? 'linear-gradient(to right, rgb(14 165 233), rgb(16 185 129))' : colors.background,
                    color: selectedRegions.size > 0 ? colors.text.primary : colors.text.disabled,
                    fontWeight: 'bold',
                    cursor: selectedRegions.size === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Comenzar Juego
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}