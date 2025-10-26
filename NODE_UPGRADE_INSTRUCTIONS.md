# Node.js Upgrade Instructions for Windows

**Current Version:** 20.11.0
**Required Version:** 20.19.0+ or 22.12.0+

---

## Option 1: Direct Download (Simplest) ✅ RECOMMENDED

### Steps:

1. **Download Node.js 22.x LTS:**
   - Visit: https://nodejs.org/en/download
   - Choose: "Windows Installer (.msi)" - 64-bit
   - Version: v22.12.0 LTS (or latest 22.x)

2. **Run Installer:**
   - Double-click the downloaded `.msi` file
   - Click "Next" through wizard
   - ✅ Check "Automatically install necessary tools"
   - Complete installation

3. **Verify Installation:**
   ```bash
   # Close and reopen Git Bash terminal
   node --version  # Should show v22.12.0+
   npm --version   # Should show 10.x+
   ```

4. **Reinstall Dependencies:**
   ```bash
   cd C:/Users/brand/Development/Project_Workspace/active-development/colombia_puzzle_game
   npm install
   ```

5. **Run Tests:**
   ```bash
   npm test
   ```

---

## Option 2: Using Chocolatey (If You Have It)

```bash
# Check if chocolatey is installed
choco --version

# If yes, upgrade Node.js
choco upgrade nodejs-lts -y

# Verify
node --version
```

---

## Option 3: Install nvm-windows (For Future)

### Why NVM?
Allows easy switching between Node versions.

### Installation:

1. **Download nvm-windows:**
   - https://github.com/coreybutler/nvm-windows/releases
   - Download: `nvm-setup.exe` (latest release)

2. **Uninstall Current Node:**
   - Windows Settings → Apps → Node.js → Uninstall
   - **Important:** Remove `C:\Program Files\nodejs` if it still exists

3. **Install nvm-windows:**
   - Run `nvm-setup.exe`
   - Use default installation path

4. **Install Node 22 via nvm:**
   ```bash
   # List available versions
   nvm list available

   # Install Node 22 LTS
   nvm install 22.12.0

   # Use it
   nvm use 22.12.0

   # Verify
   node --version
   ```

5. **Reinstall Dependencies:**
   ```bash
   cd C:/Users/brand/Development/Project_Workspace/active-development/colombia_puzzle_game
   npm install
   ```

---

## After Upgrade - Complete Testing Checklist

### 1. Verify Build System Works

```bash
# Test suite
npm test

# Build production
npm run build

# Start dev server
npm run dev
```

### 2. Mobile Testing in Browser DevTools

```bash
# Start dev server
npm run dev

# Then in Chrome DevTools:
# 1. Press F12
# 2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
# 3. Test these devices:
#    - iPhone SE (375x667)
#    - iPhone 12 Pro (390x844)
#    - Pixel 5 (393x851)
#    - iPad Mini (768x1024)
```

**Verify:**
- ✅ Map fits screen (no horizontal scroll)
- ✅ Bottom sheet swipes smoothly
- ✅ Departments are tappable (44px targets)
- ✅ Header stays at top when scrolling

### 3. Real Mobile Device Testing

#### iPhone/iPad Testing:
```bash
# Find your local IP
ipconfig | findstr "IPv4"

# Start dev server on network
npm run dev -- --host

# On iPhone/iPad Safari:
# Navigate to: http://[YOUR_IP]:3000/colombia_department_puzzle
```

