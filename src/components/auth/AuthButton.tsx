import { useState } from 'react';
import { User, LogIn } from 'lucide-react';
import { Button } from '../../design-system';
import { cn } from '../../design-system/utils/cn';
import { useAuth } from '../../hooks/useAuth';
import AuthModal, { AuthTab } from './AuthModal';

export interface AuthButtonProps {
  className?: string;
  variant?: 'default' | 'compact';
}

/**
 * AuthButton Component
 *
 * Compact authentication button for the header.
 * Shows user avatar/name when logged in, or "Sign In" button when logged out.
 * Opens AuthModal on click. Connects directly to AuthContext.
 *
 * Mobile-optimized with 44x44px minimum touch target.
 */
export default function AuthButton({
  className,
  variant = 'default',
}: AuthButtonProps) {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [initialTab, setInitialTab] = useState<AuthTab>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);

  function handleOpenLogin() {
    setInitialTab('login');
    setShowAuthModal(true);
  }

  function handleSignOut() {
    setShowUserMenu(false);
    signOut();
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
    );
  }

  // Logged in state
  if (isAuthenticated && user) {
    const displayName = user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

    return (
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={cn(
            'min-w-[44px] min-h-[44px] rounded-full',
            'flex items-center gap-2',
            'bg-gray-100 hover:bg-gray-200',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500',
            variant === 'compact' ? 'p-0' : 'px-3 py-1',
            className
          )}
          aria-label={`Profile: ${displayName}`}
          aria-expanded={showUserMenu}
        >
          <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className="w-4 h-4 text-sky-600" />
            )}
          </div>

          {variant === 'default' && (
            <span className="hidden md:inline text-sm font-medium text-gray-900 truncate max-w-[120px]">
              {displayName}
            </span>
          )}
        </button>

        {/* User dropdown menu */}
        {showUserMenu && (
          <>
            {/* Backdrop to close menu */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowUserMenu(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors min-h-[44px] flex items-center"
              >
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Logged out state
  return (
    <>
      <Button
        variant="primary"
        size="sm"
        onClick={handleOpenLogin}
        icon={<LogIn className="w-4 h-4" />}
        className={cn('min-h-[44px]', className)}
      >
        <span className="hidden sm:inline">Sign In</span>
      </Button>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        initialTab={initialTab}
      />
    </>
  );
}
