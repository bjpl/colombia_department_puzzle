import { Component, ErrorInfo, ReactNode } from 'react';
import {
  Button, Card, CardContent,
  colors, spacing, textStyles, shadows
} from '../design-system';

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
        <div
          className="flex items-center justify-center"
          style={{ minHeight: '400px', padding: spacing[8] }}
        >
          <Card variant="default" style={{
            maxWidth: '28rem',
            width: '100%',
            boxShadow: shadows.xl
          }}>
            <CardContent style={{ padding: spacing[6] }}>
              <div className="text-center">
                {/* Error Icon */}
                <div className="text-6xl mb-4">{icon}</div>

                <h2 style={{
                  fontSize: textStyles.heading.h2.fontSize[0],
                  fontWeight: textStyles.heading.h2.fontWeight,
                  color: colors.neutral[800],
                  marginBottom: spacing[2]
                }}>
                  {title}
                </h2>

                <p style={{
                  color: colors.neutral[600],
                  marginBottom: spacing[4]
                }}>
                  {description}
                </p>

                {/* Quick Fix Suggestions */}
                <div style={{
                  backgroundColor: colors.brand[50],
                  borderRadius: borderRadius.lg,
                  padding: spacing[4],
                  marginBottom: spacing[4]
                }}>
                  <p style={{
                    fontSize: textStyles.body.small.fontSize[0],
                    color: colors.brand[800],
                    fontWeight: textStyles.body.medium.fontWeight,
                    marginBottom: spacing[2]
                  }}>
                    Soluciones Rápidas:
                  </p>
                  <ul style={{
                    fontSize: textStyles.body.small.fontSize[0],
                    color: colors.brand[700],
                    textAlign: 'left'
                  }}>
                    {this.state.errorType === 'scoring' && (
                      <>
                        <li style={{ marginBottom: spacing[1] }}>• Los puntos se recalcularán automáticamente</li>
                        <li>• Tu progreso anterior está guardado</li>
                      </>
                    )}
                    {this.state.errorType === 'state' && (
                      <>
                        <li style={{ marginBottom: spacing[1] }}>• Reiniciar el juego puede solucionar el problema</li>
                        <li>• No perderás tus estadísticas generales</li>
                      </>
                    )}
                    {this.state.errorType === 'progress' && (
                      <>
                        <li style={{ marginBottom: spacing[1] }}>• Los departamentos colocados se restaurarán</li>
                        <li>• Puedes continuar desde el último punto guardado</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Recovery Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={this.handleResetGameState}
                    aria-label="Reiniciar el estado del juego"
                    style={{ width: '100%' }}
                  >
                    🔄 Reiniciar Juego
                  </Button>

                  <Button
                    variant="secondary"
                    size="md"
                    onClick={this.handleContinueAnyway}
                    aria-label="Intentar continuar con el juego"
                    style={{ width: '100%' }}
                  >
                    ➡️ Intentar Continuar
                  </Button>
                </div>

                {/* Debug Info (Development Only) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details style={{ marginTop: spacing[4], textAlign: 'left' }}>
                    <summary style={{
                      cursor: 'pointer',
                      fontSize: textStyles.body.small.fontSize[0],
                      color: colors.neutral[500]
                    }}>
                      Información de Debug
                    </summary>
                    <div style={{
                      marginTop: spacing[2],
                      padding: spacing[3],
                      backgroundColor: colors.neutral[100],
                      borderRadius: borderRadius.md,
                      fontSize: textStyles.body.small.fontSize[0],
                      color: colors.neutral[700],
                      overflow: 'auto',
                      maxHeight: '8rem',
                      fontFamily: 'monospace'
                    }}>
                      <div>Type: {this.state.errorType}</div>
                      <div>Message: {this.state.error.message}</div>
                      <div style={{ marginTop: spacing[2] }}>Stack: {this.state.error.stack}</div>
                    </div>
                  </details>
                )}

                {/* Help Text */}
                <p style={{
                  marginTop: spacing[4],
                  fontSize: textStyles.body.small.fontSize[0],
                  color: colors.neutral[500]
                }}>
                  Si el problema persiste después de reiniciar, intenta recargar la página.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}