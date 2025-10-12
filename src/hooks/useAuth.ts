/**
 * useAuth Hook
 *
 * Custom hook to access authentication context and methods.
 * Provides type-safe access to auth state and operations.
 *
 * Based on API Layer Design architecture.
 * Follows pattern from existing hooks in the codebase.
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { AuthContextType } from '../types/auth';

/**
 * Hook to access authentication context
 *
 * @throws Error if used outside AuthProvider
 * @returns Authentication state and methods
 *
 * @example
 * ```tsx
 * function ProfilePage() {
 *   const { user, isAuthenticated, signOut } = useAuth();
 *
 *   if (!isAuthenticated) {
 *     return <Navigate to="/login" />;
 *   }
 *
 *   return (
 *     <div>
 *       <h1>Welcome, {user.email}</h1>
 *       <button onClick={signOut}>Sign Out</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
