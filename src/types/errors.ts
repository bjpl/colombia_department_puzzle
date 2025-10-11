/**
 * Error Handling Types
 *
 * Consistent error handling across the application.
 * Based on API Layer Design architecture.
 */

/**
 * Error codes for different error types
 */
export enum ErrorCode {
  // Authentication errors
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',

  // Database errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  INVALID_REFERENCE = 'INVALID_REFERENCE',
  NOT_FOUND = 'NOT_FOUND',

  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',

  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Custom service error class with user-friendly messages
 */
export class ServiceError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ServiceError';
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    switch (this.code) {
      case ErrorCode.UNAUTHENTICATED:
        return 'Please log in to continue.';
      case ErrorCode.UNAUTHORIZED:
        return 'You do not have permission to perform this action.';
      case ErrorCode.SESSION_EXPIRED:
        return 'Your session has expired. Please log in again.';
      case ErrorCode.NETWORK_ERROR:
        return 'Network error. Please check your internet connection.';
      case ErrorCode.RATE_LIMIT_EXCEEDED:
        return 'Too many requests. Please try again later.';
      case ErrorCode.INVALID_CREDENTIALS:
        return 'Invalid email or password.';
      default:
        return this.message;
    }
  }
}
