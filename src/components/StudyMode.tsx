import React, { useState, useEffect } from 'react';
import { Department, colombiaDepartments } from '../data/colombiaDepartments';
import { useGame } from '../context/GameContext';
import { GameModeConfig } from './GameModeSelector';
import StudyModeMap from './StudyModeMap';
import { storage } from '../services/storage';
import { REGION_COLORS } from '../constants/regionColors';
import { getMemoryAid } from '../data/memoryAids';
import { getDepartmentEducation } from '../data/departmentEducation';
import { getRegionalNarrative } from '../data/regionalNarratives';
import MiniDepartmentShape from './MiniDepartmentShape';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  Badge,
  colors,
  spacing,
  textStyles,
  shadows
} from '../design-system';
import { cn } from '../design-system/utils/cn';

interface StudyModeProps {
  onClose: () => void;
  onStartGame: () => void;
  onSelectMode?: (mode: GameModeConfig) => void;
}

interface StudyFlowState {
  phase: 'explore' | 'focus' | 'quiz' | 'ready';
  studiedDepartments: Set<string>;
  focusedRegion: string | null;
  quizCorrect: number;
  quizTotal: number;
}

// Smart recommendations based on study progress
const getRecommendedMode = (studiedDepts: Set<string>, allDepts: Department[]): GameModeConfig => {
  const studiedByRegion = new Map<string, number>();

  allDepts.forEach(dept => {
    if (studiedDepts.has(dept.id)) {
      const count = studiedByRegion.get(dept.region) || 0;
      studiedByRegion.set(dept.region, count + 1);
    }
  });

  // Find regions with >50% studied
  const readyRegions: string[] = [];
  const regionSizes = new Map<string, number>();

  allDepts.forEach(dept => {
    const count = regionSizes.get(dept.region) || 0;
    regionSizes.set(dept.region, count + 1);
  });

  studiedByRegion.forEach((studied, region) => {
    const total = regionSizes.get(region) || 0;
    if (studied / total > 0.5) {
      readyRegions.push(region);
    }
  });

  if (readyRegions.length === 0) {
    // Start with easiest region
    return { type: 'region', selectedRegions: ['Insular'] };
  } else if (readyRegions.length === 1) {
    // Practice the ready region
    return { type: 'region', selectedRegions: readyRegions };
  } else if (readyRegions.length > 3) {
    // Ready for full game
    return { type: 'full' };
  } else {
    // Practice multiple regions
    return { type: 'region', selectedRegions: readyRegions };
  }
};

