# M8: Type Safety Enhancement - Granular Task Breakdown

**Milestone:** Eliminate all `any` types, enable strict mode
**Total Effort:** 17 hours
**Total Tasks:** 45 tasks
**Risk Level:** Medium
**Dependencies:** M7 (components refactored)

---

## Task M8.1: Audit `any` Type Usage

**Estimated Effort:** 1.5h
**Risk Level:** Low
**Assignable To:** code-analyzer

**Input State:**
- 83 `any` type usages in codebase
- No systematic tracking
- Unknown risk assessment

**Action Steps:**
1. Run TypeScript analysis:
   ```bash
   npx ts-prune | grep "any"
   grep -r ": any" src/ --include="*.ts" --include="*.tsx"
   ```
2. Categorize `any` usages:
   ```markdown
   ## Any Type Inventory

   ### Event Handlers (18 instances)
   - src/components/GameBoard.tsx:45 - onClick handler
   - src/hooks/useDragDrop.ts:22 - DragEvent

   ### Third-Party Library Types (25 instances)
   - src/lib/supabase.ts:12 - SupabaseClient response
   - src/hooks/useAuth.ts:35 - OAuth provider

   ### Complex Data Structures (15 instances)
   - src/types/game.ts:78 - Nested state object
   - src/utils/mapData.ts:124 - SVG path data

   ### API Responses (12 instances)
   - src/api/scores.ts:34 - Server response
   - src/api/users.ts:56 - Profile data

   ### Utility Functions (8 instances)
   - src/utils/helpers.ts:90 - Generic formatter

   ### Component Props (5 instances)
   - src/components/Modal.tsx:23 - Children render prop

   **Total: 83 instances**
   **Priority Order:** Event handlers → API responses → Library types
   ```
3. Create replacement plan
4. Estimate effort per category

**Output State:**
- File: `docs/type-safety/any-audit.md`
- Complete inventory
- Prioritized fix list

**Validation Command:**
```bash
grep -r ": any" src/ | wc -l
# Expected: 83
```

**Dependencies:**
- M7.55 (components refactored)

**Rollback Procedure:**
```bash
# Read-only audit, no rollback needed
```

**Success Criteria:**
- [ ] All 83 instances documented
- [ ] Categories identified
- [ ] Priority assigned
- [ ] Fix plan created

---

## Task M8.2: Create Event Handler Types

**Estimated Effort:** 2h
**Risk Level:** Low
**Assignable To:** coder

**Input State:**
- 18 event handlers use `any`
- No centralized type definitions
- Inconsistent typing

**Action Steps:**
1. Create `src/types/events.ts`:
   ```typescript
   import { MouseEvent, TouchEvent, DragEvent, KeyboardEvent } from 'react';

   // Mouse Events
   export type ClickHandler<T = HTMLElement> = (event: MouseEvent<T>) => void;
   export type DoubleClickHandler<T = HTMLElement> = (event: MouseEvent<T>) => void;
   export type MouseMoveHandler<T = HTMLElement> = (event: MouseEvent<T>) => void;

   // Touch Events
   export type TouchStartHandler<T = HTMLElement> = (event: TouchEvent<T>) => void;
   export type TouchMoveHandler<T = HTMLElement> = (event: TouchEvent<T>) => void;
   export type TouchEndHandler<T = HTMLElement> = (event: TouchEvent<T>) => void;

   // Drag Events
   export type DragStartHandler<T = HTMLElement> = (event: DragEvent<T>) => void;
   export type DragOverHandler<T = HTMLElement> = (event: DragEvent<T>) => void;
   export type DropHandler<T = HTMLElement> = (event: DragEvent<T>) => void;

   // Keyboard Events
   export type KeyDownHandler<T = HTMLElement> = (event: KeyboardEvent<T>) => void;
   export type KeyUpHandler<T = HTMLElement> = (event: KeyboardEvent<T>) => void;

   // Form Events
   export type FormSubmitHandler = (event: FormEvent<HTMLFormElement>) => void;
   export type InputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => void;
   export type SelectChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => void;

   // Custom Event Types
   export interface DepartmentSelectEvent {
     departmentId: string;
     position: { x: number; y: number };
   }

   export interface PuzzlePlaceEvent {
     departmentId: string;
     slotId: string;
     isCorrect: boolean;
   }
   ```
