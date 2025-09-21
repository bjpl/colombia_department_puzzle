/**
 * CONCEPT: Centralized Keyboard Shortcut Management System
 * WHY: Provides consistent, configurable, and conflict-free keyboard handling
 * PATTERN: Command pattern with priority-based event handling and conflict resolution
 */

import { GameState } from '../context/GameContext';
import { SoundManager } from './soundManager';

export type KeyboardContext = 'game' | 'menu' | 'modal' | 'study' | 'global';
export type ModifierKeys = {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
};

export interface KeyboardShortcut {
  key: string;
  modifiers?: ModifierKeys;
  action: string;
  description: string;
  category: 'navigation' | 'game' | 'accessibility' | 'ui' | 'debug';
  context: KeyboardContext[];
  enabled: boolean;
  handler?: (e: KeyboardEvent, game?: any) => void;
}

export interface ShortcutGroup {
  name: string;
  icon: string;
  shortcuts: KeyboardShortcut[];
}

class KeyboardManager {
  private static instance: KeyboardManager;
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private activeContext: KeyboardContext = 'game';
  private enabled: boolean = true;
  private customBindings: Map<string, string> = new Map();
  private pressedKeys: Set<string> = new Set();
  private conflictResolution: boolean = true;

  private constructor() {
    this.initializeDefaultShortcuts();
    this.loadCustomBindings();
    this.setupEventListeners();
  }

  public static getInstance(): KeyboardManager {
    if (!KeyboardManager.instance) {
      KeyboardManager.instance = new KeyboardManager();
    }
    return KeyboardManager.instance;
  }

