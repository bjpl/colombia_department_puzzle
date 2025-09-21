import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useSoundEffect } from '../services/soundManager';
import AccessibilitySettings from './AccessibilitySettings';

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
    if (game.gameMode.type === 'full') return 'Colombia Completa';
    if (game.gameMode.type === 'progression') return 'Modo Aprendizaje';
    if (game.gameMode.type === 'region' && game.gameMode.selectedRegions) {
      const regions = game.gameMode.selectedRegions.join(', ');
      return regions;
    }
    return 'Personalizado';
  };

  // SVG Icons as components
  const PlayIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M5 4v12l10-6z" />
    </svg>
  );

  const PauseIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M6 4a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1zm8 0a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1z" />
    </svg>
  );

  const SoundOnIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
    </svg>
  );

  const SoundOffIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" />
    </svg>
  );

  const HintIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
    </svg>
  );

  const ResetIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" />
    </svg>
  );

  const StudyIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
    </svg>
  );

  const GameModeIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 00-2 2v.683a3.7 3.7 0 011.055.485 1.704 1.704 0 001.89 0 3.704 3.704 0 012.11 0 1.704 1.704 0 001.89 0 3.704 3.704 0 012.11 0 1.704 1.704 0 001.89 0A3.7 3.7 0 0118 12.683V12a2 2 0 00-2-2V9a2 2 0 00-2-2V6a1 1 0 10-2 0v1h-1V6a1 1 0 10-2 0v1H8V6zm10 8.868a3.704 3.704 0 01-2.055.485 1.704 1.704 0 01-1.89 0 3.704 3.704 0 00-2.11 0 1.704 1.704 0 01-1.89 0 3.704 3.704 0 00-2.11 0 1.704 1.704 0 01-1.89 0A3.7 3.7 0 012 14.868V17a1 1 0 001 1h14a1 1 0 001-1v-2.132z" />
    </svg>
  );

  const HelpIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  );

  return (
    <>
      {/* Modern Glass-morphism Header */}
      <header className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-lg border border-white/20" role="banner" aria-label="Panel de control del juego">

        {/* Main Header Section */}
        <div className="px-6 py-4 flex justify-between items-center">

          {/* Left: Title and Branding */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <span className="text-2xl">🇨🇴</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Rompecabezas de Colombia
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Modo actual:</span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 rounded-full">
                  {getModeDisplay()}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">

            {/* Hints Button with Badge */}
            <button
              className="relative px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 font-medium"
              title={`${game.hints} pistas disponibles`}
              aria-label={`${game.hints} pistas disponibles`}
            >
              <HintIcon />
              <span className="hidden sm:inline">Pista</span>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                {game.hints}
              </span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2.5 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-md ${
                soundEnabled
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              title={soundEnabled ? 'Silenciar' : 'Activar sonido'}
              aria-label={soundEnabled ? 'Silenciar efectos de sonido' : 'Activar efectos de sonido'}
              aria-pressed={soundEnabled}
            >
              {soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
            </button>

            {/* Separator */}
            <div className="w-px h-8 bg-gray-300 mx-1" />

            {/* Mode Buttons */}
            {onStudyMode && (
              <button
                onClick={onStudyMode}
                className="p-2.5 bg-gradient-to-r from-sky-100 to-sky-200 text-sky-700 rounded-xl hover:from-sky-200 hover:to-sky-300 transition-all transform hover:scale-105 active:scale-95 shadow-md shadow-sky-500/20"
                title="Modo de estudio"
                aria-label="Abrir modo de estudio"
              >
                <StudyIcon />
              </button>
            )}

            {onGameMode && (
              <button
                onClick={onGameMode}
                className="p-2.5 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 rounded-xl hover:from-purple-200 hover:to-purple-300 transition-all transform hover:scale-105 active:scale-95 shadow-md shadow-purple-500/20"
                title="Cambiar modo de juego"
                aria-label="Cambiar modo de juego"
              >
                <GameModeIcon />
              </button>
            )}

            {onTutorial && (
              <button
                onClick={onTutorial}
                className="p-2.5 bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 rounded-xl hover:from-indigo-200 hover:to-indigo-300 transition-all transform hover:scale-105 active:scale-95 shadow-md shadow-indigo-500/20"
                title="Tutorial"
                aria-label="Ver tutorial interactivo"
              >
                <HelpIcon />
              </button>
            )}

            {/* Reset Button */}
            <button
              onClick={game.resetGame}
              className="p-2.5 bg-gradient-to-r from-red-100 to-red-200 text-red-700 rounded-xl hover:from-red-200 hover:to-red-300 transition-all transform hover:scale-105 active:scale-95 shadow-md shadow-red-500/20"
              title="Reiniciar juego"
              aria-label="Reiniciar el juego"
            >
              <ResetIcon />
            </button>

            {/* Accessibility Settings */}
            <AccessibilitySettings />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-6 py-3 bg-gradient-to-r from-gray-50/50 to-gray-100/50 backdrop-blur-sm border-t border-white/10">
          <div className="flex items-center justify-between">

            {/* Stats Section */}
            <div className="flex items-center gap-6">

              {/* Score */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-sky-100 to-sky-200 rounded-lg shadow-sm">
                  <span className="text-sm font-bold text-sky-700">{game.score}</span>
                </div>
                <span className="text-xs text-gray-600 font-medium">Puntos</span>
              </div>

              {/* Time with Play/Pause */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePausePlay}
                  className={`p-1.5 rounded-lg transition-all transform hover:scale-110 active:scale-95 shadow-sm ${
                    game.isPaused
                      ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 text-emerald-700'
                      : 'bg-gradient-to-br from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 text-orange-700'
                  }`}
                  title={game.isPaused ? 'Reanudar' : 'Pausar'}
                  aria-label={game.isPaused ? 'Reanudar juego' : 'Pausar juego'}
                  aria-pressed={game.isPaused}
                >
                  {game.isPaused ? <PlayIcon /> : <PauseIcon />}
                </button>
                <div className="flex items-center justify-center px-3 py-1 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg shadow-sm">
                  <span className="text-sm font-bold text-purple-700 tabular-nums">
                    {formatTime(game.elapsedTime)}
                  </span>
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  {game.isPaused ? 'Pausado' : 'Tiempo'}
                </span>
              </div>

              {/* Progress Text */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 font-medium">Progreso</span>
                <div className="flex items-center justify-center px-3 py-1 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg shadow-sm">
                  <span className="text-sm font-bold text-emerald-700">
                    {game.placedDepartments.size}/{game.getFilteredDepartments().length}
                  </span>
                </div>
              </div>

              {/* Attempts/Errors */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 font-medium">Intentos</span>
                <div className="flex items-center justify-center px-3 py-1 bg-gradient-to-br from-red-100 to-red-200 rounded-lg shadow-sm">
                  <span className="text-sm font-bold text-red-700">
                    {game.attempts}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Percentage Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 font-medium">Completado</span>
              <div className="flex items-center justify-center px-3 py-1 bg-gradient-to-r from-emerald-100 via-sky-100 to-purple-100 rounded-lg shadow-sm">
                <span className="text-sm font-bold text-transparent bg-gradient-to-r from-emerald-600 via-sky-600 to-purple-600 bg-clip-text">
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-gray-200 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-sky-500 to-purple-500 transition-all duration-700 ease-out shadow-lg"
            style={{ width: `${progress}%` }}
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
      </header>

      {/* Add shimmer animation to styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
}