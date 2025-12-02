import { Department } from '../../data/colombiaDepartments';
import { GameModeConfig } from '../GameModeSelector';

/**
 * Smart recommendations based on study progress
 * Returns a game mode recommendation based on which departments
 * the user has studied
 */
export function getRecommendedMode(
  studiedDepts: Set<string>,
  allDepts: Department[]
): GameModeConfig {
  const studiedByRegion = new Map<string, number>();

  allDepts.forEach(dept => {
    if (studiedDepts.has(dept.id)) {
      const count = studiedByRegion.get(dept.region) || 0;
      studiedByRegion.set(dept.region, count + 1);
    }
  });

  // Find regions with >50% studied
  const readyRegions: string[] = [];
  const regionSizes = new Map<string, number>();

  allDepts.forEach(dept => {
    const count = regionSizes.get(dept.region) || 0;
    regionSizes.set(dept.region, count + 1);
  });

  studiedByRegion.forEach((studied, region) => {
    const total = regionSizes.get(region) || 0;
    if (studied / total > 0.5) {
      readyRegions.push(region);
    }
  });

  if (readyRegions.length === 0) {
    // Start with easiest region
    return { type: 'region', selectedRegions: ['Insular'] };
  } else if (readyRegions.length === 1) {
    // Practice the ready region
    return { type: 'region', selectedRegions: readyRegions };
  } else if (readyRegions.length > 3) {
    // Ready for full game
    return { type: 'full' };
  } else {
    // Practice multiple regions
    return { type: 'region', selectedRegions: readyRegions };
  }
}

/**
 * Study flow phases
 */
export type StudyPhase = 'explore' | 'focus' | 'quiz' | 'ready';

/**
 * Study flow state interface
 */
export interface StudyFlowState {
  phase: StudyPhase;
  studiedDepartments: Set<string>;
  focusedRegion: string | null;
  quizCorrect: number;
  quizTotal: number;
}

/**
 * Initial study flow state
 */
export const initialStudyFlowState: StudyFlowState = {
  phase: 'explore',
  studiedDepartments: new Set(),
  focusedRegion: null,
  quizCorrect: 0,
  quizTotal: 0
};
