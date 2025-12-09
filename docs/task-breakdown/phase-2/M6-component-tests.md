# M6: Component Integration Tests - Granular Task Breakdown

**Milestone:** Comprehensive component test coverage
**Total Effort:** 20 hours
**Total Tasks:** 50 tasks
**Risk Level:** Medium
**Dependencies:** M5 (mobile infrastructure)

---

## Task M6.1: Create Component Test Infrastructure

**Estimated Effort:** 2h
**Risk Level:** Low
**Assignable To:** coder

**Input State:**
- Basic Vitest setup exists
- No standardized component testing utilities
- No shared test fixtures

**Action Steps:**
1. Create `src/tests/utils/components/index.ts`:
   ```typescript
   import { render, RenderOptions } from '@testing-library/react';
   import { ReactElement } from 'react';
   import { MemoryRouter } from 'react-router-dom';
   import { ThemeProvider } from '../../contexts/ThemeContext';
   import { AuthContext } from '../../contexts/AuthContext';

   interface ComponentWrapperOptions extends RenderOptions {
     route?: string;
     user?: any;
     theme?: 'light' | 'dark';
   }

   export function renderWithProviders(
     ui: ReactElement,
     {
       route = '/',
       user = null,
       theme = 'light',
       ...renderOptions
     }: ComponentWrapperOptions = {}
   ) {
     function Wrapper({ children }: { children: React.ReactNode }) {
       return (
         <MemoryRouter initialEntries={[route]}>
           <ThemeProvider initialTheme={theme}>
             <AuthContext.Provider value={{ user, loading: false }}>
               {children}
             </AuthContext.Provider>
           </ThemeProvider>
         </MemoryRouter>
       );
     }

     return render(ui, { wrapper: Wrapper, ...renderOptions });
   }

   export * from '@testing-library/react';
   export { renderWithProviders as render };
   ```
2. Add fixture generators
3. Create mock data helpers
4. Export barrel file

**Output State:**
- File: `src/tests/utils/components/index.ts`
- Reusable test utilities
- All providers wrapped

**Validation Command:**
```bash
npm run typecheck
npm test -- src/tests/utils/components/ --run
```

**Dependencies:**
- M1.12 (TypeScript stable)

**Rollback Procedure:**
```bash
rm -rf src/tests/utils/components/
```

**Success Criteria:**
- [ ] Component wrapper created
- [ ] All providers integrated
- [ ] TypeScript types correct
- [ ] Example test passes

---

## Task M6.2: Test GameBoard Component Rendering

**Estimated Effort:** 1.5h
**Risk Level:** Low
**Assignable To:** tester

**Input State:**
- GameBoard component exists
- No rendering tests
- Props validation untested

**Action Steps:**
1. Create `src/tests/components/GameBoard.test.tsx`
2. Test initial render:
   ```typescript
   describe('GameBoard', () => {
     it('should render all department pieces', () => {
       const { getAllByTestId } = render(<GameBoard />);
       const pieces = getAllByTestId(/^department-piece-/);
       expect(pieces).toHaveLength(32); // 32 departments
     });

     it('should render puzzle grid', () => {
       const { getByTestId } = render(<GameBoard />);
       expect(getByTestId('puzzle-grid')).toBeInTheDocument();
     });

     it('should render game controls', () => {
       const { getByText } = render(<GameBoard />);
       expect(getByText('Reiniciar')).toBeInTheDocument();
       expect(getByText('Pista')).toBeInTheDocument();
     });
   });
   ```
3. Test prop variations
4. Test conditional rendering

**Output State:**
- File: `src/tests/components/GameBoard.test.tsx` with 8+ tests
- Rendering fully validated
- Props tested

**Validation Command:**
```bash
npm test -- src/tests/components/GameBoard.test.tsx --run
```

**Dependencies:**
- M6.1 (test utilities)

**Rollback Procedure:**
```bash
rm src/tests/components/GameBoard.test.tsx
```

**Success Criteria:**
- [ ] 8+ tests pass
- [ ] All elements render
- [ ] Props validated
- [ ] Coverage > 80%

---

## Task M6.3: Test DepartmentPiece Component Interactions

**Estimated Effort:** 1h
**Risk Level:** Low
**Assignable To:** tester

**Input State:**
- DepartmentPiece component exists
- No interaction tests
- Click/drag handlers untested

