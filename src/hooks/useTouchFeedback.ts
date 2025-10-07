/**
 * Touch Feedback Hook - Manages haptic, audio, and visual feedback
 *
 * Features:
 * - Haptic vibration (if supported)
 * - Audio cues (optional)
 * - Visual ripple effects
 * - User preference management
 */

import { useState, useCallback, useEffect } from 'react';

export type FeedbackType = 'tap' | 'success' | 'error' | 'disabled';
export type FeedbackMode = 'haptics' | 'audio' | 'both' | 'none';

export interface TouchFeedbackSettings {
  mode: FeedbackMode;
  hapticsEnabled: boolean;
  audioEnabled: boolean;
}

const STORAGE_KEY = 'touch-feedback-settings';

const DEFAULT_SETTINGS: TouchFeedbackSettings = {
  mode: 'haptics',
  hapticsEnabled: true,
  audioEnabled: false,
};

/**
 * Haptic feedback patterns
 */
const HAPTIC_PATTERNS = {
  tap: 10,                    // Light tap (10ms)
  success: [20, 10, 20],      // Success pattern (vibrate-pause-vibrate)
  error: 50,                  // Error buzz (50ms)
  disabled: 0,                // No vibration
} as const;

/**
 * Check if haptics are supported
 */
function isHapticsSupported(): boolean {
  return 'vibrate' in navigator;
}

/**
 * Trigger haptic feedback
 */
function triggerHaptic(type: FeedbackType): void {
  if (!isHapticsSupported()) return;

  const pattern = HAPTIC_PATTERNS[type];
  if (pattern === 0) return;

  try {
    navigator.vibrate(pattern);
  } catch (error) {
    console.warn('Haptic feedback failed:', error);
  }
}

/**
 * Audio feedback manager
 */
class AudioFeedbackManager {
  private audioContext: AudioContext | null = null;
  private initialized = false;

  initialize() {
    if (this.initialized) return;

    try {
      // @ts-ignore - AudioContext is supported in modern browsers
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (error) {
      console.warn('Audio feedback initialization failed:', error);
    }
  }

  playSound(type: FeedbackType) {
    if (!this.audioContext) {
      this.initialize();
    }

    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Different tones for different feedback types
    const frequencies = {
      tap: 200,      // Low click
      success: 523,  // C5 (pleasant chime)
      error: 185,    // Low buzz
      disabled: 0,   // Silent
    };

    const durations = {
      tap: 0.05,
      success: 0.15,
      error: 0.2,
      disabled: 0,
    };

    oscillator.frequency.value = frequencies[type];
    gainNode.gain.value = 0.1; // Low volume

    const now = this.audioContext.currentTime;
    oscillator.start(now);
    oscillator.stop(now + durations[type]);
  }
}

const audioManager = new AudioFeedbackManager();

/**
 * Load settings from localStorage
 */
function loadSettings(): TouchFeedbackSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as TouchFeedbackSettings;
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        hapticsEnabled: parsed.mode === 'haptics' || parsed.mode === 'both',
        audioEnabled: parsed.mode === 'audio' || parsed.mode === 'both',
      };
    }
  } catch (error) {
    console.warn('Failed to load touch feedback settings:', error);
  }
  return DEFAULT_SETTINGS;
}

/**
 * Save settings to localStorage
 */
function saveSettings(settings: TouchFeedbackSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save touch feedback settings:', error);
  }
}

/**
 * Hook for managing touch feedback
 */
export function useTouchFeedback() {
  const [settings, setSettings] = useState<TouchFeedbackSettings>(loadSettings);

  // Initialize audio on first user interaction
  useEffect(() => {
    const initAudio = () => {
      audioManager.initialize();
      document.removeEventListener('touchstart', initAudio);
      document.removeEventListener('click', initAudio);
    };

    document.addEventListener('touchstart', initAudio, { once: true });
    document.addEventListener('click', initAudio, { once: true });

    return () => {
      document.removeEventListener('touchstart', initAudio);
      document.removeEventListener('click', initAudio);
    };
  }, []);

  /**
   * Trigger feedback based on type
   */
  const trigger = useCallback((type: FeedbackType) => {
    if (settings.hapticsEnabled && isHapticsSupported()) {
      triggerHaptic(type);
    }

    if (settings.audioEnabled) {
      audioManager.playSound(type);
    }
  }, [settings.hapticsEnabled, settings.audioEnabled]);

  /**
   * Update feedback mode
   */
  const setMode = useCallback((mode: FeedbackMode) => {
    const newSettings: TouchFeedbackSettings = {
      mode,
      hapticsEnabled: mode === 'haptics' || mode === 'both',
      audioEnabled: mode === 'audio' || mode === 'both',
    };
    setSettings(newSettings);
    saveSettings(newSettings);
  }, []);

  /**
   * Toggle haptics
   */
  const toggleHaptics = useCallback(() => {
    const newEnabled = !settings.hapticsEnabled;
    const newMode: FeedbackMode =
      newEnabled && settings.audioEnabled ? 'both' :
      newEnabled ? 'haptics' :
      settings.audioEnabled ? 'audio' :
      'none';

    const newSettings: TouchFeedbackSettings = {
      mode: newMode,
      hapticsEnabled: newEnabled,
      audioEnabled: settings.audioEnabled,
    };
    setSettings(newSettings);
    saveSettings(newSettings);

    // Test feedback
    if (newEnabled) {
      trigger('tap');
    }
  }, [settings, trigger]);

  /**
   * Toggle audio
   */
  const toggleAudio = useCallback(() => {
    const newEnabled = !settings.audioEnabled;
    const newMode: FeedbackMode =
      settings.hapticsEnabled && newEnabled ? 'both' :
      settings.hapticsEnabled ? 'haptics' :
      newEnabled ? 'audio' :
      'none';

    const newSettings: TouchFeedbackSettings = {
      mode: newMode,
      hapticsEnabled: settings.hapticsEnabled,
      audioEnabled: newEnabled,
    };
    setSettings(newSettings);
    saveSettings(newSettings);

    // Test feedback
    if (newEnabled) {
      audioManager.playSound('tap');
    }
  }, [settings]);

  return {
    settings,
    trigger,
    setMode,
    toggleHaptics,
    toggleAudio,
    isHapticsSupported: isHapticsSupported(),
  };
}
