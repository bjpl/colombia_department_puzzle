import { useEffect, useState } from 'react';

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
      className="fixed inset-0 bg-gradient-to-br from-blue-50 to-green-50 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-labelledby="mobile-banner-title"
      aria-describedby="mobile-banner-description"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Colombian Flag Colors as accent */}
        <div className="flex justify-center mb-6">
          <div className="w-full h-2 flex rounded-full overflow-hidden shadow-md">
            <div className="flex-1 bg-yellow-400"></div>
            <div className="flex-1 bg-blue-600"></div>
            <div className="flex-1 bg-red-600"></div>
          </div>
        </div>

        {/* Icon */}
        <div className="text-6xl mb-4">
          🖥️
        </div>

        <h1 id="mobile-banner-title" className="text-2xl font-bold text-gray-800 mb-4">
          Mejor Experiencia en Desktop
        </h1>

        <p id="mobile-banner-description" className="text-gray-600 mb-6 leading-relaxed">
          El Rompecabezas de Colombia está optimizado para computadores de escritorio
          donde puedes arrastrar y soltar los departamentos con precisión.
        </p>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 font-medium mb-2">
            📧 Envíate el enlace por correo
          </p>
          <p className="text-xs text-blue-600">
            Visita este juego en tu computador para la mejor experiencia
          </p>
          <div className="mt-3 bg-white rounded px-3 py-2 font-mono text-xs text-gray-700 break-all">
            {window.location.href}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleDismiss}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all shadow-lg font-semibold"
            aria-label="Continuar al juego en dispositivo móvil"
          >
            Continuar de Todos Modos
          </button>

          <button
            onClick={() => {
              // Copy URL to clipboard
              navigator.clipboard.writeText(window.location.href);
              alert('¡Enlace copiado al portapapeles!');
            }}
            className="w-full px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            aria-label="Copiar enlace del juego al portapapeles"
          >
            📋 Copiar Enlace
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          💡 Tip: El juego funciona mejor con un mouse o trackpad
        </p>
      </div>
    </div>
  );
}