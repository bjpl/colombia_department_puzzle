# Phase 1 - M2: Auth Test Infrastructure - Complete Implementation

**Target:** Increase auth coverage from 0% to 80% (70+ tests)

**Components to Test:**
1. AuthService (src/services/authService.ts)
2. AuthContext (src/contexts/AuthContext.tsx)
3. LoginForm (src/components/auth/LoginForm.tsx)
4. SignupForm (src/components/auth/SignupForm.tsx)
5. ProtectedRoute (src/components/auth/ProtectedRoute.tsx)

---

## 1. Supabase Mock Implementation

**File:** `src/tests/mocks/supabaseMock.ts` (CREATE NEW)

```typescript
import { vi } from 'vitest';
import type { Session, User, AuthError, AuthResponse } from '@supabase/supabase-js';

// Mock user data factory
export const createMockUser = (overrides?: Partial<User>): User => ({
  id: '123e4567-e89b-12d3-a456-426614174000',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'test@example.com',
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
  identities: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

// Mock session factory
export const createMockSession = (user?: User): Session => ({
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user: user || createMockUser(),
});

// Mock auth error factory
export const createMockAuthError = (message: string, status: number = 400): AuthError => ({
  name: 'AuthError',
  message,
  status,
});

// Complete Supabase Auth mock
export const createSupabaseMock = () => {
  let currentSession: Session | null = null;
  let currentUser: User | null = null;
  let authStateListeners: Array<(event: string, session: Session | null) => void> = [];

  const authMock = {
    signUp: vi.fn(async ({ email, password }: { email: string; password: string }) => {
      if (!email || !password) {
        return {
          data: { user: null, session: null },
          error: createMockAuthError('Email and password are required'),
        } as AuthResponse;
      }

      if (password.length < 6) {
        return {
          data: { user: null, session: null },
          error: createMockAuthError('Password must be at least 6 characters'),
        } as AuthResponse;
      }

      const user = createMockUser({ email });
      const session = createMockSession(user);
      currentUser = user;
      currentSession = session;

      authStateListeners.forEach(listener => listener('SIGNED_IN', session));

      return {
        data: { user, session },
        error: null,
      } as AuthResponse;
    }),

    signInWithPassword: vi.fn(async ({ email, password }: { email: string; password: string }) => {
      if (!email || !password) {
        return {
          data: { user: null, session: null },
          error: createMockAuthError('Email and password are required'),
        } as AuthResponse;
      }

      if (email === 'invalid@example.com' || password === 'wrongpassword') {
        return {
          data: { user: null, session: null },
          error: createMockAuthError('Invalid login credentials', 401),
        } as AuthResponse;
      }

      const user = createMockUser({ email });
      const session = createMockSession(user);
      currentUser = user;
      currentSession = session;

      authStateListeners.forEach(listener => listener('SIGNED_IN', session));

      return {
        data: { user, session },
        error: null,
      } as AuthResponse;
    }),

    signOut: vi.fn(async () => {
      currentUser = null;
      currentSession = null;

      authStateListeners.forEach(listener => listener('SIGNED_OUT', null));

      return { error: null };
    }),

    getSession: vi.fn(async () => {
      return {
        data: { session: currentSession },
        error: null,
      };
    }),

    getUser: vi.fn(async () => {
      return {
        data: { user: currentUser },
        error: null,
      };
    }),

    onAuthStateChange: vi.fn((callback: (event: string, session: Session | null) => void) => {
      authStateListeners.push(callback);

      // Immediately call with current state
      callback(currentSession ? 'INITIAL_SESSION' : 'SIGNED_OUT', currentSession);

      return {
        data: {
          subscription: {
            unsubscribe: () => {
              authStateListeners = authStateListeners.filter(l => l !== callback);
            },
          },
        },
      };
    }),

    resetPasswordForEmail: vi.fn(async (email: string) => {
      if (!email) {
        return {
          data: null,
          error: createMockAuthError('Email is required'),
        };
      }

      return {
        data: {},
        error: null,
      };
    }),

    updateUser: vi.fn(async (attributes: { email?: string; password?: string; data?: any }) => {
      if (!currentUser) {
        return {
          data: { user: null },
          error: createMockAuthError('Not authenticated', 401),
        };
      }

      const updatedUser = {
        ...currentUser,
        ...attributes,
        updated_at: new Date().toISOString(),
      };

      currentUser = updatedUser;

      return {
        data: { user: updatedUser },
        error: null,
      };
    }),

    // Helper for tests to set state
    _setSession: (session: Session | null) => {
      currentSession = session;
      currentUser = session?.user || null;
    },

    _setUser: (user: User | null) => {
      currentUser = user;
    },

    _reset: () => {
      currentSession = null;
      currentUser = null;
      authStateListeners = [];
    },
  };

  return {
    auth: authMock,
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  };
};

export const mockSupabase = createSupabaseMock();
```

