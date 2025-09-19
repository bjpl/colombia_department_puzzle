import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';

interface InteractiveTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface TutorialStep {
  id: number;
  title: string;
  content: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-bottom' | 'center-top';
  highlightArea?: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
  arrow?: {
    direction: 'up' | 'down' | 'left' | 'right';
    targetX?: string;
    targetY?: string;
  };
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "¡Bienvenido! 👋",
    content: "Aprende los 32 departamentos de Colombia arrastrando y soltando.",
    position: 'center-bottom',
  },
  {
    id: 2,
    title: "El Mapa 🗺️",
    content: "Cada color representa una región: Andina (verde), Caribe (azul), Pacífica (púrpura).",
    position: 'bottom-right',
    highlightArea: {
      top: '50%',
      left: '50%',
      width: '600px',
      height: '500px'
    },
    arrow: {
      direction: 'up',
      targetX: '50%',
      targetY: '40%'
    }
  },
  {
    id: 3,
    title: "Departamentos 📍",
    content: "Arrastra los departamentos desde aquí hacia su ubicación correcta.",
    position: 'top-left',
    highlightArea: {
      top: '140px',
      left: '20px',
      width: '280px',
      height: '500px'
    },
    arrow: {
      direction: 'left',
      targetX: '150px',
      targetY: '300px'
    }
  },
  {
    id: 4,
    title: "Puntuación 💯",
    content: "100 pts por acierto. Pierde puntos con cada intento fallido.",
    position: 'top-right',
    arrow: {
      direction: 'up',
      targetX: '50%',
      targetY: '80px'
    }
  },
  {
    id: 5,
    title: "Pistas 💡",
    content: "¿Atascado? Usa pistas: Región (10pts), Primera letra (20pts), Ubicación (50pts).",
    position: 'bottom-right',
    highlightArea: {
      top: '140px',
      left: 'auto',
      width: '280px',
      height: '300px'
    }
  },
  {
    id: 6,
    title: "¡A jugar! 🚀",
    content: "Completa los 32 departamentos. ¡Buena suerte!",
    position: 'center-bottom',
  }
];

export default function InteractiveTutorial({ onComplete, onSkip }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const step = tutorialSteps[currentStep];

  useEffect(() => {
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
      }, 200);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  // Position classes based on step position
  const getPositionClasses = () => {
    const positions = {
      'top-left': 'top-24 left-6',
      'top-right': 'top-24 right-6',
      'bottom-left': 'bottom-6 left-6',
      'bottom-right': 'bottom-6 right-6',
      'center-bottom': 'bottom-6 left-1/2 -translate-x-1/2',
      'center-top': 'top-24 left-1/2 -translate-x-1/2'
    };
    return positions[step.position];
  };

  return (
    <>
      {/* Dark overlay with cutout for highlighted area */}
      <div className="fixed inset-0 z-40 pointer-events-none">
        {step.highlightArea && (
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <mask id="spotlight">
                <rect width="100%" height="100%" fill="white" />
                <rect
                  x={`calc(${step.highlightArea.left} - ${parseInt(step.highlightArea.width) / 2}px)`}
                  y={`calc(${step.highlightArea.top} - ${parseInt(step.highlightArea.height) / 2}px)`}
                  width={step.highlightArea.width}
                  height={step.highlightArea.height}
                  rx="12"
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.6)"
              mask="url(#spotlight)"
            />
          </svg>
        )}
        {!step.highlightArea && (
          <div className="absolute inset-0 bg-black/30" />
        )}
      </div>

      {/* Highlight border animation */}
      {step.highlightArea && (
        <div
          className="fixed z-40 border-3 border-yellow-400 rounded-xl pointer-events-none animate-pulse"
          style={{
            top: `calc(${step.highlightArea.top} - ${parseInt(step.highlightArea.height) / 2}px)`,
            left: step.highlightArea.left === 'auto'
              ? 'auto'
              : `calc(${step.highlightArea.left} - ${parseInt(step.highlightArea.width) / 2}px)`,
            right: step.highlightArea.left === 'auto' ? '20px' : 'auto',
            width: step.highlightArea.width,
            height: step.highlightArea.height,
          }}
        />
      )}

      {/* Arrow pointer */}
      {step.arrow && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: step.arrow.targetX,
            top: step.arrow.targetY,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className={`
            w-0 h-0 animate-bounce
            ${step.arrow.direction === 'up' ? 'border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-yellow-400' : ''}
            ${step.arrow.direction === 'down' ? 'border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-yellow-400' : ''}
            ${step.arrow.direction === 'left' ? 'border-t-[20px] border-t-transparent border-b-[20px] border-b-transparent border-r-[30px] border-r-yellow-400' : ''}
            ${step.arrow.direction === 'right' ? 'border-t-[20px] border-t-transparent border-b-[20px] border-b-transparent border-l-[30px] border-l-yellow-400' : ''}
          `} />
        </div>
      )}

      {/* Compact floating tutorial card */}
      <div className={`
        fixed z-50
        ${getPositionClasses()}
        transition-all duration-300 ease-out
        ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
      `}>
        <div className="
          bg-white/95 backdrop-blur-xl
          rounded-2xl shadow-2xl
          border border-white/50
          p-6
          max-w-sm
          transform hover:scale-105 transition-transform
        ">
          {/* Minimalist header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{step.title.split(' ')[1]}</span>
              <h3 className="text-lg font-bold text-gray-900">
                {step.title.split(' ')[0]}
              </h3>
            </div>
            <button
              onClick={onSkip}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Skip tutorial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <p className="text-gray-700 text-sm mb-4 leading-relaxed">
            {step.content}
          </p>

          {/* Progress dots */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`
                    h-1.5 rounded-full transition-all duration-300
                    ${index === currentStep
                      ? 'w-6 bg-gradient-to-r from-blue-500 to-green-500'
                      : index < currentStep
                      ? 'w-1.5 bg-green-500'
                      : 'w-1.5 bg-gray-300'}
                  `}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="
                    px-3 py-1.5
                    text-sm text-gray-600
                    hover:text-gray-900
                    transition-colors
                  "
                >
                  ← Atrás
                </button>
              )}
              <button
                onClick={handleNext}
                className="
                  px-4 py-1.5
                  text-sm font-medium
                  bg-gradient-to-r from-blue-500 to-green-500
                  text-white rounded-lg
                  hover:shadow-lg transform hover:scale-105
                  transition-all duration-200
                "
              >
                {currentStep === tutorialSteps.length - 1 ? '¡Comenzar!' : 'Siguiente →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}