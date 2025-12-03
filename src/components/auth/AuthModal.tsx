import { useState, useEffect } from 'react';
import { Modal } from '../../design-system';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { cn } from '../../design-system/utils/cn';

export type AuthTab = 'login' | 'signup';

export interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: AuthTab;
  onSuccess?: () => void;
}

export default function AuthModal({
  open,
  onOpenChange,
  initialTab = 'login',
  onSuccess,
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);

  // Reset tab when modal opens
  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

  // Use native mobile bottom sheet on small screens
  // const _isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      showCloseButton={true}
    >
      <div className="space-y-6">
        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setActiveTab('login')}
            className={cn(
              'flex-1 min-h-[44px] px-4 rounded-lg font-medium transition-all',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500',
              activeTab === 'login'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )}
            aria-selected={activeTab === 'login'}
            role="tab"
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={cn(
              'flex-1 min-h-[44px] px-4 rounded-lg font-medium transition-all',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500',
              activeTab === 'signup'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )}
            aria-selected={activeTab === 'signup'}
            role="tab"
          >
            Sign Up
          </button>
        </div>

        {/* Tab Content */}
        <div role="tabpanel">
          {activeTab === 'login' ? (
            <LoginForm
              onSuccess={onSuccess}
              className="shadow-none border-0"
            />
          ) : (
            <SignupForm
              onSuccess={onSuccess}
              className="shadow-none border-0"
            />
          )}
        </div>

        {/* Switch Tab Link */}
        <div className="text-center text-sm text-gray-600">
          {activeTab === 'login' ? (
            <p>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => setActiveTab('signup')}
                className="text-sky-600 hover:text-sky-800 font-medium underline min-h-[44px] inline-flex items-center px-2"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setActiveTab('login')}
                className="text-sky-600 hover:text-sky-800 font-medium underline min-h-[44px] inline-flex items-center px-2"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
