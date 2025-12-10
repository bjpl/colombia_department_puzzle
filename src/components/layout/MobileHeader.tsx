/**
 * Mobile Header Component - Compact mobile-optimized header
 *
 * Design:
 * ┌─────────────────────────────────────┐
 * │ ☰  Score:120 · ⏱2:34 · 15/32  ⚙️ │ (56px height)
 * └─────────────────────────────────────┘
 *
 * Features:
 * - Height: 56px (standard mobile header)
 * - Fixed position (stays visible while scrolling)
 * - Safe area inset support (iOS notch)
 * - Condensed stats in one line
 * - 44×44px touch targets for icons
 * - Semi-transparent with backdrop blur
 * - Fade-in animation on mount
 */

import { useGame } from '../../context/GameContext';
import { Button } from '../../design-system';
import { Menu, Settings } from 'lucide-react';
import { cn } from '../../design-system/utils/cn';

export interface MobileHeaderProps {
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
  className?: string;
}

export function MobileHeader({
  onMenuClick,
  onSettingsClick,
  className,
}: MobileHeaderProps) {
  const game = useGame();

  /**
   * Format time as MM:SS
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Get condensed stats string
   */
  const getStatsString = (): string => {
    const score = game.score;
    const time = formatTime(game.elapsedTime);
    const progress = `${game.placedDepartments.size}/${game.getFilteredDepartments().length}`;

    return `Score:${score} · ⏱${time} · ${progress}`;
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-white/90 backdrop-blur-md',
        'border-b border-gray-200',
        'shadow-sm',
        'animate-fade-in',
        className
      )}
      style={{
        height: '56px',
        paddingTop: 'env(safe-area-inset-top)', // iOS notch support
      }}
      role="banner"
      aria-label="Panel de control del juego móvil"
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left: Menu button */}
        <Button
          variant="ghost"
          size="sm"
          icon={<Menu className="w-5 h-5" />}
          onClick={onMenuClick}
          title="Abrir menú"
          aria-label="Abrir menú de opciones"
          className="shrink-0"
        />

        {/* Center: Condensed stats */}
        <div
          className="flex-1 text-center px-2 overflow-hidden"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="text-sm font-semibold text-gray-900 truncate block">
            {getStatsString()}
          </span>
          <span className="sr-only">
            Puntuación: {game.score}, Tiempo: {formatTime(game.elapsedTime)},
            Progreso: {game.placedDepartments.size} de {game.getFilteredDepartments().length} departamentos
          </span>
        </div>

        {/* Right: Settings button */}
        <Button
          variant="ghost"
          size="sm"
          icon={<Settings className="w-5 h-5" />}
          onClick={onSettingsClick}
          title="Configuración"
          aria-label="Abrir configuración"
          className="shrink-0"
        />
      </div>

      {/* Fade-in animation */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 200ms ease-out;
        }
      `}</style>
    </header>
  );
}

/**
 * Mobile Header with Game Mode Display
 */
export interface MobileHeaderWithModeProps extends MobileHeaderProps {
  showMode?: boolean;
}

export function MobileHeaderWithMode({
  showMode = false,
  ...props
}: MobileHeaderWithModeProps) {
  const game = useGame();

  const getModeDisplay = (): string => {
    if (game.gameMode.type === 'full') return 'Colombia Completa';
    if (game.gameMode.type === 'progression') return 'Aprendizaje';
    if (game.gameMode.type === 'region' && game.gameMode.selectedRegions) {
      return game.gameMode.selectedRegions.join(', ');
    }
    return 'Personalizado';
  };

  if (!showMode) {
    return <MobileHeader {...props} />;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Main header */}
      <MobileHeader {...props} />

      {/* Mode indicator bar */}
      <div
        className="bg-sky-50 border-b border-sky-100 px-4 py-1"
        style={{
          marginTop: '56px',
        }}
      >
        <div className="flex items-center justify-center">
          <span className="text-xs font-medium text-sky-700 truncate">
            Modo: {getModeDisplay()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MobileHeader;
