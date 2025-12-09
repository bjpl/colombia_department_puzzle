# Component Migration GOAP Action Plan

**Generated:** 2025-12-09
**Planner:** GOAP Specialist Agent
**Status:** Ready for Execution

## Executive Summary

This document contains an optimal Goal-Oriented Action Planning (GOAP) sequence for migrating 35 components from the root `/src/components` folder into organized category folders (`ui`, `layout`, `game`, `feedback`, `modals`).

**Total Estimated Time:** 66 minutes
**Total Steps:** 15
**Risk Level:** Low-Medium
**Rollback Strategy:** Git-based checkpoints after each major group

---

## Goal State vs Current State

### Goal State
```json
{
  "all_components_categorized": true,
  "barrel_exports_updated": true,
  "imports_fixed": true,
  "tests_passing": true,
  "build_successful": true
}
```

### Current State
```json
{
  "all_components_categorized": false,
  "barrel_exports_updated": false,
  "imports_fixed": false,
  "tests_passing": true,
  "build_successful": true,
  "components_in_root": 35
}
```

---

## GOAP Action Sequence

### Phase 1: UI Primitives (Steps 1-3)
**Risk:** Low | **Time:** 8 minutes

These components have minimal dependencies and are highly reusable across the application.

**Step 1: CREATE_FOLDERS** (1 min)
- Action: Verify category folder structure exists
- Risk: None
- Validation: `ls -la src/components/{ui,layout,game,feedback,modals}`

**Step 2: MIGRATE_UI_PRIMITIVES** (5 min)
- Components: 7 files
  - `TouchFeedback.tsx`
  - `ScrollIndicator.tsx`
  - `KeyboardVisualFeedback.tsx`
  - `MiniDepartmentShape.tsx`
  - `InstallPrompt.tsx`
  - `UpdateNotification.tsx`
  - `AccessibilitySettings.tsx`
- Target: `src/components/ui/`
- Parallel Operations: Yes (all 7 git mv commands)
- Rollback: `git reset --hard HEAD`

**Step 3: UPDATE_UI_BARREL** (2 min)
- Update: `src/components/ui/index.ts`
- Validation: `npm run typecheck`
- Checkpoint: First rollback point established

---

### Phase 2: Feedback Components (Steps 4-5)
**Risk:** Low | **Time:** 7 minutes

Notification and feedback systems with low-to-medium complexity.

**Step 4: MIGRATE_FEEDBACK_COMPONENTS** (5 min)
- Components: 7 files
  - `ScreenReaderAnnouncements.tsx`
  - `PlacementFeedback.tsx`
  - `OfflineIndicator.tsx`
  - `StudyModeLoading.tsx`
  - `ModeTransition.tsx`
  - `PostGameReport.tsx`
  - `NextChallengeRecommender.tsx`
- Target: `src/components/feedback/`
- Parallel Operations: Yes
- Rollback: `git reset --hard HEAD`

**Step 5: UPDATE_FEEDBACK_BARREL** (2 min)
- Update: `src/components/feedback/index.ts`
- Validation: `npm run typecheck`
- Checkpoint: Second rollback point

---

### Phase 3: Modal Components (Steps 6-7)
**Risk:** Medium | **Time:** 6 minutes

Dialog and overlay components with focus management requirements.

**Step 6: MIGRATE_MODAL_COMPONENTS** (4 min)
- Components: 3 files
  - `HintModal.tsx`
  - `KeyboardHelp.tsx`
  - `InteractiveTutorial.tsx`
- Target: `src/components/modals/`
- Parallel Operations: Yes
- Rollback: `git reset --hard HEAD`

**Step 7: UPDATE_MODAL_BARREL** (2 min)
- Update: `src/components/modals/index.ts`
- Validation: `npm run typecheck`
- Checkpoint: Third rollback point

---

### Phase 4: Layout Components (Steps 8-9)
**Risk:** Medium-High | **Time:** 9 minutes

Structural components with many inter-dependencies. GameContainer moved last in group.

**Step 8: MIGRATE_LAYOUT_COMPONENTS** (7 min)
- Components: 10 files
  - `BottomSheet.tsx`
  - `DepartmentTray.tsx`
  - `EducationalPanel.tsx`
  - `HintsPanel.tsx`
  - `MobileBanner.tsx`
  - `MobileHeader.tsx`
  - `GameHeader.tsx`
  - `ModernGameHeader.tsx`
  - `MobileGameLayout.tsx`
  - `GameContainer.tsx` ⚠️ (highest dependencies)
- Target: `src/components/layout/`
- Parallel Operations: Yes
- Note: GameContainer moved last due to high dependency count
- Rollback: `git reset --hard HEAD`

