# M11: Performance Optimization - Granular Task Breakdown

**Milestone:** Lighthouse 100/100/100/100, bundle < 500KB
**Total Effort:** 18 hours
**Total Tasks:** 45 tasks
**Risk Level:** Medium
**Dependencies:** M10 (updated dependencies)

---

## Task M11.1: Performance Baseline Audit

**Estimated Effort:** 2h
**Risk Level:** Low
**Assignable To:** perf-analyzer

**Input State:**
- No performance baseline
- Unknown bundle size
- No Lighthouse score

**Action Steps:**
1. Run Lighthouse audit:
   ```bash
   npx lighthouse http://localhost:5173 --output=html --output-path=./lighthouse-baseline.html
   ```
2. Analyze bundle:
   ```bash
   npm run build
   npx vite-bundle-visualizer
   ```
3. Create performance report:
   ```markdown
   ## Performance Baseline Report

   ### Lighthouse Scores
   - Performance: 87/100 (target: 100)
   - Accessibility: 95/100 (target: 100)
   - Best Practices: 92/100 (target: 100)
   - SEO: 90/100 (target: 100)

   ### Bundle Analysis
   - Total Bundle: 742KB gzipped (target: <500KB)
   - Largest Chunks:
     - vendor.js: 450KB (React, libraries)
     - main.js: 180KB (app code)
     - mapData.js: 112KB (SVG data)

   ### Core Web Vitals
   - LCP: 2.8s (target: <2.5s)
   - FID: 45ms (target: <100ms) ✓
   - CLS: 0.15 (target: <0.1)
   - FCP: 1.9s (target: <1.8s)
   - TTFB: 420ms (target: <600ms) ✓

   ### Improvement Opportunities
   1. Code splitting: Save 200KB+
   2. Image optimization: Save 50KB
   3. Tree shaking: Save 30KB
   4. Lazy loading: Improve LCP by 0.5s
   5. Layout optimization: Fix CLS
   ```
4. Prioritize improvements

**Output State:**
- File: `docs/performance-baseline.md`
- Lighthouse reports saved
- Bundle analysis complete
- Improvement roadmap

**Validation Command:**
```bash
npm run build
npx lighthouse http://localhost:5173
```

**Dependencies:**
- M10.60 (dependencies updated)

**Rollback Procedure:**
```bash
# Read-only audit
```

**Success Criteria:**
- [ ] Baseline documented
- [ ] Bundle analyzed
- [ ] Core Web Vitals measured
- [ ] Improvements prioritized

---

## Task M11.2: Implement Code Splitting

**Estimated Effort:** 3h
**Risk Level:** Medium
**Assignable To:** coder

**Input State:**
- Single bundle (742KB)
- All routes loaded upfront
- No lazy loading

**Action Steps:**
1. Convert routes to lazy loading:
   ```typescript
   // src/App.tsx
   import { lazy, Suspense } from 'react';
   import { Routes, Route } from 'react-router-dom';

   const Home = lazy(() => import('./pages/Home'));
   const Game = lazy(() => import('./pages/Game'));
   const Leaderboard = lazy(() => import('./pages/Leaderboard'));
   const Profile = lazy(() => import('./pages/Profile'));
   const Settings = lazy(() => import('./pages/Settings'));

   function App() {
     return (
       <Suspense fallback={<LoadingScreen />}>
         <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/game" element={<Game />} />
           <Route path="/leaderboard" element={<Leaderboard />} />
           <Route path="/profile" element={<Profile />} />
           <Route path="/settings" element={<Settings />} />
         </Routes>
       </Suspense>
     );
   }
   ```
2. Split large components:
   ```typescript
   // src/components/game/GameBoard.tsx
   const PuzzleGrid = lazy(() => import('./PuzzleGrid'));
   const DepartmentList = lazy(() => import('./DepartmentList'));

   export function GameBoard() {
     return (
       <div>
         <Suspense fallback={<Skeleton />}>
           <PuzzleGrid />
         </Suspense>
         <Suspense fallback={<Skeleton />}>
           <DepartmentList />
         </Suspense>
       </div>
     );
   }
   ```
3. Configure Vite chunking:
   ```typescript
   // vite.config.ts
   export default defineConfig({
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             'react-vendor': ['react', 'react-dom', 'react-router-dom'],
             'ui-vendor': ['@dnd-kit/core', 'framer-motion'],
             'map-data': ['./src/data/colombiaMap.ts']
           }
         }
       }
     }
   });
   ```
4. Test bundle size reduction

**Output State:**
- Route-based code splitting
- Component-level lazy loading
- Vendor chunks optimized
- Bundle reduced by ~200KB

**Validation Command:**
```bash
npm run build
ls -lh dist/assets/
npx vite-bundle-visualizer
```

**Dependencies:**
- M11.1 (baseline established)

**Rollback Procedure:**
```bash
git checkout src/App.tsx vite.config.ts
npm run build
```

**Success Criteria:**
- [ ] Routes lazy loaded
- [ ] Large components split
- [ ] Bundle < 550KB
- [ ] Tests pass

---

## Task M11.3: Optimize Image Assets

**Estimated Effort:** 1.5h
**Risk Level:** Low
**Assignable To:** coder

**Input State:**
- Unoptimized images
- No WebP format
- No responsive images

**Action Steps:**
1. Convert images to WebP:
   ```bash
   npm install -D vite-plugin-image-optimizer
   ```
