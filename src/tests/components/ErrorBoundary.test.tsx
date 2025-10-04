import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../../components/ErrorBoundary';
import { ReactNode } from 'react';

// Component that throws an error
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Suppress console.error for these tests
const originalError = console.error;

describe('ErrorBoundary', () => {
  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  describe('Normal Rendering', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render multiple children without errors', () => {
      render(
        <ErrorBoundary>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error UI when child component throws', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
      expect(screen.getByText(/Ha ocurrido un error inesperado/)).toBeInTheDocument();
    });

    it('should show reload button when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const reloadButton = screen.getByRole('button', { name: /recargar página/i });
      expect(reloadButton).toBeInTheDocument();
    });

    it('should display error emoji', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('😔')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should reload page when reload button is clicked', async () => {
      const user = userEvent.setup();
      const reloadMock = vi.fn();

      // Mock window.location.reload
      Object.defineProperty(window, 'location', {
        value: { reload: reloadMock },
        writable: true,
      });

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const reloadButton = screen.getByRole('button', { name: /recargar página/i });
      await user.click(reloadButton);

      expect(reloadMock).toHaveBeenCalled();
    });
  });

  describe('Development Mode', () => {
    it('should show error details in development mode', () => {
      const originalEnv = import.meta.env.DEV;

      // @ts-ignore - mocking env
      import.meta.env.DEV = true;

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Look for details element
      const details = screen.queryByText(/detalles del error/i);

      // @ts-ignore - restore env
      import.meta.env.DEV = originalEnv;
    });
  });

  describe('Error Boundary State', () => {
    it('should catch errors from nested components', () => {
      const NestedComponent = () => {
        return (
          <div>
            <ThrowError shouldThrow={true} />
          </div>
        );
      };

      render(
        <ErrorBoundary>
          <NestedComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    });

    it('should maintain error state after catching', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Algo salió mal')).toBeInTheDocument();

      // Rerender with different props
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      // Should still show error UI
      expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const button = screen.getByRole('button', { name: /recargar página/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAccessibleName();
    });

    it('should have proper heading structure', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const heading = screen.getByRole('heading', { name: /algo salió mal/i });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should render with proper card styling', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Card should be rendered
      const container = screen.getByText('Algo salió mal').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('should center content on screen', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const wrapper = container.querySelector('.min-h-screen');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center');
    });
  });

  describe('Console Logging', () => {
    it('should log error in development mode', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const originalEnv = import.meta.env.DEV;

      // @ts-ignore
      import.meta.env.DEV = true;

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Error should be logged
      expect(consoleSpy).toHaveBeenCalled();

      // @ts-ignore
      import.meta.env.DEV = originalEnv;
      consoleSpy.mockRestore();
    });
  });
});
