import { useState, useEffect } from 'react';
import { keyboardManager } from '../services/keyboardManager';

/**
 * CONCEPT: Advanced Keyboard Shortcuts Help Overlay
 * WHY: Users need comprehensive documentation of available shortcuts
 * PATTERN: Modal overlay with categorized, searchable key bindings
 */

export default function KeyboardHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const handleKeyboardAction = (e: CustomEvent) => {
      const { action } = e.detail;

      if (action === 'help' || action === 'help-alt' || action === 'help-f1') {
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keyboard-action', handleKeyboardAction as EventListener);
    return () => {
      window.removeEventListener('keyboard-action', handleKeyboardAction as EventListener);
    };
  }, []);

  const shortcutGroups = keyboardManager.getShortcutGroups();

  // Filter shortcuts based on search and category
  const filteredGroups = shortcutGroups.map(group => ({
    ...group,
    shortcuts: group.shortcuts.filter(shortcut => {
      const matchesSearch = searchTerm === '' ||
        shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shortcut.key.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || group.name === selectedCategory;
      return matchesSearch && matchesCategory;
    })
  })).filter(group => group.shortcuts.length > 0);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-30">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
          aria-label="Mostrar ayuda de teclado (F1 o ?)"
          title="Ayuda de Teclado (F1 o ?)"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-labelledby="keyboard-help-title"
      aria-describedby="keyboard-help-content"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 id="keyboard-help-title" className="text-3xl font-bold flex items-center gap-3">
              ⌨️ Atajos de Teclado
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              aria-label="Cerrar ayuda"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search bar */}
          <div className="mt-4 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar atajos..."
              className="w-full px-4 py-2 pl-10 rounded-lg bg-white/20 backdrop-blur text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-white/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-gray-100 border-b flex gap-2 px-6 py-3 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {shortcutGroups.map(group => (
            <button
              key={group.name}
              onClick={() => setSelectedCategory(group.name)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                selectedCategory === group.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{group.icon}</span>
              <span>{group.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div id="keyboard-help-content" className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 240px)' }}>
          {filteredGroups.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">No se encontraron atajos</p>
              <p className="text-sm mt-2">Intenta con otro término de búsqueda</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredGroups.map(group => (
                <section key={group.name}>
                  <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
                    <span className="text-2xl">{group.icon}</span>
                    <span>{group.name}</span>
                    <span className="text-sm text-gray-500 ml-auto">
                      {group.shortcuts.length} atajos
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {group.shortcuts.map((shortcut, index) => (
                      <KeyBinding
                        key={`${shortcut.action}-${index}`}
                        shortcut={shortcut}
                        formatKey={keyboardManager.formatKeyDisplay.bind(keyboardManager)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* Tips Section */}
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800 flex items-start gap-2">
                <span className="text-lg">💡</span>
                <span>
                  <strong>Consejo:</strong> El juego es totalmente accesible con teclado.
                  Usa Tab para navegar entre elementos y Enter o Espacio para activarlos.
                </span>
              </p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-800 flex items-start gap-2">
                <span className="text-lg">🎮</span>
                <span>
                  <strong>Modo de Movimiento:</strong> Usa las flechas para mover departamentos.
                  Mantén Shift para movimiento rápido o Ctrl para precisión.
                </span>
              </p>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <p className="text-sm text-purple-800 flex items-start gap-2">
                <span className="text-lg">♿</span>
                <span>
                  <strong>Accesibilidad:</strong> Presiona Alt+A para opciones de accesibilidad.
                  Los lectores de pantalla anunciarán automáticamente el progreso.
                </span>
              </p>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-800 flex items-start gap-2">
                <span className="text-lg">⚡</span>
                <span>
                  <strong>Atajos Rápidos:</strong> P para pausar, M para silenciar,
                  H para pistas, y números 1-6 para navegación por regiones.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-3 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Presiona <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">F1</kbd> o <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">?</kbd> para cerrar</span>
            <span>Personaliza atajos en Configuración</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface KeyBindingProps {
  shortcut: any;
  formatKey: (shortcut: any) => string;
}

function KeyBinding({ shortcut, formatKey }: KeyBindingProps) {
  const keyDisplay = formatKey(shortcut);
  const keys = keyDisplay.split('+');

  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-2">
        {keys.map((key, index) => (
          <span key={index} className="flex items-center">
            <kbd className="px-2.5 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded shadow-sm">
              {key}
            </kbd>
            {index < keys.length - 1 && <span className="mx-1 text-gray-400 text-xs">+</span>}
          </span>
        ))}
      </div>
      <span className="text-sm text-gray-600 ml-4 text-right">{shortcut.description}</span>
    </div>
  );
}