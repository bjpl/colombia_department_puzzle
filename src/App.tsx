import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import GameContainer from './components/layout/GameContainer';
import { GameProvider } from './context/GameContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import MobileBanner from './components/ui/MobileBanner';
import { keyboardManager } from './services/keyboardManager';
// PWA Components from Agent 3
import { InstallPrompt } from './components/ui/InstallPrompt';
import { UpdateNotification } from './components/ui/UpdateNotification';
import { OfflineIndicator } from './components/feedback/OfflineIndicator';
// Version management
import { checkVersionChange, logVersionInfo } from './utils/version';
// Cache debugging utilities (only in development)
import { registerDebugUtils } from './utils/cacheDebug';
// Auth route components (lazy loaded - only needed on auth redirect)
const AuthCallback = lazy(() => import('./components/auth/AuthCallback'));
const ResetPassword = lazy(() => import('./components/auth/ResetPassword'));

function App() {
  useEffect(() => {
    // Initialize keyboard manager - singleton ensures it's only done once
    keyboardManager.setEnabled(true);

    // Check for version changes and clear caches if needed
    const versionChanged = checkVersionChange();
    if (versionChanged && import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('[App] Version change detected - caches cleared');
    }

    // Log version info for debugging
    logVersionInfo();

    // Register cache debug utilities (available in console)
    if (import.meta.env.DEV || window.location.search.includes('debug')) {
      registerDebugUtils();
    }
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter basename="/colombia_department_puzzle">
        <AuthProvider>
          <AccessibilityProvider>
            <GameProvider>
              {/* WCAG 2.4.1 Level A: Skip Links for Keyboard Navigation */}
              <div className="skip-links">
                <a href="#main-content" className="skip-link">
                  Saltar al contenido principal
                </a>
                <a href="#department-tray" className="skip-link">
                  Saltar a departamentos
                </a>
                <a href="#colombia-map" className="skip-link">
                  Saltar al mapa
                </a>
              </div>

              <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 overflow-x-hidden">
                {/* PWA Status Indicators */}
                <OfflineIndicator />
                <UpdateNotification />

                {/* Mobile Welcome Banner */}
                <MobileBanner />

                {/* Main App Routes */}
                <Routes>
                  <Route path="/" element={<GameContainer />} />
                  <Route
                    path="/auth/callback"
                    element={
                      <Suspense fallback={
                        <div className="min-h-screen flex items-center justify-center">
                          <div className="animate-pulse text-gray-500">Loading...</div>
                        </div>
                      }>
                        <AuthCallback />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/auth/reset-password"
                    element={
                      <Suspense fallback={
                        <div className="min-h-screen flex items-center justify-center">
                          <div className="animate-pulse text-gray-500">Loading...</div>
                        </div>
                      }>
                        <ResetPassword />
                      </Suspense>
                    }
                  />
                  <Route path="*" element={<GameContainer />} />
                </Routes>

                {/* PWA Install Prompt (shows after first game completion) */}
                <InstallPrompt showAfterFirstGame={true} />
              </div>
            </GameProvider>
          </AccessibilityProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