**Action Steps:**
1. Create `src/tests/components/DepartmentPiece.test.tsx`
2. Test user interactions:
   ```typescript
   import { fireEvent, waitFor } from '@testing-library/react';

   describe('DepartmentPiece', () => {
     it('should highlight on hover', () => {
       const { getByTestId } = render(
         <DepartmentPiece department={{ id: 'antioquia', name: 'Antioquia' }} />
       );
       const piece = getByTestId('department-piece-antioquia');

       fireEvent.mouseEnter(piece);
       expect(piece).toHaveClass('highlight');

       fireEvent.mouseLeave(piece);
       expect(piece).not.toHaveClass('highlight');
     });

     it('should call onSelect when clicked', () => {
       const onSelect = vi.fn();
       const { getByTestId } = render(
         <DepartmentPiece
           department={{ id: 'antioquia', name: 'Antioquia' }}
           onSelect={onSelect}
         />
       );

       fireEvent.click(getByTestId('department-piece-antioquia'));
       expect(onSelect).toHaveBeenCalledWith('antioquia');
     });

     it('should be draggable', () => {
       const { getByTestId } = render(
         <DepartmentPiece department={{ id: 'antioquia', name: 'Antioquia' }} />
       );
       const piece = getByTestId('department-piece-antioquia');

       expect(piece).toHaveAttribute('draggable', 'true');
     });
   });
   ```

**Output State:**
- File: `src/tests/components/DepartmentPiece.test.tsx` with 5+ tests
- Interactions validated

**Validation Command:**
```bash
npm test -- src/tests/components/DepartmentPiece.test.tsx --run
```

**Dependencies:**
- M6.2 (GameBoard tests)

**Rollback Procedure:**
```bash
rm src/tests/components/DepartmentPiece.test.tsx
```

**Success Criteria:**
- [ ] 5+ tests pass
- [ ] Hover behavior tested
- [ ] Click handlers work
- [ ] Drag attributes verified

---

## Task M6.4: Test PuzzleGrid Component Layout

**Estimated Effort:** 1.5h
**Risk Level:** Medium
**Assignable To:** tester

**Input State:**
- PuzzleGrid SVG-based
- No layout tests
- Slot positioning untested

**Action Steps:**
1. Create `src/tests/components/PuzzleGrid.test.tsx`
2. Test grid layout:
   ```typescript
   describe('PuzzleGrid', () => {
     it('should render 32 puzzle slots', () => {
       const { getAllByTestId } = render(<PuzzleGrid />);
       const slots = getAllByTestId(/^puzzle-slot-/);
       expect(slots).toHaveLength(32);
     });

     it('should position slots correctly', () => {
       const { getByTestId } = render(<PuzzleGrid />);
       const antioquiaSlot = getByTestId('puzzle-slot-antioquia');

       // Check SVG path attributes
       const path = antioquiaSlot.querySelector('path');
       expect(path).toHaveAttribute('d');
       expect(path?.getAttribute('d')).toBeTruthy();
     });

     it('should highlight empty slots', () => {
       const { getAllByTestId } = render(<PuzzleGrid />);
       const emptySlots = getAllByTestId(/^puzzle-slot-/).filter(
         slot => slot.classList.contains('empty')
       );
       expect(emptySlots.length).toBeGreaterThan(0);
     });

     it('should accept drop events', () => {
       const onDrop = vi.fn();
       const { getByTestId } = render(<PuzzleGrid onDrop={onDrop} />);
       const slot = getByTestId('puzzle-slot-antioquia');

       fireEvent.dragOver(slot, { preventDefault: () => {} });
       fireEvent.drop(slot, { dataTransfer: { getData: () => 'antioquia' } });

       expect(onDrop).toHaveBeenCalled();
     });
   });
   ```

**Output State:**
- File: `src/tests/components/PuzzleGrid.test.tsx` with 6+ tests
- Grid layout validated
- Drop zones tested

**Validation Command:**
```bash
npm test -- src/tests/components/PuzzleGrid.test.tsx --run
```

**Dependencies:**
- M6.3 (piece interactions)

**Rollback Procedure:**
```bash
rm src/tests/components/PuzzleGrid.test.tsx
```

**Success Criteria:**
- [ ] 6+ tests pass
- [ ] All slots render
- [ ] Positioning correct
- [ ] Drop events work

---

## Task M6.5: Test Game Timer Component

**Estimated Effort:** 1h
**Risk Level:** Low
**Assignable To:** tester

**Input State:**
- Timer component exists
- No timing tests
- Format validation needed

**Action Steps:**
1. Create `src/tests/components/Timer.test.tsx`
2. Test timer functionality:
   ```typescript
   import { act } from '@testing-library/react';

   describe('Timer', () => {
     beforeEach(() => {
       vi.useFakeTimers();
     });

     afterEach(() => {
       vi.useRealTimers();
     });

     it('should display initial time', () => {
       const { getByTestId } = render(<Timer />);
       expect(getByTestId('timer-display')).toHaveTextContent('00:00');
     });

     it('should increment time when running', () => {
       const { getByTestId } = render(<Timer running={true} />);

       act(() => {
         vi.advanceTimersByTime(1000);
       });

       expect(getByTestId('timer-display')).toHaveTextContent('00:01');

       act(() => {
         vi.advanceTimersByTime(59000);
       });

       expect(getByTestId('timer-display')).toHaveTextContent('01:00');
     });

     it('should pause when running is false', () => {
       const { getByTestId, rerender } = render(<Timer running={true} />);

       act(() => {
         vi.advanceTimersByTime(5000);
       });

       rerender(<Timer running={false} />);

       act(() => {
         vi.advanceTimersByTime(5000);
       });

       expect(getByTestId('timer-display')).toHaveTextContent('00:05');
     });
   });
   ```

