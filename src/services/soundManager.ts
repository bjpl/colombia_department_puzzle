/**
 * CONCEPT: Centralized Sound Management System
 * WHY: Provides consistent audio feedback across the application
 * PATTERN: Singleton pattern with lazy loading and preloading strategies
 */

export type SoundType =
  | 'correct'
  | 'incorrect'
  | 'pickup'
  | 'drop'
  | 'win'
  | 'hint'
  | 'tick'
  | 'levelUp'
  | 'star';

interface SoundConfig {
  url: string;
  volume?: number;
  loop?: boolean;
}

class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;
  private sounds: Map<SoundType, AudioBuffer> = new Map();
  private gainNode: GainNode | null = null;
  private enabled: boolean = true;
  private masterVolume: number = 0.5;

  private constructor() {
    // Initialize from localStorage settings
    const savedSettings = localStorage.getItem('soundSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.enabled = settings.enabled ?? true;
      this.masterVolume = settings.volume ?? 0.5;
    }
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  /**
   * Initialize the Web Audio API context
   * Must be called after user interaction due to browser autoplay policies
   */
  public async init(): Promise<void> {
    if (this.audioContext) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = this.masterVolume;

      // Preload essential sounds
      await this.preloadSounds();
    } catch (error) {
      console.warn('Audio initialization failed:', error);
      this.enabled = false;
    }
  }

  /**
   * Preload sound effects as base64 data URIs
   * Using simple synthesized sounds to avoid external dependencies
   */
  private async preloadSounds(): Promise<void> {
    if (!this.audioContext) return;

    // Define simple sound configurations using Web Audio oscillators
    const soundDefinitions: Record<SoundType, () => AudioBuffer> = {
      correct: () => this.createTone(523.25, 0.2, 'sine'), // C5
      incorrect: () => this.createTone(220, 0.3, 'sawtooth'), // A3
      pickup: () => this.createTone(440, 0.1, 'triangle'), // A4
      drop: () => this.createTone(349.23, 0.1, 'sine'), // F4
      win: () => this.createChord([523.25, 659.25, 783.99], 0.5), // C major chord
      hint: () => this.createTone(880, 0.15, 'sine'), // A5
      tick: () => this.createClick(0.05),
      levelUp: () => this.createAscending([261.63, 329.63, 392, 523.25], 0.4),
      star: () => this.createTone(987.77, 0.2, 'triangle'), // B5
    };

    // Generate and store audio buffers
    for (const [type, generator] of Object.entries(soundDefinitions)) {
      try {
        const buffer = generator();
        this.sounds.set(type as SoundType, buffer);
      } catch (error) {
        console.warn(`Failed to generate sound: ${type}`, error);
      }
    }
  }

  /**
   * Create a simple tone using an oscillator
   */
  private createTone(frequency: number, duration: number, type: OscillatorType): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const channelData = buffer.getChannelData(0);

    // Generate waveform
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      let sample = 0;

      switch (type) {
        case 'sine':
          sample = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
          break;
        case 'sawtooth':
          sample = 2 * (t * frequency % 1) - 1;
          break;
        case 'triangle':
          sample = Math.abs(2 * (2 * t * frequency % 2 - 1)) - 1;
          break;
      }

      // Apply envelope for smooth fade in/out
      const envelope = Math.min(1, i / (sampleRate * 0.01), (length - i) / (sampleRate * 0.05));
      channelData[i] = sample * envelope * 0.3;
    }

    return buffer;
  }

  /**
   * Create a chord by combining multiple frequencies
   */
  private createChord(frequencies: number[], duration: number): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      let sample = 0;

      // Mix all frequencies
      for (const freq of frequencies) {
        sample += Math.sin(2 * Math.PI * freq * t) / frequencies.length;
      }

      // Apply envelope
      const envelope = Math.min(1, i / (sampleRate * 0.01), (length - i) / (sampleRate * 0.1));
      channelData[i] = sample * envelope * 0.3;
    }

    return buffer;
  }

  /**
   * Create a clicking sound
   */
  private createClick(duration: number): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      // Generate white noise
      channelData[i] = (Math.random() * 2 - 1) * 0.1;

      // Apply sharp envelope
      const envelope = Math.exp(-i / (sampleRate * 0.001));
      channelData[i] *= envelope;
    }

    return buffer;
  }

  /**
   * Create an ascending sequence of tones
   */
  private createAscending(frequencies: number[], totalDuration: number): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * totalDuration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const channelData = buffer.getChannelData(0);
    const noteDuration = totalDuration / frequencies.length;

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const noteIndex = Math.floor(t / noteDuration);

      if (noteIndex < frequencies.length) {
        const freq = frequencies[noteIndex];
        const noteTime = t - (noteIndex * noteDuration);
        const sample = Math.sin(2 * Math.PI * freq * noteTime);

        // Apply envelope for each note
        const noteProgress = noteTime / noteDuration;
        const envelope = Math.min(1, noteProgress * 10, (1 - noteProgress) * 5);
        channelData[i] = sample * envelope * 0.3;
      }
    }

    return buffer;
  }

  /**
   * Play a sound effect
   */
  public play(type: SoundType, volume: number = 1): void {
    if (!this.enabled || !this.audioContext || !this.gainNode) return;

    const buffer = this.sounds.get(type);
    if (!buffer) {
      console.warn(`Sound not loaded: ${type}`);
      return;
    }

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(this.gainNode);
      gainNode.gain.value = volume;

      source.start(0);

      // Clean up after playback
      source.onended = () => {
        source.disconnect();
        gainNode.disconnect();
      };
    } catch (error) {
      console.warn(`Failed to play sound: ${type}`, error);
    }
  }

  /**
   * Play a sequence of sounds with delays
   */
  public playSequence(sequence: Array<{ type: SoundType; delay: number; volume?: number }>): void {
    if (!this.enabled) return;

    sequence.forEach(({ type, delay, volume }) => {
      setTimeout(() => this.play(type, volume), delay);
    });
  }

  /**
   * Set master volume
   */
  public setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.gainNode) {
      this.gainNode.gain.value = this.masterVolume;
    }
    this.saveSettings();
  }

  /**
   * Toggle sound on/off
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.saveSettings();
  }

  /**
   * Get current sound settings
   */
  public getSettings(): { enabled: boolean; volume: number } {
    return {
      enabled: this.enabled,
      volume: this.masterVolume,
    };
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    localStorage.setItem('soundSettings', JSON.stringify({
      enabled: this.enabled,
      volume: this.masterVolume,
    }));
  }
}

// Export singleton instance
export const soundManager = SoundManager.getInstance();

// Helper hook for React components
export function useSoundEffect() {
  return {
    playSound: (type: SoundType, volume?: number) => soundManager.play(type, volume),
    playSequence: (sequence: Parameters<typeof soundManager.playSequence>[0]) =>
      soundManager.playSequence(sequence),
    initSound: () => soundManager.init(),
    settings: soundManager.getSettings(),
    setVolume: (volume: number) => soundManager.setVolume(volume),
    setEnabled: (enabled: boolean) => soundManager.setEnabled(enabled),
  };
}