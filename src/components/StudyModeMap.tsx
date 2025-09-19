import React, { useMemo } from 'react';
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
      .scale(1500)
      .translate([300, 250]);
  }, []);

  const getApproximatePosition = (dept: Department) => {
    // Approximate positions for each department
    const positions: Record<string, [number, number]> = {
      'amazonas': [-70, -1],
      'antioquia': [-75.5, 7],
      'arauca': [-70.7, 7],
      'atlantico': [-74.8, 10.9],
      'bolivar': [-74.5, 9],
      'boyaca': [-73.5, 5.5],
      'caldas': [-75.5, 5],
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
      'la_guajira': [-72.5, 11.5],
      'magdalena': [-74, 10],
      'meta': [-72.5, 3.5],
      'narino': [-77.5, 1.2],
      'norte_de_santander': [-72.5, 8],
      'putumayo': [-76, 0.5],
      'quindio': [-75.6, 4.5],
      'risaralda': [-75.7, 4.9],
      'san_andres_y_providencia': [-81.7, 12.5],
      'santander': [-73, 7],
      'sucre': [-75.4, 9.3],
      'tolima': [-75, 4],
      'valle_del_cauca': [-76.5, 3.5],
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

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
      <svg width="600" height="500" className="w-full h-full">
        {/* Map background */}
        <rect width="600" height="500" fill="transparent" />

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
                  r="35"
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
                r={isSelected ? "25" : "20"}
                fill={getRegionColor(dept.region, isSelected, isStudied)}
                stroke={isSelected ? '#fff' : 'rgba(255,255,255,0.5)'}
                strokeWidth={isSelected ? "3" : "1"}
                className={`cursor-pointer transition-all duration-300 hover:r-25 ${
                  isSelected ? 'animate-pulse' : ''
                }`}
                onClick={() => onDepartmentClick(dept)}
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
                fontSize={isSelected ? "12" : "10"}
                fontWeight={isSelected ? "bold" : "normal"}
                className="pointer-events-none"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
              >
                {dept.name.substring(0, 3).toUpperCase()}
              </text>

              {/* Checkmark for studied departments */}
              {isStudied && !isSelected && (
                <text
                  x={pos[0] + 15}
                  y={pos[1] - 15}
                  fontSize="16"
                  className="pointer-events-none"
                >
                  ✓
                </text>
              )}
            </g>
          );
        })}

        {/* Legend */}
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
    </div>
  );
}