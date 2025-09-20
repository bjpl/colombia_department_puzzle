import React, { useEffect, useState, useRef, useMemo, memo } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { useDroppable } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';
import { normalizeId } from '../utils/nameNormalizer';
import { colombiaDepartments } from '../data/colombiaDepartments';

interface GeoFeature {
  type: string;
  properties: {
    id: string;
    name: string;
    bbox?: number[];
  };
  geometry: any;
}

// Region color mapping
const regionColors: Record<string, string> = {
  'Andina': '#86efac', // Green
  'Caribe': '#93c5fd', // Blue
  'Pacífica': '#e9d5ff', // Light Purple (lighter for better border visibility)
  'Orinoquía': '#fde047', // Yellow
  'Amazonía': '#6ee7b7', // Emerald
  'Insular': '#67e8f9', // Cyan
};

// Memoized department component to prevent unnecessary re-renders
const DepartmentPath = memo(({
  feature,
  pathString,
  isPlaced,
  isOver,
  isDragging,
  showRegionColors
}: {
  feature: GeoFeature;
  pathString: string;
  isPlaced: boolean;
  isOver: boolean;
  isDragging: boolean;
  showRegionColors: boolean;
}) => {
  // Find the region for this department
  const department = colombiaDepartments.find(d =>
    normalizeId(d.name) === normalizeId(feature.properties.name) ||
    d.id === feature.properties.id
  );
  const regionColor = department ? regionColors[department.region] : '#e5e7eb';

  const departmentColor = useMemo(() => {
    if (isPlaced) return '#10b981'; // Green for placed
    if (isOver && isDragging) return '#fbbf24'; // Yellow/gold when hovering
    if (showRegionColors) return regionColor; // Show region color
    return '#e5e7eb'; // Default gray for unplaced
  }, [isPlaced, isOver, isDragging, showRegionColors, regionColor]);

  const strokeColor = useMemo(() => {
    if (isOver && isDragging) return '#f59e0b'; // Orange border when drop target
    if (isOver) return '#3b82f6'; // Blue border on hover
    return '#374151'; // Default dark gray
  }, [isOver, isDragging]);

  const strokeWidth = useMemo(() => {
    if (isOver && isDragging) return '3'; // Thick border when drop target
    if (isOver) return '2'; // Medium border on hover
    return '1'; // Default thin border
  }, [isOver, isDragging]);

  return (
    <path
      d={pathString}
      fill={departmentColor}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      opacity={isPlaced ? 0.8 : isOver ? 0.9 : 0.6}
      className="transition-all duration-200"
      style={{
        cursor: isDragging ? 'grabbing' : 'pointer',
        filter: isOver && isDragging ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))' : 'none'
      }}
    />
  );
});

// Droppable wrapper for each department
const DroppableDepartment = ({ feature, isDragging, children }: {
  feature: GeoFeature;
  isDragging: boolean;
  children: (isOver: boolean) => React.ReactNode;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: normalizeId(feature.properties.name),
    data: {
      name: feature.properties.name
    }
  });

  return (
    <g ref={setNodeRef} data-over={isOver}>
      {children(isOver)}
    </g>
  );
};