  /**
   * Initialize default keyboard shortcuts following gaming and accessibility standards
   */
  private initializeDefaultShortcuts(): void {
    const defaultShortcuts: KeyboardShortcut[] = [
      // Navigation
      { key: 'Tab', action: 'navigate-forward', description: 'Navigate forward', category: 'navigation', context: ['global'], enabled: true },
      { key: 'Tab', modifiers: { shift: true }, action: 'navigate-backward', description: 'Navigate backward', category: 'navigation', context: ['global'], enabled: true },
      { key: 'Enter', action: 'select', description: 'Select/Confirm', category: 'navigation', context: ['global'], enabled: true },
      { key: ' ', action: 'select-alt', description: 'Select/Activate', category: 'navigation', context: ['global'], enabled: true },
      { key: 'Escape', action: 'cancel', description: 'Cancel/Close', category: 'navigation', context: ['global'], enabled: true },

      // Game Controls
      { key: 'p', action: 'pause', description: 'Pause/Resume game', category: 'game', context: ['game', 'study'], enabled: true },
      { key: 'P', action: 'pause', description: 'Pause/Resume game', category: 'game', context: ['game', 'study'], enabled: true },
      { key: 'r', action: 'restart', description: 'Restart game', category: 'game', context: ['game'], enabled: true },
      { key: 'R', action: 'restart', description: 'Restart game', category: 'game', context: ['game'], enabled: true },
      { key: 'h', action: 'hint', description: 'Use hint', category: 'game', context: ['game', 'study'], enabled: true },
      { key: 'H', action: 'hint', description: 'Use hint', category: 'game', context: ['game', 'study'], enabled: true },
      { key: 'z', modifiers: { ctrl: true }, action: 'undo', description: 'Undo last action', category: 'game', context: ['game'], enabled: true },
      { key: 'y', modifiers: { ctrl: true }, action: 'redo', description: 'Redo action', category: 'game', context: ['game'], enabled: true },

      // Sound Controls
      { key: 'm', action: 'mute-toggle', description: 'Toggle mute', category: 'ui', context: ['global'], enabled: true },
      { key: 'M', action: 'mute-toggle', description: 'Toggle mute', category: 'ui', context: ['global'], enabled: true },
      { key: '-', action: 'volume-down', description: 'Decrease volume', category: 'ui', context: ['global'], enabled: true },
      { key: '=', action: 'volume-up', description: 'Increase volume', category: 'ui', context: ['global'], enabled: true },
      { key: '+', action: 'volume-up', description: 'Increase volume', category: 'ui', context: ['global'], enabled: true },

      // View Controls
      { key: 'f', action: 'fullscreen', description: 'Toggle fullscreen', category: 'ui', context: ['global'], enabled: true },
      { key: 'F', action: 'fullscreen', description: 'Toggle fullscreen', category: 'ui', context: ['global'], enabled: true },
      { key: '0', action: 'zoom-reset', description: 'Reset zoom', category: 'ui', context: ['game', 'study'], enabled: true },
      { key: '[', action: 'zoom-out', description: 'Zoom out', category: 'ui', context: ['game', 'study'], enabled: true },
      { key: ']', action: 'zoom-in', description: 'Zoom in', category: 'ui', context: ['game', 'study'], enabled: true },

      // Movement (Game)
      { key: 'ArrowUp', action: 'move-up', description: 'Move up', category: 'game', context: ['game'], enabled: true },
      { key: 'ArrowDown', action: 'move-down', description: 'Move down', category: 'game', context: ['game'], enabled: true },
      { key: 'ArrowLeft', action: 'move-left', description: 'Move left', category: 'game', context: ['game'], enabled: true },
      { key: 'ArrowRight', action: 'move-right', description: 'Move right', category: 'game', context: ['game'], enabled: true },
      { key: 'ArrowUp', modifiers: { shift: true }, action: 'move-up-fast', description: 'Move up fast', category: 'game', context: ['game'], enabled: true },
      { key: 'ArrowDown', modifiers: { shift: true }, action: 'move-down-fast', description: 'Move down fast', category: 'game', context: ['game'], enabled: true },
      { key: 'ArrowLeft', modifiers: { shift: true }, action: 'move-left-fast', description: 'Move left fast', category: 'game', context: ['game'], enabled: true },
      { key: 'ArrowRight', modifiers: { shift: true }, action: 'move-right-fast', description: 'Move right fast', category: 'game', context: ['game'], enabled: true },

      // Vi-like movement (alternative)
      { key: 'k', action: 'move-up-vi', description: 'Move up (Vi)', category: 'game', context: ['game'], enabled: false },
      { key: 'j', action: 'move-down-vi', description: 'Move down (Vi)', category: 'game', context: ['game'], enabled: false },
      { key: 'h', action: 'move-left-vi', description: 'Move left (Vi)', category: 'game', context: ['game'], enabled: false },
      { key: 'l', action: 'move-right-vi', description: 'Move right (Vi)', category: 'game', context: ['game'], enabled: false },

      // WASD movement (alternative)
      { key: 'w', action: 'move-up-wasd', description: 'Move up (WASD)', category: 'game', context: ['game'], enabled: false },
      { key: 's', action: 'move-down-wasd', description: 'Move down (WASD)', category: 'game', context: ['game'], enabled: false },
      { key: 'a', action: 'move-left-wasd', description: 'Move left (WASD)', category: 'game', context: ['game'], enabled: false },
      { key: 'd', action: 'move-right-wasd', description: 'Move right (WASD)', category: 'game', context: ['game'], enabled: false },

      // Region Quick Access (1-6)
      { key: '1', action: 'region-1', description: 'Focus Región Andina', category: 'game', context: ['game'], enabled: true },
      { key: '2', action: 'region-2', description: 'Focus Región Caribe', category: 'game', context: ['game'], enabled: true },
      { key: '3', action: 'region-3', description: 'Focus Región Pacífico', category: 'game', context: ['game'], enabled: true },
      { key: '4', action: 'region-4', description: 'Focus Región Orinoquía', category: 'game', context: ['game'], enabled: true },
      { key: '5', action: 'region-5', description: 'Focus Región Amazonía', category: 'game', context: ['game'], enabled: true },
      { key: '6', action: 'region-6', description: 'Focus Región Insular', category: 'game', context: ['game'], enabled: true },

      // Accessibility
      { key: 'a', modifiers: { alt: true }, action: 'accessibility-menu', description: 'Open accessibility settings', category: 'accessibility', context: ['global'], enabled: true },
      { key: 'c', modifiers: { alt: true }, action: 'colorblind-toggle', description: 'Cycle colorblind modes', category: 'accessibility', context: ['global'], enabled: true },
      { key: 'h', modifiers: { alt: true }, action: 'high-contrast', description: 'Toggle high contrast', category: 'accessibility', context: ['global'], enabled: true },
      { key: 'm', modifiers: { alt: true }, action: 'motion-reduce', description: 'Toggle reduced motion', category: 'accessibility', context: ['global'], enabled: true },
      { key: 's', modifiers: { alt: true }, action: 'screen-reader', description: 'Screen reader announcement', category: 'accessibility', context: ['global'], enabled: true },

      // Help & Info
      { key: '?', action: 'help', description: 'Show help', category: 'ui', context: ['global'], enabled: true },
      { key: '/', action: 'help-alt', description: 'Show help', category: 'ui', context: ['global'], enabled: true },
      { key: 'F1', action: 'help-f1', description: 'Show help', category: 'ui', context: ['global'], enabled: true },
      { key: 'i', action: 'info', description: 'Show game info', category: 'ui', context: ['game', 'study'], enabled: true },
      { key: 'I', action: 'info', description: 'Show game info', category: 'ui', context: ['game', 'study'], enabled: true },
      { key: 't', action: 'stats', description: 'Show statistics', category: 'ui', context: ['game'], enabled: true },
      { key: 'T', action: 'stats', description: 'Show statistics', category: 'ui', context: ['game'], enabled: true },

      // Game Mode Switching
      { key: 'g', action: 'game-mode', description: 'Change game mode', category: 'game', context: ['menu', 'game'], enabled: true },
      { key: 'G', action: 'game-mode', description: 'Change game mode', category: 'game', context: ['menu', 'game'], enabled: true },
      { key: 's', action: 'study-mode', description: 'Switch to study mode', category: 'game', context: ['menu', 'game'], enabled: true },
      { key: 'S', action: 'study-mode', description: 'Switch to study mode', category: 'game', context: ['menu', 'game'], enabled: true },

      // Debug (development only)
      { key: 'F12', action: 'debug-console', description: 'Toggle debug console', category: 'debug', context: ['global'], enabled: false },
      { key: 'd', modifiers: { ctrl: true, shift: true }, action: 'debug-info', description: 'Show debug info', category: 'debug', context: ['global'], enabled: false },
    ];

    defaultShortcuts.forEach(shortcut => {
      const key = this.generateShortcutKey(shortcut);
      this.shortcuts.set(key, shortcut);
    });
  }

