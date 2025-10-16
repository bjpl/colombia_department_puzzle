/**
 * Authentication Test Utilities
 *
 * Provides mock implementations and utilities for testing auth-related components:
 * - Mock Supabase client
 * - Mock AuthContext
 * - Mock user and session factories
 * - AuthProvider wrapper for tests
 *
 * PATTERN: Follows testProviders.tsx patterns for consistent test utilities
 */

import React, { ReactNode } from 'react';
import { vi } from 'vitest';
import type { User, Session } from '@supabase/supabase-js';
import type { AuthContextType, AuthState } from '../../types/auth';

/**
 * Create mock User object
 */
export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: 'mock-user-id',
    email: 'test@example.com',
    aud: 'authenticated',
    role: 'authenticated',
    created_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {
      display_name: 'Test User',
      ...overrides?.user_metadata,
    },
    ...overrides,
  } as User;
}

/**
 * Create mock Session object
 */
export function createMockSession(overrides?: Partial<Session>): Session {
  return {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: Date.now() / 1000 + 3600,
    token_type: 'bearer',
    user: createMockUser(overrides?.user),
    ...overrides,
  } as Session;
}

/**
 * Create mock Supabase client
 */
export function createMockSupabaseClient() {
  const mockAuthStateChangeCallbacks: Array<(event: string, session: Session | null) => void> = [];

  const mockClient = {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signInWithOtp: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      getUser: vi.fn(),
      refreshSession: vi.fn(),
      updateUser: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      onAuthStateChange: vi.fn((callback) => {
        mockAuthStateChangeCallbacks.push(callback);
        return {
          data: {
            subscription: {
              unsubscribe: vi.fn(),
            },
          },
        };
      }),
    },
    // Helper to trigger auth state changes in tests
    _triggerAuthStateChange: (event: string, session: Session | null) => {
      mockAuthStateChangeCallbacks.forEach(callback => callback(event, session));
    },
    _clearAuthStateChangeCallbacks: () => {
      mockAuthStateChangeCallbacks.length = 0;
    },
  };

  return mockClient;
}

/**
 * Setup mock Supabase client globally
 */
export function setupMockSupabaseClient() {
  const mockClient = createMockSupabaseClient();
  (window as any).supabaseClient = mockClient;
  return mockClient;
}

/**
 * Cleanup mock Supabase client
 */
export function cleanupMockSupabaseClient() {
  delete (window as any).supabaseClient;
}

/**
 * Create mock AuthContext value
 */
export function createMockAuthContext(overrides?: Partial<AuthContextType>): AuthContextType {
  return {
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    signInWithMagicLink: vi.fn(),
    signInWithOAuth: vi.fn(),
    refreshSession: vi.fn(),
    updateEmail: vi.fn(),
    updatePassword: vi.fn(),
    requestPasswordReset: vi.fn(),
    ...overrides,
  };
}

/**
 * Create authenticated mock AuthContext
 */
export function createAuthenticatedMockContext(): AuthContextType {
  const user = createMockUser();
  const session = createMockSession({ user });

  return createMockAuthContext({
    user,
    session,
    isAuthenticated: true,
    isLoading: false,
  });
}

/**
 * Create loading mock AuthContext
 */
export function createLoadingMockContext(): AuthContextType {
  return createMockAuthContext({
    isLoading: true,
  });
}

/**
 * Mock AuthContext for component testing
 */
const AuthContext = React.createContext<AuthContextType | null>(null);

/**
 * Mock AuthProvider for testing
 */
export function MockAuthProvider({
  children,
  value,
}: {
  children: ReactNode;
  value?: AuthContextType;
}) {
  const defaultValue = createMockAuthContext();
  const contextValue = value || defaultValue;

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use mock AuthContext in tests
 */
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within MockAuthProvider');
  }
  return context;
}

/**
 * Wait for auth state to settle (useful for async operations)
 */
export async function waitForAuthState(ms: number = 100): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock successful signup response
 */
export const mockSignUpSuccess = {
  data: {
    user: createMockUser(),
    session: null, // Email verification required
  },
  error: null,
};

/**
 * Mock successful signin response
 */
export const mockSignInSuccess = {
  data: {
    user: createMockUser(),
    session: createMockSession(),
  },
  error: null,
};

/**
 * Mock auth error responses
 */
export const mockAuthErrors = {
  invalidCredentials: {
    message: 'Invalid login credentials',
    status: 400,
    code: 'invalid_credentials',
  },
  emailExists: {
    message: 'User already registered',
    status: 422,
    code: 'user_already_exists',
  },
  weakPassword: {
    message: 'Password should be at least 6 characters',
    status: 422,
    code: 'weak_password',
  },
  invalidEmail: {
    message: 'Unable to validate email address',
    status: 422,
    code: 'invalid_email',
  },
  sessionExpired: {
    message: 'Session expired',
    status: 401,
    code: 'PGRST301',
  },
  networkError: new TypeError('Failed to fetch'),
};

/**
 * Create mock form data
 */
export const mockFormData = {
  validLogin: {
    email: 'test@example.com',
    password: 'password123',
  },
  validSignup: {
    email: 'newuser@example.com',
    password: 'securePass123!',
    displayName: 'New User',
  },
  invalidEmail: {
    email: 'invalid-email',
    password: 'password123',
  },
  weakPassword: {
    email: 'test@example.com',
    password: '123',
  },
};
