import React from 'react';
import { DragOverlay as DndDragOverlay } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';

export default function DragOverlay() {
  const game = useGame();

  if (!game.currentDepartment) {
    return null;
  }

  return (
    <DndDragOverlay>
      <div className="bg-gradient-to-r from-blue-100 to-green-100
                      border-3 border-blue-500 rounded-lg p-4
                      shadow-2xl cursor-grabbing transform scale-110
                      animate-pulse">
        <div className="font-bold text-lg text-gray-800">
          {game.currentDepartment.name}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          📍 {game.currentDepartment.capital}
        </div>
        <div className="text-xs text-blue-600 mt-1">
          {game.currentDepartment.region}
        </div>
        <div className="mt-2 text-xs text-green-600 font-semibold">
          ↓ Arrastra al mapa ↓
        </div>
      </div>
    </DndDragOverlay>
  );
}