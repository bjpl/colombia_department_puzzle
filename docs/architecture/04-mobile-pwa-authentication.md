# Mobile & PWA Authentication

**Version:** 1.0
**Author:** SecurityArchitect Agent
**Date:** 2025-10-11
**Status:** Design Complete

## 1. Mobile-First Authentication Strategy

### 1.1 Mobile UX Considerations

The Colombia Puzzle Game already has excellent mobile support (v1.0). Our authentication system must maintain this high standard:

```
Mobile-First Principles:
1. Touch-optimized: 44x44px minimum touch targets (WCAG AAA)
2. One-handed friendly: Critical actions in thumb reach
3. Auto-complete friendly: Support browser password managers
4. Keyboard-aware: Forms adapt when keyboard appears
5. Orientation-aware: Works in portrait and landscape
6. Offline-capable: Graceful degradation without connectivity
```

### 1.2 Authentication Flow Comparison

| Feature | Desktop | Mobile | PWA |
|---------|---------|--------|-----|
| **Email/Password** | Optimal | Good | Good |
| **Magic Links** | Good | Optimal | Optimal |
| **OAuth (Google)** | Optimal | Optimal | Good* |
| **Biometrics** | N/A | Optimal | Optimal** |
| **Session Persistence** | 30 days | 30 days | 30 days |
| **Offline Validation** | Limited | Limited | Full |

\* OAuth may have issues in standalone PWA mode (redirect handling)
\*\* Requires WebAuthn API support

### 1.3 Recommended Auth Methods by Platform

```typescript
// src/lib/authPlatformDetection.ts

export function getRecommendedAuthMethods(): AuthMethod[] {
  const isPWA = window.matchMedia('(display-mode: standalone)').matches;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const hasWebAuthn = 'credentials' in navigator;

  if (isPWA) {
    // PWA users: prioritize magic links and biometrics
    return hasWebAuthn
      ? ['biometric', 'magic-link', 'email-password']
      : ['magic-link', 'email-password'];
  }

  if (isMobile) {
    // Mobile web: prioritize magic links and OAuth
    return ['magic-link', 'oauth-google', 'email-password'];
  }

  // Desktop: all methods available
  return ['email-password', 'oauth-google', 'oauth-github', 'magic-link'];
}

type AuthMethod =
  | 'email-password'
  | 'magic-link'
  | 'oauth-google'
  | 'oauth-github'
  | 'biometric';
```

## 2. PWA-Specific Authentication Features

### 2.1 Offline Session Validation

The PWA can validate sessions offline using cached user data:

```typescript
// src/services/pwa/OfflineAuthService.ts

import { SecureStorage } from '@/lib/secureStorage';
import type { Session, User } from '@supabase/supabase-js';

export class OfflineAuthService {
  private static readonly CACHE_KEY = 'offline-auth-cache';

  /**
   * Cache user session for offline access
   */
  static async cacheSession(session: Session, user: User): Promise<void> {
    const cacheData = {
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
      },
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
      },
      cached_at: Date.now(),
    };

    await SecureStorage.setItem(
      this.CACHE_KEY,
      JSON.stringify(cacheData)
    );
  }

  /**
   * Validate cached session (offline)
   */
  static async validateOfflineSession(): Promise<{
    valid: boolean;
    user: User | null;
    needsRefresh: boolean;
  }> {
    const cached = await SecureStorage.getItem(this.CACHE_KEY);

    if (!cached) {
      return { valid: false, user: null, needsRefresh: true };
    }

    try {
      const data = JSON.parse(cached);

      // Check if session is expired
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = data.session.expires_at;

      if (expiresAt && expiresAt < now) {
        return { valid: false, user: null, needsRefresh: true };
      }

      // Check if cached data is stale (> 1 day)
      const cacheAge = Date.now() - data.cached_at;
      const needsRefresh = cacheAge > 24 * 60 * 60 * 1000;

      return {
        valid: true,
        user: data.user,
        needsRefresh,
      };
    } catch (error) {
      console.error('Invalid cached session:', error);
      return { valid: false, user: null, needsRefresh: true };
    }
  }

  /**
   * Clear cached session
   */
  static async clearCache(): Promise<void> {
    await SecureStorage.removeItem(this.CACHE_KEY);
  }

  /**
   * Check if user can access protected content offline
   */
  static async canAccessOffline(route: string): Promise<boolean> {
    const { valid } = await this.validateOfflineSession();

    // Public routes are always accessible
    const publicRoutes = ['/', '/login', '/signup'];
    if (publicRoutes.includes(route)) {
      return true;
    }

    // Protected routes require valid cached session
    return valid;
  }
}
```

### 2.2 Service Worker Auth Integration

