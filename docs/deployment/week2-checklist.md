# Week 2 Deployment Checklist - Plan E

**Timeline:** 16-20 hours total
**Goal:** Production deployment with monitoring, analytics, and validation
**Current Status:** Week 1 complete (842/914 tests passing - 92.1%)

---

## Pre-Deployment Status Check

### Current State Assessment
- [ ] **Test Suite Status:** 842/914 passing (92.1%)
  - 1 known flaky test: `performance.test.ts` - Animation FPS (marginal failure: 62.46 vs 62.00)
  - Action: Document flaky test, monitor in production
- [ ] **Build Validation:** Run `npm run build` - verify no errors
- [ ] **TypeScript:** Run `npm run typecheck` - verify no type errors
- [ ] **Linting:** Run `npm run lint` - verify code quality
- [ ] **Mobile Support:** v1.0 complete (touch-optimized, PWA-enabled)
- [ ] **Accessibility:** WCAG AAA compliant (verified)

### Git Status
- [ ] Current branch: `feature/plan-e-week1-quality-fixes`
- [ ] All changes committed
- [ ] Clean working directory
- [ ] Ready to merge to `main`

---

## Task 1: Vercel Deployment Setup (3-4 hours)

### 1.1 Vercel Configuration Files

#### Create `vercel.json`
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "devCommand": "npm run dev",
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/service-worker.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/manifest.json",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/manifest+json"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

**Checklist:**
- [ ] Create `vercel.json` in project root
- [ ] Verify JSON syntax
- [ ] Test headers configuration locally

#### Update `vite.config.ts` for Vercel
```typescript
// Update base path for production
export default defineConfig({
  // Remove or make conditional:
  // base: '/colombia_department_puzzle/', // Only for GitHub Pages
  base: process.env.VERCEL ? '/' : '/colombia_department_puzzle/',
  // ... rest of config
});
```

**Checklist:**
- [ ] Update `vite.config.ts` with conditional base path
- [ ] Update `public/manifest.json` start_url and scope for Vercel
- [ ] Create separate manifest for each deployment target (optional)

### 1.2 Environment Variables Setup

#### Create `.env.example`
```env
# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GA_ENABLED=true

# Error Tracking
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
VITE_SENTRY_ENABLED=true
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_TRACES_SAMPLE_RATE=0.1
VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.1
VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1.0

# Deployment
VITE_APP_VERSION=1.0.0
VITE_DEPLOY_ENV=production
VITE_BASE_URL=https://colombia-puzzle.vercel.app

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
```

**Checklist:**
- [ ] Create `.env.example` in project root
- [ ] Add `.env` to `.gitignore` (verify)
- [ ] Document all environment variables
- [ ] Create `.env.local` for local development

### 1.3 Vercel Project Setup

**Via Vercel CLI:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Initialize project
vercel

# Link to existing project or create new
# Follow prompts:
# - Project name: colombia-departments-puzzle
# - Framework preset: Vite
# - Build command: npm run build
# - Output directory: dist
```

**Checklist:**
- [ ] Install Vercel CLI globally
- [ ] Login to Vercel account
- [ ] Run `vercel` to initialize project
- [ ] Choose production-ready project name
- [ ] Verify framework detection (Vite)
- [ ] Confirm build settings

**Via Vercel Dashboard:**
1. Go to https://vercel.com/new
2. Import Git repository
3. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

**Checklist:**
- [ ] Connect GitHub repository to Vercel
- [ ] Configure framework settings
- [ ] Set up automatic deployments from `main` branch
- [ ] Configure preview deployments for PRs

### 1.4 Environment Variables in Vercel

**Add via Dashboard:**
1. Project Settings → Environment Variables
2. Add each variable from `.env.example`
3. Set appropriate scopes:
   - Production
   - Preview
   - Development

**Checklist:**
- [ ] Add `VITE_GA_MEASUREMENT_ID` (production only)
- [ ] Add `VITE_SENTRY_DSN` (all environments)
- [ ] Add `VITE_SENTRY_ENVIRONMENT` (environment-specific)
- [ ] Add `VITE_APP_VERSION` (production)
- [ ] Add all feature flags
- [ ] Test environment variable access in preview deploy

### 1.5 Domain Configuration

**Custom Domain Setup:**
```bash
# Add custom domain via CLI
vercel domains add colombia-puzzle.com

# Or via dashboard: Project Settings → Domains
```

**Checklist:**
- [ ] Decide on domain name (optional for Week 2)
- [ ] Configure DNS records if using custom domain
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Configure domain redirects if needed
- [ ] Test SSL certificate

### 1.6 Build & Deploy

**Initial Deployment:**
```bash
# Deploy to production
vercel --prod