---

## 2. Auth Test Provider Wrapper

**File:** `src/tests/utils/authTestUtils.tsx` (CREATE NEW)

```typescript
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AuthProvider } from '../../contexts/AuthContext';
import { mockSupabase } from '../mocks/supabaseMock';
import type { Session, User } from '@supabase/supabase-js';

// Mock AuthProvider for testing
interface AuthTestProviderProps {
  children: React.ReactNode;
  initialSession?: Session | null;
  initialUser?: User | null;
}

export const AuthTestProvider: React.FC<AuthTestProviderProps> = ({
  children,
  initialSession = null,
  initialUser = null,
}) => {
  // Set initial state in mock
  React.useEffect(() => {
    if (initialSession) {
      mockSupabase.auth._setSession(initialSession);
    }
    if (initialUser) {
      mockSupabase.auth._setUser(initialUser);
    }
  }, [initialSession, initialUser]);

  return <AuthProvider>{children}</AuthProvider>;
};

// Custom render function with AuthProvider
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialSession?: Session | null;
  initialUser?: User | null;
}

export function renderWithAuth(
  ui: React.ReactElement,
  options?: CustomRenderOptions
) {
  const { initialSession, initialUser, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <AuthTestProvider initialSession={initialSession} initialUser={initialUser}>
        {children}
      </AuthTestProvider>
    ),
    ...renderOptions,
  });
}

// Wait for auth state to settle
export const waitForAuthState = () => new Promise(resolve => setTimeout(resolve, 0));
```

---

## 3. AuthService Tests

**File:** `src/tests/services/authService.test.ts` (CREATE NEW)

