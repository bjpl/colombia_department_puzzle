import React, { useEffect, useState } from 'react';
import { StudySession } from './StudyModeContainer';

interface ProgressTrackerProps {
  session: StudySession;
  className?: string;
}

interface TimeStats {
  elapsed: string;
  avgTimePerCard: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  session,
  className = ''
}) => {
  const [timeStats, setTimeStats] = useState<TimeStats>({ elapsed: '0:00', avgTimePerCard: '0:00' });
  const [animatedScore, setAnimatedScore] = useState(0);

  // Update time statistics
  useEffect(() => {
    const updateTime = () => {
      const now = session.endTime || new Date();
      const elapsed = Math.floor((now.getTime() - session.startTime.getTime()) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      const elapsedFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      const avgTime = session.totalCards > 0 ? elapsed / session.totalCards : 0;
      const avgMinutes = Math.floor(avgTime / 60);
      const avgSeconds = Math.floor(avgTime % 60);
      const avgFormatted = `${avgMinutes}:${avgSeconds.toString().padStart(2, '0')}`;

      setTimeStats({
        elapsed: elapsedFormatted,
        avgTimePerCard: avgFormatted
      });
    };

    updateTime();
    const interval = session.endTime ? null : setInterval(updateTime, 1000);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [session]);

  // Animate score changes
  useEffect(() => {
    const targetScore = session.score;
    const duration = 800; // ms
    const steps = 30;
    const stepValue = (targetScore - animatedScore) / steps;
    const stepDuration = duration / steps;

    if (Math.abs(targetScore - animatedScore) < 1) {
      setAnimatedScore(targetScore);
      return;
    }

    const timer = setInterval(() => {
      setAnimatedScore(prev => {
        const next = prev + stepValue;
        if ((stepValue > 0 && next >= targetScore) || (stepValue < 0 && next <= targetScore)) {
          clearInterval(timer);
          return targetScore;
        }
        return next;
      });
    }, stepDuration);

    return () => clearInterval(timer);
  }, [session.score]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const accuracy = session.totalCards > 0 ? (session.correctAnswers / session.totalCards) * 100 : 0;

  return (
    <div className={`progress-tracker bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Progreso de Estudio</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Departamento:</span>
            <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
              {session.region.charAt(0).toUpperCase() + session.region.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Score */}
          <div className={`text-center p-4 rounded-lg ${getScoreBackground(animatedScore)}`}>
            <div className={`text-3xl font-bold mb-1 ${getScoreColor(animatedScore)}`}>
              {Math.round(animatedScore)}%
            </div>
            <div className="text-sm text-gray-600">Puntuación</div>
          </div>

          {/* Total Cards */}
          <div className="text-center p-4 bg-blue-100 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-1">{session.totalCards}</div>
            <div className="text-sm text-gray-600">Tarjetas</div>
          </div>

          {/* Correct Answers */}
          <div className="text-center p-4 bg-green-100 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-1">{session.correctAnswers}</div>
            <div className="text-sm text-gray-600">Correctas</div>
          </div>

          {/* Time Elapsed */}
          <div className="text-center p-4 bg-purple-100 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-1">{timeStats.elapsed}</div>
            <div className="text-sm text-gray-600">Tiempo</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progreso de Precisión</span>
            <span>{session.correctAnswers}/{session.totalCards}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(accuracy)}`}
              style={{ width: `${Math.min(accuracy, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Tasa de Precisión:</span>
            <span className={`font-medium ${getScoreColor(accuracy)}`}>
              {session.totalCards > 0 ? `${Math.round(accuracy)}%` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Tiempo Prom./Tarjeta:</span>
            <span className="font-medium text-gray-800">{timeStats.avgTimePerCard}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Respuestas Incorrectas:</span>
            <span className="font-medium text-red-600">
              {session.totalCards - session.correctAnswers}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">ID de Sesión:</span>
            <span className="font-mono text-xs text-gray-500">
              {session.id.slice(-8)}
            </span>
          </div>
        </div>

        {/* Performance Insights */}
        {session.totalCards >= 5 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Análisis de Rendimiento</h4>
            <div className="space-y-2 text-sm">
              {accuracy >= 90 && (
                <div className="flex items-center text-green-700">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  ¡Excelente trabajo! Estás dominando este vocabulario.
                </div>
              )}
              {accuracy >= 70 && accuracy < 90 && (
                <div className="flex items-center text-yellow-700">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  ¡Buen progreso! Sigue practicando para mejorar la precisión.
                </div>
              )}
              {accuracy < 70 && accuracy > 0 && (
                <div className="flex items-center text-red-700">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Tómate tu tiempo y revisa la lista de vocabulario para mejores resultados.
                </div>
              )}
              
              {session.totalCards >= 10 && (
                <div className="text-gray-600">
                  • Completaste {session.totalCards} tarjetas en {timeStats.elapsed}
                  {session.totalCards >= 20 && (
                    <> • ¡Gran resistencia!</>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Session Status */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              session.endTime ? 'bg-gray-400' : 'bg-green-400 animate-pulse'
            }`}></div>
            <span className="text-sm text-gray-600">
              {session.endTime ? 'Sesión Completada' : 'Sesión Activa'}
            </span>
          </div>
          
          {session.endTime && (
            <div className="text-sm text-gray-500">
              Terminó: {session.endTime.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};