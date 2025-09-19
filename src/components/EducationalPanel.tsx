import React from 'react';
import { useGame } from '../context/GameContext';

export default function EducationalPanel() {
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
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Departamento Seleccionado</h3>
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Nombre:</span> {game.currentDepartment.name}
            </div>
            <div>
              <span className="font-semibold">Capital:</span> {game.currentDepartment.capital}
            </div>
            <div>
              <span className="font-semibold">Región:</span> {game.currentDepartment.region}
            </div>
            <div>
              <span className="font-semibold">Área:</span> {game.currentDepartment.area.toLocaleString()} km²
            </div>
            <div>
              <span className="font-semibold">Población:</span> {game.currentDepartment.population.toLocaleString()}
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-600 italic">{game.currentDepartment.trivia}</p>
            </div>
          </div>

          {game.hints > 0 && (
            <button
              onClick={handleUseHint}
              className="mt-4 w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Usar Pista ({game.hints} restantes)
            </button>
          )}
        </div>
      )}

      {/* Instructions */}
      {!game.currentDepartment && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Cómo Jugar</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li>1. Selecciona un departamento de la bandeja inferior</li>
            <li>2. Arrástralo hasta su ubicación correcta en el mapa</li>
            <li>3. Suéltalo en el lugar correspondiente</li>
            <li>4. Gana puntos por cada ubicación correcta</li>
            <li>5. Usa pistas si necesitas ayuda (resta puntos)</li>
          </ol>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <span className="font-semibold">Tip:</span> Comienza con los departamentos que conoces mejor
            </p>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-3">Estadísticas</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Intentos fallidos:</span>
            <span className="font-semibold">{game.attempts}</span>
          </div>
          <div className="flex justify-between">
            <span>Precisión:</span>
            <span className="font-semibold">
              {game.placedDepartments.size > 0
                ? Math.round((game.placedDepartments.size / (game.placedDepartments.size + game.attempts)) * 100)
                : 0}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Departamentos restantes:</span>
            <span className="font-semibold">
              {game.departments.length - game.placedDepartments.size}
            </span>
          </div>
        </div>
      </div>

      {/* Learning tips */}
      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">Sabías que...</h3>
        <p className="text-sm text-gray-700">
          Colombia tiene 32 departamentos y un distrito capital.
          Es el cuarto país más grande de Sudamérica y el único
          con costas en dos océanos: Atlántico y Pacífico.
        </p>
      </div>
    </div>
  );
}