# Verify deployment
# Check logs for any build errors
```

**Checklist:**
- [ ] Merge Week 1 fixes to `main` branch
- [ ] Push to GitHub (triggers automatic deployment)
- [ ] Monitor Vercel build logs
- [ ] Verify successful deployment
- [ ] Check deployment URL
- [ ] Verify all assets load correctly
- [ ] Test PWA installation on deployed site

### 1.7 Vercel-Specific Optimizations

**Update `package.json` scripts:**
```json
{
  "scripts": {
    "build": "vite build",
    "build:vercel": "vite build",
    "preview": "vite preview",
    "preview:vercel": "vercel dev"
  }
}
```

**Checklist:**
- [ ] Add Vercel-specific build script
- [ ] Configure build output optimization
- [ ] Enable build caching in Vercel
- [ ] Set up deployment notifications (Slack/Email)

---

## Task 2: Google Analytics + Sentry Setup (4-5 hours)

### 2.1 Google Analytics 4 Setup

#### Create GA4 Property
1. Go to https://analytics.google.com
2. Admin → Create Property
3. Property name: "Colombia Departments Puzzle"
4. Reporting time zone: America/Bogota
5. Currency: Colombian Peso (COP)
6. Create Data Stream → Web
7. Website URL: https://colombia-puzzle.vercel.app
8. Copy Measurement ID (format: G-XXXXXXXXXX)

**Checklist:**
- [ ] Create GA4 property
- [ ] Set up web data stream
- [ ] Copy Measurement ID
- [ ] Add to Vercel environment variables
- [ ] Configure enhanced measurement (page views, scrolls, outbound clicks)

#### Install gtag.js Library
```bash
npm install --save-dev @types/gtag.js
```

**Checklist:**
- [ ] Install types for TypeScript support
- [ ] Update `tsconfig.json` if needed

#### Create Analytics Utility

**Create `src/utils/analytics.ts`:**
```typescript
/**
 * Google Analytics 4 Integration
 * Tracks user events, page views, and custom metrics
 */

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

interface AnalyticsConfig {
  measurementId: string;
  enabled: boolean;
  debug?: boolean;
}

interface EventParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: any;
}

class Analytics {
  private config: AnalyticsConfig;
  private initialized = false;

  constructor() {
    this.config = {
      measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
      enabled: import.meta.env.VITE_GA_ENABLED === 'true',
      debug: import.meta.env.DEV,
    };
  }

