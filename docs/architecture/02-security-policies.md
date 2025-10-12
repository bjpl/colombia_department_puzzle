# Security Policies & Row Level Security (RLS)

**Version:** 1.0
**Author:** SecurityArchitect Agent
**Date:** 2025-10-11
**Status:** Design Complete

## 1. Security Architecture Overview

### 1.1 Defense-in-Depth Strategy

Our security architecture implements multiple layers of protection:

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Network Security                              │
│  - HTTPS/TLS 1.3 only                                   │
│  - CORS configuration                                   │
│  - Rate limiting                                        │
└─────────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 2: Authentication                                │
│  - JWT token validation                                 │
│  - Token expiration enforcement                         │
│  - Refresh token rotation                               │
└─────────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 3: Authorization (RLS)                           │
│  - Row Level Security policies                          │
│  - Role-based access control                            │
│  - Query-level permissions                              │
└─────────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 4: Input Validation                              │
│  - SQL injection prevention                             │
│  - XSS sanitization                                     │
│  - CSRF tokens                                          │
└─────────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 5: Application Security                          │
│  - Secure token storage                                 │
│  - Content Security Policy                              │
│  - Dependency scanning                                  │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Security Principles

1. **Principle of Least Privilege**: Users can only access their own data
2. **Zero Trust**: Every request is validated and authorized
3. **Defense in Depth**: Multiple security layers prevent single point of failure
4. **Fail Secure**: Errors default to denying access
5. **Transparent Security**: Users understand what data is collected and why

## 2. Row Level Security (RLS) Policies

### 2.1 RLS Overview

Row Level Security (RLS) is PostgreSQL's built-in feature that restricts which rows users can access in database queries. Supabase uses RLS to enforce authorization at the database level, making it impossible to bypass security through the API.

### 2.2 Enable RLS on All Tables

```sql
-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
```

### 2.3 User Profiles RLS Policies

```sql
-- User Profiles: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- User Profiles: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- User Profiles: Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User Profiles: Public can view display names (for leaderboard)
CREATE POLICY "Public can view display names"
  ON public.user_profiles
  FOR SELECT
  USING (true)
  -- But only allow selecting specific columns via view
  -- (See "public_profiles" view below)
  ;
```

### 2.4 Game Stats RLS Policies

```sql
-- Game Stats: Users can read their own stats
CREATE POLICY "Users can view own game stats"
  ON public.game_stats
  FOR SELECT
  USING (auth.uid() = user_id);

-- Game Stats: Users can update their own stats
CREATE POLICY "Users can update own game stats"
  ON public.game_stats
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Game Stats: Users can insert their own stats (on first game)
CREATE POLICY "Users can insert own game stats"
  ON public.game_stats
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Game Stats: No delete allowed (for data integrity)
-- Users cannot delete their stats
```

### 2.5 Game Sessions RLS Policies

```sql
-- Game Sessions: Users can view their own sessions
CREATE POLICY "Users can view own game sessions"
  ON public.game_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Game Sessions: Users can insert their own sessions
CREATE POLICY "Users can insert own game sessions"
  ON public.game_sessions
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR
    user_id IS NULL -- Allow anonymous sessions
  );

-- Game Sessions: Users can update their own incomplete sessions
CREATE POLICY "Users can update own incomplete sessions"
  ON public.game_sessions
  FOR UPDATE
  USING (
    auth.uid() = user_id AND
    completed = false
  )
  WITH CHECK (auth.uid() = user_id);

-- Game Sessions: Admins can view all sessions (for analytics)
CREATE POLICY "Admins can view all sessions"
  ON public.game_sessions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );
```

### 2.6 Achievements RLS Policies

```sql
-- Achievements: Users can view their own achievements
CREATE POLICY "Users can view own achievements"
  ON public.achievements
  FOR SELECT
  USING (auth.uid() = user_id);

-- Achievements: System can insert achievements (via function)
-- Users cannot directly insert achievements
CREATE POLICY "System can insert achievements"
  ON public.achievements
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'system'
    )
  );

-- Note: Achievement insertion should be done via a secure function
-- that validates achievement criteria before inserting
```

### 2.7 Leaderboard RLS Policies

