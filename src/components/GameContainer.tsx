import React, { useEffect } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, pointerWithin, rectIntersection } from '@dnd-kit/core';
import MapCanvas from './MapCanvas';
import DepartmentTray from './DepartmentTray';
import GameHeader from './GameHeader';
import EducationalPanel from './EducationalPanel';
import DragOverlay from './DragOverlay';
import { useGame } from '../context/GameContext';
import WinModal from './WinModal';
import { normalizeId, departmentNameMap } from '../utils/nameNormalizer';

export default function GameContainer() {
  const game = useGame();

  useEffect(() => {
    if (game.startTime && !game.isGameComplete) {
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - game.startTime!) / 1000);
        game.updateElapsedTime(elapsed);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [game.startTime, game.isGameComplete]);

  const handleDragStart = (event: DragStartEvent) => {
    const departmentId = event.active.id as string;
    const department = game.departments.find(d => d.id === departmentId);
    if (department) {
      game.selectDepartment(department);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      // Get the normalized names for comparison
      const draggedId = active.id as string;
      const targetId = over.id as string;

      // Get the mapped name for the dragged department
      const mappedDraggedName = departmentNameMap[draggedId] || normalizeId(draggedId);

      // Check if the placement is correct
      const isCorrect = mappedDraggedName === targetId || draggedId === targetId;

      if (isCorrect) {
        // Correct placement
        game.placeDepartment(targetId, true);
      } else {
        // Incorrect placement
        game.placeDepartment(draggedId, false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto p-4 max-w-[1400px]">
        <GameHeader />

        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          collisionDetection={rectIntersection}
          autoScroll={{
            enabled: true,
            interval: 5,
            threshold: {
              x: 0.2,
              y: 0.2,
            },
          }}
        >
          {/* Improved Layout: Fixed positions to eliminate scrolling */}
          <div className="mt-6 flex gap-6" style={{ height: 'calc(100vh - 200px)' }}>

            {/* Left Sidebar - Department Tray (Fixed) */}
            <div className="w-80 bg-white rounded-lg shadow-lg p-4 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4 sticky top-0 bg-white pb-2 border-b">
                🧩 Departamentos Disponibles
              </h3>
              <div className="space-y-2">
                <DepartmentTray layout="vertical" />
              </div>
            </div>

            {/* Center - Map Canvas (Fixed) */}
            <div className="flex-1 bg-white rounded-lg shadow-lg p-6 overflow-hidden">
              <MapCanvas />
            </div>

            {/* Right Sidebar - Educational Panel (Fixed) */}
            <div className="w-80 bg-white rounded-lg shadow-lg p-4 overflow-y-auto">
              <EducationalPanel />
            </div>
          </div>

          {/* Drag Overlay for visual feedback */}
          <DragOverlay />
        </DndContext>

        {game.isGameComplete && <WinModal />}
      </div>
    </div>
  );
}