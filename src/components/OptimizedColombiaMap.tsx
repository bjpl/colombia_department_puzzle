import React, { useEffect, useState, useRef, useMemo, memo } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { useDroppable } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';
import { normalizeId } from '../utils/nameNormalizer';

interface GeoFeature {
  type: string;
  properties: {
    id: string;
    name: string;
    bbox?: number[];
  };
  geometry: any;
}

// Memoized department component to prevent unnecessary re-renders
const DepartmentPath = memo(({
  feature,
  pathString,
  isPlaced,
  isOver,
  onHover
}: {
  feature: GeoFeature;
  pathString: string;
  isPlaced: boolean;
  isOver: boolean;
  onHover: (name: string | null) => void;
}) => {
  const departmentColor = useMemo(() => {
    if (isPlaced) return '#10b981';
    if (isOver) return '#60a5fa';
    return '#e5e7eb';
  }, [isPlaced, isOver]);

  return (
    <path
      d={pathString}
      fill={departmentColor}
      stroke="#374151"
      strokeWidth="1"
      opacity={isPlaced ? 0.8 : 0.6}
      className="transition-colors duration-200"
      onMouseEnter={() => onHover(feature.properties.name)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: 'pointer' }}
    />
  );
});

// Droppable wrapper for each department
const DroppableDepartment = ({ feature, children }: { feature: GeoFeature; children: React.ReactNode }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: normalizeId(feature.properties.name),
  });

  return (
    <g ref={setNodeRef} data-over={isOver}>
      {children}
    </g>
  );
};

export default function OptimizedColombiaMap() {
  const [geoData, setGeoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [hoveredDepartment, setHoveredDepartment] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const game = useGame();

  useEffect(() => {
    loadGeoDataProgressive();
  }, []);

  const loadGeoDataProgressive = async () => {
    try {
      // Step 1: Load ultra-light version first (8KB)
      setLoadingProgress(10);
      const ultraLightResponse = await fetch('/data/colombia-departments-ultralight.json');
      const ultraLightData = await ultraLightResponse.json();
      setGeoData(ultraLightData);
      setLoadingProgress(30);

      // Step 2: Load optimized version (110KB)
      const optimizedResponse = await fetch('/data/colombia-departments-optimized.json');
      const optimizedData = await optimizedResponse.json();
      setGeoData(optimizedData);
      setLoadingProgress(100);
      setIsLoading(false);

      console.log('✅ Map data loaded:', optimizedData.features.length, 'departments');
    } catch (error) {
      console.error('❌ Error loading map data:', error);
      // Fallback to simplified version
      try {
        const fallbackResponse = await fetch('/data/colombia-departments-simplified.json');
        const fallbackData = await fallbackResponse.json();
        setGeoData(fallbackData);
        setIsLoading(false);
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
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

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="border border-gray-200 rounded-lg shadow-lg bg-gradient-to-br from-blue-50 via-white to-green-50"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: '100%', minHeight: '550px' }}
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

        {/* Render departments */}
        <g>
          {geoData.features.map((feature: GeoFeature) => {
            const key = feature.properties.id || feature.properties.name;
            const pathString = pathStrings[key];

            if (!pathString) return null;

            const normalizedName = normalizeId(feature.properties.name);
            const isPlaced = game.placedDepartments.has(normalizedName);

            return (
              <DroppableDepartment key={key} feature={feature}>
                <DepartmentPath
                  feature={feature}
                  pathString={pathString}
                  isPlaced={isPlaced}
                  isOver={false}
                  onHover={setHoveredDepartment}
                />
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
          <rect x="8" y="46" width="10" height="8" fill="#60a5fa" />
          <text x="22" y="53" fontSize="9" fill="#6b7280">Arrastrando</text>
        </g>
      </svg>

      {/* Hover tooltip */}
      {hoveredDepartment && (
        <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded shadow-lg pointer-events-none z-10">
          <p className="text-sm font-semibold">{hoveredDepartment}</p>
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