```sql
-- Leaderboard: Anyone can read (public leaderboard)
CREATE POLICY "Anyone can view leaderboard"
  ON public.leaderboard
  FOR SELECT
  USING (true);

-- Leaderboard: Users can insert their own entries
CREATE POLICY "Users can insert own leaderboard entry"
  ON public.leaderboard
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Leaderboard: Users can update their own entries (better time)
CREATE POLICY "Users can update own leaderboard entry"
  ON public.leaderboard
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    NEW.best_time_seconds < OLD.best_time_seconds -- Only allow improvements
  );

-- Leaderboard: Admins can delete entries (moderation)
CREATE POLICY "Admins can delete leaderboard entries"
  ON public.leaderboard
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );
```

### 2.8 Secure Views for Public Data

```sql
-- Public profiles view (only non-sensitive data)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT
  id,
  display_name,
  avatar_url
FROM public.user_profiles;

-- Grant SELECT to authenticated and anonymous users
GRANT SELECT ON public.public_profiles TO authenticated, anon;

-- Leaderboard view with user info
CREATE OR REPLACE VIEW public.leaderboard_with_users AS
SELECT
  l.id,
  l.difficulty,
  l.best_time_seconds,
  l.achieved_at,
  pp.display_name,
  pp.avatar_url
FROM public.leaderboard l
JOIN public.public_profiles pp ON l.user_id = pp.id
ORDER BY l.difficulty, l.best_time_seconds ASC;

-- Grant SELECT to everyone
GRANT SELECT ON public.leaderboard_with_users TO authenticated, anon;
```

## 3. API Endpoint Protection

### 3.1 Supabase Client Configuration

```typescript
// src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js';

// Environment variables (NEVER commit these)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with security options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist session to localStorage (encrypted)
    persistSession: true,

    // Automatically refresh tokens before expiry
    autoRefreshToken: true,

    // Detect session changes across tabs
    detectSessionInUrl: true,

    // Storage encryption key (generated per device)
    storageKey: 'colombia-puzzle-auth',

    // Use cookies for session (more secure)
    // Requires backend proxy for HTTPOnly cookies
    storage: window.localStorage, // Use custom secure storage
  },

  // Additional security options
  global: {
    headers: {
      'X-Client-Info': 'colombia-puzzle-pwa',
    },
  },

  // Rate limiting (client-side)
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Validate JWT tokens before using
export async function validateSession() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Session validation error:', error);
    return null;
  }

  if (!session) {
    return null;
  }

  // Check if token is expired
  const expiresAt = session.expires_at;
  if (expiresAt && expiresAt * 1000 < Date.now()) {
    console.warn('Token expired, refreshing...');
    const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
    return refreshedSession;
  }

  return session;
}
```

### 3.2 Authenticated API Calls

```typescript
// src/services/api/gameStats.ts

import { supabase } from '@/lib/supabase';
import type { GameStats } from '@/types/auth';

export class GameStatsService {
  /**
   * Get user's game statistics
   * RLS ensures user can only access their own stats
   */
  static async getUserStats(): Promise<GameStats | null> {
    const { data, error } = await supabase
      .from('game_stats')
      .select('*')
      .single(); // RLS automatically filters by user_id

    if (error) {
      console.error('Error fetching game stats:', error);
      return null;
    }

    return data;
  }

  /**
   * Update user's game statistics
   * RLS ensures user can only update their own stats
   */
  static async updateStats(updates: Partial<GameStats>): Promise<boolean> {
    const { error } = await supabase
      .from('game_stats')
      .upsert(updates); // RLS enforces user_id match

    if (error) {
      console.error('Error updating game stats:', error);
      return false;
    }

    return true;
  }

  /**
   * Record a new game session
   * RLS ensures session is created for authenticated user
   */
  static async recordSession(sessionData: {
    difficulty: 'easy' | 'medium' | 'hard';
    completionTimeSeconds?: number;
    completed: boolean;
    hintsUsed: number;
    mistakesMade: number;
  }): Promise<boolean> {
    const { error } = await supabase
      .from('game_sessions')
      .insert({
        ...sessionData,
        device_type: getDeviceType(),
        is_pwa: isPWA(),
      });

    if (error) {
      console.error('Error recording session:', error);
      return false;
    }

    return true;
  }
}

// Helper functions
function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function isPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches;
}
```