export default function StudyMode({ onClose, onStartGame, onSelectMode }: StudyModeProps) {
  const game = useGame();
  const [flowState, setFlowState] = useState<StudyFlowState>({
    phase: 'explore',
    studiedDepartments: new Set(),
    focusedRegion: null,
    quizCorrect: 0,
    quizTotal: 0
  });
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'cards'>('cards');
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Load studied departments from storage
  useEffect(() => {
    const profile = storage.getActiveProfile();
    if (profile?.stats?.departmentStats) {
      const studied = Object.keys(profile.stats.departmentStats);
      setFlowState(prev => ({ ...prev, studiedDepartments: new Set(studied) }));
    }
  }, []);

  const handleDepartmentClick = (dept: Department) => {
    setSelectedDepartment(dept);
    setFlowState(prev => {
      const newStudiedDepartments = new Set([...prev.studiedDepartments, dept.id]);

      // Smart phase progression
      if (newStudiedDepartments.size >= 5 && prev.phase === 'explore') {
        setShowQuickActions(true);
        return { ...prev, studiedDepartments: newStudiedDepartments, phase: 'focus' };
      }

      return { ...prev, studiedDepartments: newStudiedDepartments };
    });
  };

  const handleRegionFocus = (region: string) => {
    setFlowState(prev => ({ ...prev, focusedRegion: region, phase: 'focus' }));
  };

  const handleStartPractice = () => {
    const recommendedMode = getRecommendedMode(flowState.studiedDepartments, colombiaDepartments);
    if (onSelectMode) {
      onSelectMode(recommendedMode);
    }
  };

  const handleQuickQuiz = (dept: Department) => {
    // Simple quiz: Is this department in the focused region?
    const correct = dept.region === flowState.focusedRegion;
    setFlowState(prev => ({
      ...prev,
      quizCorrect: prev.quizCorrect + (correct ? 1 : 0),
      quizTotal: prev.quizTotal + 1
    }));
  };

  // Group departments by region
  const departmentsByRegion = colombiaDepartments.reduce((acc, dept) => {
    if (!acc[dept.region]) acc[dept.region] = [];
    acc[dept.region].push(dept);
    return acc;
  }, {} as Record<string, Department[]>);

  // Filter by focused region if set
  const displayDepartments = flowState.focusedRegion
    ? { [flowState.focusedRegion]: departmentsByRegion[flowState.focusedRegion] }
    : departmentsByRegion;

  const studyProgress = (flowState.studiedDepartments.size / colombiaDepartments.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <Card
        variant="elevated"
        padding="none"
        className={cn("w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden shadow-2xl")}
      >
        {/* Enhanced Header with Flow Indicators */}
        <div
          className="bg-gradient-to-r from-sky-500 to-green-500 text-white p-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2
                className="text-3xl font-bold leading-tight text-white"
              >
                📚 Modo de Estudio Mejorado
              </h2>
              <p
                className="text-sm text-white opacity-90"
              >
                {flowState.phase === 'explore' && 'Explora los departamentos de Colombia'}
                {flowState.phase === 'focus' && `Enfocado en: ${flowState.focusedRegion || 'Selecciona una región'}`}
                {flowState.phase === 'quiz' && 'Prueba tus conocimientos'}
                {flowState.phase === 'ready' && '¡Listo para jugar!'}
              </p>
            </div>
            <div className="flex gap-1">
              {/* Flow Phase Indicators */}
              <div
                className="flex items-center rounded-lg bg-white/20 gap-0.5 px-2 py-0.5"
              >
                <span
                  className={`rounded-full w-1 h-1 ${flowState.phase === 'explore' ? 'bg-white' : 'bg-white/40'}`}
                />
                <span
                  className={`rounded-full w-1 h-1 ${flowState.phase === 'focus' ? 'bg-white' : 'bg-white/40'}`}
                />
                <span
                  className={`rounded-full w-1 h-1 ${flowState.phase === 'quiz' ? 'bg-white' : 'bg-white/40'}`}
                />
                <span
                  className={`rounded-full w-1 h-1 ${flowState.phase === 'ready' ? 'bg-white' : 'bg-white/40'}`}
                />
              </div>
              <Button
                onClick={() => setViewMode(
                  viewMode === 'cards' ? 'grid' :
                  viewMode === 'grid' ? 'map' : 'cards'
                )}
                variant="ghost"
                className="bg-white/20 hover:bg-white/30 text-white border-none"
              >
                {viewMode === 'cards' ? '📋 Vista Cuadrícula' :
                 viewMode === 'grid' ? '🗺️ Vista Mapa' : '🃏 Vista Tarjetas'}
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                className="bg-white/20 hover:bg-white/30 text-white border-none"
              >
                ✕ Cerrar
              </Button>
            </div>
          </div>

          {/* Enhanced Progress with Milestones */}
          <div className="mt-2">
            <div className="bg-white/20 rounded-full relative h-2">
              <div
                className="bg-white rounded-full transition-all duration-500 relative h-2"
                style={{ width: `${studyProgress}%` }}
              >
                {/* Milestone markers */}
                {[25, 50, 75].map(milestone => (
                  <div
                    key={milestone}
                    className={`absolute top-1/2 -translate-y-1/2 rounded-full w-1 h-1 ${
                      studyProgress >= milestone ? 'bg-yellow-400' : 'bg-white/40'
                    }`}
                    style={{
                      left: `${(milestone / 100) * (100 / (studyProgress / 100))}%`
                    }}
                  />
                ))}
              </div>
            </div>
            <div
              className="flex justify-between text-xs mt-0.5 text-white"
            >
              <span>Inicio</span>
              <span>{flowState.studiedDepartments.size}/{colombiaDepartments.length}</span>
              <span>Maestría</span>
            </div>
          </div>
        </div>

        {/* Smart Action Bar */}
        {showQuickActions && (
          <div
            className="border-b border-sky-200 bg-sky-50 flex items-center justify-between px-3 py-1"
          >
            <div className="flex items-center gap-1">
              <span className="text-sm text-sky-700">
                Acciones Rápidas:
              </span>
              <Button
                onClick={handleStartPractice}
                variant="primary"
                size="sm"
                className="bg-green-500 border-green-500 hover:bg-green-600"
              >
                🎯 Practicar Región Estudiada
              </Button>
              <Button
                onClick={() => setFlowState(prev => ({ ...prev, phase: 'quiz' }))}
                variant="primary"
                size="sm"
                className="bg-violet-500 border-violet-500 hover:bg-violet-600"
              >
                🧠 Mini Quiz
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              💡 Has estudiado suficientes departamentos para practicar
            </div>
          </div>
        )}

        <div className="flex flex-1 min-h-0">
          {/* Left Panel - Interactive Department Explorer */}
          <div
            className="flex-1 overflow-y-auto border-r border-gray-200 p-3"
          >
            {/* Region Filter Tabs */}
            <div
              className="flex overflow-x-auto gap-1 mb-3 pb-1"
            >
              <Button
                onClick={() => setFlowState(prev => ({ ...prev, focusedRegion: null }))}
                variant={!flowState.focusedRegion ? 'primary' : 'secondary'}
                size="sm"
                className="whitespace-nowrap"
              >
                Todas las Regiones
              </Button>
              {Object.keys(departmentsByRegion).map(region => (
                <Button
                  key={region}
                  onClick={() => handleRegionFocus(region)}
                  variant={flowState.focusedRegion === region ? 'primary' : 'secondary'}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {region} ({departmentsByRegion[region].length})
                </Button>
              ))}
            </div>

            {/* Enhanced Card View */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(displayDepartments).flatMap(([region, depts]) =>
                  depts.map(dept => (
                    <Card
                      key={dept.id}
                      onClick={() => handleDepartmentClick(dept)}
                      variant="default"
                      padding="none"
                      hover
                      className={cn(
                        'relative cursor-pointer overflow-hidden group transition-all',
                        selectedDepartment?.id === dept.id && 'ring-2',
                        selectedDepartment?.id === dept.id && `ring-[${colors.brand[500]}]`
                      )}
                    >
                      {/* Region color bar */}
                      <div
                        className="w-full h-1"
                        style={{
                          backgroundColor: REGION_COLORS[dept.region] || 'rgb(229 231 235)'
                        }}
                      />

                      <CardContent className="p-3">
                        <CardHeader className="flex-row justify-between items-start mb-1">
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            {dept.name}
                          </CardTitle>
                          {flowState.studiedDepartments.has(dept.id) && (
                            <span className="text-green-500">✓</span>
                          )}
                        </CardHeader>
                        <CardDescription className="text-sm text-gray-600 mb-0.5">
                          Capital: {dept.capital}
                        </CardDescription>
                        <p className="text-xs text-gray-500">
                          {dept.region}
                        </p>

                        {/* Quick stats on hover */}
                        <div
                          className="border-t opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            marginTop: spacing[3],
                            paddingTop: spacing[3],
                            borderColor: colors.gray[100]
                          }}
                        >
                          <div
                            className="flex justify-between"
                            style={{
                              fontSize: textStyles.caption.fontSize[0],
                              color: colors.text.secondary
                            }}
                          >
                            <span>Área: {dept.area.toLocaleString()} km²</span>
                            <span>Pop: {(dept.population / 1000000).toFixed(1)}M</span>
                          </div>
                        </div>
                      </CardContent>

                      {/* Study progress indicator */}
                      {flowState.studiedDepartments.has(dept.id) && (
                        <Badge
                          variant="success"
                          size="sm"
                          className="absolute"
                          style={{
                            top: spacing[2],
                            right: spacing[2]
                          }}
                        >
                          Estudiado
                        </Badge>
                      )}
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="flex flex-col gap-6 pb-4">
                {Object.entries(displayDepartments).map(([region, depts]) => (
                  <div key={region} className="space-y-3">
                    {/* Region label - full width with clear separation */}
                    <div className="w-full">
                      <div className="px-3 py-2 bg-gray-100 rounded-md inline-flex items-center">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          {region}
                        </h3>
                        <span className="ml-2 text-sm text-gray-500">
                          ({depts.length} departamentos)
                        </span>
                      </div>
                    </div>

                    {/* Department grid with clear spacing from label */}
                    <div className="grid grid-cols-3 gap-3">
                      {depts.map(dept => (
                        <Button
                          key={dept.id}
                          onClick={() => handleDepartmentClick(dept)}
                          variant={flowState.studiedDepartments.has(dept.id) ? 'secondary' : 'ghost'}
                          className={cn(
                            'text-left transition-all hover:scale-105 p-3 h-auto min-h-[70px]',
                            'border border-gray-200 rounded-lg relative',
                            flowState.studiedDepartments.has(dept.id) && 'bg-green-50 border-green-300',
                            selectedDepartment?.id === dept.id && 'ring-2 scale-105 shadow-lg z-10',
                            selectedDepartment?.id === dept.id && `ring-[${colors.brand[500]}]`
                          )}
                          style={{
                            backgroundColor: flowState.studiedDepartments.has(dept.id)
                              ? 'rgb(240 253 244)'
                              : selectedDepartment?.id === dept.id
                              ? colors.brand[50]
                              : 'white'
                          }}
                        >
                          <div className="flex flex-col items-start gap-1">
                            <div className="text-sm font-semibold text-gray-900 leading-tight">
                              {dept.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Capital: {dept.capital}
                            </div>
                            <div
                              className="text-xs font-medium"
                              style={{ color: REGION_COLORS[dept.region] || colors.text.secondary }}
                            >
                              {dept.region}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Map View */}
            {viewMode === 'map' && (
              <StudyModeMap
                selectedDepartment={selectedDepartment}
                studiedDepartments={flowState.studiedDepartments}
                onDepartmentClick={handleDepartmentClick}
                departments={colombiaDepartments}
                focusedRegion={flowState.focusedRegion}
              />
            )}
          </div>

          {/* Right Panel - Smart Information Display */}
          <div
            className="w-1/3 overflow-hidden flex flex-col bg-gray-50"
          >
            {selectedDepartment ? (
              <div
                className="flex-1 overflow-y-auto flex flex-col p-3 gap-3"
              >
                {/* Department Header Card */}
                <Card
                  variant="outlined"
                  padding="md"
                  className="relative"
                  style={{
                    borderColor: REGION_COLORS[selectedDepartment.region] || colors.surface.border,
                    borderWidth: '2px'
                  }}
                >
                  <CardHeader className="flex-row justify-between items-start">
                    <div>
                      <CardTitle className="text-3xl font-bold text-gray-900">
                        {selectedDepartment.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {selectedDepartment.region}
                      </CardDescription>
                    </div>

                    {/* Study Status */}
                    <div className="text-3xl">
                      {flowState.studiedDepartments.has(selectedDepartment.id) ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-gray-300">○</span>
                      )}
                    </div>
                  </CardHeader>
                </Card>


                {/* Information Cards */}
                <Card variant="default" padding="md">
                  <CardHeader className="mb-2">
                    <CardTitle className="flex items-center text-base font-semibold text-gray-600 gap-1">
                      <span className="text-xl">📍</span>
                      Información Geográfica
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="flex flex-col gap-1">
                      <div
                        className="flex justify-between border-b border-gray-100 pb-0.5"
                      >
                        <dt className="text-sm text-gray-600">
                          Capital:
                        </dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {selectedDepartment.capital}
                        </dd>
                      </div>
                      <div
                        className="flex justify-between border-b border-gray-100 pb-0.5"
                      >
                        <dt className="text-sm text-gray-600">
                          Área:
                        </dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {selectedDepartment.area.toLocaleString()} km²
                        </dd>
                      </div>
                      <div
                        className="flex justify-between border-b border-gray-100 pb-0.5"
                      >
                        <dt className="text-sm text-gray-600">
                          Población:
                        </dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {selectedDepartment.population.toLocaleString()}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">
                          Densidad:
                        </dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {Math.round(selectedDepartment.population / selectedDepartment.area)} hab/km²
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                {/* Trivia Card */}
                <Card
                  variant="default"
                  padding="md"
                  className="bg-gradient-to-br from-gray-100 to-cyan-50"
                >
                  <CardHeader className="mb-1">
                    <CardTitle className="flex items-center text-base font-semibold text-gray-600 gap-1">
                      <span className="text-xl">💡</span>
                      Dato Curioso
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="italic text-sm text-gray-600">
                      {selectedDepartment.trivia}
                    </p>
                  </CardContent>
                </Card>

                {/* Historia y Contexto Section */}
                {(() => {
                  const education = getDepartmentEducation(selectedDepartment.id);
                  if (education) {
                    return (
                      <>
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg shadow">
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <span className="text-xl">📜</span> Historia y Contexto
                          </h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {education.historiaContexto}
                          </p>
                        </div>

                        {/* Importancia Económica Section */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg shadow">
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <span className="text-xl">💰</span> Importancia Económica
                          </h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {education.importanciaEconomica}
                          </p>
                        </div>

                        {/* Características Únicas Section */}
                        <div className="bg-gradient-to-br from-sky-50 to-indigo-50 p-4 rounded-lg shadow">
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <span className="text-xl">⭐</span> Características Únicas
                          </h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {education.caracteristicasUnicas}
                          </p>
                        </div>

                        {/* Patrimonio Cultural Section */}
                        <div className="bg-gradient-to-br from-violet-50 to-pink-50 p-4 rounded-lg shadow">
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <span className="text-xl">🎭</span> Patrimonio Cultural
                          </h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {education.patrimonioCultural}
                          </p>
                        </div>

                        {/* Datos Específicos */}
                        {education.datosEspecificos && (
                          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-sky-500">
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <span className="text-xl">📊</span> Datos Específicos
                            </h4>
                            <div className="grid grid-cols-1 gap-3 text-sm">
                              {education.datosEspecificos.fechaCreacion && (
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                  <dt className="text-gray-600 font-medium">Fecha de Creación:</dt>
                                  <dd className="font-semibold text-sky-700">{education.datosEspecificos.fechaCreacion}</dd>
                                </div>
                              )}
                              {education.datosEspecificos.poblacionIndigena && (
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                  <dt className="text-gray-600 font-medium">Población Indígena:</dt>
                                  <dd className="font-semibold text-green-700">{education.datosEspecificos.poblacionIndigena}</dd>
                                </div>
                              )}
                              {education.datosEspecificos.clima && (
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                  <dt className="text-gray-600 font-medium">Clima:</dt>
                                  <dd className="font-semibold text-orange-700">{education.datosEspecificos.clima}</dd>
                                </div>
                              )}
                              {education.datosEspecificos.altitud && (
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                  <dt className="text-gray-600 font-medium">Altitud:</dt>
                                  <dd className="font-semibold text-violet-700">{education.datosEspecificos.altitud}</dd>
                                </div>
                              )}
                              {education.datosEspecificos.patrimonioUNESCO && education.datosEspecificos.patrimonioUNESCO.length > 0 && (
                                <div className="py-1">
                                  <dt className="text-gray-600 font-medium mb-1">Patrimonio UNESCO:</dt>
                                  <dd className="space-y-1">
                                    {education.datosEspecificos.patrimonioUNESCO.map((item, index) => (
                                      <div key={index} className="bg-yellow-100 px-2 py-1 rounded text-xs font-semibold text-yellow-800">
                                        🏆 {item}
                                      </div>
                                    ))}
                                  </dd>
                                </div>
                              )}
                              {education.datosEspecificos.industrias && education.datosEspecificos.industrias.length > 0 && (
                                <div className="py-1">
                                  <dt className="text-gray-600 font-medium mb-1">Principales Industrias:</dt>
                                  <dd className="flex flex-wrap gap-1">
                                    {education.datosEspecificos.industrias.map((industry, index) => (
                                      <span key={index} className="bg-sky-100 px-2 py-1 rounded text-xs font-semibold text-sky-800">
                                        {industry}
                                      </span>
                                    ))}
                                  </dd>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Regional Context */}
                        {(() => {
                          const regionalNarrative = getRegionalNarrative(selectedDepartment.region);
                          if (regionalNarrative) {
                            return (
                              <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-4 rounded-lg shadow">
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                  <span className="text-xl">🌍</span> Contexto Regional: {selectedDepartment.region}
                                </h4>
                                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                                  {regionalNarrative.introduction}
                                </p>
                                <div className="bg-white p-3 rounded border-l-4 border-indigo-400">
                                  <h5 className="font-semibold text-indigo-800 text-sm mb-1">Identidad Cultural Regional:</h5>
                                  <p className="text-xs text-indigo-700">{regionalNarrative.culturalIdentity}</p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </>
                    );
                  }
                  return null;
                })()}

                {/* Enhanced Memory Aids */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-xl">🧠</span> Trucos para Recordar
                  </h4>
                  {(() => {
                    const memoryAid = getMemoryAid(selectedDepartment.name);
                    if (memoryAid) {
                      return (
                        <div className="space-y-3">
                          {/* Visual Association with Mini Map */}
                          <div className="bg-sky-50 p-3 rounded-lg">
                            <h5 className="font-semibold text-sky-800 text-sm mb-2">Asociación Visual:</h5>
                            <div className="flex items-start gap-3">
                              <MiniDepartmentShape
                                departmentName={selectedDepartment.name}
                                width={80}
                                height={80}
                                className="flex-shrink-0 border-2 border-sky-200 rounded-lg"
                              />
                              <p className="text-sm text-sky-700 flex-1">{memoryAid.visualAssociation}</p>
                            </div>
                          </div>

                          {/* Geographic Trick */}
                          <div className="bg-green-50 p-3 rounded-lg">
                            <h5 className="font-semibold text-green-800 text-sm mb-1">Ubicación Geográfica:</h5>
                            <p className="text-sm text-green-700">{memoryAid.geographicTrick}</p>
                          </div>

                          {/* Cultural Fact */}
                          <div className="bg-violet-50 p-3 rounded-lg">
                            <h5 className="font-semibold text-violet-800 text-sm mb-1">Dato Cultural Memorable:</h5>
                            <p className="text-sm text-violet-700">{memoryAid.culturalFact}</p>
                          </div>

                          {/* Mnemonic */}
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <h5 className="font-semibold text-orange-800 text-sm mb-1">Mnemotécnica:</h5>
                            <p className="text-sm text-orange-700 font-mono">{memoryAid.mnemonic}</p>
                          </div>

                          {/* Rhyme if available */}
                          {memoryAid.rhyme && (
                            <div className="bg-pink-50 p-3 rounded-lg">
                              <h5 className="font-semibold text-pink-800 text-sm mb-1">Rima:</h5>
                              <p className="text-sm text-pink-700 italic">"{memoryAid.rhyme}"</p>
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Fallback to basic memory aids if no enhanced aid is available
                    return (
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500">•</span>
                          <span>Primera letra: <span className="font-bold text-lg">{selectedDepartment.name[0]}</span></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500">•</span>
                          <span>Región: <span className="font-semibold">{selectedDepartment.region}</span></span>
                        </li>
                        {selectedDepartment.name.includes(' ') && (
                          <li className="flex items-start gap-2">
                            <span className="text-sky-500">•</span>
                            <span>Es un nombre compuesto</span>
                          </li>
                        )}
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500">•</span>
                          <span>Capital empieza con: <span className="font-bold">{selectedDepartment.capital[0]}</span></span>
                        </li>
                      </ul>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {flowState.phase === 'explore' && '🗺️'}
                    {flowState.phase === 'focus' && '🎯'}
                    {flowState.phase === 'quiz' && '🧠'}
                    {flowState.phase === 'ready' && '🚀'}
                  </div>
                  <p className="text-lg font-semibold text-gray-700">
                    {flowState.phase === 'explore' && 'Explora los Departamentos'}
                    {flowState.phase === 'focus' && 'Enfócate en una Región'}
                    {flowState.phase === 'quiz' && 'Prueba tus Conocimientos'}
                    {flowState.phase === 'ready' && '¡Listo para el Desafío!'}
                  </p>
                  <p className="text-sm mt-2 text-gray-500 max-w-xs mx-auto">
                    {flowState.phase === 'explore' && 'Haz clic en cualquier departamento para comenzar tu viaje de aprendizaje'}
                    {flowState.phase === 'focus' && 'Selecciona una región arriba para estudiar en profundidad'}
                    {flowState.phase === 'quiz' && 'Responde preguntas rápidas para reforzar tu conocimiento'}
                    {flowState.phase === 'ready' && 'Has estudiado suficiente. ¡Es hora de jugar!'}
                  </p>
                </div>
              </div>
            )}

            {/* Smart Action Footer */}
            <div
              className="border-t border-gray-200 bg-white flex p-3 gap-1"
            >
              {studyProgress >= 60 && (
                <Button
                  onClick={() => {
                    game.setGameMode({ type: 'full' });
                    onStartGame();
                  }}
                  variant="primary"
                  fullWidth
                  className="bg-gradient-to-r from-sky-500 to-green-500 hover:shadow-lg"
                >
                  Juego Completo
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}