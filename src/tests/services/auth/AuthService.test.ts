/**
 * AuthService Tests
 *
 * CONCEPT: Comprehensive unit tests for authentication service
 * WHY: Ensures auth operations work correctly with proper error handling
 * PATTERN: Mock Supabase client, test all methods including retry logic
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AuthService } from '../../../services/auth/AuthService';
import { ServiceError, ErrorCode } from '../../../types/errors';
import {
  setupMockSupabaseClient,
  cleanupMockSupabaseClient,
  createMockUser,
  createMockSession,
  mockAuthErrors,
} from '../../utils/authTestUtils';

describe('AuthService - Initialization', () => {
  let authService: AuthService;
  let mockClient: any;

  beforeEach(() => {
    mockClient = setupMockSupabaseClient();
    authService = new AuthService();
  });

  afterEach(() => {
    cleanupMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('should access Supabase client from window', () => {
    expect((window as any).supabaseClient).toBeDefined();
  });

  it('should throw error if Supabase client not initialized', () => {
    cleanupMockSupabaseClient();

    expect(() => {
      (authService as any).getSupabaseClient();
    }).toThrow('Supabase client not initialized');
  });
});

describe('AuthService - Sign Up', () => {
  let authService: AuthService;
  let mockClient: any;

  beforeEach(() => {
    mockClient = setupMockSupabaseClient();
    authService = new AuthService();
  });

  afterEach(() => {
    cleanupMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('should sign up with email and password', async () => {
    const mockUser = createMockUser();
    mockClient.auth.signUp.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const result = await authService.signUp('test@example.com', 'password123');

    expect(result).toEqual(mockUser);
    expect(mockClient.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      options: {
        data: {
          display_name: undefined,
        },
        emailRedirectTo: expect.stringContaining('/auth/callback'),
      },
    });
  });

  it('should sign up with display name', async () => {
    const mockUser = createMockUser({ user_metadata: { display_name: 'Test User' } });
    mockClient.auth.signUp.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const result = await authService.signUp('test@example.com', 'password123', 'Test User');

    expect(result.user_metadata.display_name).toBe('Test User');
    expect(mockClient.auth.signUp).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          data: { display_name: 'Test User' },
        }),
      })
    );
  });

  it('should throw error on signup failure', async () => {
    mockClient.auth.signUp.mockResolvedValue({
      data: { user: null },
      error: mockAuthErrors.emailExists,
    });

    await expect(
      authService.signUp('existing@example.com', 'password123')
    ).rejects.toThrow();
  });

  it('should throw error if no user returned', async () => {
    mockClient.auth.signUp.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    await expect(
      authService.signUp('test@example.com', 'password123')
    ).rejects.toThrow(ServiceError);
  });

  it('should retry on transient errors', async () => {
    const mockUser = createMockUser();

    // Fail twice, succeed on third attempt
    mockClient.auth.signUp
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

    const result = await authService.signUp('test@example.com', 'password123');

    expect(result).toEqual(mockUser);
    expect(mockClient.auth.signUp).toHaveBeenCalledTimes(3);
  });

  it('should not retry on authentication errors', async () => {
    mockClient.auth.signUp.mockResolvedValue({
      data: { user: null },
      error: mockAuthErrors.weakPassword,
    });

    await expect(
      authService.signUp('test@example.com', 'weak')
    ).rejects.toThrow();

    expect(mockClient.auth.signUp).toHaveBeenCalledTimes(1);
  });
});

describe('AuthService - Sign In', () => {
  let authService: AuthService;
  let mockClient: any;

  beforeEach(() => {
    mockClient = setupMockSupabaseClient();
    authService = new AuthService();
  });

  afterEach(() => {
    cleanupMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('should sign in with email and password', async () => {
    const mockSession = createMockSession();
    mockClient.auth.signInWithPassword.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    const result = await authService.signIn('test@example.com', 'password123');

    expect(result).toEqual(mockSession);
    expect(mockClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should throw ServiceError on invalid credentials', async () => {
    mockClient.auth.signInWithPassword.mockResolvedValue({
      data: { session: null },
      error: mockAuthErrors.invalidCredentials,
    });

    await expect(
      authService.signIn('wrong@example.com', 'wrongpass')
    ).rejects.toThrow(ServiceError);

    await expect(
      authService.signIn('wrong@example.com', 'wrongpass')
    ).rejects.toMatchObject({
      code: ErrorCode.INVALID_CREDENTIALS,
      message: 'Invalid email or password.',
    });
  });

  it('should throw error if no session returned', async () => {
    mockClient.auth.signInWithPassword.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    await expect(
      authService.signIn('test@example.com', 'password123')
    ).rejects.toThrow(ServiceError);
  });

  it('should retry on network errors', async () => {
    const mockSession = createMockSession();

    mockClient.auth.signInWithPassword
      .mockRejectedValueOnce(mockAuthErrors.networkError)
      .mockResolvedValueOnce({
        data: { session: mockSession },
        error: null,
      });

    const result = await authService.signIn('test@example.com', 'password123');

    expect(result).toEqual(mockSession);
    expect(mockClient.auth.signInWithPassword).toHaveBeenCalledTimes(2);
  });
});

describe('AuthService - Magic Link', () => {
  let authService: AuthService;
  let mockClient: any;

  beforeEach(() => {
    mockClient = setupMockSupabaseClient();
    authService = new AuthService();
  });

  afterEach(() => {
    cleanupMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('should send magic link', async () => {
    mockClient.auth.signInWithOtp.mockResolvedValue({
      data: {},
      error: null,
    });

    await authService.signInWithMagicLink('test@example.com');

    expect(mockClient.auth.signInWithOtp).toHaveBeenCalledWith({
      email: 'test@example.com',
      options: {
        emailRedirectTo: expect.stringContaining('/auth/callback'),
      },
    });
  });

  it('should throw error on magic link failure', async () => {
    mockClient.auth.signInWithOtp.mockResolvedValue({
      data: {},
      error: mockAuthErrors.invalidEmail,
    });

    await expect(
      authService.signInWithMagicLink('invalid-email')
    ).rejects.toThrow();
  });
});

describe('AuthService - OAuth', () => {
  let authService: AuthService;
  let mockClient: any;

  beforeEach(() => {
    mockClient = setupMockSupabaseClient();
    authService = new AuthService();
  });

  afterEach(() => {
    cleanupMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('should sign in with Google OAuth', async () => {
    mockClient.auth.signInWithOAuth.mockResolvedValue({
      data: {},
      error: null,
    });

    await authService.signInWithOAuth('google');

    expect(mockClient.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: expect.stringContaining('/auth/callback'),
      },
    });
  });

  it('should sign in with GitHub OAuth', async () => {
    mockClient.auth.signInWithOAuth.mockResolvedValue({
      data: {},
      error: null,
    });

    await authService.signInWithOAuth('github');

    expect(mockClient.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'github',
      options: {
        redirectTo: expect.stringContaining('/auth/callback'),
      },
    });
  });

  it('should throw error on OAuth failure', async () => {
    const oauthError = { message: 'OAuth failed', code: 'oauth_error' };
    mockClient.auth.signInWithOAuth.mockResolvedValue({
      data: {},
      error: oauthError,
    });

    await expect(
      authService.signInWithOAuth('google')
    ).rejects.toThrow();
  });
});

describe('AuthService - Sign Out', () => {
  let authService: AuthService;
  let mockClient: any;

  beforeEach(() => {
    mockClient = setupMockSupabaseClient();
    authService = new AuthService();
  });

  afterEach(() => {
    cleanupMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('should sign out', async () => {
    mockClient.auth.signOut.mockResolvedValue({
      error: null,
    });

    await authService.signOut();

    expect(mockClient.auth.signOut).toHaveBeenCalled();
  });

  it('should throw error on signout failure', async () => {
    const signOutError = { message: 'Signout failed', code: 'signout_error' };
    mockClient.auth.signOut.mockResolvedValue({
      error: signOutError,
    });

    await expect(authService.signOut()).rejects.toThrow();
  });
});

describe('AuthService - Session Management', () => {
  let authService: AuthService;
  let mockClient: any;

  beforeEach(() => {
    mockClient = setupMockSupabaseClient();
    authService = new AuthService();
  });

  afterEach(() => {
    cleanupMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('should get current session', async () => {
    const mockSession = createMockSession();
    mockClient.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    const result = await authService.getSession();

    expect(result).toEqual(mockSession);
  });

  it('should return null if no session', async () => {
    mockClient.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const result = await authService.getSession();

    expect(result).toBeNull();
  });

  it('should get current user', async () => {
    const mockUser = createMockUser();
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const result = await authService.getCurrentUser();

    expect(result).toEqual(mockUser);
  });

  it('should return null if no user', async () => {
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const result = await authService.getCurrentUser();

    expect(result).toBeNull();
  });

  it('should refresh session', async () => {
    const mockSession = createMockSession();
    mockClient.auth.refreshSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    const result = await authService.refreshSession();

    expect(result).toEqual(mockSession);
  });

  it('should throw error on refresh failure', async () => {
    mockClient.auth.refreshSession.mockResolvedValue({
      data: { session: null },
      error: mockAuthErrors.sessionExpired,
    });

    await expect(authService.refreshSession()).rejects.toThrow(ServiceError);
  });
});

describe('AuthService - User Updates', () => {
  let authService: AuthService;
  let mockClient: any;

  beforeEach(() => {
    mockClient = setupMockSupabaseClient();
    authService = new AuthService();
  });

  afterEach(() => {
    cleanupMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('should update email', async () => {
    const mockUser = createMockUser({ email: 'newemail@example.com' });
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: createMockUser() },
      error: null,
    });
    mockClient.auth.updateUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const result = await authService.updateEmail('newemail@example.com');

    expect(result.email).toBe('newemail@example.com');
    expect(mockClient.auth.updateUser).toHaveBeenCalledWith({
      email: 'newemail@example.com',
    });
  });

  it('should require authentication for email update', async () => {
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    await expect(
      authService.updateEmail('newemail@example.com')
    ).rejects.toThrow(ServiceError);
  });

  it('should update password', async () => {
    const mockUser = createMockUser();
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
    mockClient.auth.updateUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const result = await authService.updatePassword('newpassword123');

    expect(result).toEqual(mockUser);
    expect(mockClient.auth.updateUser).toHaveBeenCalledWith({
      password: 'newpassword123',
    });
  });

  it('should require authentication for password update', async () => {
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    await expect(
      authService.updatePassword('newpassword')
    ).rejects.toThrow(ServiceError);
  });
});

describe('AuthService - Password Reset', () => {
  let authService: AuthService;
  let mockClient: any;

  beforeEach(() => {
    mockClient = setupMockSupabaseClient();
    authService = new AuthService();
  });

  afterEach(() => {
    cleanupMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('should request password reset', async () => {
    mockClient.auth.resetPasswordForEmail.mockResolvedValue({
      data: {},
      error: null,
    });

    await authService.requestPasswordReset('test@example.com');

    expect(mockClient.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      'test@example.com',
      {
        redirectTo: expect.stringContaining('/auth/reset-password'),
      }
    );
  });

  it('should throw error on reset request failure', async () => {
    mockClient.auth.resetPasswordForEmail.mockResolvedValue({
      data: {},
      error: mockAuthErrors.invalidEmail,
    });

    await expect(
      authService.requestPasswordReset('invalid-email')
    ).rejects.toThrow();
  });
});

describe('AuthService - Error Handling', () => {
  let authService: AuthService;
  let mockClient: any;

  beforeEach(() => {
    mockClient = setupMockSupabaseClient();
    authService = new AuthService();
  });

  afterEach(() => {
    cleanupMockSupabaseClient();
    vi.clearAllMocks();
  });

  it('should handle network errors', async () => {
    mockClient.auth.signIn.mockRejectedValue(mockAuthErrors.networkError);

    await expect(
      authService.signIn('test@example.com', 'password')
    ).rejects.toThrow();
  });

  it('should retry with exponential backoff', async () => {
    const mockSession = createMockSession();
    const startTime = Date.now();

    // Fail twice with network error, succeed on third
    mockClient.auth.signInWithPassword
      .mockRejectedValueOnce(mockAuthErrors.networkError)
      .mockRejectedValueOnce(mockAuthErrors.networkError)
      .mockResolvedValueOnce({
        data: { session: mockSession },
        error: null,
      });

    const result = await authService.signIn('test@example.com', 'password123');
    const duration = Date.now() - startTime;

    expect(result).toEqual(mockSession);
    // Should have delays (1s + 2s + jitter) ~3000ms minimum
    expect(duration).toBeGreaterThan(2000);
  });

  it('should stop retrying after max attempts', async () => {
    mockClient.auth.signInWithPassword.mockRejectedValue(mockAuthErrors.networkError);

    await expect(
      authService.signIn('test@example.com', 'password')
    ).rejects.toThrow();

    // 1 initial + 3 retries = 4 total
    expect(mockClient.auth.signInWithPassword).toHaveBeenCalledTimes(4);
  });
});
