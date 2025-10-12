# API Layer Design & Service Architecture

**Version:** 1.0
**Author:** SecurityArchitect Agent
**Date:** 2025-10-11
**Status:** Design Complete

## 1. Service Layer Architecture

### 1.1 Architecture Overview

The API layer follows a clean architecture pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                  React Components                       │
│         (GameContainer, ProfilePage, etc.)              │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  Custom Hooks                           │
│     (useAuth, useGameStats, useLeaderboard)            │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  Service Layer                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │   Auth     │  │  GameStats │  │ Leaderboard│       │
│  │  Service   │  │  Service   │  │  Service   │       │
│  └────────────┘  └────────────┘  └────────────┘       │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Supabase Client Wrapper                    │
│         (Error handling, retry logic, logging)          │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  Supabase Client                        │
│            (@supabase/supabase-js)                      │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  Supabase Backend                       │
│         (PostgreSQL, Auth, PostgREST, RLS)             │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Design Principles

1. **Single Responsibility**: Each service handles one domain
2. **Dependency Inversion**: Services depend on abstractions (interfaces)
3. **Error Handling**: Consistent error handling across all services
4. **Type Safety**: Full TypeScript support with strict typing
5. **Testability**: Services are easily mockable for testing
6. **Caching**: Smart caching to reduce API calls
7. **Offline Support**: Graceful degradation when offline

## 2. Service Layer Implementation

### 2.1 Base Service Class

```typescript
// src/services/base/BaseService.ts

import { supabase } from '@/lib/supabase';
import { ServiceError, ErrorCode } from '@/types/errors';
import { retryWithBackoff } from '@/lib/retry';

export abstract class BaseService {
  protected supabase = supabase;

  /**
   * Execute operation with error handling and retry logic
   */
  protected async executeWithRetry<T>(
    operation: () => Promise<T>,
    retries = 3
  ): Promise<T> {
    try {
      return await retryWithBackoff(operation, retries);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle and transform errors
   */
  protected handleError(error: unknown): ServiceError {
    if (error instanceof ServiceError) {
      return error;
    }

    // Supabase error
    if (error && typeof error === 'object' && 'code' in error) {
      return this.transformSupabaseError(error);
    }

    // Network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return new ServiceError(
        'Network error. Please check your connection.',
        ErrorCode.NETWORK_ERROR
      );
    }

    // Unknown error
    return new ServiceError(
      'An unexpected error occurred.',
      ErrorCode.UNKNOWN_ERROR,
      error
    );
  }

  /**
   * Transform Supabase errors to ServiceErrors
   */
  private transformSupabaseError(error: any): ServiceError {
    const { code, message } = error;

    switch (code) {
      case '23505': // Unique violation
        return new ServiceError(
          'This record already exists.',
          ErrorCode.DUPLICATE_ENTRY,
          error
        );
      case '23503': // Foreign key violation
        return new ServiceError(
          'Referenced record does not exist.',
          ErrorCode.INVALID_REFERENCE,
          error
        );
      case 'PGRST301': // JWT expired
        return new ServiceError(
          'Your session has expired. Please log in again.',
          ErrorCode.SESSION_EXPIRED,
          error
        );
      case '42501': // Insufficient privilege (RLS)
        return new ServiceError(
          'You do not have permission to perform this action.',
          ErrorCode.UNAUTHORIZED,
          error
        );
      default:
        return new ServiceError(
          message || 'Database operation failed.',
          ErrorCode.DATABASE_ERROR,
          error
        );
    }
  }

  /**
   * Check if user is authenticated
   */
  protected async requireAuth(): Promise<string> {
    const { data: { user } } = await this.supabase.auth.getUser();

    if (!user) {
      throw new ServiceError(
        'Authentication required.',
        ErrorCode.UNAUTHENTICATED
      );
    }

    return user.id;
  }
}
```

### 2.2 Error Handling Types