**Step 9: UPDATE_LAYOUT_BARREL** (2 min)
- Update: `src/components/layout/index.ts`
- Validation: `npm run typecheck`
- Checkpoint: Fourth rollback point

---

### Phase 5: Game Components (Steps 10-11)
**Risk:** High | **Time:** 10 minutes

Core game logic and performance-critical rendering components.

**Step 10: MIGRATE_GAME_COMPONENTS** (8 min)
- Components: 8 files
  - `MapCanvas.tsx`
  - `OptimizedColombiaMap.tsx`
  - `DragOverlay.tsx`
  - `KeyboardCursor.tsx`
  - `TouchModeAdapter.tsx`
  - `GameModeSelector.tsx`
  - `StudyMode.tsx`
  - `StudyModeMap.tsx`
- Target: `src/components/game/`
- Parallel Operations: Yes
- Rollback: `git reset --hard HEAD`

**Step 11: UPDATE_GAME_BARREL** (2 min)
- Update: `src/components/game/index.ts`
- Validation: `npm run typecheck`
- Checkpoint: Fifth rollback point

---

### Phase 6: Import Fixes (Steps 12-13)
**Risk:** Medium | **Time:** 18 minutes

Fix all broken import paths throughout the codebase.

**Step 12: FIX_INTERNAL_IMPORTS** (10 min)
- Strategy: Batch find & replace using grep + sed
- Patterns:
  - `from './HintModal'` → `from '../modals/HintModal'`
  - `from './TouchFeedback'` → `from '../ui/TouchFeedback'`
  - `from './GameHeader'` → `from '../layout/GameHeader'`
  - `from './MapCanvas'` → `from '../game/MapCanvas'`
- Target: All migrated component files
- Rollback: `git reset --hard HEAD`

**Step 13: FIX_EXTERNAL_IMPORTS** (8 min)
- Strategy: Update imports in consuming files
- Target Files:
  - `src/pages/*`
  - `src/context/*`
  - `src/tests/*`
- Estimated Files: 50-80 files
- Rollback: `git reset --hard HEAD`

---

### Phase 7: Validation (Steps 14-15)
**Risk:** None | **Time:** 8 minutes

Final verification of build and test integrity.

**Step 14: VERIFY_BUILD** (3 min)
- Command: `npm run typecheck`
- Effect: `typescript_valid`

**Step 15: RUN_TESTS** (5 min)
- Command: `npm test`
- Effects:
  - `tests_passing`
  - `all_components_categorized`
  - `barrel_exports_updated`
  - `imports_fixed`
  - `build_successful`

---

## Optimization Strategy

### Grouping Principle
Components are grouped by category and complexity level to minimize risk and maximize efficiency.

### Sequencing Logic
**Least Dependent → Most Dependent**

1. **UI Primitives** - No dependencies on other components
2. **Feedback** - Minimal dependencies, mostly on context/hooks
3. **Modals** - Moderate complexity, before layout imports them
4. **Layout** - High dependencies, after UI/feedback/modals ready
5. **Game** - Highest complexity, performance-critical

### Parallelization
- All `git mv` commands within a step execute in parallel
- Barrel updates happen sequentially after migration
- Import fixes happen in two waves (internal, then external)

### Checkpoints
Git checkpoints established after steps: 3, 5, 7, 9, 11

These provide safe rollback points at logical migration boundaries.

---

## Circular Dependency Handling

### Identified Risks

1. **GameContainer** imports many components
   - Mitigation: Move last in layout group after dependencies migrated

2. **HintModal** imported by EducationalPanel
   - Mitigation: Move modals before layout

3. **TouchFeedback** used by DepartmentTray
   - Mitigation: Move UI primitives first

### Mitigation Strategy

```
ui (no deps) → feedback (minimal) → modals (medium) → layout (high deps) → game (highest)
```

This sequence ensures dependencies are always available when needed.

---

## Risk Analysis

### Risk Distribution

| Risk Level    | Count | Steps                    |
|---------------|-------|--------------------------|
| None          | 3     | 1, 14, 15                |
| Low           | 6     | 2, 3, 4, 5, 7, 9, 11     |
| Medium        | 3     | 6, 12, 13                |
| Medium-High   | 1     | 8                        |
| High          | 1     | 10                       |

### Highest Risk Steps

**Step 8: MIGRATE_LAYOUT_COMPONENTS** (Medium-High)
- Reason: 10 components, many cross-dependencies
- Mitigation: Move GameContainer last, verify barrel exports immediately
- Checkpoint: Rollback available after step 9