```typescript
// public/sw-auth.ts (Service Worker code)

// Cache authentication state
self.addEventListener('message', (event) => {
  if (event.data.type === 'CACHE_AUTH_STATE') {
    const { user, session } = event.data.payload;

    // Store in IndexedDB for service worker access
    caches.open('auth-cache-v1').then(cache => {
      cache.put(
        '/auth/state',
        new Response(JSON.stringify({ user, session }))
      );
    });
  }
});

// Intercept fetch requests to protected routes
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Check if route requires authentication
  if (isProtectedRoute(url.pathname)) {
    event.respondWith(handleProtectedRoute(event.request));
  }
});

async function handleProtectedRoute(request: Request): Promise<Response> {
  // Check if user is authenticated (from cache)
  const authCache = await caches.open('auth-cache-v1');
  const cachedAuth = await authCache.match('/auth/state');

  if (!cachedAuth) {
    // Not authenticated: redirect to login
    return Response.redirect('/login', 302);
  }

  const { session } = await cachedAuth.json();

  // Check if session is expired
  if (session.expires_at * 1000 < Date.now()) {
    // Expired: redirect to login
    return Response.redirect('/login', 302);
  }

  // Authenticated: serve cached page or fetch from network
  return fetch(request).catch(() => {
    return caches.match(request) || new Response('Offline', { status: 503 });
  });
}

function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = ['/profile', '/stats', '/achievements'];
  return protectedRoutes.some(route => pathname.startsWith(route));
}
```

### 2.3 Background Sync for Auth Events

```typescript
// src/services/pwa/BackgroundSyncService.ts

export class BackgroundSyncService {
  /**
   * Register background sync for auth events
   */
  static async registerAuthSync(): Promise<void> {
    if (!('serviceWorker' in navigator)) return;
    if (!('sync' in (await navigator.serviceWorker.ready))) return;

    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register('sync-auth-state');
  }

  /**
   * Sync authentication state when online
   */
  static async syncAuthState(): Promise<void> {
    // This runs when service worker sync event fires
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      // Update cached session
      await OfflineAuthService.cacheSession(session, session.user);

      // Sync any pending game sessions
      await this.syncPendingGameSessions();
    }
  }

  private static async syncPendingGameSessions(): Promise<void> {
    // Implementation in Game Stats section
  }
}

// Service Worker event handler (in public/sw.js)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-auth-state') {
    event.waitUntil(syncAuthStateFromSW());
  }
});

async function syncAuthStateFromSW() {
  // Notify app to sync auth state
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'SYNC_AUTH_STATE',
    });
  });
}
```

## 3. Mobile Touch Optimizations

### 3.1 Touch-Friendly Login Form

```typescript
// src/components/auth/LoginForm.tsx

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import clsx from 'clsx';

export function LoginForm() {
  const { signIn, signInWithMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEmailPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      // Redirect handled by AuthProvider
    } catch (err: any) {
      setError(err.getUserMessage?.() || err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMagicLinkSubmit() {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithMagicLink(email);
      setError(null);
      // Show success message
    } catch (err: any) {
      setError(err.getUserMessage?.() || err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      {/* Touch-optimized form */}
      <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
        {/* Email input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={clsx(
              // Touch-optimized: 44px minimum height
              'min-h-[44px]',
              // Large text for readability
              'text-base md:text-sm',
              // Prevent zoom on iOS
              'text-[16px]'
            )}
            placeholder="you@example.com"
          />
        </div>

        {/* Password input */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={clsx(
              'min-h-[44px]',
              'text-base md:text-sm',
              'text-[16px]'
            )}
            placeholder="••••••••"
          />
        </div>

        {/* Error message */}
        {error && (
          <div
            className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isLoading}
          className={clsx(
            // Touch-optimized: 44px minimum height
            'min-h-[44px]',
            'w-full',
            'text-base font-medium'
          )}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or</span>
        </div>
      </div>

      {/* Magic link button (mobile-friendly) */}
      <Button
        onClick={handleMagicLinkSubmit}
        disabled={isLoading || !email}
        variant="outline"
        className={clsx('min-h-[44px]', 'w-full')}
      >
        Send Magic Link
      </Button>

      {/* Forgot password link */}
      <div className="text-center">
        <a
          href="/auth/forgot-password"
          className={clsx(
            // Touch-optimized link
            'inline-block',
            'min-h-[44px]',
            'flex items-center',
            'text-sm text-blue-600 hover:text-blue-800',
            'underline'
          )}
        >
          Forgot your password?
        </a>
      </div>
    </div>
  );
}
```

### 3.2 Keyboard Handling

```typescript
// src/hooks/useKeyboardAwareForm.ts

import { useEffect, useState } from 'react';

export function useKeyboardAwareForm() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    function handleResize() {
      const currentHeight = window.innerHeight;

      // Keyboard is visible if viewport shrinks significantly
      const keyboardShown = currentHeight < viewportHeight * 0.75;
      setKeyboardVisible(keyboardShown);

      if (!keyboardShown) {
        setViewportHeight(currentHeight);
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewportHeight]);

  return { keyboardVisible };
}
```

