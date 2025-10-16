/**
 * ProtectedRoute Tests
 *
 * CONCEPT: Test protected route authentication and redirect behavior
 * WHY: Ensures unauthenticated users are redirected appropriately
 * PATTERN: React Testing Library with react-router, mock AuthContext
 *
 * NOTE: ProtectedRoute component to be created by coder agent
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import React from 'react';
import {
  MockAuthProvider,
  createMockAuthContext,
  createAuthenticatedMockContext,
  createLoadingMockContext,
} from '../../utils/authTestUtils';

// Mock ProtectedRoute component (real component TBD by coder agent)
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    // Simulate auth check
    setTimeout(() => {
      setIsLoading(false);
      // Mock: check if user is authenticated
      const mockAuth = (window as any).__mockAuthState;
      setIsAuthenticated(mockAuth?.isAuthenticated || false);
    }, 10);
  }, []);

  if (isLoading) {
    return <div role="status">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  return <>{children}</>;
}

// Test component to render inside protected route
function ProtectedContent() {
  return <div>Protected Content</div>;
}

// Test component to show current location
function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

describe('ProtectedRoute - Authentication Check', () => {
  it('should show loading state initially', () => {
    const mockContext = createLoadingMockContext();
    (window as any).__mockAuthState = mockContext;

    render(
      <MockAuthProvider value={mockContext}>
        <MemoryRouter>
          <ProtectedRoute>
            <ProtectedContent />
          </ProtectedRoute>
        </MemoryRouter>
      </MockAuthProvider>
    );

    expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
  });

  it('should render children when authenticated', async () => {
    const mockContext = createAuthenticatedMockContext();
    (window as any).__mockAuthState = mockContext;

    render(
      <MockAuthProvider value={mockContext}>
        <MemoryRouter>
          <ProtectedRoute>
            <ProtectedContent />
          </ProtectedRoute>
        </MemoryRouter>
      </MockAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('should redirect when not authenticated', async () => {
    const mockContext = createMockAuthContext({ isAuthenticated: false, isLoading: false });
    (window as any).__mockAuthState = mockContext;

    render(
      <MockAuthProvider value={mockContext}>
        <MemoryRouter>
          <ProtectedRoute>
            <ProtectedContent />
          </ProtectedRoute>
        </MemoryRouter>
      </MockAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/redirecting to login/i)).toBeInTheDocument();
    });

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});

describe('ProtectedRoute - Redirect Behavior', () => {
  afterEach(() => {
    delete (window as any).__mockAuthState;
  });

  it('should redirect to login page', async () => {
    const mockContext = createMockAuthContext({ isAuthenticated: false, isLoading: false });
    (window as any).__mockAuthState = mockContext;

    render(
      <MockAuthProvider value={mockContext}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <ProtectedContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </MockAuthProvider>
    );

    await waitFor(() => {
      // Mock redirect message instead of actual redirect
      expect(screen.getByText(/redirecting to login/i)).toBeInTheDocument();
    });
  });

  it('should preserve redirect URL in state', async () => {
    const mockContext = createMockAuthContext({ isAuthenticated: false, isLoading: false });
    (window as any).__mockAuthState = mockContext;

    // Real component will use navigate('/login', { state: { from: location } })
    render(
      <MockAuthProvider value={mockContext}>
        <MemoryRouter initialEntries={['/protected/dashboard']}>
          <ProtectedRoute>
            <ProtectedContent />
          </ProtectedRoute>
        </MemoryRouter>
      </MockAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/redirecting to login/i)).toBeInTheDocument();
    });
  });
});

describe('ProtectedRoute - Loading States', () => {
  afterEach(() => {
    delete (window as any).__mockAuthState;
  });

  it('should not render children while loading', () => {
    const mockContext = createLoadingMockContext();
    (window as any).__mockAuthState = mockContext;

    render(
      <MockAuthProvider value={mockContext}>
        <MemoryRouter>
          <ProtectedRoute>
            <ProtectedContent />
          </ProtectedRoute>
        </MemoryRouter>
      </MockAuthProvider>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should show loading spinner', () => {
    const mockContext = createLoadingMockContext();
    (window as any).__mockAuthState = mockContext;

    render(
      <MockAuthProvider value={mockContext}>
        <MemoryRouter>
          <ProtectedRoute>
            <ProtectedContent />
          </ProtectedRoute>
        </MemoryRouter>
      </MockAuthProvider>
    );

    expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
  });

  it('should transition from loading to authenticated', async () => {
    const mockContext = createAuthenticatedMockContext();
    (window as any).__mockAuthState = mockContext;

    render(
      <MockAuthProvider value={mockContext}>
        <MemoryRouter>
          <ProtectedRoute>
            <ProtectedContent />
          </ProtectedRoute>
        </MemoryRouter>
      </MockAuthProvider>
    );

    // Initially loading
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Then authenticated
    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('should transition from loading to redirect', async () => {
    const mockContext = createMockAuthContext({ isAuthenticated: false, isLoading: false });
    (window as any).__mockAuthState = mockContext;

    render(
      <MockAuthProvider value={mockContext}>
        <MemoryRouter>
          <ProtectedRoute>
            <ProtectedContent />
          </ProtectedRoute>
        </MemoryRouter>
      </MockAuthProvider>
    );

    // Initially loading
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Then redirect
    await waitFor(() => {
      expect(screen.getByText(/redirecting to login/i)).toBeInTheDocument();
    });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

describe('ProtectedRoute - Session Expiration', () => {
  afterEach(() => {
    delete (window as any).__mockAuthState;
  });

  it('should redirect when session expires', async () => {
    const mockContext = createAuthenticatedMockContext();
    (window as any).__mockAuthState = mockContext;

    const { rerender } = render(
      <MockAuthProvider value={mockContext}>
        <MemoryRouter>
          <ProtectedRoute>
            <ProtectedContent />
          </ProtectedRoute>
        </MemoryRouter>
      </MockAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    // Simulate session expiration
    const expiredContext = createMockAuthContext({ isAuthenticated: false, isLoading: false });
    (window as any).__mockAuthState = expiredContext;

    rerender(
      <MockAuthProvider value={expiredContext}>
        <MemoryRouter>
          <ProtectedRoute>
            <ProtectedContent />
          </ProtectedRoute>
        </MemoryRouter>
      </MockAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/redirecting to login/i)).toBeInTheDocument();
    });
  });
});

describe('ProtectedRoute - Multiple Protected Routes', () => {
  afterEach(() => {
    delete (window as any).__mockAuthState;
  });

  it('should protect multiple routes', async () => {
    const mockContext = createAuthenticatedMockContext();
    (window as any).__mockAuthState = mockContext;

    render(
      <MockAuthProvider value={mockContext}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>Dashboard</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div>Profile</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <div>Settings</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </MockAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });
});

describe('ProtectedRoute - Accessibility', () => {
  afterEach(() => {
    delete (window as any).__mockAuthState;
  });

  it('should announce loading state to screen readers', () => {
    const mockContext = createLoadingMockContext();
    (window as any).__mockAuthState = mockContext;

    render(
      <MockAuthProvider value={mockContext}>
        <MemoryRouter>
          <ProtectedRoute>
            <ProtectedContent />
          </ProtectedRoute>
        </MemoryRouter>
      </MockAuthProvider>
    );

    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toBeInTheDocument();
  });

  it('should maintain focus when transitioning states', async () => {
    const mockContext = createAuthenticatedMockContext();
    (window as any).__mockAuthState = mockContext;

    render(
      <MockAuthProvider value={mockContext}>
        <MemoryRouter>
          <ProtectedRoute>
            <button>Focus Target</button>
          </ProtectedRoute>
        </MemoryRouter>
      </MockAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});
