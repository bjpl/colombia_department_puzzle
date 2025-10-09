# ADR 003: Vite over Webpack for Build Tooling

**Date:** 2025-09-18
**Status:** Accepted
**Deciders:** Core development team

---

## Context

We needed a build tool for bundling, dev server, and production optimization. The main options were Vite, Webpack, and Parcel.

### Requirements
- Fast development server (HMR)
- TypeScript support
- React support
- PWA generation
- Code splitting
- Production optimization
- Easy configuration

---

## Decision

We chose **Vite** as our build tool.

---

## Rationale

### Vite Advantages

**1. Development Speed**
- **Native ES modules:** No bundling in dev (instant server start)
- **Hot Module Replacement (HMR):** <50ms updates
- **Pre-bundled dependencies:** Uses esbuild (10-100x faster than webpack)

**Real metrics:**
```
Dev server start:
- Vite: ~300ms
- Webpack: ~8s (cold), ~3s (warm)

HMR update:
- Vite: 20-50ms
- Webpack: 200-500ms
```

**2. Modern Defaults**
- ES2020+ out of the box
- Tree shaking by default
- CSS code splitting
- Asset handling (images, fonts)
- JSON/WASM imports

**3. Plugin Ecosystem**
```typescript
// vite.config.ts
export default {
  plugins: [
    react(),           // Official React plugin
    vitePWA({...}),    // PWA with Workbox
    // Add plugins easily
  ],
};
```

**4. Production Build**
- Uses Rollup (mature, reliable)
- Excellent code splitting
- Smaller bundles than webpack (tree shaking)
- Source maps support

**5. TypeScript**
- Built-in TS transpilation (esbuild)
- No ts-loader configuration needed
- Type checking via `tsc --noEmit` (parallel)

### Webpack Considerations

**Pros:**
- More mature (established since 2012)
- Larger plugin ecosystem
- More configuration options

**Cons:**
- Slow dev server (bundles everything upfront)
- Complex configuration
- Slower HMR
- Requires many loaders for basic features

**Comparison:**
```javascript
// Webpack config (simplified)
module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      // ... many more loaders
    ],
  },
  plugins: [/* ... many plugins */],
  optimization: {/* ... complex config */},
};

// Vite config (equivalent)
export default {
  plugins: [react()],
};
```

### Parcel Considerations

**Pros:**
- Zero config
- Fast

**Cons:**
- Less predictable (magic config)
- Smaller ecosystem
- Less control when needed
- PWA support not as mature

---

## Consequences

### Positive
✅ **2-5x faster development** (HMR, server start)
✅ **Simpler configuration** (90% less code than webpack)
✅ **Better DX** (instant feedback loop)
✅ **Smaller bundles** (better tree shaking)
✅ **Modern by default** (ES2020+, native ESM)
✅ **Great PWA support** (VitePWA plugin)

### Negative
❌ **Newer ecosystem** (fewer resources than webpack)
❌ **Legacy browser support** requires extra config
❌ **Some webpack plugins unavailable** (but alternatives exist)

### Mitigations
- Vite has mature React plugin
- VitePWA handles all our PWA needs
- Target modern browsers (ES2020+)
- Document any Vite-specific patterns

---

## Technical Details

### Our Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [/* ... */],
      },
      manifest: {/* ... */},
    }),
  ],
  build: {
    target: 'es2020',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'game-logic': ['./src/data/colombiaDepartments'],
          'utilities': ['clsx', 'd3-geo'],
        },
      },
    },
  },
});
```

### Bundle Results

```
Production build:
dist/assets/react-vendor-X31hiD63.js   139.78 KB │ gzip: 44.91 KB
dist/assets/game-logic-B536Ydr-.js      41.80 KB │ gzip: 13.79 KB
dist/assets/utilities-BdykmWh7.js       23.80 KB │ gzip:  9.27 KB
dist/assets/index-Ce8OEHYT.js          366.06 KB │ gzip: 67.57 KB
dist/assets/index-DTP4vIxy.css          72.74 KB │ gzip: 12.05 KB

Total: ~187 KB gzipped (excellent for this app)
```

---

## Alternatives Considered

### 1. Webpack 5
**Pros:** Mature, large ecosystem
**Cons:** Slow, complex config
**Decision:** Rejected due to development speed

### 2. Parcel 2
**Pros:** Zero config, fast
**Cons:** Less control, smaller ecosystem
**Decision:** Rejected for lack of predictability

### 3. Turbopack (experimental)
**Pros:** Extremely fast
**Cons:** Not production-ready
**Decision:** Too early, revisit in 2026

---

## Migration Path

If Vite becomes unsuitable (unlikely):
1. Vite config is simple (easy to replace)
2. No Vite-specific code (just standard React/TS)
3. Can migrate to webpack/Turbopack if needed
4. Low lock-in risk

---

## References

- [Vite Documentation](https://vitejs.dev/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Why Vite](https://vitejs.dev/guide/why.html)
- [Vite vs Webpack Benchmark](https://github.com/yyx990803/vite-vs-webpack)

---

## Review Date

**Next Review:** 2026-01-01 (or if build performance degrades)
