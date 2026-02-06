/**
 * Supabase Client Configuration
 *
 * Initializes and configures the Supabase client for authentication and database operations.
 * Implements secure session management with automatic token refresh.
 * Gracefully handles missing credentials when auth is disabled via feature flag.
 *
 * @module lib/supabase
 * @see docs/architecture/01-authentication-architecture.md
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isAuthEnabled = import.meta.env.VITE_ENABLE_SUPABASE_AUTH === 'true';

/**
 * Check if Supabase is properly configured with credentials
 */
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && isAuthEnabled);

/**
 * Configured Supabase client instance (null when auth is disabled or unconfigured)
 *
 * Features:
 * - Automatic session persistence
 * - Automatic token refresh
 * - Cross-tab session detection
 * - Secure token storage
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'colombia-puzzle-auth',
        storage: window.localStorage,
      },
      global: {
        headers: {
          'X-Client-Info': 'colombia-puzzle-pwa',
        },
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

/**
 * Get the Supabase client, throwing if not configured.
 * Use this in code paths that require auth to be enabled.
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and VITE_ENABLE_SUPABASE_AUTH=true in your .env file.'
    );
  }
  return supabase;
}

/**
 * Validate current session and refresh if needed
 *
 * @returns Valid session or null if invalid/expired/unconfigured
 */
export async function validateSession() {
  if (!supabase) return null;

  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Session validation error:', error);
      return null;
    }

    if (!session) {
      return null;
    }

    // Check if token is expired or about to expire
    const expiresAt = session.expires_at;
    if (expiresAt && expiresAt * 1000 < Date.now()) {
      console.warn('Token expired, refreshing...');
      const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
      return refreshedSession;
    }

    return session;
  } catch (error) {
    console.error('Session validation failed:', error);
    return null;
  }
}

/**
 * Get current authenticated user
 *
 * @returns User object or null if not authenticated/unconfigured
 */
export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Check if user is currently authenticated
 *
 * @returns True if user has valid session
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await validateSession();
  return session !== null;
}
