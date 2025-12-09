import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

export interface TestProviderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  initialState?: Record<string, unknown>;
  theme?: 'light' | 'dark';
}

/**
 * All providers wrapper for component testing
 * Wraps components with necessary context providers for testing
 */
function AllProviders({ children, options }: { children: ReactNode; options: TestProviderOptions }) {
  const { route = '/' } = options;

  return (
    <MemoryRouter initialEntries={[route]}>
      {children}
    </MemoryRouter>
  );
}

/**
 * Custom render with all providers
 * Extends @testing-library/react's render with automatic provider wrapping
 *
 * @param ui - React element to render
 * @param options - Test provider options including route, state, and theme
 * @returns RenderResult from @testing-library/react
 *
 * @example
 * ```typescript
 * renderWithProviders(<MyComponent />, { route: '/game' });
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  options: TestProviderOptions = {}
): RenderResult {
  const { route, initialState, theme, ...renderOptions } = options;

  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders options={{ route, initialState, theme }}>
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  });
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Custom render as default
export { renderWithProviders as render };