## 4. Biometric Authentication (WebAuthn)

### 4.1 WebAuthn Integration

```typescript
// src/services/auth/BiometricAuthService.ts

import { BaseService } from '../base/BaseService';
import { ServiceError, ErrorCode } from '@/types/errors';

export class BiometricAuthService extends BaseService {
  /**
   * Check if WebAuthn is available
   */
  static isAvailable(): boolean {
    return 'credentials' in navigator && 'PublicKeyCredential' in window;
  }

  /**
   * Register biometric credentials
   */
  async registerBiometric(userId: string): Promise<void> {
    if (!BiometricAuthService.isAvailable()) {
      throw new ServiceError(
        'Biometric authentication not supported on this device.',
        ErrorCode.VALIDATION_ERROR
      );
    }

    // Get challenge from Supabase
    const challenge = await this.getChallenge(userId);

    // Create credentials
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: Uint8Array.from(challenge, c => c.charCodeAt(0)),
        rp: {
          name: 'Colombia Puzzle Game',
          id: window.location.hostname,
        },
        user: {
          id: Uint8Array.from(userId, c => c.charCodeAt(0)),
          name: userId,
          displayName: userId,
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' }, // ES256
          { alg: -257, type: 'public-key' }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform', // Built-in biometrics
          userVerification: 'required',
        },
        timeout: 60000,
      },
    }) as PublicKeyCredential;

    if (!credential) {
      throw new ServiceError(
        'Failed to create biometric credentials.',
        ErrorCode.UNKNOWN_ERROR
      );
    }

    // Store credential in Supabase
    await this.storeCredential(userId, credential);
  }

  /**
   * Authenticate with biometrics
   */
  async authenticateWithBiometric(): Promise<Session> {
    if (!BiometricAuthService.isAvailable()) {
      throw new ServiceError(
        'Biometric authentication not supported.',
        ErrorCode.VALIDATION_ERROR
      );
    }

    // Get stored credentials
    const storedCredentials = await this.getStoredCredentials();

    if (storedCredentials.length === 0) {
      throw new ServiceError(
        'No biometric credentials found. Please register first.',
        ErrorCode.VALIDATION_ERROR
      );
    }

    // Get authentication challenge
    const challenge = await this.getAuthChallenge();

    // Request biometric authentication
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge: Uint8Array.from(challenge, c => c.charCodeAt(0)),
        allowCredentials: storedCredentials.map(cred => ({
          id: Uint8Array.from(atob(cred.id), c => c.charCodeAt(0)),
          type: 'public-key',
        })),
        userVerification: 'required',
        timeout: 60000,
      },
    }) as PublicKeyCredential;

    if (!credential) {
      throw new ServiceError(
        'Biometric authentication failed.',
        ErrorCode.INVALID_CREDENTIALS
      );
    }

    // Verify credential with Supabase and get session
    return this.verifyAndCreateSession(credential);
  }

  // Helper methods
  private async getChallenge(userId: string): Promise<string> {
    // Implementation: Get challenge from Supabase edge function
    const { data, error } = await this.supabase.functions.invoke(
      'webauthn-challenge',
      { body: { userId } }
    );

    if (error) throw error;
    return data.challenge;
  }

  private async storeCredential(
    userId: string,
    credential: PublicKeyCredential
  ): Promise<void> {
    // Implementation: Store in Supabase
  }

  private async getStoredCredentials(): Promise<any[]> {
    // Implementation: Get from Supabase
    return [];
  }

  private async getAuthChallenge(): Promise<string> {
    // Implementation: Get from Supabase
    return '';
  }

  private async verifyAndCreateSession(
    credential: PublicKeyCredential
  ): Promise<Session> {
    // Implementation: Verify with Supabase and create session
    throw new Error('Not implemented');
  }
}

// Export singleton instance
export const biometricAuthService = new BiometricAuthService();
```

## 5. PWA Installation & Auth

### 5.1 Post-Login Installation Prompt

