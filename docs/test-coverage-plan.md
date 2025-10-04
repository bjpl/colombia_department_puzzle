# Comprehensive Test Coverage Plan
## Colombia Puzzle Game React Application

**Generated:** 2025-10-04
**Current Coverage:** 4 test files (utils, services)
**Target Files:** 78 source files requiring coverage

---

## Executive Summary

### Current State
- **Existing Tests:** 4 test files
  - `src/tests/utils/nameNormalizer.test.ts` (Comprehensive)
  - `src/tests/utils/cn.test.ts` (Comprehensive)
  - `src/tests/services/storage.test.ts` (Comprehensive)
  - `src/tests/colorConsistency.test.ts` (Placeholder)

- **Missing Coverage:**
  - 30 React Components (0% coverage)
  - 6 Custom Hooks (0% coverage)
  - 2 Services (soundManager, keyboardManager)
  - 2 Context Providers
  - 5 Data modules
  - Multiple constants and design system components

### Testing Infrastructure Needs

**CRITICAL - Missing Dependencies:**
```bash
npm install --save-dev jsdom @testing-library/react @testing-library/react-hooks @testing-library/jest-dom @testing-library/user-event happy-dom vitest-canvas-mock
```

**Vitest Configuration Updates Required:**
```typescript
// vitest.config.ts needs:
- DOM environment (jsdom or happy-dom)
- Canvas mocking for map rendering tests
- Setup file for testing-library matchers
```

---

## Priority Tiers

### TIER 1: CRITICAL (Must Test First)
**Target: 90%+ coverage, ~2-3 weeks**

These are core business logic, game state, and critical user flows.

#### 1.1 Context & State Management
**Priority: HIGHEST**

- **File:** `src/context/GameContext.tsx`
  - **Test File:** `src/tests/context/GameContext.test.tsx`
  - **Coverage Target:** 95%
  - **Key Test Areas:**
    - Zustand store initialization
    - Department placement logic (correct/incorrect)
    - Score calculation and updates
    - Game mode switching (full, region, progression)
    - Region progress tracking
    - Game completion detection
    - Timer integration
    - Active departments filtering

- **File:** `src/context/AccessibilityContext.tsx`
  - **Test File:** `src/tests/context/AccessibilityContext.test.tsx`
  - **Coverage Target:** 90%
  - **Key Test Areas:**
    - Accessibility settings persistence
    - Screen reader announcements
    - High contrast mode toggling
    - Keyboard navigation preferences

#### 1.2 Core Hooks (Game Logic)
**Priority: HIGHEST**

- **File:** `src/hooks/useGameTimer.ts`
  - **Test File:** `src/tests/hooks/useGameTimer.test.ts`
  - **Coverage Target:** 95%
  - **Test Pattern:** React Testing Library hooks
  - **Key Test Areas:**
    - Timer start/stop/pause/resume
    - Elapsed time calculation
    - Time formatting
    - Interval cleanup
    - Pause state transitions

- **File:** `src/hooks/useKeyboardNavigation.ts`
  - **Test File:** `src/tests/hooks/useKeyboardNavigation.test.ts`
  - **Coverage Target:** 85%
  - **Key Test Areas:**
    - Department selection via keyboard
    - Arrow key movement tracking
    - Target zone detection
    - Placement via Enter key
    - Cancel via Escape
    - Screen reader announcements

- **File:** `src/hooks/useEnhancedKeyboardNavigation.ts`
  - **Test File:** `src/tests/hooks/useEnhancedKeyboardNavigation.test.ts`
  - **Coverage Target:** 85%
  - **Key Test Areas:**
    - Enhanced navigation modes
    - Cursor position tracking
    - Zone targeting
    - Keyboard event handling

- **File:** `src/hooks/useModalManager.ts`
  - **Test File:** `src/tests/hooks/useModalManager.test.ts`
  - **Coverage Target:** 90%
  - **Key Test Areas:**
    - Modal open/close
    - Modal queue management
    - Multiple modal handling
    - closeAllModals functionality

#### 1.3 Services (Business Logic)
**Priority: HIGHEST**

- **File:** `src/services/soundManager.ts` ✅ (Already has test)
  - **Enhancement Needed:** Add additional tests for:
    - Web Audio API initialization
    - Sound preloading
    - Sequence playback
    - Volume control
    - Browser compatibility fallbacks

