/**
 * GameStatsService - Syncs game statistics to Supabase
 *
 * Handles syncing game sessions, progress, and statistics to Supabase backend.
 * Works in coordination with localStorage-based storage for offline capability.
 */

import { BaseService } from '../BaseService';
import type {
  GameSession,
  GameStats,
  Achievement,
  LeaderboardEntry,
} from '../../types/auth';

/**
 * Regional progress tracking (extends localStorage structure)
 */
export interface RegionalProgress {
  region: string;
  attemptCount: number;
  bestTime: number;
  bestAccuracy: number;
  stars: 0 | 1 | 2 | 3;
  unlockedAt?: string;
  lastPlayedAt?: string;
}

/**
 * Game session for syncing (maps to GameSession in auth.ts)
 */
export interface GameSessionSync {
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
 * Offline sync queue item
 */
interface SyncQueueItem {
  id: string;
  type: 'session' | 'stats' | 'progress' | 'achievement';
  data: any;
  timestamp: number;
  retryCount: number;
}

/**
 * GameStatsService - Syncs game data to Supabase
 */
export class GameStatsService extends BaseService {
  private syncQueue: SyncQueueItem[] = [];
  private readonly MAX_RETRY_COUNT = 3;
  private readonly SYNC_QUEUE_KEY = 'supabase_sync_queue';

  constructor() {
    super();
    this.loadSyncQueue();
  }

  /**
   * Sync a game session to Supabase
   */
  async syncGameSession(session: GameSessionSync): Promise<GameSession | null> {
    try {
      // Check feature flag
      if (!this.isSupabaseEnabled()) {
        this.queueForSync('session', session);
        return null;
      }

      const { data, error } = await this.supabase
        .from('game_sessions')
        .insert({
          user_id: session.userId,
          difficulty: session.difficulty,
          completion_time_seconds: session.completionTimeSeconds,
          completed: session.completed,
          hints_used: session.hintsUsed,
          mistakes_made: session.mistakesMade,
          device_type: session.deviceType,
          is_pwa: session.isPwa,
          started_at: session.startedAt,
          completed_at: session.completedAt,
        })
        .select()
        .single();

      if (error) throw error;

      // If successful, also update game_stats
      if (session.completed && session.userId) {
        await this.updateGameStats(session.userId, session);
      }

      return this.mapToGameSession(data);
    } catch (error) {
      console.error('Failed to sync game session:', error);
      this.queueForSync('session', session);
      return null;
    }
  }

