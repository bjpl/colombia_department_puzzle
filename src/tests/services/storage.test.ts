import { describe, test, expect, beforeEach } from 'vitest';
import { storage } from '../../services/storage';
import type { GameSession } from '../../services/storage';

describe('StorageService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('User Profiles', () => {
    test('should create a new profile with default stats', () => {
      const profile = storage.createNewProfile('Test User');

      expect(profile.name).toBe('Test User');
      expect(profile.id).toMatch(/^profile_\d+_\d+$/);
      expect(profile.stats.gamesPlayed).toBe(0);
      expect(profile.stats.bestTime).toBe(Number.MAX_SAFE_INTEGER);
      expect(profile.stats.highScore).toBe(0);
      expect(profile.stats.perfectGames).toBe(0);
    });

    test('should save and retrieve profiles', () => {
      const profile = storage.createNewProfile('Player 1');
      const profiles = storage.getProfiles();

      expect(profiles).toHaveLength(1);
      expect(profiles[0]).toEqual(profile);
    });

    test('should update existing profile', () => {
      const profile = storage.createNewProfile('Player 1');
      profile.stats.gamesPlayed = 5;

      storage.saveProfile(profile);
      const profiles = storage.getProfiles();

      expect(profiles).toHaveLength(1);
      expect(profiles[0].stats.gamesPlayed).toBe(5);
    });

    test('should set and get active profile', () => {
      const profile1 = storage.createNewProfile('Player 1');
      const profile2 = storage.createNewProfile('Player 2');

      storage.setActiveProfile(profile1.id);
      let active = storage.getActiveProfile();
      expect(active?.id).toBe(profile1.id);

      storage.setActiveProfile(profile2.id);
      active = storage.getActiveProfile();
      expect(active?.id).toBe(profile2.id);
    });

    test('should return null for active profile when none set', () => {
      const active = storage.getActiveProfile();
      expect(active).toBeNull();
    });

    test('should handle multiple profiles', () => {
      storage.createNewProfile('Player 1');
      storage.createNewProfile('Player 2');
      storage.createNewProfile('Player 3');

      const profiles = storage.getProfiles();
      expect(profiles).toHaveLength(3);
    });
  });

  describe('Game Sessions', () => {
    test('should save game session', () => {
      const profile = storage.createNewProfile('Test Player');
      const session: GameSession = {
        profileId: profile.id,
        startTime: Date.now(),
        endTime: Date.now() + 60000,
        score: 1000,
        placedDepartments: ['antioquia', 'cundinamarca'],
        hintsUsed: 0,
        mistakes: 0,
      };

      storage.saveSession(session);
      const sessions = storage.getSessions();

      expect(sessions).toHaveLength(1);
      expect(sessions[0]).toEqual(session);
    });

    test('should update profile stats after saving session', () => {
      const profile = storage.createNewProfile('Test Player');
      const session: GameSession = {
        profileId: profile.id,
        startTime: Date.now(),
        endTime: Date.now() + 60000,
        score: 1000,
        placedDepartments: ['antioquia'],
        hintsUsed: 0,
        mistakes: 0,
      };

      storage.saveSession(session);
      const updatedProfile = storage.getActiveProfile();

      expect(updatedProfile?.stats.gamesPlayed).toBe(1);
      expect(updatedProfile?.stats.highScore).toBe(1000);
      expect(updatedProfile?.stats.totalScore).toBe(1000);
    });

    test('should track perfect games (no mistakes)', () => {
      const profile = storage.createNewProfile('Test Player');
      const perfectSession: GameSession = {
        profileId: profile.id,
        startTime: Date.now(),
        endTime: Date.now() + 60000,
        score: 1000,
        placedDepartments: ['antioquia'],
        hintsUsed: 0,
        mistakes: 0,
      };

      storage.saveSession(perfectSession);
      const updatedProfile = storage.getActiveProfile();

      expect(updatedProfile?.stats.perfectGames).toBe(1);
    });

    test('should not count games with mistakes as perfect', () => {
      const profile = storage.createNewProfile('Test Player');
      const imperfectSession: GameSession = {
        profileId: profile.id,
        startTime: Date.now(),
        endTime: Date.now() + 60000,
        score: 800,
        placedDepartments: ['antioquia'],
        hintsUsed: 0,
        mistakes: 2,
      };

      storage.saveSession(imperfectSession);
      const updatedProfile = storage.getActiveProfile();

      expect(updatedProfile?.stats.perfectGames).toBe(0);
    });

    test('should update best time', () => {
      const profile = storage.createNewProfile('Test Player');
      const now = Date.now();

      const session1: GameSession = {
        profileId: profile.id,
        startTime: now,
        endTime: now + 120000, // 2 minutes
        score: 1000,
        placedDepartments: [],
        hintsUsed: 0,
        mistakes: 0,
      };

      storage.saveSession(session1);
      let updatedProfile = storage.getActiveProfile();
      expect(updatedProfile?.stats.bestTime).toBe(120000);

      const session2: GameSession = {
        profileId: profile.id,
        startTime: now,
        endTime: now + 60000, // 1 minute (better)
        score: 1000,
        placedDepartments: [],
        hintsUsed: 0,
        mistakes: 0,
      };

      storage.saveSession(session2);
      updatedProfile = storage.getActiveProfile();
      expect(updatedProfile?.stats.bestTime).toBe(60000);
    });

    test('should keep only last 100 sessions', () => {
      const profile = storage.createNewProfile('Test Player');

      // Create 105 sessions
      for (let i = 0; i < 105; i++) {
        const session: GameSession = {
          profileId: profile.id,
          startTime: Date.now(),
          score: i,
          placedDepartments: [],
          hintsUsed: 0,
          mistakes: 0,
        };
        storage.saveSession(session);
      }

      const sessions = storage.getSessions();
      expect(sessions).toHaveLength(100);
      // Should keep the most recent sessions (score 5-104)
      expect(sessions[0].score).toBe(5);
    });

    test('should filter sessions by profile ID', () => {
      const profile1 = storage.createNewProfile('Player 1');
      const profile2 = storage.createNewProfile('Player 2');

      const session1: GameSession = {
        profileId: profile1.id,
        startTime: Date.now(),
        score: 100,
        placedDepartments: [],
        hintsUsed: 0,
        mistakes: 0,
      };

      const session2: GameSession = {
        profileId: profile2.id,
        startTime: Date.now(),
        score: 200,
        placedDepartments: [],
        hintsUsed: 0,
        mistakes: 0,
      };

      storage.setActiveProfile(profile1.id);
      storage.saveSession(session1);
      storage.setActiveProfile(profile2.id);
      storage.saveSession(session2);

      const profile1Sessions = storage.getSessions(profile1.id);
      expect(profile1Sessions).toHaveLength(1);
      expect(profile1Sessions[0].score).toBe(100);
    });
  });

  describe('Settings', () => {
    test('should return default settings when none saved', () => {
      const settings = storage.getSettings();

      expect(settings.soundEnabled).toBe(true);
      expect(settings.musicEnabled).toBe(true);
      expect(settings.animations).toBe(true);
      expect(settings.difficulty).toBe('normal');
      expect(settings.language).toBe('es');
    });

    test('should save and retrieve individual settings', () => {
      storage.saveSetting('soundEnabled', false);
      storage.saveSetting('difficulty', 'hard');

      const settings = storage.getSettings();
      expect(settings.soundEnabled).toBe(false);
      expect(settings.difficulty).toBe('hard');
      expect(settings.musicEnabled).toBe(true); // Should retain default
    });

    test('should update existing settings', () => {
      storage.saveSetting('language', 'en');
      let settings = storage.getSettings();
      expect(settings.language).toBe('en');

      storage.saveSetting('language', 'fr');
      settings = storage.getSettings();
      expect(settings.language).toBe('fr');
    });
  });

  describe('Clear All Data', () => {
    test('should clear all data from localStorage', () => {
      // Create some data
      storage.createNewProfile('Test Player');
      storage.saveSetting('soundEnabled', false);

      // Verify data exists
      expect(storage.getProfiles()).toHaveLength(1);

      // Clear all
      storage.clearAllData();

      // Verify all data is cleared
      expect(storage.getProfiles()).toHaveLength(0);
      expect(storage.getActiveProfile()).toBeNull();
      expect(storage.getSessions()).toHaveLength(0);

      const settings = storage.getSettings();
      expect(settings.soundEnabled).toBe(true); // Should be defaults
    });
  });
});
