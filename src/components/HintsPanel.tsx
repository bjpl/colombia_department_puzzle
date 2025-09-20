import { useGame } from '../context/GameContext';
import { useProgressiveHints } from '../hooks/useProgressiveHints';

export default function HintsPanel() {
  const game = useGame();
  const hints = useProgressiveHints();

  if (!game.currentDepartment) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        💡 Pistas Progresivas
        <span className="ml-auto text-sm text-gray-600">
          Puntos: {game.score}
        </span>
      </h3>

      <div className="space-y-2">
        {/* Level 1: Region Hint */}
        <button
          onClick={() => hints.activateRegionHint()}
          disabled={game.score < hints.HINT_COSTS.region || hints.activeHint !== null}
          className={`w-full p-3 rounded-lg border-2 transition-all ${
            game.score >= hints.HINT_COSTS.region && !hints.activeHint
              ? 'border-green-400 bg-green-50 hover:bg-green-100 cursor-pointer'
              : 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-60'
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="text-left">
              <div className="font-semibold text-sm">🗺️ Mostrar Región</div>
              <div className="text-xs text-gray-600">
                Resalta la región donde pertenece
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-green-600">
                -{hints.HINT_COSTS.region} pts
              </div>
            </div>
          </div>
        </button>

        {/* Level 2: First Letter Hint */}
        <button
          onClick={() => hints.activateLetterHint()}
          disabled={game.score < hints.HINT_COSTS.letter || hints.activeHint !== null}
          className={`w-full p-3 rounded-lg border-2 transition-all ${
            game.score >= hints.HINT_COSTS.letter && !hints.activeHint
              ? 'border-yellow-400 bg-yellow-50 hover:bg-yellow-100 cursor-pointer'
              : 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-60'
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="text-left">
              <div className="font-semibold text-sm">🔤 Primera Letra</div>
              <div className="text-xs text-gray-600">
                Muestra "{game.currentDepartment.name[0]}..." en el mapa
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-yellow-600">
                -{hints.HINT_COSTS.letter} pts
              </div>
            </div>
          </div>
        </button>

        {/* Level 3: Flash Location Hint */}
        <button
          onClick={() => hints.activateFlashHint()}
          disabled={game.score < hints.HINT_COSTS.flash || hints.activeHint !== null}
          className={`w-full p-3 rounded-lg border-2 transition-all ${
            game.score >= hints.HINT_COSTS.flash && !hints.activeHint
              ? 'border-red-400 bg-red-50 hover:bg-red-100 cursor-pointer'
              : 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-60'
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="text-left">
              <div className="font-semibold text-sm">✨ Mostrar Ubicación</div>
              <div className="text-xs text-gray-600">
                Destella la ubicación exacta
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-red-600">
                -{hints.HINT_COSTS.flash} pts
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Active Hint Indicator */}
      {hints.activeHint && (
        <div className="mt-3 p-2 bg-blue-100 rounded-lg border border-blue-300">
          <div className="text-xs text-blue-700 font-medium">
            {hints.activeHint === 'region' && '🗺️ Región resaltada en el mapa'}
            {hints.activeHint === 'letter' && `🔤 Busca "${game.currentDepartment.name[0]}..." en la región`}
            {hints.activeHint === 'flash' && '✨ ¡Mira el departamento destellando!'}
          </div>
        </div>
      )}

      {/* First Letter Display */}
      {hints.showFirstLetter && game.currentDepartment && (
        <div className="mt-3 p-3 bg-yellow-100 rounded-lg border-2 border-yellow-400">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-700">
              {game.currentDepartment.name[0]}...
            </div>
            <div className="text-xs text-yellow-600 mt-1">
              Empieza con esta letra
            </div>
          </div>
        </div>
      )}
    </div>
  );
}