```typescript
// src/types/errors.ts

export enum ErrorCode {
  // Authentication errors
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',

  // Database errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  INVALID_REFERENCE = 'INVALID_REFERENCE',
  NOT_FOUND = 'NOT_FOUND',

  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',

  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class ServiceError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ServiceError';
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    switch (this.code) {
      case ErrorCode.UNAUTHENTICATED:
        return 'Please log in to continue.';
      case ErrorCode.UNAUTHORIZED:
        return 'You do not have permission to perform this action.';
      case ErrorCode.SESSION_EXPIRED:
        return 'Your session has expired. Please log in again.';
      case ErrorCode.NETWORK_ERROR:
        return 'Network error. Please check your internet connection.';
      case ErrorCode.RATE_LIMIT_EXCEEDED:
        return 'Too many requests. Please try again later.';
      default:
        return this.message;
    }
  }
}
```

### 2.3 Authentication Service

```typescript
// src/services/auth/AuthService.ts

import { BaseService } from '../base/BaseService';
import { ServiceError, ErrorCode } from '@/types/errors';
import type { User, Session } from '@supabase/supabase-js';
import { loginRateLimiter, signupRateLimiter } from '@/lib/rateLimiter';
import { SecurityLogger, SecurityEventType } from '@/lib/securityLogger';

export class AuthService extends BaseService {
  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, displayName?: string): Promise<User> {
    // Check rate limit
    if (!signupRateLimiter.isAllowed(email)) {
      throw new ServiceError(
        'Too many signup attempts. Please try again later.',
        ErrorCode.RATE_LIMIT_EXCEEDED
      );
    }

    return this.executeWithRetry(async () => {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      if (!data.user) {
        throw new ServiceError('Signup failed', ErrorCode.UNKNOWN_ERROR);
      }

      // Log security event
      await SecurityLogger.logEvent({
        type: SecurityEventType.SIGNUP_SUCCESS,
        userId: data.user.id,
      });

      return data.user;
    });
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<Session> {
    // Check rate limit
    if (!loginRateLimiter.isAllowed(email)) {
      throw new ServiceError(
        'Too many login attempts. Please try again later.',
        ErrorCode.RATE_LIMIT_EXCEEDED
      );
    }

    return this.executeWithRetry(async () => {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Log failed login
        await SecurityLogger.logEvent({
          type: SecurityEventType.LOGIN_FAILURE,
          metadata: { email, reason: error.message },
        });

        throw new ServiceError(
          'Invalid email or password.',
          ErrorCode.INVALID_CREDENTIALS,
          error
        );
      }

      if (!data.session) {
        throw new ServiceError('Login failed', ErrorCode.UNKNOWN_ERROR);
      }

      // Log successful login
      await SecurityLogger.logEvent({
        type: SecurityEventType.LOGIN_SUCCESS,
        userId: data.user.id,
      });

      // Reset rate limiter on successful login
      loginRateLimiter.reset(email);

      return data.session;
    });
  }

  /**
   * Sign in with magic link
   */
  async signInWithMagicLink(email: string): Promise<void> {
    // Check rate limit
    if (!loginRateLimiter.isAllowed(email)) {
      throw new ServiceError(
        'Too many magic link requests. Please try again later.',
        ErrorCode.RATE_LIMIT_EXCEEDED
      );
    }

    return this.executeWithRetry(async () => {
      const { error } = await this.supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    });
  }

  /**
   * Sign in with OAuth provider
   */
  async signInWithOAuth(provider: 'google' | 'github'): Promise<void> {
    return this.executeWithRetry(async () => {
      const { error } = await this.supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    });
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    const userId = await this.getCurrentUserId();

    return this.executeWithRetry(async () => {
      const { error } = await this.supabase.auth.signOut();

      if (error) throw error;

      // Log logout
      await SecurityLogger.logEvent({
        type: SecurityEventType.LOGOUT,
        userId,
      });
    });
  }

  /**
   * Get current session
   */
  async getSession(): Promise<Session | null> {
    const { data: { session } } = await this.supabase.auth.getSession();
    return session;
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  /**
   * Get current user ID (throws if not authenticated)
   */
  async getCurrentUserId(): Promise<string> {
    return this.requireAuth();
  }

  /**
   * Refresh session
   */
  async refreshSession(): Promise<Session> {
    return this.executeWithRetry(async () => {
      const { data, error } = await this.supabase.auth.refreshSession();

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
      const { data, error } = await this.supabase.auth.updateUser({
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
      const { data, error } = await this.supabase.auth.updateUser({
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
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
    });
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<Session> {
    return this.executeWithRetry(async () => {
      const { data, error } = await this.supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup',
      });

      if (error) throw error;
      if (!data.session) {
        throw new ServiceError('Email verification failed', ErrorCode.UNKNOWN_ERROR);
      }

      return data.session;
    });
  }
}

// Export singleton instance
export const authService = new AuthService();
```

