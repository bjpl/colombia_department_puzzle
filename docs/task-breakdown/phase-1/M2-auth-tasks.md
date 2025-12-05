# M2: Authentication Tests - Granular Task Breakdown

**Milestone:** Create comprehensive auth test suite
**Total Effort:** 10 hours
**Total Tasks:** 25 tasks
**Risk Level:** Medium
**Dependencies:** M1 (TypeScript stability required)

---

## Task M2.1: Create Auth Test Utilities Structure

**Estimated Effort:** 2h
**Risk Level:** Low
**Assignable To:** coder

**Input State:**
- No auth test utilities exist
- Supabase mocks scattered across tests
- No centralized auth testing patterns

**Action Steps:**
1. Create directory structure:
   ```bash
   mkdir -p src/tests/utils/auth
   touch src/tests/utils/auth/{index.ts,supabase-mock.ts,auth-context-wrapper.tsx,test-users.ts}
   ```
2. Create `test-users.ts` with fixture data:
   ```typescript
   export const TEST_USERS = {
     validUser: {
       email: 'test@example.com',
       password: 'Test123!@#',
       id: 'test-user-id-1',
       metadata: { username: 'testuser' }
     },
     adminUser: {
       email: 'admin@example.com',
       password: 'Admin123!@#',
       id: 'admin-user-id',
       metadata: { username: 'admin', role: 'admin' }
     },
     unverifiedUser: {
       email: 'unverified@example.com',
       password: 'Unverified123!@#',
       id: 'unverified-user-id',
       metadata: { username: 'unverified', emailVerified: false }
     }
   };
   ```
3. Create index.ts barrel export
4. Add TypeScript types

**Output State:**
- Directory: `src/tests/utils/auth/` with 4 files
- Test user fixtures available
- Type-safe exports

**Validation Command:**
```bash
npm run typecheck
npm test -- src/tests/utils/auth/test-users.ts --run
```

**Dependencies:**
- M1.12 (TypeScript stable)

**Rollback Procedure:**
```bash
rm -rf src/tests/utils/auth/
git status
```

**Success Criteria:**
- [ ] Directory structure created
- [ ] Test user fixtures defined
- [ ] TypeScript types correct
- [ ] No compilation errors

---

## Task M2.2: Implement Supabase Client Mock

**Estimated Effort:** 2h
**Risk Level:** Medium
**Assignable To:** coder

**Input State:**
- No Supabase client mock exists
- Each test creates own mock implementation
- Inconsistent auth behavior across tests

**Action Steps:**
1. Create `supabase-mock.ts`:
   ```typescript
   import { SupabaseClient } from '@supabase/supabase-js';
   import { vi } from 'vitest';

   export interface MockSupabaseOptions {
     user?: any;
     session?: any;
     signInError?: Error;
     signUpError?: Error;
     signOutError?: Error;
   }

   export function createMockSupabaseClient(
     options: MockSupabaseOptions = {}
   ): SupabaseClient {
     const mockClient = {
       auth: {
         getSession: vi.fn().mockResolvedValue({
           data: { session: options.session || null },
           error: null
         }),
         getUser: vi.fn().mockResolvedValue({
           data: { user: options.user || null },
           error: null
         }),
         signInWithPassword: vi.fn().mockResolvedValue({
           data: { session: options.session, user: options.user },
           error: options.signInError || null
         }),
         signUp: vi.fn().mockResolvedValue({
           data: { session: options.session, user: options.user },
           error: options.signUpError || null
         }),
         signOut: vi.fn().mockResolvedValue({
           error: options.signOutError || null
         }),
         onAuthStateChange: vi.fn((callback) => {
           // Simulate initial state
           callback('INITIAL_SESSION', options.session || null);
           return {
             data: { subscription: { unsubscribe: vi.fn() } },
           };
         })
       }
     };

     return mockClient as unknown as SupabaseClient;
   }
   ```
2. Add JSDoc documentation
3. Export from index.ts

**Output State:**
- File: `src/tests/utils/auth/supabase-mock.ts`
- Reusable Supabase client mock
- All auth methods mocked

**Validation Command:**
```bash
npm run typecheck
npm test -- src/tests/utils/auth/supabase-mock.test.ts --run
```

**Dependencies:**
- M2.1 (structure created)

**Rollback Procedure:**
```bash
git checkout src/tests/utils/auth/supabase-mock.ts
```

**Success Criteria:**
- [ ] Mock client implements key auth methods
- [ ] Options allow error simulation
- [ ] TypeScript types correct
- [ ] Documentation complete

