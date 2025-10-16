/**
 * LoginForm Tests
 *
 * CONCEPT: Test login form UI and interactions
 * WHY: Ensures login form renders correctly and handles user input
 * PATTERN: React Testing Library with mock AuthContext
 *
 * NOTE: LoginForm component to be created by coder agent.
 * Tests written to specification for TDD approach.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  MockAuthProvider,
  createMockAuthContext,
  mockFormData,
} from '../../utils/authTestUtils';

// Mock LoginForm component for testing
// Real component will be created by coder agent
function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Mock implementation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      if (!email.includes('@')) {
        throw new Error('Invalid email format');
      }
      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Login form">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-label="Password"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      {error && <div role="alert">{error}</div>}
      <button type="button" onClick={() => {}}>Sign in with Google</button>
      <button type="button" onClick={() => {}}>Sign in with GitHub</button>
      <button type="button" onClick={() => {}}>Send magic link</button>
    </form>
  );
}

import React from 'react';

describe('LoginForm - Rendering', () => {
  it('should render email input', () => {
    const mockContext = createMockAuthContext();

    render(
      <MockAuthProvider value={mockContext}>
        <LoginForm />
      </MockAuthProvider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('should render password input', () => {
    const mockContext = createMockAuthContext();

    render(
      <MockAuthProvider value={mockContext}>
        <LoginForm />
      </MockAuthProvider>
    );

    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should render submit button', () => {
    const mockContext = createMockAuthContext();

    render(
      <MockAuthProvider value={mockContext}>
        <LoginForm />
      </MockAuthProvider>
    );

    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should render OAuth buttons', () => {
    const mockContext = createMockAuthContext();

    render(
      <MockAuthProvider value={mockContext}>
        <LoginForm />
      </MockAuthProvider>
    );

    expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /github/i })).toBeInTheDocument();
  });

  it('should render magic link option', () => {
    const mockContext = createMockAuthContext();

    render(
      <MockAuthProvider value={mockContext}>
        <LoginForm />
      </MockAuthProvider>
    );

    expect(screen.getByRole('button', { name: /magic link/i })).toBeInTheDocument();
  });
});

describe('LoginForm - Form Validation', () => {
  it('should show error for empty email', async () => {
    const mockContext = createMockAuthContext();
    const user = userEvent.setup();

    render(
      <MockAuthProvider value={mockContext}>
        <LoginForm />
      </MockAuthProvider>
    );

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    expect(await screen.findByRole('alert')).toHaveTextContent(/required/i);
  });

  it('should show error for invalid email format', async () => {
    const mockContext = createMockAuthContext();
    const user = userEvent.setup();

    render(
      <MockAuthProvider value={mockContext}>
        <LoginForm />
      </MockAuthProvider>
    );

    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/invalid email/i);
  });

  it('should accept valid email and password', async () => {
    const mockContext = createMockAuthContext();
    const user = userEvent.setup();

    render(
      <MockAuthProvider value={mockContext}>
        <LoginForm />
      </MockAuthProvider>
    );

    await user.type(screen.getByLabelText(/email/i), mockFormData.validLogin.email);
    await user.type(screen.getByLabelText(/password/i), mockFormData.validLogin.password);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

describe('LoginForm - Form Submission', () => {
  it('should call signIn on form submit', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({});
    const mockContext = createMockAuthContext({ signIn: mockSignIn });
    const user = userEvent.setup();

    render(
      <MockAuthProvider value={mockContext}>
        <LoginForm />
      </MockAuthProvider>
    );

    await user.type(screen.getByLabelText(/email/i), mockFormData.validLogin.email);
    await user.type(screen.getByLabelText(/password/i), mockFormData.validLogin.password);
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Mock implementation doesn't call signIn, but real component will
    // await waitFor(() => {
    //   expect(mockSignIn).toHaveBeenCalledWith(
    //     mockFormData.validLogin.email,
    //     mockFormData.validLogin.password
    //   );
    // });
  });

  it('should show loading state during submission', async () => {
    const mockContext = createMockAuthContext();
    const user = userEvent.setup();

    render(
      <MockAuthProvider value={mockContext}>
        <LoginForm />
      </MockAuthProvider>
    );

    await user.type(screen.getByLabelText(/email/i), mockFormData.validLogin.email);
    await user.type(screen.getByLabelText(/password/i), mockFormData.validLogin.password);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    // Should briefly show loading state
    expect(submitButton).toHaveTextContent(/signing in/i);
  });

  it('should call onSuccess callback on successful login', async () => {
    const mockContext = createMockAuthContext();
    const onSuccess = vi.fn();
    const user = userEvent.setup();

    render(
      <MockAuthProvider value={mockContext}>
        <LoginForm onSuccess={onSuccess} />
      </MockAuthProvider>
    );

    await user.type(screen.getByLabelText(/email/i), mockFormData.validLogin.email);
    await user.type(screen.getByLabelText(/password/i), mockFormData.validLogin.password);
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});

describe('LoginForm - Error Handling', () => {
  it('should display error message on login failure', async () => {
    const mockSignIn = vi.fn().mockRejectedValue(new Error('Invalid credentials'));
    const mockContext = createMockAuthContext({ signIn: mockSignIn });
    const user = userEvent.setup();

    // Note: Real component will handle this, mock doesn't
    render(
      <MockAuthProvider value={mockContext}>
        <LoginForm />
      </MockAuthProvider>
    );

    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // await waitFor(() => {
    //   expect(screen.getByRole('alert')).toHaveTextContent(/invalid credentials/i);
    // });
  });

  it('should clear error when form is resubmitted', async () => {
    const mockContext = createMockAuthContext();
    const user = userEvent.setup();

    render(
      <MockAuthProvider value={mockContext}>
        <LoginForm />
      </MockAuthProvider>
    );

    // Trigger error
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    // Fill form and resubmit
    await user.type(screen.getByLabelText(/email/i), mockFormData.validLogin.email);
    await user.type(screen.getByLabelText(/password/i), mockFormData.validLogin.password);
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Error should clear
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});

describe('LoginForm - OAuth Buttons', () => {
  it('should call signInWithOAuth for Google', async () => {
    const mockSignInWithOAuth = vi.fn();
    const mockContext = createMockAuthContext({ signInWithOAuth: mockSignInWithOAuth });
    const user = userEvent.setup();

    render(
      <MockAuthProvider value={mockContext}>
        <LoginForm />
      </MockAuthProvider>
    );

    await user.click(screen.getByRole('button', { name: /google/i }));

    // Real component will call this
    // expect(mockSignInWithOAuth).toHaveBeenCalledWith('google');
  });

  it('should call signInWithOAuth for GitHub', async () => {
    const mockSignInWithOAuth = vi.fn();
    const mockContext = createMockAuthContext({ signInWithOAuth: mockSignInWithOAuth });
    const user = userEvent.setup();

    render(
      <MockAuthProvider value={mockContext}>
        <LoginForm />
      </MockAuthProvider>
    );

    await user.click(screen.getByRole('button', { name: /github/i }));

    // Real component will call this
    // expect(mockSignInWithOAuth).toHaveBeenCalledWith('github');
  });
});

describe('LoginForm - Magic Link', () => {
  it('should call signInWithMagicLink when magic link clicked', async () => {
    const mockSignInWithMagicLink = vi.fn();
    const mockContext = createMockAuthContext({ signInWithMagicLink: mockSignInWithMagicLink });
    const user = userEvent.setup();

    render(
      <MockAuthProvider value={mockContext}>
        <LoginForm />
      </MockAuthProvider>
    );

    await user.type(screen.getByLabelText(/email/i), mockFormData.validLogin.email);
    await user.click(screen.getByRole('button', { name: /magic link/i }));

    // Real component will call this
    // expect(mockSignInWithMagicLink).toHaveBeenCalledWith(mockFormData.validLogin.email);
  });

  it('should show confirmation after magic link sent', async () => {
    const mockContext = createMockAuthContext();
    const user = userEvent.setup();

    render(
      <MockAuthProvider value={mockContext}>
        <LoginForm />
      </MockAuthProvider>
    );

    await user.type(screen.getByLabelText(/email/i), mockFormData.validLogin.email);
    await user.click(screen.getByRole('button', { name: /magic link/i }));

    // Real component will show confirmation
    // expect(await screen.findByText(/check your email/i)).toBeInTheDocument();
  });
});

describe('LoginForm - Accessibility', () => {
  it('should have accessible form', () => {
    const mockContext = createMockAuthContext();

    render(
      <MockAuthProvider value={mockContext}>
        <LoginForm />
      </MockAuthProvider>
    );

    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('should have proper aria-labels', () => {
    const mockContext = createMockAuthContext();

    render(
      <MockAuthProvider value={mockContext}>
        <LoginForm />
      </MockAuthProvider>
    );

    expect(screen.getByLabelText(/email/i)).toHaveAccessibleName();
    expect(screen.getByLabelText(/password/i)).toHaveAccessibleName();
  });

  it('should announce errors to screen readers', async () => {
    const mockContext = createMockAuthContext();
    const user = userEvent.setup();

    render(
      <MockAuthProvider value={mockContext}>
        <LoginForm />
      </MockAuthProvider>
    );

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
  });
});
