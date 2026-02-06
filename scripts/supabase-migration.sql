-- ============================================
-- Colombia Puzzle Game - Supabase Migration
-- ============================================
-- Run this SQL in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
--
-- This creates the database schema for user profiles,
-- game statistics, and row-level security policies.
-- ============================================

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
-- Stores public user profile data linked to auth.users

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read any profile (for leaderboards)
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Profiles: Users can update only their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Profiles: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);


-- ============================================
-- 2. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
-- Trigger function to create a profile when a new user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================
-- 3. GAME STATS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.game_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_games_played INTEGER DEFAULT 0,
  games_completed INTEGER DEFAULT 0,
  best_time_seconds INTEGER,
  average_time_seconds INTEGER,
  departments_mastered TEXT[] DEFAULT '{}',
  difficulty_level TEXT DEFAULT 'easy' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_played_at TIMESTAMPTZ,
  UNIQUE(user_id)
);

ALTER TABLE public.game_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own game stats"
  ON public.game_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game stats"
  ON public.game_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own game stats"
  ON public.game_stats FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ============================================
-- 4. GAME SESSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  difficulty TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  completion_time_seconds INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  hints_used INTEGER DEFAULT 0,
  mistakes_made INTEGER DEFAULT 0,
  device_type TEXT DEFAULT 'desktop' CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  is_pwa BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own game sessions"
  ON public.game_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game sessions"
  ON public.game_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- ============================================
-- 5. ACHIEVEMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_type TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, achievement_type)
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON public.achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON public.achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- ============================================
-- 6. LEADERBOARD VIEW
-- ============================================

CREATE OR REPLACE VIEW public.leaderboard AS
SELECT
  gs.user_id,
  p.display_name,
  p.avatar_url,
  gs.difficulty_level AS difficulty,
  gs.best_time_seconds,
  gs.updated_at AS achieved_at
FROM public.game_stats gs
JOIN public.profiles p ON gs.user_id = p.id
WHERE gs.best_time_seconds IS NOT NULL
ORDER BY gs.best_time_seconds ASC;


-- ============================================
-- 7. UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS game_stats_updated_at ON public.game_stats;
CREATE TRIGGER game_stats_updated_at
  BEFORE UPDATE ON public.game_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- ============================================
-- 8. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_game_stats_user_id ON public.game_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON public.game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_game_stats_best_time ON public.game_stats(best_time_seconds) WHERE best_time_seconds IS NOT NULL;


-- ============================================
-- DONE
-- ============================================
-- After running this migration, configure OAuth providers
-- in the Supabase Dashboard:
--
-- 1. Go to Authentication > Providers
-- 2. Enable Google OAuth (requires Google Cloud Console setup)
-- 3. Enable Email authentication (enabled by default)
-- 4. Configure Site URL and Redirect URLs
--
-- See the setup instructions output by the application
-- for detailed Google Cloud Console configuration steps.
