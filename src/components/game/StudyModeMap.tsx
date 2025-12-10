import { useMemo, useState, useRef } from 'react';
import * as d3 from 'd3-geo';
import { Department } from '../../data/colombiaDepartments';
import { normalizeId } from '../../utils/nameNormalizer';
import { useAccessibility } from '../../context/AccessibilityContext';
import {
  Button, Badge,
  colors, spacing, textStyles, shadows
} from '../../design-system';

interface StudyModeMapProps {
  selectedDepartment: Department | null;
  studiedDepartments: Set<string>;
  onDepartmentClick: (dept: Department) => void;
  departments: Department[];
  focusedRegion?: string | null;
}

export default function StudyModeMap({
  selectedDepartment,
  studiedDepartments,
  onDepartmentClick,
  departments,
  focusedRegion: _focusedRegion
}: StudyModeMapProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Use accessibility context
  const { getRegionColor } = useAccessibility();

  // Colombia bounds for reference (currently unused but kept for future zoom-to-fit features)
  // const _colombiaBounds = {
  //   type: "Feature" as const,
  //   geometry: {
  //     type: "Polygon" as const,
  //     coordinates: [[
  //       [-79, 12], [-79, -5], [-67, -5], [-67, 12], [-79, 12]
  //     ]]
  //   }
  // };

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

  const getDepartmentColor = (region: string, isSelected: boolean, isStudied: boolean) => {
    const opacity = isSelected ? 1 : isStudied ? 0.85 : 0.95;
    return getRegionColor(region, opacity);
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
    <div className="w-full h-full flex items-center justify-center rounded-lg relative" style={{ background: 'linear-gradient(to bottom right, rgb(219 234 254), rgb(240 253 244))' }}>
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
              {/* Multiple selection indicators for selected department */}
              {isSelected && (
                <>
                  {/* Outer glow effect */}
                  <circle
                    cx={pos[0]}
                    cy={pos[1]}
                    r="30"
                    fill="none"
                    stroke={getDepartmentColor(dept.region, true, false)}
                    strokeWidth="1"
                    opacity="0.3"
                    className='animate-ping'
                  />
                  {/* Middle ring */}
                  <circle
                    cx={pos[0]}
                    cy={pos[1]}
                    r="22"
                    fill="none"
                    stroke={getDepartmentColor(dept.region, true, false)}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className='animate-pulse'
                  />
                  {/* Inner glow */}
                  <circle
                    cx={pos[0]}
                    cy={pos[1]}
                    r="18"
                    fill={getDepartmentColor(dept.region, true, false)}
                    opacity="0.2"
                  />
                </>
              )}

              {/* Department circle with enhanced selection */}
              <circle
                cx={pos[0]}
                cy={pos[1]}
                r={isSelected ? "16" : "12"}
                fill={getDepartmentColor(dept.region, isSelected, isStudied)}
                stroke={isSelected ? 'white' : 'rgba(255,255,255,0.5)'}
                strokeWidth={isSelected ? "3" : "1"}
                className="cursor-pointer transition-all duration-300 hover:opacity-90 drop-shadow-lg hover:drop-shadow-md"
                onClick={() => onDepartmentClick(dept)}
                style={{
                  transform: isSelected ? 'scale(1.3)' : 'scale(1)',
                  transformOrigin: `${pos[0]}px ${pos[1]}px`,
                  filter: isSelected ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' : 'none'
                }}
              >
                <title>{dept.name} - {dept.capital}</title>
              </circle>

              {/* Department name with enhanced visibility when selected */}
              <text
                x={pos[0]}
                y={pos[1]}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isSelected ? 'black' : 'white'}
                fontSize={isSelected ? "11" : "8"}
                fontWeight={isSelected ? "bold" : "normal"}
                className="pointer-events-none"
                style={{
                  textShadow: isSelected
                    ? '0 0 4px rgba(255,255,255,0.9), 1px 1px 2px rgba(255,255,255,0.7)'
                    : '1px 1px 2px rgba(0,0,0,0.5)'
                }}
              >
                {dept.name.substring(0, 3).toUpperCase()}
              </text>

              {/* Status indicators */}
              {isStudied && !isSelected && (
                <g className="pointer-events-none">
                  <circle
                    cx={pos[0] + 10}
                    cy={pos[1] - 10}
                    r="6"
                    fill='rgb(16 185 129)'
                    stroke='white'
                    strokeWidth="1"
                  />
                  <text
                    x={pos[0] + 10}
                    y={pos[1] - 10}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="10"
                    fill='white'
                    fontWeight="bold"
                  >
                    ✓
                  </text>
                </g>
              )}
              {isSelected && (
                <g className="pointer-events-none">
                  <rect
                    x={pos[0] - 20}
                    y={pos[1] - 35}
                    width="40"
                    height="16"
                    rx="8"
                    fill='rgb(31 41 55)'
                    opacity='0.9'
                  />
                  <text
                    x={pos[0]}
                    y={pos[1] - 27}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="9"
                    fill="white"
                    fontWeight="bold"
                  >
                    SELECTED
                  </text>
                </g>
              )}
            </g>
          );
          })}
        </g>

        {/* Legend - outside of transform so it stays in place */}
        <g transform="translate(20, 420)">
          <rect
            x="0"
            y="0"
            width="560"
            height="60"
            fill='rgba(255,255,255,0.95)'
            rx="5"
            stroke='rgb(55 65 81)'
            strokeWidth='1'
          />
          <text
            x="10"
            y="20"
            fontSize="12"
            fontWeight="bold"
            fill='rgb(17 24 39)'
          >
            Regiones:
          </text>
          {['Andina', 'Caribe', 'Pacífica', 'Orinoquía', 'Amazonía', 'Insular'].map((region, index) => (
            <g key={region} transform={`translate(${90 + index * 80}, 10)`}>
              <circle
                cx="10"
                cy="10"
                r="8"
                fill={getRegionColor(region)}
                stroke='white'
                strokeWidth="1.5"
                className="drop-shadow-sm"
              />
              <text
                x="25"
                y="14"
                fontSize="11"
                fill='rgb(17 24 39)'
                fontWeight="500"
              >
                {region}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4" style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
        <Button
          variant="secondary"
          onClick={() => setZoomLevel(Math.min(zoomLevel * 1.2, 4))}
          style={{ padding: spacing[2], backgroundColor: colors.background, boxShadow: shadows.md }}
          title="Acercar"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <circle cx="9" cy="9" r="7" strokeWidth="2"/>
            <path d="M9 6v6M6 9h6" strokeWidth="2" strokeLinecap="round"/>
            <path d="M14 14l4 4" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </Button>
        <Button
          variant="secondary"
          onClick={() => setZoomLevel(Math.max(zoomLevel * 0.8, 0.5))}
          style={{ padding: spacing[2], backgroundColor: colors.background, boxShadow: shadows.md }}
          title="Alejar"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <circle cx="9" cy="9" r="7" strokeWidth="2"/>
            <path d="M6 9h6" strokeWidth="2" strokeLinecap="round"/>
            <path d="M14 14l4 4" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </Button>
        <Button
          variant="secondary"
          onClick={resetView}
          style={{ padding: spacing[2], backgroundColor: colors.background, boxShadow: shadows.md }}
          title="Restablecer"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M4 10a6 6 0 0112 0M4 10v-4m0 4l3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 10a6 6 0 01-12 0M16 10v4m0-4l-3 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
      </div>

      {/* Zoom indicator */}
      {zoomLevel > 1 && (
        <Badge variant="secondary" style={{ position: 'absolute', top: spacing[2], right: spacing[2], backgroundColor: colors.background, color: colors.text.secondary, padding: `${spacing[1]} ${spacing[2]}`, boxShadow: shadows.sm, fontSize: textStyles.body.small.fontSize[0] }}>
          Zoom: {Math.round(zoomLevel * 100)}%
        </Badge>
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