2. Replace all event handler `any` types:
   ```typescript
   // Before
   const handleClick = (event: any) => {
     // ...
   };

   // After
   import { ClickHandler } from '../../types/events';

   const handleClick: ClickHandler = (event) => {
     // Full type inference now available
   };
   ```
3. Update all 18 instances
4. Verify type inference

**Output State:**
- File: `src/types/events.ts` with 15+ types
- 18 handlers properly typed
- Zero event handler `any` types

**Validation Command:**
```bash
npm run typecheck
grep -r "event: any" src/ | wc -l
# Expected: 0
```

**Dependencies:**
- M8.1 (audit complete)

**Rollback Procedure:**
```bash
rm src/types/events.ts
git checkout src/
```

**Success Criteria:**
- [ ] Event types defined
- [ ] All 18 handlers typed
- [ ] Type inference working
- [ ] Zero `any` in handlers

---

## Task M8.3: Type API Response Structures

**Estimated Effort:** 2.5h
**Risk Level:** Medium
**Assignable To:** coder

**Input State:**
- 12 API responses use `any`
- No runtime validation
- No schema definitions

**Action Steps:**
1. Create `src/types/api.ts`:
   ```typescript
   // Base API response types
   export interface ApiResponse<T> {
     data: T | null;
     error: ApiError | null;
     metadata?: ResponseMetadata;
   }

   export interface ApiError {
     code: string;
     message: string;
     details?: Record<string, unknown>;
   }

   export interface ResponseMetadata {
     timestamp: string;
     requestId: string;
     version: string;
   }

   // Specific API response types
   export interface UserProfile {
     id: string;
     email: string;
     username: string;
     avatar?: string;
     createdAt: string;
     updatedAt: string;
   }

   export interface GameScore {
     id: string;
     userId: string;
     score: number;
     time: number;
     completedAt: string;
     difficulty: 'easy' | 'medium' | 'hard';
   }

   export interface LeaderboardEntry {
     rank: number;
     user: UserProfile;
     score: GameScore;
   }

   export type LeaderboardResponse = ApiResponse<LeaderboardEntry[]>;
   export type ScoreResponse = ApiResponse<GameScore>;
   export type ProfileResponse = ApiResponse<UserProfile>;
   ```
2. Add Zod for runtime validation:
   ```typescript
   import { z } from 'zod';

   export const UserProfileSchema = z.object({
     id: z.string().uuid(),
     email: z.string().email(),
     username: z.string().min(3).max(20),
     avatar: z.string().url().optional(),
     createdAt: z.string().datetime(),
     updatedAt: z.string().datetime()
   });

   export type UserProfile = z.infer<typeof UserProfileSchema>;
   ```
3. Create API client with typed methods:
   ```typescript
   export class ApiClient {
     async getProfile(userId: string): Promise<ProfileResponse> {
       const response = await fetch(`/api/users/${userId}`);
       const data = await response.json();

       // Runtime validation
       const validated = UserProfileSchema.parse(data);

       return { data: validated, error: null };
     }

     async submitScore(score: GameScore): Promise<ScoreResponse> {
       // Typed request and response
     }
   }
   ```
4. Replace all 12 API `any` usages

**Output State:**
- File: `src/types/api.ts` with 20+ types
- Zod schemas for validation
- Typed API client
- Zero API `any` types

**Validation Command:**
```bash
npm run typecheck
npm test -- src/api/ --run
```

**Dependencies:**
- M8.2 (event types)

