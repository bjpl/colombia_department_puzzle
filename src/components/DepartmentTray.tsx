import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';

function DraggableDepartment({ department }: { department: any }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: department.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        bg-white border-2 border-blue-400 rounded-lg p-3 cursor-move
        hover:shadow-lg hover:scale-105 transition-all duration-200
        ${isDragging ? 'opacity-50 z-50' : ''}
      `}
    >
      <div className="font-semibold text-gray-800">{department.name}</div>
      <div className="text-xs text-gray-600">{department.capital}</div>
      <div className="text-xs text-blue-600 mt-1">{department.region}</div>
    </div>
  );
}

export default function DepartmentTray() {
  const game = useGame();

  // Filter out already placed departments
  const availableDepartments = game.departments.filter(
    dept => !game.placedDepartments.has(dept.id)
  );

  if (availableDepartments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        ¡Todos los departamentos han sido colocados! 🎉
      </div>
    );
  }

  // Sort departments alphabetically for easier finding
  const sortedDepartments = [...availableDepartments].sort((a, b) =>
    a.name.localeCompare(b.name, 'es')
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {sortedDepartments.map(department => (
        <DraggableDepartment key={department.id} department={department} />
      ))}
    </div>
  );
}