**Output State:**
- File: `src/tests/components/Timer.test.tsx` with 5+ tests
- Timer logic validated

**Validation Command:**
```bash
npm test -- src/tests/components/Timer.test.tsx --run
```

**Dependencies:**
- M6.1 (test utilities)

**Rollback Procedure:**
```bash
rm src/tests/components/Timer.test.tsx
```

**Success Criteria:**
- [ ] 5+ tests pass
- [ ] Time format correct
- [ ] Pause/resume works
- [ ] Fake timers used

---

## Tasks M6.6 - M6.50 (Condensed)

**M6.6: Test ScoreDisplay Component (0.5h)** - Score formatting, animations
**M6.7: Test LeaderBoard Component (1.5h)** - Ranking, sorting, pagination
**M6.8: Test MapOverlay Component (1h)** - SVG interactions, zooming
**M6.9: Test HintSystem Component (1h)** - Hint display, cooldown
**M6.10: Test ProgressBar Component (0.5h)** - Percentage calculation
**M6.11: Test Modal Component (1h)** - Open/close, backdrop click
**M6.12: Test Button Component (0.5h)** - Variants, disabled state
**M6.13: Test Input Component (1h)** - Validation, error messages
**M6.14: Test Dropdown Component (1h)** - Options, selection
**M6.15: Test Checkbox Component (0.5h)** - Checked state, labels
**M6.16: Test Radio Component (0.5h)** - Group behavior, selection
**M6.17: Test Tooltip Component (0.5h)** - Hover, positioning
**M6.18: Test Alert Component (0.5h)** - Types, dismissal
**M6.19: Test Card Component (0.5h)** - Layout, elevation
**M6.20: Test Avatar Component (0.5h)** - Image fallback, initials
**M6.21: Test Badge Component (0.5h)** - Count, positioning
**M6.22: Test Tabs Component (1h)** - Navigation, active state
**M6.23: Test Accordion Component (1h)** - Expand/collapse, multi
**M6.24: Test Carousel Component (1.5h)** - Navigation, autoplay
**M6.25: Test Header Component (1h)** - Navigation, responsive
**M6.26: Test Footer Component (0.5h)** - Links, layout
**M6.27: Test Sidebar Component (1h)** - Drawer, overlay
**M6.28: Test Navigation Component (1h)** - Active route, mobile menu
**M6.29: Test LoadingSpinner Component (0.5h)** - Sizes, colors
**M6.30: Test ErrorBoundary Component (1h)** - Error capture, fallback
**M6.31: Test Skeleton Component (0.5h)** - Loading states
**M6.32: Test Image Component (1h)** - Lazy loading, error handling
**M6.33: Test Icon Component (0.5h)** - SVG rendering, accessibility
**M6.34: Test Form Component (1.5h)** - Validation, submission
**M6.35: Test SearchBar Component (1h)** - Input, suggestions
**M6.36: Test Pagination Component (1h)** - Page navigation, limits
**M6.37: Test Table Component (1.5h)** - Sorting, filtering
**M6.38: Test Grid Component (1h)** - Responsive layout
**M6.39: Test Flex Component (0.5h)** - Flexbox props
**M6.40: Test Container Component (0.5h)** - Max width, padding
**M6.41: Test ThemeToggle Component (0.5h)** - Dark/light mode
**M6.42: Test LanguageSelector Component (1h)** - i18n, selection
**M6.43: Test UserMenu Component (1h)** - Dropdown, profile
**M6.44: Test NotificationBell Component (1h)** - Count, dropdown
**M6.45: Test ProfileCard Component (1h)** - User info, actions
**M6.46: Test SettingsPanel Component (1.5h)** - Form, toggles
**M6.47: Component Snapshot Tests (2h)** - All components
**M6.48: Component Accessibility Tests (2h)** - ARIA, keyboard nav
**M6.49: Component Performance Tests (1h)** - Re-render optimization
**M6.50: M6 Milestone Integration Test (0.5h)** - Full suite validation

---

## M6 Summary

**Total Tasks:** 50
**Total Effort:** 20 hours
**Critical Path:** M6.1 → M6.2 → M6.3 → M6.4 → M6.50 (7.5h)

**Parallelizable Groups:**
- Group 1: M6.1 (sequential, 2h)
- Group 2 (after M6.1): M6.2, M6.3, M6.4, M6.5 (parallel, 5.5h)
- Group 3 (after Group 2): M6.6-M6.20 (parallel, 12h)
- Group 4 (after Group 3): M6.21-M6.46 (parallel, 23h)
- Group 5 (after Group 4): M6.47-M6.49 (parallel, 5h)
- Group 6: M6.50 (final, 0.5h)

**Success Metrics:**
- Component test coverage: 0% → 95%+
- 50+ components tested
- Accessibility validated
- Snapshot tests established
- Performance benchmarks documented
