import React, { useEffect, useState } from 'react';
import { GameModeConfig } from './GameModeSelector';

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
        duration: 3000
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
        duration: 3000
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
      duration: 2500
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
      duration: 2500
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
      duration: 3500
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
      duration: 3000
    };
  }

  // Default transition
  return {
    icon: '↔️',
    title: 'Cambiando Modo',
    subtitle: 'Preparando nueva experiencia',
    tips: ['Cargando...'],
    duration: 2000
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
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center z-50">
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full animate-pulse delay-75" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full animate-bounce" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-lg mx-auto p-8">
        {/* Icon with animation */}
        <div className="text-8xl mb-6 animate-bounce">
          {message.icon}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-2 animate-fadeIn">
          {message.title}
        </h1>

        {/* Subtitle */}
        <p className="text-xl opacity-90 mb-8 animate-fadeIn animation-delay-200">
          {message.subtitle}
        </p>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-0 h-full w-4 bg-white/50 blur animate-pulse" />
            </div>
          </div>
        </div>

        {/* Rotating tips */}
        <div className="h-12 flex items-center justify-center">
          <p className="text-lg opacity-80 animate-fadeInOut" key={tipIndex}>
            💡 {message.tips[tipIndex]}
          </p>
        </div>
      </div>

      <style jsx>{`
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