/**
 * CONCEPT: Simple Keyboard Shortcut Management
 * WHY: Provides consistent keyboard handling without overengineering
 * PATTERN: Basic event handling for essential game shortcuts
 */

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: string;
  description: string;
  category: 'navigation' | 'game' | 'accessibility';
}

class KeyboardManager {
  private static instance: KeyboardManager;
  private enabled: boolean = true;

  private shortcuts: KeyboardShortcut[] = [
    // Navigation
    { key: 'Tab', action: 'navigate-forward', description: 'Navegar adelante', category: 'navigation' },
    { key: 'Tab', shiftKey: true, action: 'navigate-backward', description: 'Navegar atrás', category: 'navigation' },
    { key: 'Enter', action: 'select', description: 'Seleccionar/Confirmar', category: 'navigation' },
    { key: ' ', action: 'select', description: 'Seleccionar/Activar', category: 'navigation' },
    { key: 'Escape', action: 'cancel', description: 'Cancelar/Cerrar', category: 'navigation' },

    // Game Controls
    { key: 'p', action: 'pause', description: 'Pausar/Reanudar', category: 'game' },
    { key: 'P', action: 'pause', description: 'Pausar/Reanudar', category: 'game' },
    { key: 'r', action: 'restart', description: 'Reiniciar juego', category: 'game' },
    { key: 'R', action: 'restart', description: 'Reiniciar juego', category: 'game' },
    { key: 'h', action: 'hint', description: 'Usar pista', category: 'game' },
    { key: 'H', action: 'hint', description: 'Usar pista', category: 'game' },
    { key: 'm', action: 'mute', description: 'Silenciar/Activar sonido', category: 'game' },
    { key: 'M', action: 'mute', description: 'Silenciar/Activar sonido', category: 'game' },

    // Help
    { key: '?', action: 'help', description: 'Mostrar ayuda', category: 'game' },
    { key: 'F1', action: 'help', description: 'Mostrar ayuda', category: 'game' },

    // Movement
    { key: 'ArrowUp', action: 'move-up', description: 'Mover arriba', category: 'game' },
    { key: 'ArrowDown', action: 'move-down', description: 'Mover abajo', category: 'game' },
    { key: 'ArrowLeft', action: 'move-left', description: 'Mover izquierda', category: 'game' },
    { key: 'ArrowRight', action: 'move-right', description: 'Mover derecha', category: 'game' },

    // Fast movement with Shift
    { key: 'ArrowUp', shiftKey: true, action: 'move-up-fast', description: 'Mover arriba rápido', category: 'game' },
    { key: 'ArrowDown', shiftKey: true, action: 'move-down-fast', description: 'Mover abajo rápido', category: 'game' },
    { key: 'ArrowLeft', shiftKey: true, action: 'move-left-fast', description: 'Mover izquierda rápido', category: 'game' },
    { key: 'ArrowRight', shiftKey: true, action: 'move-right-fast', description: 'Mover derecha rápido', category: 'game' },

    // Region Quick Access
    { key: '1', action: 'region-1', description: 'Región Andina', category: 'game' },
    { key: '2', action: 'region-2', description: 'Región Caribe', category: 'game' },
    { key: '3', action: 'region-3', description: 'Región Pacífico', category: 'game' },
    { key: '4', action: 'region-4', description: 'Región Orinoquía', category: 'game' },
    { key: '5', action: 'region-5', description: 'Región Amazonía', category: 'game' },
    { key: '6', action: 'region-6', description: 'Región Insular', category: 'game' },

    // Accessibility
    { key: 'a', altKey: true, action: 'accessibility', description: 'Configuración de accesibilidad', category: 'accessibility' },
  ];

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): KeyboardManager {
    if (!KeyboardManager.instance) {
      KeyboardManager.instance = new KeyboardManager();
    }
    return KeyboardManager.instance;
  }

  private setupEventListeners(): void {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.enabled) return;

    // Don't interfere with text input
    const target = e.target as HTMLElement;
    if (target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.contentEditable === 'true') {
      return;
    }

    // Don't interfere with arrow keys during keyboard navigation
    // Check if there's an active keyboard navigation mode
    const isNavigating = document.querySelector('[class*="KeyboardCursor"]') !== null ||
                        document.querySelector('.fixed.pointer-events-none.z-50') !== null;
    if (isNavigating && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      return; // Let the navigation handler take care of it
    }

    // Find matching shortcut
    const shortcut = this.shortcuts.find(s =>
      s.key === e.key &&
      (s.ctrlKey === e.ctrlKey || !s.ctrlKey) &&
      (s.altKey === e.altKey || !s.altKey) &&
      (s.shiftKey === e.shiftKey || !s.shiftKey)
    );

    if (shortcut) {
      // Don't prevent default for Tab navigation
      if (shortcut.key !== 'Tab') {
        e.preventDefault();
      }

      // Dispatch action
      window.dispatchEvent(new CustomEvent('keyboard-action', {
        detail: { action: shortcut.action, key: e.key, event: e }
      }));
    }
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public getShortcuts(): KeyboardShortcut[] {
    return this.shortcuts;
  }

  public getShortcutsByCategory(category: string): KeyboardShortcut[] {
    return this.shortcuts.filter(s => s.category === category);
  }
}

export const keyboardManager = KeyboardManager.getInstance();