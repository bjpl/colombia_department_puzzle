# Authentication Architecture - Colombia Puzzle Game

**Version:** 1.0
**Author:** SecurityArchitect Agent
**Date:** 2025-10-11
**Status:** Design Complete

## Executive Summary

This document outlines a comprehensive, secure authentication architecture for integrating Supabase into the Colombia Puzzle Game. The design prioritizes security, user experience, and progressive enhancement while maintaining the game's current mobile-first, PWA-enabled architecture.

## 1. Architecture Overview

### 1.1 Core Principles

1. **Security-First**: Defense in depth with RLS, JWT validation, and XSS/CSRF protection
2. **Progressive Enhancement**: Auth features enhance but don't block core gameplay
3. **Mobile-Optimized**: Touch-friendly auth flows with PWA offline support
4. **Privacy-Preserving**: Minimal data collection, transparent usage
5. **Developer-Friendly**: Clean separation of concerns, testable components

### 1.2 Technology Stack

- **Backend**: Supabase (PostgreSQL + PostgREST + Auth)
- **Frontend**: React + TypeScript + React Router v7
- **State Management**: Zustand (existing) + React Context for auth
- **Storage**: Supabase Database + Browser localStorage (encrypted)
- **Security**: Row Level Security (RLS), JWT tokens, HTTPOnly cookies

### 1.3 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (PWA)                            │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              React Application                        │ │
│  │                                                       │ │
│  │  ┌──────────────┐    ┌──────────────┐              │ │
│  │  │   Public     │    │  Protected   │              │ │
│  │  │   Routes     │    │   Routes     │              │ │
│  │  │  (Game)      │    │ (Profile,    │              │ │
│  │  │              │    │  Stats)      │              │ │
│  │  └──────────────┘    └──────────────┘              │ │
│  │                                                       │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │         AuthProvider (Context)              │   │ │
│  │  │  - Session management                       │   │ │
│  │  │  - Token refresh                            │   │ │
│  │  │  - Auth state                               │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │                                                       │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │         SupabaseClient Service              │   │ │
│  │  │  - Auth operations                          │   │ │
│  │  │  - API calls                                │   │ │
│  │  │  - Error handling                           │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Secure Storage Layer                     │ │
│  │  - Encrypted localStorage (session backup)           │ │
│  │  - IndexedDB (offline game state)                    │ │
│  │  - Service Worker (cache + offline auth check)      │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ▼
                    HTTPS/WSS Only
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                         │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   GoTrue     │    │  PostgreSQL  │    │   PostgREST  │ │
│  │   Auth       │───▶│  + RLS       │◀───│   API        │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Row Level Security (RLS)                │  │
│  │  - User can only access own data                    │  │
│  │  - Public game state read-only                      │  │
│  │  - Admin role for leaderboards                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 2. Authentication Flows

### 2.1 Supported Authentication Methods

#### Priority 1: Email/Password (MVP)
- **Use Case**: Primary auth method for desktop and mobile
- **UX**: Simple email + password form
- **Security**: bcrypt hashing, password strength validation
- **Flow**: Sign up → Email verification → Login

#### Priority 2: Magic Links (Enhanced UX)
- **Use Case**: Passwordless login for mobile users
- **UX**: Email input → Click link in email → Auto-login
- **Security**: Time-limited, single-use tokens
- **Flow**: Request magic link → Verify email → Login

#### Priority 3: OAuth (Social Login)
- **Providers**: Google, GitHub (most requested)
- **Use Case**: Faster onboarding, reduced friction
- **UX**: "Continue with Google/GitHub" buttons
- **Flow**: OAuth redirect → Consent → Auto-create account

#### Future Consideration: Anonymous Auth
- **Use Case**: Try game without account, upgrade later
- **UX**: Transparent to user
- **Constraint**: Limited to client-side features only

### 2.2 Email/Password Authentication Flow

```
┌─────────────┐
│   User      │
└─────┬───────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  1. Sign Up Page                                │
│     - Email input (validated)                   │
│     - Password input (strength meter)           │
│     - Optional: Display name                    │
│     - Terms acceptance                          │
└─────┬───────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  2. Supabase Auth API                           │
│     POST /auth/v1/signup                        │
│     Body: { email, password, data: {...} }      │
└─────┬───────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  3. Email Verification                          │
│     - Supabase sends verification email         │
│     - User clicks link                          │
│     - Redirects to /auth/callback               │
└─────┬───────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  4. Session Creation                            │
│     - JWT access token (1 hour)                 │
│     - JWT refresh token (30 days)               │
│     - Stored in memory + localStorage backup    │
└─────┬───────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  5. Login Flow                                  │
│     POST /auth/v1/token?grant_type=password     │
│     Body: { email, password }                   │
│     Response: { access_token, refresh_token }   │
└─────┬───────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  6. AuthContext State Update                    │
│     - user: UserProfile                         │
│     - session: Session                          │
│     - isAuthenticated: true                     │
└─────────────────────────────────────────────────┘
```

