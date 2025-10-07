import { useState, useEffect, useCallback } from 'react';

export interface PWAState {
  isOnline: boolean;
  isInstalled: boolean;
  isInstallable: boolean;
  updateAvailable: boolean;
  deferredPrompt: any;
}

export interface PWAActions {
  promptInstall: () => Promise<boolean>;
  dismissInstallPrompt: () => void;
  checkForUpdates: () => void;
}

const INSTALL_DISMISSED_KEY = 'pwa-install-dismissed';
const INSTALL_DISMISSED_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function usePWA(): PWAState & PWAActions {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Check if app is installed
  useEffect(() => {
    // Check if running in standalone mode (installed PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;

    setIsInstalled(isStandalone || isIOSStandalone);
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Listen for beforeinstallprompt event (Android Chrome)
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();

      // Check if install prompt was recently dismissed
      const dismissedTime = localStorage.getItem(INSTALL_DISMISSED_KEY);
      if (dismissedTime) {
        const elapsed = Date.now() - parseInt(dismissedTime, 10);
        if (elapsed < INSTALL_DISMISSED_DURATION) {
          return; // Don't show prompt yet
        }
      }

      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  // Listen for app installed event
  useEffect(() => {
    const handler = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      localStorage.removeItem(INSTALL_DISMISSED_KEY);
    };

    window.addEventListener('appinstalled', handler);

    return () => {
      window.removeEventListener('appinstalled', handler);
    };
  }, []);

  // Listen for service worker updates
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.ready.then((registration) => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        }
      });
    });
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
      return true;
    } else {
      dismissInstallPrompt();
      return false;
    }
  }, [deferredPrompt]);

  const dismissInstallPrompt = useCallback(() => {
    localStorage.setItem(INSTALL_DISMISSED_KEY, Date.now().toString());
    setIsInstallable(false);
  }, []);

  const checkForUpdates = useCallback(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.ready.then((registration) => {
      registration.update();
    });
  }, []);

  return {
    isOnline,
    isInstalled,
    isInstallable,
    updateAvailable,
    deferredPrompt,
    promptInstall,
    dismissInstallPrompt,
    checkForUpdates,
  };
}

export default usePWA;
