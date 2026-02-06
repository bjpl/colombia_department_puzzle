/**
 * Authentication Context
 *
 * Provides authentication state and methods to the application.
 * Manages session persistence, token refresh, and auth state changes.
 * Gracefully handles disabled auth (feature flag off / no credentials).
 */

import { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth/AuthService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { AuthContextType, AuthState } from '../types/auth';
import type { User, Session } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: isSupabaseConfigured, // Only show loading if auth is configured
  });

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Auth is disabled - skip initialization
      setAuthState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    initializeAuth();
    const cleanup = setupAuthListener();
    return cleanup;
  }, []);

  /**
   * Initialize authentication state
   */
  async function initializeAuth() {
    try {
      const session = await authService.getSession();
      const user = await authService.getCurrentUser();

      setAuthState({
        user,
        session,
        isAuthenticated: !!user && !!session,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      setAuthState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }

  /**
   * Setup listener for auth state changes using the imported supabase client
   */
  function setupAuthListener(): (() => void) | undefined {
    if (!supabase) return undefined;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: string, session: Session | null) => {
        if (import.meta.env.DEV) {
          console.log('Auth state changed:', _event);
        }

        const user = session?.user || null;

        setAuthState({
          user,
          session,
          isAuthenticated: !!user && !!session,
          isLoading: false,
        });

        if (_event === 'SIGNED_OUT') {
          localStorage.removeItem('colombia-puzzle-auth');
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }

  /**
   * Sign in with email and password
   */
  async function signIn(email: string, password: string): Promise<Session> {
    const session = await authService.signIn(email, password);

    setAuthState({
      user: session.user,
      session,
      isAuthenticated: true,
      isLoading: false,
    });

    return session;
  }

  /**
   * Sign up with email and password
   */
  async function signUp(email: string, password: string, displayName?: string): Promise<User> {
    const user = await authService.signUp(email, password, displayName);
    // Auth state updated via onAuthStateChange when email is verified
    return user;
  }

  /**
   * Sign out
   */
  async function signOut(): Promise<void> {
    await authService.signOut();

    setAuthState({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }

  const value: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    signInWithMagicLink: authService.signInWithMagicLink.bind(authService),
    signInWithOAuth: authService.signInWithOAuth.bind(authService),
    refreshSession: authService.refreshSession.bind(authService),
    updateEmail: authService.updateEmail.bind(authService),
    updatePassword: authService.updatePassword.bind(authService),
    requestPasswordReset: authService.requestPasswordReset.bind(authService),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
