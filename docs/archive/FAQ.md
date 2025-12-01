# Frequently Asked Questions (FAQ)

**Colombia Departments Puzzle Game**

Last Updated: 2025-10-08

---

## 📋 Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Browser Compatibility](#browser-compatibility)
3. [PWA Installation](#pwa-installation)
4. [Gameplay Questions](#gameplay-questions)
5. [Performance & Troubleshooting](#performance--troubleshooting)
6. [Development Questions](#development-questions)

---

## 🚀 Installation & Setup

### Q: What are the system requirements?

**A:** Minimum requirements:
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher (comes with Node.js)
- **RAM:** 2GB minimum, 4GB recommended
- **Disk Space:** 500MB for dependencies
- **Browser:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Q: Installation fails with "EACCES" permission error

**A:** This usually means npm doesn't have write permissions. Solutions:

```bash
# Option 1: Use npx instead (recommended)
npx create-vite@latest

# Option 2: Fix npm permissions (Mac/Linux)
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules

# Option 3: Use a Node version manager (best practice)
# Install nvm: https://github.com/nvm-sh/nvm
nvm install 18
nvm use 18
```

### Q: "npm install" is very slow

**A:** Try these optimizations:

```bash
# Clear npm cache
npm cache clean --force

# Use faster registry (if in China/Asia)
npm config set registry https://registry.npmmirror.com

# Install with legacy peer deps
npm install --legacy-peer-deps

# Use pnpm (faster alternative)
npm install -g pnpm
pnpm install
```

### Q: Port 5173 is already in use

**A:** Change the port in `vite.config.ts` or use a different port:

```bash
# Use different port temporarily
npm run dev -- --port 3000

# Or update vite.config.ts permanently:
export default defineConfig({
  server: {
    port: 3000
  }
});
```

---

## 🌐 Browser Compatibility

### Q: What browsers are supported?

**A:** The game works on all modern browsers:

| Browser | Minimum Version | Recommended |
|---------|----------------|-------------|
| Chrome | 90+ | 120+ |
| Firefox | 88+ | 115+ |
| Safari | 14+ | 17+ |
| Edge | 90+ | 120+ |

**Mobile browsers:**
- iOS Safari 14+
- Chrome for Android 90+
- Samsung Internet 14+

### Q: Game doesn't work in Internet Explorer

**A:** Internet Explorer is **not supported**. It lacks modern JavaScript features (ES2020+, modules, etc.). Please use a modern browser like Chrome, Firefox, or Edge.

### Q: Map doesn't render on older browsers

**A:** The map requires:
- **SVG support** (all modern browsers)
- **ES2020+ JavaScript** (Arrow functions, optional chaining, etc.)
- **CSS Grid and Flexbox**

If you must support older browsers, you'd need to add polyfills and transpile the code to ES5.

---

## 📱 PWA Installation

### Q: How do I install the app on my phone?

**A:** Installation steps vary by platform:

**iOS (Safari):**
1. Open the game in Safari
2. Tap the Share button (box with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" to confirm

**Android (Chrome):**
1. Open the game in Chrome
2. Tap the three-dot menu
3. Select "Add to Home Screen" or "Install App"
4. Tap "Install" to confirm

**Desktop (Chrome/Edge):**
1. Look for the install icon in the address bar (⊕ or computer icon)
2. Click "Install" when prompted
3. The app will open in its own window

### Q: Install prompt doesn't appear

**A:** Checklist to enable install prompt:

- ✅ Page served over HTTPS (localhost is exempt)
- ✅ Has a valid `manifest.json` with icons
- ✅ Has a registered service worker
- ✅ User hasn't dismissed prompt recently (7-day cooldown)
- ✅ User has visited the site at least once
- ✅ Not already installed

**Debug steps:**
```bash
# 1. Open DevTools > Application > Manifest
# Check for errors in manifest.json

# 2. Application > Service Workers
# Verify service worker is registered and active

# 3. Console
# Look for manifest/service worker errors
```

### Q: App doesn't work offline

**A:** Verify PWA is properly installed:

1. **Check service worker status:**
   - DevTools > Application > Service Workers
   - Should show "activated and running"

2. **Check cache:**
   - DevTools > Application > Cache Storage
   - Should see `colombia-map-data` and `documents` caches

3. **Test offline:**
   - DevTools > Network tab
   - Check "Offline" checkbox
   - Reload page - should still work

**Common issues:**
- Service worker not registered (check console for errors)
- Cache storage disabled (check browser settings)
- Private/Incognito mode (service workers disabled)

### Q: How do I update the PWA?

**A:** The app auto-updates when a new version is detected:

1. New version is downloaded in the background
2. Update notification appears
3. Click "Update" to activate new version
4. App reloads with latest version

**Manual update:**
1. DevTools > Application > Service Workers
2. Click "Update" button
3. Close all tabs with the app
4. Reopen the app

---

## 🎮 Gameplay Questions

### Q: How do I play the game?

**A:** Basic gameplay:

1. **Start:** Click "Start Game" and select a mode
2. **Select:** Click a department from the tray
3. **Place:** Drag to the correct location on the map
4. **Confirm:** Release to place the department
5. **Learn:** View educational info after correct placement
6. **Complete:** Place all 33 departments to finish

**Modes:**
- **Complete Colombia:** Place all 33 departments
- **Regional Practice:** Focus on one region (e.g., Andina)
- **Time Challenge:** Race against the clock
- **Study Mode:** Explore without pressure

### Q: Scoring system explained?

**A:** Scoring breakdown:

- **Base score:** 100 points per correct placement
- **Penalties:**
  - Incorrect attempt: -10 points
  - Region hint: -10 points
  - Letter hint: -20 points
  - Location flash: -50 points
- **Minimum:** 10 points per department (can't go negative)

**Achievements (bonus points):**
- 🏆 Perfect Game (no mistakes): +500
- ⚡ Speed Run (<5 minutes): +300
- 🧠 No Hints Used: +200

### Q: Hints not working?

**A:** Check these:

1. **Hint button disabled?** You may have used all hints for that department
2. **No response?** Region might not be highlighted yet - try Region Hint first
3. **Letter hint shows "?"** Some departments have special characters

**Hint progression:**
1. Region Hint → Shows region color
2. Letter Hint → Shows first letter
3. Location Flash → Briefly highlights exact location

### Q: Department won't drop on map?

**A:** Common causes:

1. **Wrong location:** Try different areas of the map
2. **Touch target too small:** On mobile, tap-to-place instead of drag
3. **Map not loaded:** Wait for map to fully render
4. **Browser zoom:** Reset zoom to 100% (Ctrl+0 or Cmd+0)

**On mobile:**
- Use tap-to-place: Tap department → Tap map location
- Don't drag-and-drop (unreliable on touchscreens)

---

## ⚡ Performance & Troubleshooting

### Q: Game is slow/laggy

**A:** Performance optimization steps:

1. **Close other tabs:** Browser resources are limited
2. **Disable browser extensions:** Some extensions cause conflicts
3. **Clear browser cache:** Ctrl+Shift+Delete or Cmd+Shift+Delete
4. **Update browser:** Ensure you're on the latest version
5. **Check hardware acceleration:**
   - Chrome: Settings > System > Use hardware acceleration
   - Firefox: Preferences > Performance > Use recommended settings

**Still slow? Check:**
```bash
# 1. Run Lighthouse audit
# DevTools > Lighthouse > Generate report
# Look for performance bottlenecks

# 2. Check CPU usage
# DevTools > Performance > Record
# Look for long tasks (>50ms)

# 3. Monitor frame rate
# DevTools > Rendering > Frame Rendering Stats
# Should maintain 60fps
```

### Q: Map rendering is broken/distorted

**A:** Troubleshooting steps:

1. **Hard refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear site data:**
   - DevTools > Application > Clear site data
   - Reload page
3. **Check console for errors:**
   - DevTools > Console
   - Look for GeoJSON or SVG errors

4. **Verify map data loaded:**
   ```javascript
   // Check in browser console
   fetch('/data/colombia.geojson')
     .then(r => r.json())
     .then(data => console.log('Map data:', data))
     .catch(err => console.error('Map load failed:', err));
   ```

### Q: Sound effects not playing

**A:** Sound troubleshooting:

1. **Check volume:**
   - Browser tab not muted? (Look for 🔇 icon on tab)
   - System volume up?
   - Headphones connected properly?

2. **Browser autoplay policy:**
   - Some browsers block audio until user interaction
   - Click anywhere on the page first
   - Check: chrome://flags/#autoplay-policy

3. **Disable sound:**
   - Click Settings (⚙️) → Toggle sound off/on

### Q: TypeScript errors when running dev server

**A:** Common TypeScript fixes:

```bash
# 1. Clear TypeScript cache
rm -rf node_modules/.vite
npm run dev

# 2. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 3. Check TypeScript version
npm list typescript
# Should be 5.3.x or higher

# 4. Run type check separately
npm run typecheck
# Shows all type errors
```

### Q: Build fails with memory error

**A:** Increase Node.js memory limit:

```bash
# Linux/Mac
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Windows (PowerShell)
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Or add to package.json scripts
"scripts": {
  "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
}
```

---

## 👨‍💻 Development Questions

### Q: How do I add a new department?

**A:** Edit `src/data/colombiaDepartments.ts`:

```typescript
export const colombiaDepartments: Department[] = [
  // ... existing departments
  {
    id: 'new-department',
    name: 'New Department',
    capital: 'Capital City',
    region: 'Andina', // or Caribe, Pacífica, Orinoquía, Amazonía, Insular
    coordinates: { x: 50, y: 50 }, // Approximate center (0-100 scale)
    educationalFacts: [
      'Interesting fact 1',
      'Interesting fact 2'
    ]
  }
];
```

**Also update `public/data/colombia.geojson`:**
- Add GeoJSON feature with matching `properties.NOMBRE_DPT`

### Q: How do I run tests?

**A:** Testing commands:

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run E2E tests (Playwright)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run all checks (typecheck + lint + test)
npm run validate
```

**Test status:**
- **Unit tests:** 844/914 passing (92.4%)
- **E2E tests:** 9 spec files (Playwright)
- **Coverage target:** 95%

### Q: How do I contribute?

**A:** Contribution workflow:

1. **Fork the repository** on GitHub
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/colombia_puzzle_game.git
   cd colombia_puzzle_game
   ```
3. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make changes and test:**
   ```bash
   npm run validate  # Type check + lint + tests
   npm run build     # Verify production build
   ```
5. **Commit with conventional commits:**
   ```bash
   git commit -m "feat: add department filtering by region"
   ```
6. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   # Open PR on GitHub
   ```

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guidelines.

### Q: Where is the documentation?

**A:** Documentation structure:

```
docs/
├── README.md                      # Documentation index
├── DEVELOPER_GUIDE.md             # Setup and dev workflow
├── MOBILE_DEVELOPMENT_GUIDE.md    # Mobile/PWA guide
├── ACCESSIBILITY_GUIDE.md         # WCAG compliance
├── COMPONENT_API.md               # Component reference
├── GAME_MECHANICS.md              # Gameplay rules
├── PWA_IMPLEMENTATION.md          # PWA technical details
├── architecture/                  # Architecture docs
├── adr/                          # Decision records
└── archive/                      # Historical docs
```

Start with [docs/README.md](./README.md) for the full documentation index.

### Q: How do I debug in VS Code?

**A:** VS Code debugging setup:

1. **Create `.vscode/launch.json`:**
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "chrome",
         "request": "launch",
         "name": "Launch Chrome",
         "url": "http://localhost:5173",
         "webRoot": "${workspaceFolder}"
       }
     ]
   }
   ```

2. **Start dev server:** `npm run dev`
3. **Press F5** in VS Code
4. **Set breakpoints** in your code
5. **Step through** with F10 (step over) or F11 (step into)

---

## 🆘 Still Need Help?

If your question isn't answered here:

1. **Search existing issues:** [GitHub Issues](https://github.com/bjpl/colombia_department_puzzle/issues)
2. **Check documentation:** [docs/README.md](./README.md)
3. **Open a new issue:** [Create Issue](https://github.com/bjpl/colombia_department_puzzle/issues/new)
4. **Review troubleshooting:** [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md#troubleshooting)

---

## 📞 Contact & Support

- **Bug Reports:** [GitHub Issues](https://github.com/bjpl/colombia_department_puzzle/issues)
- **Feature Requests:** [GitHub Discussions](https://github.com/bjpl/colombia_department_puzzle/discussions)
- **Security Issues:** Email maintainers directly
- **General Questions:** Create a Discussion on GitHub

---

**Last Updated:** 2025-10-08
**Maintainer:** Development Team
**Version:** 1.0.0

*This FAQ is updated regularly. Suggest improvements via [GitHub Issues](https://github.com/bjpl/colombia_department_puzzle/issues).*