  /**
   * Initialize Google Analytics
   */
  init(): void {
    if (!this.config.enabled || !this.config.measurementId) {
      console.warn('Analytics disabled or missing measurement ID');
      return;
    }

    if (this.initialized) {
      console.warn('Analytics already initialized');
      return;
    }

    // Load gtag.js script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.measurementId}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer!.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', this.config.measurementId, {
      send_page_view: false, // We'll send manually
      debug_mode: this.config.debug,
    });

    this.initialized = true;

    if (this.config.debug) {
      console.log('Analytics initialized:', this.config.measurementId);
    }
  }

  /**
   * Track page view
   */
  pageView(path: string, title?: string): void {
    if (!this.isEnabled()) return;

    window.gtag?.('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
    });

    if (this.config.debug) {
      console.log('Analytics pageView:', { path, title });
    }
  }

  /**
   * Track custom event
   */
  event(eventName: string, params?: EventParams): void {
    if (!this.isEnabled()) return;

    window.gtag?.('event', eventName, params);

    if (this.config.debug) {
      console.log('Analytics event:', eventName, params);
    }
  }

  /**
   * Track game events
   */
  gameEvent(action: string, params?: EventParams): void {
    this.event(action, {
      event_category: 'Game',
      ...params,
    });
  }

  /**
   * Track puzzle completion
   */
  puzzleComplete(
    difficulty: string,
    timeSeconds: number,
    moveCount: number
  ): void {
    this.gameEvent('puzzle_complete', {
      event_label: difficulty,
      difficulty,
      time_seconds: timeSeconds,
      move_count: moveCount,
      value: Math.round(1000 / timeSeconds), // Score based on speed
    });
  }

  /**
   * Track study session
   */
  studySession(region: string, cardsStudied: number, accuracy: number): void {
    this.gameEvent('study_session_complete', {
      event_label: region,
      region,
      cards_studied: cardsStudied,
      accuracy_percent: accuracy,
      value: cardsStudied,
    });
  }

  /**
   * Track PWA installation
   */
  pwaInstall(): void {
    this.event('pwa_install', {
      event_category: 'PWA',
    });
  }

  /**
   * Track errors (for non-Sentry tracked errors)
   */
  error(errorMessage: string, errorDetails?: Record<string, any>): void {
    this.event('exception', {
      description: errorMessage,
      fatal: false,
      ...errorDetails,
    });
  }

  /**
   * Set user properties
   */
  setUserProperty(propertyName: string, value: any): void {
    if (!this.isEnabled()) return;

    window.gtag?.('set', 'user_properties', {
      [propertyName]: value,
    });
  }

  private isEnabled(): boolean {
    return this.initialized && this.config.enabled;
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Auto-initialize on import
if (typeof window !== 'undefined') {
  analytics.init();
}
```

**Checklist:**
- [ ] Create `src/utils/analytics.ts`
- [ ] Implement all tracking methods
- [ ] Add TypeScript types for gtag
- [ ] Test in development mode (debug: true)
- [ ] Verify events in GA4 DebugView

#### Integrate Analytics into App

**Update `src/App.tsx`:**
```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from './utils/analytics';

function App() {
  const location = useLocation();

  // Track page views on route change
  useEffect(() => {
    analytics.pageView(location.pathname, document.title);
  }, [location]);

  // Track PWA installation
  useEffect(() => {
    window.addEventListener('appinstalled', () => {
      analytics.pwaInstall();
    });
  }, []);

  return (
    // ... app content
  );
}
```

**Update game components:**
```typescript
// In PuzzleGame.tsx - track puzzle completion
const handlePuzzleComplete = () => {
  analytics.puzzleComplete(
    difficulty,
    elapsedTime,
    moveCount
  );
  // ... rest of completion logic
};

// In StudyMode.tsx - track study sessions
const handleSessionComplete = () => {
  analytics.studySession(
    selectedRegion,
    completedCards,
    accuracy
  );
  // ... rest of session logic
};
```

**Checklist:**
- [ ] Import analytics in `App.tsx`
- [ ] Track page views on route changes
- [ ] Track PWA installation
- [ ] Track puzzle completions
- [ ] Track study sessions
- [ ] Track user interactions (button clicks, mode switches)
- [ ] Test all events in GA4 DebugView

### 2.2 Sentry Setup for Error Tracking

#### Create Sentry Project
1. Go to https://sentry.io
2. Create new project
3. Platform: React
4. Project name: "colombia-departments-puzzle"
5. Copy DSN (Data Source Name)

**Checklist:**
- [ ] Create Sentry account/organization
- [ ] Create React project
- [ ] Copy DSN
- [ ] Add DSN to Vercel environment variables

#### Install Sentry SDK
```bash
npm install --save @sentry/react @sentry/vite-plugin
```

**Checklist:**
- [ ] Install Sentry React SDK
- [ ] Install Vite plugin for source maps

#### Configure Sentry

**Create `src/utils/sentry.ts`:**
```typescript
/**
 * Sentry Error Tracking Configuration
 * Captures errors, performance traces, and session replays
 */

import * as Sentry from '@sentry/react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import { useEffect } from 'react';

interface SentryConfig {
  dsn: string;
  enabled: boolean;
  environment: string;
  tracesSampleRate: number;
  replaysSessionSampleRate: number;
  replaysOnErrorSampleRate: number;
}

/**
 * Initialize Sentry error tracking
 */
export function initSentry(): void {
  const config: SentryConfig = {
    dsn: import.meta.env.VITE_SENTRY_DSN || '',
    enabled: import.meta.env.VITE_SENTRY_ENABLED === 'true',
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development',
    tracesSampleRate:
      parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE) || 0.1,
    replaysSessionSampleRate:
      parseFloat(import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE) ||
      0.1,
    replaysOnErrorSampleRate:
      parseFloat(import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE) ||
      1.0,
  };

  if (!config.enabled || !config.dsn) {
    console.warn('Sentry disabled or missing DSN');
    return;
  }

  Sentry.init({
    dsn: config.dsn,
    environment: config.environment,

    // Release tracking
    release: `colombia-puzzle@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,

    // Performance monitoring
    integrations: [
      // React Router integration
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      // Session replay
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Performance traces
    tracesSampleRate: config.tracesSampleRate,

    // Session replays
    replaysSessionSampleRate: config.replaysSessionSampleRate,
    replaysOnErrorSampleRate: config.replaysOnErrorSampleRate,

    // Filter out certain errors
    beforeSend(event, hint) {
      // Filter out browser extension errors
      if (
        event.exception?.values?.[0]?.value?.includes('extension://') ||
        event.exception?.values?.[0]?.value?.includes('moz-extension://')
      ) {
        return null;
      }

      // Filter out known harmless errors
      const message = event.exception?.values?.[0]?.value || '';
      const harmlessErrors = [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
      ];

      if (harmlessErrors.some((err) => message.includes(err))) {
        return null;
      }

      return event;
    },
  });

  // Set user context (optional)
  Sentry.setUser({
    id: localStorage.getItem('user_id') || 'anonymous',
  });

  console.log('Sentry initialized:', config.environment);
}

/**
 * Manually capture exception
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (context) {
    Sentry.setContext('custom', context);
  }
  Sentry.captureException(error);
}

/**
 * Manually capture message
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category?: string,
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
}

/**
 * Set user context
 */
export function setUser(userId: string, userData?: Record<string, any>) {
  Sentry.setUser({
    id: userId,
    ...userData,
  });
}

/**
 * Clear user context (on logout)
 */
export function clearUser() {
  Sentry.setUser(null);
}

// Export Sentry for ErrorBoundary usage
export { Sentry };
```

**Checklist:**
- [ ] Create `src/utils/sentry.ts`
- [ ] Configure all Sentry options
- [ ] Implement error filtering
- [ ] Add user context tracking
- [ ] Test error capture

#### Update Vite Config for Source Maps

**Update `vite.config.ts`:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ /* ... */ }),

    // Sentry plugin for uploading source maps
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,

      // Only upload in production builds
      disable: process.env.NODE_ENV !== 'production',

      // Upload source maps
      sourcemaps: {
        assets: './dist/assets/**',
        ignore: ['node_modules'],
        filesToDeleteAfterUpload: ['./dist/assets/**/*.map'],
      },
    }),
  ],

  build: {
    sourcemap: true, // Generate source maps for production
    // ... rest of build config
  },
});
```

**Checklist:**
- [ ] Add Sentry Vite plugin
- [ ] Configure source map upload
- [ ] Add Sentry auth token to Vercel env vars
- [ ] Test source map generation

#### Integrate Sentry into App

**Update `src/main.tsx`:**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { initSentry } from './utils/sentry';
import App from './App';
import './index.css';

// Initialize Sentry before app render
initSentry();

// Wrap app with Sentry profiler
const SentryApp = Sentry.withProfiler(App);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="error-boundary">
          <h1>Something went wrong</h1>
          <p>{error.message}</p>
          <button onClick={resetError}>Try again</button>
        </div>
      )}
      showDialog
    >
      <BrowserRouter>
        <SentryApp />
      </BrowserRouter>
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
```

