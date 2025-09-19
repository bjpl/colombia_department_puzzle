import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { colombiaDepartments } from '../data/colombiaDepartments';

interface InteractiveTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface TutorialStep {
  id: number;
  title: string;
  content: string;
  action?: string;
  highlightArea?: string;
  showPractice?: boolean;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "¡Bienvenido al Rompecabezas de Colombia!",
    content: "Aprende los 32 departamentos de Colombia de manera divertida e interactiva. Este tutorial te enseñará cómo jugar.",
    action: "Empezar Tutorial",
  },
  {
    id: 2,
    title: "El Mapa de Colombia",
    content: "Este es el mapa de Colombia dividido en departamentos. Cada departamento tiene un color según su región: Andina (verde), Caribe (azul), Pacífica (púrpura), Orinoquía (amarillo), Amazonía (esmeralda).",
    highlightArea: "map",
  },
  {
    id: 3,
    title: "Cómo Jugar",
    content: "Los departamentos aparecen en el panel izquierdo. Arrastra cada departamento y suéltalo en su ubicación correcta en el mapa.",
    highlightArea: "tray",
  },
  {
    id: 4,
    title: "¡Practiquemos!",
    content: "Intenta colocar Cundinamarca (donde está Bogotá, la capital) en el mapa. Es uno de los departamentos más fáciles de identificar.",
    showPractice: true,
  },
  {
    id: 5,
    title: "Sistema de Puntuación",
    content: "Ganas 100 puntos por cada departamento correcto. Los puntos disminuyen con cada intento fallido. ¡Intenta ser preciso!",
    highlightArea: "score",
  },
  {
    id: 6,
    title: "Sistema de Pistas",
    content: "Si te atascas, puedes usar pistas progresivas: Ver la región (10 pts), Primera letra (20 pts), o Ubicación exacta (50 pts).",
    highlightArea: "hints",
  },
  {
    id: 7,
    title: "Modo de Estudio",
    content: "Antes de jugar, puedes usar el Modo de Estudio para aprender sobre cada departamento: capital, área, población y datos curiosos.",
    action: "Ver Modo de Estudio",
  },
  {
    id: 8,
    title: "¡Estás Listo!",
    content: "Ya conoces todo lo necesario para jugar. ¿Podrás completar los 32 departamentos? ¡Buena suerte!",
    action: "Comenzar a Jugar",
  },
];

export default function InteractiveTutorial({ onComplete, onSkip }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const step = tutorialSteps[currentStep];

  useEffect(() => {
    // Mark tutorial as shown in storage
    const settings = storage.getSettings();
    settings.tutorialShown = true;
    storage.saveSetting('tutorialShown', true);
  }, []);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      onComplete();
    }
  };

  const handlePracticeComplete = () => {
    setPracticeCompleted(true);
  };

  const canProceed = () => {
    if (step.showPractice) {
      return practiceCompleted;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* Tutorial Card */}
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ${
        isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Tutorial Interactivo</h2>
            <button
              onClick={onSkip}
              className="text-white/80 hover:text-white text-sm underline"
            >
              Saltar Tutorial
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>
          <p className="text-xs mt-2 text-white/90">
            Paso {currentStep + 1} de {tutorialSteps.length}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Step Icon */}
          <div className="text-6xl mb-4 text-center">
            {currentStep === 0 && '👋'}
            {currentStep === 1 && '🗺️'}
            {currentStep === 2 && '🎯'}
            {currentStep === 3 && '🎮'}
            {currentStep === 4 && '💯'}
            {currentStep === 5 && '💡'}
            {currentStep === 6 && '📚'}
            {currentStep === 7 && '🚀'}
          </div>

          {/* Step Title */}
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
            {step.title}
          </h3>

          {/* Step Content */}
          <p className="text-gray-600 text-center text-lg leading-relaxed mb-6">
            {step.content}
          </p>

          {/* Practice Area */}
          {step.showPractice && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6 border-2 border-blue-300">
              <div className="text-center">
                {!practiceCompleted ? (
                  <>
                    <div className="text-4xl mb-3">🏛️</div>
                    <p className="font-semibold text-blue-700 mb-2">
                      Cundinamarca - Capital: Bogotá
                    </p>
                    <p className="text-sm text-blue-600 mb-4">
                      Está en el centro del país, en la región Andina (verde)
                    </p>
                    <button
                      onClick={handlePracticeComplete}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Simular Colocación Correcta
                    </button>
                  </>
                ) : (
                  <div className="text-green-600">
                    <div className="text-4xl mb-2">✅</div>
                    <p className="font-semibold">¡Excelente! Has colocado Cundinamarca correctamente.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Visual Hints for highlighted areas */}
          {step.highlightArea && (
            <div className="bg-yellow-50 rounded-lg p-4 mb-6 border-l-4 border-yellow-400">
              <p className="text-sm text-yellow-700">
                💡 <strong>Mira:</strong> El área resaltada muestra {
                  step.highlightArea === 'map' ? 'el mapa donde colocarás los departamentos' :
                  step.highlightArea === 'tray' ? 'el panel con los departamentos disponibles' :
                  step.highlightArea === 'score' ? 'tu puntuación actual' :
                  step.highlightArea === 'hints' ? 'el panel de pistas disponibles' :
                  'la sección importante'
                }
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentStep === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              ← Anterior
            </button>

            <div className="flex gap-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-500'
                      : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                canProceed()
                  ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-lg transform hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentStep === tutorialSteps.length - 1 ? '¡Comenzar!' : 'Siguiente →'}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay indicators for highlighted areas (visual only) */}
      {step.highlightArea && (
        <div className="fixed inset-0 pointer-events-none">
          {step.highlightArea === 'map' && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-4 border-yellow-400 rounded-lg animate-pulse" />
          )}
          {step.highlightArea === 'tray' && (
            <div className="absolute left-4 top-32 w-52 h-96 border-4 border-yellow-400 rounded-lg animate-pulse" />
          )}
          {step.highlightArea === 'score' && (
            <div className="absolute top-20 right-96 w-24 h-16 border-4 border-yellow-400 rounded-lg animate-pulse" />
          )}
          {step.highlightArea === 'hints' && (
            <div className="absolute right-4 top-32 w-52 h-64 border-4 border-yellow-400 rounded-lg animate-pulse" />
          )}
        </div>
      )}
    </div>
  );
}