**Rollback Procedure:**
```bash
git checkout src/types/api.ts src/api/
npm install # Remove zod if added
```

**Success Criteria:**
- [ ] 20+ API types defined
- [ ] Zod schemas created
- [ ] Runtime validation working
- [ ] Zero `any` in API code

---

## Task M8.4: Type Third-Party Library Wrappers

**Estimated Effort:** 3h
**Risk Level:** High
**Assignable To:** coder

**Input State:**
- 25 library integrations use `any`
- Supabase responses untyped
- DnD-kit types incomplete

**Action Steps:**
1. Create Supabase type definitions:
   ```typescript
   // src/types/supabase.ts
   import { SupabaseClient, Session, User } from '@supabase/supabase-js';

   export interface Database {
     public: {
       Tables: {
         profiles: {
           Row: {
             id: string;
             username: string;
             avatar_url: string | null;
             created_at: string;
           };
           Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at'>;
           Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
         };
         scores: {
           Row: {
             id: string;
             user_id: string;
             score: number;
             time: number;
             created_at: string;
           };
           Insert: Omit<Database['public']['Tables']['scores']['Row'], 'id' | 'created_at'>;
           Update: Partial<Database['public']['Tables']['scores']['Insert']>;
         };
       };
     };
   }

   export type TypedSupabaseClient = SupabaseClient<Database>;

   // Helper types for queries
   export type Profile = Database['public']['Tables']['profiles']['Row'];
   export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
   export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
   ```
2. Create typed Supabase client:
   ```typescript
   import { createClient } from '@supabase/supabase-js';
   import { Database } from './types/supabase';

   export const supabase = createClient<Database>(
     process.env.VITE_SUPABASE_URL!,
     process.env.VITE_SUPABASE_ANON_KEY!
   );

   // Now all queries are typed:
   const { data, error } = await supabase
     .from('profiles')  // ✓ Type-checked table name
     .select('*')        // ✓ Type-checked columns
     .single();          // ✓ Type-checked response
   ```
3. Type DnD-kit wrappers:
   ```typescript
   import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

   export interface DepartmentDragData {
     type: 'department';
     departmentId: string;
     fromPosition: 'list' | 'grid';
   }

   export interface PuzzleDropData {
     type: 'puzzle-slot';
     slotId: string;
     acceptedDepartmentId: string;
   }

   export type GameDragEndEvent = DragEndEvent & {
     active: { data: { current: DepartmentDragData } };
     over: { data: { current: PuzzleDropData } } | null;
   };
   ```
4. Replace all 25 library `any` usages

**Output State:**
- Typed Supabase client
- DnD-kit wrappers typed
- All library integrations typed
- Zero library `any` types

**Validation Command:**
```bash
npm run typecheck
npm test -- src/lib/ --run
```

**Dependencies:**
- M8.3 (API types)

**Rollback Procedure:**
```bash
git checkout src/types/supabase.ts src/lib/
```

**Success Criteria:**
- [ ] Supabase fully typed
- [ ] DnD-kit fully typed
- [ ] All 25 instances fixed
- [ ] Type inference complete

---

## Task M8.5: Enable TypeScript Strict Mode

**Estimated Effort:** 2h
**Risk Level:** High
**Assignable To:** coder

**Input State:**
- `strict: false` in tsconfig.json
- Implicit `any` allowed
- Null checks disabled

**Action Steps:**
1. Update `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true,
       "strictFunctionTypes": true,
       "strictBindCallApply": true,
       "strictPropertyInitialization": true,
       "noImplicitThis": true,
       "alwaysStrict": true,
       "noUncheckedIndexedAccess": true,
       "noImplicitReturns": true,
       "noFallthroughCasesInSwitch": true
     }
   }
   ```
2. Fix new errors revealed by strict mode:
   ```bash
   npm run typecheck 2>&1 | tee strict-mode-errors.txt
   ```
3. Address each category:
   - Null/undefined checks
   - Implicit any parameters
   - Missing return types
   - Index access safety