**Checklist:**
- [ ] Initialize Sentry before app render
- [ ] Wrap app with `Sentry.ErrorBoundary`
- [ ] Add profiler for performance tracking
- [ ] Create error fallback UI
- [ ] Test error boundary with intentional error

#### Add Error Tracking to Critical Paths

**Game error tracking:**
```typescript
// In game components
import { addBreadcrumb, captureException } from '../utils/sentry';

try {
  // Critical game logic
} catch (error) {
  addBreadcrumb('Game state error', 'game', {
    difficulty,
    moveCount,
    elapsedTime,
  });
  captureException(error as Error);
  // Handle error gracefully
}
```

**Checklist:**
- [ ] Add error tracking to puzzle game logic
- [ ] Add tracking to study mode
- [ ] Add tracking to PWA service worker
- [ ] Add breadcrumbs for user actions
- [ ] Test error capture in Sentry dashboard

### 2.3 Privacy Considerations

**Create `src/components/CookieConsent.tsx`:**
```typescript
/**
 * Cookie consent banner for GDPR compliance
 */
export function CookieConsent() {
  const [consent, setConsent] = useState(
    localStorage.getItem('analytics-consent') === 'true'
  );

  if (consent) return null;

  return (
    <div className="cookie-banner">
      <p>
        We use analytics to improve your experience.
        <a href="/privacy">Learn more</a>
      </p>
      <button onClick={() => {
        localStorage.setItem('analytics-consent', 'true');
        setConsent(true);
        analytics.init();
      }}>
        Accept
      </button>
    </div>
  );
}
```

**Checklist:**
- [ ] Create cookie consent component
- [ ] Implement consent storage
- [ ] Update privacy policy
- [ ] Add opt-out mechanism
- [ ] Test consent flow

---

## Task 3: Production Smoke Testing (2-3 hours)

### 3.1 Automated Smoke Tests

**Create `src/tests/e2e/smoke.spec.ts`:**
```typescript
import { test, expect } from '@playwright/test';

const PRODUCTION_URL = process.env.VITE_BASE_URL || 'http://localhost:3000';

test.describe('Production Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRODUCTION_URL);
  });

  test('homepage loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Colombia/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('PWA manifest is accessible', async ({ page }) => {
    const response = await page.goto(`${PRODUCTION_URL}/manifest.json`);
    expect(response?.status()).toBe(200);

    const manifest = await response?.json();
    expect(manifest.name).toContain('Colombia');
  });

  test('service worker registers', async ({ page }) => {
    const swPromise = page.evaluate(() => {
      return navigator.serviceWorker.ready.then(() => true);
    });

    await expect(swPromise).resolves.toBe(true);
  });

  test('assets load with correct headers', async ({ page }) => {
    const response = await page.waitForResponse(
      (resp) => resp.url().includes('/assets/') && resp.status() === 200
    );

    const headers = response.headers();
    expect(headers['cache-control']).toContain('max-age');
  });

  test('puzzle game is playable', async ({ page }) => {
    await page.click('text=Play');
    await expect(page.locator('[data-testid="puzzle-game"]')).toBeVisible();

    // Try dragging a department
    const department = page.locator('[data-testid="department-piece"]').first();
    await department.dragTo(page.locator('[data-testid="drop-zone"]').first());
  });

  test('study mode is accessible', async ({ page }) => {
    await page.click('text=Study');
    await expect(page.locator('[data-testid="study-mode"]')).toBeVisible();
  });

  test('accessibility menu works', async ({ page }) => {
    await page.click('[aria-label="Accessibility settings"]');
    await expect(page.locator('text=Color Mode')).toBeVisible();
  });

  test('analytics script loads (if enabled)', async ({ page }) => {
    const hasGtag = await page.evaluate(() => {
      return typeof window.gtag !== 'undefined';
    });

    // Should be true in production with GA enabled
    if (process.env.VITE_GA_ENABLED === 'true') {
      expect(hasGtag).toBe(true);
    }
  });

  test('error boundary catches errors', async ({ page }) => {
    // Inject an error
    await page.evaluate(() => {
      throw new Error('Test error');
    });

    // Error boundary should show fallback
    // (Depends on implementation)
  });

  test('mobile viewport renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();

    // Mobile navigation should be present
    await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
  });
});
```

