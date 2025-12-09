# M7: Component Refactoring - Granular Task Breakdown

**Milestone:** Clean component architecture
**Total Effort:** 22 hours
**Total Tasks:** 55 tasks
**Risk Level:** Medium-High
**Dependencies:** M6 (component tests as safety net)

---

## Task M7.1: Create Component Library Structure

**Estimated Effort:** 1.5h
**Risk Level:** Low
**Assignable To:** system-architect

**Input State:**
- Components scattered across directories
- No consistent organization
- No component documentation

**Action Steps:**
1. Create new directory structure:
   ```bash
   mkdir -p src/components/{ui,layout,game,forms,feedback}
   mkdir -p src/components/ui/{Button,Input,Modal,Card}
   mkdir -p src/components/game/{GameBoard,PuzzleGrid,DepartmentPiece}
   ```
2. Create index.ts barrel exports:
   ```typescript
   // src/components/ui/index.ts
   export { Button } from './Button';
   export { Input } from './Input';
   export { Modal } from './Modal';
   export { Card } from './Card';
   ```
3. Document component categories
4. Create component template

**Output State:**
- Organized component structure
- Barrel exports configured
- Documentation started

**Validation Command:**
```bash
npm run typecheck
npm test -- --run
```

**Dependencies:**
- M6.50 (tests protect refactoring)

**Rollback Procedure:**
```bash
git checkout src/components/
```

**Success Criteria:**
- [ ] Directory structure created
- [ ] Barrel exports work
- [ ] Tests still pass
- [ ] No broken imports

---

## Task M7.2: Extract Button Component Variants

**Estimated Effort:** 2h
**Risk Level:** Low
**Assignable To:** coder

**Input State:**
- Button styles duplicated across components
- No variant system
- Inconsistent sizing

**Action Steps:**
1. Create `src/components/ui/Button/Button.tsx`:
   ```typescript
   import { ButtonHTMLAttributes, forwardRef } from 'react';
   import { cn } from '../../../utils/cn';

   export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
     size?: 'sm' | 'md' | 'lg';
     fullWidth?: boolean;
     loading?: boolean;
   }

   export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
     ({
       variant = 'primary',
       size = 'md',
       fullWidth = false,
       loading = false,
       disabled,
       children,
       className,
       ...props
     }, ref) => {
       const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50';

       const variantStyles = {
         primary: 'bg-blue-600 text-white hover:bg-blue-700',
         secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
         outline: 'border border-gray-300 bg-transparent hover:bg-gray-100',
         ghost: 'hover:bg-gray-100',
         danger: 'bg-red-600 text-white hover:bg-red-700'
       };

       const sizeStyles = {
         sm: 'h-9 px-3 text-sm',
         md: 'h-10 px-4',
         lg: 'h-11 px-6 text-lg'
       };

       return (
         <button
           ref={ref}
           disabled={disabled || loading}
           className={cn(
             baseStyles,
             variantStyles[variant],
             sizeStyles[size],
             fullWidth && 'w-full',
             className
           )}
           {...props}
         >
           {loading && <LoadingSpinner className="mr-2" />}
           {children}
         </button>
       );
     }
   );

   Button.displayName = 'Button';
   ```
2. Create `Button.test.tsx` with variant tests
3. Create `Button.stories.tsx` for Storybook
4. Update all Button usages

**Output State:**
- Extracted Button component
- All variants tested
- Storybook stories created
- 100% migration complete

**Validation Command:**
```bash
npm test -- src/components/ui/Button/ --run
npm run build
```

**Dependencies:**
- M7.1 (structure exists)

**Rollback Procedure:**
```bash
git checkout src/components/
```

**Success Criteria:**
- [ ] Button component complete
- [ ] 5 variants supported
- [ ] 3 sizes supported
- [ ] All usages migrated
- [ ] Tests pass

---

## Task M7.3: Extract Input Component with Validation

**Estimated Effort:** 2h
**Risk Level:** Medium
**Assignable To:** coder

**Input State:**
- Input elements inconsistent
- No validation UI
- Error messages ad-hoc