---

## Task M2.3: Add Session Management Mock

**Estimated Effort:** 1h
**Risk Level:** Low
**Assignable To:** coder

**Input State:**
- Supabase client mock created
- No session lifecycle management
- Tests can't simulate session expiry

**Action Steps:**
1. Add to `supabase-mock.ts`:
   ```typescript
   export class MockSessionManager {
     private currentSession: any = null;
     private listeners: ((session: any) => void)[] = [];

     setSession(session: any) {
       this.currentSession = session;
       this.notifyListeners();
     }

     clearSession() {
       this.currentSession = null;
       this.notifyListeners();
     }

     getSession() {
       return this.currentSession;
     }

     onSessionChange(callback: (session: any) => void) {
       this.listeners.push(callback);
       return () => {
         this.listeners = this.listeners.filter(l => l !== callback);
       };
     }

     private notifyListeners() {
       this.listeners.forEach(l => l(this.currentSession));
     }
   }
   ```
2. Integrate with createMockSupabaseClient
3. Add tests for session manager

**Output State:**
- MockSessionManager class added
- Session lifecycle testable
- Integration with mock client

**Validation Command:**
```bash
npm test -- src/tests/utils/auth/ --run --grep "session"
```

**Dependencies:**
- M2.2 (client mock exists)

**Rollback Procedure:**
```bash
git diff src/tests/utils/auth/supabase-mock.ts > /tmp/m2.3.patch
git checkout src/tests/utils/auth/supabase-mock.ts
```

**Success Criteria:**
- [ ] Session manager handles lifecycle
- [ ] Listeners notified on changes
- [ ] Integration tests pass

---

## Task M2.4: Create AuthContext Test Wrapper

**Estimated Effort:** 1.5h
**Risk Level:** Medium
**Assignable To:** coder

**Input State:**
- No test wrapper for AuthContext
- Tests must manually setup providers
- Inconsistent context setup

**Action Steps:**
1. Create `auth-context-wrapper.tsx`:
   ```typescript
   import React from 'react';
   import { render, RenderOptions } from '@testing-library/react';
   import { AuthContext } from '../../../contexts/AuthContext';
   import { createMockSupabaseClient } from './supabase-mock';

   interface AuthWrapperOptions {
     user?: any;
     session?: any;
     loading?: boolean;
   }

   export function createAuthWrapper(options: AuthWrapperOptions = {}) {
     const mockClient = createMockSupabaseClient({
       user: options.user,
       session: options.session
     });

     return function AuthWrapper({ children }: { children: React.ReactNode }) {
       return (
         <AuthContext.Provider
           value={{
             user: options.user || null,
             session: options.session || null,
             loading: options.loading || false,
             signIn: vi.fn(),
             signUp: vi.fn(),
             signOut: vi.fn()
           }}
         >
           {children}
         </AuthContext.Provider>
       );
     };
   }

   export function renderWithAuth(
     ui: React.ReactElement,
     options: AuthWrapperOptions & RenderOptions = {}
   ) {
     const { user, session, loading, ...renderOptions } = options;
     const Wrapper = createAuthWrapper({ user, session, loading });
     return render(ui, { wrapper: Wrapper, ...renderOptions });
   }
   ```
2. Add TypeScript types
3. Export from index.ts

**Output State:**
- File: `src/tests/utils/auth/auth-context-wrapper.tsx`
- Helper: `renderWithAuth()` function
- Simplified auth testing

**Validation Command:**
```bash
npm run typecheck
npm test -- src/tests/utils/auth/auth-context-wrapper.test.tsx --run
```

**Dependencies:**
- M2.2 (requires Supabase mock)

**Rollback Procedure:**
```bash
rm src/tests/utils/auth/auth-context-wrapper.tsx
```

**Success Criteria:**
- [ ] Wrapper simplifies auth testing
- [ ] All auth states supported
- [ ] TypeScript types correct
- [ ] Integration test passes

---

## Task M2.5: Write AuthService Login Tests

**Estimated Effort:** 1h
**Risk Level:** Low
**Assignable To:** tester

**Input State:**
- AuthService exists but no tests
- Login functionality untested
- No error case coverage