```typescript
// src/components/pwa/PostLoginInstallPrompt.tsx

import { useEffect, useState } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { useAuth } from '@/hooks/useAuth';

export function PostLoginInstallPrompt() {
  const { canInstall, install } = usePWA();
  const { isAuthenticated } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Show install prompt after successful login
    if (isAuthenticated && canInstall) {
      const hasShownPostLogin = localStorage.getItem('pwa-prompt-post-login');

      if (!hasShownPostLogin) {
        // Wait 2 seconds before showing
        setTimeout(() => {
          setShowPrompt(true);
        }, 2000);
      }
    }
  }, [isAuthenticated, canInstall]);

  async function handleInstall() {
    await install();
    localStorage.setItem('pwa-prompt-post-login', 'true');
    setShowPrompt(false);
  }

  function handleDismiss() {
    localStorage.setItem('pwa-prompt-post-login', 'true');
    setShowPrompt(false);
  }

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 p-6 z-50">
      <h3 className="text-lg font-semibold mb-2">
        Install for the Best Experience
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Install Colombia Puzzle as an app for faster access, offline play, and
        a better experience.
      </p>

      <div className="flex gap-2">
        <button
          onClick={handleInstall}
          className="flex-1 min-h-[44px] bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          Install App
        </button>
        <button
          onClick={handleDismiss}
          className="flex-1 min-h-[44px] bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
        >
          Not Now
        </button>
      </div>
    </div>
  );
}
```

## 6. Security Considerations for Mobile/PWA

### 6.1 Mobile-Specific Security

```typescript
// src/lib/mobileSecurityChecks.ts

export class MobileSecurityChecks {
  /**
   * Check if app is running in a secure context
   */
  static isSecureContext(): boolean {
    return window.isSecureContext;
  }

  /**
   * Detect if running in private/incognito mode
   */
  static async isPrivateMode(): Promise<boolean> {
    try {
      // Try to use IndexedDB
      const db = await window.indexedDB.open('test');
      db.close();
      return false;
    } catch {
      return true;
    }
  }

  /**
   * Check for screen recording (Android)
   */
  static detectScreenRecording(): void {
    // Android blocks screenshots in sensitive views
    if ('getDisplayMedia' in navigator.mediaDevices) {
      // Warn user about screen recording
      console.warn('Screen recording may be active');
    }
  }

  /**
   * Prevent screenshots (iOS)
   */
  static preventScreenshots(): void {
    // iOS doesn't allow preventing screenshots programmatically
    // But we can detect when app becomes inactive
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Clear sensitive data from DOM
        clearSensitiveData();
      }
    });
  }
}

function clearSensitiveData() {
  // Clear password fields
  document.querySelectorAll('input[type="password"]').forEach(input => {
    (input as HTMLInputElement).value = '';
  });
}
```

### 6.2 Session Timeout for Mobile

```typescript
// src/hooks/useMobileSessionTimeout.ts

import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';

export function useMobileSessionTimeout(timeoutMinutes = 30) {
  const { isAuthenticated, signOut } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    if (!isAuthenticated) return;

    function resetTimeout() {
      lastActivityRef.current = Date.now();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        signOut();
      }, timeoutMinutes * 60 * 1000);
    }

    // Track user activity
    const events = ['touchstart', 'touchmove', 'click', 'scroll'];
    events.forEach(event => {
      document.addEventListener(event, resetTimeout);
    });

    // Initial timeout
    resetTimeout();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout);
      });
    };
  }, [isAuthenticated, timeoutMinutes, signOut]);
}
```

## 7. Testing on Mobile Devices

### 7.1 Mobile Testing Checklist

```markdown
## Mobile Authentication Testing

### Touch Interactions
- [ ] All touch targets are minimum 44x44px
- [ ] Buttons have visual feedback on touch
- [ ] No accidental double-taps
- [ ] Forms work with one hand
- [ ] Keyboard doesn't obscure inputs

### Authentication Flows
- [ ] Email/password login works
- [ ] Magic link opens app correctly
- [ ] OAuth redirects work in standalone mode
- [ ] Biometric authentication (if supported)
- [ ] Session persists across app restarts

### Offline Functionality
- [ ] Cached session validates offline
- [ ] Protected routes accessible offline
- [ ] Clear error when auth required
- [ ] Sync works when connection restored

### PWA Features
- [ ] Install prompt appears correctly
- [ ] Standalone mode works
- [ ] Push notifications (future)
- [ ] Background sync works

### Performance
- [ ] Login completes in < 2 seconds
- [ ] No layout shifts during loading
- [ ] Animations are smooth (60fps)
- [ ] Memory usage is acceptable

### Security
- [ ] HTTPS only
- [ ] Tokens encrypted in storage
- [ ] Session timeout works
- [ ] Logout clears all data
```

---

## Summary

This mobile/PWA authentication design provides:

1. **Touch-Optimized UX**: 44px touch targets, keyboard-aware forms
2. **Offline Capability**: Cached session validation, service worker integration
3. **Progressive Enhancement**: Biometric auth on supported devices
4. **Security**: Encrypted storage, session timeouts, secure contexts
5. **Performance**: Fast login flows, background sync

**Implementation Priority:**
1. Email/password + magic links (MVP)
2. Offline session validation (PWA)
3. OAuth providers (enhanced)
4. Biometric authentication (future)

---

**Architecture Complete**: All design documents ready for implementation
