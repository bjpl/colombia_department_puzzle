import { DragOverlay as DndDragOverlay } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';

export default function DragOverlay() {
  const game = useGame();

  if (!game.currentDepartment) {
    return null;
  }

  // Get region color to match the chip being dragged
  const regionColors: { [key: string]: string } = {
    'Andina': 'bg-green-100 border-green-400',
    'Caribe': 'bg-blue-100 border-blue-400',
    'Pacífica': 'bg-purple-100 border-purple-400',
    'Orinoquía': 'bg-yellow-100 border-yellow-400',
    'Amazonía': 'bg-emerald-100 border-emerald-400',
    'Insular': 'bg-cyan-100 border-cyan-400',
  };

  const colorClass = regionColors[game.currentDepartment.region] || 'bg-gray-100 border-gray-400';

  return (
    <DndDragOverlay>
      {/* Compact chip-style overlay matching the original chip */}
      <div className={`
        inline-flex items-center px-3 py-1 rounded-md
        ${colorClass}
        border-2 shadow-2xl cursor-grabbing
        transform scale-125 opacity-90
      `}>
        <span className="text-xs font-semibold text-gray-800">
          {game.currentDepartment.name}
        </span>
      </div>
    </DndDragOverlay>
  );
}