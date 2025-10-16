/**
 * AuthContext Tests
 *
 * CONCEPT: Test AuthProvider and useAuth hook behavior
 * WHY: Ensures authentication state management and session restoration work correctly
 * PATTERN: React Testing Library with mock Supabase client
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { AuthProvider, AuthContext } from '../../context/AuthContext';
import {
  setupMockSupabaseClient,
  cleanupMockSupabaseClient,
  createMockUser,
  createMockSession,
  mockAuthErrors,
  waitForAuthState,
} from '../utils/authTestUtils';

// Hook to use AuthContext
function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

describe('AuthContext - Provider Initialization', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = setupMockSupabaseClient();
  });

  afterEach(() => {
    cleanupMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    mockClient.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should restore session on mount', async () => {
    const mockSession = createMockSession();
    const mockUser = createMockUser();

    mockClient.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.session).toEqual(mockSession);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle no session on mount', async () => {
    mockClient.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle initialization errors gracefully', async () => {
    mockClient.auth.getSession.mockRejectedValue(new Error('Session error'));
    mockClient.auth.getUser.mockRejectedValue(new Error('User error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

describe('AuthContext - Auth State Listener', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = setupMockSupabaseClient();
  });

  afterEach(() => {
    cleanupMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('should setup auth state change listener', async () => {
    mockClient.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(mockClient.auth.onAuthStateChange).toHaveBeenCalled();
    });
  });

  it('should update state on SIGNED_IN event', async () => {
    mockClient.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);

    // Trigger SIGNED_IN event
    const mockSession = createMockSession();
    act(() => {
      mockClient._triggerAuthStateChange('SIGNED_IN', mockSession);
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    expect(result.current.user).toEqual(mockSession.user);
    expect(result.current.session).toEqual(mockSession);
  });

  it('should update state on SIGNED_OUT event', async () => {
    const mockSession = createMockSession();

    mockClient.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: mockSession.user },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    // Trigger SIGNED_OUT event
    act(() => {
      mockClient._triggerAuthStateChange('SIGNED_OUT', null);
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
  });

  it('should clear token on SIGNED_OUT', async () => {
    const mockSession = createMockSession();

    mockClient.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: mockSession.user },
      error: null,
    });

    const removeItemSpy = vi.spyOn(localStorage, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    act(() => {
      mockClient._triggerAuthStateChange('SIGNED_OUT', null);
    });

    await waitFor(() => {
      expect(removeItemSpy).toHaveBeenCalledWith('supabase.auth.token');
    });

    removeItemSpy.mockRestore();
  });

  it('should handle TOKEN_REFRESHED event', async () => {
    const mockSession = createMockSession();

    mockClient.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: mockSession.user },
      error: null,
    });

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitForAuthState();

    const newSession = createMockSession({ access_token: 'new-token' });

    act(() => {
      mockClient._triggerAuthStateChange('TOKEN_REFRESHED', newSession);
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Session token refreshed');
    });

    consoleSpy.mockRestore();
  });
});

describe('AuthContext - Sign In', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = setupMockSupabaseClient();
    mockClient.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });
  });

  afterEach(() => {
    cleanupMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('should sign in successfully', async () => {
    const mockSession = createMockSession();
    mockClient.auth.signInWithPassword.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let returnedSession: any;
    await act(async () => {
      returnedSession = await result.current.signIn('test@example.com', 'password123');
    });

    expect(returnedSession).toEqual(mockSession);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockSession.user);
    expect(result.current.session).toEqual(mockSession);
  });

  it('should handle signin errors', async () => {
    mockClient.auth.signInWithPassword.mockResolvedValue({
      data: { session: null },
      error: mockAuthErrors.invalidCredentials,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(
      act(async () => {
        await result.current.signIn('wrong@example.com', 'wrongpass');
      })
    ).rejects.toThrow();

    expect(result.current.isAuthenticated).toBe(false);
  });
});

describe('AuthContext - Sign Up', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = setupMockSupabaseClient();
    mockClient.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });
  });

  afterEach(() => {
    cleanupMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('should sign up successfully', async () => {
    const mockUser = createMockUser();
    mockClient.auth.signUp.mockResolvedValue({
      data: { user: mockUser, session: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let returnedUser: any;
    await act(async () => {
      returnedUser = await result.current.signUp('new@example.com', 'password123', 'New User');
    });

    expect(returnedUser).toEqual(mockUser);
    // Note: User may not be authenticated yet due to email verification
    // isAuthenticated should remain false until verification
  });

  it('should handle signup errors', async () => {
    mockClient.auth.signUp.mockResolvedValue({
      data: { user: null },
      error: mockAuthErrors.emailExists,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(
      act(async () => {
        await result.current.signUp('existing@example.com', 'password123');
      })
    ).rejects.toThrow();
  });
});

describe('AuthContext - Sign Out', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = setupMockSupabaseClient();
  });

  afterEach(() => {
    cleanupMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('should sign out successfully', async () => {
    const mockSession = createMockSession();

    mockClient.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: mockSession.user },
      error: null,
    });
    mockClient.auth.signOut.mockResolvedValue({
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle signout errors', async () => {
    const mockSession = createMockSession();

    mockClient.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: mockSession.user },
      error: null,
    });
    mockClient.auth.signOut.mockResolvedValue({
      error: new Error('Signout failed'),
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    await expect(
      act(async () => {
        await result.current.signOut();
      })
    ).rejects.toThrow();
  });
});

describe('AuthContext - Additional Methods', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = setupMockSupabaseClient();
    mockClient.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });
  });

  afterEach(() => {
    cleanupMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('should provide signInWithMagicLink method', async () => {
    mockClient.auth.signInWithOtp.mockResolvedValue({
      data: {},
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.signInWithMagicLink('test@example.com');
    });

    expect(mockClient.auth.signInWithOtp).toHaveBeenCalled();
  });

  it('should provide signInWithOAuth method', async () => {
    mockClient.auth.signInWithOAuth.mockResolvedValue({
      data: {},
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.signInWithOAuth('google');
    });

    expect(mockClient.auth.signInWithOAuth).toHaveBeenCalled();
  });

  it('should provide refreshSession method', async () => {
    const mockSession = createMockSession();
    mockClient.auth.refreshSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.refreshSession();
    });

    expect(mockClient.auth.refreshSession).toHaveBeenCalled();
  });
});

describe('AuthContext - useAuth Hook', () => {
  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within AuthProvider');
  });
});