- **File:** `src/services/keyboardManager.ts`
  - **Test File:** `src/tests/services/keyboardManager.test.ts`
  - **Coverage Target:** 85%
  - **Key Test Areas:**
    - Keyboard shortcut registration
    - Event dispatching
    - Action mapping
    - Key combination handling
    - Conflict detection

#### 1.4 Core Game Components
**Priority: HIGHEST**

- **File:** `src/components/GameContainer.tsx`
  - **Test File:** `src/tests/components/GameContainer.test.tsx`
  - **Coverage Target:** 80%
  - **Test Pattern:** Integration tests
  - **Key Test Areas:**
    - Drag-and-drop flow
    - Modal management
    - Game mode transitions
    - Timer synchronization
    - Placement feedback
    - Keyboard navigation integration
    - Sound effects integration
    - Game completion flow

- **File:** `src/components/DepartmentTray.tsx`
  - **Test File:** `src/tests/components/DepartmentTray.test.tsx`
  - **Coverage Target:** 85%
  - **Key Test Areas:**
    - Department rendering
    - Draggable items
    - Placed departments filtering
    - Accessibility attributes
    - Layout variants (ultra-compact)

- **File:** `src/components/MapCanvas.tsx`
  - **Test File:** `src/tests/components/MapCanvas.test.tsx`
  - **Coverage Target:** 75%
  - **Test Pattern:** Canvas mocking required
  - **Key Test Areas:**
    - SVG rendering
    - Department path generation
    - Drop zone creation
    - Droppable configuration
    - Visual feedback states
    - D3-geo projections (mock)

---

### TIER 2: HIGH PRIORITY
**Target: 80%+ coverage, ~2-3 weeks**

User interface components and educational features.

#### 2.1 UI Components (Game Flow)

- **File:** `src/components/GameHeader.tsx`
  - **Test File:** `src/tests/components/GameHeader.test.tsx`
  - **Coverage Target:** 90%
  - **Key Test Areas:**
    - Score display
    - Timer display
    - Button interactions
    - Responsive behavior

- **File:** `src/components/ModernGameHeader.tsx`
  - **Test File:** `src/tests/components/ModernGameHeader.test.tsx`
  - **Coverage Target:** 85%
  - **Key Test Areas:**
    - Modern UI variant
    - All header functionality
    - Design system integration

- **File:** `src/components/PlacementFeedback.tsx`
  - **Test File:** `src/tests/components/PlacementFeedback.test.tsx`
  - **Coverage Target:** 90%
  - **Key Test Areas:**
    - Correct placement animation
    - Incorrect placement animation
    - Position calculation
    - Auto-dismiss timing
    - Visual feedback rendering

- **File:** `src/components/PostGameReport.tsx`
  - **Test File:** `src/tests/components/PostGameReport.test.tsx`
  - **Coverage Target:** 85%
  - **Key Test Areas:**
    - Score calculation display
    - Statistics rendering
    - Action buttons
    - Next challenge recommendation
    - Modal behavior

#### 2.2 Educational Components

- **File:** `src/components/EducationalPanel.tsx`
  - **Test File:** `src/tests/components/EducationalPanel.test.tsx`
  - **Coverage Target:** 80%
  - **Key Test Areas:**
    - Department information display
    - Compact mode rendering
    - Educational content formatting
    - Image loading

- **File:** `src/components/StudyMode.tsx`
  - **Test File:** `src/tests/components/StudyMode.test.tsx`
  - **Coverage Target:** 85%
  - **Key Test Areas:**
    - Study mode rendering
    - Department selection
    - Information display
    - Mode transitions

- **File:** `src/components/StudyModeMap.tsx`
  - **Test File:** `src/tests/components/StudyModeMap.test.tsx`
  - **Coverage Target:** 75%
  - **Key Test Areas:**
    - Interactive map in study mode
    - Department highlighting
    - Click interactions

#### 2.3 Game Mode & Selection

- **File:** `src/components/GameModeSelector.tsx`
  - **Test File:** `src/tests/components/GameModeSelector.test.tsx`
  - **Coverage Target:** 90%
  - **Key Test Areas:**
    - Mode selection (full, region, progression)
    - Region selection UI
    - Progression unlocking logic
    - User stats display
    - Mode configuration

- **File:** `src/components/NextChallengeRecommender.tsx`
  - **Test File:** `src/tests/components/NextChallengeRecommender.test.tsx`
  - **Coverage Target:** 80%
  - **Key Test Areas:**
    - Challenge recommendation algorithm
    - Difficulty progression
    - User progress tracking

---

