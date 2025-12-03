# Mobile Testing Checklist

**Project:** Colombia Departments Puzzle
**Date:** October 25, 2025
**Status:** Awaiting Node.js upgrade & testing

---

## Prerequisites

- [x] Mobile layout fixes applied (map dimensions, breakpoints)
- [x] esbuild version mismatch resolved
- [ ] Node.js upgraded to 20.19+ or 22+
- [ ] Dependencies reinstalled (`npm install`)
- [ ] Tests passing (`npm test`)
- [ ] Production build successful (`npm run build`)

---

## Phase 1: Automated Testing (Run After Node Upgrade)

### 1.1 Test Suite Execution

```bash
npm test -- --run
```

**Expected Results:**
- [ ] Total tests: ~914
- [ ] Passing: >842 (92%+)
- [ ] Mobile-specific tests: 88 tests
- [ ] Known failures: Only JSDOM limitations (touch targets, haptics)

**Test Categories:**
- [ ] Touch gesture recognition (11+ tests)
- [ ] Responsive layout switching (26+ tests)
- [ ] Touch target validation (19 tests - may fail in JSDOM)
- [ ] PWA functionality (30+ tests)
- [ ] Mobile component rendering (25+ tests)

### 1.2 Build Verification

```bash
npm run build
```

**Expected Output:**
- [ ] Build completes without errors
- [ ] Total bundle: ~644 KB (~179 KB gzipped)
- [ ] Code splitting: 4 chunks created
- [ ] Service worker: Generated successfully
- [ ] Assets optimized: Images, fonts cached

**Files to Verify:**
```
dist/
├── assets/
│   ├── react-vendor-[hash].js    (~140 KB)
│   ├── game-logic-[hash].js      (~42 KB)
│   ├── utilities-[hash].js       (~24 KB)
│   ├── main-[hash].js            (~366 KB)
│   └── index-[hash].css          (~73 KB)
├── index.html
└── sw.js (service worker)
```

---

## Phase 2: Browser DevTools Mobile Emulation

### 2.1 Setup

```bash
npm run dev
# Opens: http://localhost:3000/colombia_department_puzzle
```

**Chrome DevTools:**
1. Press `F12`
2. Click "Toggle Device Toolbar" (`Ctrl+Shift+M`)
3. Select preset device OR custom dimensions

### 2.2 Mobile Viewport Tests (Phones)

#### iPhone SE (375×667) - Smallest Modern Phone
- [ ] **Map Rendering:**
  - [ ] Map fits screen completely (no horizontal scroll)
  - [ ] Map width: ~343px (375 - 32 padding)
  - [ ] Colombia map visible and centered
  - [ ] Zoom controls accessible

- [ ] **Header:**
  - [ ] Header height: 56px
  - [ ] Header stays at top (position: fixed)
  - [ ] Stats visible (score, timer, remaining)
  - [ ] Semi-transparent backdrop blur works

- [ ] **Bottom Sheet:**
  - [ ] Collapsed state: Shows peek (120px visible)
  - [ ] Drag handle visible and grabbable
  - [ ] Department chips scroll horizontally
  - [ ] Swipe up → expands to half (50vh)
  - [ ] Swipe up again → expands to full (85vh)
  - [ ] Swipe down → collapses
  - [ ] Backdrop appears when expanded
  - [ ] Tap backdrop → collapses to peek

- [ ] **Touch Interactions:**
  - [ ] All touch targets ≥44px (visible in inspector)
  - [ ] Department chips tappable
  - [ ] Tap chip → selects it
  - [ ] Tap map region → places selected department
  - [ ] Correct placement → green flash + feedback
  - [ ] Wrong placement → shake animation
  - [ ] No accidental double-taps

#### iPhone 12 Pro (390×844) - Standard Modern Phone
- [ ] All above tests pass
- [ ] Extra vertical space used effectively
- [ ] Bottom sheet full expansion comfortable