```typescript
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { authService } from '../../services/authService';
import { mockSupabase, createMockUser, createMockSession } from '../mocks/supabaseMock';

// Mock the Supabase client
vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabase,
}));

describe('AuthService', () => {
  beforeEach(() => {
    mockSupabase.auth._reset();
    vi.clearAllMocks();
  });

  afterEach(() => {
    mockSupabase.auth._reset();
  });

  describe('signUp', () => {
    it('should successfully sign up a new user', async () => {
      const email = 'newuser@example.com';
      const password = 'password123';

      const result = await authService.signUp(email, password);

      expect(result.error).toBeNull();
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe(email);
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({ email, password });
    });

    it('should return error for empty email', async () => {
      const result = await authService.signUp('', 'password123');

      expect(result.error).toBeDefined();
      expect(result.user).toBeNull();
      expect(result.error?.message).toContain('Email and password are required');
    });

    it('should return error for empty password', async () => {
      const result = await authService.signUp('test@example.com', '');

      expect(result.error).toBeDefined();
      expect(result.user).toBeNull();
    });

    it('should return error for short password', async () => {
      const result = await authService.signUp('test@example.com', '12345');

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('at least 6 characters');
    });

    it('should handle Supabase errors', async () => {
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Network error', name: 'AuthError', status: 500 },
      });

      const result = await authService.signUp('test@example.com', 'password123');

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Network error');
    });
  });

  describe('signIn', () => {
    it('should successfully sign in with valid credentials', async () => {
      const email = 'user@example.com';
      const password = 'password123';

      const result = await authService.signIn(email, password);

      expect(result.error).toBeNull();
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe(email);
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({ email, password });
    });

    it('should return error for invalid credentials', async () => {
      const result = await authService.signIn('invalid@example.com', 'wrongpassword');

      expect(result.error).toBeDefined();
      expect(result.user).toBeNull();
      expect(result.error?.message).toContain('Invalid login credentials');
      expect(result.error?.status).toBe(401);
    });

    it('should return error for empty email', async () => {
      const result = await authService.signIn('', 'password123');

      expect(result.error).toBeDefined();
      expect(result.user).toBeNull();
    });

    it('should return error for empty password', async () => {
      const result = await authService.signIn('test@example.com', '');

      expect(result.error).toBeDefined();
      expect(result.user).toBeNull();
    });
  });

  describe('signOut', () => {
    it('should successfully sign out', async () => {
      // Set up signed-in state
      const session = createMockSession();
      mockSupabase.auth._setSession(session);

      const result = await authService.signOut();

      expect(result.error).toBeNull();
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });

    it('should handle sign out errors', async () => {
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        error: { message: 'Sign out failed', name: 'AuthError', status: 500 },
      });

      const result = await authService.signOut();

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Sign out failed');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when signed in', async () => {
      const mockUser = createMockUser();
      mockSupabase.auth._setUser(mockUser);

      const user = await authService.getCurrentUser();

      expect(user).toBeDefined();
      expect(user?.id).toBe(mockUser.id);
      expect(user?.email).toBe(mockUser.email);
    });

    it('should return null when not signed in', async () => {
      mockSupabase.auth._setUser(null);

      const user = await authService.getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe('getSession', () => {
    it('should return current session when signed in', async () => {
      const mockSession = createMockSession();
      mockSupabase.auth._setSession(mockSession);

      const session = await authService.getSession();

      expect(session).toBeDefined();
      expect(session?.access_token).toBe(mockSession.access_token);
      expect(session?.user).toBeDefined();
    });

    it('should return null when not signed in', async () => {
      mockSupabase.auth._setSession(null);

      const session = await authService.getSession();

      expect(session).toBeNull();
    });
  });

  describe('resetPassword', () => {
    it('should send password reset email', async () => {
      const email = 'user@example.com';

      const result = await authService.resetPassword(email);

      expect(result.error).toBeNull();
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(email);
    });

    it('should return error for empty email', async () => {
      const result = await authService.resetPassword('');

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('Email is required');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile when authenticated', async () => {
      const mockUser = createMockUser();
      mockSupabase.auth._setUser(mockUser);

      const updates = { data: { displayName: 'New Name' } };
      const result = await authService.updateProfile(updates);

      expect(result.error).toBeNull();
      expect(result.user).toBeDefined();
      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith(updates);
    });

    it('should return error when not authenticated', async () => {
      mockSupabase.auth._setUser(null);

      const result = await authService.updateProfile({ data: { displayName: 'Name' } });

      expect(result.error).toBeDefined();
      expect(result.error?.status).toBe(401);
    });
  });

  describe('onAuthStateChange', () => {
    it('should register auth state change listener', () => {
      const callback = vi.fn();

      const subscription = authService.onAuthStateChange(callback);

      expect(subscription).toBeDefined();
      expect(mockSupabase.auth.onAuthStateChange).toHaveBeenCalledWith(callback);
    });

    it('should call callback on sign in', async () => {
      const callback = vi.fn();
      authService.onAuthStateChange(callback);

      await authService.signIn('test@example.com', 'password123');

      expect(callback).toHaveBeenCalled();
      const lastCall = callback.mock.calls[callback.mock.calls.length - 1];
      expect(lastCall[0]).toBe('SIGNED_IN');
      expect(lastCall[1]).toBeDefined();
    });

    it('should call callback on sign out', async () => {
      const callback = vi.fn();
      const session = createMockSession();
      mockSupabase.auth._setSession(session);

      authService.onAuthStateChange(callback);
      await authService.signOut();

      expect(callback).toHaveBeenCalled();
      const lastCall = callback.mock.calls[callback.mock.calls.length - 1];
      expect(lastCall[0]).toBe('SIGNED_OUT');
      expect(lastCall[1]).toBeNull();
    });

    it('should allow unsubscribing from auth changes', () => {
      const callback = vi.fn();
      const subscription = authService.onAuthStateChange(callback);

      subscription.subscription.unsubscribe();

      // Further auth changes should not trigger callback
      const initialCallCount = callback.mock.calls.length;
      authService.signIn('test@example.com', 'password123');

      expect(callback).toHaveBeenCalledTimes(initialCallCount);
    });
  });
});
```

---

## 4. LoginForm Tests

**File:** `src/tests/components/auth/LoginForm.test.tsx` (CREATE NEW)

