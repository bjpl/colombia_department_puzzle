import { useEffect, useState } from 'react';
import {
  Button, Card, CardHeader, CardTitle, CardContent, Badge,
  colors, spacing, textStyles, shadows
} from '../design-system';

/**
 * CONCEPT: Mobile Device Detection and Desktop Redirect Banner
 * WHY: The game requires precise drag-and-drop interactions better suited for desktop
 * PATTERN: Responsive design pattern with graceful degradation for mobile users
 */

export default function MobileBanner() {
  const [isMobile, setIsMobile] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the banner
    const dismissed = localStorage.getItem('mobileBannerDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }

    // Detect mobile device
    const checkMobile = () => {
      const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      // Also check viewport width
      const isSmallScreen = window.innerWidth < 768;

      setIsMobile(mobileCheck || isSmallScreen);
    };

    checkMobile();

    // Re-check on resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('mobileBannerDismissed', 'true');
  };

  // Don't show if not mobile or already dismissed
  if (!isMobile || isDismissed) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4"
      role="dialog"
      aria-labelledby="mobile-banner-title"
      aria-describedby="mobile-banner-description"
    >
      <Card variant="default" className="max-w-md w-full p-8 text-center">
        {/* Colombian Flag Colors as accent */}
        <div className="flex justify-center mb-6">
          <div className="w-full h-2 flex rounded-full overflow-hidden shadow-md">
            <div className="flex-1 bg-yellow-400"></div>
            <div className="flex-1 bg-blue-600"></div>
            <div className="flex-1 bg-red-500"></div>
          </div>
        </div>

        {/* Icon */}
        <div className="text-6xl mb-4">
          🖥️
        </div>

        <h1 id="mobile-banner-title" className="text-2xl font-bold text-gray-900 mb-4">
          Mejor Experiencia en Desktop
        </h1>

        <p id="mobile-banner-description" className="text-gray-600 mb-6 leading-relaxed">
          El Rompecabezas de Colombia está optimizado para computadores de escritorio
          donde puedes arrastrar y soltar los departamentos con precisión.
        </p>

        <Card variant="default" className="bg-blue-50 p-4 mb-6">
          <p className="text-sm text-blue-900 font-medium mb-2">
            📧 Envíate el enlace por correo
          </p>
          <p className="text-sm text-blue-600">
            Visita este juego en tu computador para la mejor experiencia
          </p>
          <div className="mt-3 bg-white rounded p-2 px-3 font-mono text-sm text-gray-600 break-all">
            {window.location.href}
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={handleDismiss}
            className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 font-semibold shadow-lg"
            aria-label="Continuar al juego en dispositivo móvil"
          >
            Continuar de Todos Modos
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              // Copy URL to clipboard
              navigator.clipboard.writeText(window.location.href);
              alert('¡Enlace copiado al portapapeles!');
            }}
            className="w-full bg-white text-gray-600 border-2 border-gray-300 font-medium"
            aria-label="Copiar enlace del juego al portapapeles"
          >
            📋 Copiar Enlace
          </Button>
        </div>

        <p className="text-sm text-gray-400 mt-6">
          💡 Tip: El juego funciona mejor con un mouse o trackpad
        </p>
      </Card>
    </div>
  );
}