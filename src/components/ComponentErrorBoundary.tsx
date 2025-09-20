import { Component, ErrorInfo, ReactNode } from 'react';

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
        <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div className="flex-1">
              <p className="font-medium text-yellow-800">
                Error en {componentName}
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Este componente encontró un problema y no se puede mostrar.
              </p>

              {this.state.retryCount < 3 && (
                <button
                  onClick={this.handleRetry}
                  className="mt-2 text-sm text-yellow-600 hover:text-yellow-800 underline"
                  aria-label={`Reintentar cargar ${componentName}`}
                >
                  Reintentar
                </button>
              )}

              {/* Show error details in development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-yellow-600">
                    Detalles del error
                  </summary>
                  <pre className="mt-1 text-xs text-yellow-700 overflow-auto max-h-20 bg-yellow-100 p-2 rounded">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}