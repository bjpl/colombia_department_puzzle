import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';

export default function MapCanvas() {
  const game = useGame();

  // For now, we'll create a simplified grid-based map
  // In production, we'd use actual GeoJSON/TopoJSON data with D3
  const createDepartmentDropZone = (department: any) => {
    const { setNodeRef, isOver } = useDroppable({
      id: department.id,
    });

    const isPlaced = game.placedDepartments.has(department.id);

    return (
      <div
        key={department.id}
        ref={setNodeRef}
        className={`
          relative border-2 border-gray-300 rounded-lg p-2
          transition-all duration-300
          ${isOver ? 'ring-4 ring-blue-400 bg-blue-50' : ''}
          ${isPlaced ? 'bg-green-100 border-green-500' : 'bg-gray-50'}
          min-h-[60px] flex items-center justify-center
        `}
      >
        {isPlaced ? (
          <div className="text-center">
            <div className="font-semibold text-green-700">{department.name}</div>
            <div className="text-xs text-green-600">{department.capital}</div>
          </div>
        ) : (
          <div className="text-gray-400 text-sm">
            {game.currentDepartment?.id === department.id && (
              <span className="animate-pulse">Coloca aquí</span>
            )}
          </div>
        )}
      </div>
    );
  };

  // Create a simplified grid layout for departments
  // This is a temporary solution - we'll implement actual map rendering later
  const gridLayout = [
    // Row 1 - Northern departments
    ['la-guajira', 'cesar', 'atlantico', 'magdalena'],
    // Row 2
    ['bolivar', 'sucre', 'cordoba', 'norte-santander'],
    // Row 3
    ['antioquia', 'santander', 'arauca'],
    // Row 4 - Central
    ['choco', 'risaralda', 'caldas', 'boyaca', 'casanare'],
    // Row 5
    ['valle-del-cauca', 'quindio', 'tolima', 'cundinamarca', 'vichada'],
    // Row 6
    ['cauca', 'huila', 'bogota', 'meta', 'guainia'],
    // Row 7
    ['narino', 'caqueta', 'guaviare', 'vaupes'],
    // Row 8 - Southern
    ['putumayo', 'amazonas'],
    // Island
    ['san-andres']
  ];

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Mapa de Colombia - Coloca los departamentos en su ubicación
      </h2>

      {gridLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="grid gap-2" style={{
          gridTemplateColumns: `repeat(${row.length}, 1fr)`
        }}>
          {row.map(deptId => {
            const department = game.departments.find(d => d.id === deptId);
            if (!department) return null;
            return createDepartmentDropZone(department);
          })}
        </div>
      ))}

      <div className="mt-4 text-center text-sm text-gray-600">
        {game.placedDepartments.size} de {game.departments.length} departamentos colocados
      </div>
    </div>
  );
}