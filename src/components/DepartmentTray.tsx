import { useDraggable } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';
import { REGION_TAILWIND_CLASSES } from '../constants/regionColors';

// Ultra-compact mini chip for maximum map space
function DraggableChip({ department }: { department: any }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: department.id,
    data: department,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 9999,
  } : undefined;

  const colorClass = REGION_TAILWIND_CLASSES[department.region] || 'bg-gray-100 border-gray-300 hover:bg-gray-200';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        inline-flex items-center px-2 py-1 rounded-md
        ${colorClass}
        border-2 cursor-move select-none
        hover:shadow-md hover:scale-105
        transition-all duration-150
        ${isDragging ? 'opacity-50 shadow-xl ring-2 ring-blue-400' : ''}
      `}
      title={`${department.name} - Capital: ${department.capital} - Región: ${department.region}`}
      role="button"
      tabIndex={0}
      aria-label={`Arrastra ${department.name} al mapa. Capital: ${department.capital}, Región: ${department.region}`}
      aria-grabbed={isDragging}
      data-department-id={department.id}
    >
      <span className="text-[11px] font-bold truncate max-w-[80px]">
        {department.name}
      </span>
    </div>
  );
}

// Legacy full-size component (kept for compatibility)
function DraggableDepartment({ department, compact = false }: { department: any; compact?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: department.id,
    data: department,
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
      role="button"
      tabIndex={0}
      aria-label={`Departamento ${department.name}. Capital: ${department.capital}. Región: ${department.region}. Presiona Enter para seleccionar, luego usa las flechas para mover`}
      aria-grabbed={isDragging}
      aria-describedby={`hint-${department.id}`}
      data-department-id={department.id}
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
      <span id={`hint-${department.id}`} className="sr-only">
        Arrastra este departamento al mapa para colocarlo en su ubicación correcta
      </span>
    </div>
  );
}

interface DepartmentTrayProps {
  layout?: 'horizontal' | 'vertical' | 'compact' | 'ultra-compact';
}

export default function DepartmentTray({ layout = 'horizontal' }: DepartmentTrayProps) {
  const game = useGame();

  // Use filtered departments from game state (respects regional mode)
  const activeDepartments = game.getFilteredDepartments();

  // Filter out already placed departments
  const availableDepartments = activeDepartments.filter(
    dept => !game.placedDepartments.has(dept.id)
  );

  if (availableDepartments.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500" role="status" aria-live="polite">
        <div className="text-xl mb-1" aria-hidden="true">🎉</div>
        <div className="text-sm">¡Completado!</div>
        <div className="text-xs mt-1 text-green-600 font-semibold">¡Excelente!</div>
        <span className="sr-only">Todos los departamentos han sido colocados correctamente</span>
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

  // Compact chip layout for minimal space usage
  if (layout === 'compact') {
    return (
      <div className="space-y-3" role="region" aria-label="Departamentos disponibles para colocar">
        {/* Region groups with compact chips */}
        {Object.entries(regionGroups).map(([region, depts]) => (
          <div key={region} className="space-y-1.5">
            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide px-1" id={`region-${region}`}>
              {region} ({depts.length})
            </h4>
            <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby={`region-${region}`}>
              {depts.map(department => (
                <DraggableChip
                  key={department.id}
                  department={department}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Ultra-compact layout for maximum map space
  if (layout === 'ultra-compact') {
    return (
      <div className="space-y-2" role="region" aria-label="Departamentos disponibles para colocar">
        {/* Tiny chips grouped by region */}
        {Object.entries(regionGroups).map(([region, depts]) => (
          <div key={region} className="space-y-1">
            <h4 className="text-[10px] font-semibold text-gray-500 uppercase px-0.5" id={`ultra-region-${region}`}>
              {region}
            </h4>
            <div className="flex flex-wrap gap-1" role="group" aria-labelledby={`ultra-region-${region}`}>
              {depts.map(department => (
                <DraggableChip
                  key={department.id}
                  department={department}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Vertical layout for sidebar
  if (layout === 'vertical') {
    return (
      <div className="space-y-4" role="region" aria-label="Panel de departamentos">
        {/* Quick stats */}
        <div className="bg-blue-50 rounded-lg p-3 text-center" role="status" aria-live="polite" aria-atomic="true">
          <div className="text-2xl font-bold text-blue-600" aria-hidden="true">
            {availableDepartments.length}
          </div>
          <div className="text-xs text-gray-600">Departamentos restantes</div>
          <span className="sr-only">{availableDepartments.length} departamentos restantes por colocar</span>
        </div>

        {/* Departments by region */}
        {Object.entries(regionGroups).map(([region, depts]) => (
          <div key={region} className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide" id={`vert-region-${region}`}>
              {region}
            </h4>
            <div className="space-y-2" role="group" aria-labelledby={`vert-region-${region}`}>
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
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
      role="region"
      aria-label={`${availableDepartments.length} departamentos disponibles para colocar en el mapa`}
    >
      {sortedDepartments.map(department => (
        <DraggableDepartment key={department.id} department={department} />
      ))}
    </div>
  );
}