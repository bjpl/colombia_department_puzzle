# Mobile Development Guide
**Colombia Departments Puzzle Game**

Comprehensive guide for developing, testing, and maintaining mobile features with real implementation examples from the codebase.

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

**Standards:**
- **WCAG 2.5.5 (AAA):** 44×44 CSS pixels minimum
- **iOS Human Interface Guidelines:** 44×44pt minimum
- **Material Design:** 48×48dp (we use 44 for iOS consistency)
- **Minimum spacing:** 16px between tappable elements

### Implementation from Codebase

Our implementation uses constants from `src/constants/mobileConstants.ts`:

```typescript
export const TOUCH_STANDARDS = {
  // Minimum touch target size
  minTouchTarget: 44,      // 44×44px (iOS HIG / WCAG 2.5.5 AAA)
  recommendedTarget: 48,   // 48×48px (Material Design)

  // Minimum spacing between touch targets
  minSpacing: 16,          // 16px between tappable elements
  recommendedSpacing: 24,  // 24px for comfortable spacing

  // Icon sizes for different button sizes
  iconSizes: {
    sm: 16,  // Small icons (16×16px)
    md: 20,  // Medium icons (20×20px)
    lg: 24,  // Large icons (24×24px)
  },
} as const;
```

### Button Sizing Examples

```tsx
// ✅ CORRECT: Mobile-optimized button (from design system)
import { Button } from '../design-system';

<Button
  size="lg"
  icon={<Menu className="w-5 h-5" />}
  onClick={onMenuClick}
  title="Abrir menú"
  aria-label="Abrir menú de opciones"
  className="shrink-0"
/>
```

Real implementation from `src/components/MobileHeader.tsx`:

```tsx
export function MobileHeader({ onMenuClick, onSettingsClick }: Props) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: '56px',
        paddingTop: 'env(safe-area-inset-top)', // iOS notch support
      }}
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left: Menu button (44×44px) */}
        <Button
          variant="ghost"
          size="sm"
          icon={<Menu className="w-5 h-5" />}
          onClick={onMenuClick}
          title="Abrir menú"
          aria-label="Abrir menú de opciones"
          className="shrink-0"
        />

        {/* Center: Condensed stats */}
        <div className="flex-1 text-center px-2">
          <span className="text-sm font-semibold">
            Score:{game.score} · ⏱{formatTime(game.elapsedTime)}
          </span>
        </div>

        {/* Right: Settings button (44×44px) */}
        <Button
          variant="ghost"
          size="sm"
          icon={<Settings className="w-5 h-5" />}
          onClick={onSettingsClick}
          title="Configuración"
          aria-label="Abrir configuración"
          className="shrink-0"
        />
      </div>
    </header>
  );
}
```

### Touch Target Validation

Use the built-in validator from `src/utils/touchTargetValidator.ts`:

```typescript
import {
  validateTouchTarget,
  auditTouchTargets,
  reportTouchTargetViolations,
  highlightTouchTargetViolations
} from '../utils/touchTargetValidator';

// Single element validation
const button = document.querySelector('button');
const isValid = validateTouchTarget(button); // true/false

// Full page audit
const audit = auditTouchTargets(document.body);
const violations = audit.filter(item => !item.isValid);
console.log(`Found ${violations.length} violations`);

// Development mode: Visual highlighting
if (import.meta.env.DEV) {
  // Shows red outline on invalid targets
  const cleanup = highlightTouchTargetViolations(document.body);

  // Remove highlights when done
  // cleanup();
}

// Console report
reportTouchTargetViolations();
// ✅ All touch targets meet 44×44px minimum
// OR
// ❌ 3 touch target violations found
// Element: BUTTON close-button Size: 32.0×32.0px
```

### Thumb Zones Analysis

From `src/constants/mobileConstants.ts`:

```typescript
export const THUMB_ZONES = {
  easy: {
    description: 'bottom 1/3',
    range: [0.67, 1.0],  // 67-100% from top
    use: 'Primary actions, navigation',
  },
  stretch: {
    description: 'middle 1/3',
    range: [0.33, 0.67], // 33-67% from top
    use: 'Secondary actions, content',
  },
  hard: {
    description: 'top 1/3',
    range: [0.0, 0.33],  // 0-33% from top
    use: 'Infrequent actions only',
  },
} as const;
```

Utility function to determine element's thumb zone:

```typescript
/**
 * Determines which thumb zone an element is in
 * (for one-handed mobile use analysis)
 */
export function getThumbZone(element: HTMLElement): 'easy' | 'stretch' | 'hard' {
  const rect = element.getBoundingClientRect();
  const centerY = rect.top + rect.height / 2;
  const viewportHeight = window.innerHeight;

  const relativePosition = centerY / viewportHeight;

  if (relativePosition > 0.67) return 'easy';    // Bottom third
  if (relativePosition > 0.33) return 'stretch'; // Middle third
  return 'hard';                                 // Top third
}

// Usage
const menuButton = document.querySelector('.menu-button');
const zone = getThumbZone(menuButton);
console.log(`Menu button is in ${zone} zone`); // "easy", "stretch", or "hard"
```

**Layout Strategy:**
```
┌─────────────────────────────────┐
│  Header (sticky)      [HARD]   │ ← Infrequent actions (menu, settings)
│                                 │
│                                 │
│  Map Canvas          [STRETCH] │ ← Content viewing area
│  (main interaction)             │
│                                 │
│                                 │
│  Bottom Sheet        [EASY]    │ ← Primary actions (department selection)
│  (swipeable drawer)             │
└─────────────────────────────────┘
```

---

## 📋 Bottom Sheet Implementation

### Architecture Overview

The BottomSheet component (`src/components/BottomSheet.tsx`) provides a swipeable drawer interface following Google Maps patterns.

**Key Features:**
- 3 snap points with smooth transitions
- Touch/mouse/pen gesture support via Pointer Events API
- Spring physics for natural movement
- Keyboard accessible (Escape, Enter, Space)
- Safe area handling for iOS notches/Android gestures
- Backdrop tap to collapse
- 60fps GPU-accelerated animations

### Snap Point System

From `src/constants/responsive.ts`:

```typescript
/**
 * Bottom Sheet Snap Points
 *
 * Three states for mobile bottom drawer:
 * - collapsed: Shows peek (one row of departments)
 * - half: Working height for browsing departments
 * - full: Maximum expansion (leaves room for header)
 */
export const BOTTOM_SHEET_SNAP_POINTS = {
  collapsed: 120,   // px - Show hint that more content exists
  half: '50vh',     // Comfortable browsing height
  full: '85vh',     // Max - maintains header visibility
} as const;
```

**Conversion to pixel values:**

```typescript
/**
 * Convert snap point name to pixel value
 */
function getSnapPointValue(snapPoint: SnapPoint): number {
  if (typeof window === 'undefined') return 0;

  const value = BOTTOM_SHEET_SNAP_POINTS[snapPoint];
  if (typeof value === 'number') return value;

  // Parse vh values
  const vh = window.innerHeight;
  const percentage = parseInt(value.replace('vh', ''));
  return (vh * percentage) / 100;
}

// Example results on iPhone 14 Pro (852px height):
// collapsed: 120px
// half: 426px (50% of 852)
// full: 724px (85% of 852)
```

### Basic Usage

```tsx
import BottomSheet, { SnapPoint } from './components/BottomSheet';

function MobileGameLayout() {
  const [sheetSnap, setSheetSnap] = useState<SnapPoint>('collapsed');

  return (
    <div className="fixed inset-0">
      {/* Full-screen map */}
      <MapCanvas />

      {/* Bottom Sheet with Departments */}
      <BottomSheet
        initialSnapPoint="collapsed"
        onSnapChange={(newSnap) => {
          console.log(`Sheet moved to ${newSnap}`);
          setSheetSnap(newSnap);
        }}
      >
        <DepartmentTray layout="mobile-scroll" />
      </BottomSheet>
    </div>
  );
}
```

### Touch Gesture Handling

The BottomSheet uses a sophisticated gesture system with velocity-based snap decisions:

```tsx
/**
 * Determine nearest snap point based on current height and velocity
 */
const getNearestSnapPoint = useCallback((height: number, velocity: number): SnapPoint => {
  const collapsed = getSnapPointValue('collapsed');
  const half = getSnapPointValue('half');
  const full = getSnapPointValue('full');

  // Fast swipe up (velocity < -0.5 px/ms) - go to next snap point
  if (velocity < -MOBILE_LAYOUT.velocityThreshold) {
    if (currentSnap === 'collapsed') return 'half';
    if (currentSnap === 'half') return 'full';
    return 'full';
  }

  // Fast swipe down (velocity > 0.5 px/ms) - go to previous snap point
  if (velocity > MOBILE_LAYOUT.velocityThreshold) {
    if (currentSnap === 'full') return 'half';
    if (currentSnap === 'half') return 'collapsed';
    return 'collapsed';
  }

  // No significant velocity - snap to nearest point
  const distToCollapsed = Math.abs(height - collapsed);
  const distToHalf = Math.abs(height - half);
  const distToFull = Math.abs(height - full);

  const minDist = Math.min(distToCollapsed, distToHalf, distToFull);

  if (minDist === distToCollapsed) return 'collapsed';
  if (minDist === distToHalf) return 'half';
  return 'full';
}, [currentSnap]);
```

