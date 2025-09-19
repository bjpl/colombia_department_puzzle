import React, { useEffect, useState, useRef } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { useDroppable } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';

interface GeoFeature {
  type: string;
  properties: {
    id: string;
    name: string;
    code: string;
  };
  geometry: any;
}

interface DepartmentPathProps {
  feature: GeoFeature;
  path: string;
  isPlaced: boolean;
  isHovered: boolean;
  onHover: (name: string | null) => void;
}

function DepartmentPath({ feature, path, isPlaced, isHovered, onHover }: DepartmentPathProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: normalizeId(feature.properties.name),
  });

  const departmentColor = isPlaced
    ? '#10b981' // green for placed
    : isOver
      ? '#60a5fa' // blue when dragging over
      : isHovered
        ? '#fbbf24' // yellow when hovered
        : '#e5e7eb'; // gray default

  return (
    <g ref={setNodeRef}>
      <path
        d={path}
        fill={departmentColor}
        stroke="#374151"
        strokeWidth="0.5"
        opacity={isPlaced ? 0.8 : isOver ? 0.7 : 0.6}
        className="transition-all duration-300 cursor-pointer"
        onMouseEnter={() => onHover(feature.properties.name)}
        onMouseLeave={() => onHover(null)}
      />
      {isPlaced && (
        <text
          x={0}
          y={0}
          textAnchor="middle"
          className="text-xs font-semibold fill-gray-800 pointer-events-none"
          style={{
            transform: `translate(${getCentroid(path)}px)`,
            fontSize: '10px'
          }}
        >
          {feature.properties.name}
        </text>
      )}
    </g>
  );
}

// Helper to normalize department names for matching
function normalizeId(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with dash
    .replace(/-+/g, '-') // Replace multiple dashes with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing dashes
}

// Helper to get path centroid for label placement
function getCentroid(pathString: string): string {
  // This is a simplified centroid calculation
  // In production, use d3.geoCentroid for accuracy
  const coords = pathString.match(/[ML]\s*(-?\d+\.?\d*)\s*,?\s*(-?\d+\.?\d*)/);
  if (coords) {
    return `${coords[1]}, ${coords[2]}`;
  }
  return '0, 0';
}

export default function ColombiaMap() {
  const [geoData, setGeoData] = useState<any>(null);
  const [hoveredDepartment, setHoveredDepartment] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const game = useGame();

  useEffect(() => {
    // Load GeoJSON data
    fetch('/data/colombia-departments-simplified.json')
      .then(res => res.json())
      .then(data => {
        console.log('GeoJSON loaded:', data.features.length, 'departments');
        setGeoData(data);
      })
      .catch(err => console.error('Error loading GeoJSON:', err));
  }, []);

  if (!geoData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500 animate-pulse">Cargando mapa de Colombia...</div>
      </div>
    );
  }

  // Set up the projection and path generator
  const width = 800;
  const height = 600;

  const projection = geoMercator()
    .fitSize([width, height], geoData)
    .center([-74, 4]) // Center on Colombia
    .scale(2000); // Adjust scale as needed

  const pathGenerator = geoPath().projection(projection);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-gray-300 rounded-lg shadow-inner bg-gradient-to-br from-blue-50 to-green-50"
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Map background */}
        <rect width={width} height={height} fill="url(#ocean-gradient)" opacity={0.3} />

        {/* Ocean gradient definition */}
        <defs>
          <linearGradient id="ocean-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.1 }} />
            <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0.2 }} />
          </linearGradient>

          {/* Drop shadow for departments */}
          <filter id="drop-shadow">
            <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Render departments */}
        <g>
          {geoData.features.map((feature: GeoFeature) => {
            const pathString = pathGenerator(feature);
            if (!pathString) return null;

            const normalizedName = normalizeId(feature.properties.name);
            const isPlaced = game.placedDepartments.has(normalizedName);

            return (
              <DepartmentPath
                key={feature.properties.id || feature.properties.name}
                feature={feature}
                path={pathString}
                isPlaced={isPlaced}
                isHovered={hoveredDepartment === feature.properties.name}
                onHover={setHoveredDepartment}
              />
            );
          })}
        </g>

        {/* Title */}
        <text
          x={width / 2}
          y={30}
          textAnchor="middle"
          className="text-2xl font-bold fill-gray-800"
        >
          Mapa de Colombia
        </text>

        {/* Legend */}
        <g transform={`translate(${width - 150}, 50)`}>
          <rect width="140" height="80" fill="white" opacity="0.9" rx="5" />
          <text x="10" y="20" className="text-sm font-semibold fill-gray-800">Leyenda:</text>
          <rect x="10" y="30" width="15" height="10" fill="#e5e7eb" />
          <text x="30" y="38" className="text-xs fill-gray-700">Por colocar</text>
          <rect x="10" y="45" width="15" height="10" fill="#10b981" />
          <text x="30" y="53" className="text-xs fill-gray-700">Colocado</text>
          <rect x="10" y="60" width="15" height="10" fill="#60a5fa" />
          <text x="30" y="68" className="text-xs fill-gray-700">Arrastrando</text>
        </g>
      </svg>

      {/* Hover tooltip */}
      {hoveredDepartment && (
        <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded shadow-lg pointer-events-none">
          <p className="text-sm font-semibold">{hoveredDepartment}</p>
        </div>
      )}

      {/* Progress indicator */}
      <div className="mt-4 text-center text-sm text-gray-600">
        {game.placedDepartments.size} de {geoData.features.length} departamentos colocados
      </div>
    </div>
  );
}