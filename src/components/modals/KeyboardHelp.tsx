import { useState, useEffect } from 'react';
import {
  Button, Card, CardContent, Badge
} from '../design-system';

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
        <Button
          variant="secondary"
          onClick={() => setIsOpen(true)}
          className="bg-gray-800 text-white p-2 shadow-lg"
          aria-label="Mostrar ayuda de teclado (F1)"
          title="Ayuda de Teclado (F1)"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
        </Button>
      </div>
    );
  }

  // Accessibility shortcuts are handled inline in the JSX below

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
      onClick={() => setIsOpen(false)}
      role="presentation"
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        role="dialog"
        aria-labelledby="keyboard-help-title"
        aria-describedby="keyboard-help-content"
        aria-modal="true"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.stopPropagation();
            setIsOpen(false);
          }
        }}
      >
        <Card
          variant="default"
          className="w-full max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[80vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
        <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 id="keyboard-help-title" className="text-2xl font-bold text-gray-900">
            <span aria-hidden="true">⌨️ </span>Atajos de Teclado
          </h2>
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="text-gray-500"
            aria-label="Cerrar ayuda"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        <div id="keyboard-help-content" className="flex flex-col gap-4">
          {/* Navigation Section */}
          <Card variant="default" className="p-4">
            <h3 className="font-semibold text-lg text-gray-600 mb-2"><span aria-hidden="true">🎮 </span>Navegación</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <KeyBinding keys={['Tab']} description="Navegar entre elementos" />
              <KeyBinding keys={['Shift', 'Tab']} description="Navegar hacia atrás" />
              <KeyBinding keys={['Enter', 'Espacio']} description="Seleccionar/Colocar departamento" />
              <KeyBinding keys={['Escape']} description="Cancelar selección" />
            </div>
          </Card>

          {/* Movement Section */}
          <Card variant="default" className="p-4">
            <h3 className="font-semibold text-lg text-gray-600 mb-2"><span aria-hidden="true">🏃 </span>Movimiento</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <KeyBinding keys={['↑', '↓', '←', '→']} description="Mover departamento" />
              <KeyBinding keys={['Shift', '+ Flechas']} description="Mover más rápido" />
            </div>
          </Card>

          {/* Game Controls Section - WCAG 2.1.4 compliant with Alt modifiers */}
          <Card variant="default" className="p-4">
            <h3 className="font-semibold text-lg text-gray-600 mb-2"><span aria-hidden="true">⚡ </span>Controles del Juego</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <KeyBinding keys={['Alt', 'P']} description="Pausar/Reanudar" />
              <KeyBinding keys={['Alt', 'R']} description="Reiniciar juego" />
              <KeyBinding keys={['Alt', 'H']} description="Usar pista" />
              <KeyBinding keys={['Alt', 'M']} description="Silenciar sonido" />
              <KeyBinding keys={['F1', '?']} description="Mostrar esta ayuda" />
            </div>
          </Card>

          {/* Region Navigation Section - WCAG 2.1.4 compliant with Alt modifiers */}
          <Card variant="default" className="p-4">
            <h3 className="font-semibold text-lg text-gray-600 mb-2"><span aria-hidden="true">🗺️ </span>Navegación por Regiones</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <KeyBinding keys={['Alt', '1']} description="Región Andina" />
              <KeyBinding keys={['Alt', '2']} description="Región Caribe" />
              <KeyBinding keys={['Alt', '3']} description="Región Pacífico" />
              <KeyBinding keys={['Alt', '4']} description="Región Orinoquía" />
              <KeyBinding keys={['Alt', '5']} description="Región Amazonía" />
              <KeyBinding keys={['Alt', '6']} description="Región Insular" />
            </div>
          </Card>

          {/* Accessibility - Always show */}
          <Card variant="default" className="p-4">
            <h3 className="font-semibold text-lg text-gray-600 mb-2"><span aria-hidden="true">♿ </span>Accesibilidad</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <KeyBinding keys={['Alt', 'A']} description="Configuración de accesibilidad" />
            </div>
          </Card>

          <Card variant="default" className="mt-6 p-4 bg-blue-50">
            <p className="text-sm text-blue-800">
              <span aria-hidden="true">💡 </span><strong>Tip:</strong> El juego es completamente accesible con teclado.
              Los lectores de pantalla anunciarán automáticamente el progreso.
            </p>
          </Card>
        </div>
        </CardContent>
      </Card>
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
            <Badge
              variant="secondary"
              className="text-sm font-semibold text-gray-600 bg-gray-200 border border-gray-400 rounded-sm"
            >
              {key}
            </Badge>
            {index < keys.length - 1 && <span className="mx-1 text-gray-400">+</span>}
          </span>
        ))}
      </div>
      <span className="text-gray-600">{description}</span>
    </div>
  );
}