  /**
   * Generate a unique key for a shortcut based on key and modifiers
   */
  private generateShortcutKey(shortcut: KeyboardShortcut): string {
    const parts = [];
    if (shortcut.modifiers?.ctrl) parts.push('Ctrl');
    if (shortcut.modifiers?.alt) parts.push('Alt');
    if (shortcut.modifiers?.shift) parts.push('Shift');
    if (shortcut.modifiers?.meta) parts.push('Meta');
    parts.push(shortcut.key);
    return parts.join('+');
  }

  /**
   * Setup global keyboard event listeners
   */
  private setupEventListeners(): void {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
    window.addEventListener('blur', this.clearPressedKeys.bind(this));
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.enabled) return;

    // Don't interfere with text input
    const target = e.target as HTMLElement;
    if (target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.contentEditable === 'true') {
      return;
    }

    this.pressedKeys.add(e.key);

    const shortcutKey = this.generateKeyFromEvent(e);
    const shortcut = this.shortcuts.get(shortcutKey);

    if (shortcut && shortcut.enabled && this.isContextValid(shortcut)) {
      // Check for conflicts
      if (this.conflictResolution && this.hasConflict(shortcut)) {
        console.warn(`Keyboard shortcut conflict detected for ${shortcutKey}`);
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      // Execute the shortcut action
      this.executeShortcut(shortcut, e);
    }
  }

  /**
   * Handle keyup events
   */
  private handleKeyUp(e: KeyboardEvent): void {
    this.pressedKeys.delete(e.key);
  }

  /**
   * Clear pressed keys (on window blur)
   */
  private clearPressedKeys(): void {
    this.pressedKeys.clear();
  }

  /**
   * Generate shortcut key from keyboard event
   */
  private generateKeyFromEvent(e: KeyboardEvent): string {
    const parts = [];
    if (e.ctrlKey) parts.push('Ctrl');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    if (e.metaKey) parts.push('Meta');
    parts.push(e.key);
    return parts.join('+');
  }

  /**
   * Check if the shortcut is valid in current context
   */
  private isContextValid(shortcut: KeyboardShortcut): boolean {
    return shortcut.context.includes('global') ||
           shortcut.context.includes(this.activeContext);
  }

  /**
   * Check for shortcut conflicts
   */
  private hasConflict(shortcut: KeyboardShortcut): boolean {
    // Check for browser reserved shortcuts
    const reserved = [
      'Ctrl+T', 'Ctrl+N', 'Ctrl+W', 'Ctrl+Shift+T',
      'Ctrl+Tab', 'Ctrl+Shift+Tab', 'Alt+F4',
      'F5', 'Ctrl+F5', 'Shift+F5', 'Ctrl+R'
    ];

    const key = this.generateShortcutKey(shortcut);
    return reserved.includes(key);
  }