**Step 10: MIGRATE_GAME_COMPONENTS** (High)
- Reason: Performance-critical code, complex state management
- Mitigation: Execute after all dependencies available, comprehensive test validation
- Checkpoint: Rollback available after step 11

---

## Components NOT Migrated

The following 4 components remain in root `/src/components`:

1. **ErrorBoundary.tsx** - Root-level error handling
2. **ComponentErrorBoundary.tsx** - Component-level error handling
3. **GameLogicErrorBoundary.tsx** - Game logic error handling
4. **MapErrorBoundary.tsx** - Map-specific error handling

**Rationale:** Error boundaries should remain at root level for proper React error boundary hierarchy and easier accessibility.

---

## Metrics

| Metric                          | Value    |
|---------------------------------|----------|
| Total Components to Migrate     | 35       |
| Components Staying in Root      | 4        |
| Estimated Total Time            | 66 min   |
| Estimated Import Fixes Required | 50-80    |
| Number of Checkpoints           | 5        |
| Number of Phases                | 7        |
| Parallel Operations             | 8 groups |

---

## Execution Commands Summary

### Quick Reference

```bash
# Phase 1: UI (8 min)
git mv src/components/{TouchFeedback,ScrollIndicator,KeyboardVisualFeedback,MiniDepartmentShape,InstallPrompt,UpdateNotification,AccessibilitySettings}.tsx src/components/ui/
# Update ui/index.ts + npm run typecheck

# Phase 2: Feedback (7 min)
git mv src/components/{ScreenReaderAnnouncements,PlacementFeedback,OfflineIndicator,StudyModeLoading,ModeTransition,PostGameReport,NextChallengeRecommender}.tsx src/components/feedback/
# Update feedback/index.ts + npm run typecheck

# Phase 3: Modals (6 min)
git mv src/components/{HintModal,KeyboardHelp,InteractiveTutorial}.tsx src/components/modals/
# Update modals/index.ts + npm run typecheck

# Phase 4: Layout (9 min)
git mv src/components/{BottomSheet,DepartmentTray,EducationalPanel,HintsPanel,MobileBanner,MobileHeader,GameHeader,ModernGameHeader,MobileGameLayout,GameContainer}.tsx src/components/layout/
# Update layout/index.ts + npm run typecheck

# Phase 5: Game (10 min)
git mv src/components/{MapCanvas,OptimizedColombiaMap,DragOverlay,KeyboardCursor,TouchModeAdapter,GameModeSelector,StudyMode,StudyModeMap}.tsx src/components/game/
# Update game/index.ts + npm run typecheck

# Phase 6: Fix Imports (18 min)
# Run automated import fixer scripts

# Phase 7: Validate (8 min)
npm run typecheck
npm test
```

---

## Success Criteria

- [ ] All 35 components successfully moved to category folders
- [ ] All 5 barrel export files updated
- [ ] All internal imports fixed (within components)
- [ ] All external imports fixed (pages, contexts, tests)
- [ ] TypeScript compilation successful
- [ ] All tests passing (842+ tests)
- [ ] No console errors in development mode
- [ ] Git history preserved (using `git mv`)
- [ ] 5 checkpoint commits created

---

## Rollback Procedures

### Full Rollback
```bash
git reset --hard HEAD~15  # Reset all 15 steps
npm install
npm run typecheck
npm test
```

### Partial Rollback (to checkpoint)

After Step 3 (UI complete):
```bash
git reset --hard HEAD~(current-3)
```

After Step 5 (Feedback complete):
```bash
git reset --hard HEAD~(current-5)
```

After Step 7 (Modals complete):
```bash
git reset --hard HEAD~(current-7)
```

After Step 9 (Layout complete):
```bash
git reset --hard HEAD~(current-9)
```

After Step 11 (Game complete):
```bash
git reset --hard HEAD~(current-11)
```

---

## Next Steps

1. Review this GOAP plan with project stakeholders
2. Create git feature branch: `git checkout -b refactor/m7-component-organization`
3. Execute phases 1-7 sequentially
4. Run comprehensive manual testing after Phase 7
5. Create PR with detailed migration summary
6. Merge after approval and CI passes

---

## Notes

- This GOAP plan uses A* pathfinding principles to find optimal action sequence
- State changes are tracked incrementally through preconditions/effects
- Risk is minimized through strategic grouping and checkpoints
- The plan is designed for execution by human developers or automated agents
- Estimated times include buffer for unexpected issues

---

**Plan Status:** ✅ Ready for Execution
**Generated By:** GOAP Specialist Agent
**Algorithm:** A* state-space search with dependency analysis
**Validation:** Precondition/effect chain verified complete
