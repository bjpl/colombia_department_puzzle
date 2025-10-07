# PWA Quick Integration Guide

## For Other Agents: How to Use PWA Components

### Agent 4 (Components) - Add to App.tsx

```typescript
// 1. Import PWA components at top of App.tsx
import { InstallPrompt } from './components/InstallPrompt';
import { UpdateNotification } from './components/UpdateNotification';
import { OfflineIndicator } from './components/OfflineIndicator';

// 2. Add components to your render tree
function App() {
  return (
    <>
      {/* PWA Components - render at top level */}
      <OfflineIndicator />
      <UpdateNotification />

      {/* Your existing app content */}
      <YourGameComponents />

      {/* Install prompt - renders at bottom */}
      <InstallPrompt showAfterFirstGame={true} />
    </>
  );
}
```

### Agent 4 - Trigger Install Prompt After Game

```typescript
// In PostGameReport.tsx or wherever game completion happens
import { triggerInstallPromptOnGameComplete } from './components/InstallPrompt';

function PostGameReport({ onComplete }) {
  const handleGameComplete = () => {
    // Your existing completion logic
    saveGameStats();
    updateLeaderboard();

    // Trigger PWA install prompt (if conditions met)
    triggerInstallPromptOnGameComplete();

    // Continue with your flow
    onComplete();
  };

  return (
    <div>
      {/* Your completion UI */}
      <button onClick={handleGameComplete}>Continue</button>
    </div>
  );
}
```

### Agent 4 - Use PWA State in Your Components

```typescript
import { usePWA } from '../hooks/usePWA';

function YourComponent() {
  const { isOnline, isInstalled, isInstallable } = usePWA();

  return (
    <div>
      {/* Show different UI based on PWA state */}
      {!isOnline && <p>Playing offline</p>}
      {isInstalled && <p>Thanks for installing!</p>}
    </div>
  );
}
```

## Testing Instructions

### For Agent 5 (Testing)

#### Test PWA Build
```bash
npm run build
npm run preview
```

#### Test Offline Mode
1. Open DevTools → Network tab
2. Select "Offline" from throttle dropdown
3. Reload page → should load from cache
4. Try playing game → should work fully

#### Test Service Worker
1. Open DevTools → Application → Service Workers
2. Verify status: "Activated and running"
3. Check scope: `/colombia_department_puzzle/`
4. View cache storage → verify precached files

#### Test Install Prompt
1. Build and preview locally
2. Complete a game
3. Wait 2 seconds → install prompt appears
4. Dismiss → check localStorage `pwa-install-dismissed`
5. Complete another game → should NOT show (7-day cooldown)

#### Test Update Flow
1. Build version 1
2. Run preview
3. Make a code change
4. Build version 2
5. Refresh app → update notification appears
6. Click "Update" → app reloads with new version

### Mobile Device Testing

#### Android Chrome
```
1. Deploy to GitHub Pages (or use ngrok for local)
2. Visit on Android Chrome
3. Complete a game
4. Install prompt appears → tap "Install"
5. App opens in standalone mode
6. Verify offline mode works
```

#### iOS Safari
```
1. Deploy to GitHub Pages
2. Visit on iOS Safari
3. Complete a game
4. iOS instructions appear
5. Follow instructions to add to Home Screen
6. Verify offline mode works
```

## Component API Reference

### InstallPrompt

```typescript
interface InstallPromptProps {
  showAfterFirstGame?: boolean;  // Default: true
  onInstall?: () => void;         // Called when user installs
  onDismiss?: () => void;         // Called when user dismisses
}

<InstallPrompt
  showAfterFirstGame={true}
  onInstall={() => console.log('Installed!')}
/>
```

### usePWA Hook

```typescript
const {
  isOnline,           // boolean - network status
  isInstalled,        // boolean - app is installed
  isInstallable,      // boolean - can show install prompt
  updateAvailable,    // boolean - new version ready
  deferredPrompt,     // Event - install prompt event
  promptInstall,      // () => Promise<boolean> - show install prompt
  dismissInstallPrompt, // () => void - dismiss for 7 days
  checkForUpdates,    // () => void - manually check for updates
} = usePWA();
```

### Helper Functions

```typescript
// Trigger install prompt after game completion
triggerInstallPromptOnGameComplete();

// This dispatches a custom event that InstallPrompt listens for
// You can also manually dispatch:
window.dispatchEvent(
  new CustomEvent('gameCompleted', { detail: { completed: true } })
);
```

## File Locations

```
PWA Components:
  src/components/InstallPrompt.tsx
  src/components/UpdateNotification.tsx
  src/components/OfflineIndicator.tsx

PWA Hook:
  src/hooks/usePWA.ts

Configuration:
  vite.config.ts (PWA plugin)
  public/manifest.json (PWA manifest)
  index.html (PWA meta tags)
  src/main.tsx (SW registration)

Documentation:
  docs/PWA_IMPLEMENTATION.md (full docs)
  docs/PWA_SUMMARY.md (agent report)
  docs/PWA_INTEGRATION_GUIDE.md (this file)
```

## Common Issues

### Install Prompt Not Showing
- Check localStorage for `pwa-install-dismissed` flag
- Verify game completion event fires
- Test on real mobile device (desktop has quirks)
- Ensure HTTPS (required for PWA)

### Service Worker Not Registering
- Only works in production build (`npm run build`)
- Check `import.meta.env.PROD` is true
- Verify HTTPS (except localhost)
- Check console for errors

### Offline Mode Not Working
- Verify service worker is active
- Check cache storage has files
- Ensure correct URL paths (relative vs absolute)
- Test after first visit (need initial cache)

### Large Files Not Cached
- GeoJSON files (>2MB) are NOT precached
- They cache on first use (runtime caching)
- This is intentional to keep initial cache small

## Performance Monitoring

### Check Cache Size
```javascript
// In browser console
const cacheNames = await caches.keys();
for (const name of cacheNames) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  console.log(name, keys.length, 'items');
}
```

### Monitor Network Status
```javascript
import { usePWA } from './hooks/usePWA';

function App() {
  const { isOnline } = usePWA();

  useEffect(() => {
    console.log('Network status:', isOnline ? 'online' : 'offline');
  }, [isOnline]);
}
```

## Next Steps

1. ✅ Agent 3 completed PWA infrastructure
2. ⏳ Agent 4 integrates PWA components
3. ⏳ Agent 4 triggers install prompt on game completion
4. ⏳ Agent 5 tests PWA functionality
5. ⏳ Create actual icons (replace placeholders)
6. ⏳ Capture screenshots for manifest
7. ⏳ Deploy and test on real devices
8. ⏳ Run Lighthouse PWA audit

## Questions?

Refer to full documentation:
- `docs/PWA_IMPLEMENTATION.md` - Complete implementation details
- `docs/PWA_SUMMARY.md` - Agent 3 deliverables report
- Vite PWA plugin docs: https://vite-pwa-org.netlify.app/

---

**Created by**: Agent 3 - PWA Infrastructure Specialist
**Status**: Ready for integration