**Checklist:**
- [ ] Create smoke test suite
- [ ] Test all critical user paths
- [ ] Test PWA functionality
- [ ] Test analytics loading
- [ ] Run tests against production URL
- [ ] Configure CI to run smoke tests post-deploy

### 3.2 Manual Smoke Testing Checklist

**Core Functionality:**
- [ ] Homepage loads without errors
- [ ] All navigation links work
- [ ] Puzzle game loads and is playable
- [ ] Study mode loads and is functional
- [ ] Settings/accessibility menu works
- [ ] All images and assets load
- [ ] No console errors

**PWA Features:**
- [ ] Service worker registers successfully
- [ ] App can be installed (Add to Home Screen)
- [ ] App works offline (after initial load)
- [ ] Update prompt appears when new version deployed
- [ ] Manifest.json is valid and accessible
- [ ] Icons display correctly (192x192, 512x512)

**Performance:**
- [ ] Initial page load < 3 seconds
- [ ] Lighthouse Performance score > 90
- [ ] No layout shifts (CLS < 0.1)
- [ ] Smooth animations (60fps)
- [ ] Touch interactions feel responsive

**Analytics:**
- [ ] Page views tracked in GA4 Real-time
- [ ] Events appear in GA4 DebugView
- [ ] Puzzle completion tracked
- [ ] Study session tracked
- [ ] PWA install tracked

**Error Tracking:**
- [ ] Sentry receives test error
- [ ] Error boundary displays on error
- [ ] Source maps work (readable stack traces)
- [ ] Session replay captures interactions
- [ ] Performance traces appear in Sentry

**Security:**
- [ ] HTTPS enabled (Vercel automatic)
- [ ] Security headers present (check DevTools Network)
- [ ] No mixed content warnings
- [ ] CSP headers configured (optional)

**SEO & Metadata:**
- [ ] Meta tags present (title, description)
- [ ] Open Graph tags for social sharing
- [ ] Favicon displays correctly
- [ ] robots.txt accessible (if needed)

---

## Task 4: Real Device Testing Validation (3-4 hours)

### 4.1 Device Testing Matrix

**Minimum Coverage:**

| Device Category | Device | OS | Browser | Priority |
|----------------|--------|----|---------| ---------|
| iPhone | iPhone 12+ | iOS 15+ | Safari | High |
| iPhone | iPhone SE | iOS 15+ | Safari | Medium |
| Android Flagship | Samsung Galaxy S21+ | Android 11+ | Chrome | High |
| Android Mid-range | Pixel 5a | Android 11+ | Chrome | Medium |
| Tablet | iPad Air | iPadOS 15+ | Safari | Medium |
| Tablet | Samsung Galaxy Tab | Android 11+ | Chrome | Low |
| Desktop | Mac | macOS | Chrome, Safari | High |
| Desktop | Windows | Windows 10+ | Chrome, Edge | High |

**Checklist:**
- [ ] Test on minimum 2 iOS devices
- [ ] Test on minimum 2 Android devices
- [ ] Test on minimum 1 tablet
- [ ] Test on minimum 2 desktop browsers

### 4.2 Testing Procedures per Device

**For Each Device:**

1. **Initial Load Test:**
   - [ ] App loads without errors
   - [ ] All content visible
   - [ ] No layout issues
   - [ ] Images load correctly

2. **Touch/Interaction Test:**
   - [ ] Touch targets minimum 44x44px (WCAG AAA)
   - [ ] Tap feedback visible within 100ms
   - [ ] Drag and drop works smoothly
   - [ ] Scroll is smooth (no jank)
   - [ ] Gestures feel natural

3. **PWA Test:**
   - [ ] Install prompt appears (Android)
   - [ ] Add to Home Screen works (iOS)
   - [ ] App opens in standalone mode
   - [ ] App icon displays correctly
   - [ ] Splash screen shows (Android)

4. **Offline Test:**
   - [ ] Disconnect network
   - [ ] App still loads from cache
   - [ ] Offline indicator appears
   - [ ] Reconnect - app syncs