#### Pixel 5 (393×851) - Android Reference
- [ ] All above tests pass
- [ ] Android gesture bar respected (safe area)
- [ ] Chrome UI doesn't overlap content

### 2.3 Landscape Mode Tests

**iPhone 12 Pro Landscape (844×390)**
- [ ] Header shrinks to fit (48px recommended)
- [ ] Map reflows to landscape orientation
- [ ] Bottom sheet adjusts height
- [ ] All features remain accessible
- [ ] No content clipping

### 2.4 Tablet Tests (Should Get Desktop Layout)

#### iPad Mini (768×1024) - Smallest Tablet
- [ ] Gets **desktop** layout (NOT mobile)
- [ ] Side-by-side: departments | map | info
- [ ] No bottom sheet (tablets don't need it)
- [ ] Desktop drag-and-drop works
- [ ] Map takes center stage

#### iPad (810×1080)
- [ ] Gets desktop layout
- [ ] Breakpoint transition clean (767px → 768px)

---

## Phase 3: Real Mobile Device Testing

### 3.1 Setup Network Access

```bash
# Find your local IP
ipconfig | findstr "IPv4"
# Example: 192.168.1.100

# Start dev server on network
npm run dev -- --host

# Access from phone:
# http://192.168.1.100:3000/colombia_department_puzzle
```

### 3.2 iOS Testing (iPhone/iPad)

**Devices to Test:**
- [ ] iPhone SE or 13 Mini (smallest)
- [ ] iPhone 14/15 Pro (Dynamic Island)
- [ ] iPad Mini (tablet breakpoint)

**iOS-Specific Checks:**
- [ ] **Safe Areas:**
  - [ ] Notch/Dynamic Island doesn't overlap header
  - [ ] Home indicator doesn't overlap bottom sheet
  - [ ] `env(safe-area-inset-*)` applied correctly

- [ ] **Touch Gestures:**
  - [ ] Tap recognition works (no 300ms delay)
  - [ ] Swipe gestures smooth (60fps)
  - [ ] No conflict with iOS swipe-back gesture
  - [ ] Pinch-to-zoom disabled on game elements

- [ ] **Scroll Behavior:**
  - [ ] Bottom sheet scrolls department list
  - [ ] Map doesn't scroll page
  - [ ] Pull-to-refresh disabled (`overscroll-behavior`)

- [ ] **Orientation Changes:**
  - [ ] Portrait → Landscape: Layout adapts
  - [ ] Landscape → Portrait: Layout restores
  - [ ] No layout jumps or flashing

### 3.3 Android Testing

**Devices to Test:**
- [ ] Pixel 5/6 (standard)
- [ ] Samsung Galaxy S21+ (edge screens)
- [ ] Budget Android (performance check)

**Android-Specific Checks:**
- [ ] **Chrome UI:**
  - [ ] Address bar hides on scroll
  - [ ] Bottom toolbar respects safe area
  - [ ] 100vh calculations correct

- [ ] **Performance:**
  - [ ] Animations run at 60fps
  - [ ] No jank during bottom sheet drag
  - [ ] Map rendering smooth

- [ ] **Haptic Feedback (if enabled):**
  - [ ] Tap: 10ms vibration
  - [ ] Correct placement: Pattern vibration
  - [ ] Wrong placement: 50ms error vibration

### 3.4 Cross-Device Consistency

**Test Same Actions on All Devices:**
- [ ] Select department chip
- [ ] Place on correct location
- [ ] Place on wrong location
- [ ] Complete full game
- [ ] Orientation changes work
- [ ] Return from background

---

## Phase 4: PWA Installation Testing

### 4.1 Android Chrome (Primary PWA Platform)

**Setup:**
```bash
# Build production
npm run build

# Serve locally
npx http-server dist -p 8080

# On Android, navigate to:
# http://[YOUR_IP]:8080
```

**Installation Flow:**
- [ ] **Install Banner:**
  - [ ] Chrome shows "Add to Home Screen" banner
  - [ ] Banner appears after first game OR user engagement
  - [ ] Banner text mentions "Colombia Puzzle"

- [ ] **Installation:**
  - [ ] Tap "Install" button
  - [ ] App downloads (< 1 MB initial)
  - [ ] Icon appears on home screen
  - [ ] Icon uses correct 512×512 PNG (not placeholder)

- [ ] **Standalone Mode:**
  - [ ] Opens without browser UI (status bar only)
  - [ ] Splash screen shows on launch
  - [ ] Orientation locked or free (verify expected)

- [ ] **Offline Functionality:**
  - [ ] Enable airplane mode
  - [ ] Close and reopen app
  - [ ] App loads from cache
  - [ ] Game fully playable offline
  - [ ] Service worker serves cached map data

### 4.2 iOS Safari (Add to Home Screen)

**Note:** iOS doesn't support automatic install prompts

**Manual Installation:**
- [ ] Safari → Share → "Add to Home Screen"
- [ ] Icon appears on home screen
- [ ] Opens as web clip (browser UI hidden)

**Limitations to Document:**
- [ ] No automatic install prompt (Apple restriction)
- [ ] Limited background sync
- [ ] No web push notifications
- [ ] Service worker limitations in standalone mode

### 4.3 PWA Features Verification

**Offline Mode:**
```bash
# Test while offline
1. Load app online (first visit)
2. Enable airplane mode
3. Reload app
4. Verify: Map data cached, game playable
```

- [ ] App shell loads instantly (<1s)
- [ ] Map GeoJSON served from cache
- [ ] All game logic works offline
- [ ] Scores save to localStorage

**Update Notifications:**
```bash
# Test update flow
1. Build new version: npm run build
2. Deploy to test server
3. User opens app
4. Update banner appears: "New version available"
5. User taps "Update"
6. App refreshes with new version
```

- [ ] Update notification component shows
- [ ] User can dismiss or update
- [ ] Update applies smoothly (no data loss)

---

## Phase 5: Lighthouse Audits

### 5.1 Chrome DevTools Lighthouse

```bash
# Option 1: DevTools
1. npm run dev
2. Open site in Chrome
3. F12 → Lighthouse tab
4. Select "Mobile" device
5. Check all categories
6. "Generate report"
```

### 5.2 Mobile Audit Checklist

**Performance (Target: >90)**
- [ ] First Contentful Paint: <1.8s
- [ ] Largest Contentful Paint: <2.5s
- [ ] Time to Interactive: <3.8s
- [ ] Cumulative Layout Shift: <0.1
- [ ] Speed Index: <3.4s

**Accessibility (Target: >95)**
- [ ] All touch targets ≥44×44px
- [ ] Color contrast ≥4.5:1 (WCAG AA)
- [ ] ARIA labels present
- [ ] Screen reader compatibility
- [ ] Keyboard navigation works

**Best Practices (Target: >90)**
- [ ] HTTPS in production
- [ ] No console errors
- [ ] Images optimized
- [ ] No deprecated APIs
- [ ] Permissions requested appropriately

**PWA (Target: >90)**
- [ ] Installable (manifest.json valid)
- [ ] Service worker registered
- [ ] Works offline
- [ ] Splash screen configured
- [ ] Icons correct sizes (192, 512)
- [ ] Theme color set
- [ ] Viewport meta tag

**SEO (Bonus)**
- [ ] Meta description present
- [ ] Title meaningful
- [ ] Structured data (optional)

### 5.3 Desktop Audit

```bash
# Repeat above with "Desktop" device selected
```

- [ ] Performance: >90
- [ ] Accessibility: >95
- [ ] Best Practices: >90

---

## Phase 6: Performance Profiling

### 6.1 Frame Rate Monitoring

**Chrome DevTools → Performance:**
1. Start recording
2. Drag bottom sheet up and down
3. Place multiple departments
4. Zoom/pan map
5. Stop recording

**Verify:**
- [ ] Consistent 60 FPS during animations
- [ ] No frame drops during interactions
- [ ] JavaScript execution <16ms per frame
- [ ] No layout thrashing

### 6.2 Memory Usage

**Chrome DevTools → Memory:**
- [ ] Initial load: <50 MB
- [ ] After 10 games: <100 MB (no leaks)
- [ ] Service worker cache: <5 MB

### 6.3 Network Performance

**3G Throttling:**
```
DevTools → Network → Throttling → Slow 3G
```

- [ ] First visit loads in <3s (TTI)
- [ ] Repeat visit loads in <1.5s (cached)
- [ ] Progressive loading works (app shell first)

---

## Phase 7: Edge Cases & Stress Tests

### 7.1 Rapid Interactions
- [ ] Tap 10 departments rapidly → no UI breaking
- [ ] Swipe bottom sheet rapidly → smooth tracking
- [ ] Rotate device 5x quickly → layout stable

### 7.2 Interruptions
- [ ] Phone call during game → state preserved
- [ ] Switch apps → returns to exact state
- [ ] Low battery mode → still playable
- [ ] Network drop during game → continues offline

### 7.3 Accessibility
- [ ] Screen reader announces department names
- [ ] VoiceOver/TalkBack navigates correctly
- [ ] High contrast mode supported
- [ ] Large text mode (iOS/Android) works
- [ ] Reduce motion honored

---

## Phase 8: Results Documentation

### 8.1 Create Test Report

**File:** `MOBILE_TEST_RESULTS.md`

```markdown
# Mobile Testing Results

## Device Coverage
- [x] iPhone SE (iOS 17)
- [x] iPhone 14 Pro (iOS 17)
- [x] Pixel 5 (Android 14)
- [x] Samsung Galaxy S21 (Android 13)
- [x] iPad Mini (iPadOS 17)

## Test Summary
- Automated Tests: 842/914 passing (92.1%)
- Mobile Functionality: ✅ All critical features work
- PWA Installation: ✅ Successful on Android
- Lighthouse Scores:
  - Performance: 94
  - Accessibility: 98
  - PWA: 92

## Issues Found
1. [If any]

## Recommendations
1. [If any]
```

### 8.2 Screenshot Documentation

**Capture:**
- [ ] Mobile layout on iPhone SE
- [ ] Bottom sheet expanded
- [ ] PWA installed on Android home screen
- [ ] Lighthouse scores
- [ ] DevTools performance profile

**Store in:** `docs/testing/screenshots/mobile/`

---

## Summary Checklist

### Must-Pass Criteria (Blockers)
- [ ] Node.js upgraded to 20.19+ or 22+
- [ ] All automated tests passing
- [ ] Production build successful
- [ ] Map fits on mobile screens (no horizontal scroll)
- [ ] Bottom sheet works on real device
- [ ] PWA installable on Android
- [ ] Lighthouse Performance >80
- [ ] Lighthouse Accessibility >90

### Should-Pass Criteria (Important)
- [ ] Lighthouse Performance >90
- [ ] Lighthouse PWA >90
- [ ] Works on iOS and Android
- [ ] Offline mode functional
- [ ] 60fps animations

### Nice-to-Have
- [ ] Haptic feedback works
- [ ] Works on budget Android devices
- [ ] iOS Add to Home Screen works
- [ ] Update notifications tested

---

## Next Steps After All Tests Pass

1. **Document Results:**
   - Create MOBILE_TEST_RESULTS.md
   - Include screenshots
   - Note any device-specific quirks

2. **Update Documentation:**
   - Mark MOBILE_SUPPORT_V1_SUMMARY.md as verified
   - Update README with mobile compatibility

3. **Deploy to Production:**
   - Build production bundle
   - Deploy to GitHub Pages
   - Verify PWA works in production

4. **Monitor:**
   - Check analytics for mobile adoption
   - Monitor error rates by device
   - Collect user feedback

---

**Testing Guide Created:** October 25, 2025
**Estimated Testing Time:** 2-3 hours (after Node upgrade)
**Priority:** HIGH - Mobile was completely broken before fixes
