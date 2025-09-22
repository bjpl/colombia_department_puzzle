import { useState, useEffect } from 'react';

/**
 * CONCEPT: Visual Keyboard Feedback System
 * WHY: Provides visual confirmation of keyboard actions for better user experience
 * PATTERN: Toast-like notifications for key presses with contextual icons
 */

interface KeyAction {
  action: string;
  key: string;
  timestamp: number;
}

export default function KeyboardVisualFeedback() {
  const [recentActions, setRecentActions] = useState<KeyAction[]>([]);
  const [showKeys, setShowKeys] = useState(false);

  useEffect(() => {
    // Load preference from localStorage
    const savedPref = localStorage.getItem('showKeyboardFeedback');
    setShowKeys(savedPref !== 'false'); // Default to true

    const handleKeyboardAction = (e: CustomEvent) => {
      if (!showKeys) return;

      const { action, shortcut } = e.detail;

      // Don't show feedback for certain actions
      const ignoredActions = ['navigate-forward', 'navigate-backward'];
      if (ignoredActions.includes(action)) return;

      const newAction: KeyAction = {
        action: action,
        key: formatKeyDisplay(shortcut),
        timestamp: Date.now()
      };

      setRecentActions(prev => [...prev, newAction].slice(-3)); // Keep only last 3

      // Auto-remove after 2 seconds
      setTimeout(() => {
        setRecentActions(prev => prev.filter(a => a.timestamp !== newAction.timestamp));
      }, 2000);
    };

    window.addEventListener('keyboard-action', handleKeyboardAction as EventListener);
    return () => {
      window.removeEventListener('keyboard-action', handleKeyboardAction as EventListener);
    };
  }, [showKeys]);

  const formatKeyDisplay = (shortcut: any): string => {
    if (!shortcut) return '';
    const parts = [];
    if (shortcut.modifiers?.ctrl) parts.push('Ctrl');
    if (shortcut.modifiers?.alt) parts.push('Alt');
    if (shortcut.modifiers?.shift) parts.push('Shift');
    parts.push(shortcut.key);
    return parts.join('+');
  };

  const getActionIcon = (action: string): string => {
    const iconMap: Record<string, string> = {
      'pause': '⏸️',
      'restart': '🔄',
      'hint': '💡',
      'undo': '↩️',
      'redo': '↪️',
      'mute-toggle': '🔇',
      'volume-up': '🔊',
      'volume-down': '🔉',
      'fullscreen': '⛶',
      'help': '❓',
      'select': '✓',
      'cancel': '✗',
      'move-up': '↑',
      'move-down': '↓',
      'move-left': '←',
      'move-right': '→',
      'zoom-in': '🔍+',
      'zoom-out': '🔍-',
      'zoom-reset': '🔍',
    };

    // Extract base action for movement variations
    const baseAction = action.replace(/-fast|-vi|-wasd/, '');
    return iconMap[baseAction] || '⌨️';
  };

  const getActionLabel = (action: string): string => {
    const labelMap: Record<string, string> = {
      'pause': 'Pausar',
      'restart': 'Reiniciar',
      'hint': 'Pista',
      'undo': 'Deshacer',
      'redo': 'Rehacer',
      'mute-toggle': 'Silenciar',
      'volume-up': 'Subir Volumen',
      'volume-down': 'Bajar Volumen',
      'fullscreen': 'Pantalla Completa',
      'help': 'Ayuda',
      'select': 'Seleccionar',
      'cancel': 'Cancelar',
      'move-up': 'Mover Arriba',
      'move-down': 'Mover Abajo',
      'move-left': 'Mover Izquierda',
      'move-right': 'Mover Derecha',
      'zoom-in': 'Acercar',
      'zoom-out': 'Alejar',
      'zoom-reset': 'Restablecer Zoom',
    };

    // Handle variations
    const baseAction = action.replace(/-fast|-vi|-wasd/, '');
    let label = labelMap[baseAction] || action;

    if (action.includes('-fast')) label += ' (Rápido)';
    if (action.includes('-vi')) label += ' (Vi)';
    if (action.includes('-wasd')) label += ' (WASD)';

    return label;
  };

  if (!showKeys || recentActions.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 z-40 space-y-2 pointer-events-none">
      {recentActions.map((action) => (
        <div
          key={action.timestamp}
          className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in-left"
          style={{
            animation: 'slideInLeft 0.2s ease-out, fadeOut 0.3s ease-in 1.7s forwards'
          }}
        >
          <span className="text-xl">{getActionIcon(action.action)}</span>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{getActionLabel(action.action)}</span>
            <span className="text-xs text-gray-300">{action.key}</span>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

// Settings component to toggle visual feedback
export function KeyboardFeedbackToggle() {
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem('showKeyboardFeedback');
    return saved !== 'false';
  });

  const handleToggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    localStorage.setItem('showKeyboardFeedback', String(newValue));

    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('keyboard-feedback-toggle', {
      detail: { enabled: newValue }
    }));
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
      <div className="flex items-center gap-2">
        <span className="text-lg">⌨️</span>
        <div>
          <p className="font-medium text-gray-700">Visual de Teclado</p>
          <p className="text-xs text-gray-500">Mostrar acciones del teclado en pantalla</p>
        </div>
      </div>
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-sky-600' : 'bg-gray-300'
        }`}
        aria-label={enabled ? 'Desactivar visual de teclado' : 'Activar visual de teclado'}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}