5. **Performance Test:**
   - [ ] Animations run at 60fps
   - [ ] No lag during interactions
   - [ ] Rapid taps don't cause issues
   - [ ] Memory usage stays stable

6. **Accessibility Test:**
   - [ ] Screen reader announces content
   - [ ] Keyboard navigation works
   - [ ] Focus indicators visible
   - [ ] Color modes work correctly

7. **Game-Specific Test:**
   - [ ] Puzzle pieces draggable
   - [ ] Drop zones highlight correctly
   - [ ] Completion animation plays
   - [ ] Score/time tracked correctly
   - [ ] Study mode flashcards work

### 4.3 Device Testing Tools

**Remote Device Testing:**
- [ ] BrowserStack (https://www.browserstack.com)
- [ ] LambdaTest (https://www.lambdatest.com)
- [ ] Sauce Labs (https://saucelabs.com)

**Physical Device Access:**
- [ ] Use personal devices
- [ ] Ask friends/family to test
- [ ] Visit Apple Store / carrier store for testing

**Developer Tools:**
- [ ] Chrome DevTools Device Mode
- [ ] Safari Responsive Design Mode
- [ ] Firefox Responsive Design Mode

**Checklist:**
- [ ] Set up remote testing account (BrowserStack free trial)
- [ ] Test on 5+ real devices
- [ ] Document issues found per device
- [ ] Create device compatibility matrix

### 4.4 Issue Tracking Template

**For Each Issue Found:**
```markdown
## Issue: [Brief Description]

**Device:** [Device Name + OS Version]
**Browser:** [Browser + Version]
**Severity:** [Critical / High / Medium / Low]
**Reproducible:** [Always / Sometimes / Once]

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots/Video:**
[Attach if possible]

**Workaround:**
[If any]

**Fix Priority:**
[Immediate / Week 3 / Backlog]
```

**Checklist:**
- [ ] Create `docs/deployment/device-testing-results.md`
- [ ] Document all issues found
- [ ] Prioritize fixes
- [ ] Create GitHub issues for critical bugs
- [ ] Update compatibility matrix

---

## Task 5: Performance Audit + Documentation (4-5 hours)

### 5.1 Lighthouse Audit

**Run Lighthouse on Production:**
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://colombia-puzzle.vercel.app \
  --output html \
  --output-path ./docs/deployment/lighthouse-report.html \
  --view

# Run mobile audit
lighthouse https://colombia-puzzle.vercel.app \
  --preset=mobile \
  --output html \
  --output-path ./docs/deployment/lighthouse-mobile-report.html

# Run desktop audit
lighthouse https://colombia-puzzle.vercel.app \
  --preset=desktop \
  --output html \
  --output-path ./docs/deployment/lighthouse-desktop-report.html
```

**Target Scores (Mobile):**
- [ ] Performance: 90+
- [ ] Accessibility: 100
- [ ] Best Practices: 100
- [ ] SEO: 100
- [ ] PWA: Pass all checks

**Target Scores (Desktop):**
- [ ] Performance: 95+
- [ ] Accessibility: 100
- [ ] Best Practices: 100
- [ ] SEO: 100

**Checklist:**
- [ ] Run Lighthouse audit on production
- [ ] Save HTML reports
- [ ] Review all recommendations
- [ ] Fix critical issues (score < 90)
- [ ] Document improvements made

### 5.2 Core Web Vitals Analysis

**Measure Real User Metrics:**
```typescript
// Add to src/utils/performance.ts
export function measureWebVitals() {
  if (typeof window === 'undefined') return;

  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS((metric) => {
      analytics.event('web_vitals', {
        metric_name: 'CLS',
        value: metric.value,
        metric_id: metric.id,
      });
    });

    getFID((metric) => {
      analytics.event('web_vitals', {
        metric_name: 'FID',
        value: metric.value,
        metric_id: metric.id,
      });
    });

    getFCP((metric) => {
      analytics.event('web_vitals', {
        metric_name: 'FCP',
        value: metric.value,
        metric_id: metric.id,
      });
    });

    getLCP((metric) => {
      analytics.event('web_vitals', {
        metric_name: 'LCP',
        value: metric.value,
        metric_id: metric.id,
      });
    });

    getTTFB((metric) => {
      analytics.event('web_vitals', {
        metric_name: 'TTFB',
        value: metric.value,
        metric_id: metric.id,
      });
    });
  });
}
```

**Core Web Vitals Targets:**
- [ ] LCP (Largest Contentful Paint): < 2.5s
- [ ] FID (First Input Delay): < 100ms
- [ ] CLS (Cumulative Layout Shift): < 0.1
- [ ] FCP (First Contentful Paint): < 1.8s
- [ ] TTFB (Time to First Byte): < 600ms

**Checklist:**
- [ ] Install `web-vitals` package
- [ ] Implement Web Vitals measurement
- [ ] Send metrics to GA4
- [ ] Monitor in GA4 for 24-48 hours
- [ ] Document baseline metrics

### 5.3 Bundle Size Analysis

**Analyze Bundle:**
```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Update vite.config.ts to include visualizer
# Build and analyze
npm run build
```

**Target Bundle Sizes:**
- [ ] Initial JS bundle: < 200 KB (gzipped)
- [ ] Initial CSS bundle: < 50 KB (gzipped)
- [ ] Total page weight: < 500 KB
- [ ] Time to Interactive: < 3.5s (mobile)

**Checklist:**
- [ ] Analyze bundle composition
- [ ] Identify large dependencies
- [ ] Check for duplicate dependencies
- [ ] Verify code splitting effectiveness
- [ ] Document bundle sizes

### 5.4 Network Performance

**Check CDN and Caching:**
- [ ] Verify Vercel Edge Network is active
- [ ] Check cache headers on static assets
- [ ] Verify service worker caching works
- [ ] Test from different geographic locations
- [ ] Use WebPageTest for waterfall analysis

**Tools:**
```bash
# Test from multiple locations
# https://www.webpagetest.org/
# - Test Location: Virginia, USA
# - Test Location: London, UK
# - Test Location: Singapore
# - Test Location: Bogotá, Colombia (important!)
```

**Checklist:**
- [ ] Run WebPageTest from 3+ locations
- [ ] Check TTFB across locations
- [ ] Verify CDN is serving assets
- [ ] Document load times per region
- [ ] Identify geographic performance issues

### 5.5 Memory and CPU Profiling

**Chrome DevTools Performance:**
1. Open DevTools → Performance
2. Record 10-second interaction session
3. Analyze:
   - Frame rate (should be 60fps)
   - CPU usage (should be reasonable)
   - Memory usage (should be stable)
   - Long tasks (should be < 50ms)

**Memory Leaks:**
1. Open DevTools → Memory
2. Take heap snapshot
3. Interact with app (play game, study mode)
4. Take another snapshot
5. Compare - detached DOM nodes should be minimal

**Checklist:**
- [ ] Profile CPU during game play
- [ ] Check for memory leaks
- [ ] Verify 60fps during animations
- [ ] Check for long tasks (> 50ms)
- [ ] Document performance characteristics

### 5.6 Performance Documentation

**Create `docs/deployment/performance-report.md`:**

```markdown
# Production Performance Report

**Date:** [Date of audit]
**URL:** https://colombia-puzzle.vercel.app
**Version:** 1.0.0

## Lighthouse Scores

### Mobile
- Performance: XX/100
- Accessibility: XX/100
- Best Practices: XX/100
- SEO: XX/100
- PWA: Pass/Fail

### Desktop
- Performance: XX/100
- Accessibility: XX/100
- Best Practices: XX/100
- SEO: XX/100

## Core Web Vitals

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| LCP | X.XXs | < 2.5s | ✅/❌ |
| FID | XXms | < 100ms | ✅/❌ |
| CLS | X.XXX | < 0.1 | ✅/❌ |
| FCP | X.XXs | < 1.8s | ✅/❌ |
| TTFB | XXXms | < 600ms | ✅/❌ |

## Bundle Sizes

| Asset | Size (gzipped) | Target | Status |
|-------|----------------|--------|--------|
| JS (initial) | XXX KB | < 200 KB | ✅/❌ |
| CSS (initial) | XX KB | < 50 KB | ✅/❌ |
| Total page | XXX KB | < 500 KB | ✅/❌ |

## Load Times by Region

| Location | TTFB | Load Time | Status |
|----------|------|-----------|--------|
| Virginia, USA | XXXms | X.XXs | ✅/❌ |
| London, UK | XXXms | X.XXs | ✅/❌ |
| Singapore | XXXms | X.XXs | ✅/❌ |
| Bogotá, Colombia | XXXms | X.XXs | ✅/❌ |

## Recommendations

1. [Issue 1]
   - Impact: High/Medium/Low
   - Fix: [Description]
   - Priority: Week 3 / Backlog

2. [Issue 2]
   - ...

## Improvements Made

1. [Improvement 1] - Impact: +X points
2. [Improvement 2] - Impact: +X points

## Next Steps

- [ ] Action item 1
- [ ] Action item 2
```

**Checklist:**
- [ ] Create performance report
- [ ] Document all metrics
- [ ] Include screenshots of reports
- [ ] List recommendations prioritized
- [ ] Create GitHub issues for improvements

---

## Post-Deployment Monitoring Plan

### Week 2 Monitoring (Days 1-7)

**Daily Checks:**
- [ ] Check Vercel deployment status
- [ ] Review Sentry error dashboard
- [ ] Check GA4 real-time users
- [ ] Monitor Core Web Vitals in GA4
- [ ] Review Vercel analytics
- [ ] Check uptime/status

**Weekly Reviews:**
- [ ] Analyze error trends in Sentry
- [ ] Review user behavior in GA4
- [ ] Check performance regression
- [ ] Review device/browser distribution
- [ ] Analyze geographic traffic
- [ ] Review PWA install rate

### Monitoring Dashboards

**Google Analytics 4:**
- Real-time overview
- User engagement report
- Events report (custom game events)
- Web Vitals report
- Device category breakdown

**Sentry:**
- Issues dashboard
- Releases (track version deployments)
- Performance (transaction traces)
- Session replays (user sessions)

**Vercel:**
- Deployments
- Analytics (page views, devices)
- Speed Insights
- Logs

**Checklist:**
- [ ] Set up GA4 custom dashboard
- [ ] Configure Sentry alerts (Slack/Email)
- [ ] Set up Vercel deployment notifications
- [ ] Create weekly review checklist
- [ ] Schedule monitoring time daily

---

## Success Criteria for Week 2

### Deployment
- [x] App deployed to Vercel successfully
- [x] Custom domain configured (optional)
- [x] HTTPS enabled
- [x] Automatic deployments from main branch
- [x] Preview deployments for PRs

### Analytics
- [x] Google Analytics 4 tracking active
- [x] Page views tracked
- [x] Custom events tracked (puzzle, study)
- [x] User consent implemented

### Error Tracking
- [x] Sentry capturing errors
- [x] Source maps uploaded
- [x] Error boundary implemented
- [x] Session replays enabled

### Testing
- [x] Production smoke tests passing
- [x] Tested on 5+ real devices
- [x] No critical bugs
- [x] PWA works on mobile

### Performance
- [x] Lighthouse Performance > 90 (mobile)
- [x] Core Web Vitals meet targets
- [x] Bundle sizes within targets
- [x] Load time < 3s globally

### Documentation
- [x] Performance report created
- [x] Device testing results documented
- [x] Deployment guide updated
- [x] Monitoring plan established

---

## Week 3 Preview

**Potential Focus Areas:**
1. Performance optimization based on real user data
2. Bug fixes from device testing
3. SEO improvements
4. Social sharing features
5. Additional game modes
6. Localization (Spanish language support)
7. Advanced analytics (funnel tracking, cohort analysis)

---

## Troubleshooting Common Issues

### Vercel Deployment Fails

**Issue:** Build fails in Vercel but works locally

**Solutions:**
- Check Node version match (use `.nvmrc`)
- Verify all environment variables set
- Check build logs for missing dependencies
- Ensure `package-lock.json` committed
- Try `npm ci` instead of `npm install`

### Analytics Not Tracking

**Issue:** Events not appearing in GA4

**Solutions:**
- Check GA4 DebugView (real-time debugging)
- Verify Measurement ID correct
- Check browser console for gtag errors
- Ensure user consent given
- Test in incognito mode (no ad blockers)

### Sentry Not Capturing Errors

**Issue:** Errors not appearing in Sentry

**Solutions:**
- Verify DSN correct
- Check Sentry is initialized before app render
- Test with intentional error
- Check browser console for Sentry errors
- Verify source maps uploaded

### PWA Not Installing

**Issue:** Install prompt doesn't appear

**Solutions:**
- Check manifest.json is valid
- Verify service worker registered
- Check HTTPS enabled
- Test on different device/browser
- Clear cache and try again
- Check for manifest errors in DevTools

### Performance Score Low

**Issue:** Lighthouse Performance < 90

**Common Causes:**
- Large images not optimized
- Render-blocking resources
- Unused JavaScript
- Long tasks (> 50ms)
- No code splitting

**Solutions:**
- Optimize images (WebP, lazy loading)
- Defer non-critical CSS/JS
- Remove unused dependencies
- Split large bundles
- Use React.lazy() for code splitting

---

## Appendix: Environment Variables Reference

```env
# Google Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GA_ENABLED=true

# Sentry Error Tracking
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
VITE_SENTRY_ENABLED=true
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_TRACES_SAMPLE_RATE=0.1
VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.1
VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1.0

# Sentry Build (for CI/CD)
SENTRY_ORG=your-org
SENTRY_PROJECT=colombia-departments-puzzle
SENTRY_AUTH_TOKEN=xxx

# Deployment
VITE_APP_VERSION=1.0.0
VITE_DEPLOY_ENV=production
VITE_BASE_URL=https://colombia-puzzle.vercel.app

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true

# Build
NODE_ENV=production
VERCEL=1
```

---

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Google Analytics 4 Setup](https://support.google.com/analytics/answer/9304153)
- [Sentry React Documentation](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)
- [Web Vitals](https://web.dev/vitals/)
- [WebPageTest](https://www.webpagetest.org/)
- [BrowserStack](https://www.browserstack.com/)

---

**End of Week 2 Checklist**

*Total Estimated Time: 16-20 hours*
*Completion Criteria: All 5 tasks completed, all success criteria met*