**Action Steps:**
1. Create `src/tests/services/auth.test.ts`
2. Add login success test:
   ```typescript
   describe('AuthService', () => {
     describe('login', () => {
       it('should successfully login with valid credentials', async () => {
         const mockClient = createMockSupabaseClient({
           user: TEST_USERS.validUser,
           session: { access_token: 'mock-token' }
         });

         const result = await AuthService.login(
           mockClient,
           TEST_USERS.validUser.email,
           TEST_USERS.validUser.password
         );

         expect(result.user).toBeDefined();
         expect(result.session).toBeDefined();
         expect(mockClient.auth.signInWithPassword).toHaveBeenCalled();
       });

       it('should handle invalid credentials', async () => {
         const mockClient = createMockSupabaseClient({
           signInError: new Error('Invalid credentials')
         });

         await expect(
           AuthService.login(mockClient, 'wrong@example.com', 'wrong')
         ).rejects.toThrow('Invalid credentials');
       });

       it('should handle network errors', async () => {
         const mockClient = createMockSupabaseClient({
           signInError: new Error('Network error')
         });

         await expect(
           AuthService.login(mockClient, 'test@example.com', 'Test123!@#')
         ).rejects.toThrow('Network error');
       });
     });
   });
   ```

**Output State:**
- File: `src/tests/services/auth.test.ts` with 3+ login tests
- Success and error cases covered
- Mock utilities used

**Validation Command:**
```bash
npm test -- src/tests/services/auth.test.ts --run --grep "login"
```

**Dependencies:**
- M2.4 (test utilities ready)

**Rollback Procedure:**
```bash
rm src/tests/services/auth.test.ts
```

**Success Criteria:**
- [ ] 3+ login tests pass
- [ ] Success case covered
- [ ] Error cases covered
- [ ] Mocks used correctly

---

## Task M2.6: Write AuthService Signup Tests

**Estimated Effort:** 1h
**Risk Level:** Low
**Assignable To:** tester

**Input State:**
- Login tests complete
- Signup functionality untested
- No duplicate email handling tests

**Action Steps:**
1. Add to `src/tests/services/auth.test.ts`:
   ```typescript
   describe('signup', () => {
     it('should successfully create new user', async () => {
       const newUser = {
         email: 'new@example.com',
         password: 'New123!@#',
         metadata: { username: 'newuser' }
       };

       const mockClient = createMockSupabaseClient({
         user: newUser,
         session: { access_token: 'mock-token' }
       });

       const result = await AuthService.signup(
         mockClient,
         newUser.email,
         newUser.password
       );

       expect(result.user).toBeDefined();
       expect(mockClient.auth.signUp).toHaveBeenCalled();
     });

     it('should handle duplicate email', async () => {
       const mockClient = createMockSupabaseClient({
         signUpError: new Error('Email already exists')
       });

       await expect(
         AuthService.signup(mockClient, 'existing@example.com', 'Test123!@#')
       ).rejects.toThrow('Email already exists');
     });

     it('should handle weak password', async () => {
       const mockClient = createMockSupabaseClient({
         signUpError: new Error('Password too weak')
       });

       await expect(
         AuthService.signup(mockClient, 'test@example.com', 'weak')
       ).rejects.toThrow('Password too weak');
     });
   });
   ```

**Output State:**
- 3+ signup tests added
- Error cases covered
- Integration with mocks

**Validation Command:**
```bash
npm test -- src/tests/services/auth.test.ts --run --grep "signup"
```

**Dependencies:**
- M2.5 (test structure exists)

**Rollback Procedure:**
```bash
git diff src/tests/services/auth.test.ts > /tmp/m2.6.patch
git checkout src/tests/services/auth.test.ts
```

**Success Criteria:**
- [ ] 3+ signup tests pass
- [ ] Success case covered
- [ ] Error cases covered
- [ ] Duplicate email handled

---

## Task M2.7: Write AuthService Logout Tests

**Estimated Effort:** 0.5h
**Risk Level:** Low
**Assignable To:** tester

**Input State:**
- Login and signup tests complete
- Logout functionality untested

**Action Steps:**
1. Add to `src/tests/services/auth.test.ts`:
   ```typescript
   describe('logout', () => {
     it('should successfully logout user', async () => {
       const mockClient = createMockSupabaseClient({
         user: TEST_USERS.validUser
       });

       await AuthService.logout(mockClient);

       expect(mockClient.auth.signOut).toHaveBeenCalled();
     });

     it('should handle logout errors', async () => {
       const mockClient = createMockSupabaseClient({
         signOutError: new Error('Logout failed')
       });

       await expect(
         AuthService.logout(mockClient)
       ).rejects.toThrow('Logout failed');
     });
   });
   ```

**Output State:**
- 2 logout tests added
- Success and error cases

**Validation Command:**
```bash
npm test -- src/tests/services/auth.test.ts --run --grep "logout"
```

