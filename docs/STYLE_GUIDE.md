# Style Guide

**Colombia Departments Puzzle Game - Code & Visual Style Standards**

Guidelines for writing consistent, maintainable, and accessible code.

**Last Updated:** 2025-10-08
**Audience:** Contributors, Developers
**Enforcement:** ESLint, Prettier, Code Review

---

## 📋 Table of Contents

1. [Code Style](#code-style)
2. [Visual Style](#visual-style)
3. [Component Patterns](#component-patterns)
4. [Naming Conventions](#naming-conventions)
5. [Accessibility Standards](#accessibility-standards)
6. [Performance Guidelines](#performance-guidelines)

---

## 💻 Code Style

### TypeScript

**Use Explicit Types:**
```typescript
// ✅ GOOD
interface Department {
  id: string;
  name: string;
  region: Region;
  capital: string;
  coordinates: { x: number; y: number };
}

function getDepartment(id: string): Department | undefined {
  return departments.find(d => d.id === id);
}

// ❌ BAD - Implicit any
function getDepartment(id) {
  return departments.find(d => d.id === id);
}
```

**Use Const Assertions:**
```typescript
// ✅ GOOD - Type-safe constants
export const GAME_MODES = {
  COMPLETE: 'complete',
  REGIONAL: 'regional',
  TIMED: 'timed',
} as const;

type GameMode = typeof GAME_MODES[keyof typeof GAME_MODES];

// ❌ BAD - Mutable
export const GAME_MODES = {
  COMPLETE: 'complete',
  REGIONAL: 'regional',
};
```

**Avoid Any Type:**
```typescript
// ✅ GOOD
interface ComponentProps {
  data: Department[];
  onSelect: (id: string) => void;
}

// ❌ BAD
interface ComponentProps {
  data: any[];
  onSelect: any;
}
```

### React Components

**Function Components with TypeScript:**
```tsx
// ✅ GOOD - Explicit prop types
interface DepartmentChipProps {
  department: Department;
  isPlaced: boolean;
  onSelect: () => void;
}

export function DepartmentChip({
  department,
  isPlaced,
  onSelect,
}: DepartmentChipProps) {
  return (
    <button
      onClick={onSelect}
      disabled={isPlaced}
      className="department-chip"
    >
      {department.name}
    </button>
  );
}

// ❌ BAD - Props without types
export function DepartmentChip(props) {
  return <button onClick={props.onSelect}>{props.department.name}</button>;
}
```

**Use Named Exports (not default):**
```tsx
// ✅ GOOD - Named export
export function DepartmentChip() { }

// ❌ BAD - Default export (harder to refactor)
export default function DepartmentChip() { }
```

**Component Organization:**
```tsx
// Component file structure order:
// 1. Imports
import React, { useState } from 'react';
import { Department } from '../types';
import { Button } from '../design-system';

// 2. Type definitions
interface Props {
  // ...
}

// 3. Constants (if local to component)
const MAX_HINTS = 3;

// 4. Component
export function MyComponent({ }: Props) {
  // Hooks first
  const [state, setState] = useState();

  // Event handlers
  const handleClick = () => { };

  // Render
  return ( );
}

// 5. Exports
export type { Props as MyComponentProps };
```

### Hooks

**Custom Hook Patterns:**
```typescript
// ✅ GOOD - Type-safe custom hook
function useGameTimer(initialTime: number): {
  time: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
} {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  // Implementation...

  return { time, isRunning, start, pause, reset };
}

// Usage
const { time, start, pause } = useGameTimer(0);
```

**Hook Dependencies:**
```typescript
// ✅ GOOD - All dependencies listed
useEffect(() => {
  fetchData(id);
}, [id, fetchData]);  // Include all external values

// ❌ BAD - Missing dependencies
useEffect(() => {
  fetchData(id);
}, []);  // ESLint will warn
```

### File Organization

**Import Order:**
```tsx
// 1. External dependencies
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Design system
import { Button, Card } from '../design-system';

// 3. Internal components
import { GameMap } from './GameMap';

// 4. Hooks
import { useGame } from '../hooks/useGame';

// 5. Utils
import { normalizeId } from '../utils/nameNormalizer';

// 6. Types
import type { Department, Region } from '../types';

// 7. Constants
import { GAME_MODES } from '../constants/gameConstants';

// 8. Styles (if needed)
import './Component.css';
```

---

## 🎨 Visual Style

### Color Usage

**Primary Colors:**
- **Blue (#3b82f6):** Primary actions, links, interactive elements
- **Gray (#171717-#fafafa):** Text, backgrounds, borders
- **Green (#22c55e):** Success states, correct answers
- **Red (#ef4444):** Error states, incorrect answers
- **Amber (#f59e0b):** Warning states, hints

**Regional Colors (WCAG AAA):**
| Region | Color | Contrast Ratio | Pattern |
|--------|-------|----------------|---------|
| Andina | #14532D Green | 9.1:1 | Dots |
| Caribe | #1E40AF Blue | 9.4:1 | Waves |
| Pacífica | #0C4A6E Cyan | 8.7:1 | Horizontal Lines |
| Orinoquía | #B45309 Orange | 7.2:1 | Vertical Lines |
| Amazonía | #14532D Dark Green | 9.1:1 | Diagonal Lines |
| Insular | #075985 Blue | 8.3:1 | Circles |

**Usage:**
- Use region colors for department identification only
- Don't use region colors for UI elements (use brand colors)
- Always combine with patterns for colorblind accessibility

### Typography

**Hierarchy:**
```tsx
// Display (hero text)
<h1 className="text-4xl font-bold">Hero Title</h1>

// Page headings
<h2 className="text-2xl font-bold">Page Title</h2>

// Section headings
<h3 className="text-xl font-semibold">Section Title</h3>

// Subsection headings
<h4 className="text-base font-semibold">Subsection</h4>

// Body text
<p className="text-base">Regular paragraph text</p>

// Small text (captions)
<span className="text-sm text-gray-600">Caption or helper text</span>

// UI labels
<label className="text-sm font-medium">Form Label</label>
```

**Font Weights:**
- **Normal (400):** Body text
- **Medium (500):** UI text, labels
- **Semibold (600):** Subheadings
- **Bold (700):** Headings, emphasis

### Spacing

**Component Spacing (Internal):**
```tsx
// Buttons
<Button className="px-4 py-2">  // 16px horizontal, 8px vertical

// Cards
<Card className="p-6">  // 24px padding

// Modals
<Modal className="p-6 gap-4">  // 24px padding, 16px gap
```

**Layout Spacing:**
```tsx
// Between sections
<div className="space-y-8">  // 32px vertical spacing

// Between related elements
<div className="space-y-4">  // 16px vertical spacing

// Inline groups
<div className="flex gap-2">  // 8px gap
```

**Grid System:**
- Base unit: **4px**
- Minimum spacing: **4px** (spacing[1])
- Standard spacing: **16px** (spacing[4])
- Large spacing: **24px** (spacing[6])
- Section spacing: **32px** (spacing[8])

### Shadows & Elevation

**Usage:**
```tsx
// Cards
<Card className="shadow-sm">  // Subtle shadow

// Elevated cards
<Card variant="elevated" className="shadow-md">  // More pronounced

// Floating elements (modals, dropdowns)
<Modal className="shadow-lg">  // Strong shadow
```

**Elevation Levels:**
- **shadow-sm:** Cards, chips (2px blur)
- **shadow-md:** Hover states, dropdowns (4px blur)
- **shadow-lg:** Modals, overlays (8px blur)

### Border Radius

**Standards:**
```tsx
// Small elements (buttons, badges)
className="rounded-lg"  // 8px

// Medium elements (cards, inputs)
className="rounded-xl"  // 12px

// Large elements (modals, panels)
className="rounded-2xl"  // 16px

// Circular elements (icon buttons)
className="rounded-full"
```

---

## 🏗️ Component Patterns

### Composition Pattern

**Use composable components:**
```tsx
// ✅ GOOD - Composable
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// ❌ BAD - Monolithic
<Card
  title="Title"
  description="Description"
  content="Content"
  footer={<Button>Action</Button>}
/>
```

### State Management

**Use Zustand for Global State:**
```typescript
// ✅ GOOD - Zustand store
import { create } from 'zustand';

const useGameStore = create<GameState>((set) => ({
  score: 0,
  placedDepartments: new Set(),
  incrementScore: (points) => set((state) => ({
    score: state.score + points
  })),
}));
```

**Use useState for Local State:**
```tsx
// ✅ GOOD - Local component state
function Component() {
  const [isOpen, setIsOpen] = useState(false);
  return <Modal open={isOpen} onOpenChange={setIsOpen} />;
}
```

### Event Handlers

**Naming:**
```tsx
// ✅ GOOD - Clear handler names
const handleClick = () => { };
const handleDragStart = (event: DragEvent) => { };
const handleModalClose = () => { };

// ❌ BAD - Unclear names
const onClick = () => { };  // Conflicts with prop name
const func1 = () => { };    // Non-descriptive
```

**Type Safety:**
```tsx
// ✅ GOOD - Typed events
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
};

const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value);
};

// ❌ BAD - Untyped
const handleClick = (event) => {
  event.preventDefault();
};
```

---

## 📛 Naming Conventions

### Files

| Type | Convention | Example |
|------|------------|---------|
| **Components** | PascalCase | `GameContainer.tsx` |
| **Hooks** | camelCase with "use" | `useGameTimer.ts` |
| **Utils** | camelCase | `nameNormalizer.ts` |
| **Constants** | camelCase or CAPS | `gameConstants.ts`, `GAME_CONFIG.ts` |
| **Types** | PascalCase | `Department.ts`, `GameTypes.ts` |
| **Tests** | Match source + .test | `GameContainer.test.tsx` |
| **Styles** | kebab-case | `game-container.css` |

### Variables

```typescript
// ✅ GOOD
const departmentCount = 33;
const isGameActive = true;
const selectedDepartment = departments[0];
const MAXIMUM_HINTS = 3;  // Constants in CAPS

// ❌ BAD
const DepartmentCount = 33;  // PascalCase for variable
const is_game_active = true;  // snake_case
const SelectedDepartment = departments[0];
```

### Functions

```typescript
// ✅ GOOD - Verb-first, descriptive
function calculateScore(attempts: number): number { }
function validateDepartment(id: string): boolean { }
function getDepartmentById(id: string): Department | undefined { }

// ❌ BAD - Noun-first or unclear
function department(id: string) { }  // Noun
function check(id: string) { }        // Vague
function func1() { }                  // Non-descriptive
```

### Components

```tsx
// ✅ GOOD - Descriptive, specific
export function DepartmentChip() { }
export function GameModeSelector() { }
export function PostGameReport() { }

// ❌ BAD - Generic or vague
export function Chip() { }
export function Selector() { }
export function Report() { }
```

### Boolean Props

```tsx
// ✅ GOOD - Is/Has/Can prefix
interface Props {
  isActive: boolean;
  hasError: boolean;
  canSubmit: boolean;
  disabled: boolean;  // Common convention
}

// ❌ BAD - Unclear
interface Props {
  active: boolean;
  error: boolean;
  submit: boolean;
}
```

---

## ♿ Accessibility Standards

### ARIA Labels

**Always provide labels for icon-only buttons:**
```tsx
// ✅ GOOD
<Button icon={<X />} aria-label="Close dialog" />

// ❌ BAD - No label for screen readers
<Button icon={<X />} />
```

**Use semantic HTML:**
```tsx
// ✅ GOOD
<nav aria-label="Game controls">
  <button>Start</button>
  <button>Reset</button>
</nav>

// ❌ BAD
<div>
  <div onClick={start}>Start</div>
  <div onClick={reset}>Reset</div>
</div>
```

### Touch Targets

**Minimum 44×44px on mobile:**
```tsx
// ✅ GOOD - WCAG 2.5.5 AAA compliant
<Button size="md">  // Enforces 44px minimum
  Tap Me
</Button>

// ❌ BAD - Too small for touch
<button className="w-8 h-8">  // 32px - fails WCAG
  Tap
</button>
```

### Color Contrast

**WCAG AAA requires 7:1 for normal text:**
```tsx
// ✅ GOOD - 9.1:1 contrast
<p className="text-gray-900 bg-white">  // Black on white

// ❌ BAD - 2.3:1 contrast (fails AAA)
<p className="text-gray-400 bg-white">  // Light gray on white
```

**Use region colors from design system:**
```tsx
// ✅ GOOD - Pre-validated WCAG AAA colors
import { regionColors } from '../design-system';
<div style={{ backgroundColor: regionColors.Andina.primary }}>  // 9.1:1
```

### Keyboard Navigation

**All interactive elements must be keyboard accessible:**
```tsx
// ✅ GOOD - Keyboard accessible
<button onClick={handleClick} onKeyDown={handleKeyDown}>
  Action
</button>

// ✅ GOOD - Using design system (keyboard handling built-in)
<Button onClick={handleClick}>Action</Button>

// ❌ BAD - No keyboard support
<div onClick={handleClick}>Action</div>
```

---

## ⚡ Performance Guidelines

### Component Optimization

**Use React.memo for expensive components:**
```tsx
// ✅ GOOD - Prevents unnecessary re-renders
export const DepartmentChip = React.memo(function DepartmentChip({
  department,
  onSelect,
}: Props) {
  return <button onClick={onSelect}>{department.name}</button>;
}, (prevProps, nextProps) => {
  return prevProps.department.id === nextProps.department.id;
});
```

**Use useMemo for expensive calculations:**
```tsx
// ✅ GOOD - Memoize expensive computation
const sortedDepartments = useMemo(() => {
  return departments.sort((a, b) => a.name.localeCompare(b.name));
}, [departments]);

// ❌ BAD - Recalculates on every render
const sortedDepartments = departments.sort((a, b) =>
  a.name.localeCompare(b.name)
);
```

**Use useCallback for event handlers:**
```tsx
// ✅ GOOD - Stable function reference
const handleClick = useCallback(() => {
  selectDepartment(id);
}, [id, selectDepartment]);

// ❌ BAD - New function on every render
const handleClick = () => {
  selectDepartment(id);
};
```

### Lazy Loading

**Code split heavy components:**
```tsx
// ✅ GOOD - Lazy load large components
import { lazy, Suspense } from 'react';

const StudyMode = lazy(() => import('./StudyMode'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      {showStudy && <StudyMode />}
    </Suspense>
  );
}
```

### Avoid Inline Functions

**In JSX props:**
```tsx
// ✅ GOOD - Defined outside render
const handleClick = () => { };
<Button onClick={handleClick} />

// ❌ BAD - New function every render
<Button onClick={() => { }} />
```

---

## 🎯 Tailwind CSS Style

### Utility Classes

**Use Tailwind utilities, not custom CSS:**
```tsx
// ✅ GOOD - Tailwind utilities
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
  Content
</div>

// ❌ BAD - Custom CSS when Tailwind exists
<div className="custom-flex-container" style={{ padding: '16px' }}>
  Content
</div>
```

**Class Organization:**
```tsx
// Order: Layout → Spacing → Typography → Colors → Effects
<div className="
  flex flex-col items-start
  p-4 gap-2
  text-base font-medium
  bg-white text-gray-900
  rounded-lg shadow-sm hover:shadow-md
">
```

### Responsive Design

**Mobile-first approach:**
```tsx
// ✅ GOOD - Mobile-first (base → md → lg)
<div className="
  text-sm        // Mobile (default)
  md:text-base   // Tablet (768px+)
  lg:text-lg     // Desktop (1024px+)
">
```

**Hide/show based on viewport:**
```tsx
// Mobile-only
<div className="block md:hidden">Mobile menu</div>

// Desktop-only
<div className="hidden md:block">Desktop sidebar</div>
```

---

## 🧪 Testing Style

### Test Organization

**Use Describe Blocks:**
```typescript
describe('DepartmentChip', () => {
  describe('rendering', () => {
    it('renders department name', () => { });
    it('shows region badge', () => { });
  });

  describe('interaction', () => {
    it('calls onSelect when clicked', () => { });
    it('shows disabled state when placed', () => { });
  });

  describe('accessibility', () => {
    it('has proper ARIA labels', () => { });
    it('is keyboard navigable', () => { });
  });
});
```

### Test Naming

```typescript
// ✅ GOOD - Descriptive, specific
it('increments score by 100 when department placed correctly', () => { });
it('shows error message when placement is incorrect', () => { });
it('disables hint button after 3 hints used', () => { });

// ❌ BAD - Vague
it('works correctly', () => { });
it('test1', () => { });
```

---

## 📏 Code Formatting

**Enforced by Prettier:**

- **Indent:** 2 spaces (not tabs)
- **Line length:** 100 characters max
- **Quotes:** Single quotes for strings
- **Semicolons:** Required
- **Trailing commas:** ES5 style
- **Arrow functions:** Parentheses when needed

**Example:**
```typescript
export function Component({
  prop1,
  prop2,
  prop3,
}: ComponentProps): JSX.Element {
  const value = useMemo(
    () => expensiveCalculation(prop1, prop2),
    [prop1, prop2]
  );

  return (
    <div className="container">
      {value}
    </div>
  );
}
```

---

## 🚫 Anti-Patterns

### Don't Use Inline Styles (Except for Dynamic Values)

```tsx
// ✅ GOOD - Dynamic value needs inline style
<div style={{ transform: `translateY(${y}px)` }} />

// ✅ GOOD - Use Tailwind
<div className="bg-white p-4 rounded-lg" />

// ❌ BAD - Static inline styles
<div style={{ backgroundColor: 'white', padding: '16px' }} />
```

### Don't Mutate Props/State

```typescript
// ✅ GOOD - Immutable update
setState(prev => ({ ...prev, score: prev.score + 10 }));

// ❌ BAD - Mutation
state.score += 10;
setState(state);
```

### Don't Use Index as Key

```tsx
// ✅ GOOD - Stable unique key
{departments.map(dept => (
  <DepartmentChip key={dept.id} department={dept} />
))}

// ❌ BAD - Index as key (causes bugs)
{departments.map((dept, i) => (
  <DepartmentChip key={i} department={dept} />
))}
```

---

## ✅ Code Review Checklist

Before submitting a PR, ensure:

### Code Quality
- [ ] TypeScript types are explicit (no `any`)
- [ ] All imports organized by category
- [ ] Functions have clear, descriptive names
- [ ] Components use design system where possible
- [ ] No console.log statements (except intentional logging)

### Performance
- [ ] Expensive components wrapped in React.memo
- [ ] Expensive calculations use useMemo
- [ ] Event handlers use useCallback
- [ ] Large components lazy loaded

### Accessibility
- [ ] All interactive elements have ARIA labels
- [ ] Color contrast meets WCAG AAA (7:1)
- [ ] Touch targets ≥44px on mobile
- [ ] Keyboard navigation works
- [ ] Screen reader tested

### Testing
- [ ] Unit tests written for new features
- [ ] Tests pass: `npm test -- --run`
- [ ] Type check passes: `npm run typecheck`
- [ ] Lint passes: `npm run lint`

### Documentation
- [ ] Code comments for complex logic
- [ ] README updated for user-facing changes
- [ ] API documentation updated
- [ ] ADR created for architectural decisions

---

## 📞 Questions?

**Style guide questions:**
- Check [CONTRIBUTING.md](../CONTRIBUTING.md)
- Review [DESIGN_SYSTEM_GUIDE.md](./DESIGN_SYSTEM_GUIDE.md)
- Open an issue: [GitHub Issues](https://github.com/bjpl/colombia_department_puzzle/issues)

**Design system questions:**
- See [DESIGN_SYSTEM_GUIDE.md](./DESIGN_SYSTEM_GUIDE.md)
- Review component source in `src/design-system/`

---

**Maintained By:** Development Team
**Enforced By:** ESLint, Prettier, Code Review
**Last Updated:** 2025-10-08
