# Design Tokens Quick Reference

**Colombia Departments Puzzle Game**

Fast reference for all design tokens. For detailed usage, see [DESIGN_SYSTEM_GUIDE.md](./DESIGN_SYSTEM_GUIDE.md).

**Location:** `src/design-system/tokens/`

---

## 🎨 Colors

### Gray Scale
```typescript
import { colors } from '../design-system';
```

| Token | Hex | Use Case |
|-------|-----|----------|
| `gray[50]` | #fafafa | Subtle backgrounds |
| `gray[100]` | #f5f5f5 | Card backgrounds |
| `gray[200]` | #e5e5e5 | Borders |
| `gray[500]` | #737373 | Secondary text |
| `gray[700]` | #404040 | Body text |
| `gray[900]` | #171717 | Headings |

### Brand Colors (Blue)

| Token | Hex | Use Case |
|-------|-----|----------|
| `brand[500]` | #3b82f6 | Primary buttons, links |
| `brand[600]` | #2563eb | Hover states |
| `brand[700]` | #1d4ed8 | Active states |

### Semantic Colors

| Color | Default | Hover | Use Case |
|-------|---------|-------|----------|
| **Success** | `success[500]` #22c55e | `success[600]` #16a34a | Correct answers |
| **Warning** | `warning[500]` #f59e0b | `warning[600]` #d97706 | Hints used |
| **Error** | `error[500]` #ef4444 | `error[600]` #dc2626 | Incorrect answers |

### Region Colors (WCAG AAA)

| Region | Primary | Contrast Ratio | Pattern |
|--------|---------|----------------|---------|
| **Andina** | #14532D | 9.1:1 | Dots |
| **Caribe** | #1E40AF | 9.4:1 | Waves |
| **Pacífica** | #0C4A6E | 8.7:1 | Horizontal Lines |
| **Orinoquía** | #B45309 | 7.2:1 | Vertical Lines |
| **Amazonía** | #14532D | 9.1:1 | Diagonal Lines |
| **Insular** | #075985 | 8.3:1 | Circles |

**Note:** All region colors exceed WCAG AAA requirement (7:1).

### Surface Colors

| Token | Hex | Use Case |
|-------|-----|----------|
| `surface.background` | #ffffff | Page background |
| `surface.muted` | #fafafa | Secondary background |
| `surface.border` | #e5e5e5 | Borders, dividers |

### Text Colors

| Token | Hex | Contrast | Use Case |
|-------|-----|----------|----------|
| `text.primary` | #171717 | 17.3:1 | Headings, body text |
| `text.secondary` | #525252 | 9.2:1 | Secondary text |
| `text.tertiary` | #a3a3a3 | 4.5:1 | Captions (large text only) |

---

## ✍️ Typography

### Font Families
```typescript
import { typography } from '../design-system';
```

| Token | Value |
|-------|-------|
| `fontFamily.sans` | Inter, -apple-system, system fallbacks |
| `fontFamily.mono` | SF Mono, Monaco, monospace fallbacks |

### Font Sizes

| Token | Size | Line Height | Use Case |
|-------|------|-------------|----------|
| `xs` | 12px | 16px | Captions, tiny labels |
| `sm` | 14px | 20px | UI text, small body |
| `base` | 16px | 24px | Body text (default) |
| `lg` | 18px | 28px | Large body, small headings |
| `xl` | 20px | 28px | Subheadings |
| `2xl` | 24px | 32px | Headings |
| `3xl` | 30px | 36px | Large headings |
| `4xl` | 36px | 40px | Display text |
| `5xl` | 48px | 48px | Hero text |
| `6xl` | 60px | 60px | Extra large display |

### Font Weights

| Token | Value | Use Case |
|-------|-------|----------|
| `normal` | 400 | Body text |
| `medium` | 500 | UI labels, emphasized text |
| `semibold` | 600 | Subheadings |
| `bold` | 700 | Headings |

### Semantic Text Styles

Quick access to common text combinations:

```typescript
import { textStyles } from '../design-system';
```

| Style | Font Size | Weight | Use Case |
|-------|-----------|--------|----------|
| `display.large` | 48px | Bold | Hero sections |
| `display.medium` | 36px | Bold | Page titles |
| `heading.h1` | 24px | Bold | Main headings |
| `heading.h2` | 20px | Semibold | Section headings |
| `heading.h3` | 18px | Semibold | Subsections |
| `body.large` | 18px | Normal | Large body text |
| `body.medium` | 16px | Normal | Standard body |
| `body.small` | 14px | Normal | Small body |
| `ui.medium` | 14px | Medium | Buttons, badges |
| `caption` | 12px | Normal | Captions, helper text |