**Velocity Threshold:**

```typescript
export const MOBILE_LAYOUT = {
  velocityThreshold: 0.5, // px/ms - Fast swipe triggers snap
  transitionDuration: 300, // ms - Smooth but not sluggish
  swipeThreshold: 50, // px - Minimum drag distance
} as const;
```

### Touch Event Implementation

```tsx
/**
 * Handle touch start
 */
const handleTouchStart = useCallback((e: React.TouchEvent) => {
  const touch = e.touches[0];
  touchStartY.current = touch.clientY;
  touchStartTime.current = Date.now();
  initialHeight.current = getSnapPointValue(currentSnap);
  setIsDragging(true);
}, [currentSnap]);

/**
 * Handle touch move
 */
const handleTouchMove = useCallback((e: React.TouchEvent) => {
  if (!isDragging) return;

  const touch = e.touches[0];
  const deltaY = touchStartY.current - touch.clientY;

  // Update drag offset (positive = dragging up, negative = dragging down)
  setDragOffset(deltaY);
}, [isDragging]);

/**
 * Handle touch end
 */
const handleTouchEnd = useCallback(() => {
  if (!isDragging) return;

  const dragDuration = Date.now() - touchStartTime.current;
  const velocity = dragOffset / dragDuration; // px/ms

  const newHeight = currentHeight;
  const newSnap = getNearestSnapPoint(newHeight, velocity);

  // Update snap point with animation
  setCurrentSnap(newSnap);
  setDragOffset(0);
  setIsDragging(false);

  // Notify parent
  if (onSnapChange && newSnap !== currentSnap) {
    onSnapChange(newSnap);
  }
}, [isDragging, dragOffset, currentHeight, currentSnap, getNearestSnapPoint, onSnapChange]);
```

### GPU-Accelerated Animation

```tsx
// Calculate transform for smooth animation
const transform = isDragging
  ? `translateY(calc(100% - ${currentHeight}px))`
  : `translateY(calc(100% - ${getSnapPointValue(currentSnap)}px))`;

return (
  <div
    ref={sheetRef}
    className="fixed left-0 right-0 bottom-0 rounded-t-3xl"
    style={{
      transform,
      willChange: 'transform', // Hint for GPU acceleration
      transition: isDragging
        ? 'none' // No transition during drag for immediate feedback
        : `transform ${MOBILE_LAYOUT.transitionDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
      touchAction: 'none', // Prevent browser scroll during drag
    }}
  >
    {/* Content */}
  </div>
);
```

### Backdrop System

```tsx
// Backdrop opacity based on sheet height
const maxHeight = getSnapPointValue('full');
const backdropOpacity = isDragging
  ? Math.min(0.5, (currentHeight / maxHeight) * 0.5)
  : Math.min(0.5, (getSnapPointValue(currentSnap) / maxHeight) * 0.5);

return (
  <>
    {/* Backdrop - tap to collapse */}
    <div
      className="fixed inset-0 transition-opacity"
      style={{
        backgroundColor: colors.gray[900],
        opacity: backdropOpacity,
        zIndex: Z_INDEX.bottomSheet - 1,
        display: currentSnap === 'collapsed' ? 'none' : 'block',
      }}
      onClick={handleBackdropClick}
      aria-hidden="true"
    />

    {/* Bottom Sheet */}
    <div ref={sheetRef}>
      {/* ... */}
    </div>
  </>
);
```

### Keyboard Accessibility

```tsx
/**
 * Handle keyboard events
 */
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && currentSnap !== 'collapsed') {
      setCurrentSnap('collapsed');
      if (onSnapChange) {
        onSnapChange('collapsed');
      }
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [currentSnap, onSnapChange]);

// Drag handle keyboard navigation
<div
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const next: SnapPoint =
        currentSnap === 'collapsed' ? 'half' :
        currentSnap === 'half' ? 'full' : 'collapsed';
      setCurrentSnap(next);
      if (onSnapChange) onSnapChange(next);
    }
  }}
  role="button"
  tabIndex={0}
  aria-label={`Desliza ${currentSnap === 'collapsed' ? 'arriba' : 'abajo'}`}
>
  {/* Handle indicator */}