### 2.3 Magic Link Flow

```
┌─────────────┐
│   User      │
└─────┬───────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  1. Magic Link Request Page                     │
│     - Email input only                          │
│     - "Send me a login link" button             │
└─────┬───────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  2. Supabase Auth API                           │
│     POST /auth/v1/magiclink                     │
│     Body: { email }                             │
└─────┬───────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  3. Email Delivery                              │
│     - Time-limited link (15 min)                │
│     - Single-use token                          │
│     - Device fingerprint binding (optional)     │
└─────┬───────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  4. User Clicks Link                            │
│     - Redirects to /auth/callback?token=...     │
│     - Token validated by Supabase               │
└─────┬───────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  5. Session Creation                            │
│     - JWT tokens issued                         │
│     - User logged in automatically              │
│     - Redirect to game or profile               │
└─────────────────────────────────────────────────┘
```

### 2.4 OAuth Flow (Google Example)

```
┌─────────────┐
│   User      │
└─────┬───────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  1. Login Page                                  │
│     - "Continue with Google" button             │
└─────┬───────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  2. Supabase Redirect                           │
│     GET /auth/v1/authorize?provider=google      │
│     Redirects to Google OAuth consent           │
└─────┬───────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  3. Google OAuth Consent                        │
│     - User approves access                      │
│     - Google redirects back to Supabase         │
└─────┬───────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  4. Supabase Callback                           │
│     - Validates OAuth token                     │
│     - Creates/updates user in database          │
│     - Issues JWT tokens                         │
└─────┬───────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  5. App Redirect                                │
│     /auth/callback?access_token=...             │
│     - Parse tokens from URL hash                │
│     - Store session                             │
│     - Redirect to game                          │
└─────────────────────────────────────────────────┘
```

## 3. Session Management

### 3.1 Token Strategy

#### Access Token (JWT)
- **Lifetime**: 1 hour
- **Storage**: Memory (React state) + encrypted localStorage backup
- **Purpose**: API authentication
- **Claims**:
  ```json
  {
    "sub": "user-uuid",
    "email": "user@example.com",
    "role": "authenticated",
    "iat": 1699564800,
    "exp": 1699568400
  }
  ```

#### Refresh Token (JWT)
- **Lifetime**: 30 days
- **Storage**: Encrypted localStorage ONLY
- **Purpose**: Renewing access tokens
- **Auto-refresh**: When access token expires
- **Security**: HTTPOnly cookie option (if backend proxy used)

### 3.2 Token Storage Architecture

```typescript
// Memory (Primary)
AuthContext.state = {
  session: {
    access_token: string,
    refresh_token: string,
    expires_at: number,
  },
  user: UserProfile,
}

// Encrypted localStorage (Backup/Persistence)
localStorage.setItem('supabase.auth.token', encrypt({
  access_token: string,
  refresh_token: string,
  expires_at: number,
}))

// Service Worker (Offline Check)
self.clients.matchAll().then(clients => {
  // Check if valid session exists before serving cached pages
  const hasValidSession = checkSessionValidity();
  if (!hasValidSession && isProtectedRoute) {
    return Response.redirect('/login');
  }
})
```

### 3.3 Token Refresh Flow

```
┌─────────────────────────────────────────────────┐
│  1. API Request with Expired Access Token       │
│     Authorization: Bearer <expired-token>       │
└─────┬───────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  2. Supabase Returns 401 Unauthorized           │
│     Error: "JWT expired"                        │
└─────┬───────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  3. SupabaseClient Auto-Refresh                 │
│     POST /auth/v1/token?grant_type=refresh      │
│     Body: { refresh_token }                     │
└─────┬───────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  4. New Tokens Issued                           │
│     - New access_token (1 hour)                 │
│     - New refresh_token (30 days)               │
│     - Update localStorage                       │
└─────┬───────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────┐
│  5. Retry Original Request                      │
│     Authorization: Bearer <new-token>           │
│     - Request succeeds                          │
└─────────────────────────────────────────────────┘
```

### 3.4 Session Persistence Strategy

| Scenario | Behavior |
|----------|----------|
| **Page Reload** | Restore session from encrypted localStorage |
| **Browser Close** | Keep session (30-day refresh token) |
| **Explicit Logout** | Clear all storage, revoke tokens |
| **Token Expiry** | Auto-refresh if refresh token valid |
| **Refresh Token Expiry** | Redirect to login, show "Session expired" |
| **PWA Offline** | Verify cached session, allow gameplay |
| **PWA Online** | Sync session state with Supabase |

## 4. Route Protection Strategy

### 4.1 Route Categories

