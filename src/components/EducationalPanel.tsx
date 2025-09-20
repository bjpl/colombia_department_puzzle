import { useState } from 'react';
import { useGame } from '../context/GameContext';
import HintModal from './HintModal';

interface EducationalPanelProps {
  compact?: boolean;
}

export default function EducationalPanel({ compact = false }: EducationalPanelProps) {
  const game = useGame();
  const [showHintModal, setShowHintModal] = useState(false);
  const [currentHintLevel, setCurrentHintLevel] = useState(1);
  const [departmentAttempts, setDepartmentAttempts] = useState<Record<string, number>>({});

  const handleUseHint = () => {
    if (game.hints > 0 && game.currentDepartment) {
      // Track attempts per department for better hints
      const deptName = game.currentDepartment.name;
      const currentAttempts = departmentAttempts[deptName] || 0;
      const newAttempts = currentAttempts + 1;

      setDepartmentAttempts(prev => ({
        ...prev,
        [deptName]: newAttempts
      }));

      // Progressive hints: start with level 1, increase based on the NEW attempt count
      let hintLevel = 1;
      if (newAttempts >= 2) hintLevel = 2;
      if (newAttempts >= 3) hintLevel = 3;

      setCurrentHintLevel(hintLevel);
      game.useHint();
      setShowHintModal(true);
    }
  };

  return (
    <>
      {/* Hint Modal */}
      {game.currentDepartment && (
        <HintModal
          isOpen={showHintModal}
          onClose={() => {
            setShowHintModal(false);
            // Clear current department when closing hint modal to restore pan functionality
            // This ensures the map doesn't think we're still dragging
            if (currentHintLevel >= 3) {
              // After viewing all 3 hints, clear selection to enable panning
              game.clearCurrentDepartment();
            }
          }}
          departmentName={game.currentDepartment.name}
          region={game.currentDepartment.region}
          hintLevel={currentHintLevel}
        />
      )}

      <aside className="space-y-4" role="complementary" aria-label="Panel educativo">
      {/* Current department info */}
      {game.currentDepartment && (
        <section className={`bg-white rounded-lg shadow-lg ${compact ? 'p-3' : 'p-6'}`} aria-labelledby="selected-dept-heading">
          <h3 id="selected-dept-heading" className={`${compact ? 'text-sm' : 'text-lg'} font-semibold mb-2`}>Departamento Seleccionado</h3>
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
              aria-label={`Usar una pista para ${game.currentDepartment.name}. Quedan ${game.hints} pistas`}
            >
              Usar Pista ({game.hints})
            </button>
          )}
        </section>
      )}

      {/* Instructions */}
      {!game.currentDepartment && !compact && (
        <section className="bg-white rounded-lg shadow-lg p-6" aria-labelledby="instructions-heading">
          <h3 id="instructions-heading" className="text-lg font-semibold mb-3">Cómo Jugar</h3>
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
        </section>
      )}

      {/* Statistics */}
      <section className={`bg-white rounded-lg shadow-lg ${compact ? 'p-3' : 'p-6'}`} aria-labelledby="stats-heading" role="status">
        <h3 id="stats-heading" className={`${compact ? 'text-sm' : 'text-lg'} font-semibold mb-2`}>Estadísticas</h3>
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
      </section>

      {/* Learning tips */}
      {!compact && (
        <section className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-4" aria-labelledby="tips-heading">
          <h3 id="tips-heading" className="text-sm font-semibold mb-2">Sabías que...</h3>
          <p className="text-xs text-gray-700">
            Colombia tiene 32 departamentos y un distrito capital.
            Es el único país sudamericano con costas en dos océanos.
          </p>
        </section>
      )}
    </aside>
    </>
  );
}