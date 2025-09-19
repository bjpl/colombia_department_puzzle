import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';

function DraggableDepartment({ department, compact = false }: { department: any; compact?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: department.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 9999,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        relative bg-gradient-to-r from-blue-50 to-green-50
        border-2 border-blue-400 rounded-lg cursor-move
        hover:shadow-xl hover:scale-105 hover:border-blue-600
        transition-all duration-200 group
        ${isDragging ? 'opacity-50 z-50 shadow-2xl ring-4 ring-blue-400' : ''}
        ${compact ? 'p-2' : 'p-3'}
      `}
    >
      {/* Drag indicator */}
      <div className="absolute top-1 right-1 opacity-30 group-hover:opacity-70 transition-opacity">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M8 9h8M8 15h8" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>

      <div className="font-semibold text-gray-800 text-sm">{department.name}</div>
      {!compact && (
        <>
          <div className="text-xs text-gray-600 mt-1">📍 {department.capital}</div>
          <div className="text-xs text-blue-600 mt-1 font-medium">{department.region}</div>
        </>
      )}
    </div>
  );
}

interface DepartmentTrayProps {
  layout?: 'horizontal' | 'vertical';
}

export default function DepartmentTray({ layout = 'horizontal' }: DepartmentTrayProps) {
  const game = useGame();

  // Filter out already placed departments
  const availableDepartments = game.departments.filter(
    dept => !game.placedDepartments.has(dept.id)
  );

  if (availableDepartments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-2xl mb-2">🎉</div>
        <div>¡Todos los departamentos han sido colocados!</div>
        <div className="text-xs mt-2">¡Excelente trabajo!</div>
      </div>
    );
  }

  // Sort departments alphabetically for easier finding
  const sortedDepartments = [...availableDepartments].sort((a, b) =>
    a.name.localeCompare(b.name, 'es')
  );

  // Group departments by region for better organization
  const regionGroups: { [key: string]: typeof sortedDepartments } = {};
  sortedDepartments.forEach(dept => {
    if (!regionGroups[dept.region]) {
      regionGroups[dept.region] = [];
    }
    regionGroups[dept.region].push(dept);
  });

  // Vertical layout for sidebar
  if (layout === 'vertical') {
    return (
      <div className="space-y-4">
        {/* Quick stats */}
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {availableDepartments.length}
          </div>
          <div className="text-xs text-gray-600">Departamentos restantes</div>
        </div>

        {/* Departments by region */}
        {Object.entries(regionGroups).map(([region, depts]) => (
          <div key={region} className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {region}
            </h4>
            <div className="space-y-2">
              {depts.map(department => (
                <DraggableDepartment
                  key={department.id}
                  department={department}
                  compact={false}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Horizontal layout (original)
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {sortedDepartments.map(department => (
        <DraggableDepartment key={department.id} department={department} />
      ))}
    </div>
  );
}