  /**
   * Execute a keyboard shortcut action
   */
  private executeShortcut(shortcut: KeyboardShortcut, event: KeyboardEvent): void {
    // Custom handler if defined
    if (shortcut.handler) {
      shortcut.handler(event);
      return;
    }

    // Emit custom event for the action
    const customEvent = new CustomEvent('keyboard-action', {
      detail: {
        action: shortcut.action,
        shortcut: shortcut,
        event: event
      }
    });
    window.dispatchEvent(customEvent);

    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`Keyboard action: ${shortcut.action}`);
    }
  }

  /**
   * Set the current context for keyboard handling
   */
  public setContext(context: KeyboardContext): void {
    this.activeContext = context;
  }

  /**
   * Enable/disable keyboard handling
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Get all shortcuts organized by category
   */
  public getShortcutGroups(): ShortcutGroup[] {
    const groups: Map<string, ShortcutGroup> = new Map();

    // Define category metadata
    const categoryMeta = {
      navigation: { name: 'Navigation', icon: '🧭' },
      game: { name: 'Game Controls', icon: '🎮' },
      accessibility: { name: 'Accessibility', icon: '♿' },
      ui: { name: 'Interface', icon: '🖼️' },
      debug: { name: 'Debug', icon: '🐛' },
    };

    this.shortcuts.forEach(shortcut => {
      if (!shortcut.enabled && shortcut.category !== 'debug') return;

      const meta = categoryMeta[shortcut.category];
      if (!groups.has(shortcut.category)) {
        groups.set(shortcut.category, {
          name: meta.name,
          icon: meta.icon,
          shortcuts: []
        });
      }

      groups.get(shortcut.category)!.shortcuts.push(shortcut);
    });

    return Array.from(groups.values());
  }

  /**
   * Check if a specific key combination is pressed
   */
  public isKeyPressed(key: string): boolean {
    return this.pressedKeys.has(key);
  }

  /**
   * Register a custom shortcut
   */
  public registerShortcut(shortcut: KeyboardShortcut): void {
    const key = this.generateShortcutKey(shortcut);
    this.shortcuts.set(key, shortcut);
  }

  /**
   * Unregister a shortcut
   */
  public unregisterShortcut(key: string, modifiers?: ModifierKeys): void {
    const shortcutKey = this.generateShortcutKey({ key, modifiers } as KeyboardShortcut);
    this.shortcuts.delete(shortcutKey);
  }

  /**
   * Update a shortcut's key binding
   */
  public updateBinding(action: string, newKey: string, newModifiers?: ModifierKeys): void {
    // Find the shortcut with this action
    let targetShortcut: KeyboardShortcut | undefined;
    let oldKey: string | undefined;

    this.shortcuts.forEach((shortcut, key) => {
      if (shortcut.action === action) {
        targetShortcut = shortcut;
        oldKey = key;
      }
    });

    if (targetShortcut && oldKey) {
      // Remove old binding
      this.shortcuts.delete(oldKey);

      // Update shortcut
      targetShortcut.key = newKey;
      targetShortcut.modifiers = newModifiers;

      // Add new binding
      const newShortcutKey = this.generateShortcutKey(targetShortcut);
      this.shortcuts.set(newShortcutKey, targetShortcut);

      // Save to custom bindings
      this.customBindings.set(action, newShortcutKey);
      this.saveCustomBindings();
    }
  }

  /**
   * Load custom key bindings from localStorage
   */
  private loadCustomBindings(): void {
    const saved = localStorage.getItem('keyboardBindings');
    if (saved) {
      try {
        const bindings = JSON.parse(saved);
        Object.entries(bindings).forEach(([action, key]) => {
          this.customBindings.set(action, key as string);
          // Apply custom binding
          // ... implementation
        });
      } catch (error) {
        console.error('Failed to load custom key bindings:', error);
      }
    }
  }

  /**
   * Save custom key bindings to localStorage
   */
  private saveCustomBindings(): void {
    const bindings = Object.fromEntries(this.customBindings);
    localStorage.setItem('keyboardBindings', JSON.stringify(bindings));
  }

  /**
   * Reset all bindings to defaults
   */
  public resetToDefaults(): void {
    this.shortcuts.clear();
    this.customBindings.clear();
    this.initializeDefaultShortcuts();
    localStorage.removeItem('keyboardBindings');
  }

  /**
   * Get a formatted key representation for display
   */
  public formatKeyDisplay(shortcut: KeyboardShortcut): string {
    const parts = [];
    if (shortcut.modifiers?.ctrl) parts.push('Ctrl');
    if (shortcut.modifiers?.alt) parts.push('Alt');
    if (shortcut.modifiers?.shift) parts.push('Shift');
    if (shortcut.modifiers?.meta) parts.push('⌘');

    let key = shortcut.key;
    // Special key formatting
    switch(key) {
      case ' ': key = 'Space'; break;
      case 'ArrowUp': key = '↑'; break;
      case 'ArrowDown': key = '↓'; break;
      case 'ArrowLeft': key = '←'; break;
      case 'ArrowRight': key = '→'; break;
    }
    parts.push(key);

    return parts.join('+');
  }
}

export const keyboardManager = KeyboardManager.getInstance();