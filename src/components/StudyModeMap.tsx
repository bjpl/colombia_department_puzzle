import React, { useMemo, useState, useRef } from 'react';
import * as d3 from 'd3-geo';
import { Department } from '../data/colombiaDepartments';
import { normalizeId } from '../utils/nameNormalizer';

interface StudyModeMapProps {
  selectedDepartment: Department | null;
  studiedDepartments: Set<string>;
  onDepartmentClick: (dept: Department) => void;
  departments: Department[];
}

export default function StudyModeMap({
  selectedDepartment,
  studiedDepartments,
  onDepartmentClick,
  departments
}: StudyModeMapProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Simplified Colombia bounds
  const colombiaBounds = {
    type: "Feature" as const,
    geometry: {
      type: "Polygon" as const,
      coordinates: [[
        [-79, 12], [-79, -5], [-67, -5], [-67, 12], [-79, 12]
      ]]
    }
  };

  const projection = useMemo(() => {
    return d3.geoMercator()
      .center([-74, 4])
      .scale(1800)
      .translate([300, 250]);
  }, []);

  const getApproximatePosition = (dept: Department) => {
    // Approximate positions for each department
    const positions: Record<string, [number, number]> = {
      'amazonas': [-70, -1],
      'antioquia': [-75.5, 7],
      'arauca': [-70.7, 7],
      'atlantico': [-74.8, 10.9],
      'bolivar': [-74.5, 8.8],  // Adjusted slightly south to avoid Atlántico
      'boyaca': [-73.5, 5.5],
      'caldas': [-75.5, 5.1],   // Adjusted slightly north to separate from Quindío/Risaralda
      'caqueta': [-74, 1],
      'casanare': [-71.5, 5.5],
      'cauca': [-76.5, 2.5],
      'cesar': [-73.5, 9.5],
      'choco': [-77, 6],
      'cordoba': [-75.8, 8.5],
      'cundinamarca': [-74, 4.6],
      'guainia': [-68, 3],
      'guaviare': [-72, 2],
      'huila': [-75.5, 2.5],
      'la-guajira': [-72.5, 11.5],
      'magdalena': [-74.2, 10.2], // Adjusted slightly east to avoid Atlántico
      'meta': [-72.5, 3.5],
      'narino': [-77.5, 1.2],
      'norte-de-santander': [-72.5, 8],
      'putumayo': [-76, 0.5],
      'quindio': [-75.6, 4.4],     // Adjusted slightly south
      'risaralda': [-75.8, 4.9],    // Adjusted slightly west
      'san-andres-y-providencia': [-81.7, 12.5],
      'santander': [-73, 6.8],      // Adjusted slightly south to avoid Norte de Santander
      'sucre': [-75.4, 9.1],        // Adjusted slightly south to avoid overlap
      'tolima': [-75.1, 3.8],       // Adjusted slightly south
      'valle-del-cauca': [-76.5, 3.5],
      'vaupes': [-70.5, 1],
      'vichada': [-69, 5],
    };

    const pos = positions[normalizeId(dept.id)] || [-74, 4];
    return projection(pos);
  };

  const getRegionColor = (region: string, isSelected: boolean, isStudied: boolean) => {
    const opacity = isSelected ? '1' : isStudied ? '0.7' : '0.9';
    const colors: Record<string, string> = {
      'Andina': `rgba(34, 197, 94, ${opacity})`,
      'Caribe': `rgba(59, 130, 246, ${opacity})`,
      'Pacífica': `rgba(147, 51, 234, ${opacity})`,
      'Orinoquía': `rgba(250, 204, 21, ${opacity})`,
      'Amazonía': `rgba(16, 185, 129, ${opacity})`,
      'Insular': `rgba(6, 182, 212, ${opacity})`,
    };
    return colors[region] || `rgba(156, 163, 175, ${opacity})`;
  };

  // Handle zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(zoomLevel * delta, 0.5), 4);

    // Calculate zoom at cursor position
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const svgX = (mouseX / rect.width) * 600;
      const svgY = (mouseY / rect.height) * 500;

      const zoomRatio = newZoom / zoomLevel;
      const newPanX = panOffset.x + (svgX - 300) * (1 - zoomRatio);
      const newPanY = panOffset.y + (svgY - 250) * (1 - zoomRatio);

      setZoomLevel(newZoom);
      setPanOffset({ x: newPanX, y: newPanY });
    } else {
      setZoomLevel(newZoom);
    }
  };

  // Handle pan start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && zoomLevel > 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      e.preventDefault();
    }
  };

  // Handle pan move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
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

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsPanning(false);
  };

  // Reset zoom and pan
  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 rounded-lg relative">
      <svg
        ref={svgRef}
        width="600"
        height="500"
        className="w-full h-full"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isPanning ? 'grabbing' : zoomLevel > 1 ? 'grab' : 'default' }}
      >
        {/* Map background */}
        <rect width="600" height="500" fill="transparent" />

        {/* Apply zoom and pan transform to all content */}
        <g transform={`translate(${300 + panOffset.x}, ${250 + panOffset.y}) scale(${zoomLevel}) translate(-300, -250)`}>
          {/* Draw departments as circles */}
          {departments.map(dept => {
          const pos = getApproximatePosition(dept);
          if (!pos) return null;

          const isSelected = selectedDepartment?.id === dept.id;
          const isStudied = studiedDepartments.has(dept.id);

          return (
            <g key={dept.id}>
              {/* Connection lines for selected department */}
              {isSelected && (
                <circle
                  cx={pos[0]}
                  cy={pos[1]}
                  r="20"
                  fill="none"
                  stroke={getRegionColor(dept.region, true, false)}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
              )}

              {/* Department circle */}
              <circle
                cx={pos[0]}
                cy={pos[1]}
                r={isSelected ? "15" : "12"}
                fill={getRegionColor(dept.region, isSelected, isStudied)}
                stroke={isSelected ? '#fff' : 'rgba(255,255,255,0.5)'}
                strokeWidth={isSelected ? "2" : "1"}
                className={`cursor-pointer transition-all duration-300 ${
                  isSelected ? 'animate-pulse' : ''
                }`}
                onClick={() => onDepartmentClick(dept)}
                style={{ transform: isSelected ? 'scale(1.2)' : 'scale(1)', transformOrigin: `${pos[0]}px ${pos[1]}px` }}
              >
                <title>{dept.name} - {dept.capital}</title>
              </circle>

              {/* Department name (first 3 letters) */}
              <text
                x={pos[0]}
                y={pos[1]}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize={isSelected ? "10" : "8"}
                fontWeight={isSelected ? "bold" : "normal"}
                className="pointer-events-none"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
              >
                {dept.name.substring(0, 3).toUpperCase()}
              </text>

              {/* Checkmark for studied departments */}
              {isStudied && !isSelected && (
                <text
                  x={pos[0] + 10}
                  y={pos[1] - 10}
                  fontSize="12"
                  className="pointer-events-none"
                >
                  ✓
                </text>
              )}
            </g>
          );
          })}
        </g>

        {/* Legend - outside of transform so it stays in place */}
        <g transform="translate(20, 420)">
          <rect x="0" y="0" width="560" height="60" fill="rgba(255,255,255,0.9)" rx="5" />
          <text x="10" y="20" fontSize="12" fontWeight="bold" fill="#333">Regiones:</text>
          {Object.entries({
            'Andina': 'rgba(34, 197, 94, 1)',
            'Caribe': 'rgba(59, 130, 246, 1)',
            'Pacífica': 'rgba(147, 51, 234, 1)',
            'Orinoquía': 'rgba(250, 204, 21, 1)',
            'Amazonía': 'rgba(16, 185, 129, 1)',
            'Insular': 'rgba(6, 182, 212, 1)',
          }).map(([region, color], index) => (
            <g key={region} transform={`translate(${90 + index * 80}, 10)`}>
              <circle cx="10" cy="10" r="8" fill={color} />
              <text x="25" y="14" fontSize="11" fill="#333">{region}</text>
            </g>
          ))}
        </g>
      </svg>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setZoomLevel(Math.min(zoomLevel * 1.2, 4))}
          className="p-2 bg-white rounded-lg shadow hover:bg-gray-100 transition-colors"
          title="Acercar"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <circle cx="9" cy="9" r="7" strokeWidth="2"/>
            <path d="M9 6v6M6 9h6" strokeWidth="2" strokeLinecap="round"/>
            <path d="M14 14l4 4" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <button
          onClick={() => setZoomLevel(Math.max(zoomLevel * 0.8, 0.5))}
          className="p-2 bg-white rounded-lg shadow hover:bg-gray-100 transition-colors"
          title="Alejar"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <circle cx="9" cy="9" r="7" strokeWidth="2"/>
            <path d="M6 9h6" strokeWidth="2" strokeLinecap="round"/>
            <path d="M14 14l4 4" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <button
          onClick={resetView}
          className="p-2 bg-white rounded-lg shadow hover:bg-gray-100 transition-colors"
          title="Restablecer"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M4 10a6 6 0 0112 0M4 10v-4m0 4l3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 10a6 6 0 01-12 0M16 10v4m0-4l-3 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Zoom indicator */}
      {zoomLevel > 1 && (
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded shadow text-xs">
          Zoom: {Math.round(zoomLevel * 100)}%
        </div>
      )}

      {/* Pan hint */}
      {zoomLevel > 1 && (
        <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded shadow text-xs">
          🖱️ Arrastra para mover el mapa
        </div>
      )}
    </div>
  );
}