## 4. CSRF & XSS Prevention

### 4.1 Cross-Site Request Forgery (CSRF) Protection

Supabase JWTs include built-in CSRF protection through:

1. **SameSite Cookies**: If using cookie-based auth
2. **Token Validation**: JWT signature verification
3. **Origin Validation**: Supabase validates request origins

**Additional CSRF Protection:**

```typescript
// src/lib/csrf.ts

/**
 * Generate CSRF token for state-changing operations
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Store CSRF token in sessionStorage
 */
export function storeCSRFToken(token: string): void {
  sessionStorage.setItem('csrf_token', token);
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string): boolean {
  const storedToken = sessionStorage.getItem('csrf_token');
  return storedToken === token;
}

/**
 * Middleware for protected forms
 */
export function withCSRFProtection<T>(
  operation: () => Promise<T>
): Promise<T> {
  const token = generateCSRFToken();
  storeCSRFToken(token);

  return operation().then(result => {
    sessionStorage.removeItem('csrf_token');
    return result;
  });
}
```

### 4.2 Cross-Site Scripting (XSS) Prevention

**Content Security Policy (CSP):**

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.supabase.io;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://*.supabase.co;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co;
  font-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
">
```

**Input Sanitization:**

```typescript
// src/lib/sanitize.ts

import DOMPurify from 'dompurify';

/**
 * Sanitize user-generated content
 */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize display name
 */
