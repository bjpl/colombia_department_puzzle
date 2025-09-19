// LocalStorage service for game persistence

export interface UserProfile {
  id: string;
  name: string;
  createdAt: number;
  stats: PlayerStats;
}

export interface PlayerStats {
  gamesPlayed: number;
  bestTime: number;
  highScore: number;
  totalScore: number;
  perfectGames: number;
  hintsUsed: {
    region: number;
    letter: number;
    flash: number;
  };
  departmentStats: Record<string, {
    attempts: number;
    successes: number;
    avgTime: number;
  }>;
}

export interface GameSession {
  profileId: string;
  startTime: number;
  endTime?: number;
  score: number;
  placedDepartments: string[];
  hintsUsed: number;
  mistakes: number;
}

class StorageService {
  private readonly STORAGE_KEYS = {
    PROFILES: 'colombia_puzzle_profiles',
    ACTIVE_PROFILE: 'colombia_puzzle_active_profile',
    SESSIONS: 'colombia_puzzle_sessions',
    SETTINGS: 'colombia_puzzle_settings',
  };

  // User Profiles
  getProfiles(): UserProfile[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.PROFILES);
    return data ? JSON.parse(data) : [];
  }

  saveProfile(profile: UserProfile): void {
    const profiles = this.getProfiles();
    const index = profiles.findIndex(p => p.id === profile.id);

    if (index >= 0) {
      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }

    localStorage.setItem(this.STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  }

  getActiveProfile(): UserProfile | null {
    const profileId = localStorage.getItem(this.STORAGE_KEYS.ACTIVE_PROFILE);
    if (!profileId) return null;

    const profiles = this.getProfiles();
    return profiles.find(p => p.id === profileId) || null;
  }

  setActiveProfile(profileId: string): void {
    localStorage.setItem(this.STORAGE_KEYS.ACTIVE_PROFILE, profileId);
  }

  createNewProfile(name: string): UserProfile {
    const profile: UserProfile = {
      id: `profile_${Date.now()}`,
      name,
      createdAt: Date.now(),
      stats: {
        gamesPlayed: 0,
        bestTime: Infinity,
        highScore: 0,
        totalScore: 0,
        perfectGames: 0,
        hintsUsed: { region: 0, letter: 0, flash: 0 },
        departmentStats: {},
      },
    };

    this.saveProfile(profile);
    this.setActiveProfile(profile.id);
    return profile;
  }

  // Game Sessions
  saveSession(session: GameSession): void {
    const sessions = this.getSessions();
    sessions.push(session);

    // Keep only last 100 sessions
    if (sessions.length > 100) {
      sessions.shift();
    }

    localStorage.setItem(this.STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));

    // Update profile stats
    const profile = this.getActiveProfile();
    if (profile) {
      this.updateProfileStats(profile, session);
    }
  }

  getSessions(profileId?: string): GameSession[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.SESSIONS);
    const sessions = data ? JSON.parse(data) : [];

    if (profileId) {
      return sessions.filter((s: GameSession) => s.profileId === profileId);
    }

    return sessions;
  }

  private updateProfileStats(profile: UserProfile, session: GameSession): void {
    profile.stats.gamesPlayed++;
    profile.stats.totalScore += session.score;

    if (session.score > profile.stats.highScore) {
      profile.stats.highScore = session.score;
    }

    if (session.endTime && session.startTime) {
      const time = session.endTime - session.startTime;
      if (time < profile.stats.bestTime) {
        profile.stats.bestTime = time;
      }
    }

    if (session.mistakes === 0) {
      profile.stats.perfectGames++;
    }

    this.saveProfile(profile);
  }

  // Settings
  getSettings(): Record<string, any> {
    const data = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      soundEnabled: true,
      musicEnabled: true,
      animations: true,
      difficulty: 'normal',
      language: 'es',
    };
  }

  saveSetting(key: string, value: any): void {
    const settings = this.getSettings();
    settings[key] = value;
    localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // Clear all data
  clearAllData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const storage = new StorageService();