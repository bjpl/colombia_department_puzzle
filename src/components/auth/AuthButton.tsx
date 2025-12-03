import { useState } from 'react';
import { User, LogIn } from 'lucide-react';
import { Button } from '../../design-system';
import { cn } from '../../design-system/utils/cn';
import AuthModal, { AuthTab } from './AuthModal';

export interface AuthButtonProps {
  user?: {
    displayName?: string;
    email: string;
    avatarUrl?: string;
  } | null;
  isLoading?: boolean;
  onLogin?: (email: string, password: string) => Promise<void>;
  onSignup?: (email: string, password: string, displayName?: string) => Promise<void>;
  onMagicLink?: (email: string) => Promise<void>;
  onOAuthGoogle?: () => Promise<void>;
  onOAuthGithub?: () => Promise<void>;
  onForgotPassword?: () => void;
  onProfileClick?: () => void;
  className?: string;
  variant?: 'default' | 'compact';
}

/**
 * AuthButton Component
 *
 * Compact authentication button for the header.
 * Shows user avatar/name when logged in, or "Sign In" button when logged out.
 * Opens AuthModal on click.
 *
 * Mobile-optimized with 44x44px minimum touch target.
 */
export default function AuthButton({
  user,
  isLoading = false,
  onLogin: _onLogin,
  onSignup: _onSignup,
  onMagicLink: _onMagicLink,
  onOAuthGoogle: _onOAuthGoogle,
  onOAuthGithub: _onOAuthGithub,
  onForgotPassword: _onForgotPassword,
  onProfileClick,
  className,
  variant = 'default',
}: AuthButtonProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [initialTab, setInitialTab] = useState<AuthTab>('login');

  function handleOpenLogin() {
    setInitialTab('login');
    setShowAuthModal(true);
  }

  function handleUserClick() {
    if (onProfileClick) {
      onProfileClick();
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
    );
  }

  // Logged in state
  if (user) {
    return (
      <>
        <button
          onClick={handleUserClick}
          className={cn(
            'min-w-[44px] min-h-[44px] rounded-full',
            'flex items-center gap-2',
            'bg-gray-100 hover:bg-gray-200',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500',
            variant === 'compact' ? 'p-0' : 'px-3 py-1',
            className
          )}
          aria-label={`Profile: ${user.displayName || user.email}`}
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName || 'User avatar'}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-sky-600" />
            )}
          </div>

          {/* Name (hidden on mobile in compact mode) */}
          {variant === 'default' && (
            <span className="hidden md:inline text-sm font-medium text-gray-900 truncate max-w-[120px]">
              {user.displayName || user.email.split('@')[0]}
            </span>
          )}
        </button>
      </>
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

      {/* Auth Modal */}
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        initialTab={initialTab}
      />
    </>
  );
}