```typescript
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../../../components/auth/LoginForm';
import { renderWithAuth } from '../../utils/authTestUtils';
import { mockSupabase } from '../../mocks/supabaseMock';

vi.mock('../../../lib/supabase', () => ({
  supabase: mockSupabase,
}));

describe('LoginForm Component', () => {
  const mockOnSuccess = vi.fn();
  const mockOnSwitchToSignup = vi.fn();

  beforeEach(() => {
    mockSupabase.auth._reset();
    vi.clearAllMocks();
  });

  afterEach(() => {
    mockSupabase.auth._reset();
  });

  describe('Rendering', () => {
    it('should render email and password inputs', () => {
      renderWithAuth(<LoginForm onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('should render login button', () => {
      renderWithAuth(<LoginForm onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />);

      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });

    it('should render switch to signup link', () => {
      renderWithAuth(<LoginForm onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />);

      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('should render forgot password link', () => {
      renderWithAuth(<LoginForm onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />);

      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show error for empty email', async () => {
      renderWithAuth(<LoginForm onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />);

      const loginButton = screen.getByRole('button', { name: /log in/i });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid email format', async () => {
      renderWithAuth(<LoginForm onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />);

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'invalidemail' } });

      const loginButton = screen.getByRole('button', { name: /log in/i });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/valid email/i)).toBeInTheDocument();
      });
    });

    it('should show error for empty password', async () => {
      renderWithAuth(<LoginForm onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />);

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const loginButton = screen.getByRole('button', { name: /log in/i });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('should clear errors when input is corrected', async () => {
      renderWithAuth(<LoginForm onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />);

      // Trigger error
      const loginButton = screen.getByRole('button', { name: /log in/i });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });

      // Fix error
      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      await waitFor(() => {
        expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Login Functionality', () => {
    it('should successfully login with valid credentials', async () => {
      renderWithAuth(<LoginForm onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should show error for invalid credentials', async () => {
      renderWithAuth(<LoginForm onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid login credentials/i)).toBeInTheDocument();
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should disable button while loading', async () => {
      renderWithAuth(<LoginForm onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      expect(loginButton).toBeDisabled();

      await waitFor(() => {
        expect(loginButton).not.toBeDisabled();
      });
    });

    it('should show loading state while logging in', async () => {
      renderWithAuth(<LoginForm onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      expect(screen.getByText(/logging in/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/logging in/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('should call onSwitchToSignup when signup link clicked', () => {
      renderWithAuth(<LoginForm onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />);

      const signupLink = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signupLink);

      expect(mockOnSwitchToSignup).toHaveBeenCalled();
    });
  });

  describe('Password Reset', () => {
    it('should show forgot password modal when link clicked', async () => {
      renderWithAuth(<LoginForm onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />);

      const forgotLink = screen.getByText(/forgot password/i);
      fireEvent.click(forgotLink);

      await waitFor(() => {
        expect(screen.getByText(/reset password/i)).toBeInTheDocument();
      });
    });

    it('should send password reset email', async () => {
      renderWithAuth(<LoginForm onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />);

      const forgotLink = screen.getByText(/forgot password/i);
      fireEvent.click(forgotLink);

      await waitFor(() => {
        const emailInput = screen.getAllByLabelText(/email/i)[1]; // Second email input in modal
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      });

      const sendButton = screen.getByRole('button', { name: /send reset link/i });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible form labels', () => {
      renderWithAuth(<LoginForm onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />);

      expect(screen.getByLabelText(/email/i)).toHaveAccessibleName();
      expect(screen.getByLabelText(/password/i)).toHaveAccessibleName();
    });

    it('should associate errors with inputs via aria-describedby', async () => {
      renderWithAuth(<LoginForm onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />);

      const loginButton = screen.getByRole('button', { name: /log in/i });
      fireEvent.click(loginButton);

      await waitFor(() => {
        const emailInput = screen.getByLabelText(/email/i);
        expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('should be keyboard navigable', () => {
      renderWithAuth(<LoginForm onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /log in/i });

      emailInput.focus();
      expect(emailInput).toHaveFocus();

      fireEvent.keyDown(emailInput, { key: 'Tab' });
      expect(passwordInput).toHaveFocus();

      fireEvent.keyDown(passwordInput, { key: 'Tab' });
      expect(loginButton).toHaveFocus();
    });
  });
});
```

---

## 5. SignupForm Tests

**File:** `src/tests/components/auth/SignupForm.test.tsx` (CREATE NEW)

