# M3: React Hook Tests - Granular Task Breakdown

**Milestone:** Comprehensive hook test coverage
**Total Effort:** 12 hours
**Total Tasks:** 30 tasks
**Risk Level:** Medium
**Dependencies:** M1 (TypeScript stability)

---

## Task M3.1: Create Hook Testing Infrastructure

**Estimated Effort:** 1.5h
**Risk Level:** Low
**Assignable To:** coder

**Input State:**
- No standardized hook testing utilities
- Each hook test uses different setup
- No reusable test wrappers

**Action Steps:**
1. Create `src/tests/utils/hooks/index.ts`
2. Add custom hook wrapper:
   ```typescript
   import { renderHook, RenderHookOptions } from '@testing-library/react';
   import { ReactNode } from 'react';

   export interface HookWrapperOptions {
     providers?: Array<({ children }: { children: ReactNode }) => JSX.Element>;
   }

   export function createHookWrapper(options: HookWrapperOptions = {}) {
     return function HookWrapper({ children }: { children: ReactNode }) {
       if (!options.providers || options.providers.length === 0) {
         return <>{children}</>;
       }

       return options.providers.reduceRight(
         (acc, Provider) => <Provider>{acc}</Provider>,
         <>{children}</>
       );
     };
   }

   export function renderTestHook<TProps, TResult>(
     hook: (props: TProps) => TResult,
     options?: HookWrapperOptions & RenderHookOptions<TProps>
   ) {
     const { providers, ...renderOptions } = options || {};
     const wrapper = createHookWrapper({ providers });
     return renderHook(hook, { wrapper, ...renderOptions });
   }
   ```
3. Add hook test utilities
4. Create TypeScript types

**Output State:**
- File: `src/tests/utils/hooks/index.ts`
- Reusable hook testing infrastructure
- Provider composition support

**Validation Command:**
```bash
npm run typecheck
npm test -- src/tests/utils/hooks/ --run
```

**Dependencies:**
- M1.12 (TypeScript stable)

**Rollback Procedure:**
```bash
rm -rf src/tests/utils/hooks/
```

**Success Criteria:**
- [ ] Hook wrapper created
- [ ] Provider composition works
- [ ] TypeScript types correct
- [ ] Example test passes

---

## Task M3.2: Write useGame Hook Tests

**Estimated Effort:** 2h
**Risk Level:** Medium
**Assignable To:** tester

**Input State:**
- useGame hook exists
- No test coverage
- Game state transitions untested

**Action Steps:**
1. Create `src/tests/hooks/useGame.test.tsx`
2. Test initial state:
   ```typescript
   describe('useGame', () => {
     it('should initialize with default state', () => {
       const { result } = renderTestHook(() => useGame());

       expect(result.current.gameState).toBe('idle');
       expect(result.current.score).toBe(0);
       expect(result.current.timeElapsed).toBe(0);
       expect(result.current.isComplete).toBe(false);
     });
   });
   ```
3. Test state transitions:
   ```typescript
   it('should transition from idle to playing', () => {
     const { result } = renderTestHook(() => useGame());

     act(() => {
       result.current.startGame();
     });

     expect(result.current.gameState).toBe('playing');
     expect(result.current.startTime).toBeDefined();
   });

   it('should transition from playing to paused', () => {
     const { result } = renderTestHook(() => useGame());

     act(() => {
       result.current.startGame();
       result.current.pauseGame();
     });

     expect(result.current.gameState).toBe('paused');
   });
   ```
4. Test score updates
5. Test completion logic
6. Test reset functionality

**Output State:**
- File: `src/tests/hooks/useGame.test.tsx` with 10+ tests
- All game state transitions tested
- Edge cases covered

**Validation Command:**
```bash
npm test -- src/tests/hooks/useGame.test.tsx --run
npm run test:coverage -- src/hooks/useGame.ts
```

**Dependencies:**
- M3.1 (hook infrastructure)

**Rollback Procedure:**
```bash
rm src/tests/hooks/useGame.test.tsx
```

**Success Criteria:**
- [ ] 10+ tests pass
- [ ] All states tested
- [ ] Transitions verified
- [ ] Coverage > 90%

---

## Task M3.3: Write usePuzzle Hook Tests

**Estimated Effort:** 2h
**Risk Level:** Medium
**Assignable To:** tester

**Input State:**
- usePuzzle hook manages puzzle pieces
- No test coverage
- Drag-and-drop logic untested

**Action Steps:**
1. Create `src/tests/hooks/usePuzzle.test.tsx`
2. Test piece selection:
   ```typescript
   describe('usePuzzle', () => {
     it('should select puzzle piece', () => {
       const { result } = renderTestHook(() => usePuzzle());

       act(() => {
         result.current.selectPiece('piece-1');
       });

       expect(result.current.selectedPiece).toBe('piece-1');
     });
   });
   ```
3. Test piece placement:
   ```typescript
   it('should place piece correctly', () => {
     const { result } = renderTestHook(() => usePuzzle());

     act(() => {
       result.current.selectPiece('piece-1');
       result.current.placePiece('slot-1');
     });

     expect(result.current.placedPieces['slot-1']).toBe('piece-1');
     expect(result.current.selectedPiece).toBeNull();
   });

   it('should reject incorrect placement', () => {
     const { result } = renderTestHook(() => usePuzzle());

     act(() => {
       result.current.selectPiece('piece-1');
       result.current.placePiece('wrong-slot');
     });

     expect(result.current.placedPieces['wrong-slot']).toBeUndefined();
     expect(result.current.selectedPiece).toBe('piece-1');
   });
   ```