2. Configure image optimization:
   ```typescript
   // vite.config.ts
   import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

   export default defineConfig({
     plugins: [
       ViteImageOptimizer({
         png: { quality: 80 },
         jpeg: { quality: 80 },
         webp: { quality: 80 },
         svg: {
           plugins: [
             { name: 'removeViewBox', active: false },
             { name: 'sortAttrs' }
           ]
         }
       })
     ]
   });
   ```
3. Create responsive image component:
   ```typescript
   interface ImageProps {
     src: string;
     alt: string;
     sizes?: string;
   }

   export function Image({ src, alt, sizes }: ImageProps) {
     const srcSet = [
       `${src}?w=320 320w`,
       `${src}?w=640 640w`,
       `${src}?w=1024 1024w`
     ].join(', ');

     return (
       <picture>
         <source type="image/webp" srcSet={srcSet} sizes={sizes} />
         <img src={src} alt={alt} loading="lazy" decoding="async" />
       </picture>
     );
   }
   ```
4. Replace all image usages

**Output State:**
- Images optimized to WebP
- Responsive image component
- Lazy loading implemented
- ~50KB saved

**Validation Command:**
```bash
npm run build
ls -lh dist/assets/*.webp
```

**Dependencies:**
- M11.2 (code splitting done)

**Rollback Procedure:**
```bash
npm uninstall vite-plugin-image-optimizer
git checkout vite.config.ts
```

**Success Criteria:**
- [ ] WebP format used
- [ ] Images optimized
- [ ] Lazy loading works
- [ ] LCP improved

---

## Tasks M11.4 - M11.45 (Condensed)

**M11.4: Implement Virtual Scrolling (2h)** - Large lists optimization
**M11.5: Add React.memo to Components (1.5h)** - Prevent re-renders
**M11.6: Optimize useMemo/useCallback (1h)** - Expensive calculations
**M11.7: Implement Windowing (1.5h)** - Department list virtualization
**M11.8: Optimize SVG Rendering (2h)** - Map performance
**M11.9: Add Service Worker Caching (2h)** - Offline performance
**M11.10: Implement Preload Critical Assets (1h)** - Resource hints
**M11.11: Optimize Font Loading (1h)** - Font display swap
**M11.12: Reduce JavaScript Bundle (2h)** - Tree shaking, minification
**M11.13: Optimize CSS Delivery (1h)** - Critical CSS, purge unused
**M11.14: Add Resource Prefetching (1h)** - Next page prefetch
**M11.15: Implement Connection Preconnect (0.5h)** - DNS prefetch
**M11.16: Optimize Third-Party Scripts (1.5h)** - Async, defer
**M11.17: Implement Compression (1h)** - Brotli, gzip
**M11.18: Add HTTP/2 Server Push (1h)** - Critical resources
**M11.19: Optimize Database Queries (2h)** - Supabase indexes
**M11.20: Implement API Caching (1.5h)** - SWR, React Query
**M11.21: Add Client-Side Caching (1h)** - LocalStorage, IndexedDB
**M11.22: Optimize State Management (2h)** - Reduce context re-renders
**M11.23: Implement Debouncing/Throttling (1h)** - Input handlers
**M11.24: Add Progressive Web App (2h)** - Manifest, service worker
**M11.25: Optimize Animation Performance (1.5h)** - GPU acceleration
**M11.26: Reduce Layout Thrashing (1h)** - Batch DOM reads/writes
**M11.27: Optimize Event Listeners (1h)** - Passive listeners
**M11.28: Implement Intersection Observer (1h)** - Lazy load viewport
**M11.29: Add Performance Monitoring (2h)** - Web Vitals tracking
**M11.30: Optimize Build Process (1.5h)** - Parallel builds
**M11.31: Add Performance Budget (1h)** - Size limits, CI checks
**M11.32: Implement CDN Strategy (1h)** - Static asset delivery
**M11.33: Optimize SEO (1.5h)** - Meta tags, structured data
**M11.34: Add Accessibility Performance (1h)** - Screen reader optimization
**M11.35: Implement Security Headers (1h)** - CSP, HSTS
**M11.36: Optimize Mobile Performance (2h)** - Touch responsiveness
**M11.37: Add Performance Tests (2h)** - Automated benchmarks
**M11.38: Create Performance Dashboard (2h)** - Real-time monitoring
**M11.39: Add Error Boundary Performance (1h)** - Graceful degradation
**M11.40: Optimize Memory Usage (1.5h)** - Leak detection
**M11.41: Implement Critical Render Path (1.5h)** - Above-the-fold
**M11.42: Add Performance Documentation (2h)** - Best practices guide
**M11.43: Final Lighthouse Audit (1h)** - Verify 100/100/100/100
**M11.44: Bundle Size Verification (0.5h)** - < 500KB confirmed
**M11.45: M11 Milestone Completion (1h)** - Final validation, tags

---

## M11 Summary

**Total Tasks:** 45
**Total Effort:** 18 hours
**Critical Path:** M11.1 → M11.2 → M11.3 → M11.43 → M11.44 → M11.45 (9h)

**Parallelizable Groups:**
- Group 1: M11.1 (sequential, 2h)
- Group 2 (after M11.1): M11.2, M11.3 (sequential, 4.5h)
- Group 3 (after Group 2): M11.4-M11.10 (parallel, 13h)
- Group 4 (after Group 3): M11.11-M11.20 (parallel, 13h)
- Group 5 (after Group 4): M11.21-M11.35 (parallel, 21h)
- Group 6 (after Group 5): M11.36-M11.42 (parallel, 14h)
- Group 7: M11.43-M11.45 (sequential, 2.5h)

**Success Metrics:**
- Lighthouse: 100/100/100/100
- Bundle size: < 500KB gzipped
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- FCP: < 1.8s
- Performance score: 100