### 2.4 Game Statistics Service

```typescript
// src/services/game/GameStatsService.ts

import { BaseService } from '../base/BaseService';
import { ServiceError, ErrorCode } from '@/types/errors';
import type { GameStats, GameSession } from '@/types/auth';

export class GameStatsService extends BaseService {
  /**
   * Get user's game statistics
   */
  async getUserStats(): Promise<GameStats | null> {
    const userId = await this.requireAuth();

    return this.executeWithRetry(async () => {
      const { data, error } = await this.supabase
        .from('game_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // Not found is ok (first time user)
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return this.transformGameStats(data);
    });
  }

  /**
   * Initialize stats for new user
   */
  async initializeStats(): Promise<GameStats> {
    const userId = await this.requireAuth();

    return this.executeWithRetry(async () => {
      const { data, error } = await this.supabase
        .from('game_stats')
        .insert({
          user_id: userId,
          total_games_played: 0,
          games_completed: 0,
          departments_mastered: [],
          difficulty_level: 'easy',
        })
        .select()
        .single();

      if (error) throw error;

      return this.transformGameStats(data);
    });
  }

  /**
   * Update game statistics
   */
  async updateStats(updates: Partial<GameStats>): Promise<GameStats> {
    const userId = await this.requireAuth();

    return this.executeWithRetry(async () => {
      const { data, error } = await this.supabase
        .from('game_stats')
        .update(this.transformToDatabase(updates))
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return this.transformGameStats(data);
    });
  }

  /**
   * Record a game session
   */
  async recordSession(session: Omit<GameSession, 'id' | 'userId' | 'startedAt'>): Promise<GameSession> {
    const userId = await this.requireAuth();

    return this.executeWithRetry(async () => {
      const { data, error } = await this.supabase
        .from('game_sessions')
        .insert({
          user_id: userId,
          ...this.transformToDatabase(session),
        })
        .select()
        .single();

      if (error) throw error;

      return this.transformGameSession(data);
    });
  }

  /**
   * Get user's game history
   */
  async getGameHistory(limit = 50): Promise<GameSession[]> {
    const userId = await this.requireAuth();

    return this.executeWithRetry(async () => {
      const { data, error } = await this.supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map(this.transformGameSession);
    });
  }

  // Transform database snake_case to TypeScript camelCase
  private transformGameStats(data: any): GameStats {
    return {
      id: data.id,
      userId: data.user_id,
      totalGamesPlayed: data.total_games_played,
      gamesCompleted: data.games_completed,
      bestTimeSeconds: data.best_time_seconds,
      averageTimeSeconds: data.average_time_seconds,
      departmentsMastered: data.departments_mastered,
      difficultyLevel: data.difficulty_level,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      lastPlayedAt: data.last_played_at,
    };
  }

  private transformGameSession(data: any): GameSession {
    return {
      id: data.id,
      userId: data.user_id,
      difficulty: data.difficulty,
      completionTimeSeconds: data.completion_time_seconds,
      completed: data.completed,
      hintsUsed: data.hints_used,
      mistakesMade: data.mistakes_made,
      deviceType: data.device_type,
      isPwa: data.is_pwa,
      startedAt: data.started_at,
      completedAt: data.completed_at,
    };
  }

  private transformToDatabase(obj: any): any {
    const result: any = {};

    for (const [key, value] of Object.entries(obj)) {
      // Convert camelCase to snake_case
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      result[snakeKey] = value;
    }

    return result;
  }
}

// Export singleton instance
export const gameStatsService = new GameStatsService();
```