export default function OptimizedColombiaMap() {
  const [geoData, setGeoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [draggedOverDepartment, setDraggedOverDepartment] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showRegionColors, setShowRegionColors] = useState(false); // New state for region colors
  const svgRef = useRef<SVGSVGElement>(null);
  const game = useGame();
  const isDragging = game.currentDepartment !== null;

  useEffect(() => {
    loadGeoDataProgressive();
  }, []);

  const loadGeoDataProgressive = async () => {
    try {
      // Step 1: Load ultra-light version first (8KB)
      setLoadingProgress(10);
      const ultraLightResponse = await fetch(`${import.meta.env.BASE_URL}data/colombia-departments-ultralight.json`);
      const ultraLightData = await ultraLightResponse.json();
      setGeoData(ultraLightData);
      setLoadingProgress(30);

      // Step 2: Load optimized version (110KB)
      const optimizedResponse = await fetch(`${import.meta.env.BASE_URL}data/colombia-departments-optimized.json`);
      const optimizedData = await optimizedResponse.json();
      setGeoData(optimizedData);
      setLoadingProgress(100);
      setIsLoading(false);

      // Map data loaded successfully
    } catch (error) {
      // Error loading map data - falling back to simplified version
      // Fallback to simplified version
      try {
        const fallbackResponse = await fetch(`${import.meta.env.BASE_URL}data/colombia-departments-simplified.json`);
        const fallbackData = await fallbackResponse.json();
        setGeoData(fallbackData);
        setIsLoading(false);
      } catch (fallbackError) {
        setIsLoading(false);
        // Both primary and fallback data loading failed
      }
    }
  };

  // Memoize projection and path generator with MAXIMIZED sizing
  const { projection, pathGenerator, width, height } = useMemo(() => {
    // Calculate optimal dimensions based on viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // MAXIMIZE map size - only accounting for small sidebars (2x 208px) and minimal padding
    const w = Math.max(viewportWidth - 450, 1000); // Much larger map, minimum 1000px
    const h = Math.max(viewportHeight - 200, 650); // Use most of vertical space

    // Increase scale significantly for a larger map display
    const scale = Math.min(w, h) * 3.2; // Increased from 2.5 to 3.2

    const proj = geoMercator()
      .center([-74, 4.5])
      .scale(scale)
      .translate([w / 2, h / 2]);

    const path = geoPath().projection(proj);

    return { projection: proj, pathGenerator: path, width: w, height: h };
  }, []);

  // Memoize path strings to avoid recalculation
  const pathStrings = useMemo(() => {
    if (!geoData) return {};

    const paths: Record<string, string> = {};
    geoData.features.forEach((feature: GeoFeature) => {
      const pathString = pathGenerator(feature);
      if (pathString) {
        paths[feature.properties.id || feature.properties.name] = pathString;
      }
    });

    return paths;
  }, [geoData, pathGenerator]);

  if (isLoading || !geoData) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="mb-4">
          <div className="text-gray-600 animate-pulse mb-2">Cargando mapa de Colombia...</div>
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-500"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Handle mouse wheel zoom at cursor position
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    // Get mouse position relative to SVG
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert to SVG coordinates
    const svgX = (mouseX / rect.width) * width;
    const svgY = (mouseY / rect.height) * height;

    // Calculate zoom
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(zoomLevel * delta, 0.5), 4);

    // Adjust pan to keep point under cursor
    const zoomRatio = newZoom / zoomLevel;
    const newPanX = panOffset.x + (svgX - width / 2) * (1 - zoomRatio);
    const newPanY = panOffset.y + (svgY - height / 2) * (1 - zoomRatio);

    setZoomLevel(newZoom);
    setPanOffset({ x: newPanX, y: newPanY });
  };

  // Handle pan start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !isDragging && zoomLevel > 1) { // Only pan when zoomed in
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      e.preventDefault();
    }
  };

  // Handle pan move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && !isDragging) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  // Handle pan end
  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Reset zoom and pan
  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Pan Indicator */}
      {zoomLevel > 1 && !isDragging && (
        <div className="absolute top-4 left-4 z-20 bg-white/90 px-3 py-2 rounded-lg shadow-md border border-gray-300">
          <div className="text-xs text-gray-600 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />
            </svg>
            Arrastra para mover
          </div>
        </div>
      )}

      {/* Region Color Toggle */}
      <div className="absolute bottom-4 left-4 z-20">
        <button
          onClick={() => setShowRegionColors(!showRegionColors)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-md border transition-all ${
            showRegionColors
              ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
          title="Mostrar/Ocultar colores de regiones"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">
            {showRegionColors ? 'Ocultar' : 'Mostrar'} Regiones
          </span>
        </button>
        {showRegionColors && (
          <div className="mt-2 bg-white/95 rounded-lg shadow-md p-3 border border-gray-300">
            <p className="text-xs font-semibold text-gray-700 mb-2">Regiones de Colombia:</p>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: regionColors['Andina'] }}></div>
                <span>Andina</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: regionColors['Caribe'] }}></div>
                <span>Caribe</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: regionColors['Pacífica'] }}></div>
                <span>Pacífica</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: regionColors['Orinoquía'] }}></div>
                <span>Orinoquía</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: regionColors['Amazonía'] }}></div>
                <span>Amazonía</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: regionColors['Insular'] }}></div>
                <span>Insular</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setZoomLevel(Math.min(zoomLevel * 1.2, 4))}
          className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-lg shadow-md border border-gray-300"
          title="Acercar (Zoom In)"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M8 6a.5.5 0 01.5.5V7.5H9.5a.5.5 0 010 1H8.5V9.5a.5.5 0 01-1 0V8.5H6.5a.5.5 0 010-1H7.5V6.5A.5.5 0 018 6z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={() => setZoomLevel(Math.max(zoomLevel * 0.8, 0.5))}
          className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-lg shadow-md border border-gray-300"
          title="Alejar (Zoom Out)"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M6.5 8a.5.5 0 01.5-.5h2a.5.5 0 010 1H7a.5.5 0 01-.5-.5z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={resetView}
          className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-lg shadow-md border border-gray-300"
          title="Restablecer Vista"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="text-xs text-center bg-white px-2 py-1 rounded border border-gray-300">
          {Math.round(zoomLevel * 100)}%
        </div>
      </div>

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="border border-gray-200 rounded-lg shadow-lg bg-gradient-to-br from-blue-50 via-white to-green-50"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: '100%',
          height: '100%',
          minHeight: '550px',
          cursor: isPanning ? 'grabbing' : (isDragging ? 'default' : 'grab')
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Ocean gradient */}
        <defs>
          <linearGradient id="ocean" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#dbeafe', stopOpacity: 0.5 }} />
            <stop offset="100%" style={{ stopColor: '#bbf7d0', stopOpacity: 0.3 }} />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width={width} height={height} fill="url(#ocean)" />

        {/* Render departments with zoom and pan transform */}
        <g transform={`translate(${width / 2 + panOffset.x}, ${height / 2 + panOffset.y}) scale(${zoomLevel}) translate(${-width / 2}, ${-height / 2})`}>
          {geoData.features.map((feature: GeoFeature) => {
            const key = feature.properties.id || feature.properties.name;
            const pathString = pathStrings[key];

            if (!pathString) return null;

            const normalizedName = normalizeId(feature.properties.name);
            const isPlaced = game.placedDepartments.has(normalizedName);

            return (
              <DroppableDepartment key={key} feature={feature} isDragging={isDragging}>
                {(isOver) => {
                  // Update draggedOver state when hovering
                  if (isOver && draggedOverDepartment !== feature.properties.name) {
                    setDraggedOverDepartment(feature.properties.name);
                  } else if (!isOver && draggedOverDepartment === feature.properties.name) {
                    setDraggedOverDepartment(null);
                  }

                  return (
                    <DepartmentPath
                      feature={feature}
                      pathString={pathString}
                      isPlaced={isPlaced}
                      isOver={isOver}
                      isDragging={isDragging}
                      showRegionColors={showRegionColors}
                    />
                  );
                }}
              </DroppableDepartment>
            );
          })}
        </g>

        {/* Title - Made smaller to save space */}
        <text
          x={width / 2}
          y={25}
          textAnchor="middle"
          className="text-xl font-bold"
          fill="#1f2937"
        >
          Colombia - Rompecabezas de Departamentos
        </text>

        {/* Legend - Made smaller and repositioned */}
        <g transform={`translate(${width - 120}, 40)`}>
          <rect width="110" height="60" fill="white" opacity="0.85" rx="4" stroke="#e5e7eb" strokeWidth="0.5" />
          <text x="8" y="16" fontSize="10" fontWeight="600" fill="#374151">Leyenda:</text>
          <rect x="8" y="22" width="10" height="8" fill="#e5e7eb" />
          <text x="22" y="29" fontSize="9" fill="#6b7280">Por colocar</text>
          <rect x="8" y="34" width="10" height="8" fill="#10b981" />
          <text x="22" y="41" fontSize="9" fill="#6b7280">Colocado</text>
          <rect x="8" y="46" width="10" height="8" fill="#fbbf24" />
          <text x="22" y="53" fontSize="9" fill="#6b7280">Zona objetivo</text>
        </g>
      </svg>

      {/* Zoom hint for small departments */}
      {zoomLevel === 1 && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 pointer-events-none">
          <div className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full border border-blue-300">
            🔍 Usa la rueda del mouse o los botones para hacer zoom en áreas pequeñas como Bogotá
          </div>
        </div>
      )}

      {/* Drag indicator only - shows drop zone is active without revealing the name */}
      {draggedOverDepartment && isDragging && (
        <div className="absolute top-2 left-2 pointer-events-none z-10">
          <div className="bg-yellow-100 border-2 border-yellow-500 px-3 py-2 rounded-lg shadow-xl flex items-center gap-2">
            <div className="text-yellow-600">📍</div>
            <p className="text-sm font-semibold text-yellow-700">Zona de destino</p>
          </div>
        </div>
      )}

      {/* Progress indicator - Made more compact */}
      <div className="absolute bottom-2 left-2 right-2">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>{game.placedDepartments.size} de {geoData.features.length} colocados</span>
          <span>{Math.round((game.placedDepartments.size / geoData.features.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-blue-400 to-green-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(game.placedDepartments.size / geoData.features.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Display name for React DevTools
DepartmentPath.displayName = 'DepartmentPath';