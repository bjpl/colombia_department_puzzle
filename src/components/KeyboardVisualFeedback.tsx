import { useState, useEffect } from 'react';
import {
  Button, Card,
  colors, spacing, textStyles, radius
} from '../design-system';

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

  const formatKeyDisplay = (shortcut: { key: string; modifiers?: { ctrl?: boolean; alt?: boolean; shift?: boolean } } | null): string => {
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
    <div className="fixed bottom-20 left-4 z-40 pointer-events-none" style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
      {recentActions.map((action) => (
        <Card
          key={action.timestamp}
          variant="default"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
            color: colors.text.primary,
            padding: `${spacing[2]} ${spacing[4]}`,
            display: 'flex',
            alignItems: 'center',
            gap: spacing[3],
            animation: 'slideInLeft 0.2s ease-out, fadeOut 0.3s ease-in 1.7s forwards'
          }}
        >
          <span style={{ fontSize: textStyles.heading.h2.fontSize[0] }}>{getActionIcon(action.action)}</span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: textStyles.body.small.fontSize[0], fontWeight: 'medium' }}>{getActionLabel(action.action)}</span>
            <span style={{ fontSize: textStyles.body.small.fontSize[0], color: colors.text.disabled }}>{action.key}</span>
          </div>
        </Card>
      ))}

      <style>{`
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
    <Card variant="default" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: spacing[3] }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
        <span style={{ fontSize: textStyles.heading.h3.fontSize[0] }}>⌨️</span>
        <div>
          <p style={{ fontWeight: 'medium', color: colors.text.secondary }}>Visual de Teclado</p>
          <p style={{ fontSize: textStyles.body.small.fontSize[0], color: colors.text.disabled }}>Mostrar acciones del teclado en pantalla</p>
        </div>
      </div>
      <Button
        variant="ghost"
        onClick={handleToggle}
        style={{
          position: 'relative',
          display: 'inline-flex',
          height: '24px',
          width: '44px',
          alignItems: 'center',
          borderRadius: radius.full,
          backgroundColor: enabled ? colors.brand[600] : colors.gray[300],
          transition: 'colors 0.2s'
        }}
        aria-label={enabled ? 'Desactivar visual de teclado' : 'Activar visual de teclado'}
      >
        <span
          style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: colors.background,
            transform: enabled ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 0.2s'
          }}
        />
      </Button>
    </Card>
  );
}