</div>
```

---

## 🛡️ Safe Area Handling

### iOS and Android Safe Areas

Modern devices have notches, dynamic islands, and gesture areas that require safe area consideration:

**iOS Examples:**
- iPhone 14 Pro: 47px top (Dynamic Island), 34px bottom (home indicator)
- iPhone SE: 20px top (status bar), 0px bottom
- iPad Pro: Variable depending on orientation

**Android Examples:**
- Pixel 7: Variable top notch, 24-48px bottom gesture area
- Samsung Galaxy: Curved edges require horizontal insets

### Implementation from Codebase

From `src/constants/responsive.ts`:

```typescript
/**
 * Safe Area Insets (iOS notches, Android gestures)
 *
 * Use with CSS: env(safe-area-inset-top) etc.
 */
export const SAFE_AREA = {
  top: 'env(safe-area-inset-top, 0px)',
  right: 'env(safe-area-inset-right, 0px)',
  bottom: 'env(safe-area-inset-bottom, 0px)',
  left: 'env(safe-area-inset-left, 0px)',
} as const;
```

### Header with Safe Area

Real example from `src/components/MobileHeader.tsx`:

```tsx
<header
  className="fixed top-0 left-0 right-0 z-50"
  style={{
    height: '56px',
    paddingTop: 'env(safe-area-inset-top)', // iOS notch support
    paddingLeft: 'env(safe-area-inset-left)', // Android curved edges
    paddingRight: 'env(safe-area-inset-right)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)',
  }}
  role="banner"
>
  <div className="flex items-center justify-between h-14 px-4">
    {/* Content */}
  </div>
</header>
```

### Bottom Sheet with Safe Area

From `src/components/BottomSheet.tsx`:

```tsx
<div
  ref={sheetRef}
  className="fixed left-0 right-0 bottom-0"
  style={{
    paddingBottom: SAFE_AREA.bottom, // iOS home indicator
    paddingLeft: SAFE_AREA.left,     // Android curved edges
    paddingRight: SAFE_AREA.right,
    maxHeight: '90vh', // Safety limit
  }}
>
  {/* Content automatically respects safe area */}
</div>
```

### CSS Variables Setup

Add to your global CSS or `index.html`:

```css
:root {
  /* Define safe area fallbacks for desktop */
  --safe-area-inset-top: env(safe-area-inset-top, 0px);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-inset-left: env(safe-area-inset-left, 0px);
  --safe-area-inset-right: env(safe-area-inset-right, 0px);
}

