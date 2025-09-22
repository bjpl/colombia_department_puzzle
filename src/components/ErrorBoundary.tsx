import { Component, ErrorInfo, ReactNode } from 'react';
import {
  Button, Card, CardContent,
  colors, spacing, textStyles, shadows, radius
} from '../design-system';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to error reporting service if needed
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${colors.brand[50]} 0%, ${colors.success[50]} 100%)`,
            padding: spacing[4]
          }}
        >
          <Card variant="default" style={{
            maxWidth: '28rem',
            width: '100%',
            padding: spacing[8],
            textAlign: 'center',
            boxShadow: shadows.xl
          }}>
            <CardContent>
              <div className="text-6xl mb-4">😔</div>
              <h2 style={{
                fontSize: textStyles.heading.h2.fontSize[0],
                fontWeight: textStyles.heading.h2.fontWeight,
                color: colors.gray[800],
                marginBottom: spacing[4]
              }}>
                Algo salió mal
              </h2>
              <p style={{
                color: colors.gray[600],
                marginBottom: spacing[6]
              }}>
                Ha ocurrido un error inesperado. Por favor, recarga la página para continuar jugando.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => window.location.reload()}
              >
                Recargar Página
              </Button>
              {import.meta.env.DEV && this.state.error && (
                <details style={{ marginTop: spacing[6], textAlign: 'left' }}>
                  <summary style={{
                    cursor: 'pointer',
                    fontSize: textStyles.body.small.fontSize[0],
                    color: colors.gray[500]
                  }}>
                    Detalles del error (solo desarrollo)
                  </summary>
                  <pre style={{
                    marginTop: spacing[2],
                    fontSize: textStyles.body.small.fontSize[0],
                    backgroundColor: colors.gray[100],
                    padding: spacing[2],
                    borderRadius: radius.md,
                    overflow: 'auto'
                  }}>
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}