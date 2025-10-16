import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * ProtectedRoute Component
 *
 * Wrapper for routes that require authentication.
 * Redirects to login if not authenticated, preserving the intended destination.
 *
 * @example
 * <Route
 *   path="/profile"
 *   element={
 *     <ProtectedRoute>
 *       <ProfilePage />
 *     </ProtectedRoute>
 *   }
 * />
 */
export default function ProtectedRoute({
  children,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 text-center">
          <div
            className="w-12 h-12 border-4 border-gray-200 border-t-sky-500 rounded-full animate-spin mx-auto"
            role="status"
          />
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated, preserving the intended destination
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Render protected content if authenticated
  return <>{children}</>;
}
