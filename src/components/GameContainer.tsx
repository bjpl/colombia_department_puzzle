import React, { useEffect } from 'react';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import MapCanvas from './MapCanvas';
import DepartmentTray from './DepartmentTray';
import GameHeader from './GameHeader';
import EducationalPanel from './EducationalPanel';
import { useGame } from '../context/GameContext';
import WinModal from './WinModal';

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

    if (over && active.id === over.id) {
      // Correct placement
      game.placeDepartment(active.id as string, true);
    } else if (over) {
      // Incorrect placement
      game.placeDepartment(active.id as string, false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <GameHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Main game area */}
        <div className="lg:col-span-2">
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <MapCanvas />
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Departamentos Disponibles</h3>
              <DepartmentTray />
            </div>
          </DndContext>
        </div>

        {/* Side panel */}
        <div className="lg:col-span-1">
          <EducationalPanel />
        </div>
      </div>

      {game.isGameComplete && <WinModal />}
    </div>
  );
}