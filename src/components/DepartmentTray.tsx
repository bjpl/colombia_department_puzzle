import { useDraggable } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { REGION_TAILWIND_CLASSES } from '../constants/regionColors';
import { normalizeId } from '../utils/nameNormalizer';
import { Department } from '../data/colombiaDepartments';

// Ultra-compact mini chip for maximum map space
function DraggableChip({ department }: { department: Department }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: department.id,
    data: department,
  });
  const { getRegionColor, highContrast, colorMode } = useAccessibility();

  // Dynamic background color based on accessibility settings
  const backgroundColor = getRegionColor(department.region);

  // Style for dragging and normal state
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 9999,
    backgroundColor: backgroundColor,
  } : {
    backgroundColor: backgroundColor,
  };

  // Determine text color based on background for proper contrast
  const needsLightText = (color: string): boolean => {
    // Colors that need white text for contrast
    const darkColors = ['#000000', '#0000FF', '#800080', '#008000', '#008B8B'];
    return darkColors.includes(color.toUpperCase());
  };

  const borderClass = highContrast ? 'border-black' : 'border-gray-600';
  const borderWidth = highContrast ? 'border-4' : 'border-2';
  const textClass = highContrast
    ? needsLightText(backgroundColor) ? 'text-white' : 'text-black'
    : colorMode !== 'normal' ? 'text-white' : 'text-gray-800';

  // Handle keyboard events properly
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // For keyboard navigation, we want Tab + Enter to work
    // Only prevent default space scrolling
    if (e.key === ' ') {
      e.preventDefault(); // Prevent page scroll
    }
    // Don't block Enter - let it trigger either keyboard nav or drag
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        inline-flex items-center px-2 py-1 rounded-md
        ${borderClass} ${borderWidth} ${textClass}
        cursor-move select-none
        transition-all duration-150
        ${isDragging ? 'opacity-0' : 'hover:shadow-md hover:scale-105'}
      `}
      role="button"
      tabIndex={0}
      aria-label={`Arrastra ${department.name} al mapa. Capital: ${department.capital}, Región: ${department.region}`}
      aria-grabbed={isDragging}
      data-department-id={department.id}
      onKeyDown={handleKeyDown}
    >
      <span className="text-[11px] font-bold truncate" style={{ maxWidth: '75px' }}>
        {department.name}
      </span>
    </div>
  );
}

// Legacy full-size component (kept for compatibility)
function DraggableDepartment({ department, compact = false }: { department: Department; compact?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: department.id,
    data: department,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 9999,
  } : undefined;

  // Handle keyboard events properly
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault(); // Prevent page scroll
    }
    // Don't block Enter - let it work for selection
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        relative bg-gradient-to-r from-sky-50 to-green-50
        border-2 border-sky-400 rounded-lg cursor-move
        hover:shadow-xl hover:scale-105 hover:border-sky-600
        transition-all duration-200 group
        ${isDragging ? 'opacity-50 z-50 shadow-2xl ring-4 ring-sky-400' : ''}
        ${compact ? 'p-2' : 'p-3'}
      `}
      role="button"
      tabIndex={0}
      aria-label={`Departamento ${department.name}. Capital: ${department.capital}. Región: ${department.region}. Presiona Enter para seleccionar, luego usa las flechas para mover`}
      aria-grabbed={isDragging}
      aria-describedby={`hint-${department.id}`}
      data-department-id={department.id}
      onKeyDown={handleKeyDown}
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
          <div className="text-xs text-sky-600 mt-1 font-medium">{department.region}</div>
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

  // Define logical region order (alphabetical)
  const regionOrder = ['Amazonía', 'Andina', 'Caribe', 'Insular', 'Orinoquía', 'Pacífico'];

  // Sort regions according to defined order
  const sortedRegionEntries = Object.entries(regionGroups).sort((a, b) => {
    const indexA = regionOrder.indexOf(a[0]);
    const indexB = regionOrder.indexOf(b[0]);
    // If not in order list, sort alphabetically
    if (indexA === -1 && indexB === -1) return a[0].localeCompare(b[0]);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  // Compact chip layout for minimal space usage
  if (layout === 'compact') {
    return (
      <div className="space-y-3" role="region" aria-label="Departamentos disponibles para colocar">
        {/* Region groups with compact chips */}
        {sortedRegionEntries.map(([region, depts]) => (
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
      <div role="region" aria-label="Departamentos disponibles para colocar">
        {/* Tiny chips grouped by region */}
        {sortedRegionEntries.map(([region, depts], index) => (
          <div key={region} className={index > 0 ? "mt-2" : ""}>
            <h4 className="text-[10px] font-semibold text-gray-500 uppercase px-1 mb-1" id={`ultra-region-${region}`}>
              {region}
            </h4>
            <div className="flex flex-wrap gap-1 px-1" role="group" aria-labelledby={`ultra-region-${region}`}>
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
        <div className="bg-sky-50 rounded-lg p-3 text-center" role="status" aria-live="polite" aria-atomic="true">
          <div className="text-2xl font-bold text-sky-600" aria-hidden="true">
            {availableDepartments.length}
          </div>
          <div className="text-xs text-gray-600">Departamentos restantes</div>
          <span className="sr-only">{availableDepartments.length} departamentos restantes por colocar</span>
        </div>

        {/* Departments by region */}
        {sortedRegionEntries.map(([region, depts]) => (
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