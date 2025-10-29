# Cache Troubleshooting Guide

## Problem: Seeing Old Version of the App

If you're seeing old content (like outdated modals or UI) even in incognito mode, this is a **service worker cache issue**.

### 🚨 Quick Fix (For Users)

#### Method 1: Automatic (Recommended)
1. Visit the site normally
2. The app will detect version change and automatically clear caches
3. Page will reload with fresh content

#### Method 2: Manual Cache Clear
If the automatic method doesn't work:

**On Desktop (Chrome/Edge):**
1. Open DevTools (F12)
2. Go to "Application" tab
3. Left sidebar: Click "Storage"
4. Click "Clear site data" button
5. Reload page (Ctrl+Shift+R for hard reload)

**On Mobile (Chrome/Safari):**
1. Visit: `[your-site-url]?debug=true`
2. Open the browser console
3. Type: `window.__clearAllCaches()`
4. Page will reload automatically

**Alternative Mobile Method:**
1. Go to browser settings
2. Find "Site settings" or "Website data"
3. Find this site and clear its data
4. Revisit the site

---

## 🛠️ Technical Details (For Developers)

### Root Cause
Service workers aggressively cache JavaScript bundles. When the app is updated:
- New bundles are created with new hashes (e.g., `index-Db5yD2hh.js`)
- Old service worker may continue serving old bundles
- Even `skipWaiting` doesn't always force immediate update

### Solution Implemented (v1.1.0)

#### 1. Nuclear Cache Invalidation
When app version changes, the following happens automatically:
- All service workers are unregistered
- All Cache Storage caches are deleted
- localStorage cache markers are cleared
- Page is force-reloaded

See: `src/utils/version.ts` - `performNuclearCacheInvalidation()`

#### 2. Build-Time Cache Busting
Each build injects unique cache versions:
```typescript
__CACHE_VERSION__: `v${Date.now()}` // Unique per build
```

Service worker precache manifest includes timestamp-based revision.

#### 3. Version Tracking
- `APP_VERSION` bumped from 1.0.0 → 1.1.0
- Stored in localStorage as `app_version`
- Checked on every app load

#### 4. Debug Utilities
Available in console when `?debug=true` is in URL:
- `window.__clearAllCaches()` - Nuclear option
- `window.__inspectCaches()` - See what's cached
- `window.__unregisterServiceWorkers()` - Remove SWs

### Testing the Fix

**Before Deployment:**
```bash
npm run build
npm run preview
```

**After Deployment:**
1. Visit site on device with old cache
2. Check console for: `[Version] App version changed: 1.0.0 → 1.1.0`
3. Should see: `[Version] 🚨 Performing NUCLEAR cache invalidation...`
4. Page should auto-reload with fresh content

### Preventing Future Issues

**Best Practices:**
1. Always bump `APP_VERSION` in `src/utils/version.ts` for significant changes
2. Test with service workers in production mode (not dev)
3. Use `?debug=true` for troubleshooting in production
4. Monitor console for cache-related logs

**Version Bump Guidelines:**
- **Patch (1.1.0 → 1.1.1)**: Bug fixes, minor changes
- **Minor (1.1.0 → 1.2.0)**: New features, UI changes
- **Major (1.1.0 → 2.0.0)**: Breaking changes, major redesigns

### Architecture

```
┌─────────────────────────────────────────────────────┐
│ App Load (App.tsx)                                  │
│   ↓                                                 │
│ checkVersionChange() (version.ts)                   │
│   ↓                                                 │
│ Compare stored vs. APP_VERSION                      │
│   ↓                                                 │
│ If changed → performNuclearCacheInvalidation()      │
│   ↓                                                 │
│ 1. Unregister all service workers                   │
│ 2. Delete all Cache Storage                         │
│ 3. Clear localStorage markers                       │
│ 4. Force reload                                     │
│   ↓                                                 │
│ Fresh app with new bundles loaded                   │
└─────────────────────────────────────────────────────┘
```

### Files Modified

**Core Changes:**
- `src/utils/version.ts` - Nuclear cache invalidation
- `src/utils/cacheDebug.ts` - Debug utilities (new)
- `src/App.tsx` - Initialize cache debug utils
- `vite.config.ts` - Inject `__CACHE_VERSION__`
- `public/manifest.json` - Version tracking

**Build Output:**
- Service worker revision manifest updated
- New bundle hashes generated
- Cache-version.json injected

---

## 📊 Validation Checklist

After deploying v1.1.0:

- [ ] Old users see version change log in console
- [ ] Caches are automatically cleared
- [ ] Page auto-reloads with fresh content
- [ ] New users don't see cache issues
- [ ] Mobile (iOS/Android) works correctly
- [ ] Incognito mode shows latest version
- [ ] Debug utils work with `?debug=true`

---

## 🆘 Support

If issues persist after these steps:
1. Check browser console for errors
2. Run `window.__inspectCaches()` to see what's cached
3. Try `window.__clearAllCaches()` as last resort
4. Report issue with console logs

**Common Issues:**
- **"Still seeing old version"** → Check APP_VERSION in localStorage matches 1.1.0
- **"Blank page after reload"** → Hard refresh (Ctrl+Shift+R)
- **"Console errors about SW"** → Service worker may need 24h to fully expire
