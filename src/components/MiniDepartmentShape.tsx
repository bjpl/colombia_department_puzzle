import React, { useMemo, useEffect, useState } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { normalizeId } from '../utils/nameNormalizer';
import { useAccessibility } from '../context/AccessibilityContext';
import { colombiaDepartments } from '../data/colombiaDepartments';
import { colors } from '../design-system';

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
  const [geoData, setGeoData] = useState<any>(null);
  const { getRegionColor, highContrast, colorMode } = useAccessibility();

  useEffect(() => {
    // Load the optimized GeoJSON data (which has actual shapes, not just bounding boxes)
    fetch(`${import.meta.env.BASE_URL}data/colombia-departments-optimized.json`)
      .then(response => response.json())
      .then(data => setGeoData(data))
      .catch(error => console.error('Error loading GeoJSON:', error));
  }, []);

  const { pathData, debugInfo } = useMemo(() => {
    if (!geoData) return { pathData: null, debugInfo: 'No GeoJSON data' };

    // Find the feature for this department
    const normalizedSearchName = normalizeId(departmentName);

    const departmentFeature = geoData.features.find((feature: any) => {
      // The optimized GeoJSON uses "name" property
      const featureName = normalizeId(feature.properties.name || feature.properties.NOMBRE_DPT || '');
      return featureName === normalizedSearchName;
    });

    if (!departmentFeature) {
      return { pathData: null, debugInfo: `No feature found for ${departmentName}` };
    }

    try {
      // Add padding
      const padding = 5;
      const effectiveWidth = width - (padding * 2);
      const effectiveHeight = height - (padding * 2);

      // Create a projection and fit it to the bounds
      const projection = geoMercator()
        .fitSize([effectiveWidth, effectiveHeight], departmentFeature);

      // Adjust translate to account for padding
      const currentTranslate = projection.translate();
      projection.translate([
        currentTranslate[0] + padding,
        currentTranslate[1] + padding
      ]);

      // Create path generator
      const pathGenerator = geoPath().projection(projection);

      // Generate the path
      const path = pathGenerator(departmentFeature);

      return {
        pathData: path,
        debugInfo: `${departmentFeature.properties.name}`
      };
    } catch (error) {
      console.error('Error generating path for', departmentName, error);
      return { pathData: null, debugInfo: `Error: ${error}` };
    }
  }, [geoData, departmentName, width, height]);

  // Get the region color from our department data
  const fillColor = useMemo(() => {
    const department = colombiaDepartments.find(d =>
      normalizeId(d.name) === normalizeId(departmentName)
    );
    const region = department?.region || '';
    return region ? getRegionColor(region) : colors.neutral[200];
  }, [departmentName, getRegionColor, colorMode]);

  // Show loading or error state
  if (!pathData) {
    return (
      <div className={`inline-block ${className}`} style={{ width, height }}>
        <svg width={width} height={height}>
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill={colors.neutral[100]}
            stroke={colors.neutral[300]}
            strokeWidth="1"
            rx="4"
          />
          <text
            x={width / 2}
            y={height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill={colors.neutral[400]}
          >
            {!geoData ? '...' : '?'}
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-block ${className}`} style={{ width, height }} title={debugInfo}>
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
          fill={colors.neutral[50]}
          stroke={colors.neutral[200]}
          strokeWidth="1"
          rx="4"
        />

        {/* Department shape */}
        <path
          d={pathData}
          fill={fillColor}
          stroke={highContrast ? colors.neutral[950] : colors.neutral[700]}
          strokeWidth={highContrast ? "1" : "0.5"}
          opacity="0.8"
        />
      </svg>
    </div>
  );
}