4. Verify all tests pass

**Output State:**
- Strict mode enabled
- All errors resolved
- Type safety complete

**Validation Command:**
```bash
npm run typecheck
npm test -- --run
```

**Dependencies:**
- M8.4 (all `any` types replaced)

**Rollback Procedure:**
```bash
git checkout tsconfig.json
npm run typecheck
```

**Success Criteria:**
- [ ] Strict mode enabled
- [ ] Zero TypeScript errors
- [ ] All tests pass
- [ ] No `any` types remain

---

## Tasks M8.6 - M8.45 (Condensed)

**M8.6: Add Return Types to Functions (2h)** - Explicit returns
**M8.7: Fix Implicit Any Parameters (1.5h)** - Function signatures
**M8.8: Add Null Checks (2h)** - Optional chaining, nullish coalescing
**M8.9: Type Component Props (1.5h)** - Interface definitions
**M8.10: Type Hook Returns (1h)** - Return type annotations
**M8.11: Type Context Values (1h)** - Context type safety
**M8.12: Type Redux Actions (1.5h)** - Action creators (if applicable)
**M8.13: Type Redux Reducers (1h)** - State types (if applicable)
**M8.14: Type Utility Functions (1h)** - Generic constraints
**M8.15: Add JSDoc Types (1.5h)** - Documentation
**M8.16: Create Domain Types (1.5h)** - Game, User, Score types
**M8.17: Type SVG Data Structures (1h)** - Map coordinates
**M8.18: Type Animation Configs (0.5h)** - Framer Motion
**M8.19: Type Route Params (0.5h)** - React Router
**M8.20: Type Query Params (0.5h)** - URL search params
**M8.21: Type LocalStorage Data (1h)** - Serialization
**M8.22: Type Environment Variables (0.5h)** - Import.meta.env
**M8.23: Add Generic Constraints (1.5h)** - Type parameters
**M8.24: Create Union Types (1h)** - Discriminated unions
**M8.25: Add Type Guards (1.5h)** - Runtime type checking
**M8.26: Create Type Predicates (1h)** - is functions
**M8.27: Add Assertion Functions (0.5h)** - asserts keyword
**M8.28: Type Error Objects (1h)** - Custom error types
**M8.29: Type Promise Chains (1h)** - Async type safety
**M8.30: Type Callback Functions (1h)** - Higher-order functions
**M8.31-M8.40: Component-Specific Typing** - 10 components (10h)
**M8.41: Create Type Utility Library (1.5h)** - Shared type helpers
**M8.42: Add Type Tests (2h)** - ts-expect-error tests
**M8.43: Documentation Update (1.5h)** - Type usage guide
**M8.44: TypeScript Config Optimization (1h)** - Compiler options
**M8.45: M8 Milestone Integration Test (0.5h)** - Type safety validation

---

## M8 Summary

**Total Tasks:** 45
**Total Effort:** 17 hours
**Critical Path:** M8.1 → M8.2 → M8.3 → M8.4 → M8.5 → M8.45 (11.5h)

**Parallelizable Groups:**
- Group 1: M8.1 (sequential, 1.5h)
- Group 2 (after M8.1): M8.2, M8.3, M8.4 (parallel, 3h)
- Group 3 (after Group 2): M8.5 (sequential, 2h)
- Group 4 (after M8.5): M8.6-M8.15 (parallel, 14h)
- Group 5 (after Group 4): M8.16-M8.30 (parallel, 14.5h)
- Group 6 (after Group 5): M8.31-M8.40 (parallel, 10h)
- Group 7: M8.41-M8.44 (parallel, 6h)
- Group 8: M8.45 (final, 0.5h)

**Success Metrics:**
- `any` types: 83 → 0
- Strict mode: Disabled → Enabled
- Type coverage: ~75% → 100%
- TypeScript errors: 0
- Runtime type validation: Implemented