---

## 📏 Spacing

### Base Scale (4px Grid)

```typescript
import { spacing } from '../design-system';
```

| Token | Value | Pixels | Common Use |
|-------|-------|--------|------------|
| `spacing[0]` | 0rem | 0px | Reset |
| `spacing[1]` | 0.25rem | 4px | Tight spacing |
| `spacing[2]` | 0.5rem | 8px | Small gaps |
| `spacing[3]` | 0.75rem | 12px | Medium gaps |
| `spacing[4]` | 1rem | 16px | **Standard spacing** |
| `spacing[5]` | 1.25rem | 20px | Comfortable gaps |
| `spacing[6]` | 1.5rem | 24px | **Card padding** |
| `spacing[8]` | 2rem | 32px | Section spacing |
| `spacing[12]` | 3rem | 48px | Large sections |
| `spacing[16]` | 4rem | 64px | Page sections |
| `spacing[24]` | 6rem | 96px | Hero sections |

### Semantic Spacing

```typescript
import { spacingTokens } from '../design-system';
```

#### Component Spacing

| Token | Value | Use Case |
|-------|-------|----------|
| `component.xs` | 4px | Tight internal spacing |
| `component.sm` | 8px | Standard gaps |
| `component.md` | 12px | Comfortable spacing |
| `component.lg` | 16px | Generous spacing |
| `component.xl` | 24px | Section spacing |

#### Layout Spacing

| Token | Value | Use Case |
|-------|-------|----------|
| `layout.xs` | 16px | Compact layouts |
| `layout.sm` | 24px | Standard sections |
| `layout.md` | 32px | Comfortable sections |
| `layout.lg` | 48px | Large sections |
| `layout.xl` | 64px | Page sections |

#### Container Padding (Responsive)

| Token | Value | Use Case |
|-------|-------|----------|
| `container.mobile` | 16px | Mobile padding |
| `container.tablet` | 24px | Tablet padding |
| `container.desktop` | 32px | Desktop padding |

---

## 🎯 Component Sizes

### Button Sizes

| Size | Height (Mobile) | Height (Desktop) | Padding |
|------|----------------|------------------|---------|
| `sm` | 44px | 32px | 12px × 6px |
| `md` | 44px | 40px | 16px × 8px |
| `lg` | 44px | 48px | 24px × 10px |

**Icon-only buttons:** Always 44×44px on mobile

### Touch Targets

**WCAG 2.5.5 AAA Minimum:**

| Device | Minimum Size | Our Standard |
|--------|-------------|--------------|
| **Mobile** | 44×44px | 44×44px ✅ |
| **Tablet** | 44×44px | 44×44px ✅ |
| **Desktop** | None | 32×32px ✅ |

**Spacing between targets:** Minimum 16px on mobile

---

## 🎨 Shadows & Effects

### Shadow Scale

| Class | Blur | Vertical | Use Case |
|-------|------|----------|----------|
| `shadow-sm` | 2px | 1px | Cards, chips |
| `shadow` | 4px | 2px | Hover states |
| `shadow-md` | 6px | 4px | Dropdowns |
| `shadow-lg` | 10px | 8px | Modals |
| `shadow-xl` | 16px | 12px | Overlays |

### Border Radius

| Class | Value | Use Case |
|-------|-------|----------|
| `rounded-lg` | 8px | Buttons, badges |
| `rounded-xl` | 12px | Cards, inputs |
| `rounded-2xl` | 16px | Modals, panels |
| `rounded-full` | 9999px | Icon buttons, avatars |

---

## 🚀 Quick Usage Guide

### Import Tokens

```typescript
// All tokens
import { colors, typography, spacing, textStyles, spacingTokens } from '../design-system';

// Specific tokens
import { colors } from '../design-system/tokens/colors';
import { spacing } from '../design-system/tokens/spacing';
```

### Apply to Components

**Using Tailwind (Recommended):**
```tsx
<div className="bg-white text-gray-900 p-6 rounded-xl shadow-sm">
  Content
</div>
```

