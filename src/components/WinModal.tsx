import React from 'react';
import { useGame } from '../context/GameContext';

export default function WinModal() {
  const game = useGame();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} minutos y ${secs} segundos`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full animate-bounce-slow">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-green-600 mb-2">
            ¡Felicitaciones!
          </h2>
          <p className="text-gray-700 mb-6">
            Has completado el rompecabezas de Colombia
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Puntuación Final:</span>
              <span className="font-bold text-xl">{game.score}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tiempo Total:</span>
              <span className="font-semibold">{formatTime(game.elapsedTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pistas Usadas:</span>
              <span className="font-semibold">{3 - game.hints}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={game.resetGame}
              className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              Jugar de Nuevo
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cerrar
            </button>
          </div>

          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              🌟 ¡Ahora conoces todos los departamentos de Colombia!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}