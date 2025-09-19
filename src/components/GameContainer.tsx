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
          {/* MAXIMIZED Layout: Full-screen map with minimal sidebars */}
          <div className="mt-4 flex gap-3" style={{ height: 'calc(100vh - 140px)' }}>

            {/* Left Sidebar - Ultra-Compact Department Chips */}
            <div className="w-52 bg-white/90 rounded-lg shadow p-2 overflow-y-auto">
              <h3 className="text-xs font-bold mb-2 sticky top-0 bg-white z-10 pb-1 border-b flex items-center justify-between">
                <span>🧩 Departamentos</span>
                <span className="text-xs bg-blue-100 px-1.5 py-0.5 rounded-full">
                  {game.departments.filter(d => !game.placedDepartments.has(d.id)).length}
                </span>
              </h3>
              <div className="space-y-1">
                <DepartmentTray layout="ultra-compact" />
              </div>
            </div>

            {/* Center - MAXIMIZED Map Canvas */}
            <div className="flex-1 bg-white rounded-lg shadow-lg p-2 flex items-center justify-center" style={{ minHeight: '600px' }}>
              <MapCanvas />
            </div>

            {/* Right Sidebar - Ultra-Minimal Educational Panel */}
            <div className="w-52 bg-white/90 rounded-lg shadow p-2 overflow-y-auto">
              <EducationalPanel compact={true} />
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