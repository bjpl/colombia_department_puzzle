import { Component, ErrorInfo, ReactNode } from 'react';
import {
  Button, Card, CardContent,
  colors, spacing, textStyles, shadows, radius
} from '../design-system';

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
        <div
          className="flex items-center justify-center h-full rounded-lg"
          style={{
            minHeight: '400px',
            background: `linear-gradient(135deg, ${colors.danger[50]} 0%, ${colors.warning[50]} 100%)`,
            padding: spacing[8]
          }}
        >
          <Card variant="default" style={{
            maxWidth: '28rem',
            width: '100%',
            boxShadow: shadows.xl
          }}>
            <CardContent style={{ padding: spacing[6] }}>
              <div className="text-center">
                {/* Error Icon */}
                <div className="text-6xl mb-4">🗺️❌</div>

                <h2 style={{
                  fontSize: textStyles.heading.h2.fontSize[0],
                  fontWeight: textStyles.heading.h2.fontWeight,
                  color: colors.gray[800],
                  marginBottom: spacing[2]
                }}>
                  Error al Cargar el Mapa
                </h2>

                <p style={{
                  color: colors.gray[600],
                  marginBottom: spacing[4]
                }}>
                  Hubo un problema al mostrar el mapa de Colombia.
                  {this.state.retryCount > 0 && (
                    <span style={{
                      display: 'block',
                      marginTop: spacing[2],
                      fontSize: textStyles.body.small.fontSize[0],
                      color: colors.warning[600]
                    }}>
                      Intento #{this.state.retryCount} falló.
                    </span>
                  )}
                </p>

                {/* Error Details (Development Only) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details style={{ textAlign: 'left', marginBottom: spacing[4] }}>
                    <summary style={{
                      cursor: 'pointer',
                      fontSize: textStyles.body.small.fontSize[0],
                      color: colors.gray[500]
                    }}>
                      Detalles técnicos
                    </summary>
                    <div style={{
                      marginTop: spacing[2],
                      padding: spacing[3],
                      backgroundColor: colors.gray[100],
                      borderRadius: radius.md,
                      fontSize: textStyles.body.small.fontSize[0],
                      fontFamily: 'monospace',
                      color: colors.gray[700],
                      overflow: 'auto',
                      maxHeight: '8rem'
                    }}>
                      {this.state.error.message}
                      {this.state.errorInfo && (
                        <div style={{ marginTop: spacing[2], color: colors.gray[500] }}>
                          {this.state.errorInfo.componentStack}
                        </div>
                      )}
                    </div>
                  </details>
                )}

                {/* Recovery Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
                  {this.state.retryCount < 3 && (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={this.handleReset}
                      aria-label="Reintentar cargar el mapa"
                      style={{ width: '100%' }}
                    >
                      🔄 Reintentar
                    </Button>
                  )}

                  <Button
                    variant="secondary"
                    size="md"
                    onClick={this.handleReloadPage}
                    aria-label="Recargar la página completa"
                    style={{ width: '100%' }}
                  >
                    🔃 Recargar Página
                  </Button>

                  {/* Alternative Action */}
                  <div style={{
                    paddingTop: spacing[3],
                    borderTop: `1px solid ${colors.gray[200]}`
                  }}>
                    <p style={{
                      fontSize: textStyles.body.small.fontSize[0],
                      color: colors.gray[600],
                      marginBottom: spacing[2]
                    }}>
                      Mientras tanto, puedes:
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Navigate to study mode or alternative view
                        const event = new CustomEvent('navigate-to-study');
                        window.dispatchEvent(event);
                      }}
                    >
                      📚 Ir al Modo Estudio
                    </Button>
                  </div>
                </div>

                {/* Contact Support (if too many retries) */}
                {this.state.retryCount >= 3 && (
                  <div style={{
                    marginTop: spacing[4],
                    padding: spacing[3],
                    backgroundColor: colors.warning[50],
                    borderRadius: radius.lg
                  }}>
                    <p style={{
                      fontSize: textStyles.body.small.fontSize[0],
                      color: colors.warning[800]
                    }}>
                      💬 Si el problema persiste, intenta:
                    </p>
                    <ul style={{
                      fontSize: textStyles.body.small.fontSize[0],
                      color: colors.warning[700],
                      marginTop: spacing[2],
                      textAlign: 'left'
                    }}>
                      <li style={{ marginBottom: spacing[1] }}>• Limpiar la caché del navegador</li>
                      <li style={{ marginBottom: spacing[1] }}>• Usar otro navegador (Chrome, Firefox)</li>
                      <li>• Verificar tu conexión a internet</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}