/* Apply to body for consistent spacing */
body {
  padding-top: var(--safe-area-inset-top);
  padding-bottom: var(--safe-area-inset-bottom);
  padding-left: var(--safe-area-inset-left);
  padding-right: var(--safe-area-inset-right);
}
```

### Testing Safe Areas

**Chrome DevTools Custom Device:**

```json
{
  "name": "iPhone 14 Pro",
  "width": 393,
  "height": 852,
  "deviceScaleFactor": 3,
  "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
  "capabilities": ["touch", "mobile"],
  "safe-area-insets": {
    "top": 47,
    "bottom": 34,
    "left": 0,
    "right": 0
  }
}
```

**Playwright E2E Test:**

From `tests/e2e/mobile-touch.spec.ts`:

```typescript
test('should respect safe area on notched devices', async ({ page }) => {
  // Check for safe area CSS variables usage
  const hasSafeArea = await page.evaluate(() => {
    const testElement = document.createElement('div');
    testElement.style.paddingTop = 'env(safe-area-inset-top, 20px)';
    document.body.appendChild(testElement);
    const computed = window.getComputedStyle(testElement).paddingTop;
    document.body.removeChild(testElement);
    return computed !== '0px';
  });

  // Safe area should be applied (either env() or fallback)
  expect(hasSafeArea).toBeTruthy();
});
```

---

## 🚀 PWA Best Practices

### Service Worker Configuration

Our implementation uses VitePWA with smart caching strategies from `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'screenshots/*.png'],
      manifest: false, // Use public/manifest.json instead
      workbox: {
        // Define caching strategies - exclude large GeoJSON files from precaching
        globPatterns: ['**/*.{js,css,html,png,svg,woff,woff2}'],
        globIgnores: ['**/data/*.json'], // Don't precache large GeoJSON files

        // Runtime caching for different resource types
        runtimeCaching: [
          {
            // API calls or dynamic content
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 minutes
              },
              networkTimeoutSeconds: 3,
            },
          },
          {
            // Colombia map GeoJSON data
            urlPattern: /\/data\/.*\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'map-data-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            // Static assets (images, fonts)
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|woff|woff2)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            // JavaScript and CSS bundles
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'app-shell-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
              },
            },
          },
        ],

        // Maximum cache size: 5MB
        maximumFileSizeToCacheInBytes: 5000000,

        // Clean up old caches
        cleanupOutdatedCaches: true,

        // Skip waiting and activate immediately
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ],
});
```

### Manifest Configuration

From `public/manifest.json`:

```json
{
  "name": "Colombia Departments Puzzle",
  "short_name": "Colombia Puzzle",
  "description": "Learn Colombian geography through interactive puzzle gameplay",
  "start_url": "/colombia_department_puzzle/",
  "display": "standalone",
  "orientation": "any",
  "theme_color": "#3b82f6",
  "background_color": "#f8fafc",
  "scope": "/colombia_department_puzzle/",
  "icons": [
    {
      "src": "/colombia_department_puzzle/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/colombia_department_puzzle/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/colombia_department_puzzle/screenshots/mobile.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Colombia puzzle game on mobile"
    }
  ],
  "categories": ["education", "games"],
  "lang": "en",
  "dir": "ltr"
}
```

### Install Prompt with 7-Day Cooldown

Best practice: Don't show install prompt immediately. Wait for user engagement.

```tsx
import { useState, useEffect } from 'react';

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Check if already dismissed recently
    const lastDismissed = localStorage.getItem('pwa-install-dismissed');
    if (lastDismissed) {
      const daysSince = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        return; // Don't show for 7 days
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    if (result.outcome === 'dismissed') {
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    }

    setDeferredPrompt(null);
    setCanInstall(false);

    return result.outcome === 'accepted';
  };

  return { canInstall, promptInstall };
}
```

### Update Notification Component

From `src/components/UpdateNotification.tsx`:

```tsx
export function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    const handler = (event: CustomEvent) => {
      setShowUpdate(true);
      setRegistration(event.detail.registration);
    };

    window.addEventListener('swUpdateAvailable' as any, handler);

    return () => {
      window.removeEventListener('swUpdateAvailable' as any, handler);
    };
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      // Tell the service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });

      // Reload the page when the new service worker takes control
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    } else {
      // Fallback: just reload
      window.location.reload();
    }
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 px-4">
      <div className="mx-auto max-w-md">
        <div className="rounded-lg bg-green-600 text-white shadow-2xl">
          <div className="flex items-center gap-4 px-5 py-4">
            <RefreshCw className="h-6 w-6 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">New version available!</p>
              <p className="text-xs text-green-100 mt-0.5">
                Click to update and get the latest features
              </p>
            </div>
            <button
              onClick={handleUpdate}
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-green-700"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Offline Experience

```tsx
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Usage
function App() {
  const isOnline = useOnlineStatus();

  return (
    <>
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white p-2 text-center">
          ⚠️ You are offline. Some features may be unavailable.
        </div>
      )}
      <GameContainer />
    </>
  );
}
```

---

## 🧪 Testing Mobile Features

### Device Testing Checklist

**Minimum Required Devices:**
- ✅ **iPhone SE (2020)** - Small screen (375×667), Home button
- ✅ **iPhone 14 Pro** - Notch + Dynamic Island (393×852)
- ✅ **Android Pixel 5** - Standard Android (393×851)
- ✅ **iPad Mini** - Tablet mode (744×1133)
- ✅ **Samsung Galaxy S21** - Android gestures (360×800)

**Testing Matrix:**

| Device | Screen Size | Touch Target | Bottom Sheet | Safe Area | PWA Install |
|--------|-------------|--------------|--------------|-----------|-------------|
| iPhone SE | 375×667 | ✅ 44px | ✅ Works | ✅ 20px top | ✅ Safari |
| iPhone 14 Pro | 393×852 | ✅ 44px | ✅ Works | ✅ 47px top, 34px bottom | ✅ Safari |
| Pixel 5 | 393×851 | ✅ 44px | ✅ Works | ✅ Variable | ✅ Chrome |
| iPad Mini | 744×1133 | ✅ 44px | ⚠️ Hybrid | ✅ Variable | ✅ Safari |

### Browser DevTools Testing

```bash
# 1. Start dev server
npm run dev

# 2. Open Chrome DevTools
# - Press F12
# - Click device toolbar icon (Ctrl+Shift+M)
# - Select device or custom dimensions

# 3. Enable touch simulation
# Settings > Devices > Show rulers + device frame
# Check "Emulate touch events"

# 4. Test gestures
# - Tap: Single click
# - Long press: Click and hold
# - Swipe: Click, drag, release
# - Pinch zoom: Shift + Drag
```

