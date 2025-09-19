import React from 'react';
import { useGame } from '../context/GameContext';

interface EducationalPanelProps {
  compact?: boolean;
}

export default function EducationalPanel({ compact = false }: EducationalPanelProps) {
  const game = useGame();

  const handleUseHint = () => {
    if (game.hints > 0 && game.currentDepartment) {
      game.useHint();
      // In a real implementation, we'd highlight the correct drop zone
      alert(`Pista: ${game.currentDepartment.name} está en la región ${game.currentDepartment.region}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Current department info */}
      {game.currentDepartment && (
        <div className={`bg-white rounded-lg shadow-lg ${compact ? 'p-3' : 'p-6'}`}>
          <h3 className={`${compact ? 'text-sm' : 'text-lg'} font-semibold mb-2`}>Departamento Seleccionado</h3>
          <div className={`${compact ? 'space-y-1 text-xs' : 'space-y-2'}`}>
            <div>
              <span className="font-semibold">Nombre:</span> {game.currentDepartment.name}
            </div>
            <div>
              <span className="font-semibold">Capital:</span> {game.currentDepartment.capital}
            </div>
            <div>
              <span className="font-semibold">Región:</span> {game.currentDepartment.region}
            </div>
            {!compact && (
              <>
                <div>
                  <span className="font-semibold">Área:</span> {game.currentDepartment.area.toLocaleString()} km²
                </div>
                <div>
                  <span className="font-semibold">Población:</span> {game.currentDepartment.population.toLocaleString()}
                </div>
              </>
            )}
            <div className={`${compact ? 'pt-1' : 'pt-2'} border-t`}>
              <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600 italic line-clamp-2`}>
                {game.currentDepartment.trivia}
              </p>
            </div>
          </div>

          {game.hints > 0 && (
            <button
              onClick={handleUseHint}
              className={`${compact ? 'mt-2 px-2 py-1 text-xs' : 'mt-4 px-4 py-2'} w-full bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors`}
            >
              Usar Pista ({game.hints})
            </button>
          )}
        </div>
      )}

      {/* Instructions */}
      {!game.currentDepartment && !compact && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Cómo Jugar</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li>1. Selecciona un departamento de la izquierda</li>
            <li>2. Arrástralo hasta su ubicación en el mapa</li>
            <li>3. Suéltalo en el lugar correcto</li>
            <li>4. Gana puntos por cada acierto</li>
            <li>5. Usa pistas si necesitas ayuda</li>
          </ol>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <span className="font-semibold">Tip:</span> Los colores indican las regiones
            </p>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className={`bg-white rounded-lg shadow-lg ${compact ? 'p-3' : 'p-6'}`}>
        <h3 className={`${compact ? 'text-sm' : 'text-lg'} font-semibold mb-2`}>Estadísticas</h3>
        <div className={`${compact ? 'space-y-1 text-xs' : 'space-y-2 text-sm'}`}>
          <div className="flex justify-between">
            <span>Fallidos:</span>
            <span className="font-bold text-red-600">{game.attempts}</span>
          </div>
          <div className="flex justify-between">
            <span>Precisión:</span>
            <span className="font-bold text-green-600">
              {game.placedDepartments.size > 0
                ? Math.round((game.placedDepartments.size / (game.placedDepartments.size + game.attempts)) * 100)
                : 0}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Restantes:</span>
            <span className="font-bold text-blue-600">
              {game.departments.length - game.placedDepartments.size}
            </span>
          </div>
        </div>
      </div>

      {/* Learning tips */}
      {!compact && (
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2">Sabías que...</h3>
          <p className="text-xs text-gray-700">
            Colombia tiene 32 departamentos y un distrito capital.
            Es el único país sudamericano con costas en dos océanos.
          </p>
        </div>
      )}
    </div>
  );
}