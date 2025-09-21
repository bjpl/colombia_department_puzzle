import { useState, useEffect } from 'react';
import { keyboardManager } from '../services/keyboardManager';

/**
 * CONCEPT: Simple Keyboard Shortcuts Help Modal
 * WHY: Users need to know available keyboard shortcuts
 * PATTERN: Clean modal overlay with organized shortcuts
 */

export default function KeyboardHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyboardAction = (e: CustomEvent) => {
      if (e.detail.action === 'help') {
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keyboard-action', handleKeyboardAction as EventListener);
    return () => {
      window.removeEventListener('keyboard-action', handleKeyboardAction as EventListener);
    };
  }, []);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-30">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gray-800 text-white p-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
          aria-label="Mostrar ayuda de teclado (F1)"
          title="Ayuda de Teclado (F1)"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  }

  const navigationShortcuts = keyboardManager.getShortcutsByCategory('navigation');
  const gameShortcuts = keyboardManager.getShortcutsByCategory('game');
  const accessibilityShortcuts = keyboardManager.getShortcutsByCategory('accessibility');

  return (
    <div
      className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-labelledby="keyboard-help-title"
      aria-describedby="keyboard-help-content"
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="keyboard-help-title" className="text-2xl font-bold text-gray-800">
            ⌨️ Atajos de Teclado
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Cerrar ayuda"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div id="keyboard-help-content" className="space-y-4">
          {/* Navigation Section */}
          <section>
            <h3 className="font-semibold text-lg text-gray-700 mb-2">🎮 Navegación</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <KeyBinding keys={['Tab']} description="Navegar entre elementos" />
              <KeyBinding keys={['Shift', 'Tab']} description="Navegar hacia atrás" />
              <KeyBinding keys={['Enter', 'Espacio']} description="Seleccionar/Colocar departamento" />
              <KeyBinding keys={['Escape']} description="Cancelar selección" />
            </div>
          </section>

          {/* Movement Section */}
          <section>
            <h3 className="font-semibold text-lg text-gray-700 mb-2">🏃 Movimiento</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <KeyBinding keys={['↑', '↓', '←', '→']} description="Mover departamento" />
              <KeyBinding keys={['Shift', '+ Flechas']} description="Mover más rápido" />
            </div>
          </section>

          {/* Game Controls Section */}
          <section>
            <h3 className="font-semibold text-lg text-gray-700 mb-2">⚡ Controles del Juego</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <KeyBinding keys={['P']} description="Pausar/Reanudar" />
              <KeyBinding keys={['R']} description="Reiniciar juego" />
              <KeyBinding keys={['H']} description="Usar pista" />
              <KeyBinding keys={['M']} description="Silenciar sonido" />
              <KeyBinding keys={['F1', '?']} description="Mostrar esta ayuda" />
            </div>
          </section>

          {/* Region Navigation Section */}
          <section>
            <h3 className="font-semibold text-lg text-gray-700 mb-2">🗺️ Navegación por Regiones</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <KeyBinding keys={['1']} description="Región Andina" />
              <KeyBinding keys={['2']} description="Región Caribe" />
              <KeyBinding keys={['3']} description="Región Pacífico" />
              <KeyBinding keys={['4']} description="Región Orinoquía" />
              <KeyBinding keys={['5']} description="Región Amazonía" />
              <KeyBinding keys={['6']} description="Región Insular" />
            </div>
          </section>

          {/* Accessibility */}
          {accessibilityShortcuts.length > 0 && (
            <section>
              <h3 className="font-semibold text-lg text-gray-700 mb-2">♿ Accesibilidad</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <KeyBinding keys={['Alt', 'A']} description="Configuración de accesibilidad" />
              </div>
            </section>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> El juego es completamente accesible con teclado.
              Los lectores de pantalla anunciarán automáticamente el progreso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function KeyBinding({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {keys.map((key, index) => (
          <span key={index}>
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 border border-gray-400 rounded">
              {key}
            </kbd>
            {index < keys.length - 1 && <span className="mx-1 text-gray-500">+</span>}
          </span>
        ))}
      </div>
      <span className="text-gray-600">{description}</span>
    </div>
  );
}