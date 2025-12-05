# M1: TypeScript Stability - Granular Task Breakdown

**Milestone:** Fix all TypeScript errors (5 errors → 0 errors)
**Total Effort:** 6 hours
**Total Tasks:** 12 tasks
**Risk Level:** Low
**Dependencies:** None (entry point for Phase 1)

---

## Task M1.1: Remove Unused isCI Variable

**Estimated Effort:** 0.5h
**Risk Level:** Low
**Assignable To:** coder

**Input State:**
- File: `src/tests/setup.ts` line 6
- Error: `TS6133: 'isCI' is declared but its value is never read`
- TypeScript error count: 5

**Action Steps:**
1. Open `src/tests/setup.ts`
2. Remove line 6: `const isCI = process.env.CI === 'true';`
3. Search entire file for any `isCI` usage
4. Verify no other references exist

**Output State:**
- File: `src/tests/setup.ts` without isCI declaration
- TypeScript error count: 4
- No functional changes to test behavior

**Validation Command:**
```bash
npm run typecheck 2>&1 | grep -c "error TS"
# Expected: 4
```

**Dependencies:**
- None

**Rollback Procedure:**
```bash
git checkout src/tests/setup.ts
npm run typecheck
```

**Success Criteria:**
- [ ] TypeScript error count reduced to 4
- [ ] No references to `isCI` in file
- [ ] All tests still pass: `npm test -- --run`

---

## Task M1.2: Fix requestAnimationFrame Type Cast

**Estimated Effort:** 1h
**Risk Level:** Low
**Assignable To:** coder

**Input State:**
- File: `src/tests/setup.ts` line 43
- Error: `TS2322: Type 'Timeout' is not assignable to type 'number'`
- TypeScript error count: 4

**Action Steps:**
1. Open `src/tests/setup.ts` line 43
2. Add type assertion to RAF mock:
   ```typescript
   global.requestAnimationFrame = ((cb: FrameRequestCallback) => {
     return setTimeout(cb, 16) as unknown as number;
   }) as any;
   ```
3. Verify type compatibility
4. Test RAF-dependent tests

**Output State:**
- File: `src/tests/setup.ts` with corrected RAF type
- TypeScript error count: 3
- RAF mock maintains 16ms timing

**Validation Command:**
```bash
npm run typecheck 2>&1 | grep "requestAnimationFrame"
# Expected: No output (error resolved)
npm test -- src/tests/components/Game.test.tsx --run
```

**Dependencies:**
- M1.1 (cleanup first)

**Rollback Procedure:**
```bash
git diff src/tests/setup.ts > /tmp/m1.2.patch
git checkout src/tests/setup.ts
# To reapply: git apply /tmp/m1.2.patch
```

**Success Criteria:**
- [ ] TypeScript error count reduced to 3
- [ ] RAF mock returns number type
- [ ] Game component tests pass (use RAF)

---

## Task M1.3: Create TouchList Mock Helper

**Estimated Effort:** 1.5h
**Risk Level:** Medium
**Assignable To:** coder

**Input State:**
- File: `src/tests/setup.ts` lines 198-200
- Errors: 3x `TS2352: Conversion of type 'Touch[]' to 'TouchList' may be a mistake`
- TypeScript error count: 3

**Action Steps:**
1. Create `TouchListMock` class in `src/tests/setup.ts`:
   ```typescript
   class TouchListMock implements TouchList {
     private touches: Touch[];

     constructor(touches: Touch[]) {
       this.touches = touches;
     }

     get length(): number {
       return this.touches.length;
     }

     item(index: number): Touch | null {
       return this.touches[index] ?? null;
     }

     [Symbol.iterator]() {
       return this.touches[Symbol.iterator]();
     }

     [index: number]: Touch;
   }
   ```
2. Add helper function:
   ```typescript
   function createTouchList(touches?: Touch[]): TouchList {
     if (!touches) return new TouchListMock([]);
     const list = new TouchListMock(touches);
     // Populate numeric indices
     touches.forEach((touch, i) => {
       (list as any)[i] = touch;
     });
     return list;
   }
   ```
3. Document usage in JSDoc

**Output State:**
- File: `src/tests/setup.ts` with TouchListMock class
- Helper function available for tests
- No type conversion errors

**Validation Command:**
```bash
npm run typecheck 2>&1 | grep "TouchList"
# Expected: No output
npm test -- src/tests/setup.ts --run
```

**Dependencies:**
- M1.2 (maintain file consistency)