**Dependencies:**
- M2.6 (test file exists)

**Rollback Procedure:**
```bash
git diff src/tests/services/auth.test.ts > /tmp/m2.7.patch
git checkout src/tests/services/auth.test.ts
```

**Success Criteria:**
- [ ] 2 logout tests pass
- [ ] Success case covered
- [ ] Error case covered

---

## Task M2.8: Write Session Persistence Tests

**Estimated Effort:** 1h
**Risk Level:** Medium
**Assignable To:** tester

**Input State:**
- Auth service tests complete
- Session persistence untested
- localStorage interaction not mocked

**Action Steps:**
1. Add to `src/tests/services/auth.test.ts`:
   ```typescript
   describe('session persistence', () => {
     beforeEach(() => {
       localStorage.clear();
     });

     it('should persist session to localStorage', async () => {
       const mockClient = createMockSupabaseClient({
         session: { access_token: 'mock-token', refresh_token: 'refresh' }
       });

       await AuthService.login(mockClient, 'test@example.com', 'Test123!@#');

       const stored = localStorage.getItem('supabase.auth.token');
       expect(stored).toBeDefined();
     });

     it('should restore session from localStorage', async () => {
       const sessionData = {
         access_token: 'stored-token',
         refresh_token: 'stored-refresh'
       };
       localStorage.setItem('supabase.auth.token', JSON.stringify(sessionData));

       const mockClient = createMockSupabaseClient();
       const session = await AuthService.getStoredSession(mockClient);

       expect(session).toBeDefined();
       expect(session.access_token).toBe('stored-token');
     });

     it('should clear session from localStorage on logout', async () => {
       localStorage.setItem('supabase.auth.token', JSON.stringify({ token: 'test' }));
       const mockClient = createMockSupabaseClient();

       await AuthService.logout(mockClient);

       expect(localStorage.getItem('supabase.auth.token')).toBeNull();
     });
   });
   ```

**Output State:**
- 3 session persistence tests
- localStorage integration tested
- Cleanup handled

**Validation Command:**
```bash
npm test -- src/tests/services/auth.test.ts --run --grep "session persistence"
```

**Dependencies:**
- M2.7 (auth tests structure)

**Rollback Procedure:**
```bash
git diff src/tests/services/auth.test.ts > /tmp/m2.8.patch
git checkout src/tests/services/auth.test.ts
```

**Success Criteria:**
- [ ] 3 persistence tests pass
- [ ] localStorage mocked correctly
- [ ] Cleanup between tests

---

## Task M2.9: Write AuthContext Hook Tests

**Estimated Effort:** 1.5h
**Risk Level:** Medium
**Assignable To:** tester

**Input State:**
- AuthService tested
- useAuth hook untested
- Context provider behavior unchecked

**Action Steps:**
1. Create `src/tests/hooks/useAuth.test.tsx`
2. Add hook usage tests:
   ```typescript
   import { renderHook, waitFor } from '@testing-library/react';
   import { useAuth } from '../../hooks/useAuth';
   import { createAuthWrapper } from '../utils/auth';

   describe('useAuth', () => {
     it('should provide authenticated user', () => {
       const wrapper = createAuthWrapper({
         user: TEST_USERS.validUser,
         session: { access_token: 'token' }
       });

       const { result } = renderHook(() => useAuth(), { wrapper });

       expect(result.current.user).toEqual(TEST_USERS.validUser);
       expect(result.current.isAuthenticated).toBe(true);
     });

     it('should handle unauthenticated state', () => {
       const wrapper = createAuthWrapper({});

       const { result } = renderHook(() => useAuth(), { wrapper });

       expect(result.current.user).toBeNull();
       expect(result.current.isAuthenticated).toBe(false);
     });

     it('should handle loading state', () => {
       const wrapper = createAuthWrapper({ loading: true });

       const { result } = renderHook(() => useAuth(), { wrapper });

       expect(result.current.loading).toBe(true);
     });

     it('should call signIn method', async () => {
       const mockSignIn = vi.fn().mockResolvedValue({ user: TEST_USERS.validUser });
       const wrapper = createAuthWrapper({});

       const { result } = renderHook(() => useAuth(), { wrapper });
       await result.current.signIn('test@example.com', 'Test123!@#');

       await waitFor(() => {
         expect(mockSignIn).toHaveBeenCalled();
       });
     });
   });
   ```

**Output State:**
- File: `src/tests/hooks/useAuth.test.tsx` with 4+ tests
- Hook behavior tested
- Context integration verified