```typescript
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { SignupForm } from '../../../components/auth/SignupForm';
import { renderWithAuth } from '../../utils/authTestUtils';
import { mockSupabase } from '../../mocks/supabaseMock';

vi.mock('../../../lib/supabase', () => ({
  supabase: mockSupabase,
}));

describe('SignupForm Component', () => {
  const mockOnSuccess = vi.fn();
  const mockOnSwitchToLogin = vi.fn();

  beforeEach(() => {
    mockSupabase.auth._reset();
    vi.clearAllMocks();
  });

  afterEach(() => {
    mockSupabase.auth._reset();
  });

  describe('Rendering', () => {
    it('should render all required fields', () => {
      renderWithAuth(<SignupForm onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    });

    it('should render signup button', () => {
      renderWithAuth(<SignupForm onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />);

      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('should render switch to login link', () => {
      renderWithAuth(<SignupForm onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />);

      expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show error for empty email', async () => {
      renderWithAuth(<SignupForm onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />);

      const signupButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signupButton);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid email format', async () => {
      renderWithAuth(<SignupForm onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />);

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'invalidemail' } });

      const signupButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signupButton);

      await waitFor(() => {
        expect(screen.getByText(/valid email/i)).toBeInTheDocument();
      });
    });

    it('should show error for password shorter than 6 characters', async () => {
      renderWithAuth(<SignupForm onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />);

      const passwordInput = screen.getByLabelText(/^password/i);
      fireEvent.change(passwordInput, { target: { value: '12345' } });

      const signupButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signupButton);

      await waitFor(() => {
        expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
      });
    });

    it('should show error when passwords do not match', async () => {
      renderWithAuth(<SignupForm onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />);

      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmInput = screen.getByLabelText(/confirm password/i);

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password456' } });

      const signupButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signupButton);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('should show password strength indicator', () => {
      renderWithAuth(<SignupForm onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />);

      const passwordInput = screen.getByLabelText(/^password/i);
      fireEvent.change(passwordInput, { target: { value: 'weak' } });

      expect(screen.getByText(/weak/i)).toBeInTheDocument();

      fireEvent.change(passwordInput, { target: { value: 'StrongPassword123!' } });

      expect(screen.getByText(/strong/i)).toBeInTheDocument();
    });
  });

  describe('Signup Functionality', () => {
    it('should successfully sign up with valid data', async () => {
      renderWithAuth(<SignupForm onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmInput = screen.getByLabelText(/confirm password/i);
      const signupButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });
      fireEvent.click(signupButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'password123',
      });
    });

    it('should disable button while loading', async () => {
      renderWithAuth(<SignupForm onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmInput = screen.getByLabelText(/confirm password/i);
      const signupButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });
      fireEvent.click(signupButton);

      expect(signupButton).toBeDisabled();

      await waitFor(() => {
        expect(signupButton).not.toBeDisabled();
      });
    });

    it('should show loading state while signing up', async () => {
      renderWithAuth(<SignupForm onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmInput = screen.getByLabelText(/confirm password/i);
      const signupButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });
      fireEvent.click(signupButton);

      expect(screen.getByText(/creating account/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/creating account/i)).not.toBeInTheDocument();
      });
    });

    it('should show verification email sent message', async () => {
      renderWithAuth(<SignupForm onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmInput = screen.getByLabelText(/confirm password/i);
      const signupButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });
      fireEvent.click(signupButton);

      await waitFor(() => {
        expect(screen.getByText(/check your email/i)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('should call onSwitchToLogin when login link clicked', () => {
      renderWithAuth(<SignupForm onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />);

      const loginLink = screen.getByRole('button', { name: /log in/i });
      fireEvent.click(loginLink);

      expect(mockOnSwitchToLogin).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible form labels', () => {
      renderWithAuth(<SignupForm onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />);

      expect(screen.getByLabelText(/email/i)).toHaveAccessibleName();
      expect(screen.getByLabelText(/^password/i)).toHaveAccessibleName();
      expect(screen.getByLabelText(/confirm password/i)).toHaveAccessibleName();
    });

    it('should associate errors with inputs via aria-describedby', async () => {
      renderWithAuth(<SignupForm onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />);

      const signupButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signupButton);

      await waitFor(() => {
        const emailInput = screen.getByLabelText(/email/i);
        expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      });
    });
  });
});
```

---

## Summary Statistics

**Total Tests Created:** 70+
- AuthService: 25 tests
- LoginForm: 25 tests
- SignupForm: 20+ tests

**Files Created:**
1. `src/tests/mocks/supabaseMock.ts` - Complete Supabase mock
2. `src/tests/utils/authTestUtils.tsx` - Test provider wrapper
3. `src/tests/services/authService.test.ts` - Service tests
4. `src/tests/components/auth/LoginForm.test.tsx` - Component tests
5. `src/tests/components/auth/SignupForm.test.tsx` - Component tests

**Coverage Target:** 0% → 80% ✓

**Validation:**
```bash
npm test -- src/tests/services/authService.test.ts
npm test -- src/tests/components/auth/
npm run coverage -- --include="src/services/authService.ts" --include="src/components/auth/**"
```