### TIER 3: MEDIUM PRIORITY
**Target: 70%+ coverage, ~1-2 weeks**

Supporting components, accessibility, and utilities.

#### 3.1 Accessibility Components

- **File:** `src/components/AccessibilitySettings.tsx`
  - **Test File:** `src/tests/components/AccessibilitySettings.test.tsx`
  - **Coverage Target:** 85%
  - **Key Test Areas:**
    - Settings UI rendering
    - Toggle interactions
    - Persistence to context
    - Screen reader support

- **File:** `src/components/ScreenReaderAnnouncements.tsx`
  - **Test File:** `src/tests/components/ScreenReaderAnnouncements.test.tsx`
  - **Coverage Target:** 90%
  - **Key Test Areas:**
    - ARIA live regions
    - Announcement queueing
    - Message formatting
    - Auto-cleanup

- **File:** `src/components/KeyboardHelp.tsx`
  - **Test File:** `src/tests/components/KeyboardHelp.test.tsx`
  - **Coverage Target:** 85%
  - **Key Test Areas:**
    - Help overlay display
    - Keyboard shortcut listing
    - Visibility toggle

- **File:** `src/components/KeyboardCursor.tsx`
  - **Test File:** `src/tests/components/KeyboardCursor.test.tsx`
  - **Coverage Target:** 80%
  - **Key Test Areas:**
    - Cursor positioning
    - Visual indicator rendering
    - Active state display
    - Target zone highlighting

- **File:** `src/components/KeyboardVisualFeedback.tsx`
  - **Test File:** `src/tests/components/KeyboardVisualFeedback.test.tsx`
  - **Coverage Target:** 75%
  - **Key Test Areas:**
    - Visual feedback rendering
    - Animation states

#### 3.2 Drag & Drop Components

- **File:** `src/components/DragOverlay.tsx`
  - **Test File:** `src/tests/components/DragOverlay.test.tsx`
  - **Coverage Target:** 80%
  - **Key Test Areas:**
    - Overlay rendering during drag
    - Department display
    - @dnd-kit integration

- **File:** `src/components/MiniDepartmentShape.tsx`
  - **Test File:** `src/tests/components/MiniDepartmentShape.test.tsx`
  - **Coverage Target:** 70%
  - **Key Test Areas:**
    - SVG shape rendering
    - Department color mapping
    - Sizing calculations

- **File:** `src/components/OptimizedColombiaMap.tsx`
  - **Test File:** `src/tests/components/OptimizedColombiaMap.test.tsx`
  - **Coverage Target:** 70%
  - **Key Test Areas:**
    - Optimized rendering
    - Performance characteristics
    - Memoization

#### 3.3 Supporting Hooks

- **File:** `src/hooks/useStudyMode.ts`
  - **Test File:** `src/tests/hooks/useStudyMode.test.ts`
  - **Coverage Target:** 85%
  - **Key Test Areas:**
    - Study mode state management
    - Department selection
    - Navigation

- **File:** `src/hooks/useProgressiveHints.ts`
  - **Test File:** `src/tests/hooks/useProgressiveHints.test.ts`
  - **Coverage Target:** 85%
  - **Key Test Areas:**
    - Hint progression logic
    - Hint types (region, letter, flash)
    - Hint availability

---

### TIER 4: LOWER PRIORITY
**Target: 60%+ coverage, ~1 week**

UI polish, error boundaries, and visual components.

#### 4.1 Error Boundaries

- **File:** `src/components/ErrorBoundary.tsx`
  - **Test File:** `src/tests/components/ErrorBoundary.test.tsx`
  - **Coverage Target:** 90%
  - **Test Pattern:** Error simulation
  - **Key Test Areas:**
    - Error catching
    - Fallback UI rendering
    - Error reporting
    - Recovery attempts

- **File:** `src/components/GameLogicErrorBoundary.tsx`
  - **Test File:** `src/tests/components/GameLogicErrorBoundary.test.tsx`
  - **Coverage Target:** 85%
  - **Key Test Areas:**
    - Game-specific error handling
    - State preservation
    - User-friendly error messages

- **File:** `src/components/MapErrorBoundary.tsx`
  - **Test File:** `src/tests/components/MapErrorBoundary.test.tsx`
  - **Coverage Target:** 85%
  - **Key Test Areas:**
    - Map rendering errors
    - Fallback map display
    - Canvas error handling

- **File:** `src/components/ComponentErrorBoundary.tsx`
  - **Test File:** `src/tests/components/ComponentErrorBoundary.test.tsx`
  - **Coverage Target:** 85%
  - **Key Test Areas:**
    - Component-level error isolation
    - Granular error boundaries