**Rollback Procedure:**
```bash
git diff src/tests/setup.ts > /tmp/m1.3.patch
git checkout src/tests/setup.ts
```

**Success Criteria:**
- [ ] TouchListMock implements all TouchList methods
- [ ] Helper function creates valid TouchList
- [ ] No TypeScript errors for TouchList

---

## Task M1.4: Apply TouchList Helper to Touch Events

**Estimated Effort:** 1h
**Risk Level:** Low
**Assignable To:** coder

**Input State:**
- File: `src/tests/setup.ts` lines 198-200
- Direct Touch[] to TouchList casts causing errors
- TypeScript error count: 3

**Action Steps:**
1. Replace line 198:
   ```typescript
   // Before
   touches: init.touches as unknown as TouchList,
   // After
   touches: createTouchList(init.touches),
   ```
2. Replace line 199:
   ```typescript
   // Before
   targetTouches: init.targetTouches as unknown as TouchList,
   // After
   targetTouches: createTouchList(init.targetTouches),
   ```
3. Replace line 200:
   ```typescript
   // Before
   changedTouches: init.changedTouches as unknown as TouchList,
   // After
   changedTouches: createTouchList(init.changedTouches),
   ```
4. Verify all TouchEvent creation

**Output State:**
- File: `src/tests/setup.ts` using createTouchList helper
- TypeScript error count: 0
- All touch events properly typed

**Validation Command:**
```bash
npm run typecheck
# Expected: No errors
npm test -- src/tests/components/mobile/ --run
```

**Dependencies:**
- M1.3 (requires TouchListMock helper)

**Rollback Procedure:**
```bash
git checkout src/tests/setup.ts
npm run typecheck
```

**Success Criteria:**
- [ ] Zero TypeScript errors
- [ ] All touch event mocks use helper
- [ ] Mobile tests pass (use TouchEvent)

---

## Task M1.5: Verify Type Safety Across Test Suite

**Estimated Effort:** 1h
**Risk Level:** Low
**Assignable To:** tester

**Input State:**
- All TypeScript errors resolved
- Test suite may have untested edge cases
- Coverage: Unknown for new TouchListMock

**Action Steps:**
1. Run full test suite with coverage:
   ```bash
   npm run test:coverage -- src/tests/setup.ts
   ```
2. Verify TouchListMock coverage > 90%
3. Test edge cases:
   - Empty touch list
   - Single touch
   - Multiple touches (3+)
   - Touch at specific index
4. Document any gaps

**Output State:**
- Coverage report for setup.ts
- Edge cases tested
- No type-related test failures

**Validation Command:**
```bash
npm test -- src/tests/ --run
npm run typecheck
```

**Dependencies:**
- M1.4 (all fixes applied)

**Rollback Procedure:**
```bash
# Read-only verification, no rollback needed
```

**Success Criteria:**
- [ ] 100% test pass rate
- [ ] TouchListMock coverage > 90%
- [ ] Zero TypeScript errors
- [ ] No console warnings during tests

---

## Task M1.6: Add Type Guards for Touch Events

**Estimated Effort:** 0.5h
**Risk Level:** Low
**Assignable To:** coder

**Input State:**
- TouchListMock created but no type guards
- Potential runtime errors if invalid input

**Action Steps:**
1. Add type guard function:
   ```typescript
   function isTouchListMock(value: any): value is TouchListMock {
     return value instanceof TouchListMock;
   }
   ```
2. Add validation in createTouchList:
   ```typescript
   function createTouchList(touches?: Touch[]): TouchList {
     if (!touches) return new TouchListMock([]);
     if (!Array.isArray(touches)) {
       throw new TypeError('createTouchList expects Touch[] or undefined');
     }
     // ... rest of implementation
   }
   ```
3. Add JSDoc type examples

**Output State:**
- Type guards added to setup.ts
- Runtime validation for invalid inputs
- Better developer experience

**Validation Command:**
```bash
npm run typecheck
npm test -- src/tests/setup.ts --run
```

**Dependencies:**
- M1.4 (apply to existing TouchListMock)

**Rollback Procedure:**
```bash
git diff src/tests/setup.ts > /tmp/m1.6.patch
git checkout src/tests/setup.ts
```

**Success Criteria:**
- [ ] Type guard function created
- [ ] Validation throws on invalid input
- [ ] JSDoc updated with examples

---

## Task M1.7: Document TouchListMock API

**Estimated Effort:** 0.5h
**Risk Level:** Low
**Assignable To:** api-docs