### E2E Testing with Playwright

From `tests/e2e/mobile-touch.spec.ts`:

```typescript
import { test, expect, devices } from '@playwright/test';

test.use({
  ...devices['iPhone 14 Pro'],
  hasTouch: true,
});

test.describe('Mobile Touch Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have compliant touch targets (44x44px minimum)', async ({ page }) => {
    // Find all buttons and interactive elements
    const buttons = await page.locator('button').all();

    for (const button of buttons.slice(0, 10)) { // Test first 10 buttons
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        if (box) {
          // WCAG 2.5.5 Level AAA: 44x44px minimum
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });

  test('should work with tap interactions', async ({ page }) => {
    const firstButton = page.locator('button').first();
    if (await firstButton.isVisible()) {
      await firstButton.tap();
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should handle swipe gestures (bottom sheet)', async ({ page }) => {
    const bottomSheet = page.locator('[data-testid="bottom-sheet"]');

    if (await bottomSheet.isVisible()) {
      const initialBox = await bottomSheet.boundingBox();

      if (initialBox) {
        // Simulate swipe up gesture
        await page.mouse.move(initialBox.x + 50, initialBox.y + 20);
        await page.mouse.down();
        await page.mouse.move(initialBox.x + 50, initialBox.y - 200, { steps: 10 });
        await page.mouse.up();

        // Wait for animation
        await page.waitForTimeout(500);

        // Verify bottom sheet moved
        const newBox = await bottomSheet.boundingBox();
        if (newBox) {
          expect(newBox.y).toBeLessThan(initialBox.y);
        }
      }
    }
  });

  test('should work in landscape orientation', async ({ page }) => {
    // Rotate to landscape
    await page.setViewportSize({ width: 852, height: 393 });
    await page.waitForTimeout(500);

    // Verify page is still functional
    await expect(page.locator('body')).toBeVisible();

    // Verify no horizontal overflow
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalScroll).toBeFalsy();
  });
});
```

### Visual Regression Testing

```bash
# Take screenshots at different viewport sizes
npm run test:visual

# Playwright visual test
npx playwright test --project=mobile-screenshots

# Update baseline snapshots
npx playwright test --update-snapshots
```

**Visual test example:**

```typescript
test('mobile layout visual regression', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Mobile portrait
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page).toHaveScreenshot('mobile-portrait.png');

  // Mobile landscape
  await page.setViewportSize({ width: 667, height: 375 });
  await expect(page).toHaveScreenshot('mobile-landscape.png');

  // Tablet
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page).toHaveScreenshot('tablet-portrait.png');
});
```

---

## ⚡ Performance Optimization

### Lazy Loading Components

From `src/components/StudyMode.tsx`:

```tsx
import { lazy, Suspense, memo } from 'react';

// Lazy load heavy StudyMode component
const StudyMode = lazy(() => import('./components/StudyMode'));

function App() {
  const [showStudyMode, setShowStudyMode] = useState(false);

  return (
    <Suspense fallback={<StudyModeLoading />}>
      {showStudyMode && <StudyMode onClose={() => setShowStudyMode(false)} />}
    </Suspense>
  );
}

// Memoized components to prevent unnecessary re-renders
const RegionButton = memo(({ region, departmentCount, isSelected, onSelect }) => (
  <Button
    onClick={onSelect}
    variant={isSelected ? 'primary' : 'secondary'}
    size="sm"
  >
    {region} ({departmentCount})
  </Button>
), (prev, next) => {
  // Custom comparison: only re-render if relevant props changed
  return prev.region === next.region && prev.isSelected === next.isSelected;
});
```

### GPU Acceleration Patterns

```css
/* ✅ CORRECT: Use transform for animations (GPU-accelerated) */
.bottom-sheet {
  transform: translate3d(0, var(--y), 0); /* GPU */
  will-change: transform; /* Hint to browser */
}

/* ❌ WRONG: Position-based animation (CPU) */
.bottom-sheet-slow {
  top: var(--y); /* CPU layout recalculation */
}

/* ✅ CORRECT: Opacity animations are GPU-accelerated */
.fade-in {
  opacity: 0;
  animation: fadeIn 200ms ease-out forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}
```

**Real implementation from BottomSheet:**

```tsx
<div
  style={{
    transform: isDragging
      ? `translateY(calc(100% - ${currentHeight}px))`
      : `translateY(calc(100% - ${getSnapPointValue(currentSnap)}px))`,
    willChange: 'transform', // GPU hint
    transition: isDragging ? 'none' : 'transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  }}
>
  {children}
</div>
```

