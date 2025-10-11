# Pre-Deployment Verification Checklist

**Before deploying to production, verify all items below:**

---

## Code Quality

- [ ] **All tests passing:** Run `npm test -- --run`
  - Target: 842/914+ tests passing (92.1%+)
  - Document any known flaky tests

- [ ] **TypeScript validation:** Run `npm run typecheck`
  - Zero type errors
  - All types properly defined

- [ ] **Linting passes:** Run `npm run lint`
  - Zero linting errors
  - Warnings reviewed and acceptable

- [ ] **Build succeeds:** Run `npm run build`
  - No build errors
  - Build output in `dist/` directory
  - Check bundle sizes (see below)

---

## Bundle Size Validation

Run build and check output:

```bash
npm run build
# Check output for bundle sizes
```

**Target Sizes:**
- [ ] Total JS (gzipped): < 200 KB
- [ ] Total CSS (gzipped): < 50 KB
- [ ] Largest chunk: < 150 KB
- [ ] No duplicate dependencies

**If sizes exceed targets:**
- Review `vite.config.ts` code splitting
- Check for accidentally imported large libraries
- Use `rollup-plugin-visualizer` to analyze

---

## Git Repository Status

- [ ] **Working directory clean:** `git status` shows no uncommitted changes
- [ ] **On correct branch:** Currently on `main` or deployment branch
- [ ] **All commits pushed:** `git push origin main`
- [ ] **Tags created (optional):** `git tag v1.0.0 && git push --tags`
- [ ] **CHANGELOG updated:** Document changes in CHANGELOG.md

---

## Environment Configuration

- [ ] **`.env.example` updated:** All required variables documented
- [ ] **`.gitignore` includes `.env`:** Ensure no secrets committed
- [ ] **Environment variables ready:**
  - Google Analytics Measurement ID obtained
  - Sentry DSN obtained
  - All API keys secured

---

## PWA Configuration

- [ ] **Manifest valid:** Check `public/manifest.json`
  - Name, short_name, description filled
  - Icons present (192x192, 512x512)
  - start_url correct for deployment
  - scope correct for deployment

- [ ] **Service Worker configured:** Check `vite.config.ts` PWA plugin
  - Cache strategies defined
  - Offline fallback configured
  - Update strategy set

- [ ] **Icons exist:** Check `public/icons/`
  - icon-192.png (192x192)
  - icon-512.png (512x512)
  - favicon.ico

---

## Performance Baseline

Run local Lighthouse audit:

```bash
npm run build
npm run preview
# Open http://localhost:4173 in Chrome
# DevTools → Lighthouse → Generate Report
```

**Minimum Scores (Mobile):**
- [ ] Performance: 85+
- [ ] Accessibility: 100
- [ ] Best Practices: 95+
- [ ] SEO: 100
- [ ] PWA: Pass

**If scores below target:**
- Review recommendations
- Fix critical issues
- Re-run audit

---

## Security Checks

- [ ] **No secrets in code:** Search for API keys, tokens, passwords
  ```bash
  git grep -i "api_key\|password\|secret\|token" src/
  ```

- [ ] **Dependencies audited:** Run `npm audit`
  - Zero high/critical vulnerabilities
  - Low/moderate reviewed

- [ ] **Security headers configured:** Check `vercel.json`
  - X-Content-Type-Options
  - X-Frame-Options
  - X-XSS-Protection
  - Referrer-Policy

- [ ] **HTTPS enforced:** Vercel handles automatically

- [ ] **CSP configured (optional):** Consider Content-Security-Policy header

---

## Accessibility Verification

- [ ] **WCAG AAA compliance maintained:**
  - Color contrast 7:1+
  - Touch targets 44x44px+
  - Keyboard navigation functional

- [ ] **Screen reader tested:**
  - VoiceOver (macOS/iOS): ⌘+F5
  - NVDA (Windows): Free download
  - Test critical user flows

- [ ] **Focus management:**
  - Visible focus indicators
  - Logical tab order
  - Skip links present

---

## Mobile Optimization

- [ ] **Touch targets:** All interactive elements ≥ 44x44px
- [ ] **Responsive design:** Test at 320px, 375px, 768px, 1024px widths
- [ ] **Orientation support:** Works in portrait and landscape
- [ ] **Touch gestures:** Drag, tap, swipe all work smoothly
- [ ] **Viewport meta tag:** Present in `index.html`

---

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Android

**Critical Checks:**
- No console errors
- Layout displays correctly
- All features functional
- PWA installable (Chrome/Edge)

---

## Content Verification

- [ ] **All text proofread:** No typos or grammatical errors
- [ ] **All images optimized:**
  - Proper dimensions
  - Compressed (use WebP if possible)
  - Alt text present

- [ ] **404 page exists:** `public/404.html` configured
- [ ] **Metadata complete:**
  - Page title
  - Meta description
  - Open Graph tags (for social sharing)
  - Twitter card tags

---

## Analytics Setup Preparation

- [ ] **GA4 property created:**
  - Property name set
  - Data stream configured
  - Measurement ID copied

- [ ] **Sentry project created:**
  - Project name set
  - Platform: React
  - DSN copied

- [ ] **Cookie consent ready:** Privacy-compliant tracking
- [ ] **Privacy policy updated:** Link in footer

---

## Deployment Platform (Vercel)

- [ ] **Vercel account created:** https://vercel.com
- [ ] **GitHub repository connected:** Authorize Vercel
- [ ] **Project settings configured:**
  - Framework Preset: Vite
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`

- [ ] **Environment variables ready to add:**
  - List prepared from `.env.example`
  - Values obtained and secured

---

## Documentation

- [ ] **README.md updated:**
  - Deployment instructions
  - Environment variables documented
  - Build commands listed

- [ ] **API documentation generated:** Run `npm run docs:api`
- [ ] **Deployment guide ready:** `docs/deployment/week2-checklist.md`

---

## Rollback Plan

- [ ] **Previous version tagged:** `git tag v0.9.0` (if applicable)
- [ ] **Rollback procedure documented:**
  - How to revert deployment in Vercel
  - Database migrations (if any)
  - Feature flags for quick disable

- [ ] **Emergency contacts ready:**
  - Who to notify if issues
  - On-call schedule (if applicable)

---

## Final Checks

- [ ] **Local preview works:** `npm run preview` loads correctly
- [ ] **All checklist items completed**
- [ ] **Team notified of deployment**
- [ ] **Monitoring dashboards ready:**
  - Vercel dashboard open
  - Sentry dashboard open
  - GA4 Real-time open

---

## Deployment Go/No-Go Decision

**All items above checked?**
- ✅ **GO:** Proceed with deployment
- ❌ **NO-GO:** Fix critical issues first

**If NO-GO, document blockers:**
1. [Blocker 1]
2. [Blocker 2]

**Expected deployment time:** [Date/Time]
**Deployed by:** [Name]
**Verified by:** [Name]

---

## Post-Deployment Verification

After deployment, immediately verify:

- [ ] **Site loads:** https://[your-domain].vercel.app
- [ ] **No 404 errors:** All routes work
- [ ] **Assets load:** Images, fonts, icons
- [ ] **Console clean:** No JavaScript errors
- [ ] **PWA installable:** Install prompt appears
- [ ] **Analytics tracking:** GA4 Real-time shows activity
- [ ] **Error tracking:** Sentry receives test event

**Time to verify:** 15-30 minutes
**Who verifies:** Deployment lead + 1 team member

---

**Sign-off:**

- [ ] Pre-deployment checks complete
- [ ] Ready for production deployment

**Checked by:** ________________
**Date:** ________________
**Time:** ________________
