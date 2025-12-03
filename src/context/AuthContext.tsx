/**
 * Authentication Context
 *
 * Provides authentication state and methods to the application.
 * Manages session persistence, token refresh, and auth state changes.
 *
 * Based on Authentication Architecture patterns.
 * Follows patterns from GameContext.tsx and AccessibilityContext.tsx.
 */

import { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth/AuthService';
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
    isLoading: true,
  });

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
    setupAuthListener();
  }, []);

  /**
   * Initialize authentication state
   * Attempts to restore session from storage
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
   * Setup listener for auth state changes
   */
  function setupAuthListener() {
    try {
      // Get supabase client if available
      const supabase = (window as any).supabaseClient;
      if (!supabase) {
        console.warn('Supabase client not available for auth listener');
        return;
      }

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event: string, session: Session | null) => {
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.log('Auth state changed:', event);
          }

          const user = session?.user || null;

          setAuthState({
            user,
            session,
            isAuthenticated: !!user && !!session,
            isLoading: false,
          });

          // Handle specific events
          if (event === 'SIGNED_OUT') {
            // Clear any cached data
            localStorage.removeItem('supabase.auth.token');
          } else if (event === 'TOKEN_REFRESHED') {
            // Session was automatically refreshed
            if (import.meta.env.DEV) {
              // eslint-disable-next-line no-console
              console.log('Session token refreshed');
            }
          }
        }
      );

      // Cleanup subscription on unmount
      return () => {
        subscription?.unsubscribe();
      };
    } catch (error) {
      console.error('Failed to setup auth listener:', error);
    }
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

    // Note: User may not be authenticated yet (email verification required)
    // Auth state will be updated via onAuthStateChange when verification completes

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
