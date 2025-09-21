import React, { useMemo } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import colombiaGeoJson from '../data/colombia.geo.json';
import { normalizeId } from '../utils/nameNormalizer';
import { REGION_COLORS } from '../constants/regionColors';

interface MiniDepartmentShapeProps {
  departmentName: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function MiniDepartmentShape({
  departmentName,
  width = 60,
  height = 60,
  className = ''
}: MiniDepartmentShapeProps) {
  const departmentFeature = useMemo(() => {
    // Find the feature for this department
    const normalizedSearchName = normalizeId(departmentName);

    return (colombiaGeoJson as any).features.find((feature: any) => {
      const featureId = normalizeId(feature.properties.NOMBRE_DPT || '');
      return featureId === normalizedSearchName;
    });
  }, [departmentName]);

  const pathData = useMemo(() => {
    if (!departmentFeature) return null;

    // Create a projection centered on this specific department
    const bounds = getBounds(departmentFeature.geometry);
    const centerLon = (bounds.minLon + bounds.maxLon) / 2;
    const centerLat = (bounds.minLat + bounds.maxLat) / 2;

    // Calculate scale to fit the department in the small box
    const lonRange = bounds.maxLon - bounds.minLon;
    const latRange = bounds.maxLat - bounds.minLat;

    // Add padding
    const padding = 5;
    const effectiveWidth = width - (padding * 2);
    const effectiveHeight = height - (padding * 2);

    // Calculate scale based on the aspect ratio
    const scale = Math.min(
      effectiveWidth / lonRange * 100,
      effectiveHeight / latRange * 100
    );

    const projection = geoMercator()
      .center([centerLon, centerLat])
      .scale(scale)
      .translate([width / 2, height / 2]);

    const pathGenerator = geoPath().projection(projection);
    return pathGenerator(departmentFeature);
  }, [departmentFeature, width, height]);

  if (!departmentFeature || !pathData) {
    return (
      <div className={`inline-block ${className}`} style={{ width, height }}>
        <svg width={width} height={height}>
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="#f3f4f6"
            stroke="#d1d5db"
            strokeWidth="1"
            rx="4"
          />
          <text
            x={width / 2}
            y={height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill="#9ca3af"
          >
            ?
          </text>
        </svg>
      </div>
    );
  }

  // Get the region color
  const region = departmentFeature.properties.region || departmentFeature.properties.NOM_REGION || '';
  const fillColor = REGION_COLORS[region] || '#e5e7eb';

  return (
    <div className={`inline-block ${className}`} style={{ width, height }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="department-mini-shape"
      >
        {/* Background */}
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill="#f9fafb"
          stroke="#e5e7eb"
          strokeWidth="1"
          rx="4"
        />

        {/* Department shape */}
        <path
          d={pathData}
          fill={fillColor}
          stroke="#374151"
          strokeWidth="0.5"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}

// Helper function to get bounds of a geometry
function getBounds(geometry: any): { minLon: number, maxLon: number, minLat: number, maxLat: number } {
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  const processCoordinates = (coords: any[]): void => {
    if (Array.isArray(coords[0]) && typeof coords[0][0] === 'number') {
      // It's a coordinate pair [lon, lat]
      const [lon, lat] = coords;
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    } else {
      // It's nested arrays, recurse
      coords.forEach(processCoordinates);
    }
  };

  if (geometry.type === 'Polygon') {
    geometry.coordinates.forEach(processCoordinates);
  } else if (geometry.type === 'MultiPolygon') {
    geometry.coordinates.forEach((polygon: any[]) => {
      polygon.forEach(processCoordinates);
    });
  }

  return { minLon, maxLon, minLat, maxLat };
}