  /**
   * Sync regional progress to Supabase
   */
  async syncRegionalProgress(
    userId: string,
    progress: RegionalProgress[]
  ): Promise<boolean> {
    try {
      // Check feature flag
      if (!this.isSupabaseEnabled()) {
        this.queueForSync('progress', { userId, progress });
        return false;
      }

      // Store as JSONB in game_stats or separate table
      // For now, we'll update the departments_mastered array
      const masteredDepts = progress
        .filter((p) => p.stars >= 2)
        .map((p) => p.region);

      const { error } = await this.supabase
        .from('game_stats')
        .update({
          departments_mastered: masteredDepts,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Failed to sync regional progress:', error);
      this.queueForSync('progress', { userId, progress });
      return false;
    }
  }

  /**
   * Get game history for a user
   */
  async getGameHistory(
    userId: string,
    limit: number = 10
  ): Promise<GameSession[]> {
    try {
      if (!this.isSupabaseEnabled()) {
        return [];
      }

      const { data, error } = await this.supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map(this.mapToGameSession);
    } catch (error) {
      console.error('Failed to get game history:', error);
      return [];
    }
  }

  /**
   * Get best scores for a user
   */
  async getBestScores(userId: string): Promise<{
    easy: number | null;
    medium: number | null;
    hard: number | null;
  }> {
    try {
      if (!this.isSupabaseEnabled()) {
        return { easy: null, medium: null, hard: null };
      }

      const difficulties: Array<'easy' | 'medium' | 'hard'> = [
        'easy',
        'medium',
        'hard',
      ];
      const results: any = {};

      for (const difficulty of difficulties) {
        const { data, error } = await this.supabase
          .from('game_sessions')
          .select('completion_time_seconds')
          .eq('user_id', userId)
          .eq('difficulty', difficulty)
          .eq('completed', true)
          .order('completion_time_seconds', { ascending: true })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "no rows returned"
          throw error;
        }

        results[difficulty] = data?.completion_time_seconds || null;
      }

      return results;
    } catch (error) {
      console.error('Failed to get best scores:', error);
      return { easy: null, medium: null, hard: null };
    }
  }

  /**
   * Get user's game stats
   */
  async getUserStats(userId: string): Promise<GameStats | null> {
    try {
      if (!this.isSupabaseEnabled()) {
        return null;
      }

      const { data, error } = await this.supabase
        .from('game_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // No stats yet, create initial record
        return this.initializeUserStats(userId);
      }

      if (error) throw error;

      return this.mapToGameStats(data);
    } catch (error) {
      console.error('Failed to get user stats:', error);
      return null;
    }
  }

  /**
   * Process offline sync queue
   */
  async processSyncQueue(): Promise<void> {
    if (!this.isSupabaseEnabled() || this.syncQueue.length === 0) {
      return;
    }

    console.log(`Processing ${this.syncQueue.length} queued sync items...`);

    const itemsToRetry: SyncQueueItem[] = [];

    for (const item of this.syncQueue) {
      try {
        switch (item.type) {
          case 'session':
            await this.syncGameSession(item.data);
            break;
          case 'progress':
            await this.syncRegionalProgress(
              item.data.userId,
              item.data.progress
            );
            break;
          case 'stats':
            // Handle stats sync
            break;
          case 'achievement':
            // Handle achievement sync
            break;
        }
        console.log(`Successfully synced ${item.type} item ${item.id}`);
      } catch (error) {
        console.error(`Failed to sync ${item.type} item ${item.id}:`, error);

        if (item.retryCount < this.MAX_RETRY_COUNT) {
          itemsToRetry.push({
            ...item,
            retryCount: item.retryCount + 1,
          });
        } else {
          console.warn(
            `Dropping sync item ${item.id} after ${this.MAX_RETRY_COUNT} retries`
          );
        }
      }
    }

    this.syncQueue = itemsToRetry;
    this.saveSyncQueue();
  }

  /**
   * Private helper methods
   */

  private async updateGameStats(
    userId: string,
    session: GameSessionSync
  ): Promise<void> {
    const stats = await this.getUserStats(userId);

    if (!stats) {
      await this.initializeUserStats(userId);
      return;
    }

    const totalGames = stats.totalGamesPlayed + 1;
    const completedGames = session.completed
      ? stats.gamesCompleted + 1
      : stats.gamesCompleted;

    const bestTime =
      session.completionTimeSeconds &&
      (!stats.bestTimeSeconds ||
        session.completionTimeSeconds < stats.bestTimeSeconds)
        ? session.completionTimeSeconds
        : stats.bestTimeSeconds;

    const { error } = await this.supabase
      .from('game_stats')
      .update({
        total_games_played: totalGames,
        games_completed: completedGames,
        best_time_seconds: bestTime,
        last_played_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;
  }

  private async initializeUserStats(userId: string): Promise<GameStats | null> {
    try {
      const { data, error } = await this.supabase
        .from('game_stats')
        .insert({
          user_id: userId,
          total_games_played: 0,
          games_completed: 0,
          best_time_seconds: null,
          average_time_seconds: null,
          departments_mastered: [],
          difficulty_level: 'easy',
          last_played_at: null,
        })
        .select()
        .single();

      if (error) throw error;

      return this.mapToGameStats(data);
    } catch (error) {
      console.error('Failed to initialize user stats:', error);
      return null;
    }
  }

  private queueForSync(type: SyncQueueItem['type'], data: any): void {
    const item: SyncQueueItem = {
      id: `${type}_${Date.now()}_${Math.random()}`,
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.syncQueue.push(item);
    this.saveSyncQueue();

    console.log(`Queued ${type} for offline sync:`, item.id);
  }

  private loadSyncQueue(): void {
    try {
      const stored = localStorage.getItem(this.SYNC_QUEUE_KEY);
      if (stored) {
        this.syncQueue = JSON.parse(stored);
        console.log(`Loaded ${this.syncQueue.length} items from sync queue`);
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error);
      this.syncQueue = [];
    }
  }

  private saveSyncQueue(): void {
    try {
      localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  }

  private isSupabaseEnabled(): boolean {
    return import.meta.env.VITE_ENABLE_SUPABASE_AUTH === 'true';
  }

  private mapToGameSession(data: any): GameSession {
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

  private mapToGameStats(data: any): GameStats {
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
}

// Singleton instance
export const gameStatsService = new GameStatsService();
