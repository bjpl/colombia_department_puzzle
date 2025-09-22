import React, { useEffect, useState } from 'react';
import { GameModeConfig } from './GameModeSelector';
import {
  colors, spacing, textStyles, animations
} from '../design-system';

interface ModeTransitionProps {
  from: string;
  to: string;
  mode: GameModeConfig;
  onComplete: () => void;
}

interface TransitionMessage {
  icon: string;
  title: string;
  subtitle: string;
  tips: string[];
  duration: number;
}

const getTransitionMessage = (from: string, to: string, mode: GameModeConfig): TransitionMessage => {
  // Study to Game transitions
  if (from === 'study' && to === 'game') {
    if (mode.type === 'region' && mode.selectedRegions?.length === 1) {
      return {
        icon: '🎯',
        title: `¡Practiquemos ${mode.selectedRegions[0]}!`,
        subtitle: 'Aplica lo que aprendiste',
        tips: [
          'Recuerda las capitales que estudiaste',
          'Los colores indican las regiones',
          'Usa las pistas si lo necesitas'
        ],
        duration: 1200
      };
    }
    if (mode.type === 'full') {
      return {
        icon: '🚀',
        title: '¡Desafío Completo!',
        subtitle: 'Todos los 33 departamentos',
        tips: [
          'Comienza con los que mejor conoces',
          'Agrupa por regiones mentalmente',
          'La práctica hace al maestro'
        ],
        duration: 1200
      };
    }
    return {
      icon: '🎮',
      title: '¡A Jugar!',
      subtitle: 'Pon a prueba tu conocimiento',
      tips: [
        'Concéntrate en la precisión',
        'No te apresures',
        'Aprende de los errores'
      ],
      duration: 1000
    };
  }

  // Game to Study transitions
  if (from === 'game' && to === 'study') {
    return {
      icon: '📚',
      title: 'Modo Estudio',
      subtitle: 'Refuerza tu conocimiento',
      tips: [
        'Revisa los departamentos que fallaste',
        'Explora nuevas regiones',
        'Toma tu tiempo para aprender'
      ],
      duration: 1000
    };
  }

  // Game completion to next mode
  if (from === 'complete' && to === 'next') {
    return {
      icon: '🎉',
      title: '¡Excelente!',
      subtitle: 'Has completado este desafío',
      tips: [
        'Intenta un modo más difícil',
        'Mejora tu tiempo',
        'Explora otras regiones'
      ],
      duration: 1500
    };
  }

  // Quick Start to Game
  if (from === 'quickstart' && to === 'game') {
    return {
      icon: '🏁',
      title: '¡Comencemos!',
      subtitle: 'Tu aventura personalizada',
      tips: [
        'Sigue tu propio ritmo',
        'Disfruta aprendiendo',
        'Cada error es una oportunidad'
      ],
      duration: 1200
    };
  }

  // Default transition
  return {
    icon: '↔️',
    title: 'Cambiando Modo',
    subtitle: 'Preparando nueva experiencia',
    tips: ['Cargando...'],
    duration: 800
  };
};

const ModeTransition: React.FC<ModeTransitionProps> = ({ from, to, mode, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const message = getTransitionMessage(from, to, mode);

  useEffect(() => {
    // Animate progress bar
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(onComplete, 200);
          return 100;
        }
        return prev + (100 / (message.duration / 50));
      });
    }, 50);

    // Cycle through tips
    const tipTimer = setInterval(() => {
      setTipIndex(prev => (prev + 1) % message.tips.length);
    }, message.duration / message.tips.length);

    return () => {
      clearInterval(progressTimer);
      clearInterval(tipTimer);
    };
  }, [message.duration, message.tips.length, onComplete]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-brand-600 to-success-600"
    >
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full animate-pulse bg-white/5"
        />
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full animate-pulse delay-75 bg-white/5"
        />
        <div
          className="absolute top-1/4 right-1/4 rounded-full animate-bounce w-64 h-64 bg-white/10"
        />
      </div>

      {/* Content */}
      <div
        className="relative z-10 text-center max-w-lg mx-auto text-neutral-50 p-8"
      >
        {/* Icon with animation */}
        <div className="text-8xl mb-6 animate-bounce">
          {message.icon}
        </div>

        {/* Title */}
        <h1
          className="animate-fadeIn text-4xl font-bold mb-2"
        >
          {message.title}
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fadeIn animation-delay-200 text-xl opacity-90 mb-8"
        >
          {message.subtitle}
        </p>

        {/* Progress bar */}
        <div className="mb-6">
          <div
            className="h-2 rounded-full overflow-hidden bg-white/20"
          >
            <div
              className="h-full rounded-full relative bg-neutral-50 transition-all"
              style={{ width: `${progress}%` }}
            >
              <div
                className="absolute right-0 top-0 h-full animate-pulse w-4 bg-white/50 blur-sm"
              />
            </div>
          </div>
        </div>

        {/* Rotating tips */}
        <div className="h-12 flex items-center justify-center">
          <p
            className="animate-fadeInOut text-lg opacity-80"
            key={tipIndex}
          >
            💡 {message.tips[tipIndex]}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0; }
          20%, 80% { opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-fadeInOut {
          animation: fadeInOut 2s ease-in-out;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .delay-75 {
          animation-delay: 750ms;
        }
      `}</style>
    </div>
  );
};

export default ModeTransition;