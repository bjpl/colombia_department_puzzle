import { Component, ErrorInfo, ReactNode } from 'react';

/**
 * CONCEPT: Game Logic Error Boundary
 * WHY: Catch errors in game state and logic without losing UI
 * PATTERN: Error boundary with game state recovery options
 */

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorType: 'state' | 'scoring' | 'progress' | 'unknown';
}

export default class GameLogicErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorType: 'unknown',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Determine error type based on error message or stack
    let errorType: State['errorType'] = 'unknown';

    if (error.message.includes('score') || error.message.includes('points')) {
      errorType = 'scoring';
    } else if (error.message.includes('state') || error.message.includes('useState')) {
      errorType = 'state';
    } else if (error.message.includes('progress') || error.message.includes('placement')) {
      errorType = 'progress';
    }

    return {
      hasError: true,
      error,
      errorType,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Game Logic Error:', error, errorInfo);

    // Save error to localStorage for debugging
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    };

    const existingErrors = JSON.parse(localStorage.getItem('gameErrors') || '[]');
    existingErrors.push(errorLog);

    // Keep only last 5 errors
    if (existingErrors.length > 5) {
      existingErrors.shift();
    }

    localStorage.setItem('gameErrors', JSON.stringify(existingErrors));
  }

  handleResetGameState = () => {
    // Clear all game-related localStorage
    localStorage.removeItem('gameState');
    localStorage.removeItem('gameProgress');
    localStorage.removeItem('gameScore');
    localStorage.removeItem('placedDepartments');

    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorType: 'unknown',
    });

    // Trigger game reset event
    window.dispatchEvent(new CustomEvent('reset-game-state'));
  };

  handleContinueAnyway = () => {
    // Try to continue with partial recovery
    this.setState({
      hasError: false,
      error: null,
      errorType: 'unknown',
    });
  };

  getErrorMessage(): { title: string; description: string; icon: string } {
    switch (this.state.errorType) {
      case 'scoring':
        return {
          title: 'Error en la Puntuación',
          description: 'Hubo un problema calculando los puntos. Tu progreso está seguro.',
          icon: '🎯',
        };
      case 'state':
        return {
          title: 'Error en el Estado del Juego',
          description: 'El juego encontró un problema con los datos guardados.',
          icon: '💾',
        };
      case 'progress':
        return {
          title: 'Error en el Progreso',
          description: 'Hubo un problema al guardar tu progreso actual.',
          icon: '📊',
        };
      default:
        return {
          title: 'Algo Salió Mal',
          description: 'El juego encontró un error inesperado.',
          icon: '⚠️',
        };
    }
  }

  render() {
    if (this.state.hasError) {
      const { title, description, icon } = this.getErrorMessage();

      return (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-6">
            <div className="text-center">
              {/* Error Icon */}
              <div className="text-6xl mb-4">{icon}</div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {title}
              </h2>

              <p className="text-gray-600 mb-4">
                {description}
              </p>

              {/* Quick Fix Suggestions */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  Soluciones Rápidas:
                </p>
                <ul className="text-xs text-blue-700 space-y-1 text-left">
                  {this.state.errorType === 'scoring' && (
                    <>
                      <li>• Los puntos se recalcularán automáticamente</li>
                      <li>• Tu progreso anterior está guardado</li>
                    </>
                  )}
                  {this.state.errorType === 'state' && (
                    <>
                      <li>• Reiniciar el juego puede solucionar el problema</li>
                      <li>• No perderás tus estadísticas generales</li>
                    </>
                  )}
                  {this.state.errorType === 'progress' && (
                    <>
                      <li>• Los departamentos colocados se restaurarán</li>
                      <li>• Puedes continuar desde el último punto guardado</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Recovery Actions */}
              <div className="space-y-3">
                <button
                  onClick={this.handleResetGameState}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all font-medium"
                  aria-label="Reiniciar el estado del juego"
                >
                  🔄 Reiniciar Juego
                </button>

                <button
                  onClick={this.handleContinueAnyway}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  aria-label="Intentar continuar con el juego"
                >
                  ➡️ Intentar Continuar
                </button>
              </div>

              {/* Debug Info (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Información de Debug
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 overflow-auto max-h-32">
                    <div>Type: {this.state.errorType}</div>
                    <div>Message: {this.state.error.message}</div>
                    <div className="mt-2">Stack: {this.state.error.stack}</div>
                  </div>
                </details>
              )}

              {/* Help Text */}
              <p className="mt-4 text-xs text-gray-500">
                Si el problema persiste después de reiniciar, intenta recargar la página.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}