#### 4.2 UI Polish Components

- **File:** `src/components/MobileBanner.tsx`
  - **Test File:** `src/tests/components/MobileBanner.test.tsx`
  - **Coverage Target:** 80%
  - **Key Test Areas:**
    - Mobile detection
    - Banner display
    - Dismissal behavior
    - Responsive rendering

- **File:** `src/components/ModeTransition.tsx`
  - **Test File:** `src/tests/components/ModeTransition.test.tsx`
  - **Coverage Target:** 75%
  - **Key Test Areas:**
    - Transition animations
    - Mode change effects
    - Completion callback

- **File:** `src/components/ScrollIndicator.tsx`
  - **Test File:** `src/tests/components/ScrollIndicator.test.tsx`
  - **Coverage Target:** 70%
  - **Key Test Areas:**
    - Scroll position detection
    - Indicator visibility
    - Scroll behavior

- **File:** `src/components/InteractiveTutorial.tsx`
  - **Test File:** `src/tests/components/InteractiveTutorial.test.tsx`
  - **Coverage Target:** 80%
  - **Key Test Areas:**
    - Tutorial steps progression
    - User interaction tracking
    - Skip/complete actions
    - Step rendering

- **File:** `src/components/HintModal.tsx`
  - **Test File:** `src/tests/components/HintModal.test.tsx`
  - **Coverage Target:** 80%
  - **Key Test Areas:**
    - Modal display
    - Hint content rendering
    - Close behavior

- **File:** `src/components/HintsPanel.tsx`
  - **Test File:** `src/tests/components/HintsPanel.test.tsx`
  - **Coverage Target:** 75%
  - **Key Test Areas:**
    - Hint list rendering
    - Hint activation
    - Availability display

---

### TIER 5: NICE-TO-HAVE
**Target: 50%+ coverage, ~3-5 days**

Data validation, constants, and design system.

#### 5.1 Data Modules

- **File:** `src/data/colombiaDepartments.ts`
  - **Test File:** `src/tests/data/colombiaDepartments.test.ts`
  - **Coverage Target:** 90%
  - **Key Test Areas:**
    - All 33 departments present
    - Data structure validation
    - Required fields present
    - Coordinate data validity
    - Region assignments correct

- **File:** `src/data/departmentEducation.ts`
  - **Test File:** `src/tests/data/departmentEducation.test.ts`
  - **Coverage Target:** 70%
  - **Key Test Areas:**
    - Educational content structure
    - Department mapping completeness

- **File:** `src/data/memoryAids.ts`
  - **Test File:** `src/tests/data/memoryAids.test.ts`
  - **Coverage Target:** 60%
  - **Key Test Areas:**
    - Memory aid completeness
    - Content quality

- **File:** `src/data/regionalContent.ts`
  - **Test File:** `src/tests/data/regionalContent.test.ts`
  - **Coverage Target:** 60%
  - **Key Test Areas:**
    - Regional information structure
    - Content completeness

- **File:** `src/data/regionalNarratives.ts`
  - **Test File:** `src/tests/data/regionalNarratives.test.ts`
  - **Coverage Target:** 60%
  - **Key Test Areas:**
    - Narrative structure
    - Content presence

#### 5.2 Constants & Configuration

- **File:** `src/constants/gameConstants.ts`
  - **Test File:** `src/tests/constants/gameConstants.test.ts`
  - **Coverage Target:** 80%
  - **Key Test Areas:**
    - Constant value validation
    - Type correctness
    - No duplicates

- **File:** `src/constants/designSystem.ts`
  - **Test File:** `src/tests/constants/designSystem.test.ts`
  - **Coverage Target:** 70%
  - **Key Test Areas:**
    - Design token completeness
    - Color consistency
    - Type definitions

- **File:** `src/constants/accessibleColors.ts`
  - **Test File:** `src/tests/constants/accessibleColors.test.ts`
  - **Coverage Target:** 85%
  - **Key Test Areas:**
    - WCAG compliance
    - Contrast ratios
    - Color palette completeness

#### 5.3 Design System Components

- **Files:** `src/design-system/components/*.tsx`
  - **Test Files:** `src/tests/design-system/components/*.test.tsx`
  - **Coverage Target:** 75%
  - **Key Components:**
    - Badge.tsx
    - Button.tsx
    - Card.tsx
    - Input.tsx
    - Modal.tsx
  - **Test Pattern:** Component library testing
  - **Key Test Areas:**
    - Props validation
    - Variant rendering
    - Size options
    - Accessibility attributes
    - Event handlers