### Touch Event Optimization

Use Pointer Events API (from `src/hooks/useTouchGestures.ts`):

```tsx
/**
 * Touch gesture detection hook
 * Uses Pointer Events API for unified touch/mouse/pen handling
 */
export function useTouchGestures(callbacks: GestureCallbacks = {}) {
  /**
   * Handles pointer down event (touch, mouse, or pen)
   */
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Capture pointer for this element
    (e.target as Element).setPointerCapture?.(e.pointerId);

    const inputMethod = getInputMethod(e);
    stateRef.current = {
      isActive: true,
      startX: e.clientX,
      startY: e.clientY,
      pointerId: e.pointerId,
      inputMethod,
      // ...
    };
  }, []);

  return {
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
    },
    gestureState: {
      isActive: stateRef.current.isActive,
      currentGesture,
      inputMethod: stateRef.current.inputMethod,
    },
  };
}

// Usage
const { handlers } = useTouchGestures({
  onTap: (e) => console.log('Tapped!'),
  onSwipe: (e) => console.log('Swiped!', e.deltaX, e.deltaY),
  onDragMove: (e) => console.log('Dragging...', e.currentX, e.currentY),
});

return <div {...handlers}>Interactive content</div>;
```

**Why Pointer Events?**
- ✅ Unified API for touch, mouse, pen
- ✅ Automatic pointer capture
- ✅ Better performance than separate touch/mouse handlers
- ✅ Prevents ghost clicks
- ✅ Native browser support

### Bundle Size Optimization

From `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Code splitting for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'game-logic': ['@dnd-kit/core'],
          'utilities': ['d3-geo', 'zustand'],
        },
      },
    },
  },
});
```

**Target Metrics:**
- Initial bundle: <150 KB gzipped
- Total assets: <250 KB gzipped
- Lazy chunks: <50 KB each
- Time to Interactive: <3s on 3G

**Analyze bundle:**

```bash
npm run build
npx vite-bundle-visualizer

# Check sizes
ls -lh dist/assets/
```

---

## ⚠️ Common Pitfalls

### 1. Touch Event Double-Firing

**Problem:** Touch events fire both `touchstart` and `click` events, causing double execution.

```tsx
// ❌ WRONG: Handles event twice on mobile
<button
  onTouchStart={(e) => {
    console.log('Touch!'); // Fires first
  }}
  onClick={(e) => {
    console.log('Click!'); // Also fires 300ms later
  }}
>
  Tap Me
</button>

// ✅ SOLUTION 1: Use Pointer Events (recommended)
<button
  onPointerDown={(e) => {
    console.log('Pointer!'); // Fires once, works for touch/mouse/pen
  }}
>
  Tap Me
</button>

// ✅ SOLUTION 2: Prevent click after touch
const handleTouch = (e: React.TouchEvent) => {
  e.preventDefault(); // Prevents subsequent click event
  console.log('Touch only!');
};

<button onTouchStart={handleTouch}>
  Tap Me
</button>

// ✅ SOLUTION 3: Use our gesture hook
const { handlers } = useTouchGestures({
  onTap: () => console.log('Unified tap!'),
});

<button {...handlers}>Tap Me</button>
```

### 2. Fixed Positioning on Mobile Safari

**Problem:** Fixed elements scroll with virtual keyboard or have rendering issues.

```tsx
// ❌ WRONG: Fixed header breaks with keyboard
<header className="fixed top-0 w-full">
  Fixed Header
</header>

// ✅ SOLUTION 1: Use sticky within scroll container
<div className="overflow-auto h-screen">
  <header className="sticky top-0 z-10">
    Sticky Header
  </header>
  <main>Content</main>
</div>

// ✅ SOLUTION 2: Transform-based positioning (from our BottomSheet)
<div
  className="fixed bottom-0"
  style={{
    transform: `translateY(${offset}px)`, // GPU-accelerated
    willChange: 'transform',
  }}
>
  Bottom Sheet
</div>
```

### 3. 300ms Click Delay

**Problem:** Mobile browsers delay clicks to detect double-tap zoom.

```html
<!-- ✅ SOLUTION 1: Viewport meta tag (already in index.html) -->
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
```

```css
/* ✅ SOLUTION 2: CSS touch-action property */
button {
  touch-action: manipulation; /* Removes 300ms delay */
}

/* Apply globally */
* {
  touch-action: manipulation;
}
```

```tsx
// ✅ SOLUTION 3: Use our Pointer Events hook
const { handlers } = useTouchGestures({
  onTap: handleAction, // No delay!
});

<button {...handlers}>Instant Response</button>
```

