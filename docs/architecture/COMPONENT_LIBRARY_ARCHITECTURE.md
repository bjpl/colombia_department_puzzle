# Component Library Architecture

**Version:** 1.0
**Date:** 2025-12-08
**Status:** Foundation Complete (M7.1)

---

## Overview

This document defines the architectural principles and organizational structure for the Colombia Puzzle Game component library, established as part of M7 Component Refactoring.

---

## Architectural Principles

### 1. Separation of Concerns
Components are organized by purpose and responsibility, not by feature or page.

### 2. Reusability First
UI primitives are designed to be used across multiple contexts without modification.

### 3. Composition Over Inheritance
Complex components are built by composing simpler components.

### 4. Accessibility by Default
All components follow WCAG 2.1 Level AAA standards with proper ARIA attributes.

### 5. Type Safety
Full TypeScript coverage with explicit interfaces and proper generic types.

### 6. Performance Optimization
Strategic use of React.memo, forwardRef, and lazy loading where beneficial.

---

## Directory Structure

```
src/components/
│
├── _template/                 # Reference patterns and documentation
│   ├── ComponentTemplate.tsx  # Reference implementation
│   ├── README.md             # Usage guidelines
│   └── COMPONENT_MAPPING.md  # Migration planning
│
├── ui/                        # Reusable primitive components
│   └── index.ts              # Barrel exports
│
├── layout/                    # Page structure and containers
│   └── index.ts              # Barrel exports
│
├── game/                      # Game-specific interactive components
│   └── index.ts              # Barrel exports
│
├── feedback/                  # User feedback and notifications
│   └── index.ts              # Barrel exports
│
├── modals/                    # Overlay dialogs and sheets
│   └── index.ts              # Barrel exports
│
├── auth/                      # Authentication components (existing)
│   └── index.ts
│
├── study/                     # Study mode components (existing)
│   └── index.ts
│
└── [Error Boundaries]         # Cross-cutting error handling (root level)
    ├── ErrorBoundary.tsx
    ├── ComponentErrorBoundary.tsx
    ├── GameLogicErrorBoundary.tsx
    └── MapErrorBoundary.tsx
```

---

## Component Categories

### UI Components (`/ui`)

**Purpose:** Reusable primitive components used across the application

**Examples:**
- Buttons and interactive elements
- Form controls (inputs, selects, checkboxes)
- Visual feedback (loading spinners, progress bars)
- Icons and badges
- Typography components

**Characteristics:**
- Minimal to no business logic
- Highly reusable
- Props-driven configuration
- No direct API calls or state management

**Import pattern:**
```typescript
import { Button, Spinner, Badge } from '@/components/ui';
```

---

### Layout Components (`/layout`)

**Purpose:** Page structure, containers, and navigation

**Examples:**
- Page containers and wrappers
- Grid and flex layouts
- Headers and footers
- Sidebars and navigation
- Panels and sections

**Characteristics:**
- Structural responsibility
- May contain state for layout behavior (collapsible, responsive)
- Compose UI components
- Define spacing and positioning

**Import pattern:**
```typescript
import { GameHeader, MobileLayout, BottomSheet } from '@/components/layout';
```

---

### Game Components (`/game`)

**Purpose:** Game-specific interactive elements and mechanics

**Examples:**
- Map rendering components
- Puzzle pieces and drag targets
- Game mode implementations
- Touch and keyboard interaction handlers
- Game state visualizations

**Characteristics:**
- Core game functionality
- Performance-critical
- Complex state management
- Integration with game logic hooks
- May use Canvas API or WebGL

**Import pattern:**
```typescript
import { ColombiaMap, DragOverlay, StudyMode } from '@/components/game';
```

---

### Feedback Components (`/feedback`)

**Purpose:** User notifications, announcements, and status displays

**Examples:**
- Toast notifications
- Screen reader announcements
- Progress indicators
- Success/error messages
- Status badges and indicators
- Post-game reports

**Characteristics:**
- Temporary or transient UI
- Accessibility focused
- Often portal-based rendering
- May use animation
- Coordinate with global state

**Import pattern:**
```typescript
import { Toast, ScreenReaderAnnouncements, PostGameReport } from '@/components/feedback';
```

---

### Modal Components (`/modals`)

**Purpose:** Overlay dialogs, sheets, and focused UI

**Examples:**
- Dialog boxes
- Bottom sheets
- Drawers
- Tooltips and popovers
- Confirmation modals
- Help screens

**Characteristics:**
- Overlay rendering (portals)
- Focus management
- Escape key handling
- Click-outside-to-close
- ARIA dialog patterns
- Prevent body scroll

**Import pattern:**
```typescript
import { HintModal, KeyboardHelp, InteractiveTutorial } from '@/components/modals';
```

---

### Auth Components (`/auth`)

**Purpose:** Authentication and user management (existing, well-organized)

**Examples:**
- Login/signup forms
- Auth buttons and links
- Protected routes
- User profile displays

**Characteristics:**
- Complete vertical slice
- Integrated with auth state
- Form validation
- API integration

**Import pattern:**
```typescript
import { AuthButton, LoginForm, ProtectedRoute } from '@/components/auth';
```

---

### Error Boundaries (Root Level)

**Purpose:** Cross-cutting error handling

**Rationale for root placement:**
- Not a typical component category
- Used across all categories
- Special React lifecycle requirements
- Higher-order component pattern

**Components:**
- `ErrorBoundary.tsx` - Root level error boundary
- `ComponentErrorBoundary.tsx` - Component-specific errors
- `GameLogicErrorBoundary.tsx` - Game logic errors
- `MapErrorBoundary.tsx` - Map rendering errors

---

## Component Design Patterns

### 1. Component Template Pattern

All new components should follow the template established in `_template/ComponentTemplate.tsx`:

```typescript
import { forwardRef, memo, type ReactNode } from 'react';

export interface ComponentProps {
  /** JSDoc for each prop */
  children?: ReactNode;
  className?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

export const Component = memo(
  forwardRef<HTMLDivElement, ComponentProps>(
    ({ children, className, ...props }, ref) => {
      return (
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      );
    }
  )
);

Component.displayName = 'Component';

export default Component;
```

### 2. Accessibility Pattern

Every interactive component must include:
- Proper ARIA labels
- Keyboard navigation support
- Focus management
- Screen reader announcements
- Semantic HTML elements
- WCAG 2.1 Level AAA compliance

### 3. Type Safety Pattern

- Explicit TypeScript interfaces for all props
- Generic types for flexible components
- Proper ref typing with forwardRef
- No `any` types
- Leverage type inference where appropriate

### 4. Performance Pattern

Strategic optimization:
- `React.memo` for expensive render components
- `useMemo` for expensive computations
- `useCallback` for stable function references
- Lazy loading for code splitting
- Avoid inline function definitions in renders

### 5. Testing Pattern

Every component must have:
- Unit tests for component logic
- Accessibility tests (jest-axe)
- Integration tests for complex interactions
- Visual regression tests for critical UI

---

## Migration Strategy

### Phased Approach (M7.2-M7.10)

**Phase 1: UI Primitives (M7.2-M7.3)**
- Low complexity, high reusability
- Establish patterns for other phases
- Quick wins to build momentum

**Phase 2: Layout Components (M7.4-M7.5)**
- Medium complexity
- Structural components
- Some state management

**Phase 3: Feedback Components (M7.6-M7.7)**
- Moderate complexity
- Accessibility critical
- Notification systems

**Phase 4: Modal Components (M7.8)**
- Higher complexity
- Focus management
- Portal rendering

**Phase 5: Game Components (M7.9-M7.10)**
- Highest complexity
- Performance critical
- Extensive testing required

### Migration Process for Each Component

1. **Analysis**
   - Review existing component
   - Identify dependencies
   - Plan test coverage

2. **Create New Component**
   - Follow template pattern
   - Implement in target category
   - Add comprehensive tests

3. **Gradual Migration**
   - Update imports incrementally
   - Maintain backward compatibility
   - Add deprecation notices

4. **Validation**
   - Verify all tests pass
   - Check accessibility
   - Performance testing

5. **Cleanup**
   - Remove old component
   - Update documentation
   - Archive deprecated code

---

## Naming Conventions

### Component Files
- PascalCase: `ComponentName.tsx`
- Descriptive, not abbreviated
- Singular noun (e.g., `Button`, not `Buttons`)

### Component Names
- Match file name
- Use `displayName` for debugging
- Prefix generic components with category (e.g., `UIButton` for disambiguation)

### Props Interfaces
- Match component name + `Props` suffix
- Export from same file
- Document with JSDoc

### Test Files
- Match component name + `.test.tsx`
- Co-locate with component
- Use descriptive test names

---

## Import Aliases

Configured path aliases for clean imports:

```typescript
// tsconfig.json paths
{
  "@/components/ui": ["src/components/ui"],
  "@/components/layout": ["src/components/layout"],
  "@/components/game": ["src/components/game"],
  "@/components/feedback": ["src/components/feedback"],
  "@/components/modals": ["src/components/modals"]
}
```

**Usage:**
```typescript
// Prefer barrel imports
import { Button, Spinner } from '@/components/ui';

// Direct imports for tree-shaking if needed
import { Button } from '@/components/ui/Button';
```

---

## Quality Standards

### Code Quality
- ESLint: Zero warnings/errors
- Prettier: Consistent formatting
- TypeScript: Strict mode, no `any`

### Accessibility
- WCAG 2.1 Level AAA
- Keyboard navigation
- Screen reader tested
- High contrast support

### Performance
- Lighthouse: 90+ performance score
- No layout shifts (CLS)
- Fast interaction (FID)
- Lazy loading where appropriate

### Testing
- Unit test coverage: >80%
- Integration tests for complex flows
- Accessibility tests (jest-axe)
- Visual regression tests

---

## Tooling & Infrastructure

### Development
- Vite for fast builds
- TypeScript for type safety
- ESLint + Prettier for code quality
- Vitest for testing

### Testing
- Vitest for unit tests
- React Testing Library for component tests
- jest-axe for accessibility tests
- Playwright for E2E tests

### Documentation
- JSDoc for inline documentation
- Storybook for component showcase (future)
- Markdown for architecture docs

---

## Future Considerations

### Potential Enhancements
1. **Component Library Package**
   - Extract as standalone npm package
   - Version independently
   - Share across projects

2. **Design System**
   - Formal design tokens
   - Theming support
   - Brand guidelines

3. **Storybook Integration**
   - Visual component documentation
   - Interactive playground
   - Automated visual regression

4. **Automated Refactoring Tools**
   - Codemod scripts for migrations
   - Automated import updates
   - Deprecation warnings

---

## Success Metrics

### Quantitative
- Component reuse rate: >70%
- Code duplication reduction: >50%
- Test coverage: >80%
- Build time improvement: >20%

### Qualitative
- Easier onboarding for new developers
- Consistent UI/UX across application
- Faster feature development
- Improved accessibility compliance

---

## References

- [M7.1 Completion Report](../implementation/phase-2/M7.1-COMPLETION-REPORT.md)
- [Component Template](../../src/components/_template/ComponentTemplate.tsx)
- [Component Mapping](../../src/components/_template/COMPONENT_MAPPING.md)
- [Usage Guidelines](../../src/components/_template/README.md)

---

**Last Updated:** 2025-12-08
**Next Review:** M7.5 completion
**Owner:** System Architecture Team