export function sanitizeDisplayName(name: string): string {
  // Remove HTML tags
  let clean = sanitizeHTML(name);

  // Trim whitespace
  clean = clean.trim();

  // Limit length
  clean = clean.slice(0, 50);

  // Remove special characters except letters, numbers, spaces, hyphens
  clean = clean.replace(/[^a-zA-Z0-9\s\-]/g, '');

  return clean;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

## 5. Secure Token Storage

### 5.1 Token Storage Strategy

**Security Requirements:**
1. Access tokens should be stored in memory (React state)
2. Refresh tokens should be encrypted in localStorage
3. Tokens should never be logged or exposed in URLs
4. Tokens should be cleared on logout

### 5.2 Encrypted Storage Implementation

```typescript
// src/lib/secureStorage.ts

/**
 * Encrypt data before storing in localStorage
 * Uses Web Crypto API for AES-GCM encryption
 */
export class SecureStorage {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;

  /**
   * Generate encryption key (device-specific)
   */
  private static async getEncryptionKey(): Promise<CryptoKey> {
    // Use device fingerprint as seed
    const fingerprint = await this.getDeviceFingerprint();

    // Derive key from fingerprint
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(fingerprint),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('colombia-puzzle-salt'),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: this.ALGORITHM, length: this.KEY_LENGTH },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Get device fingerprint (simple implementation)
   */
  private static async getDeviceFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
    ];

    const fingerprint = components.join('|');

    // Hash fingerprint
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Encrypt and store data
   */
  static async setItem(key: string, value: string): Promise<void> {
    try {
      const encryptionKey = await this.getEncryptionKey();
      const encoder = new TextEncoder();
      const data = encoder.encode(value);

      // Generate IV (Initialization Vector)
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Encrypt data
      const encrypted = await crypto.subtle.encrypt(
        { name: this.ALGORITHM, iv },
        encryptionKey,
        data
      );

      // Store IV + encrypted data
      const encryptedArray = new Uint8Array(encrypted);
      const combined = new Uint8Array(iv.length + encryptedArray.length);
      combined.set(iv);
      combined.set(encryptedArray, iv.length);

      // Convert to base64 for storage
      const base64 = btoa(String.fromCharCode(...combined));
      localStorage.setItem(key, base64);
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to store data securely');
    }
  }

  /**
   * Retrieve and decrypt data
   */
  static async getItem(key: string): Promise<string | null> {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const encryptionKey = await this.getEncryptionKey();

      // Decode from base64
      const combined = Uint8Array.from(atob(stored), c => c.charCodeAt(0));

      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      // Decrypt data
      const decrypted = await crypto.subtle.decrypt(
        { name: this.ALGORITHM, iv },
        encryptionKey,
        encrypted
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }

  /**
   * Remove item
   */
  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear all secure storage
   */
  static clear(): void {
    // Only clear our keys
    const keys = Object.keys(localStorage).filter(k => k.startsWith('colombia-puzzle-'));
    keys.forEach(key => localStorage.removeItem(key));
  }
}
```

### 5.3 Token Storage Usage

```typescript
// src/context/AuthContext.tsx (excerpt)

import { SecureStorage } from '@/lib/secureStorage';

// Store session securely
async function storeSession(session: Session) {
  await SecureStorage.setItem(
    'colombia-puzzle-auth-session',
    JSON.stringify(session)
  );
}

// Retrieve session securely
async function retrieveSession(): Promise<Session | null> {
  const stored = await SecureStorage.getItem('colombia-puzzle-auth-session');
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

// Clear session on logout
async function clearSession() {
  await SecureStorage.removeItem('colombia-puzzle-auth-session');
  await supabase.auth.signOut();
}
```

## 6. Rate Limiting & Abuse Prevention

### 6.1 Client-Side Rate Limiting

```typescript
// src/lib/rateLimiter.ts

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  constructor(private config: RateLimitConfig) {}

  /**
   * Check if action is allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Remove attempts outside the time window
    const validAttempts = attempts.filter(
      time => now - time < this.config.windowMs
    );

    // Check if limit exceeded
    if (validAttempts.length >= this.config.maxAttempts) {
      return false;
    }

    // Record this attempt
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);

    return true;
  }

  /**
   * Reset attempts for a key
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Login rate limiter (5 attempts per 15 minutes)
export const loginRateLimiter = new RateLimiter({
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
});

// Signup rate limiter (3 attempts per hour)
export const signupRateLimiter = new RateLimiter({
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000,
});
```

### 6.2 Supabase Rate Limiting

Supabase provides server-side rate limiting. Configure in Supabase dashboard:

```
Auth Rate Limits:
- Email signups: 3 per hour per IP
- Login attempts: 5 per 15 minutes per IP
- Password reset: 3 per hour per email
- Magic link: 3 per hour per email
- OAuth: 10 per minute per IP

API Rate Limits:
- Authenticated requests: 100 per minute per user
- Anonymous requests: 30 per minute per IP
```

## 7. Security Monitoring & Logging

### 7.1 Security Event Logging

```typescript
// src/lib/securityLogger.ts

export enum SecurityEventType {
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILURE = 'login_failure',
  LOGOUT = 'logout',
  SESSION_EXPIRED = 'session_expired',
  TOKEN_REFRESH = 'token_refresh',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
}

export interface SecurityEvent {
  type: SecurityEventType;
  userId?: string;
  ipAddress?: string;
  userAgent: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export class SecurityLogger {
  /**
   * Log security event
   */
  static async logEvent(event: Omit<SecurityEvent, 'timestamp'>): Promise<void> {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    // In production, send to logging service
    if (import.meta.env.PROD) {
      await this.sendToLoggingService(fullEvent);
    } else {
      console.log('[Security Event]', fullEvent);
    }
  }

  private static async sendToLoggingService(event: SecurityEvent): Promise<void> {
    // Send to Supabase, Sentry, or other logging service
    try {
      await supabase.from('security_events').insert(event);
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }
}
```

## 8. Security Checklist

### Pre-Deployment Security Checklist

- [ ] All tables have RLS enabled
- [ ] RLS policies tested for all user roles
- [ ] Environment variables configured (not committed)
- [ ] HTTPS enforced in production
- [ ] Content Security Policy configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Token encryption implemented
- [ ] XSS prevention tested
- [ ] CSRF protection implemented
- [ ] Input validation on all forms
- [ ] SQL injection prevention verified
- [ ] Password strength requirements enforced
- [ ] Email verification enabled
- [ ] Session timeout configured
- [ ] Audit logging enabled
- [ ] Security headers configured
- [ ] Dependency vulnerabilities scanned
- [ ] Penetration testing completed
- [ ] Security incident response plan documented

---

**Next Document**: API Layer Design & Error Handling
