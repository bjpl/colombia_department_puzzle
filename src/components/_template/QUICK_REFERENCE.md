# Component Library Quick Reference

Fast lookup guide for component organization and usage.

---

## 📁 Directory Quick Map

```
components/
├── ui/         → Buttons, inputs, icons, badges
├── layout/     → Headers, containers, grids
├── game/       → Maps, pieces, game modes
├── feedback/   → Toasts, announcements, reports
├── modals/     → Dialogs, sheets, help screens
├── auth/       → Login, signup, protected routes
└── study/      → Study mode features
```

---

## 🎯 Component Category Decision Tree

**Is it reusable across the app?**
- Yes → **UI Component** (`/ui`)
- No → Continue...

**Is it about page structure?**
- Yes → **Layout Component** (`/layout`)
- No → Continue...

**Is it game-specific functionality?**
- Yes → **Game Component** (`/game`)
- No → Continue...

**Is it a notification or status?**
- Yes → **Feedback Component** (`/feedback`)
- No → Continue...

**Is it an overlay/dialog?**
- Yes → **Modal Component** (`/modals`)
- No → Continue...

**Is it auth-related?**
- Yes → **Auth Component** (`/auth`)
- No → **Study Component** (`/study`)

---

## 📦 Import Patterns

```typescript
// UI primitives
import { Button, Spinner, Badge } from '@/components/ui';

// Layout components
import { GameHeader, BottomSheet } from '@/components/layout';

// Game components
import { ColombiaMap, StudyMode } from '@/components/game';

// Feedback components
import { Toast, ScreenReaderAnnouncements } from '@/components/feedback';

// Modal components
import { HintModal, KeyboardHelp } from '@/components/modals';

// Auth components
import { AuthButton, ProtectedRoute } from '@/components/auth';
```

---

## ✅ Component Checklist

When creating a new component:

- [ ] Follow `ComponentTemplate.tsx` pattern
- [ ] TypeScript interface with JSDoc
- [ ] Use `memo` if appropriate
- [ ] Use `forwardRef` if DOM access needed
- [ ] Add `displayName`
- [ ] Include `aria-label` for interactive elements
- [ ] Add `data-testid` for testing
- [ ] Write unit tests
- [ ] Write accessibility tests
- [ ] Add to category `index.ts`
- [ ] Document in JSDoc

---

## 🚀 Quick Start: Creating a New Component

### 1. Choose Category
Refer to decision tree above

### 2. Create File
```bash
# Example: Creating a new UI button
touch src/components/ui/ActionButton.tsx
```

### 3. Use Template Pattern
```typescript
import { forwardRef, memo, type ReactNode } from 'react';

export interface ActionButtonProps {
  /** Button label */
  children: ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Visual variant */
  variant?: 'primary' | 'secondary';
  /** Accessible label */
  'aria-label'?: string;
}

export const ActionButton = memo(
  forwardRef<HTMLButtonElement, ActionButtonProps>(
    ({ children, onClick, variant = 'primary', ...props }, ref) => {
      return (
        <button
          ref={ref}
          onClick={onClick}
          className={`btn-${variant}`}
          {...props}
        >
          {children}
        </button>
      );
    }
  )
);

ActionButton.displayName = 'ActionButton';
```

### 4. Add Tests
```typescript
// ActionButton.test.tsx
import { render, screen } from '@testing-library/react';
import { ActionButton } from './ActionButton';

describe('ActionButton', () => {
  it('renders children', () => {
    render(<ActionButton>Click me</ActionButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### 5. Export from Category
```typescript
// ui/index.ts
export { ActionButton } from './ActionButton';
```

---

## 🎨 Common Patterns

### Pattern 1: Polymorphic Component
Component that can render as different elements

```typescript
type AsComponent = 'button' | 'a' | 'div';

interface PolymorphicProps {
  as?: AsComponent;
  children: ReactNode;
}