**Action Steps:**
1. Create `src/components/ui/Input/Input.tsx`:
   ```typescript
   import { InputHTMLAttributes, forwardRef } from 'react';
   import { cn } from '../../../utils/cn';

   export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
     label?: string;
     error?: string;
     hint?: string;
     leftIcon?: React.ReactNode;
     rightIcon?: React.ReactNode;
   }

   export const Input = forwardRef<HTMLInputElement, InputProps>(
     ({
       label,
       error,
       hint,
       leftIcon,
       rightIcon,
       className,
       ...props
     }, ref) => {
       return (
         <div className="w-full">
           {label && (
             <label className="block text-sm font-medium mb-1">
               {label}
             </label>
           )}
           <div className="relative">
             {leftIcon && (
               <div className="absolute left-3 top-1/2 -translate-y-1/2">
                 {leftIcon}
               </div>
             )}
             <input
               ref={ref}
               className={cn(
                 'w-full h-10 px-3 rounded-md border transition-colors',
                 'focus:outline-none focus:ring-2 focus:ring-blue-500',
                 error && 'border-red-500 focus:ring-red-500',
                 leftIcon && 'pl-10',
                 rightIcon && 'pr-10',
                 className
               )}
               {...props}
             />
             {rightIcon && (
               <div className="absolute right-3 top-1/2 -translate-y-1/2">
                 {rightIcon}
               </div>
             )}
           </div>
           {error && (
             <p className="mt-1 text-sm text-red-600">{error}</p>
           )}
           {hint && !error && (
             <p className="mt-1 text-sm text-gray-500">{hint}</p>
           )}
         </div>
       );
     }
   );

   Input.displayName = 'Input';
   ```
2. Add validation helpers
3. Create tests and stories
4. Migrate all input usages

**Output State:**
- Input component with validation UI
- Icon support added
- Error/hint display
- Full migration

**Validation Command:**
```bash
npm test -- src/components/ui/Input/ --run
```

**Dependencies:**
- M7.2 (Button component)

**Rollback Procedure:**
```bash
git checkout src/components/
```

**Success Criteria:**
- [ ] Input component complete
- [ ] Validation UI working
- [ ] Icons supported
- [ ] All usages migrated

---

## Task M7.4: Refactor GameBoard Component

**Estimated Effort:** 3h
**Risk Level:** High
**Assignable To:** coder

**Input State:**
- GameBoard is 450+ lines
- Multiple responsibilities
- No composition

**Action Steps:**
1. Extract sub-components:
   ```typescript
   // GameBoard/GameControls.tsx
   export function GameControls({ onReset, onHint, onPause }) {
     return (
       <div className="flex gap-2">
         <Button variant="secondary" onClick={onReset}>
           Reiniciar
         </Button>
         <Button variant="outline" onClick={onHint}>
           Pista
         </Button>
         <Button variant="ghost" onClick={onPause}>
           Pausar
         </Button>
       </div>
     );
   }

   // GameBoard/GameStats.tsx
   export function GameStats({ score, time, piecesPlaced }) {
     return (
       <div className="flex gap-4">
         <div>Puntos: {score}</div>
         <div>Tiempo: {formatTime(time)}</div>
         <div>Piezas: {piecesPlaced}/32</div>
       </div>
     );
   }

   // GameBoard/index.tsx
   export function GameBoard() {
     const { gameState, score, actions } = useGame();

     return (
       <div className="game-board">
         <GameStats {...gameState} />
         <GameControls {...actions} />
         <PuzzleGrid />
         <DepartmentList />
       </div>
     );
   }
   ```
2. Move logic to hooks
3. Update tests
4. Verify functionality

**Output State:**
- GameBoard split into 5 components
- Each < 100 lines
- Tests updated

**Validation Command:**
```bash
npm test -- src/components/game/GameBoard/ --run
npm run build
```

**Dependencies:**
- M7.3 (UI components ready)

**Rollback Procedure:**
```bash
git checkout src/components/game/GameBoard/
npm test -- --run
```

**Success Criteria:**
- [ ] 5 sub-components created
- [ ] All < 100 lines
- [ ] Tests pass
- [ ] No functionality lost

---

## Task M7.5: Refactor PuzzleGrid Component

**Estimated Effort:** 2.5h
**Risk Level:** High
**Assignable To:** coder

**Input State:**
- PuzzleGrid handles SVG and logic
- 350+ lines
- Performance issues

