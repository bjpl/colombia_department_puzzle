import { Component, ErrorInfo, ReactNode } from 'react';
import {
  Button, Card, CardContent,
  colors, spacing, textStyles
} from '../design-system';

/**
 * CONCEPT: Component-Level Error Boundary
 * WHY: Isolate individual component failures without breaking entire UI
 * PATTERN: Lightweight error boundary for wrapping individual components
 */

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

export default class ComponentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
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
    const componentName = this.props.componentName || 'Unknown Component';
    console.error(`Component Error in ${componentName}:`, error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      retryCount: this.state.retryCount + 1,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      const componentName = this.props.componentName || 'componente';

      return (
        <Card variant="default" style={{
          backgroundColor: colors.warning[50],
          borderColor: colors.warning[200],
          borderWidth: '2px',
          padding: spacing[4]
        }}>
          <CardContent>
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div className="flex-1">
                <p style={{
                  fontWeight: textStyles.body.medium.fontWeight,
                  color: colors.warning[800]
                }}>
                  Error en {componentName}
                </p>
                <p style={{
                  fontSize: textStyles.body.small.fontSize[0],
                  color: colors.warning[700],
                  marginTop: spacing[1]
                }}>
                  Este componente encontró un problema y no se puede mostrar.
                </p>

                {this.state.retryCount < 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={this.handleRetry}
                    style={{ marginTop: spacing[2] }}
                    aria-label={`Reintentar cargar ${componentName}`}
                  >
                    Reintentar
                  </Button>
                )}

                {/* Show error details in development */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details style={{ marginTop: spacing[2] }}>
                    <summary style={{
                      cursor: 'pointer',
                      fontSize: textStyles.body.small.fontSize[0],
                      color: colors.warning[600]
                    }}>
                      Detalles del error
                    </summary>
                    <pre style={{
                      marginTop: spacing[1],
                      fontSize: textStyles.body.small.fontSize[0],
                      color: colors.warning[700],
                      overflow: 'auto',
                      maxHeight: '5rem',
                      backgroundColor: colors.warning[100],
                      padding: spacing[2],
                      borderRadius: borderRadius.md
                    }}>
                      {this.state.error.message}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}