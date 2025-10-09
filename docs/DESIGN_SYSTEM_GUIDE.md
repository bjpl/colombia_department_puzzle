# Design System Guide

**Colombia Departments Puzzle Game**

Complete guide to using the modern design system inspired by Linear/Vercel aesthetics.

**Last Updated:** 2025-10-08
**Version:** 1.0.0
**Status:** Production (Partially Migrated)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Design Principles](#design-principles)
3. [Design Tokens](#design-tokens)
4. [Components](#components)
5. [Usage Examples](#usage-examples)
6. [Migration Status](#migration-status)
7. [Best Practices](#best-practices)

---

## 🎯 Overview

The Colombia Puzzle Game uses a modern, clean design system with:

- **🎨 Unified color palette** with WCAG AAA compliance (7:1 contrast ratios)
- **📏 4px grid-based spacing** system
- **✍️ Modern typography** with Inter font family
- **🎭 Semantic component library** (Button, Card, Modal, etc.)
- **♿ Accessibility-first** design patterns
- **📱 Mobile-optimized** with 44px touch targets

**Location:** `src/design-system/`

**Exports:** All tokens and components available via single import:
```typescript
import { Button, Card, Badge, colors, spacing, typography } from '../design-system';
```

---

## 🎨 Design Principles

### 1. Simplicity
- Clean, uncluttered interfaces
- Remove unnecessary visual complexity
- Focus on content over decoration

### 2. Consistency
- Unified spacing, colors, and typography
- Predictable component behavior
- Reusable patterns across features

### 3. Accessibility
- WCAG AAA compliant (7:1 contrast)
- 44px minimum touch targets
- Full keyboard navigation
- Screen reader support

### 4. Performance
- Lightweight components (<10KB each)
- GPU-accelerated animations
- Minimal re-renders with React.memo

### 5. Cultural Sensitivity
- Preserve Colombia national colors (yellow, blue, red)
- Region-specific color schemes
- Educational value maintained

---

## 🧩 Design Tokens

Design tokens are the atomic building blocks of the design system. They ensure consistency across all components.

### Colors

**Location:** `src/design-system/tokens/colors.ts`

#### Neutral Grays
```typescript
import { colors } from '../design-system';

colors.gray[50]   // #fafafa - Lightest
colors.gray[100]  // #f5f5f5
colors.gray[200]  // #e5e5e5
colors.gray[500]  // #737373 - Mid
colors.gray[900]  // #171717 - Darkest
```

**Usage:** Backgrounds, borders, text

#### Brand Colors (Blue)
```typescript
colors.brand[500]  // #3b82f6 - Primary blue
colors.brand[600]  // #2563eb - Hover state
colors.brand[700]  // #1d4ed8 - Active state
```

**Usage:** Primary buttons, links, focus rings

#### Semantic Colors
```typescript
// Success (Green)
colors.success[500]  // #22c55e
colors.success[600]  // #16a34a
colors.success[700]  // #15803d

// Warning (Amber)
colors.warning[500]  // #f59e0b
colors.warning[600]  // #d97706

// Error (Red)
colors.error[500]  // #ef4444
colors.error[600]  // #dc2626
```

**Usage:** Feedback messages, status indicators

#### Surface & Interactive Colors
```typescript
// Surfaces
colors.surface.background  // #ffffff
colors.surface.muted      // #fafafa
colors.surface.border     // #e5e5e5

// Interactive states
colors.interactive.primary       // #3b82f6
colors.interactive.primaryHover  // #2563eb
colors.interactive.primaryActive // #1d4ed8
```

#### Colombia Cultural Colors
```typescript
colors.colombia.yellow  // #fcd116
colors.colombia.blue    // #003893
colors.colombia.red     // #ce1126
```

**Usage:** Header, branding elements

### Typography

**Location:** `src/design-system/tokens/typography.ts`

#### Font Family
```typescript
import { typography } from '../design-system';

typography.fontFamily.sans  // Inter, system fallbacks
typography.fontFamily.mono  // SF Mono, monospace fallbacks
```

#### Font Sizes
```typescript
typography.fontSize.xs    // 12px (captions, labels)
typography.fontSize.sm    // 14px (UI text)
typography.fontSize.base  // 16px (body text)
typography.fontSize.lg    // 18px (large body)
typography.fontSize.xl    // 20px (small headings)
typography.fontSize['2xl'] // 24px (headings)
typography.fontSize['3xl'] // 30px (large headings)
typography.fontSize['4xl'] // 36px (display)
```

#### Semantic Text Styles
```typescript
import { textStyles } from '../design-system';

// Display (hero text)
textStyles.display.large   // 48px, bold, tight
textStyles.display.medium  // 36px, bold, tight
textStyles.display.small   // 30px, semibold

// Headings
textStyles.heading.h1  // 24px, bold
textStyles.heading.h2  // 20px, semibold
textStyles.heading.h3  // 18px, semibold
textStyles.heading.h4  // 16px, semibold

// Body
textStyles.body.large   // 18px, normal, relaxed
textStyles.body.medium  // 16px, normal
textStyles.body.small   // 14px, normal

// UI (buttons, badges)
textStyles.ui.large   // 16px, medium
textStyles.ui.medium  // 14px, medium
textStyles.ui.small   // 12px, medium
```

### Spacing

**Location:** `src/design-system/tokens/spacing.ts`

#### Base Scale (4px grid)
```typescript
import { spacing } from '../design-system';

spacing[0]    // 0px
spacing[1]    // 4px
spacing[2]    // 8px
spacing[3]    // 12px
spacing[4]    // 16px
spacing[6]    // 24px
spacing[8]    // 32px
spacing[12]   // 48px
spacing[16]   // 64px
spacing[24]   // 96px
```

#### Semantic Spacing
```typescript
import { spacingTokens } from '../design-system';

// Component spacing
spacingTokens.component.xs  // 4px
spacingTokens.component.sm  // 8px
spacingTokens.component.md  // 12px
spacingTokens.component.lg  // 16px

// Layout spacing
spacingTokens.layout.sm   // 24px
spacingTokens.layout.md   // 32px
spacingTokens.layout.lg   // 48px

// Container padding (responsive)
spacingTokens.container.mobile   // 16px
spacingTokens.container.tablet   // 24px
spacingTokens.container.desktop  // 32px

// Button spacing
spacingTokens.button.padding.md  // { x: 16px, y: 8px }
spacingTokens.button.gap.md      // 8px

// Card spacing
spacingTokens.card.padding.md  // 24px
spacingTokens.card.gap         // 16px
```

---

## 🧱 Components

### Button

**Location:** `src/design-system/components/Button.tsx`

Versatile button component with full accessibility and touch optimization.

#### API Reference

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  touchFeedback?: boolean;
  feedbackType?: FeedbackType;
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}
```

#### Usage Examples

**Basic Button:**
```tsx
import { Button } from '../design-system';

<Button variant="primary">
  Click Me
</Button>
```

**Button with Icon:**
```tsx
import { Button } from '../design-system';
import { Play } from 'lucide-react';

<Button variant="primary" icon={<Play />} iconPosition="left">
  Start Game
</Button>
```

**Loading State:**
```tsx
<Button variant="primary" loading={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

**Icon-Only Button (44×44px touch target):**
```tsx
import { X } from 'lucide-react';

<Button
  variant="ghost"
  size="md"
  icon={<X />}
  aria-label="Close"
/>
```

#### Variants

| Variant | Use Case | Example |
|---------|----------|---------|
| `primary` | Main actions | Start Game, Submit |
| `secondary` | Secondary actions | Cancel, Back |
| `ghost` | Tertiary actions | Close, Dismiss |
| `danger` | Destructive actions | Delete, Reset |

#### Sizes

| Size | Height (Mobile) | Height (Desktop) | Use Case |
|------|----------------|------------------|----------|
| `sm` | 44px | 32px | Compact interfaces |
| `md` | 44px | 40px | Standard actions |
| `lg` | 44px | 48px | Primary CTAs |

**Note:** Mobile enforces 44px minimum for WCAG 2.5.5 AAA compliance.

---

### Card

**Location:** `src/design-system/components/Card.tsx`

Composable card component for content containers.

#### API Reference

```typescript
interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
  children: React.ReactNode;
}
```

#### Sub-Components

- `Card` - Container
- `CardHeader` - Header section
- `CardTitle` - Title text
- `CardDescription` - Subtitle text
- `CardContent` - Main content
- `CardFooter` - Footer section

#### Usage Examples

**Basic Card:**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '../design-system';

<Card variant="default" padding="md">
  <CardHeader>
    <CardTitle>Department Information</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Antioquia is located in the Andina region...</p>
  </CardContent>
</Card>
```

**Elevated Card with Hover:**
```tsx
<Card variant="elevated" padding="lg" hover>
  <CardHeader>
    <CardTitle>Study Mode</CardTitle>
    <CardDescription>Learn at your own pace</CardDescription>
  </CardHeader>
  <CardContent>
    Explore all 33 departments without time pressure.
  </CardContent>
</Card>
```

---

### Badge

**Location:** `src/design-system/components/Badge.tsx`

Status indicators and labels.

#### Usage Examples

```tsx
import { Badge } from '../design-system';

// Status badge
<Badge variant="success">Correct</Badge>
<Badge variant="error">Incorrect</Badge>
<Badge variant="warning">Hint Used</Badge>

// Informational badge
<Badge variant="default">Andina Region</Badge>
<Badge variant="outline">15/33 Placed</Badge>
```

---

### Modal

**Location:** `src/design-system/components/Modal.tsx`

Accessible modal dialogs with backdrop and focus management.

#### Usage Examples

```tsx
import { Modal } from '../design-system';

<Modal
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Game Complete!"
  description="You've placed all 33 departments"
  size="md"
>
  <div className="space-y-4">
    <p>Your score: {score} points</p>
    <Button onClick={() => setIsOpen(false)}>
      Close
    </Button>
  </div>
</Modal>
```

#### Sizes

| Size | Width | Use Case |
|------|-------|----------|
| `sm` | 400px | Confirmations |
| `md` | 600px | Standard dialogs |
| `lg` | 800px | Rich content |

---

### Input

**Location:** `src/design-system/components/Input.tsx`

Form input with error states and icons.

#### Usage Examples

```tsx
import { Input } from '../design-system';
import { Search } from 'lucide-react';

<Input
  type="text"
  placeholder="Search departments..."
  icon={<Search />}
  error={errors.search}
  fullWidth
/>
```

---

### Progress

**Location:** `src/design-system/components/Progress.tsx`

Progress bars with labels and animations.

#### Usage Examples

```tsx
import { Progress } from '../design-system';

<Progress
  value={placedCount}
  max={33}
  label="Departments Placed"
  variant="success"
  size="md"
/>
```

---

## 🎯 Usage Examples

### Typical Component Patterns

#### Game Header
```tsx
import { Button, Badge, Progress } from '../design-system';
import { Play, Pause, RotateCcw } from 'lucide-react';

function GameHeader() {
  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Colombia Puzzle</h1>
        <Badge variant="default">Complete Colombia</Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" icon={<RotateCcw />} aria-label="Reset" />
        <Button variant="primary" icon={<Play />}>
          Start
        </Button>
      </div>
    </header>
  );
}
```

#### Study Mode Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../design-system';

function DepartmentCard({ department }) {
  return (
    <Card variant="elevated" padding="md" hover>
      <CardHeader>
        <CardTitle>{department.name}</CardTitle>
        <CardDescription>Capital: {department.capital}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          {department.educationalFacts[0]}
        </p>
      </CardContent>
    </Card>
  );
}
```

#### Modal Dialog
```tsx
import { Modal, Button } from '../design-system';
import { Trophy } from 'lucide-react';

function CompletionModal({ score, onClose }) {
  return (
    <Modal
      open={true}
      onOpenChange={onClose}
      title="Game Complete!"
      description="Congratulations on finishing the puzzle"
      size="md"
    >
      <div className="space-y-4 text-center">
        <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
        <p className="text-3xl font-bold">{score} Points</p>
        <Button variant="primary" fullWidth onClick={onClose}>
          Play Again
        </Button>
      </div>
    </Modal>
  );
}
```

---

## 📊 Migration Status

### ✅ Complete (Phase 1-2)

**Foundation:**
- ✅ Color tokens defined (colors.ts)
- ✅ Typography scale (typography.ts)
- ✅ Spacing system (spacing.ts)
- ✅ 7 core components created

**Components Migrated:**
- ✅ GameHeader.tsx - Completely modernized
- ✅ TouchFeedback integrated in Button

### 🔄 In Progress (Phase 3-4)

**High Priority:**
- 🔄 HintModal.tsx - Update to use Modal component
- 🔄 GameModeSelector.tsx - Standardize with Card
- 🔄 AccessibilitySettings.tsx - Modernize with Modal + Button

**Medium Priority:**
- 🔄 DepartmentTray.tsx - Use Card for container
- 🔄 PlacementFeedback.tsx - Use Badge for status
- 🔄 PostGameReport.tsx - Use Card + Progress
- 🔄 StudyMode.tsx - Clean layout with Cards

### 📋 Pending (Phase 5)

**Low Priority:**
- ⏳ EducationalPanel.tsx
- ⏳ KeyboardHelp.tsx
- ⏳ NextChallengeRecommender.tsx

**Status:** ~30% migrated (GameHeader complete, 11 components remaining)

---

## 🎯 Best Practices

### Do's ✅

**1. Use Design System Components:**
```tsx
// ✅ GOOD
import { Button } from '../design-system';
<Button variant="primary">Start</Button>

// ❌ BAD
<button className="bg-blue-500 text-white px-4 py-2 rounded">Start</button>
```

**2. Use Semantic Tokens:**
```tsx
// ✅ GOOD
import { colors, spacing } from '../design-system';
<div style={{ color: colors.text.primary, padding: spacing[4] }}>

// ❌ BAD
<div style={{ color: '#171717', padding: '16px' }}>
```

**3. Use Consistent Touch Targets:**
```tsx
// ✅ GOOD - 44px minimum on mobile
<Button size="md" icon={<X />} />  // Enforces 44px

// ❌ BAD - Too small for touch
<button className="w-8 h-8">  // 32px - fails WCAG
```

**4. Maintain Spacing Consistency:**
```tsx
// ✅ GOOD - 4px grid
<div className="gap-4 p-6">  // 16px gap, 24px padding

// ❌ BAD - Arbitrary values
<div className="gap-3.5 p-5.5">  // Off-grid
```

### Don'ts ❌

**1. Don't Mix Old and New Systems:**
```tsx
// ❌ WRONG - Mixing constants/designSystem with design-system
import { colors } from '../constants/designSystem';
import { Button } from '../design-system';

// ✅ CORRECT - Use design-system only
import { colors, Button } from '../design-system';
```

**2. Don't Use Hardcoded Colors:**
```tsx
// ❌ WRONG
<div className="bg-[#3b82f6]">

// ✅ CORRECT
import { colors } from '../design-system';
<div style={{ backgroundColor: colors.brand[500] }}>
// OR
<div className="bg-sky-500">  // Tailwind equivalent
```

**3. Don't Skip Accessibility:**
```tsx
// ❌ WRONG - No ARIA label
<Button icon={<X />} />

// ✅ CORRECT - Descriptive label
<Button icon={<X />} aria-label="Close dialog" />
```

**4. Don't Ignore Mobile Touch Targets:**
```tsx
// ❌ WRONG - Too small for touch
<button className="h-8 w-8">

// ✅ CORRECT - Mobile-first sizing
<Button size="md" icon={<Icon />} />  // 44px on mobile, 40px desktop
```

---

## 🚀 Getting Started

### 1. Import Design System

```tsx
// Single import for all design system features
import {
  // Components
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Modal,
  Input,
  Progress,

  // Tokens
  colors,
  typography,
  spacing,
  textStyles,
  spacingTokens,

  // Utils
  cn,
  classNames,
} from '../design-system';
```

### 2. Use Components

```tsx
function MyComponent() {
  return (
    <Card padding="md">
      <CardHeader>
        <CardTitle>My Feature</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="primary" icon={<Play />}>
          Start
        </Button>
      </CardContent>
    </Card>
  );
}
```

### 3. Apply Design Tokens

```tsx
// In custom components
function CustomComponent() {
  return (
    <div
      style={{
        color: colors.text.primary,
        backgroundColor: colors.surface.background,
        padding: spacing[6],
        borderRadius: '12px',
      }}
    >
      Content
    </div>
  );
}
```

---

## 📚 Related Documentation

- [DESIGN_SYSTEM_MIGRATION_PLAN.md](./DESIGN_SYSTEM_MIGRATION_PLAN.md) - Migration tracking
- [design-system/consolidation-plan.md](./design-system/consolidation-plan.md) - Consolidation strategy
- [ACCESSIBILITY_GUIDE.md](./ACCESSIBILITY_GUIDE.md) - WCAG compliance
- [MOBILE_DEVELOPMENT_GUIDE.md](./MOBILE_DEVELOPMENT_GUIDE.md) - Touch targets

---

## 🔧 Customization

### Extending Components

```tsx
// Wrap design system components for custom behavior
import { Button as DSButton } from '../design-system';

export function GameButton({ trackClick, ...props }) {
  const handleClick = () => {
    trackClick?.();  // Analytics
    props.onClick?.();
  };

  return <DSButton {...props} onClick={handleClick} />;
}
```

### Custom Variants

```tsx
// Add custom button variant
import { Button } from '../design-system';
import { cn } from '../design-system';

<Button
  variant="secondary"
  className={cn(
    'bg-gradient-to-r from-yellow-400 to-amber-500',
    'text-gray-900 font-bold'
  )}
>
  Colombia Special
</Button>
```

---

## ⚠️ Known Issues & Limitations

### 1. Partial Migration
- Only GameHeader fully migrated
- 11 components still use old system
- See DESIGN_SYSTEM_MIGRATION_PLAN.md for status

### 2. Color System Fragmentation
- Old constants still in use by some components
- `src/constants/accessibleColors.ts` etc. to be deprecated
- See consolidation-plan.md for unification strategy

### 3. Missing Token Files
- shadows.ts - Not yet created
- radius.ts - Not yet created
- animations.ts - Not yet created

---

## 🔮 Future Enhancements

1. **Complete Migration** - Migrate all 11 remaining components
2. **Token Completion** - Create shadows, radius, animations tokens
3. **Dark Mode** - Add dark theme support
4. **Storybook** - Visual component gallery
5. **Theme Variants** - Additional Colombia-themed styles
6. **Animation Library** - Reusable motion components

---

## 📞 Support

**Questions about the design system?**
- Review [DESIGN_SYSTEM_MIGRATION_PLAN.md](./DESIGN_SYSTEM_MIGRATION_PLAN.md)
- Check [design-system/consolidation-plan.md](./design-system/consolidation-plan.md)
- Open an issue: [GitHub Issues](https://github.com/bjpl/colombia_department_puzzle/issues)

---

**Maintained By:** Design System Team
**Next Review:** After component migration completion
**Status:** Active Development (30% complete)