**Action Steps:**
1. Extract SVG rendering:
   ```typescript
   // PuzzleGrid/MapSVG.tsx
   export function MapSVG({ paths, onSlotClick }) {
     return (
       <svg viewBox="0 0 1000 1000" className="w-full h-full">
         {paths.map(path => (
           <DepartmentPath
             key={path.id}
             path={path}
             onClick={() => onSlotClick(path.id)}
           />
         ))}
       </svg>
     );
   }

   // PuzzleGrid/DepartmentPath.tsx
   export const DepartmentPath = React.memo(({ path, onClick }) => {
     return (
       <path
         d={path.d}
         className={cn(
           'department-path',
           path.filled && 'filled',
           path.highlighted && 'highlighted'
         )}
         onClick={onClick}
       />
     );
   });

   // PuzzleGrid/index.tsx
   export function PuzzleGrid() {
     const { paths, handleSlotClick } = usePuzzleGrid();

     return (
       <div className="puzzle-grid">
         <MapSVG paths={paths} onSlotClick={handleSlotClick} />
       </div>
     );
   }
   ```
2. Memoize expensive calculations
3. Add virtualization
4. Update tests

**Output State:**
- PuzzleGrid split into 4 components
- Performance optimized
- Tests maintained

**Validation Command:**
```bash
npm test -- src/components/game/PuzzleGrid/ --run
npm run test:performance
```

**Dependencies:**
- M7.4 (GameBoard refactored)

**Rollback Procedure:**
```bash
git checkout src/components/game/PuzzleGrid/
```

**Success Criteria:**
- [ ] 4 sub-components created
- [ ] Memoization applied
- [ ] Performance improved
- [ ] Tests pass

---

## Tasks M7.6 - M7.55 (Condensed)

**M7.6: Refactor DepartmentPiece Component (2h)** - Extract drag logic
**M7.7: Refactor Timer Component (1h)** - Extract formatting
**M7.8: Refactor ScoreDisplay Component (1h)** - Animation logic
**M7.9: Refactor LeaderBoard Component (2h)** - Table extraction
**M7.10: Refactor Modal Component (1.5h)** - Portal, focus trap
**M7.11: Refactor Form Components (2h)** - Validation library
**M7.12: Refactor Header Component (1.5h)** - Navigation extraction
**M7.13: Refactor Footer Component (1h)** - Link groups
**M7.14: Refactor Sidebar Component (2h)** - Drawer logic
**M7.15: Extract Theme Context (1.5h)** - Dark mode system
**M7.16: Extract Auth Context (1.5h)** - Session management
**M7.17: Extract Game Context (2h)** - State machine
**M7.18: Create Compound Components (2h)** - Tabs, Accordion
**M7.19: Add Component Composition (1.5h)** - Slot pattern
**M7.20: Implement Render Props (1h)** - Flexible components
**M7.21: Add forwardRef to All Components (2h)** - Ref forwarding
**M7.22: Add displayName to Components (1h)** - Dev tools
**M7.23: Extract Common Hooks (2h)** - Reusable logic
**M7.24: Create Custom Hook Library (2h)** - 20+ hooks
**M7.25: Add PropTypes Validation (1h)** - Runtime checks
**M7.26: Create Component Documentation (2h)** - JSDoc
**M7.27: Add Storybook Stories (3h)** - All components
**M7.28: Create Component Playground (2h)** - Interactive demo
**M7.29: Add Component Tests (3h)** - New components
**M7.30: Update Existing Tests (2h)** - Refactored components
**M7.31-M7.50: Component-Specific Refactoring** - 20 components (20h)
**M7.51: Performance Audit (2h)** - Re-render analysis
**M7.52: Accessibility Audit (2h)** - ARIA compliance
**M7.53: Bundle Size Analysis (1h)** - Tree-shaking
**M7.54: Documentation Finalization (2h)** - Complete guide
**M7.55: M7 Milestone Integration Test (1h)** - Full validation

---

## M7 Summary

**Total Tasks:** 55
**Total Effort:** 22 hours
**Critical Path:** M7.1 → M7.4 → M7.5 → M7.55 (10h)

**Parallelizable Groups:**
- Group 1: M7.1 (sequential, 1.5h)
- Group 2 (after M7.1): M7.2, M7.3 (parallel, 2h)
- Group 3 (after Group 2): M7.4, M7.5 (parallel, 3h)
- Group 4 (after Group 3): M7.6-M7.14 (parallel, 15h)
- Group 5 (after Group 4): M7.15-M7.30 (parallel, 30h)
- Group 6 (after Group 5): M7.31-M7.50 (parallel, 20h)
- Group 7: M7.51-M7.54 (parallel, 7h)
- Group 8: M7.55 (final, 1h)

**Success Metrics:**
- Components refactored: 30+
- Average component size: <150 lines
- Reusable UI library: 25+ components
- Storybook coverage: 100%
- Performance: 30% improvement
