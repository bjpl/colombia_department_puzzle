/**
 * Study Mode Components
 * Extracted from StudyMode.tsx for better modularity
 */

export { RegionButton } from './RegionButton';
export type { RegionButtonProps } from './RegionButton';

export { DepartmentCard } from './DepartmentCard';
export type { DepartmentCardProps } from './DepartmentCard';

export { DepartmentButton } from './DepartmentButton';
export type { DepartmentButtonProps } from './DepartmentButton';

export {
  getRecommendedMode,
  initialStudyFlowState
} from './studyUtils';
export type { StudyFlowState, StudyPhase } from './studyUtils';
