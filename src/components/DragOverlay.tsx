import { DragOverlay as DndDragOverlay } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  colors, spacing, textStyles, shadows
} from '../design-system';

export default function DragOverlay() {
  const game = useGame();
  const { getRegionColor, colorMode } = useAccessibility();

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

  // All our WCAG AAA colors work with white text
  const borderColor = colors.gray[700]; // Dark border for visibility
  const borderWidth = '2px';
  const textColor = colors.text.inverse; // Always white for contrast

  return (
    <DndDragOverlay dropAnimation={null}>
      {/* Compact chip-style overlay matching the original chip with accessibility colors */}
      <div
        className="inline-flex items-center cursor-grabbing py-1 px-3 rounded-md shadow-xl border-solid transform scale-110"
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
          borderColor: borderColor,
          borderWidth: borderWidth,
          borderStyle: 'solid',
          textShadow: '0 1px 2px rgba(0,0,0,0.2)', // Better text readability
          fontWeight: 600 // Bolder text
        }}
      >
        <span className="text-sm font-medium">
          {game.currentDepartment.name}
        </span>
      </div>
    </DndDragOverlay>
  );
}