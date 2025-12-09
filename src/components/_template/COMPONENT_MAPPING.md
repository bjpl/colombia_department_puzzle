# Component Mapping for M7 Refactoring

This document provides a preliminary mapping of existing components to their target categories. This will guide the M7.2-M7.10 refactoring tasks.

## Current Component Analysis

### UI Components (Reusable Primitives)
Target: `src/components/ui/`

- **Buttons & Interactive**
  - `AccessibilitySettings.tsx` → Could become `ui/AccessibilityMenu.tsx`
  - `InstallPrompt.tsx` → `ui/InstallButton.tsx`
  - `UpdateNotification.tsx` → `ui/UpdateBanner.tsx`

- **Visual Feedback**
  - `TouchFeedback.tsx` → `ui/TouchFeedback.tsx`
  - `ScrollIndicator.tsx` → `ui/ScrollIndicator.tsx`
  - `KeyboardVisualFeedback.tsx` → `ui/KeyboardIndicator.tsx`
  - `MiniDepartmentShape.tsx` → `ui/DepartmentIcon.tsx`

### Layout Components (Structure & Containers)
Target: `src/components/layout/`

- **Page Layouts**
  - `MobileGameLayout.tsx` → `layout/MobileLayout.tsx`
  - `GameContainer.tsx` → `layout/GameContainer.tsx`

- **Headers & Navigation**
  - `GameHeader.tsx` → `layout/GameHeader.tsx`
  - `ModernGameHeader.tsx` → `layout/ModernHeader.tsx`
  - `MobileHeader.tsx` → `layout/MobileHeader.tsx`
  - `MobileBanner.tsx` → `layout/MobileBanner.tsx`

- **Panels & Sections**
  - `BottomSheet.tsx` → `layout/BottomSheet.tsx`
  - `DepartmentTray.tsx` → `layout/DepartmentTray.tsx`
  - `EducationalPanel.tsx` → `layout/EducationalPanel.tsx`
  - `HintsPanel.tsx` → `layout/HintsPanel.tsx`

### Game Components (Game-specific)
Target: `src/components/game/`

- **Map Components**
  - `OptimizedColombiaMap.tsx` → `game/ColombiaMap.tsx`
  - `MapCanvas.tsx` → `game/MapCanvas.tsx`

- **Game Mechanics**
  - `DragOverlay.tsx` → `game/DragOverlay.tsx`
  - `KeyboardCursor.tsx` → `game/KeyboardCursor.tsx`
  - `TouchModeAdapter.tsx` → `game/TouchAdapter.tsx`

- **Game Modes**
  - `StudyMode.tsx` → `game/StudyMode.tsx`
  - `StudyModeMap.tsx` → `game/StudyModeMap.tsx`
  - `GameModeSelector.tsx` → `game/ModeSelector.tsx`

### Feedback Components (User Notifications)
Target: `src/components/feedback/`

- **Announcements**
  - `ScreenReaderAnnouncements.tsx` → `feedback/ScreenReaderAnnouncements.tsx`
  - `PlacementFeedback.tsx` → `feedback/PlacementFeedback.tsx`

- **Status Indicators**
  - `OfflineIndicator.tsx` → `feedback/OfflineIndicator.tsx`
  - `StudyModeLoading.tsx` → `feedback/StudyModeLoading.tsx`
  - `ModeTransition.tsx` → `feedback/ModeTransition.tsx`

- **Reports**
  - `PostGameReport.tsx` → `feedback/PostGameReport.tsx`
  - `NextChallengeRecommender.tsx` → `feedback/NextChallengeRecommender.tsx`

### Modal Components (Overlays & Dialogs)
Target: `src/components/modals/`

- **Dialogs**
  - `HintModal.tsx` → `modals/HintModal.tsx`
  - `KeyboardHelp.tsx` → `modals/KeyboardHelp.tsx`
  - `InteractiveTutorial.tsx` → `modals/InteractiveTutorial.tsx`

### Error Boundaries (Special Category)
These stay in root components/ directory:

- `ErrorBoundary.tsx` - Root level
- `ComponentErrorBoundary.tsx` - Component level
- `GameLogicErrorBoundary.tsx` - Game logic level
- `MapErrorBoundary.tsx` - Map specific

### Auth Components (Already Organized)
Keep as-is in `src/components/auth/`:
- `AuthButton.tsx`
- `AuthModal.tsx`
- `LoginForm.tsx`
- `SignupForm.tsx`
- `ProtectedRoute.tsx`
- `UserProfile.tsx`

### Study Components (Already Organized)
Keep as-is in `src/components/study/`:
- Existing study mode components

## Migration Priorities (M7.2-M7.10)

### Phase 1: UI Primitives (M7.2-M7.3)
Low-risk, high-impact reusable components
- Buttons, indicators, visual feedback
- No complex state or dependencies

### Phase 2: Layout Components (M7.4-M7.5)
Medium complexity, structural components
- Headers, containers, panels
- Some state management

### Phase 3: Feedback Components (M7.6-M7.7)
Moderate complexity, notification systems
- Announcements, status displays
- Accessibility concerns

### Phase 4: Modal Components (M7.8)
Higher complexity, overlay management
- Dialogs, sheets, tutorials
- Focus management, accessibility

### Phase 5: Game Components (M7.9-M7.10)
Highest complexity, core game logic
- Map rendering, game modes
- Performance critical
- Extensive testing required

## Notes

- This is a preliminary mapping; actual refactoring may adjust categories
- Some components may be split into smaller, more focused components
- Some components may be merged if they share significant logic
- All refactoring must maintain backward compatibility during migration
- Tests must be updated/created for each refactored component