**Input State:**
- TouchListMock functional but undocumented
- No usage examples for developers

**Action Steps:**
1. Add JSDoc to TouchListMock class:
   ```typescript
   /**
    * Mock implementation of TouchList interface for testing
    *
    * @example
    * ```typescript
    * const touches = [createTouch({ identifier: 1 })];
    * const touchList = createTouchList(touches);
    * expect(touchList.length).toBe(1);
    * expect(touchList.item(0)).toBe(touches[0]);
    * ```
    */
   class TouchListMock implements TouchList {
   ```
2. Document createTouchList helper
3. Add inline comments for complex logic
4. Create usage guide in docs/

**Output State:**
- File: `src/tests/setup.ts` with complete JSDoc
- File: `docs/testing/touch-mocks.md` with examples
- Improved maintainability

**Validation Command:**
```bash
npm run docs:api
# Check for TouchListMock in generated docs
```

**Dependencies:**
- M1.6 (document final API)

**Rollback Procedure:**
```bash
git checkout src/tests/setup.ts docs/testing/
```

**Success Criteria:**
- [ ] JSDoc on all public APIs
- [ ] Usage examples in docs/
- [ ] Generated API docs include TouchListMock

---

## Task M1.8: Add Unit Tests for TouchListMock

**Estimated Effort:** 1h
**Risk Level:** Low
**Assignable To:** tester

**Input State:**
- TouchListMock implemented but no dedicated tests
- Integration tests exist but no unit coverage

**Action Steps:**
1. Create `src/tests/setup.test.ts`
2. Add unit tests:
   ```typescript
   describe('TouchListMock', () => {
     it('should create empty TouchList', () => {
       const list = createTouchList();
       expect(list.length).toBe(0);
     });

     it('should create TouchList from array', () => {
       const touches = [createTouch({ identifier: 1 })];
       const list = createTouchList(touches);
       expect(list.length).toBe(1);
       expect(list.item(0)).toBe(touches[0]);
     });

     it('should support numeric indexing', () => {
       const touches = [createTouch({ identifier: 1 })];
       const list = createTouchList(touches);
       expect(list[0]).toBe(touches[0]);
     });

     it('should return null for invalid index', () => {
       const list = createTouchList([]);
       expect(list.item(99)).toBeNull();
     });

     it('should be iterable', () => {
       const touches = [
         createTouch({ identifier: 1 }),
         createTouch({ identifier: 2 })
       ];
       const list = createTouchList(touches);
       const items = [...list];
       expect(items).toEqual(touches);
     });
   });
   ```

**Output State:**
- File: `src/tests/setup.test.ts` with 5+ tests
- 100% coverage for TouchListMock
- Tests pass

**Validation Command:**
```bash
npm test -- src/tests/setup.test.ts --run
npm run test:coverage -- src/tests/setup.ts
```

**Dependencies:**
- M1.7 (test documented API)

**Rollback Procedure:**
```bash
rm src/tests/setup.test.ts
git status
```

**Success Criteria:**
- [ ] All unit tests pass
- [ ] 100% coverage for TouchListMock
- [ ] Tests cover edge cases (empty, null, iteration)

---

## Task M1.9: Run Full TypeScript Validation

**Estimated Effort:** 0.5h
**Risk Level:** Low
**Assignable To:** reviewer

**Input State:**
- All TypeScript fixes applied
- Tests passing
- Documentation complete

**Action Steps:**
1. Run strict TypeScript check:
   ```bash
   npm run typecheck
   ```
2. Verify zero errors
3. Check for any warnings
4. Run in CI mode:
   ```bash
   CI=true npm run typecheck
   ```
5. Document baseline

**Output State:**
- Zero TypeScript errors
- Zero TypeScript warnings
- Clean CI typecheck
- Baseline documented

**Validation Command:**
```bash
npm run typecheck
echo $?
# Expected: 0 (success)
```

**Dependencies:**
- M1.8 (all code complete)

**Rollback Procedure:**
```bash
# Read-only validation, no rollback needed
```

**Success Criteria:**
- [ ] Exit code 0 from typecheck
- [ ] No errors in output
- [ ] No warnings in output
- [ ] CI mode passes

---

## Task M1.10: Update CI/CD for TypeScript Checks

**Estimated Effort:** 0.5h
**Risk Level:** Low
**Assignable To:** cicd-engineer

**Input State:**
- CI may not enforce typecheck
- No TypeScript error prevention

