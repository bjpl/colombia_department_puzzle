import { DragOverlay as DndDragOverlay } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  colors, spacing, textStyles, shadows
} from '../design-system';

export default function DragOverlay() {
  const game = useGame();
  const { getRegionColor, highContrast, colorMode } = useAccessibility();

  console.log('DragOverlay render:', {
    currentDepartment: game.currentDepartment?.name,
    isDragging: game.isDraggingDepartment
  });

  // Only show for mouse dragging, not keyboard navigation
  if (!game.currentDepartment || !game.isDraggingDepartment) {
    return null;
  }

  // Use dynamic colors from accessibility context
  const backgroundColor = getRegionColor(game.currentDepartment.region);

  // Determine text color based on background for proper contrast (matching DepartmentTray)
  const needsLightText = (color: string): boolean => {
    const darkColors = ['black', 'blue-800', 'purple-800', 'green-800', 'cyan-800'];
    return darkColors.includes(color.toUpperCase());
  };

  const borderColor = highContrast ? colors.gray[950] : colors.gray[600];
  const borderWidth = highContrast ? '4px' : '2px';
  const textColor = highContrast
    ? needsLightText(backgroundColor) ? colors.gray[50] : colors.gray[950]
    : colorMode !== 'normal' ? colors.gray[50] : colors.gray[800];

  return (
    <DndDragOverlay dropAnimation={null}>
      {/* Compact chip-style overlay matching the original chip with accessibility colors */}
      <div
        className="inline-flex items-center cursor-grabbing py-1 px-3 rounded-md shadow-xl border-solid transform scale-110"
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
          borderColor: borderColor,
          borderWidth: borderWidth
        }}
      >
        <span className="text-sm font-medium">
          {game.currentDepartment.name}
        </span>
      </div>
    </DndDragOverlay>
  );
}