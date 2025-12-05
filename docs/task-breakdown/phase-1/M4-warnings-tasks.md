# M4: React Warnings Cleanup - Granular Task Breakdown

**Milestone:** Eliminate all React console warnings
**Total Effort:** 7 hours
**Total Tasks:** 18 tasks
**Risk Level:** Medium
**Dependencies:** M1 (TypeScript stability)

---

## Task M4.1: Audit and Categorize React Warnings

**Estimated Effort:** 1h
**Risk Level:** Low
**Assignable To:** reviewer

**Input State:**
- React warnings appear in console
- No systematic tracking
- Unknown warning count

**Action Steps:**
1. Run development mode with console monitoring:
   ```bash
   npm run dev
   ```
2. Open browser console and interact with all features
3. Categorize warnings:
   - Missing `key` props in lists
   - Missing dependencies in useEffect
   - Deprecated API usage
   - State updates on unmounted components
   - Invalid DOM nesting
   - Prop type mismatches
4. Create warning inventory:
   ```typescript
   // docs/warnings-inventory.md
   ## React Warning Inventory

   ### Missing Key Props (Estimated: 8 instances)
   - [ ] GameBoard.tsx: Department list rendering
   - [ ] PuzzleGrid.tsx: Piece mapping
   - [ ] LeaderBoard.tsx: Score entries

   ### useEffect Dependencies (Estimated: 12 instances)
   - [ ] Game.tsx: Game state effect
   - [ ] Timer.tsx: Interval effect

   ### State Updates on Unmount (Estimated: 5 instances)
   - [ ] AudioPlayer.tsx: Async sound loading

   ### Total Warnings: ~25
   ```
5. Prioritize by severity and frequency

**Output State:**
- File: `docs/warnings-inventory.md` with complete list
- Warnings categorized and prioritized
- Baseline count established

**Validation Command:**
```bash
# Manual: Run app and count console warnings
npm run dev
# Open http://localhost:5173 and play game
```

**Dependencies:**
- M1.12 (clean TypeScript baseline)

**Rollback Procedure:**
```bash
# Read-only audit, no rollback needed
```

**Success Criteria:**
- [ ] All warnings documented
- [ ] Categories identified
- [ ] Priority assigned
- [ ] Baseline count recorded

---

## Task M4.2: Fix Missing Key Props in Lists

**Estimated Effort:** 1.5h
**Risk Level:** Low
**Assignable To:** coder

**Input State:**
- 8 components with missing `key` props
- Warning inventory from M4.1
- Lists use index as key (anti-pattern)

**Action Steps:**
1. Fix GameBoard department list:
   ```typescript
   // Before
   {departments.map((dept, index) => (
     <DepartmentPiece department={dept} />
   ))}

   // After
   {departments.map((dept) => (
     <DepartmentPiece key={dept.id} department={dept} />
   ))}
   ```
2. Fix PuzzleGrid piece mapping:
   ```typescript
   // Before
   {pieces.map((piece, i) => (
     <PuzzlePiece piece={piece} />
   ))}

   // After
   {pieces.map((piece) => (
     <PuzzlePiece key={piece.id} piece={piece} />
   ))}
   ```
3. Fix LeaderBoard score entries:
   ```typescript
   // Before
   {scores.map((score, idx) => (
     <ScoreEntry score={score} />
   ))}

   // After
   {scores.map((score) => (
     <ScoreEntry key={`${score.userId}-${score.timestamp}`} score={score} />
   ))}
   ```
4. Apply same pattern to remaining 5 instances
5. Verify no index-based keys remain

**Output State:**
- 8 components updated with proper `key` props
- No index-based keys
- React warnings reduced by ~8

**Validation Command:**
```bash
npm test -- --run
# Run app and check console for key warnings
npm run dev
```

**Dependencies:**
- M4.1 (warning inventory)

**Rollback Procedure:**
```bash
git diff > /tmp/m4.2-keys.patch
git checkout src/components/
```

**Success Criteria:**
- [ ] All 8 components fixed
- [ ] No index-based keys
- [ ] Tests still pass
- [ ] Console warnings reduced

---

## Task M4.3: Fix useEffect Missing Dependencies

**Estimated Effort:** 1.5h
**Risk Level:** Medium
**Assignable To:** coder

**Input State:**
- 12 useEffect hooks with missing dependencies
- ESLint warnings suppressed
- Potential stale closures

**Action Steps:**
1. Enable ESLint rule:
   ```json
   // .eslintrc.json
   {
     "rules": {
       "react-hooks/exhaustive-deps": "error"
     }
   }
   ```
2. Fix Game.tsx game state effect:
   ```typescript
   // Before
   useEffect(() => {
     if (gameState === 'playing') {
       startTimer();
     }
   }, [gameState]); // Missing: startTimer

   // After
   const startTimerCallback = useCallback(() => {
     startTimer();
   }, [/* timer deps */]);

   useEffect(() => {
     if (gameState === 'playing') {
       startTimerCallback();
     }
   }, [gameState, startTimerCallback]);
   ```
