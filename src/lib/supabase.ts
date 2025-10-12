/**
 * Supabase Client Configuration
 *
 * Initializes and configures the Supabase client for authentication and database operations.
 * Implements secure session management with automatic token refresh.
 *
 * @module lib/supabase
 * @see docs/architecture/01-authentication-architecture.md
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

/**
 * Configured Supabase client instance
 *
 * Features:
 * - Automatic session persistence
 * - Automatic token refresh
 * - Cross-tab session detection
 * - Secure token storage
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist session to localStorage (will be encrypted via SecureStorage)
    persistSession: true,

    // Automatically refresh tokens before expiry
    autoRefreshToken: true,

    // Detect session changes across tabs
    detectSessionInUrl: true,

    // Storage key for session data
    storageKey: 'colombia-puzzle-auth',

    // Use localStorage (will be wrapped by SecureStorage)
    storage: window.localStorage,
  },

  // Additional security and performance options
  global: {
    headers: {
      'X-Client-Info': 'colombia-puzzle-pwa',
    },
  },

  // Real-time rate limiting
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * Validate current session and refresh if needed
 *
 * @returns Valid session or null if invalid/expired
 */
export async function validateSession() {
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
 * @returns User object or null if not authenticated
 */
export async function getCurrentUser() {
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
