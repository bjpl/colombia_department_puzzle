# Documentation Fixes Required

**Priority:** Medium
**Impact:** Documentation accuracy
**Files Affected:** 2

---

## Overview

Code example validation found **4 API naming inconsistencies** in documentation. All are minor and documentation-only (actual code works correctly).

---

## Fix #1: Touch Target Validator Function Name

**File:** `docs/MOBILE_DEVELOPMENT_GUIDE.md`
**Line:** 61-67

### Current (Incorrect)
```tsx
import { validateTouchTargets } from '../utils/touchTargetValidator';

// In development/testing
if (import.meta.env.DEV) {
  validateTouchTargets(); // Logs validation results to console
}
```

### Fixed (Correct)
```tsx
import { reportTouchTargetViolations } from '../utils/touchTargetValidator';

// In development/testing
if (import.meta.env.DEV) {
  reportTouchTargetViolations(); // Logs validation results to console
}
```

**Actual Source:** `src/utils/touchTargetValidator.ts:120`

---

## Fix #2: PWA Hook - Install Properties

**File:** `docs/MOBILE_DEVELOPMENT_GUIDE.md`
**Line:** 249-268

### Current (Incorrect)
```tsx
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

### Fixed (Correct)
```tsx
import { usePWA } from '../hooks/usePWA';

function App() {
  const { isInstallable, promptInstall, isInstalled } = usePWA();

  const handleInstallPrompt = async () => {
    if (isInstallable) {
      await promptInstall();
    }
  };

  return (
    <>
      {isInstallable && <InstallPrompt onInstall={handleInstallPrompt} />}
    </>
  );
}
```

**Actual Source:** `src/hooks/usePWA.ts:20-153`

**Property Names:**
- `canInstall` → `isInstallable` ✅
- `installPWA` → `promptInstall` ✅

---

## Fix #3: PWA Hook - Update Properties

**File:** `docs/MOBILE_DEVELOPMENT_GUIDE.md`
**Line:** 288-296

### Current (Incorrect)
```tsx
const { needsUpdate, updateServiceWorker } = usePWA();

{needsUpdate && (
  <UpdateNotification
    onUpdate={updateServiceWorker}
    onDismiss={() => {/* Handle dismiss */}}
  />
)}
```

### Fixed (Correct)
```tsx
const { updateAvailable } = usePWA();

{updateAvailable && (
  <UpdateNotification />
)}
```

**Actual Source:** `src/hooks/usePWA.ts:24`

**Notes:**
- `needsUpdate` → `updateAvailable` ✅
- `updateServiceWorker` method doesn't exist (handled internally by UpdateNotification component)
- UpdateNotification doesn't accept `onUpdate` or `onDismiss` props

---

## Fix #4: BottomSheet Prop Naming Consistency

**File:** `docs/RESPONSIVE_ARCHITECTURE.md`
**Line:** 76-94

### Current (Inconsistent)
```tsx
interface BottomSheetProps {
  children: ReactNode;
  initialSnapPoint?: 'collapsed' | 'half' | 'full';
  onSnapChange?: (snapPoint: SnapPoint) => void;  // Documentation uses this
  className?: string;
}
```

### Actual Implementation
```tsx
interface BottomSheetProps {
  children: ReactNode;
  initialSnapPoint?: SnapPoint;
  onSnapChange?: (snapPoint: SnapPoint) => void;  // Line 20 in component
  className?: string;
}
```

**Actual Source:** `src/components/BottomSheet.tsx:18-23`

**Status:** ✅ Actually correct! Both the documentation and implementation use `onSnapChange`. No fix needed.

---

## Complete usePWA Hook API Reference

For documentation accuracy, here's the complete hook interface:

```tsx
// src/hooks/usePWA.ts
export function usePWA(): PWAState & PWAActions {
  return {
    // State
    isOnline: boolean;           // Network status
    isInstalled: boolean;        // App is installed (standalone mode)
    isInstallable: boolean;      // Install prompt available
    updateAvailable: boolean;    // New version ready
    deferredPrompt: any;        // BeforeInstallPrompt event

    // Actions
    promptInstall: () => Promise<boolean>;      // Show install prompt
    dismissInstallPrompt: () => void;           // Dismiss for 7 days
    checkForUpdates: () => void;                // Check for SW updates
  };
}
```

---

## Implementation Checklist

- [ ] Fix #1: Update `validateTouchTargets` to `reportTouchTargetViolations`
- [ ] Fix #2: Update `canInstall` to `isInstallable`, `installPWA` to `promptInstall`
- [ ] Fix #3: Update `needsUpdate` to `updateAvailable`, remove `updateServiceWorker`
- [x] ~~Fix #4: No fix needed - documentation is correct~~

---

## Testing After Fixes

### 1. Verify Examples Compile

Create a test file to validate all corrected examples:

```bash
# Create test file with corrected examples
cat > src/tests/docs/documentation-examples.test.tsx << 'EOF'
import { describe, it, expect } from 'vitest';
import { reportTouchTargetViolations } from '../../utils/touchTargetValidator';
import { usePWA } from '../../hooks/usePWA';

describe('Documentation Examples', () => {
  it('should use correct touch validator function', () => {
    expect(typeof reportTouchTargetViolations).toBe('function');
  });

  it('should have correct usePWA properties', () => {
    const hook = usePWA();
    expect(hook).toHaveProperty('isInstallable');
    expect(hook).toHaveProperty('promptInstall');
    expect(hook).toHaveProperty('updateAvailable');
  });
});
EOF

# Run type check
npm run typecheck

# Run test
npm test -- documentation-examples.test.tsx
```

### 2. Visual Review

After updating documentation:
1. Open each affected file
2. Find the corrected sections
3. Verify code examples match actual implementation
4. Check import paths are relative to correct location

---

## Files to Update

1. **docs/MOBILE_DEVELOPMENT_GUIDE.md**
   - Line 61-67 (Fix #1)
   - Line 249-268 (Fix #2)
   - Line 288-296 (Fix #3)

2. **docs/RESPONSIVE_ARCHITECTURE.md**
   - No changes needed ✅

---

## Automated Validation (Future)

To prevent future documentation drift, consider:

```javascript
// scripts/validate-doc-examples.js
const fs = require('fs');
const path = require('path');

// Extract code blocks from markdown
// Parse imports and check against actual exports
// Validate function names exist in codebase
// Report mismatches

// Usage: npm run validate:docs
```

---

**Status:** Ready to implement
**Estimated Time:** 15 minutes
**Risk:** Low (documentation only)
