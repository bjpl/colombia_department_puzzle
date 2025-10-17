# Design System Consolidation Plan

## Executive Summary

This document outlines a comprehensive strategy to consolidate multiple overlapping design system files into a single, unified, and maintainable design system for the Colombia Puzzle Game.

### Current State Analysis

**Files Analyzed:**
- `/src/constants/designSystem.ts` (342 lines)
- `/src/constants/accessibleColors.ts` (301 lines)
- `/src/constants/modernAccessibleColors.ts` (309 lines)
- `/src/constants/regionColors.ts` (100 lines)
- `/src/constants/accessibleColorsFixed.ts` (275 lines)
- `/src/design-system/tokens/colors.ts` (117 lines)
- `/src/design-system/tokens/spacing.ts` (105 lines)
- `/src/design-system/tokens/typography.ts` (162 lines)
- `/src/design-system/tokens/index.ts` (16 lines)
- `/src/design-system/index.ts` (13 lines)

**Total Lines of Code:** 1,740 lines

**Components Using Design System:** 12+ files

---

## Problem Statement

### 1. Color System Fragmentation

**CRITICAL ISSUE:** Multiple conflicting color definitions:

#### Region Colors (6 regions, 5 different definitions):
- **designSystem.ts**: Modern Tailwind colors (brand.500, gray.x)
- **accessibleColors.ts**: WCAG AAA compliant (#0D5F3A, #0056B3, etc.)
- **modernAccessibleColors.ts**: Vibrant Tailwind palette (#059669, #0EA5E9, etc.)
- **regionColors.ts**: Imports from accessibleColorsFixed
- **accessibleColorsFixed.ts**: Darker WCAG AAA colors (#14532D, #1E40AF, etc.)
- **design-system/tokens/colors.ts**: Generic brand colors

#### UI State Colors (4 different definitions):
- Success: 4 different green shades (#047857, #10B981, #22C55E, #16A34A)
- Error: 4 different red shades (#B91C1C, #EF4444, #DC2626, #991B1B)
- Warning: 4 different orange/amber shades
- Info: 4 different blue shades

### 2. Spacing Token Duplication

**Two spacing systems:**
- `designSystem.ts`: 0-24 scale (13 tokens)
- `design-system/tokens/spacing.ts`: 0-96 scale (43 tokens) with semantic tokens

**Impact:** Inconsistent component spacing

### 3. Typography Redundancy

**Two typography systems:**
- `designSystem.ts`: Basic font scale (xs-4xl, 8 sizes)
- `design-system/tokens/typography.ts`: Extended scale (xs-6xl, 10 sizes) with semantic styles

**Impact:** Inconsistent text rendering

### 4. Missing Shadow System Coordination

**Shadow definitions:**
- `designSystem.ts`: Comprehensive shadow system (12 variants)
- `design-system/tokens/shadows.ts`: Missing file (referenced but not found)
- `modernAccessibleColors.ts`: MODERN_SHADOWS constant

### 5. Component Dependencies

**Files importing from constants/:**
```
components/AccessibilitySettings.tsx
components/StudyMode.tsx
components/DepartmentTray.tsx
components/HintModal.tsx
context/AccessibilityContext.tsx
tests/validateAccessibility.ts
```

**Files importing from design-system/:**
```
components/StudyMode.tsx
components/MiniDepartmentShape.tsx
components/ScreenReaderAnnouncements.tsx
components/ModernGameHeader.tsx
components/MapCanvas.tsx
components/GameHeader.tsx
```

**Overlap:** StudyMode.tsx imports from BOTH systems

---

## Proposed Unified Structure

### New File Organization

```
src/design-system/
├── index.ts                          # Main export
├── tokens/
│   ├── index.ts                      # Token exports
│   ├── colors.ts                     # CONSOLIDATED color system
│   ├── spacing.ts                    # KEEP (already good)
│   ├── typography.ts                 # KEEP (already good)
│   ├── shadows.ts                    # CREATE (merge from designSystem.ts)
│   ├── radius.ts                     # CREATE (merge from designSystem.ts)
│   └── animations.ts                 # CREATE (merge from designSystem.ts)
├── themes/
│   ├── index.ts                      # Theme exports
│   ├── accessibility.ts              # Colorblind & high-contrast modes
│   └── regions.ts                    # Colombia region-specific colors
├── components/                       # KEEP existing components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── ...
└── utils/
    ├── cn.ts                         # KEEP
    ├── a11y.ts                       # CREATE (accessibility utilities)
    └── color-contrast.ts             # CREATE (WCAG validation)

DEPRECATED (to be removed):
src/constants/
├── designSystem.ts                   # DELETE after migration
├── accessibleColors.ts               # DELETE after migration
├── modernAccessibleColors.ts         # DELETE after migration
├── regionColors.ts                   # DELETE after migration
└── accessibleColorsFixed.ts          # DELETE after migration
```

---

## Consolidation Strategy

### Phase 1: Create Unified Color System

**File:** `/src/design-system/tokens/colors.ts`

```typescript
/**
 * Unified Color System - Colombia Puzzle Game
 * WCAG AAA compliant (7:1 contrast ratio)
 * Supports colorblind modes and high-contrast themes
 */

// Base semantic colors (from design-system/tokens/colors.ts)
export const colors = {
  // Neutral grays
  gray: { 50: '#fafafa', ..., 950: '#0a0a0a' },

  // Brand colors
  brand: { 50: '#eff6ff', ..., 900: '#1e3a8a' },

  // Semantic colors (WCAG AAA compliant)
  success: { 50: '#f0fdf4', ..., 900: '#14532d' },
  warning: { 50: '#fffbeb', ..., 900: '#78350f' },
  error: { 50: '#fef2f2', ..., 900: '#7f1d1d' },

  // Surface & interactive (from designSystem.ts)
  surface: { background: '#ffffff', ... },
  interactive: { primary: '#3b82f6', ... }
};

// Colombia region colors (WCAG AAA, from accessibleColorsFixed.ts)
export const regionColors = {
  'Andina': {
    primary: '#14532D',      // 9.1:1 contrast
    secondary: '#15803D',
    gradient: 'linear-gradient(...)',
    icon: '⛰️',
    pattern: 'dots'
  },
  // ... 5 more regions
};

// Colorblind-safe palettes (from accessibleColorsFixed.ts)
export const colorblindPalettes = {
  normal: { 'Andina': '#14532D', ... },
  protanopia: { ... },
  deuteranopia: { ... },
  tritanopia: { ... },
  monochrome: { ... }
};
```

**Benefits:**
- Single source of truth for all colors
- WCAG AAA compliance built-in
- Colorblind support integrated
- Type-safe color tokens

### Phase 2: Create Accessibility Theme System

**File:** `/src/design-system/themes/accessibility.ts`

```typescript
import { colorblindPalettes } from '../tokens/colors';

export type ColorblindMode = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome';

export function getAccessibleColor(
  region: string,
  mode: ColorblindMode = 'normal'
): string {
  return colorblindPalettes[mode][region] || '#4B5563';
}

// Pattern definitions for visual distinction
export const accessibilityPatterns = {
  dots: '<pattern id="dots">...</pattern>',
  waves: '<pattern id="waves">...</pattern>',
  // ... from accessibleColors.ts
};

// High contrast theme
export const highContrastTheme = {
  regions: {
    'Andina': '#000000',
    // ... from accessibleColors.ts
  }
};
```

### Phase 3: Create Region Theme System

**File:** `/src/design-system/themes/regions.ts`

```typescript
import { regionColors } from '../tokens/colors';

// Modern gradient styles for regions
export const regionStyles = {
  'Andina': {
    bg: 'from-emerald-600 via-emerald-500 to-emerald-400',
    text: 'text-white',
    icon: '⛰️',
    glow: 'shadow-emerald-500/50'
  },
  // ... from regionColors.ts
};

// Tailwind utility classes
export const regionTailwindClasses = {
  'Andina': 'bg-emerald-500 border-emerald-700 hover:bg-emerald-400 ...',
  // ... from regionColors.ts
};
```

### Phase 4: Complete Token System

**Create missing token files:**

1. **shadows.ts** - Merge from designSystem.ts + modernAccessibleColors.ts
2. **radius.ts** - Extract from designSystem.ts
3. **animations.ts** - Extract from designSystem.ts

### Phase 5: Create Utility Modules

**File:** `/src/design-system/utils/a11y.ts`

```typescript
// Focus visible styles
export const focusVisible = 'focus-visible:outline-none focus-visible:ring-2 ...';

// Screen reader only
export const srOnly = 'absolute w-px h-px p-0 -m-px overflow-hidden ...';

// Minimum touch target
export const minTouchTarget = 'min-h-[44px] min-w-[44px]';
```

**File:** `/src/design-system/utils/color-contrast.ts`

```typescript
// Contrast ratio checker (from accessibleColors.ts + accessibleColorsFixed.ts)
export function getContrastRatio(fg: string, bg: string): number { ... }

// WCAG validation
export function validateAccessibility(): boolean { ... }
```

---

## Migration Path

### Step 1: Create New Files (Non-Breaking)

✅ Safe to create immediately:
1. `/src/design-system/tokens/colors.ts` (consolidated)
2. `/src/design-system/tokens/shadows.ts` (new)
3. `/src/design-system/tokens/radius.ts` (new)
4. `/src/design-system/tokens/animations.ts` (new)
5. `/src/design-system/themes/accessibility.ts` (new)
6. `/src/design-system/themes/regions.ts` (new)
7. `/src/design-system/utils/a11y.ts` (new)
8. `/src/design-system/utils/color-contrast.ts` (new)

### Step 2: Update Component Imports (Breaking)

For each component using old constants:

**Before:**
```typescript
import { ACCESSIBLE_REGION_COLORS } from '../constants/accessibleColors';
import { MODERN_REGION_COLORS } from '../constants/modernAccessibleColors';
import { colors } from '../constants/designSystem';
```

**After:**
```typescript
import { regionColors, colors } from '../design-system';
import { getAccessibleColor } from '../design-system/themes/accessibility';
```

**Affected Files (12 total):**
- components/AccessibilitySettings.tsx
- components/StudyMode.tsx
- components/DepartmentTray.tsx
- components/HintModal.tsx
- components/MiniDepartmentShape.tsx
- components/ScreenReaderAnnouncements.tsx
- components/ModernGameHeader.tsx
- components/MapCanvas.tsx
- components/GameHeader.tsx
- context/AccessibilityContext.tsx
- tests/validateAccessibility.ts

### Step 3: Delete Old Files

⚠️ Only after ALL components migrated:
1. Delete `/src/constants/designSystem.ts`
2. Delete `/src/constants/accessibleColors.ts`
3. Delete `/src/constants/modernAccessibleColors.ts`
4. Delete `/src/constants/regionColors.ts`
5. Delete `/src/constants/accessibleColorsFixed.ts`

---

## Component Update Matrix

| Component | Old Import | New Import | Complexity |
|-----------|------------|------------|------------|
| AccessibilitySettings.tsx | `constants/accessibleColors` | `design-system/themes/accessibility` | Medium |
| StudyMode.tsx | `constants/accessibleColors` + `design-system` | `design-system` only | High |
| DepartmentTray.tsx | `constants/regionColors` | `design-system/themes/regions` | Low |
| HintModal.tsx | `constants/designSystem` | `design-system` | Low |
| AccessibilityContext.tsx | `constants/accessibleColors` | `design-system/themes/accessibility` | Medium |
| validateAccessibility.ts | `constants/accessibleColors` | `design-system/utils/color-contrast` | Medium |
| MiniDepartmentShape.tsx | `design-system` | `design-system` (no change) | None |
| ScreenReaderAnnouncements.tsx | `design-system` | `design-system` (no change) | None |
| ModernGameHeader.tsx | `design-system` | `design-system` (no change) | None |
| MapCanvas.tsx | `design-system` | `design-system` (no change) | None |
| GameHeader.tsx | `design-system` | `design-system` (no change) | None |

---

## Breaking Changes Documentation

### 1. Color Token Changes

**Old:**
```typescript
import { ACCESSIBLE_REGION_COLORS } from '../constants/accessibleColors';
const color = ACCESSIBLE_REGION_COLORS['Andina'].primary;
```

**New:**
```typescript
import { regionColors } from '../design-system';
const color = regionColors['Andina'].primary;
```

### 2. Colorblind Mode Changes

**Old:**
```typescript
import { COLORBLIND_PALETTES, ColorblindMode } from '../constants/accessibleColors';
const color = COLORBLIND_PALETTES[mode][region];
```

**New:**
```typescript
import { getAccessibleColor } from '../design-system/themes/accessibility';
import type { ColorblindMode } from '../design-system/themes/accessibility';
const color = getAccessibleColor(region, mode);
```

### 3. Design System Imports

**Old:**
```typescript
import { colors, typography, spacing } from '../constants/designSystem';
```

**New:**
```typescript
import { colors, typography, spacing } from '../design-system';
```

### 4. Utility Functions

**Old:**
```typescript
import { getContrastRatio } from '../constants/accessibleColors';
```

**New:**
```typescript
import { getContrastRatio } from '../design-system/utils/color-contrast';
```

---

## Validation & Testing Strategy

### Pre-Migration Checklist

- [ ] All color contrast ratios meet WCAG AAA (7:1)
- [ ] All colorblind palettes tested with simulator
- [ ] All spacing tokens validated against 4px grid
- [ ] All typography scales tested for readability
- [ ] Component visual regression tests prepared

### Post-Migration Checklist

- [ ] All 12 components compile without errors
- [ ] All tests pass (especially validateAccessibility.ts)
- [ ] Visual regression tests show no changes
- [ ] Accessibility audit passes
- [ ] Bundle size not increased
- [ ] TypeScript types resolve correctly
- [ ] No runtime console errors

### Testing Commands

```bash
# Type checking
npm run typecheck

# Unit tests
npm run test

# Visual regression (if available)
npm run test:visual

# Accessibility validation
npm run test:a11y

# Build validation
npm run build
```

---

## Risk Assessment

### High Risk Items

1. **StudyMode.tsx** - Imports from both systems, complex component
2. **AccessibilityContext.tsx** - Used throughout app, state management
3. **validateAccessibility.ts** - Critical test file

### Mitigation Strategies

1. Create feature branch for migration
2. Migrate one component at a time
3. Test each component individually before proceeding
4. Keep old constants as deprecated for one release cycle
5. Add deprecation warnings to old imports

---

## Timeline Estimate

| Phase | Task | Duration | Dependencies |
|-------|------|----------|--------------|
| 1 | Create new consolidated files | 2 hours | None |
| 2 | Update TypeScript types | 1 hour | Phase 1 |
| 3 | Migrate low-complexity components (6 files) | 2 hours | Phase 2 |
| 4 | Migrate medium-complexity components (4 files) | 3 hours | Phase 3 |
| 5 | Migrate high-complexity components (2 files) | 2 hours | Phase 4 |
| 6 | Testing & validation | 2 hours | Phase 5 |
| 7 | Delete old files | 0.5 hours | Phase 6 |
| **Total** | **Complete migration** | **12.5 hours** | |

---

## Success Metrics

- ✅ Single source of truth for all design tokens
- ✅ 100% WCAG AAA compliance maintained
- ✅ All colorblind modes functional
- ✅ Zero breaking changes in component behavior
- ✅ Improved type safety
- ✅ Better developer experience (clear import paths)
- ✅ Reduced bundle size (eliminate duplication)

---

## Recommended Execution Order

1. **Week 1:** Create all new design-system files (non-breaking)
2. **Week 2:** Add deprecation warnings to old constants
3. **Week 3:** Migrate components (6 low + 4 medium complexity)
4. **Week 4:** Migrate high-complexity components + testing
5. **Week 5:** Delete old files + final validation

---

## Appendix: File Size Reduction

**Current:** 1,740 lines across 10 files
**Proposed:** ~1,200 lines across 12 files

**Savings:**
- 540 lines of duplicate code eliminated
- Better organization with themed modules
- Clearer separation of concerns

---

## Contact & Questions

For questions about this consolidation plan:
- Review architecture decisions in memory: `swarm/design-system/plan`
- Check component compatibility matrix above
- Test accessibility validation before migration

---

**Document Version:** 1.0
**Created:** 2025-09-30
**Last Updated:** 2025-09-30
**Status:** Ready for Implementation
