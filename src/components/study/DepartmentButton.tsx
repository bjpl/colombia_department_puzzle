import { memo } from 'react';
import { Department } from '../../data/colombiaDepartments';
import { REGION_COLORS } from '../../design-system/themes/regions';
import { Button, colors } from '../../design-system';
import { cn } from '../../design-system/utils/cn';

interface DepartmentButtonProps {
  dept: Department;
  isSelected: boolean;
  isStudied: boolean;
  onClick: () => void;
}

/**
 * Memoized DepartmentButton component for grid view
 * Compact button showing department name, capital and region
 */
const DepartmentButton = memo(({
  dept,
  isSelected,
  isStudied,
  onClick
}: DepartmentButtonProps) => (
  <Button
    onClick={onClick}
    variant={isStudied ? 'secondary' : 'ghost'}
    className={cn(
      'text-left transition-all hover:scale-105 p-3 h-auto min-h-[70px]',
      'border border-gray-200 rounded-lg relative',
      isStudied && 'bg-green-50 border-green-300',
      isSelected && 'scale-105 shadow-lg z-10'
    )}
    style={{
      backgroundColor: isStudied
        ? 'rgb(240 253 244)'
        : isSelected
        ? colors.brand[50]
        : 'white',
      boxShadow: isSelected
        ? `0 0 0 2px ${colors.brand[500]}`
        : undefined
    }}
  >
    <div className="flex flex-col items-start gap-1">
      <div className="text-sm font-semibold text-gray-900 leading-tight">
        {dept.name}
      </div>
      <div className="text-xs text-gray-500">
        Capital: {dept.capital}
      </div>
      <div
        className="text-xs font-medium"
        style={{ color: REGION_COLORS[dept.region] || colors.text.secondary }}
      >
        {dept.region}
      </div>
    </div>
  </Button>
), (prev, next) => {
  // Custom comparison for grid buttons
  return (
    prev.dept.id === next.dept.id &&
    prev.isSelected === next.isSelected &&
    prev.isStudied === next.isStudied
  );
});

DepartmentButton.displayName = 'DepartmentButton';

export { DepartmentButton };
export type { DepartmentButtonProps };
