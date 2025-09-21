import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useSoundEffect } from '../services/soundManager';

interface GameHeaderProps {
  onStudyMode?: () => void;
  onTutorial?: () => void;
  onGameMode?: () => void;
}

export default function GameHeader({ onStudyMode, onTutorial, onGameMode }: GameHeaderProps) {
  const game = useGame();
  const sound = useSoundEffect();
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initialize sound state from storage
  useEffect(() => {
    const settings = sound.settings;
    setSoundEnabled(settings.enabled);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    sound.setEnabled(newState);
    // Play a test sound when enabling
    if (newState) {
      sound.playSound('pickup', 0.3);
    }
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

  const progress = Math.round((game.placedDepartments.size / game.getFilteredDepartments().length) * 100);

  const getModeDisplay = () => {
    if (game.gameMode.type === 'full') return '🌎 Colombia Completa';
    if (game.gameMode.type === 'progression') return '🎓 Modo Aprendizaje';
    if (game.gameMode.type === 'region' && game.gameMode.selectedRegions) {
      const regions = game.gameMode.selectedRegions.join(', ');
      return `🗺️ ${regions}`;
    }
    return '🎮 Modo Personalizado';
  };

  return (
    <header className="bg-white rounded-lg shadow-lg p-6" role="banner" aria-label="Panel de control del juego">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            🇨🇴 Rompecabezas de Colombia
          </h1>
          <p className="text-gray-600 mt-1 flex items-center gap-2">
            <span>Aprende los departamentos de Colombia</span>
            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              {getModeDisplay()}
            </span>
          </p>
        </div>

        <div className="flex gap-6 items-center">
          <div className="text-center" role="status" aria-label="Puntuación">
            <div className="text-2xl font-bold text-blue-600" aria-live="polite">{game.score}</div>
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
                aria-label={game.isPaused ? 'Reanudar juego' : 'Pausar juego'}
                aria-pressed={game.isPaused}
              >
                {game.isPaused ? '▶️' : '⏸️'}
              </button>
              <div role="timer" aria-label="Tiempo transcurrido">
                <div className="text-2xl font-bold text-green-600" aria-live="off">
                  {formatTime(game.elapsedTime)}
                </div>
                <div className="text-sm text-gray-600">
                  {game.isPaused ? 'Pausado' : 'Tiempo'}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center" role="status" aria-label="Progreso del juego">
            <div className="text-2xl font-bold text-purple-600" aria-live="polite" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>{progress}%</div>
            <div className="text-sm text-gray-600">Progreso</div>
          </div>

          <div className="text-center" role="status" aria-label="Pistas disponibles">
            <div className="text-2xl font-bold text-yellow-600" aria-live="polite">{game.hints}</div>
            <div className="text-sm text-gray-600">Pistas</div>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 shadow-md ${
              soundEnabled
                ? 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg'
                : 'bg-gray-400 text-gray-700 hover:bg-gray-500 hover:text-white'
            }`}
            title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
            aria-label={soundEnabled ? 'Silenciar efectos de sonido' : 'Activar efectos de sonido'}
            aria-pressed={soundEnabled}
          >
            <span className="text-lg">{soundEnabled ? '🔊' : '🔇'}</span>
            <span className="hidden lg:inline text-sm font-medium">
              {soundEnabled ? 'Sonido' : 'Mudo'}
            </span>
          </button>

          {onGameMode && (
            <button
              onClick={onGameMode}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all shadow-lg flex items-center gap-2"
              title="Cambiar modo de juego"
              aria-label="Cambiar modo de juego"
            >
              🎮 Modo
            </button>
          )}
          {onTutorial && (
            <button
              onClick={onTutorial}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
              title="Ver tutorial interactivo"
              aria-label="Ver tutorial interactivo"
            >
              ❓ Tutorial
            </button>
          )}
          {onStudyMode && (
            <button
              onClick={onStudyMode}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              aria-label="Abrir modo estudio"
            >
              📚 Estudiar
            </button>
          )}
          <button
            onClick={game.resetGame}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            aria-label="Reiniciar el juego"
          >
            Reiniciar
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 w-full bg-gray-200 rounded-full h-2" role="progressbar" aria-label="Barra de progreso del juego" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}