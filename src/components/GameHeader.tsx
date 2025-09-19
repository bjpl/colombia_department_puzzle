import React from 'react';
import { useGame } from '../context/GameContext';

interface GameHeaderProps {
  onStudyMode?: () => void;
}

export default function GameHeader({ onStudyMode }: GameHeaderProps) {
  const game = useGame();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePausePlay = () => {
    if (!game.isGameStarted) {
      game.startGame();
    } else if (game.isPaused) {
      game.resumeGame();
    } else {
      game.pauseGame();
    }
  };

  const progress = Math.round((game.placedDepartments.size / game.departments.length) * 100);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            🇨🇴 Rompecabezas de Colombia
          </h1>
          <p className="text-gray-600 mt-1">
            Aprende los departamentos de Colombia
          </p>
        </div>

        <div className="flex gap-6 items-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{game.score}</div>
            <div className="text-sm text-gray-600">Puntos</div>
          </div>

          <div className="text-center">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePausePlay}
                className={`p-1 rounded transition-colors ${
                  game.isPaused
                    ? 'bg-green-100 hover:bg-green-200 text-green-700'
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                }`}
                title={game.isPaused ? 'Reanudar' : 'Pausar'}
              >
                {game.isPaused ? '▶️' : '⏸️'}
              </button>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatTime(game.elapsedTime)}
                </div>
                <div className="text-sm text-gray-600">
                  {game.isPaused ? 'Pausado' : 'Tiempo'}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{progress}%</div>
            <div className="text-sm text-gray-600">Progreso</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{game.hints}</div>
            <div className="text-sm text-gray-600">Pistas</div>
          </div>
        </div>

        <div className="flex gap-2">
          {onStudyMode && (
            <button
              onClick={onStudyMode}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              📚 Estudiar
            </button>
          )}
          <button
            onClick={game.resetGame}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Reiniciar
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}