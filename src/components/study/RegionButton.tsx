import { memo } from 'react';
import { Button } from '../../design-system';

interface RegionButtonProps {
  region: string;
  departmentCount: number;
  isSelected: boolean;
  onSelect: () => void;
}

/**
 * Memoized RegionButton component for region filter tabs
 * Prevents unnecessary re-renders during department interactions
 */
const RegionButton = memo(({
  region,
  departmentCount,
  isSelected,
  onSelect
}: RegionButtonProps) => (
  <Button
    onClick={onSelect}
    variant={isSelected ? 'primary' : 'secondary'}
    size="sm"
    className="whitespace-nowrap"
  >
    {region} ({departmentCount})
  </Button>
));

RegionButton.displayName = 'RegionButton';

export { RegionButton };
export type { RegionButtonProps };
