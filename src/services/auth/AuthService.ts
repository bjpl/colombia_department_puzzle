/**
 * Authentication Service
 *
 * Handles all authentication operations:
 * - Email/password signup and signin
 * - Magic link authentication
 * - OAuth (Google, GitHub)
 * - Session management
 * - Password reset
 *
 * Based on Authentication Architecture and API Layer Design.
 */

import { BaseService } from '../base/BaseService';
import { ServiceError, ErrorCode } from '../../types/errors';
import { getSupabaseClient, isSupabaseConfigured } from '../../lib/supabase';
import type { User, Session, SupabaseClient } from '@supabase/supabase-js';

export class AuthService extends BaseService {
  /**
   * Get the Supabase client from the centralized lib/supabase module
   */
  protected getSupabaseClient(): SupabaseClient {
    return getSupabaseClient();
  }

  /**
   * Check if auth is available
   */
  isAvailable(): boolean {
    return isSupabaseConfigured;
  }

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, displayName?: string): Promise<User> {
    return this.executeWithRetry(async () => {
      const supabase = this.getSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
          emailRedirectTo: `${window.location.origin}/colombia_department_puzzle/auth/callback`,
        },
      });

      if (error) throw error;
      if (!data.user) {
        throw new ServiceError('Signup failed', ErrorCode.UNKNOWN_ERROR);
      }

      return data.user;
    });
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<Session> {
    return this.executeWithRetry(async () => {
      const supabase = this.getSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new ServiceError(
          'Invalid email or password.',
          ErrorCode.INVALID_CREDENTIALS,
          error
        );
      }

      if (!data.session) {
        throw new ServiceError('Login failed', ErrorCode.UNKNOWN_ERROR);
      }

      return data.session;
    });
  }

  /**
   * Sign in with magic link
   */
  async signInWithMagicLink(email: string): Promise<void> {
    return this.executeWithRetry(async () => {
      const supabase = this.getSupabaseClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/colombia_department_puzzle/auth/callback`,
        },
      });

      if (error) throw error;
    });
  }

  /**
   * Sign in with OAuth provider (Google, GitHub)
   */
  async signInWithOAuth(provider: 'google' | 'github'): Promise<void> {
    return this.executeWithRetry(async () => {
      const supabase = this.getSupabaseClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/colombia_department_puzzle/auth/callback`,
          ...(provider === 'google' && {
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          }),
        },
      });

      if (error) throw error;
    });
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    return this.executeWithRetry(async () => {
      const supabase = this.getSupabaseClient();
      const { error } = await supabase.auth.signOut();

      if (error) throw error;
    });
  }

  /**
   * Get current session
   */
  async getSession(): Promise<Session | null> {
    if (!isSupabaseConfigured) return null;
    const supabase = this.getSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured) return null;
    const supabase = this.getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  /**
   * Refresh session
   */
  async refreshSession(): Promise<Session> {
    return this.executeWithRetry(async () => {
      const supabase = this.getSupabaseClient();
      const { data, error } = await supabase.auth.refreshSession();

      if (error) throw error;
      if (!data.session) {
        throw new ServiceError('Session refresh failed', ErrorCode.SESSION_EXPIRED);
      }

      return data.session;
    });
  }

  /**
   * Update user email
   */
  async updateEmail(newEmail: string): Promise<User> {
    await this.requireAuth();

    return this.executeWithRetry(async () => {
      const supabase = this.getSupabaseClient();
      const { data, error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) throw error;
      if (!data.user) {
        throw new ServiceError('Email update failed', ErrorCode.UNKNOWN_ERROR);
      }

      return data.user;
    });
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword: string): Promise<User> {
    await this.requireAuth();

    return this.executeWithRetry(async () => {
      const supabase = this.getSupabaseClient();
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      if (!data.user) {
        throw new ServiceError('Password update failed', ErrorCode.UNKNOWN_ERROR);
      }

      return data.user;
    });
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    return this.executeWithRetry(async () => {
      const supabase = this.getSupabaseClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/colombia_department_puzzle/auth/reset-password`,
      });

      if (error) throw error;
    });
  }
}

// Export singleton instance
export const authService = new AuthService();