**Action Steps:**
1. Add to `.github/workflows/test.yml`:
   ```yaml
   - name: TypeScript Check
     run: npm run typecheck
   ```
2. Add to pre-commit hook (if exists)
3. Update package.json scripts:
   ```json
   "pretest": "npm run typecheck",
   "validate": "npm run typecheck && npm run lint && npm test -- --run"
   ```
4. Test locally

**Output State:**
- CI enforces typecheck
- Pre-commit hook includes typecheck
- Validation script comprehensive

**Validation Command:**
```bash
npm run validate
# Should run typecheck, lint, and tests
```

**Dependencies:**
- M1.9 (ensure clean baseline)

**Rollback Procedure:**
```bash
git checkout .github/workflows/test.yml package.json
```

**Success Criteria:**
- [ ] CI runs typecheck
- [ ] Validation script includes typecheck
- [ ] Local validation passes

---

## Task M1.11: Performance Benchmark TouchListMock

**Estimated Effort:** 0.5h
**Risk Level:** Low
**Assignable To:** perf-analyzer

**Input State:**
- TouchListMock functional but performance unknown
- No benchmark data

**Action Steps:**
1. Create benchmark script `src/tests/benchmarks/touchlist.bench.ts`:
   ```typescript
   import { bench } from 'vitest';
   import { createTouchList, createTouch } from '../setup';

   bench('create empty TouchList', () => {
     createTouchList();
   });

   bench('create TouchList with 10 touches', () => {
     const touches = Array.from({ length: 10 }, (_, i) =>
       createTouch({ identifier: i })
     );
     createTouchList(touches);
   });

   bench('iterate TouchList with 10 touches', () => {
     const touches = Array.from({ length: 10 }, (_, i) =>
       createTouch({ identifier: i })
     );
     const list = createTouchList(touches);
     for (const touch of list) {
       touch.identifier;
     }
   });
   ```
2. Run benchmarks:
   ```bash
   npm test -- src/tests/benchmarks/ --run --mode=benchmark
   ```
3. Document baseline performance

**Output State:**
- Benchmark suite created
- Baseline performance documented
- No performance regressions

**Validation Command:**
```bash
npm test -- src/tests/benchmarks/touchlist.bench.ts --run --mode=benchmark
```

**Dependencies:**
- M1.8 (test implementation)

**Rollback Procedure:**
```bash
rm -rf src/tests/benchmarks/
```

**Success Criteria:**
- [ ] Benchmark suite runs
- [ ] Performance within acceptable range
- [ ] Baseline documented in docs/

---

## Task M1.12: Final Integration Test for M1 Milestone

**Estimated Effort:** 0.5h
**Risk Level:** Low
**Assignable To:** tester

**Input State:**
- All 11 tasks complete
- Individual validations passed
- Need full integration check

**Action Steps:**
1. Run complete validation suite:
   ```bash
   npm run validate
   npm run test:coverage
   npm run build
   ```
2. Verify metrics:
   - TypeScript errors: 0
   - Test pass rate: 100%
   - Coverage: No regression
   - Build: Success
3. Create milestone completion report
4. Tag completion in git:
   ```bash
   git tag -a m1-typescript-complete -m "M1: TypeScript Stability Complete"
   ```

**Output State:**
- All validation passing
- Metrics documented
- Milestone tagged
- Ready for M2

**Validation Command:**
```bash
npm run validate && npm run build
echo "M1 Status: $?"
```

**Dependencies:**
- M1.1 through M1.11 (all previous tasks)

**Rollback Procedure:**
```bash
git tag -d m1-typescript-complete
# Rollback to M1 start
```

**Success Criteria:**
- [ ] All validation passes
- [ ] Zero TypeScript errors
- [ ] 100% test pass rate
- [ ] Build succeeds
- [ ] Milestone tagged in git
- [ ] Completion report created

---

## M1 Summary

**Total Tasks:** 12
**Total Effort:** 6 hours
**Parallelizable Groups:**
- Group 1 (Sequential): M1.1 → M1.2 → M1.3 → M1.4
- Group 2 (Parallel after M1.4): M1.5, M1.6, M1.7
- Group 3 (Parallel after Group 2): M1.8, M1.9, M1.10, M1.11
- Group 4 (Final): M1.12

**Critical Path:** M1.1 → M1.2 → M1.3 → M1.4 → M1.12 (4.5h)

**Success Metrics:**
- TypeScript errors: 5 → 0 ✓
- Test coverage: No regression ✓
- Build time: No regression ✓
- Documentation: Complete ✓
