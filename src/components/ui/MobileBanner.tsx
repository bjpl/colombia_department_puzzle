import { useEffect, useState } from 'react';
import {
  Button, Card,
  colors
} from '../../design-system';

/**
 * CONCEPT: Mobile Welcome Banner with Empowering Messaging
 * WHY: Celebrate mobile users and guide them to the touch-optimized experience
 * PATTERN: Positive onboarding that enables rather than discourages mobile play
 */

export default function MobileBanner() {
  const [isMobile, setIsMobile] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the welcome banner
    const dismissed = localStorage.getItem('mobileWelcomeDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    // Detect mobile device
    const checkMobile = () => {
      const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      const isSmallScreen = window.innerWidth < 768;
      const isMobileDevice = mobileCheck || isSmallScreen;

      setIsMobile(isMobileDevice);

      // Show banner briefly for mobile users only
      if (isMobileDevice && !dismissed) {
        setShowBanner(true);
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setShowBanner(false);
          localStorage.setItem('mobileWelcomeDismissed', 'true');
        }, 5000);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    setIsDismissed(true);
    localStorage.setItem('mobileWelcomeDismissed', 'true');
  };

  // Don't show if not mobile, already dismissed, or banner hidden
  if (!isMobile || isDismissed || !showBanner) {
    return null;
  }

  return (
    <div
      className="fixed top-4 left-4 right-4 z-50 flex items-center justify-center animate-slideDown"
      role="alert"
      aria-live="polite"
      aria-labelledby="mobile-welcome-title"
    >
      <Card variant="default" className="max-w-md w-full p-6 bg-gradient-to-r from-emerald-50 to-sky-50 border-2 border-emerald-200 shadow-2xl">
        {/* Celebration Icon */}
        <div className="flex items-start gap-4">
          <div className="text-4xl flex-shrink-0">
            🎉
          </div>

          <div className="flex-1">
            <h2 id="mobile-welcome-title" className="text-xl font-bold text-gray-900 mb-2">
              ¡Optimizado para móvil!
            </h2>

            <p className="text-gray-700 mb-3 text-sm leading-relaxed">
              Toca departamentos para jugar. Desliza para explorar. Todo optimizado para tu pantalla táctil.
            </p>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
              aria-label="Cerrar mensaje de bienvenida"
            >
              Entendido ✓
            </Button>
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              padding: 0,
              minWidth: 'unset'
            }}
            aria-label="Cerrar"
          >
            <svg style={{ width: '14px', height: '14px', color: colors.text.secondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      </Card>

      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}