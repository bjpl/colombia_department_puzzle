/**
 * Authentication Types
 *
 * Type definitions for authentication, user profiles, and sessions.
 * Based on Supabase Auth and architecture specifications.
 */

import type { User, Session } from '@supabase/supabase-js';

/**
 * User profile information (public data)
 */
export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Game statistics for authenticated users
 */
export interface GameStats {
  id: string;
  userId: string;
  totalGamesPlayed: number;
  gamesCompleted: number;
  bestTimeSeconds: number | null;
  averageTimeSeconds: number | null;
  departmentsMastered: string[];
  difficultyLevel: 'easy' | 'medium' | 'hard';
  createdAt: string;
  updatedAt: string;
  lastPlayedAt: string | null;
}

/**
 * Individual game session data
 */
export interface GameSession {
  id: string;
  userId: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  completionTimeSeconds: number | null;
  completed: boolean;
  hintsUsed: number;
  mistakesMade: number;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  isPwa: boolean;
  startedAt: string;
  completedAt: string | null;
}

/**
 * Achievement data
 */
export interface Achievement {
  id: string;
  userId: string;
  achievementType: string;
  unlockedAt: string;
}

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  id: string;
  userId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  bestTimeSeconds: number;
  displayName: string;
  achievedAt: string;
}

/**
 * Authentication context state
 */
export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Authentication context methods
 */
export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<Session>;
  signUp: (email: string, password: string, displayName?: string) => Promise<User>;
  signOut: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  refreshSession: () => Promise<Session>;
  updateEmail: (newEmail: string) => Promise<User>;
  updatePassword: (newPassword: string) => Promise<User>;
  requestPasswordReset: (email: string) => Promise<void>;
}