```typescript
// Public Routes (No Auth Required)
const PUBLIC_ROUTES = [
  '/',              // Main game
  '/about',         // About page
  '/how-to-play',   // Instructions
  '/login',         // Login page
  '/signup',        // Signup page
  '/auth/callback', // OAuth callback
];

// Protected Routes (Auth Required)
const PROTECTED_ROUTES = [
  '/profile',       // User profile
  '/stats',         // Personal statistics
  '/achievements',  // Achievements page
  '/settings',      // User settings
];

// Admin Routes (Admin Role Required)
const ADMIN_ROUTES = [
  '/admin/leaderboard',  // Leaderboard management
  '/admin/users',        // User management
];
```

### 4.2 ProtectedRoute Component

```typescript
// src/components/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader } from '@/components/ui/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return <Loader message="Verifying authentication..." />;
  }

  // Not authenticated: redirect to login with return URL
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Admin route but not admin: redirect to unauthorized
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authenticated and authorized: render children
  return <>{children}</>;
}
```

### 4.3 React Router v7 Integration

```typescript
// src/App.tsx (Updated)
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthProvider } from '@/context/AuthContext';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter basename="/colombia_department_puzzle">
        <AccessibilityProvider>
          <AuthProvider> {/* New auth context */}
            <GameProvider>
              <div className="min-h-screen">
                <OfflineIndicator />
                <UpdateNotification />
                <MobileBanner />

                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<GameContainer />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />

                  {/* Protected Routes */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/stats"
                    element={
                      <ProtectedRoute>
                        <StatsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/leaderboard"
                    element={
                      <ProtectedRoute requireAdmin>
                        <LeaderboardAdmin />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 */}
                  <Route path="*" element={<GameContainer />} />
                </Routes>

                <InstallPrompt showAfterFirstGame={true} />
              </div>
            </GameProvider>
          </AuthProvider>
        </AccessibilityProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
```

## 5. User Profile & Data Structure

### 5.1 Database Schema

```sql
-- Users table (managed by Supabase Auth)
-- auth.users is the source of truth

-- User profiles table (public data)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT display_name_length CHECK (char_length(display_name) <= 50)
);

-- Game statistics table (private data)
CREATE TABLE public.game_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Performance metrics
  total_games_played INTEGER DEFAULT 0,
  games_completed INTEGER DEFAULT 0,
  best_time_seconds INTEGER,
  average_time_seconds FLOAT,

  -- Learning progress
  departments_mastered TEXT[] DEFAULT '{}',
  difficulty_level TEXT DEFAULT 'easy',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_played_at TIMESTAMPTZ,

  -- Constraints
  UNIQUE(user_id),
  CONSTRAINT valid_difficulty CHECK (difficulty_level IN ('easy', 'medium', 'hard'))
);

-- Game sessions table (historical data)
CREATE TABLE public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Session data
  difficulty TEXT NOT NULL,
  completion_time_seconds INTEGER,
  completed BOOLEAN DEFAULT false,
  hints_used INTEGER DEFAULT 0,
  mistakes_made INTEGER DEFAULT 0,

  -- Device info (for analytics)
  device_type TEXT, -- 'desktop', 'mobile', 'tablet'
  is_pwa BOOLEAN DEFAULT false,

  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT valid_session_difficulty CHECK (difficulty IN ('easy', 'medium', 'hard'))
);

-- Achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id, achievement_type)
);

-- Leaderboard table (public data)
CREATE TABLE public.leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  difficulty TEXT NOT NULL,
  best_time_seconds INTEGER NOT NULL,
  display_name TEXT NOT NULL,
  achieved_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id, difficulty),
  CONSTRAINT valid_leaderboard_difficulty CHECK (difficulty IN ('easy', 'medium', 'hard'))
);

-- Indexes for performance
CREATE INDEX idx_game_stats_user_id ON public.game_stats(user_id);
CREATE INDEX idx_game_sessions_user_id ON public.game_sessions(user_id);
CREATE INDEX idx_game_sessions_completed_at ON public.game_sessions(completed_at DESC);
CREATE INDEX idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX idx_leaderboard_difficulty_time ON public.leaderboard(difficulty, best_time_seconds ASC);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_stats_updated_at
  BEFORE UPDATE ON public.game_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5.2 TypeScript Types

```typescript
// src/types/auth.ts

export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

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

export interface GameSession {
  id: string;
  userId: string | null; // Null for anonymous sessions
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

export interface Achievement {
  id: string;
  userId: string;
  achievementType: string;
  unlockedAt: string;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  bestTimeSeconds: number;
  displayName: string;
  achievedAt: string;
}
```

## Next Steps

This document establishes the foundational authentication architecture. The following documents will detail:

1. **Security Policies & RLS** - Row Level Security implementation
2. **API Layer Design** - Service architecture and error handling
3. **Mobile/PWA Authentication** - Offline auth and PWA-specific features
4. **Implementation Guide** - Step-by-step integration plan

---

**Security Review Required**: This architecture must be reviewed by the security team before implementation.
