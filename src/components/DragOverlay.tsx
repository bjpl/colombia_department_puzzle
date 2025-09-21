import { DragOverlay as DndDragOverlay } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';
import { useAccessibility } from '../context/AccessibilityContext';

export default function DragOverlay() {
  const game = useGame();
  const { getRegionColor, highContrast, colorMode } = useAccessibility();

  if (!game.currentDepartment) {
    return null;
  }

  // Use dynamic colors from accessibility context
  const backgroundColor = getRegionColor(game.currentDepartment.region);

  // Determine text color based on background for proper contrast (matching DepartmentTray)
  const needsLightText = (color: string): boolean => {
    const darkColors = ['#000000', '#0000FF', '#800080', '#008000', '#008B8B'];
    return darkColors.includes(color.toUpperCase());
  };

  const borderClass = highContrast ? 'border-black' : 'border-gray-600';
  const borderWidth = highContrast ? 'border-4' : 'border-2';
  const textClass = highContrast
    ? needsLightText(backgroundColor) ? 'text-white' : 'text-black'
    : colorMode !== 'normal' ? 'text-white' : 'text-gray-800';

  return (
    <DndDragOverlay>
      {/* Compact chip-style overlay matching the original chip with accessibility colors */}
      <div
        className={`
          inline-flex items-center px-3 py-1 rounded-md
          ${borderClass} ${borderWidth} ${textClass}
          shadow-2xl cursor-grabbing
          transform scale-110
        `}
        style={{
          backgroundColor: backgroundColor,
        }}
      >
        <span className="text-xs font-bold">
          {game.currentDepartment.name}
        </span>
      </div>
    </DndDragOverlay>
  );
}