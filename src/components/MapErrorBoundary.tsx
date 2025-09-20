import { Component, ErrorInfo, ReactNode } from 'react';

/**
 * CONCEPT: Map-Specific Error Boundary
 * WHY: Isolate map rendering errors to prevent full app crash
 * PATTERN: Error boundary pattern with specific recovery for map components
 */

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

export default class MapErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Map Error Boundary caught an error:', error, errorInfo);

    // Log to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // Here you would send to your error tracking service
      // Example: Sentry, LogRocket, etc.
    }

    this.setState({
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: this.state.retryCount + 1,
    });

    // Clear any cached map data
    sessionStorage.removeItem('mapCache');
  };

  handleReloadPage = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full min-h-[400px] bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-8">
          <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-6">
            <div className="text-center">
              {/* Error Icon */}
              <div className="text-6xl mb-4">🗺️❌</div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Error al Cargar el Mapa
              </h2>

              <p className="text-gray-600 mb-4">
                Hubo un problema al mostrar el mapa de Colombia.
                {this.state.retryCount > 0 && (
                  <span className="block mt-2 text-sm text-orange-600">
                    Intento #{this.state.retryCount} falló.
                  </span>
                )}
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left mb-4">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Detalles técnicos
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 overflow-auto max-h-32">
                    {this.state.error.message}
                    {this.state.errorInfo && (
                      <div className="mt-2 text-gray-500">
                        {this.state.errorInfo.componentStack}
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Recovery Actions */}
              <div className="space-y-3">
                {this.state.retryCount < 3 && (
                  <button
                    onClick={this.handleReset}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    aria-label="Reintentar cargar el mapa"
                  >
                    🔄 Reintentar
                  </button>
                )}

                <button
                  onClick={this.handleReloadPage}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  aria-label="Recargar la página completa"
                >
                  🔃 Recargar Página
                </button>

                {/* Alternative Action */}
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    Mientras tanto, puedes:
                  </p>
                  <button
                    onClick={() => {
                      // Navigate to study mode or alternative view
                      const event = new CustomEvent('navigate-to-study');
                      window.dispatchEvent(event);
                    }}
                    className="text-blue-500 hover:text-blue-700 underline text-sm"
                  >
                    📚 Ir al Modo Estudio
                  </button>
                </div>
              </div>

              {/* Contact Support (if too many retries) */}
              {this.state.retryCount >= 3 && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    💬 Si el problema persiste, intenta:
                  </p>
                  <ul className="text-xs text-yellow-700 mt-2 space-y-1 text-left">
                    <li>• Limpiar la caché del navegador</li>
                    <li>• Usar otro navegador (Chrome, Firefox)</li>
                    <li>• Verificar tu conexión a internet</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}