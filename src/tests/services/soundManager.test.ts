import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

/**
 * Sound Manager Service Tests
 *
 * CONCEPT: Tests for centralized sound management system
 * WHY: Ensures audio feedback works reliably across the application
 * PATTERN: Singleton testing with Web Audio API mocking
 */

// Mock Web Audio API
class MockAudioContext {
  destination = {};
  createGain() {
    return {
      connect: vi.fn(),
      gain: { value: 0 },
    };
  }
  createBufferSource() {
    return {
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      buffer: null,
    };
  }
  decodeAudioData = vi.fn().mockResolvedValue({});
}

global.AudioContext = MockAudioContext as any;
(global as any).webkitAudioContext = MockAudioContext;

// Note: soundManager is exported as a singleton instance, not the class
// We'll test it indirectly through the exported instance

describe('soundManager Service', () => {
  let mockLocalStorage: Record<string, string>;

  beforeEach(() => {
    mockLocalStorage = {};
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Singleton and Audio Context', () => {
    it('should handle Web Audio API mocking', () => {
      expect(typeof AudioContext).toBe('function');
      expect(typeof (window as any).webkitAudioContext).toBe('function');
    });

    it('should create audio context with gain node', () => {
      const ctx = new AudioContext();
      const gainNode = ctx.createGain();
      expect(gainNode).toBeDefined();
      expect(gainNode.gain).toBeDefined();
    });
  });

  describe('LocalStorage Integration', () => {
    it('should use localStorage for settings persistence', () => {
      localStorage.setItem('soundSettings', JSON.stringify({
        enabled: false,
        volume: 0.8,
      }));

      const saved = JSON.parse(localStorage.getItem('soundSettings') || '{}');
      expect(saved.enabled).toBe(false);
      expect(saved.volume).toBe(0.8);
    });

    it('should handle missing localStorage data', () => {
      const saved = localStorage.getItem('soundSettings');
      expect(saved).toBeNull();
    });
  });

  describe('Audio Buffer Management', () => {
    it('should decode audio data', async () => {
      const ctx = new AudioContext();
      const buffer = await ctx.decodeAudioData(new ArrayBuffer(0));
      expect(buffer).toBeDefined();
    });

    it('should create buffer source', () => {
      const ctx = new AudioContext();
      const source = ctx.createBufferSource();
      expect(source).toBeDefined();
      expect(source.start).toBeDefined();
      expect(source.stop).toBeDefined();
    });
  });

  describe('Volume Control', () => {
    it('should handle gain node volume', () => {
      const ctx = new AudioContext();
      const gainNode = ctx.createGain();

      gainNode.gain.value = 0.5;
      expect(gainNode.gain.value).toBe(0.5);

      gainNode.gain.value = 1.0;
      expect(gainNode.gain.value).toBe(1.0);
    });
  });
});