### 4. Viewport Height Issues

**Problem:** `100vh` includes browser chrome on mobile, causing overflow when address bar is visible.

```css
/* ❌ WRONG: Includes address bar */
.full-screen {
  height: 100vh; /* Causes vertical overflow */
}

/* ✅ SOLUTION 1: Dynamic viewport units (modern browsers) */
.full-screen {
  height: 100dvh; /* Dynamic viewport height */
  height: 100svh; /* Small viewport height (address bar visible) */
  height: 100lvh; /* Large viewport height (address bar hidden) */
}

/* ✅ SOLUTION 2: CSS variable fallback (from our codebase) */
.full-screen {
  height: calc(var(--vh, 1vh) * 100);
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
  window.addEventListener('orientationchange', setVH);

  return () => {
    window.removeEventListener('resize', setVH);
    window.removeEventListener('orientationchange', setVH);
  };
}, []);
```

### 5. Horizontal Scroll on Small Screens

**Problem:** Fixed-width elements cause horizontal overflow.

```css
/* ❌ WRONG: Fixed width exceeds viewport */
.container {
  width: 400px; /* Overflows on mobile */
}

.grid {
  display: grid;
  grid-template-columns: 200px 200px 200px; /* Total 600px */
}

/* ✅ SOLUTION: Responsive sizing */
.container {
  width: 100%;
  max-width: 400px;
  padding: 0 1rem; /* Breathing room */
  box-sizing: border-box;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}
```

**Debug horizontal overflow:**

```tsx
// Development helper
if (import.meta.env.DEV) {
  useEffect(() => {
    const checkOverflow = () => {
      const hasOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
      if (hasOverflow) {
        console.warn('Horizontal overflow detected!', {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        });

        // Find offending elements
        document.querySelectorAll('*').forEach((el) => {
          if (el.scrollWidth > document.documentElement.clientWidth) {
            console.log('Overflow element:', el);
          }
        });
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);
}
```

---

## 📦 Quick Reference

### Breakpoints

From `src/constants/responsive.ts`:

```typescript
export const BREAKPOINTS = {
  mobile: {
    max: 767,
    minTouchTarget: 44, // Apple HIG
    spacing: 16,
  },
  tablet: {
    min: 768,
    max: 1023,
    minTouchTarget: 44,
    spacing: 20,
  },
  desktop: {
    min: 1024,
    minTouchTarget: 32,
    spacing: 24,
  },
} as const;
```

### Touch Target Sizes

| Element | Mobile | Desktop | Notes |
|---------|--------|---------|-------|
| Primary Button | 44px min | 40px | WCAG AAA |
| Icon Button | 44×44px | 32×32px | Menu, settings |
| Department Card | 44px height | 36px | Tap area |
| Checkbox | 24×24px | 20×20px | With 44px tap area |
| Drag Handle | 32×32px | N/A | Bottom sheet |

### Safe Spacing

| Type | Mobile | Desktop | Context |
|------|--------|---------|---------|
| Between targets | 16px | 12px | Comfortable tapping |
| Screen edges | 16px | 24px | Prevent accidental edge taps |
| Section padding | 16-24px | 32-48px | Visual breathing room |

### Animation Durations

From `src/constants/mobileConstants.ts`:

```typescript
export const MOBILE_ANIMATIONS = {
  duration: {
    instant: 100,   // Feels immediate
    fast: 200,      // Quick feedback
    normal: 300,    // Standard transitions
    slow: 500,      // Deliberate, attention-drawing
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',     // Material standard
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',   // Enter screen
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',     // Exit screen
    sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',        // Crisp movement
  },
} as const;
```

---

## 🔗 Related Documentation

- **[PWA Implementation Guide](./PWA_IMPLEMENTATION.md)** - Progressive Web App setup and caching
- **[Accessibility Guide](./ACCESSIBILITY_GUIDE.md)** - WCAG compliance and inclusive design
- **[Design System Guide](./DESIGN_SYSTEM_GUIDE.md)** - Component library and design tokens
- **[Responsive Architecture](./RESPONSIVE_ARCHITECTURE.md)** - Breakpoint strategy and layouts
- **[Touch Interaction System](./touch-interaction-system.md)** - Gesture detection deep dive
- **[Real Device Testing](./REAL_DEVICE_TESTING.md)** - Physical device testing protocols

---

**Last Updated:** 2025-10-09
**Maintainer:** Development Team
**Review Cycle:** Before adding new mobile features
**Version:** 2.0 (Comprehensive Edition)
