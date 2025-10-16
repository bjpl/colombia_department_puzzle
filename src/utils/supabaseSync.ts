/**
 * Supabase Sync Utilities
 *
 * Helper functions for syncing game data to Supabase backend.
 * Handles game completion, regional progress, and offline queue management.
 */

import { storage } from '../services/storage';
import { gameStatsService, type GameSessionSync } from '../services/game/GameStatsService';
import type { GameModeConfig } from '../components/GameModeSelector';

/**
 * Sync game completion to Supabase
 *
 * Called when a game is completed to sync session data to the cloud.
 * Non-blocking: Uses queuing for offline scenarios.
 *
 * @param completion - Game completion data
 * @returns Promise that resolves when sync is queued/completed
 */
export async function syncGameCompletionToSupabase(completion: {
  score: number;
  elapsedTime: number;
  hintsUsed: number;
  mistakes: number;
  gameMode: GameModeConfig;
}): Promise<void> {
  const profile = storage.getActiveProfile();

  if (!profile?.supabaseUserId) {
    return; // Not linked to Supabase, skip sync
  }

  const session: GameSessionSync = {
    userId: profile.supabaseUserId,
    difficulty: getDifficultyFromGameMode(completion.gameMode),
    completionTimeSeconds: Math.floor(completion.elapsedTime / 1000),
    completed: true,
    hintsUsed: completion.hintsUsed,
    mistakesMade: completion.mistakes,
    deviceType: detectDeviceType(),
    isPwa: isPWA(),
    startedAt: new Date(Date.now() - completion.elapsedTime).toISOString(),
    completedAt: new Date().toISOString(),
  };

  await gameStatsService.syncGameSession(session);
}

/**
 * Map game mode to difficulty level
 *
 * @param mode - Game mode configuration
 * @returns Difficulty level (easy, medium, hard)
 */
export function getDifficultyFromGameMode(mode: GameModeConfig): 'easy' | 'medium' | 'hard' {
  if (mode.type === 'full') return 'hard';
  if (mode.type === 'region' && mode.selectedRegions) {
    // Insular = easy, 2-3 regions = medium, 4+ = hard
    const regionCount = mode.selectedRegions.length;
    if (regionCount === 1) return 'easy';
    if (regionCount <= 3) return 'medium';
    return 'hard';
  }
  return 'medium'; // Default for study mode
}

/**
 * Detect device type for analytics
 *
 * @returns Device type classification
 */
function detectDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Check if app is running as PWA
 *
 * @returns True if running as PWA
 */
function isPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}
