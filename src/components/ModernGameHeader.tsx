import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useSoundEffect } from '../services/soundManager';
import { Button } from '../design-system';
import { cn } from '../design-system/utils/cn';
import AccessibilitySettings from './AccessibilitySettings';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Lightbulb,
  RotateCcw,
  BookOpen,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface ModernGameHeaderProps {
  onStudyMode?: () => void;
  onTutorial?: () => void;
  onGameMode?: () => void;
}

export default function ModernGameHeader({
  onStudyMode,
  onTutorial,
  onGameMode,
}: ModernGameHeaderProps) {
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

  const progress = Math.round(
    (game.placedDepartments.size / game.getFilteredDepartments().length) * 100
  );

  const getModeDisplay = () => {
    if (game.gameMode.type === 'full') return 'Colombia Completa';
    if (game.gameMode.type === 'progression') return 'Modo Aprendizaje';
    if (game.gameMode.type === 'region' && game.gameMode.selectedRegions) {
      const regions = game.gameMode.selectedRegions.join(', ');
      return regions;
    }
    return 'Personalizado';
  };

  return (
    <header
      className="bg-white border-b border-gray-200 shadow-sm"
      role="banner"
      aria-label="Panel de control del juego"
    >
      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Branding */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-900 rounded-lg">
              <span className="text-lg">🇨🇴</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Rompecabezas de Colombia
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">Modo:</span>
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
                  {getModeDisplay()}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Hints */}
            <Button
              variant="secondary"
              size="sm"
              icon={<Lightbulb className="w-4 h-4" />}
              className="relative"
              title={`${game.hints} pistas disponibles`}
              aria-label={`${game.hints} pistas disponibles`}
            >
              <span className="hidden sm:inline ml-1">Pista</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {game.hints}
              </span>
            </Button>

            {/* Sound Toggle */}
            <Button
              variant="ghost"
              size="sm"
              icon={soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              onClick={toggleSound}
              title={soundEnabled ? 'Silenciar' : 'Activar sonido'}
              aria-label={soundEnabled ? 'Silenciar efectos de sonido' : 'Activar efectos de sonido'}
              aria-pressed={soundEnabled}
            />

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300" />

            {/* Mode Actions */}
            {onStudyMode && (
              <Button
                variant="ghost"
                size="sm"
                icon={<BookOpen className="w-4 h-4" />}
                onClick={onStudyMode}
                title="Modo de estudio"
                aria-label="Abrir modo de estudio"
              />
            )}

            {onGameMode && (
              <Button
                variant="ghost"
                size="sm"
                icon={<Settings className="w-4 h-4" />}
                onClick={onGameMode}
                title="Cambiar modo de juego"
                aria-label="Cambiar modo de juego"
              />
            )}

            {onTutorial && (
              <Button
                variant="ghost"
                size="sm"
                icon={<HelpCircle className="w-4 h-4" />}
                onClick={onTutorial}
                title="Tutorial"
                aria-label="Ver tutorial interactivo"
              />
            )}

            {/* Reset */}
            <Button
              variant="ghost"
              size="sm"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={game.resetGame}
              title="Reiniciar juego"
              aria-label="Reiniciar el juego"
            />

            {/* Accessibility Settings */}
            <AccessibilitySettings />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          {/* Stats */}
          <div className="flex items-center gap-6">
            {/* Score */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {game.score}
              </span>
              <span className="text-xs text-gray-500">puntos</span>
            </div>

            {/* Timer with Play/Pause */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                icon={
                  game.isPaused ? (
                    <Play className="w-3 h-3" />
                  ) : (
                    <Pause className="w-3 h-3" />
                  )
                }
                onClick={handlePausePlay}
                title={game.isPaused ? 'Reanudar' : 'Pausar'}
                aria-label={game.isPaused ? 'Reanudar juego' : 'Pausar juego'}
                aria-pressed={game.isPaused}
                className="h-6 w-6 p-0"
              />
              <span className="text-sm font-mono font-medium text-gray-900">
                {formatTime(game.elapsedTime)}
              </span>
              <span className="text-xs text-gray-500">
                {game.isPaused ? 'pausado' : 'tiempo'}
              </span>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {game.placedDepartments.size}/{game.getFilteredDepartments().length}
              </span>
              <span className="text-xs text-gray-500">progreso</span>
            </div>

            {/* Attempts */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {game.attempts}
              </span>
              <span className="text-xs text-gray-500">intentos</span>
            </div>
          </div>

          {/* Progress Percentage */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">completado</span>
            <span className="text-sm font-semibold text-gray-900">
              {progress}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={cn(
                'bg-gray-900 h-1.5 rounded-full transition-all duration-700 ease-out',
                progress > 0 && 'bg-gradient-to-r from-gray-800 to-gray-900'
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}