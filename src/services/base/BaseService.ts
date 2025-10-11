/**
 * Base Service Class
 *
 * Abstract base class for all services providing common functionality:
 * - Error handling
 * - Retry logic
 * - Authentication checks
 *
 * Based on API Layer Design architecture.
 */

import { ServiceError, ErrorCode } from '../../types/errors';

/**
 * Abstract base service class with common service functionality
 */
export abstract class BaseService {
  // Supabase client will be injected by derived classes
  protected getSupabaseClient(): any {
    if (typeof window !== 'undefined' && (window as any).supabaseClient) {
      return (window as any).supabaseClient;
    }
    throw new Error('Supabase client not initialized');
  }

  /**
   * Execute operation with error handling and retry logic
   */
  protected async executeWithRetry<T>(
    operation: () => Promise<T>,
    retries = 3
  ): Promise<T> {
    let lastError: Error;
    const baseDelay = 1000;
    const maxDelay = 10000;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (this.shouldNotRetry(error)) {
          throw this.handleError(error);
        }

        if (attempt === retries) {
          break;
        }

        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        const jitter = Math.random() * 0.3 * delay;
        await this.sleep(delay + jitter);
      }
    }

    throw this.handleError(lastError!);
  }

  /**
   * Handle and transform errors
   */
  protected handleError(error: unknown): ServiceError {
    if (error instanceof ServiceError) {
      return error;
    }

    if (error && typeof error === 'object' && 'code' in error) {
      return this.transformSupabaseError(error);
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return new ServiceError(
        'Network error. Please check your connection.',
        ErrorCode.NETWORK_ERROR
      );
    }

    return new ServiceError(
      'An unexpected error occurred.',
      ErrorCode.UNKNOWN_ERROR,
      error
    );
  }

  /**
   * Transform Supabase errors to ServiceErrors
   */
  private transformSupabaseError(error: any): ServiceError {
    const { code, message } = error;

    switch (code) {
      case '23505':
        return new ServiceError('This record already exists.', ErrorCode.DUPLICATE_ENTRY, error);
      case '23503':
        return new ServiceError('Referenced record does not exist.', ErrorCode.INVALID_REFERENCE, error);
      case 'PGRST301':
        return new ServiceError('Your session has expired. Please log in again.', ErrorCode.SESSION_EXPIRED, error);
      case '42501':
        return new ServiceError('You do not have permission to perform this action.', ErrorCode.UNAUTHORIZED, error);
      default:
        return new ServiceError(message || 'Database operation failed.', ErrorCode.DATABASE_ERROR, error);
    }
  }

  /**
   * Check if user is authenticated
   */
  protected async requireAuth(): Promise<string> {
    const supabase = this.getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new ServiceError('Authentication required.', ErrorCode.UNAUTHENTICATED);
    }

    return user.id;
  }

  /**
   * Check if error should not be retried
   */
  private shouldNotRetry(error: unknown): boolean {
    if (error && typeof error === 'object') {
      const errorObj = error as any;
      if (errorObj.code === 'PGRST301' || errorObj.code === '401') return true;
      if (errorObj.code === '23505' || errorObj.code === '23503') return true;
      if (errorObj.status === 429) return true;
    }
    return false;
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
