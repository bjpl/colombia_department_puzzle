import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import {
  Button, Card, CardHeader, CardTitle, CardContent, Badge,
  colors, spacing, textStyles, shadows, radius
} from '../design-system';

interface InteractiveTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface TutorialStep {
  id: number;
  title: string;
  content: string;
  position: 'floating' | 'anchored-left' | 'anchored-right' | 'anchored-center';
  anchor?: { x: string; y: string };
  spotlight?: {
    x: string;
    y: string;
    width: string;
    height: string;
  };
  beacon?: {
    x: string;
    y: string;
  };
  animation?: 'celebration' | 'swipe-up' | 'tap';
  waitForAction?: 'tap' | 'placement' | 'sheet-expand';
  successMessage?: string;
  target?: string;
  highlightElement?: boolean;
  duration?: number;
}

const desktopTutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Bienvenido",
    content: "Aprende los 32 departamentos de Colombia de forma interactiva",
    position: 'floating',
  },
  {
    id: 2,
    title: "El Mapa",
    content: "Cada región tiene su color: Andina, Caribe, Pacífica",
    position: 'anchored-center',
    anchor: { x: '50%', y: '60%' },
    spotlight: {
      x: '50%',
      y: '50%',
      width: '600px',
      height: '450px'
    },
    beacon: {
      x: '50%',
      y: '50%'
    }
  },
  {
    id: 3,
    title: "Departamentos",
    content: "Arrastra desde aquí hacia el mapa",
    position: 'anchored-left',
    anchor: { x: '280px', y: '350px' },
    spotlight: {
      x: '160px',
      y: '380px',
      width: '300px',
      height: '520px'
    },
    beacon: {
      x: '160px',
      y: '250px'
    }
  },
  {
    id: 4,
    title: "Puntuación",
    content: "100 puntos por ubicación correcta",
    position: 'anchored-center',
    anchor: { x: '50%', y: '120px' },
    beacon: {
      x: '50%',
      y: '70px'
    }
  },
  {
    id: 5,
    title: "Pistas",
    content: "Usa ayudas cuando lo necesites",
    position: 'anchored-right',
    anchor: { x: 'calc(100% - 280px)', y: '350px' },
    spotlight: {
      x: 'calc(100% - 160px)',
      y: '300px',
      width: '300px',
      height: '320px'
    }
  },
  {
    id: 6,
    title: "¡Comienza!",
    content: "Completa el mapa de Colombia",
    position: 'floating',
  }
];

const mobileTutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "¡Bienvenido! 🎯",
    content: "Este juego está optimizado para tu dispositivo táctil",
    position: 'floating',
    animation: 'celebration',
    duration: 2000,
  },
  {
    id: 2,
    title: "Toca un departamento",
    content: "Toca cualquier ficha de departamento en la parte inferior",
    position: 'floating',
    target: '.department-chip:first-child',
    highlightElement: true,
    waitForAction: 'tap',
    successMessage: '¡Perfecto! ✓',
  },
  {
    id: 3,
    title: "Toca el mapa",
    content: "Ahora toca en cualquier lugar del mapa para colocarlo",
    position: 'floating',
    target: '.map-container',
    highlightElement: true,
    waitForAction: 'placement',
    successMessage: '¡Excelente! 🎉',
  },
  {
    id: 4,
    title: "Desliza para más",
    content: "Desliza hacia arriba la bandeja inferior para ver todos los departamentos",
    position: 'floating',
    target: '.bottom-sheet-handle',
    animation: 'swipe-up',
    waitForAction: 'sheet-expand',
    successMessage: '¡Estás listo! 🚀',
  }
];

