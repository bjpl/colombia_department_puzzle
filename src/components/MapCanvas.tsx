import OptimizedColombiaMap from './OptimizedColombiaMap';
import { colors } from '../design-system';

export default function MapCanvas() {
  return (
    <div style={{ backgroundColor: colors.neutral[50] }}>
      <OptimizedColombiaMap />
    </div>
  );
}