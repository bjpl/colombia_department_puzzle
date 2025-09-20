import React, { useEffect, useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { storage, GameSession } from '../services/storage';
import { Department, colombiaDepartments } from '../data/colombiaDepartments';
import NextChallengeRecommender from './NextChallengeRecommender';
import { GameModeConfig } from './GameModeSelector';

interface PostGameReportProps {
  onClose: () => void;
  onPlayAgain: () => void;
  onStudyMode: () => void;
  onSelectMode?: (mode: GameModeConfig) => void;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

interface DepartmentStats {
  departmentId: string;
  attempts: number;
  timeToPlace: number;
  hintsUsed: number;
}

export default function PostGameReport({ onClose, onPlayAgain, onStudyMode, onSelectMode }: PostGameReportProps) {
  const game = useGame();
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isNewBestTime, setIsNewBestTime] = useState(false);
  const [departmentStats, setDepartmentStats] = useState<Map<string, DepartmentStats>>(new Map());
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Calculate game statistics
  const gameStats = useMemo(() => {
    // Use active departments count, not all 33
    const totalDepartments = game.activeDepartments.length;
    const placedCorrectly = game.placedDepartments.size;
    const accuracy = totalDepartments > 0 ?
      ((placedCorrectly / Math.max(game.attempts + placedCorrectly, totalDepartments)) * 100).toFixed(1) : '0';
    const avgTimePerDept = totalDepartments > 0 ? game.elapsedTime / totalDepartments : 0;
    const hintsPerDept = totalDepartments > 0 ? (3 - game.hints) / totalDepartments : 0;

    return {
      finalScore: game.score,
      totalTime: game.elapsedTime,
      accuracy: parseFloat(accuracy),
      avgTimePerDept: avgTimePerDept.toFixed(1),
      hintsUsed: 3 - game.hints,
      hintsPerDept: hintsPerDept.toFixed(2),
      perfectPlacements: placedCorrectly,
      mistakes: game.attempts,
      totalDepartments
    };
  }, [game]);

  // Calculate achievements
  const achievements: Achievement[] = useMemo(() => {
    return [
      {
        id: 'perfect',
        name: 'Perfecto',
        description: 'Completa sin errores',
        icon: '⭐',
        earned: gameStats.mistakes === 0,
      },
      {
        id: 'no-hints',
        name: 'Sin Ayuda',
        description: 'Completa sin usar pistas',
        icon: '🎯',
        earned: gameStats.hintsUsed === 0,
      },
      {
        id: 'speedrun',
        name: 'Velocista',
        description: 'Completa en menos de 5 minutos',
        icon: '⚡',
        earned: game.elapsedTime < 300,
      },
      {
        id: 'explorer',
        name: 'Explorador',
        description: 'Primera vez completando',
        icon: '🗺️',
        earned: storage.getSessions().length === 1,
      },
      {
        id: 'master',
        name: 'Maestro',
        description: 'Puntuación superior a 3000',
        icon: '👑',
        earned: game.score > 3000,
      },
      {
        id: 'persistent',
        name: 'Persistente',
        description: 'Completa después de 10+ intentos',
        icon: '💪',
        earned: gameStats.mistakes > 10 && game.isGameComplete,
      },
    ];
  }, [gameStats, game]);

  // Check for records
  useEffect(() => {
    const profile = storage.getActiveProfile();
    if (profile) {
      if (game.score > profile.stats.highScore) {
        setIsNewHighScore(true);
      }
      if (game.elapsedTime < profile.stats.bestTime) {
        setIsNewBestTime(true);
      }

      // Save session
      const session: GameSession = {
        profileId: profile.id,
        startTime: game.startTime || Date.now(),
        endTime: Date.now(),
        score: game.score,
        placedDepartments: Array.from(game.placedDepartments),
        hintsUsed: 3 - game.hints,
        mistakes: game.attempts,
      };
      storage.saveSession(session);
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score > 3000) return 'text-green-600';
    if (score > 2000) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const earnedAchievements = achievements.filter(a => a.earned);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🎉 ¡Juego Completado!</h2>
              <p className="text-lg opacity-90 mt-1">
                Has completado el rompecabezas de Colombia
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          {/* Main Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className={`text-3xl font-bold ${getScoreColor(gameStats.finalScore)}`}>
                {gameStats.finalScore}
                {isNewHighScore && <span className="text-xs ml-1 text-yellow-500">¡NUEVO!</span>}
              </div>
              <div className="text-sm text-gray-600 mt-1">Puntuación Final</div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {formatTime(gameStats.totalTime)}
                {isNewBestTime && <span className="text-xs ml-1 text-yellow-500">¡RÉCORD!</span>}
              </div>
              <div className="text-sm text-gray-600 mt-1">Tiempo Total</div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {gameStats.accuracy}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Precisión</div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {gameStats.hintsUsed}
              </div>
              <div className="text-sm text-gray-600 mt-1">Pistas Usadas</div>
            </div>
          </div>

          {/* Achievements Section */}
          {earnedAchievements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">🏆 Logros Obtenidos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {earnedAchievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg p-3 border-2 border-yellow-400"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{achievement.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-800">{achievement.name}</div>
                        <div className="text-xs text-gray-600">{achievement.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Statistics */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">📊 Estadísticas Detalladas</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Departamentos Correctos:</span>
                <span className="font-semibold">{gameStats.perfectPlacements}/33</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Intentos Fallidos:</span>
                <span className="font-semibold">{gameStats.mistakes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tiempo Promedio/Depto:</span>
                <span className="font-semibold">{gameStats.avgTimePerDept}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pistas por Depto:</span>
                <span className="font-semibold">{gameStats.hintsPerDept}</span>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">💡 Resumen de Rendimiento</h3>
            <p className="text-gray-600 text-sm">
              {gameStats.accuracy >= 90
                ? "¡Excelente trabajo! Tu precisión fue sobresaliente. Conoces muy bien los departamentos de Colombia."
                : gameStats.accuracy >= 70
                ? "Buen trabajo. Con un poco más de práctica en el modo de estudio, mejorarás tu precisión."
                : "Sigue practicando. Te recomendamos usar el modo de estudio para familiarizarte mejor con los departamentos."}
            </p>
            {gameStats.totalTime < 180 && (
              <p className="text-green-600 text-sm mt-2">
                ⚡ ¡Increíble velocidad! Completaste el juego en tiempo récord.
              </p>
            )}
          </div>

          {/* Next Challenge Recommendations */}
          {showRecommendations && onSelectMode && (
            <div className="mb-6">
              <NextChallengeRecommender
                currentMode={game.gameMode}
                performance={{
                  score: game.score,
                  accuracy: gameStats.accuracy,
                  timeInSeconds: game.elapsedTime,
                  hintsUsed: gameStats.hintsUsed,
                  attempts: game.attempts
                }}
                onSelectChallenge={(mode) => {
                  game.setGameMode(mode);
                  onSelectMode(mode);
                  onClose();
                }}
                onViewProgress={() => {
                  // TODO: Implement progress view
                  setShowRecommendations(false);
                }}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={onPlayAgain}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-semibold"
            >
              🎮 Jugar de Nuevo
            </button>
            <button
              onClick={onStudyMode}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
            >
              📚 Modo Estudio
            </button>
            <button
              onClick={() => {
                // Share functionality placeholder
                alert('Compartir funcionalidad próximamente');
              }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              📤 Compartir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}