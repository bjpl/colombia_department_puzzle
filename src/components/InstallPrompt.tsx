import React, { useState, useEffect } from 'react';
import { X, Download, Share } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

interface InstallPromptProps {
  /** Only show after user completes first game */
  showAfterFirstGame?: boolean;
  /** Callback when user installs */
  onInstall?: () => void;
  /** Callback when user dismisses */
  onDismiss?: () => void;
}

const GAME_COMPLETED_KEY = 'game-completed-once';

export function InstallPrompt({
  showAfterFirstGame = true,
  onInstall,
  onDismiss
}: InstallPromptProps) {
  const { isInstallable, isInstalled, promptInstall, dismissInstallPrompt } = usePWA();
  const [shouldShow, setShouldShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Detect iOS
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);
  }, []);

  // Check if should show prompt
  useEffect(() => {
    if (isInstalled) {
      setShouldShow(false);
      return;
    }

    if (showAfterFirstGame) {
      // Only show if user completed at least one game
      const hasCompleted = localStorage.getItem(GAME_COMPLETED_KEY) === 'true';
      if (!hasCompleted) {
        // Listen for first game completion
        const handler = (e: CustomEvent) => {
          if (e.detail.completed) {
            localStorage.setItem(GAME_COMPLETED_KEY, 'true');
            // Show prompt after a short delay to not interrupt celebration
            setTimeout(() => {
              setShouldShow(true);
              setIsAnimating(true);
            }, 2000);
          }
        };

        window.addEventListener('gameCompleted' as any, handler);
        return () => window.removeEventListener('gameCompleted' as any, handler);
      } else {
        // User has completed a game before
        setShouldShow(isInstallable || isIOS);
      }
    } else {
      setShouldShow(isInstallable || isIOS);
    }
  }, [isInstallable, isInstalled, isIOS, showAfterFirstGame]);

  // Animate in after a delay
  useEffect(() => {
    if (shouldShow && !isAnimating) {
      const timer = setTimeout(() => setIsAnimating(true), 300);
      return () => clearTimeout(timer);
    }
  }, [shouldShow, isAnimating]);

  const handleInstall = async () => {
    if (isIOS) {
      // Can't programmatically trigger on iOS, just keep showing instructions
      return;
    }

    const installed = await promptInstall();
    if (installed) {
      onInstall?.();
      setShouldShow(false);
    }
  };

  const handleDismiss = () => {
    dismissInstallPrompt();
    setShouldShow(false);
    setIsAnimating(false);
    onDismiss?.();
  };

  if (!shouldShow) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-out ${
        isAnimating ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{
        // Respect reduced motion preference
        transitionDuration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? '0s' : '500ms'
      }}
    >
      <div className="mx-auto max-w-2xl p-4">
        <div className="relative rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-2xl">
          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute right-3 top-3 rounded-full p-1.5 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
            aria-label="Dismiss install prompt"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="px-6 py-5">
            {isIOS ? (
              // iOS instructions (can't auto-prompt)
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Share className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    Add to Home Screen
                  </h3>
                  <p className="text-sm text-blue-100 mb-3">
                    Install this app on your iPhone for quick access and offline play!
                  </p>
                  <ol className="text-sm text-blue-100 space-y-1 list-decimal list-inside">
                    <li>Tap the Share button <Share className="inline h-4 w-4" /></li>
                    <li>Scroll down and tap "Add to Home Screen"</li>
                    <li>Tap "Add" in the top-right corner</li>
                  </ol>
                </div>
              </div>
            ) : (
              // Android Chrome auto-prompt
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Download className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    Install Colombia Puzzle
                  </h3>
                  <p className="text-sm text-blue-100 mb-4">
                    Install this app for quick access, offline play, and a native app experience!
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleInstall}
                      className="flex-1 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
                    >
                      Install
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="px-4 py-2.5 text-sm font-medium text-white hover:text-blue-100 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md transition-colors"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstallPrompt;

// Helper to trigger install prompt from game completion
export function triggerInstallPromptOnGameComplete() {
  const event = new CustomEvent('gameCompleted', { detail: { completed: true } });
  window.dispatchEvent(event);
}