**Test Checklist:**
- [ ] Map renders correctly
- [ ] Bottom sheet drag works
- [ ] Touch targets are easy to tap
- [ ] No horizontal scrolling needed
- [ ] Orientation change works (portrait ↔ landscape)
- [ ] Safe area respected (notch doesn't overlap)

#### Android Testing:
```bash
# Same as above, but use Chrome on Android
http://[YOUR_IP]:3000/colombia_department_puzzle
```

### 4. PWA Installation Testing (Android)

```bash
# Build production version
npm run build

# Serve production build locally
npx http-server dist -p 8080

# On Android Chrome:
# 1. Navigate to: http://[YOUR_IP]:8080
# 2. Chrome should show "Install app" banner
# 3. Tap "Install"
# 4. App appears on home screen
```

**Verify:**
- [ ] Install prompt appears
- [ ] App installs to home screen
- [ ] Opens as standalone app (no browser UI)
- [ ] Works offline after first load
- [ ] Update notification appears when new version deployed

### 5. Lighthouse Audit

```bash
# Option A: Chrome DevTools
# 1. Open Chrome
# 2. Navigate to your site
# 3. F12 → Lighthouse tab
# 4. Select "Mobile" device
# 5. Check: Performance, Accessibility, Best Practices, PWA
# 6. Click "Generate report"

# Option B: CLI (if you have Chrome)
npm install -g lighthouse
npm run build
npx http-server dist -p 8080

# In another terminal
lighthouse http://localhost:8080 --view --preset=desktop
lighthouse http://localhost:8080 --view --preset=mobile
```

**Target Scores:**
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- PWA: >90

### 6. Specific Mobile Feature Tests

#### Bottom Sheet Behavior:
- [ ] Collapsed state shows peek (120px)
- [ ] Swipe up → half expanded (50vh)
- [ ] Swipe up again → full expanded (85vh)
- [ ] Swipe down → collapses
- [ ] Fast swipe triggers snap
- [ ] Slow drag snaps to nearest point
- [ ] Backdrop dims when expanded
- [ ] Tap backdrop → collapses
- [ ] ESC key → collapses

#### Touch Interactions:
- [ ] Tap department chip → selects it
- [ ] Tap map region → places selected department
- [ ] Long-press chip (500ms) → enables drag mode
- [ ] Drag works in long-press mode
- [ ] Correct placement → green + haptic feedback
- [ ] Wrong placement → shake animation + error feedback

#### Responsive Breakpoints:
Test at these exact widths:
- [ ] 375px (iPhone SE) → Mobile layout
- [ ] 767px → Mobile layout
- [ ] 768px (iPad Mini) → Desktop layout
- [ ] 1024px → Desktop layout

---

## Common Issues & Fixes

### Issue: "Cannot run PowerShell scripts"
```bash
# Run in PowerShell as Administrator
Set-ExecutionPolicy RemoteSigned
```

### Issue: "EACCES: permission denied"
```bash
# Clean npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: "Module not found after upgrade"
```bash
# Clear all caches
rm -rf node_modules .vite .cache dist
npm install
```

### Issue: Port 3000 already in use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- --port 3001
```

---

## Expected Test Results After Upgrade

### Unit Tests (npm test)
```
✓ src/tests/ (842 tests passing)
  - Touch gestures: 11/13
  - Responsive layouts: 26/26
  - PWA features: 29/30
  - Mobile components: all passing

Known Failures (JSDOM limitations):
  - Touch target measurements (getBoundingClientRect returns 0)
  - Haptic feedback (not available in headless)
  - Some service worker mocks
```

### Build Output (npm run build)
```
dist/assets/
  - react-vendor-[hash].js    139.78 KB (44.91 KB gzipped)
  - game-logic-[hash].js       41.80 KB (13.79 KB gzipped)
  - main-[hash].js            366.06 KB (107.62 KB gzipped)
  - index-[hash].css           72.74 KB (12.05 KB gzipped)
───────────────────────────────────────────────────
Total:                         644.18 KB (178.57 KB gzipped)
```

### Dev Server (npm run dev)
```
VITE v7.1.9  ready in 450 ms

➜  Local:   http://localhost:3000/colombia_department_puzzle
➜  Network: http://192.168.x.x:3000/colombia_department_puzzle
```

---

## Next Steps After Successful Upgrade

1. ✅ Run test suite: `npm test`
2. ✅ Build production: `npm run build`
3. ✅ Test in DevTools: Mobile emulation
4. ✅ Test on real device: iPhone/Android
5. ✅ PWA installation: Android Chrome
6. ✅ Lighthouse audit: Mobile + Desktop
7. ✅ Commit test results
8. ✅ Deploy to production

---

## Support

**If Node upgrade fails:**
- Check Windows version compatibility
- Ensure you have admin rights
- Try installing as Administrator
- Check antivirus isn't blocking

**If tests still fail:**
- Ensure Node version is 20.19+ or 22+
- Clear all caches: `rm -rf node_modules .vite .cache`
- Reinstall: `npm install`
- Check for port conflicts

**Questions?**
- Node.js docs: https://nodejs.org/docs/
- nvm-windows: https://github.com/coreybutler/nvm-windows
- Vite troubleshooting: https://vitejs.dev/guide/troubleshooting

---

**Created:** October 25, 2025
**Purpose:** Guide Node.js upgrade for mobile testing
**Required for:** Running tests, building project, verifying mobile fixes
