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
  const borderClass = highContrast ? 'border-white' : 'border-gray-600';
  const textClass = highContrast || colorMode !== 'normal' ? 'text-white' : 'text-gray-800';

  return (
    <DndDragOverlay>
      {/* Compact chip-style overlay matching the original chip with accessibility colors */}
      <div
        className={`
          inline-flex items-center px-3 py-1 rounded-md
          ${borderClass} ${textClass}
          border-2 shadow-2xl cursor-grabbing
          transform scale-110
        `}
        style={{
          backgroundColor: backgroundColor,
          opacity: 0.95,
        }}
      >
        <span className="text-xs font-bold">
          {game.currentDepartment.name}
        </span>
      </div>
    </DndDragOverlay>
  );
}