3. Fix Timer.tsx interval effect:
   ```typescript
   // Before
   useEffect(() => {
     const id = setInterval(() => {
       setTime(prev => prev + 1);
     }, 1000);
     return () => clearInterval(id);
   }, []); // Missing: setTime (but OK due to functional update)

   // After - Add explanation comment
   useEffect(() => {
     const id = setInterval(() => {
       // Using functional update, no dependency needed
       setTime(prev => prev + 1);
     }, 1000);
     return () => clearInterval(id);
   }, []); // eslint-disable-line react-hooks/exhaustive-deps -- functional update pattern
   ```
4. Fix remaining 10 instances
5. Document legitimate suppressions

**Output State:**
- 12 useEffect hooks with correct dependencies
- ESLint rule enabled
- Stale closures eliminated
- Comments explain legitimate cases

**Validation Command:**
```bash
npm run lint
npm test -- --run
```

**Dependencies:**
- M4.1 (warning inventory)

**Rollback Procedure:**
```bash
git diff > /tmp/m4.3-effects.patch
git checkout src/
```

**Success Criteria:**
- [ ] All 12 effects fixed
- [ ] ESLint rule enabled
- [ ] No stale closures
- [ ] Tests pass
- [ ] Legitimate cases documented

---

## Task M4.4: Fix State Updates on Unmounted Components

**Estimated Effort:** 1h
**Risk Level:** Medium
**Assignable To:** coder

**Input State:**
- 5 components with async state updates
- "Can't perform state update on unmounted component" warnings
- Memory leaks possible

**Action Steps:**
1. Create cleanup pattern utility:
   ```typescript
   // src/hooks/useMounted.ts
   import { useEffect, useRef } from 'react';

   export function useMounted() {
     const mounted = useRef(true);

     useEffect(() => {
       return () => {
         mounted.current = false;
       };
     }, []);

     return mounted;
   }
   ```
2. Fix AudioPlayer async loading:
   ```typescript
   // Before
   const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

   useEffect(() => {
     async function loadAudio() {
       const audioElement = new Audio(src);
       await audioElement.load();
       setAudio(audioElement);
     }
     loadAudio();
   }, [src]);

   // After
   const mounted = useMounted();

   useEffect(() => {
     async function loadAudio() {
       const audioElement = new Audio(src);
       await audioElement.load();
       if (mounted.current) {
         setAudio(audioElement);
       }
     }
     loadAudio();
   }, [src, mounted]);
   ```
3. Apply pattern to 4 other components
4. Add cleanup in useEffect returns

**Output State:**
- useMounted hook created
- 5 components use mounted check
- No unmounted state updates
- Memory leaks prevented

**Validation Command:**
```bash
npm test -- --run
# Check console for unmounted warnings
npm run dev
```

**Dependencies:**
- M4.3 (effect dependencies correct)

**Rollback Procedure:**
```bash
rm src/hooks/useMounted.ts
git checkout src/
```

**Success Criteria:**
- [ ] useMounted hook created
- [ ] All 5 components fixed
- [ ] No unmounted warnings
- [ ] Tests pass

---

## Tasks M4.5 - M4.18 (Condensed)

**M4.5: Fix Invalid DOM Nesting (1h)** - Correct nested button/anchor issues
**M4.6: Fix Prop Type Mismatches (0.5h)** - Align component prop types
**M4.7: Remove Deprecated API Usage (0.5h)** - Update to React 18+ APIs
**M4.8: Fix Event Handler Type Errors (0.5h)** - Correct event parameter types
**M4.9: Add Proper Error Boundaries (1h)** - Wrap components in error handlers
**M4.10: Fix Ref Forwarding Issues (0.5h)** - Use forwardRef correctly
**M4.11: Clean Up Console Logs (0.5h)** - Remove debug statements
**M4.12: Fix Accessibility Warnings (1h)** - Add ARIA labels, alt text
**M4.13: Fix Layout Shift Warnings (0.5h)** - Prevent cumulative layout shift
**M4.14: Optimize Re-render Warnings (1h)** - Add memo, useMemo, useCallback
**M4.15: Fix Hydration Mismatch (0.5h)** - Ensure SSR compatibility (if applicable)
**M4.16: Add Warning Detection Tests (1h)** - Test that no warnings occur
**M4.17: Update ESLint Configuration (0.5h)** - Enforce warning-free code
**M4.18: M4 Milestone Integration Test (0.5h)** - Validate zero warnings

---

## M4 Summary

**Total Tasks:** 18
**Total Effort:** 7 hours
**Critical Path:** M4.1 → M4.2 → M4.3 → M4.4 → M4.18 (5.5h)

**Parallelizable Groups:**
- Group 1: M4.1 (sequential, 1h)
- Group 2 (after M4.1): M4.2, M4.3 (parallel, 1.5h)
- Group 3 (after Group 2): M4.4, M4.5, M4.6, M4.7 (parallel, 2.5h)
- Group 4 (after Group 3): M4.8-M4.15 (parallel, 6h)
- Group 5 (after Group 4): M4.16, M4.17 (parallel, 1.5h)
- Group 6: M4.18 (final, 0.5h)

**Success Metrics:**
- React warnings: ~25 → 0
- Console errors: 0
- Tests pass: 100%
- ESLint errors: 0
- Production-ready warnings cleanup