---

## Testing Patterns & Best Practices

### 1. Component Testing Pattern
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { GameProvider } from '../../context/GameContext';

describe('ComponentName', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <GameProvider>
        {ui}
      </GameProvider>
    );
  };

  test('should render correctly', () => {
    renderWithProviders(<ComponentName />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('should handle user interaction', async () => {
    const handleClick = vi.fn();
    renderWithProviders(<ComponentName onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
```

### 2. Hook Testing Pattern
```typescript
import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';

describe('useCustomHook', () => {
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useCustomHook());
    expect(result.current.value).toBe(defaultValue);
  });

  test('should update value on action', () => {
    const { result } = renderHook(() => useCustomHook());

    act(() => {
      result.current.setValue(newValue);
    });

    expect(result.current.value).toBe(newValue);
  });
});
```

### 3. Integration Testing Pattern
```typescript
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect } from 'vitest';

describe('GameFlow Integration', () => {
  test('complete game flow from start to finish', async () => {
    const user = userEvent.setup();
    render(<GameContainer />);

    // Start game
    await user.click(screen.getByText('Iniciar'));

    // Drag department
    const department = screen.getByTestId('dept-antioquia');
    const dropZone = screen.getByTestId('zone-antioquia');

    fireEvent.dragStart(department);
    fireEvent.drop(dropZone);

    // Verify placement
    await waitFor(() => {
      expect(screen.getByText(/Correcto/i)).toBeInTheDocument();
    });
  });
});
```

### 4. Mock Patterns

#### Sound Manager Mock
```typescript
vi.mock('../../services/soundManager', () => ({
  soundManager: {
    init: vi.fn(),
    play: vi.fn(),
    playSequence: vi.fn(),
    setEnabled: vi.fn(),
    setVolume: vi.fn(),
  },
  useSoundEffect: () => ({
    playSound: vi.fn(),
    initSound: vi.fn(),
  }),
}));
```

#### Canvas Mock (for Map Components)
```typescript
import 'vitest-canvas-mock';

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    // ... other canvas methods
  }));
});
```

---

## Implementation Timeline

### Phase 1: Foundation (Week 1-2)
- Set up testing infrastructure
- Install dependencies
- Configure Vitest
- Create test utilities and helpers
- Complete Tier 1 tests (Context, Core Hooks, Services)

**Deliverables:**
- 15+ test files
- Core game logic covered
- ~40% overall coverage

### Phase 2: Components (Week 3-4)
- Complete Tier 2 tests (Game components, UI)
- Integration tests for game flow
- Drag-and-drop testing

**Deliverables:**
- 25+ additional test files
- Game flow covered
- ~65% overall coverage

### Phase 3: Polish (Week 5-6)
- Complete Tier 3 & 4 tests
- Error boundary testing
- Accessibility testing
- Edge cases

**Deliverables:**
- 20+ additional test files
- Edge cases covered
- ~80% overall coverage

### Phase 4: Data & Design System (Week 7)
- Complete Tier 5 tests
- Data validation
- Design system component tests

**Deliverables:**
- 15+ additional test files
- Complete coverage
- ~85%+ overall coverage

---

## Success Metrics

### Coverage Targets
- **Overall Coverage:** 85%+
- **Core Logic (Context, Hooks, Services):** 90%+
- **UI Components:** 80%+
- **Data & Constants:** 70%+
- **Design System:** 75%+

### Quality Metrics
- All tests pass in CI/CD
- No flaky tests
- Fast test execution (<30s for unit, <2min for all)
- Clear test descriptions
- Comprehensive edge case coverage

---

## Testing Infrastructure Setup

### 1. Install Dependencies
```bash
npm install --save-dev \
  jsdom \
  @testing-library/react \
  @testing-library/react-hooks \
  @testing-library/jest-dom \
  @testing-library/user-event \
  happy-dom \
  vitest-canvas-mock \
  @vitest/ui
