import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from './index';

describe('Component Test Infrastructure', () => {
  it('renderWithProviders works with basic component', () => {
    renderWithProviders(<div data-testid="test">Hello</div>);
    expect(screen.getByTestId('test')).toHaveTextContent('Hello');
  });

  it('renders with custom route', () => {
    renderWithProviders(<div>Content</div>, { route: '/game' });
    // Should not throw - MemoryRouter handles the route
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders with default route when no route provided', () => {
    renderWithProviders(<div data-testid="default">Default Route</div>);
    expect(screen.getByTestId('default')).toHaveTextContent('Default Route');
  });

  it('handles options correctly', () => {
    const options = {
      route: '/test',
      initialState: { foo: 'bar' },
      theme: 'dark' as const,
    };

    renderWithProviders(<div data-testid="with-options">Options Test</div>, options);
    expect(screen.getByTestId('with-options')).toBeInTheDocument();
  });

  it('spreads additional render options correctly', () => {
    renderWithProviders(<div data-testid="container">Content</div>, {
      container: document.body,
    });
    expect(screen.getByTestId('container')).toBeInTheDocument();
  });
});