### 2.5 Retry Logic

```typescript
// src/lib/retry.ts

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
}

/**
 * Retry operation with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  options: RetryOptions = {}
): Promise<T> {
  const {
    baseDelay = 1000,
    maxDelay = 10000,
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on certain errors
      if (shouldNotRetry(error)) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt),
        maxDelay
      );

      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 0.3 * delay;

      await sleep(delay + jitter);
    }
  }

  throw lastError!;
}

function shouldNotRetry(error: unknown): boolean {
  if (error && typeof error === 'object') {
    const errorObj = error as any;

    // Don't retry authentication errors
    if (errorObj.code === 'PGRST301' || errorObj.code === '401') {
      return true;
    }

    // Don't retry validation errors
    if (errorObj.code === '23505' || errorObj.code === '23503') {
      return true;
    }

    // Don't retry rate limiting
    if (errorObj.status === 429) {
      return true;
    }
  }

  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

## 3. Custom Hooks

### 3.1 useAuth Hook

```typescript
// src/hooks/useAuth.ts

import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { authService } from '@/services/auth/AuthService';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return {
    // State
    user: context.user,
    session: context.session,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,

    // Actions
    signIn: authService.signIn.bind(authService),
    signUp: authService.signUp.bind(authService),
    signOut: authService.signOut.bind(authService),
    signInWithMagicLink: authService.signInWithMagicLink.bind(authService),
    signInWithOAuth: authService.signInWithOAuth.bind(authService),
    refreshSession: authService.refreshSession.bind(authService),
    updateEmail: authService.updateEmail.bind(authService),
    updatePassword: authService.updatePassword.bind(authService),
    requestPasswordReset: authService.requestPasswordReset.bind(authService),
  };
}
```

### 3.2 useGameStats Hook

```typescript
// src/hooks/useGameStats.ts

import { useState, useEffect } from 'react';
import { gameStatsService } from '@/services/game/GameStatsService';
import type { GameStats } from '@/types/auth';
import { useAuth } from './useAuth';

export function useGameStats() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<GameStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setStats(null);
      setIsLoading(false);
      return;
    }

    loadStats();
  }, [isAuthenticated]);

  async function loadStats() {
    try {
      setIsLoading(true);
      setError(null);

      let userStats = await gameStatsService.getUserStats();

      // Initialize stats if not found
      if (!userStats) {
        userStats = await gameStatsService.initializeStats();
      }

      setStats(userStats);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateStats(updates: Partial<GameStats>) {
    try {
      const updated = await gameStatsService.updateStats(updates);
      setStats(updated);
      return updated;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }

  async function recordSession(session: any) {
    try {
      await gameStatsService.recordSession(session);
      await loadStats(); // Reload stats after recording session
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }

  return {
    stats,
    isLoading,
    error,
    updateStats,
    recordSession,
    refreshStats: loadStats,
  };
}
```

## 4. Caching Strategy

### 4.1 React Query Integration (Optional Enhancement)

```typescript
// src/lib/queryClient.ts

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache for 5 minutes
      staleTime: 5 * 60 * 1000,

      // Keep in cache for 10 minutes
      cacheTime: 10 * 60 * 1000,

      // Retry failed requests twice
      retry: 2,

      // Refetch on window focus
      refetchOnWindowFocus: true,

      // Refetch on reconnect
      refetchOnReconnect: true,
    },
  },
});
```

## Next Steps

This API layer design provides:

1. Type-safe service layer with error handling
2. Consistent error handling across all services
3. Retry logic for resilience
4. Rate limiting protection
5. Security event logging
6. Easy testability

**Next Document**: Mobile/PWA Authentication Considerations