```

### 2. Create Vitest Config
**File:** `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.test.{ts,tsx}',
        '**/*.d.ts',
        'vite.config.ts',
      ],
    },
  },
});
```

### 3. Create Setup File
**File:** `src/tests/setup.ts`
```typescript
import '@testing-library/jest-dom';
import 'vitest-canvas-mock';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Web Audio API
global.AudioContext = class {
  createGain() { return {}; }
  createOscillator() { return {}; }
  // ... other methods
} as any;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;
```

### 4. Create Test Utilities
**File:** `src/tests/test-utils.tsx`
```typescript
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { GameProvider } from '../context/GameContext';
import { AccessibilityProvider } from '../context/AccessibilityContext';

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <GameProvider>
      <AccessibilityProvider>
        {children}
      </AccessibilityProvider>
    </GameProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

---

## Estimated Coverage Improvement

### Current State
- **Files with tests:** 4
- **Estimated coverage:** ~5-8%

### After Full Implementation
- **Files with tests:** 78+
- **Estimated coverage:** 85%+

### Coverage by Category
- **Context & State:** 95%
- **Hooks:** 90%
- **Services:** 90%
- **Core Components:** 85%
- **UI Components:** 80%
- **Utilities:** 95%
- **Data & Constants:** 75%
- **Design System:** 75%

---

## Risk Mitigation

### Potential Challenges

1. **Canvas/D3 Testing Complexity**
   - **Solution:** Use vitest-canvas-mock, mock D3 projections
   - **Fallback:** Focus on logic tests, visual regression for rendering

2. **@dnd-kit Testing**
   - **Solution:** Use fireEvent for drag/drop, test logic separately
   - **Fallback:** Integration tests over unit tests

3. **Web Audio API Mocking**
   - **Solution:** Comprehensive mocks in setup file
   - **Fallback:** Skip actual audio playback tests

4. **Async State Updates**
   - **Solution:** Use waitFor, act from testing-library
   - **Fallback:** Increase test timeouts when needed

5. **Zustand State Management**
   - **Solution:** Test store directly, then with components
   - **Fallback:** Reset store between tests

---

## Next Steps

1. **Immediate Actions:**
   - Install testing dependencies
   - Create vitest.config.ts
   - Set up test infrastructure
   - Create test utilities

2. **Week 1 Goals:**
   - Complete GameContext tests
   - Complete useGameTimer tests
   - Complete storage service tests (enhance existing)

3. **Success Criteria:**
   - All tests passing
   - CI/CD integration
   - Coverage reports generated
   - Developer documentation updated

---

## Appendix: File Inventory

### Components (30 files)
```
src/components/
├── AccessibilitySettings.tsx
├── ComponentErrorBoundary.tsx
├── DepartmentTray.tsx
├── DragOverlay.tsx
├── EducationalPanel.tsx
├── ErrorBoundary.tsx
├── GameContainer.tsx
├── GameHeader.tsx
├── GameLogicErrorBoundary.tsx
├── GameModeSelector.tsx
├── HintModal.tsx
├── HintsPanel.tsx
├── InteractiveTutorial.tsx
├── KeyboardCursor.tsx
├── KeyboardHelp.tsx
├── KeyboardVisualFeedback.tsx
├── MapCanvas.tsx
├── MapErrorBoundary.tsx
├── MiniDepartmentShape.tsx
├── MobileBanner.tsx
├── ModernGameHeader.tsx
├── ModeTransition.tsx
├── NextChallengeRecommender.tsx
├── OptimizedColombiaMap.tsx
├── PlacementFeedback.tsx
├── PostGameReport.tsx
├── ScreenReaderAnnouncements.tsx
├── ScrollIndicator.tsx
├── StudyMode.tsx
└── StudyModeMap.tsx
```

### Hooks (6 files)
```
src/hooks/
├── useProgressiveHints.ts
├── useGameTimer.ts
├── useStudyMode.ts
├── useKeyboardNavigation.ts
├── useEnhancedKeyboardNavigation.ts
└── useModalManager.ts
```

### Services (3 files)
```
src/services/
├── storage.ts ✅ (has tests)
├── soundManager.ts
└── keyboardManager.ts
```

### Context (2 files)
```
src/context/
├── AccessibilityContext.tsx
└── GameContext.tsx
```

### Data (5 files)
```
src/data/
├── colombiaDepartments.ts
├── departmentEducation.ts
├── memoryAids.ts
├── regionalContent.ts
└── regionalNarratives.ts
```

### Utils (1 file)
```
src/utils/
└── nameNormalizer.ts ✅ (has tests)
```

### Design System (6+ files)
```
src/design-system/
├── components/
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── Modal.tsx
└── utils/
    └── cn.ts ✅ (has tests)
```

---

**Document Status:** Complete
**Review Date:** 2025-10-04
**Next Review:** After Phase 1 completion
