import { memo } from 'react';
import { Department } from '../../data/colombiaDepartments';
import { REGION_COLORS } from '../../design-system/themes/regions';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  Badge,
  colors,
  spacing,
  textStyles
} from '../../design-system';
import { cn } from '../../design-system/utils/cn';

interface DepartmentCardProps {
  dept: Department;
  isSelected: boolean;
  isStudied: boolean;
  onClick: () => void;
}

/**
 * Memoized DepartmentCard component for card view
 * Shows department information with region color bar
 */
const DepartmentCard = memo(({
  dept,
  isSelected,
  isStudied,
  onClick
}: DepartmentCardProps) => (
  <Card
    onClick={onClick}
    variant="default"
    padding="none"
    hover
    className={cn(
      'relative cursor-pointer overflow-hidden group transition-all'
    )}
    style={{
      boxShadow: isSelected
        ? `0 0 0 2px ${colors.brand[500]}`
        : undefined
    }}
  >
    {/* Region color bar */}
    <div
      className="w-full h-1"
      style={{
        backgroundColor: REGION_COLORS[dept.region] || 'rgb(229 231 235)'
      }}
    />

    <CardContent className="p-3">
      <CardHeader className="flex-row justify-between items-start mb-1">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {dept.name}
        </CardTitle>
        {isStudied && (
          <span className="text-green-500" aria-hidden="true">✓</span>
        )}
      </CardHeader>
      <CardDescription className="text-sm text-gray-600 mb-0.5">
        Capital: {dept.capital}
      </CardDescription>
      <p className="text-xs text-gray-500">
        {dept.region}
      </p>

      {/* Quick stats on hover */}
      <div
        className="border-t opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          marginTop: spacing[3],
          paddingTop: spacing[3],
          borderColor: colors.gray[100]
        }}
      >
        <div
          className="flex justify-between"
          style={{
            fontSize: textStyles.caption.fontSize[0],
            color: colors.text.secondary
          }}
        >
          <span>Área: {dept.area.toLocaleString()} km²</span>
          <span>Pop: {(dept.population / 1000000).toFixed(1)}M</span>
        </div>
      </div>
    </CardContent>

    {/* Study progress indicator */}
    {isStudied && (
      <Badge
        variant="success"
        size="sm"
        className="absolute"
        style={{
          top: spacing[2],
          right: spacing[2]
        }}
      >
        Estudiado
      </Badge>
    )}
  </Card>
), (prev, next) => {
  // Custom comparison: only re-render if relevant props changed
  return (
    prev.dept.id === next.dept.id &&
    prev.isSelected === next.isSelected &&
    prev.isStudied === next.isStudied
  );
});

DepartmentCard.displayName = 'DepartmentCard';

export { DepartmentCard };
export type { DepartmentCardProps };
