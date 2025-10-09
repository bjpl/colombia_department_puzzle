# Mobile Development Guide
**Colombia Departments Puzzle Game**

Complete guide for developing, testing, and maintaining mobile features.

---

## 📱 Table of Contents

1. [Touch Target Guidelines](#touch-target-guidelines)
2. [Bottom Sheet Implementation](#bottom-sheet-implementation)
3. [Safe Area Handling](#safe-area-handling)
4. [PWA Best Practices](#pwa-best-practices)
5. [Testing Mobile Features](#testing-mobile-features)
6. [Performance Optimization](#performance-optimization)
7. [Common Pitfalls](#common-pitfalls)

---

## 🎯 Touch Target Guidelines

### WCAG 2.5.5 AAA Compliance

**Minimum Requirements:**
- **Touch target size:** 44×44 pixels minimum
- **Spacing between targets:** 16px minimum
- **Exception:** Inline text links can be smaller

### Implementation

```tsx
// ✅ CORRECT: Mobile-optimized button
<Button
  size="lg" // Ensures 44px minimum height on mobile
  className="min-h-[44px] min-w-[44px]"
>
  Action
</Button>

// ✅ CORRECT: Conditional sizing based on device
import { isTouchDevice } from '../utils/deviceDetection';

<Button
  size={isTouchDevice() ? 'lg' : 'md'}
  className={isTouchDevice() ? 'min-h-[44px]' : ''}
>
  Action
</Button>

// ❌ WRONG: Touch target too small
<button className="w-8 h-8"> {/* 32×32px - fails WCAG */}
  <IconX size={16} />
</button>
```

### Validation

Use the built-in touch target validator:

```tsx
import { validateTouchTargets } from '../utils/touchTargetValidator';

// In development/testing
if (import.meta.env.DEV) {
  validateTouchTargets(); // Logs validation results to console
}
```

### Thumb Zones

Mobile users typically interact with three zones:

```
┌─────────────────────┐
│  HARD              │ ← Top: Requires reaching
│                    │
│  STRETCH    EASY   │ ← Middle: Comfortable for right thumb
│                    │
│         EASY       │ ← Bottom center: Most accessible
└─────────────────────┘
```

**Best Practices:**
- Place primary actions in EASY zones (bottom 40% of screen)
- Avoid critical buttons in top corners (HARD zone)
- Consider left-handed users (test both orientations)

---

## 📋 Bottom Sheet Implementation

### Architecture

The `BottomSheet` component provides a swipeable drawer interface similar to Google Maps.

**Key Features:**
- 3 snap points: collapsed (120px), half (50vh), full (85vh)
- Touch gestures with spring physics
- Keyboard accessible (Escape, Enter, Space)
- Safe area handling for iOS notches

### Basic Usage

```tsx
import { BottomSheet } from './components/BottomSheet';

function MobileLayout() {
  const [snapPoint, setSnapPoint] = useState<'collapsed' | 'half' | 'full'>('collapsed');

  return (
    <BottomSheet
      snapPoint={snapPoint}
      onSnapPointChange={setSnapPoint}
      onClose={() => setSnapPoint('collapsed')}
    >
      <div className="p-4">
        {/* Your content here */}
      </div>
    </BottomSheet>
  );
}
```

### Snap Point Configuration

```tsx
const SNAP_POINTS = {
  collapsed: 120,  // Shows handle + peek of content
  half: window.innerHeight * 0.5,  // 50% of viewport
  full: window.innerHeight * 0.85, // 85% (leaves room for status bar)
};
```

### Gesture Handling

```tsx
// Swipe velocity threshold for snap decision
const SWIPE_VELOCITY_THRESHOLD = 500; // pixels/second

// Spring physics configuration
const SPRING_CONFIG = {
  stiffness: 300,
  damping: 30,
  mass: 1,
};
```

### Accessibility

```tsx
<BottomSheet
  snapPoint={snapPoint}
  onSnapPointChange={setSnapPoint}
  aria-label="Departments panel"
  role="dialog"
  aria-modal={snapPoint === 'full'}
>
  {/* Content */}
</BottomSheet>
```

---

## 🛡️ Safe Area Handling

### iOS Safe Area Insets

iOS devices (especially with notches/Dynamic Island) require safe area consideration:

```css
/* Define safe area constants */
:root {
  --safe-area-inset-top: env(safe-area-inset-top, 20px);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 20px);
  --safe-area-inset-left: env(safe-area-inset-left, 0px);
  --safe-area-inset-right: env(safe-area-inset-right, 0px);
}

/* Apply to fixed positioned elements */
.mobile-header {
  padding-top: var(--safe-area-inset-top);
}

.mobile-bottom-sheet {
  padding-bottom: var(--safe-area-inset-bottom);
}
```

### TypeScript Constants

```tsx
// src/constants/responsive.ts
export const SAFE_AREA = {
  top: 'env(safe-area-inset-top, 20px)',
  bottom: 'env(safe-area-inset-bottom, 20px)',
  left: 'env(safe-area-inset-left, 0px)',
  right: 'env(safe-area-inset-right, 0px)',
} as const;

// Usage
<div style={{ paddingTop: SAFE_AREA.top }}>
  Content
</div>
```

### Testing Safe Areas

```tsx
// Simulate iPhone X/11/12 safe areas in dev tools
// Chrome DevTools > Device Mode > Add custom device
{
  "name": "iPhone 14 Pro",
  "width": 393,
  "height": 852,
  "safe-area-inset-top": "47px",    // Dynamic Island + status bar
  "safe-area-inset-bottom": "34px", // Home indicator
}
```

---

## 🚀 PWA Best Practices

### Service Worker Strategy

Our app uses VitePWA with smart caching:

```javascript
// Tier 0: Precache app shell (auto-updated)
workbox: {
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/raw\.githubusercontent\.com/,
      handler: 'CacheFirst', // Map data cached for 30 days
      cacheName: 'colombia-map-data',
      expiration: { maxEntries: 10, maxAgeSeconds: 30 * 24 * 60 * 60 }
    },
    {
      urlPattern: ({ request }) => request.destination === 'document',
      handler: 'NetworkFirst', // HTML always fresh with fallback
      cacheName: 'documents'
    }
  ]
}
```

### Install Prompt

```tsx
// Show install prompt after first game completion
import { usePWA } from '../hooks/usePWA';

function App() {
  const { canInstall, installPWA, isInstalled } = usePWA();

  const handleInstallPrompt = async () => {
    if (canInstall) {
      await installPWA();
    }
  };

  return (
    <>
      {canInstall && <InstallPrompt onInstall={handleInstallPrompt} />}
    </>
  );
}
```

### Offline Experience

```tsx
// Check network status
const { isOnline } = usePWA();

return (
  <>
    {!isOnline && <OfflineIndicator />}
    <GameContainer />
  </>
);
```

### Update Notifications

```tsx
// Prompt user when new version available
const { needsUpdate, updateServiceWorker } = usePWA();

{needsUpdate && (
  <UpdateNotification
    onUpdate={updateServiceWorker}
    onDismiss={() => {/* Handle dismiss */}}
  />
)}
```

---

## 🧪 Testing Mobile Features

### Device Testing Checklist

**Required Devices:**
- ✅ iPhone SE (small screen, 375×667)
- ✅ iPhone 14 Pro (notch, 393×852)
- ✅ Android Pixel 5 (393×851)
- ✅ iPad Mini (tablet, 744×1133)

### Browser DevTools Testing

```bash
# 1. Start dev server
npm run dev

# 2. Open Chrome DevTools
# - Press F12
# - Click device toolbar icon (Ctrl+Shift+M)
# - Select device or custom dimensions

# 3. Test touch interactions
# - Enable "Touch" in DevTools settings
# - Use cursor as touch point
# - Test gestures: tap, swipe, long-press
```

### E2E Testing with Playwright

```typescript
// tests/e2e/mobile-game-flow.spec.ts
import { test, expect, devices } from '@playwright/test';

test.use({
  ...devices['iPhone 14 Pro'],
  hasTouch: true,
});

test('mobile game flow', async ({ page }) => {
  await page.goto('/');

  // Test touch target size
  const button = page.getByRole('button', { name: 'Start Game' });
  const box = await button.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);

  // Test tap interaction
  await button.tap();

  // Test bottom sheet swipe
  const bottomSheet = page.locator('[data-testid="bottom-sheet"]');
  await bottomSheet.hover();
  await page.mouse.down();
  await page.mouse.move(0, -200); // Swipe up
  await page.mouse.up();

  // Verify sheet expanded
  await expect(bottomSheet).toHaveAttribute('data-snap-point', 'half');
});
```

### Visual Regression Testing

```bash
# Take screenshots at different viewport sizes
npx playwright test --project=mobile-screenshots

# Compare with baseline
npx playwright test --update-snapshots
```

---

## ⚡ Performance Optimization

### Lazy Loading Components

```tsx
// Lazy load heavy components (Study Mode)
import { lazy, Suspense } from 'react';

const StudyMode = lazy(() => import('./components/StudyMode'));

function App() {
  return (
    <Suspense fallback={<StudyModeLoading />}>
      {showStudyMode && <StudyMode />}
    </Suspense>
  );
}
```

### GPU Acceleration

```css
/* Use transform for animations (GPU-accelerated) */
.bottom-sheet {
  transform: translate3d(0, var(--y), 0); /* ✅ GPU */
  /* NOT: top: var(--y); ❌ CPU */
}

/* Enable will-change for animated elements */
.draggable {
  will-change: transform;
}
```

### Touch Event Optimization

```tsx
// Use passive event listeners for scroll performance
useEffect(() => {
  const handler = (e: TouchEvent) => {
    // Handle touch
  };

  element.addEventListener('touchstart', handler, { passive: true });

  return () => element.removeEventListener('touchstart', handler);
}, []);
```

### Bundle Size

```bash
# Analyze bundle
npm run build
npx vite-bundle-visualizer

# Target metrics
# - Initial bundle: <150 KB gzipped
# - Total assets: <250 KB gzipped
# - Lazy chunks: <50 KB each
```

---

## ⚠️ Common Pitfalls

### 1. Touch Event Double-Firing

**Problem:** Touch events fire both `touch*` and `click` events.

```tsx
// ❌ WRONG: Handles event twice
<button
  onTouchStart={handleTouch}
  onClick={handleClick} // Also fires after touch
>
  Tap Me
</button>

// ✅ CORRECT: Use pointer events (unified)
<button onPointerDown={handlePointer}>
  Tap Me
</button>

// ✅ CORRECT: Prevent click after touch
const handleTouch = (e) => {
  e.preventDefault(); // Prevents click event
  // Handle touch
};
```

### 2. Fixed Positioning on Mobile Safari

**Problem:** Fixed elements scroll with virtual keyboard.

```css
/* ❌ WRONG: Breaks with keyboard */
.header {
  position: fixed;
  top: 0;
}

/* ✅ CORRECT: Use sticky within scroll container */
.scroll-container {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
}
```

### 3. 300ms Click Delay

**Problem:** Mobile browsers delay clicks to detect double-tap zoom.

```html
<!-- ✅ SOLUTION: Add meta tag -->
<meta name="viewport" content="width=device-width, user-scalable=no">
```

```css
/* ✅ SOLUTION: CSS touch-action */
button {
  touch-action: manipulation; /* Removes 300ms delay */
}
```

### 4. Viewport Height on Mobile

**Problem:** `100vh` includes browser chrome, causing overflow.

```css
/* ❌ WRONG: Includes address bar height */
.full-screen {
  height: 100vh;
}

/* ✅ CORRECT: Use dynamic viewport height */
.full-screen {
  height: 100dvh; /* Dynamic viewport height */
  height: calc(var(--vh, 1vh) * 100); /* Fallback */
}
```

```tsx
// Set CSS variable for true viewport height
useEffect(() => {
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setVH();
  window.addEventListener('resize', setVH);
  return () => window.removeEventListener('resize', setVH);
}, []);
```

### 5. Horizontal Scroll on Small Screens

**Problem:** Fixed-width elements cause horizontal overflow.

```css
/* ❌ WRONG: Fixed width exceeds viewport */
.container {
  width: 400px;
}

/* ✅ CORRECT: Responsive max-width */
.container {
  width: 100%;
  max-width: 400px;
  padding: 0 1rem; /* Breathing room */
}
```

---

## 📦 Quick Reference

### Breakpoints

```typescript
export const BREAKPOINTS = {
  mobile: { max: 767 },
  tablet: { min: 768, max: 1023 },
  desktop: { min: 1024 },
} as const;
```

### Touch Target Sizes

| Element | Mobile | Desktop |
|---------|--------|---------|
| Primary Button | 44px | 40px |
| Icon Button | 44×44px | 32×32px |
| Department Chip | 44px height | 36px height |
| Checkbox | 24×24px | 20×20px |

### Safe Spacing

| Type | Mobile | Desktop |
|------|--------|---------|
| Between targets | 16px | 12px |
| Screen edges | 16px | 24px |
| Section padding | 16px | 32px |

---

## 🔗 Related Documentation

- [PWA Implementation Guide](./PWA_IMPLEMENTATION.md)
- [Accessibility Guide](./ACCESSIBILITY_GUIDE.md)
- [Performance Optimization](../TECHNICAL_DEBT.md#performance-opportunities)
- [Touch Interaction System](./touch-interaction-system.md)

---

**Last Updated:** 2025-10-08
**Maintainer:** Development Team
**Review Cycle:** Before adding new mobile features