**Validation Command:**
```bash
npm test -- src/tests/hooks/useAuth.test.tsx --run
```

**Dependencies:**
- M2.4 (auth wrapper exists)

**Rollback Procedure:**
```bash
rm src/tests/hooks/useAuth.test.tsx
```

**Success Criteria:**
- [ ] 4+ hook tests pass
- [ ] All auth states tested
- [ ] Method calls verified

---

## Task M2.10: Write Auth Guard Component Tests

**Estimated Effort:** 1h
**Risk Level:** Medium
**Assignable To:** tester

**Input State:**
- Hook tests complete
- Auth guard components untested
- Route protection not verified

**Action Steps:**
1. Create `src/tests/components/auth/AuthGuard.test.tsx`
2. Add guard behavior tests:
   ```typescript
   import { screen } from '@testing-library/react';
   import { AuthGuard } from '../../../components/auth/AuthGuard';
   import { renderWithAuth } from '../../utils/auth';

   describe('AuthGuard', () => {
     it('should render children when authenticated', () => {
       renderWithAuth(
         <AuthGuard>
           <div>Protected Content</div>
         </AuthGuard>,
         { user: TEST_USERS.validUser }
       );

       expect(screen.getByText('Protected Content')).toBeInTheDocument();
     });

     it('should redirect when not authenticated', () => {
       const mockNavigate = vi.fn();
       vi.mock('react-router-dom', () => ({
         useNavigate: () => mockNavigate
       }));

       renderWithAuth(
         <AuthGuard>
           <div>Protected Content</div>
         </AuthGuard>,
         { user: null }
       );

       expect(mockNavigate).toHaveBeenCalledWith('/login');
     });

     it('should show loading state', () => {
       renderWithAuth(
         <AuthGuard>
           <div>Protected Content</div>
         </AuthGuard>,
         { loading: true }
       );

       expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
     });
   });
   ```

**Output State:**
- File: `src/tests/components/auth/AuthGuard.test.tsx` with 3+ tests
- Guard logic verified
- Navigation mocked

**Validation Command:**
```bash
npm test -- src/tests/components/auth/AuthGuard.test.tsx --run
```

**Dependencies:**
- M2.9 (auth utilities complete)

**Rollback Procedure:**
```bash
rm src/tests/components/auth/AuthGuard.test.tsx
```

**Success Criteria:**
- [ ] 3+ guard tests pass
- [ ] Protected content logic works
- [ ] Redirect behavior correct

---

## Tasks M2.11 - M2.25 Summary

Due to length constraints, I'll provide condensed versions:

**M2.11: Email Validation Tests (1h)** - Test email format validation in signup
**M2.12: Password Strength Tests (1h)** - Test password requirements
**M2.13: Token Refresh Tests (1.5h)** - Test automatic token refresh
**M2.14: Session Expiry Handling (1h)** - Test expired session behavior
**M2.15: Multi-Tab Sync Tests (1.5h)** - Test session sync across tabs
**M2.16: Login Form Integration (1h)** - Test login UI component
**M2.17: Signup Form Integration (1h)** - Test signup UI component
**M2.18: Profile Update Tests (1h)** - Test user profile editing
**M2.19: Password Reset Tests (1.5h)** - Test password reset flow
**M2.20: OAuth Provider Tests (2h)** - Test social login (if applicable)
**M2.21: Auth Error Handling (1h)** - Test error display in UI
**M2.22: Auth Loading States (0.5h)** - Test loading indicators
**M2.23: Auth Accessibility Tests (1h)** - Test ARIA labels, keyboard nav
**M2.24: Auth E2E Tests (2h)** - Full login/logout flow with Playwright
**M2.25: M2 Milestone Integration Test (0.5h)** - Validate all auth tests pass

---

## M2 Summary

**Total Tasks:** 25
**Total Effort:** 10 hours
**Critical Path:** M2.1 → M2.2 → M2.3 → M2.4 → M2.25 (8h)
**Parallelizable Groups:**
- Group 1 (Sequential): M2.1 → M2.2 → M2.3 → M2.4
- Group 2 (Parallel after M2.4): M2.5, M2.6, M2.7, M2.8
- Group 3 (Parallel after Group 2): M2.9, M2.10, M2.11, M2.12
- Group 4 (Parallel): M2.13-M2.24
- Group 5 (Final): M2.25

**Success Metrics:**
- Auth test coverage: 0% → 90%+ ✓
- All auth flows tested ✓
- Error cases covered ✓
- E2E tests passing ✓