4. Test validation logic
5. Test completion detection

**Output State:**
- File: `src/tests/hooks/usePuzzle.test.tsx` with 8+ tests
- Puzzle logic fully tested
- Edge cases covered

**Validation Command:**
```bash
npm test -- src/tests/hooks/usePuzzle.test.tsx --run
```

**Dependencies:**
- M3.1 (hook infrastructure)

**Rollback Procedure:**
```bash
rm src/tests/hooks/usePuzzle.test.tsx
```

**Success Criteria:**
- [ ] 8+ tests pass
- [ ] Selection logic tested
- [ ] Placement validation works
- [ ] Completion detection correct

---

## Task M3.4: Write useAudio Hook Tests

**Estimated Effort:** 1.5h
**Risk Level:** Low
**Assignable To:** tester

**Input State:**
- useAudio hook manages sound effects
- Audio mocking needed
- No test coverage

**Action Steps:**
1. Create audio mock in `src/tests/setup.ts`:
   ```typescript
   global.Audio = class MockAudio {
     src: string = '';
     volume: number = 1;
     currentTime: number = 0;
     paused: boolean = true;

     play = vi.fn().mockResolvedValue(undefined);
     pause = vi.fn();
     load = vi.fn();

     addEventListener = vi.fn();
     removeEventListener = vi.fn();
   } as any;
   ```
2. Create `src/tests/hooks/useAudio.test.tsx`
3. Test sound playback:
   ```typescript
   describe('useAudio', () => {
     it('should play sound effect', () => {
       const { result } = renderTestHook(() => useAudio());

       act(() => {
         result.current.playSound('success');
       });

       expect(global.Audio.prototype.play).toHaveBeenCalled();
     });

     it('should respect mute state', () => {
       const { result } = renderTestHook(() => useAudio({ muted: true }));

       act(() => {
         result.current.playSound('success');
       });

       expect(global.Audio.prototype.play).not.toHaveBeenCalled();
     });
   });
   ```
4. Test volume control
5. Test mute/unmute

**Output State:**
- Audio mock in setup.ts
- File: `src/tests/hooks/useAudio.test.tsx` with 5+ tests
- All audio features tested

**Validation Command:**
```bash
npm test -- src/tests/hooks/useAudio.test.tsx --run
```

**Dependencies:**
- M3.1 (hook infrastructure)

**Rollback Procedure:**
```bash
git checkout src/tests/setup.ts
rm src/tests/hooks/useAudio.test.tsx
```

**Success Criteria:**
- [ ] 5+ tests pass
- [ ] Audio mock works
- [ ] Playback logic tested
- [ ] Mute state respected

---

## Tasks M3.5 - M3.30 (Condensed)

**M3.5: useLocalStorage Hook Tests (1.5h)** - Test persistence, JSON serialization
**M3.6: useTimer Hook Tests (1h)** - Test countdown, elapsed time
**M3.7: useKeyboard Hook Tests (1h)** - Test key event handling
**M3.8: useMediaQuery Hook Tests (1h)** - Test responsive breakpoints
**M3.9: useDebounce Hook Tests (1h)** - Test delayed updates
**M3.10: useThrottle Hook Tests (1h)** - Test rate limiting
**M3.11: usePrevious Hook Tests (0.5h)** - Test value tracking
**M3.12: useToggle Hook Tests (0.5h)** - Test boolean state
**M3.13: useCounter Hook Tests (0.5h)** - Test increment/decrement
**M3.14: useArray Hook Tests (1h)** - Test array manipulation
**M3.15: useMap Hook Tests (1h)** - Test map operations
**M3.16: useSet Hook Tests (1h)** - Test set operations
**M3.17: useInterval Hook Tests (1h)** - Test periodic execution
**M3.18: useTimeout Hook Tests (1h)** - Test delayed execution
**M3.19: useClickOutside Hook Tests (1h)** - Test outside click detection
**M3.20: useFocus Hook Tests (0.5h)** - Test focus management
**M3.21: useHover Hook Tests (0.5h)** - Test hover state
**M3.22: useWindowSize Hook Tests (1h)** - Test window resize
**M3.23: useScrollPosition Hook Tests (1h)** - Test scroll tracking
**M3.24: useOnMount Hook Tests (0.5h)** - Test mount lifecycle
**M3.25: useOnUnmount Hook Tests (0.5h)** - Test unmount cleanup
**M3.26: useUpdateEffect Hook Tests (0.5h)** - Test skip-first-render effect
**M3.27: useIsomorphicEffect Hook Tests (0.5h)** - Test SSR compatibility
**M3.28: useMountedState Hook Tests (0.5h)** - Test mount tracking
**M3.29: Hook Performance Benchmarks (1h)** - Benchmark all hooks
**M3.30: M3 Milestone Integration Test (0.5h)** - Validate all hook tests

---

## M3 Summary

**Total Tasks:** 30
**Total Effort:** 12 hours
**Critical Path:** M3.1 → M3.2 → M3.3 → M3.4 → M3.30 (7.5h)

**Parallelizable Groups:**
- Group 1: M3.1 (sequential, 1.5h)
- Group 2 (after M3.1): M3.2, M3.3, M3.4 (parallel, 2h)
- Group 3 (after Group 2): M3.5-M3.10 (parallel, 6.5h)
- Group 4 (after Group 3): M3.11-M3.28 (parallel, 11h)
- Group 5: M3.29-M3.30 (sequential, 1.5h)

**Success Metrics:**
- Hook test coverage: 0% → 95%+
- All custom hooks tested
- Performance benchmarks established
- Edge cases documented