export const Polymorphic = <C extends AsComponent = 'div'>({
  as,
  children,
  ...props
}: PolymorphicProps & React.ComponentPropsWithoutRef<C>) => {
  const Component = as || 'div';
  return <Component {...props}>{children}</Component>;
};
```

### Pattern 2: Controlled Component
Component with external state control

```typescript
interface ControlledInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const ControlledInput = ({ value, onChange }: ControlledInputProps) => {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
```

### Pattern 3: Compound Component
Components that work together

```typescript
interface TabsProps { children: ReactNode; }
interface TabProps { label: string; children: ReactNode; }

const Tabs = ({ children }: TabsProps) => {
  const [active, setActive] = useState(0);
  return <div>{children}</div>;
};

const Tab = ({ label, children }: TabProps) => {
  return <div>{children}</div>;
};

Tabs.Tab = Tab;

// Usage: <Tabs><Tabs.Tab label="One">Content</Tabs.Tab></Tabs>
```

---

## 🔍 Finding Existing Components

### By Purpose
- **Buttons**: `ui/Button`, `ui/ActionButton`, `auth/AuthButton`
- **Containers**: `layout/GameContainer`, `layout/MobileLayout`
- **Headers**: `layout/GameHeader`, `layout/MobileHeader`
- **Maps**: `game/ColombiaMap`, `game/MapCanvas`
- **Modals**: `modals/HintModal`, `modals/KeyboardHelp`
- **Feedback**: `feedback/Toast`, `feedback/ScreenReaderAnnouncements`

### By Feature
- **Accessibility**: `ui/ScreenReaderAnnouncements`, `ui/KeyboardIndicator`
- **Touch**: `ui/TouchFeedback`, `game/TouchAdapter`
- **Study Mode**: `game/StudyMode`, `game/StudyModeMap`
- **Authentication**: `auth/*`

---

## 📊 Migration Status

Track migration progress here (update as M7.2-M7.10 progresses):

### UI Components
- [ ] TouchFeedback
- [ ] ScrollIndicator
- [ ] KeyboardIndicator
- [ ] DepartmentIcon
- [ ] InstallButton
- [ ] UpdateBanner
- [ ] AccessibilityMenu

### Layout Components
- [ ] GameContainer
- [ ] GameHeader
- [ ] MobileLayout
- [ ] BottomSheet
- [ ] DepartmentTray
- [ ] EducationalPanel
- [ ] HintsPanel

### Game Components
- [ ] ColombiaMap
- [ ] MapCanvas
- [ ] DragOverlay
- [ ] KeyboardCursor
- [ ] TouchAdapter
- [ ] StudyMode
- [ ] StudyModeMap
- [ ] ModeSelector

### Feedback Components
- [ ] ScreenReaderAnnouncements
- [ ] OfflineIndicator
- [ ] StudyModeLoading
- [ ] ModeTransition
- [ ] PostGameReport
- [ ] NextChallengeRecommender

### Modal Components
- [ ] HintModal
- [ ] KeyboardHelp
- [ ] InteractiveTutorial

---

## 🆘 Troubleshooting

**Problem:** Import not working
- Check barrel export in `index.ts`
- Verify category is correct
- Check `tsconfig.json` paths

**Problem:** TypeScript errors
- Ensure props interface is exported
- Check ref types match element type
- Verify generic types are correct

**Problem:** Component not rendering
- Check displayName is set
- Verify all required props passed
- Check for console errors

**Problem:** Accessibility issues
- Add aria-label for interactive elements
- Use semantic HTML
- Test with keyboard navigation
- Run jest-axe tests

---

## 📚 Additional Resources

- [Full Architecture Doc](../../../docs/architecture/COMPONENT_LIBRARY_ARCHITECTURE.md)
- [Component Template](./ComponentTemplate.tsx)
- [Component Mapping](./COMPONENT_MAPPING.md)
- [Detailed Guidelines](./README.md)

---

**Last Updated:** 2025-12-08