export default function InteractiveTutorial({ onComplete, onSkip }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(mobileCheck || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const tutorialSteps = isMobile ? mobileTutorialSteps : desktopTutorialSteps;
  const step = tutorialSteps[currentStep];

  useEffect(() => {
    // Only mark tutorial as shown when completed, not when opened
    return () => {
      // Cleanup function runs when component unmounts
    };
  }, []);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      // Mark tutorial as completed only when user finishes it
      const storageKey = isMobile ? 'tutorialShown-mobile' : 'tutorialShown';
      storage.saveSetting(storageKey, true);
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  // Calculate card position based on anchor or centered
  const getCardStyle = () => {
    if (step.position === 'floating') {
      return {
        left: '50%',
        bottom: '40px',
        transform: 'translateX(-50%)'
      };
    }

    if (step.anchor) {
      const baseStyle: React.CSSProperties = {
        position: 'fixed' as const,
      };

      if (step.position === 'anchored-left') {
        return {
          ...baseStyle,
          left: step.anchor.x,
          top: step.anchor.y,
          transform: 'translate(20px, -50%)'
        };
      } else if (step.position === 'anchored-right') {
        return {
          ...baseStyle,
          left: step.anchor.x,
          top: step.anchor.y,
          transform: 'translate(-100%, -50%)'
        };
      } else {
        return {
          ...baseStyle,
          left: step.anchor.x,
          top: step.anchor.y,
          transform: 'translate(-50%, 20px)'
        };
      }
    }

    return {};
  };

  return (
    <>
      {/* Elegant overlay with spotlight */}
      <div className="fixed inset-0 z-40 pointer-events-none">
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-500 ${
            step.spotlight ? 'opacity-50' : 'opacity-30'
          }`}
        />

        {/* Spotlight gradient */}
        {step.spotlight && (
          <div
            className="absolute rounded-2xl"
            style={{
              left: step.spotlight.x,
              top: step.spotlight.y,
              width: step.spotlight.width,
              height: step.spotlight.height,
              transform: 'translate(-50%, -50%)',
              background: `
                radial-gradient(
                  ellipse at center,
                  transparent 0%,
                  transparent 40%,
                  rgba(0, 0, 0, 0.1) 50%,
                  rgba(0, 0, 0, 0.5) 100%
                )
              `,
              boxShadow: '0 0 0 100vmax rgba(0, 0, 0, 0.5)',
              mixBlendMode: 'multiply'
            }}
          />
        )}
      </div>

      {/* Elegant beacon pulse */}
      {step.beacon && (
        <div
          className="fixed z-45 pointer-events-none"
          style={{
            left: step.beacon.x,
            top: step.beacon.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Outer ring */}
          <div className="absolute w-12 h-12 -inset-6">
            <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-ping" />
          </div>
          {/* Middle ring */}
          <div className="absolute w-8 h-8 -inset-4">
            <div className="absolute inset-0 bg-white rounded-full opacity-40 animate-ping animation-delay-200" />
          </div>
          {/* Core */}
          <div className="relative w-4 h-4">
            <div className="absolute inset-0 bg-white rounded-full animate-pulse" />
            <div className="absolute inset-1 bg-sky-400 rounded-full" />
          </div>
        </div>
      )}

      {/* Connection line (when anchored) */}
      {step.anchor && step.position !== 'floating' && (
        <svg
          className="fixed inset-0 z-48 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="white" stopOpacity="0.3" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          {step.beacon && (
            <line
              x1={step.beacon.x}
              y1={step.beacon.y}
              x2={step.anchor.x}
              y2={step.anchor.y}
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
          )}
        </svg>
      )}

      {/* Beautiful floating card */}
      <div
        className={`fixed z-50 transition-all duration-500 ease-out ${
          isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        style={getCardStyle()}
      >
        <div className="relative max-h-[80vh] overflow-y-auto">
          {/* Card glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-green-500 rounded-2xl blur-xl opacity-20" />

          {/* Main card */}
          <div className="relative bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-sm">
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              style={{
                position: 'absolute',
                top: spacing[4],
                right: spacing[4],
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(243, 244, 246, 0.8)'
              }}
              aria-label="Skip tutorial"
            >
              <svg style={{ width: '16px', height: '16px', color: colors.text.secondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>

            {/* Step indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3], marginBottom: spacing[3] }}>
              <Badge
                variant="primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(to bottom right, rgb(14 165 233), rgb(16 185 129))',
                  color: colors.text.primary,
                  fontSize: textStyles.body.small.fontSize[0],
                  fontWeight: 'bold'
                }}
              >
                {currentStep + 1}
              </Badge>
              <div style={{ display: 'flex', gap: spacing[1] }}>
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      height: '4px',
                      borderRadius: radius.full,
                      transition: 'all 0.3s',
                      width: index === currentStep ? '32px' : '4px',
                      background: index === currentStep
                        ? 'linear-gradient(to right, rgb(14 165 233), rgb(16 185 129))'
                        : index < currentStep
                        ? colors.success
                        : colors.gray[300]
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <h3 style={{ fontSize: textStyles.heading.h2.fontSize[0], fontWeight: 'semibold', color: colors.text.primary, marginBottom: spacing[2] }}>
              {step.title}
            </h3>
            <p style={{ color: colors.text.secondary, fontSize: textStyles.body.small.fontSize[0], lineHeight: '1.6', marginBottom: spacing[4] }}>
              {step.content}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between">
              {currentStep > 0 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  style={{
                    fontSize: textStyles.body.small.fontSize[0],
                    color: colors.text.secondary
                  }}
                >
                  Anterior
                </Button>
              ) : (
                <div />
              )}

              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                style={{
                  fontSize: textStyles.body.small.fontSize[0],
                  fontWeight: 'medium',
                  background: 'linear-gradient(to right, rgb(14 165 233), rgb(16 185 129))',
                  borderRadius: radius.lg,
                  transform: 'transition-all'
                }}
              >
                {currentStep === tutorialSteps.length - 1 ? 'Comenzar' : 'Siguiente'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for custom animations */}
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
}