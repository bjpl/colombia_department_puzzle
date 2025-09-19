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

  // Memoize projection and path generator
  const { projection, pathGenerator, width, height } = useMemo(() => {
    const w = 800;
    const h = 600;

    const proj = geoMercator()
      .center([-74, 4.5])
      .scale(1600)
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
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-gray-300 rounded-lg shadow-inner bg-gradient-to-br from-blue-50 to-green-50"
        viewBox={`0 0 ${width} ${height}`}
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

        {/* Title */}
        <text
          x={width / 2}
          y={30}
          textAnchor="middle"
          className="text-2xl font-bold"
          fill="#1f2937"
        >
          Colombia - Rompecabezas de Departamentos
        </text>

        {/* Legend */}
        <g transform={`translate(${width - 140}, 50)`}>
          <rect width="130" height="70" fill="white" opacity="0.9" rx="5" stroke="#e5e7eb" />
          <text x="10" y="20" fontSize="12" fontWeight="600" fill="#374151">Leyenda:</text>
          <rect x="10" y="25" width="12" height="10" fill="#e5e7eb" />
          <text x="26" y="33" fontSize="11" fill="#6b7280">Por colocar</text>
          <rect x="10" y="40" width="12" height="10" fill="#10b981" />
          <text x="26" y="48" fontSize="11" fill="#6b7280">Colocado</text>
          <rect x="10" y="55" width="12" height="10" fill="#60a5fa" />
          <text x="26" y="63" fontSize="11" fill="#6b7280">Arrastrando</text>
        </g>
      </svg>

      {/* Hover tooltip */}
      {hoveredDepartment && (
        <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded shadow-lg pointer-events-none z-10">
          <p className="text-sm font-semibold">{hoveredDepartment}</p>
        </div>
      )}

      {/* Progress indicator */}
      <div className="mt-2 text-center">
        <div className="text-sm text-gray-600 mb-1">
          {game.placedDepartments.size} de {geoData.features.length} departamentos colocados
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(game.placedDepartments.size / geoData.features.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Display name for React DevTools
DepartmentPath.displayName = 'DepartmentPath';