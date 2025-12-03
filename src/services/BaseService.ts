/**
 * BaseService - Base class for services that may interact with Supabase
 *
 * Provides common functionality for services including:
 * - Supabase client access (when enabled)
 * - Feature flag checking
 * - Error handling utilities
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * BaseService provides common infrastructure for all services
 * that may interact with Supabase backend
 */
export class BaseService {
  protected supabase: SupabaseClient;

  constructor() {
    // Initialize Supabase client if enabled, otherwise create a null client
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

    if (this.isSupabaseEnabled() && supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    } else {
      // Create a mock client that throws errors if used
      this.supabase = this.createMockClient();
    }
  }

  /**
   * Check if Supabase is enabled via feature flag
   */
  protected isSupabaseEnabled(): boolean {
    return import.meta.env.VITE_ENABLE_SUPABASE_AUTH === 'true';
  }

  /**
   * Create a mock Supabase client for when Supabase is disabled
   * This prevents runtime errors when accessing this.supabase
   */
  private createMockClient(): any {
    const mockError = () => {
      throw new Error('Supabase is not enabled. Set VITE_ENABLE_SUPABASE_AUTH=true to enable.');
    };

    return {
      from: () => ({
        select: mockError,
        insert: mockError,
        update: mockError,
        delete: mockError,
        upsert: mockError,
      }),
      auth: {
        signUp: mockError,
        signInWithPassword: mockError,
        signOut: mockError,
        getSession: mockError,
        getUser: mockError,
      },
      storage: {
        from: mockError,
      },
    };
  }

  /**
   * Log errors consistently across all services
   */
  protected logError(context: string, error: unknown): void {
    console.error(`[${this.constructor.name}] ${context}:`, error);
  }

  /**
   * Check if we're in a browser environment
   */
  protected isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Safe localStorage access with fallback
   */
  protected getLocalStorageItem(key: string): string | null {
    if (!this.isBrowser()) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      this.logError('localStorage.getItem', error);
      return null;
    }
  }

  /**
   * Safe localStorage write with fallback
   */
  protected setLocalStorageItem(key: string, value: string): boolean {
    if (!this.isBrowser()) return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      this.logError('localStorage.setItem', error);
      return false;
    }
  }

  /**
   * Safe localStorage remove with fallback
   */
  protected removeLocalStorageItem(key: string): boolean {
    if (!this.isBrowser()) return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      this.logError('localStorage.removeItem', error);
      return false;
    }
  }
}