**Using Inline Styles (Dynamic Values):**
```tsx
<div
  style={{
    backgroundColor: colors.surface.background,
    color: colors.text.primary,
    padding: spacing[6],
    borderRadius: '12px',
  }}
>
  Content
</div>
```

**Using Design System Components (Best):**
```tsx
import { Card, CardContent } from '../design-system';

<Card padding="md">
  <CardContent>Content</CardContent>
</Card>
```

---

## 📐 Layout Grid

### Container Widths

| Breakpoint | Max Width | Padding |
|------------|-----------|---------|
| Mobile (<768px) | 100% | 16px |
| Tablet (768-1023px) | 100% | 24px |
| Desktop (≥1024px) | 1280px | 32px |

### Spacing Guidelines

**Between Components:**
- Related items: 8px (`gap-2`)
- Component groups: 16px (`gap-4`)
- Sections: 32px (`gap-8`)
- Page sections: 64px (`gap-16`)

**Component Internal:**
- Tight: 4px (`p-1`)
- Standard: 16px (`p-4`)
- Comfortable: 24px (`p-6`)
- Spacious: 32px (`p-8`)

---

## 🎯 Colombia-Specific Tokens

### National Colors

```typescript
import { colors } from '../design-system';

colors.colombia.yellow  // #fcd116 - Colombian flag
colors.colombia.blue    // #003893 - Colombian flag
colors.colombia.red     // #ce1126 - Colombian flag
```

**Usage:** Header branding, national elements (sparingly)

### Region Color Palette

Available in `src/constants/accessibleColorsFixed.ts` (being consolidated):

```typescript
// Future: Will be in design-system/themes/regions.ts
const regionColors = {
  'Andina': { primary: '#14532D', icon: '⛰️' },
  'Caribe': { primary: '#1E40AF', icon: '🏖️' },
  'Pacífica': { primary: '#0C4A6E', icon: '🌊' },
  'Orinoquía': { primary: '#B45309', icon: '🌾' },
  'Amazonía': { primary: '#14532D', icon: '🌳' },
  'Insular': { primary: '#075985', icon: '🏝️' },
};
```

---

## 🔗 Related Resources

**Documentation:**
- [DESIGN_SYSTEM_GUIDE.md](./DESIGN_SYSTEM_GUIDE.md) - Complete guide
- [STYLE_GUIDE.md](./STYLE_GUIDE.md) - Code style standards
- [DESIGN_SYSTEM_MIGRATION_PLAN.md](./DESIGN_SYSTEM_MIGRATION_PLAN.md) - Migration status
- [design-system/consolidation-plan.md](./design-system/consolidation-plan.md) - Consolidation strategy

**Source Code:**
- `src/design-system/tokens/colors.ts` - Color definitions
- `src/design-system/tokens/typography.ts` - Typography scale
- `src/design-system/tokens/spacing.ts` - Spacing scale
- `src/design-system/components/` - Component implementations

**Accessibility:**
- [ACCESSIBILITY_GUIDE.md](./ACCESSIBILITY_GUIDE.md) - WCAG compliance
- [color-accessibility-audit-report.md](./color-accessibility-audit-report.md) - Contrast validation

---

## 📊 Token Coverage

| Category | Tokens | Status | File |
|----------|--------|--------|------|
| **Colors** | 100+ | ✅ Complete | colors.ts |
| **Typography** | 50+ | ✅ Complete | typography.ts |
| **Spacing** | 80+ | ✅ Complete | spacing.ts |
| **Shadows** | 0 | ⏳ Pending | shadows.ts (to be created) |
| **Radius** | 0 | ⏳ Pending | radius.ts (to be created) |
| **Animations** | 0 | ⏳ Pending | animations.ts (to be created) |

---

## 🚀 Getting Started

### 1. Import Tokens

```typescript
import { colors, spacing, typography } from '../design-system';
```

### 2. Use in Components

**Tailwind (Recommended):**
```tsx
<div className="text-gray-900 bg-white p-6 rounded-xl">
  Content
</div>
```

**Inline Styles (Dynamic):**
```tsx
<div
  style={{
    color: colors.text.primary,
    padding: spacing[6],
  }}
>
  Content
</div>
```

### 3. Reference This Guide

Bookmark this page for quick token lookups during development.

---

**Last Updated:** 2025-10-08
**Maintained By:** Design System Team
**Print-Friendly:** Yes (use browser print for quick reference)
