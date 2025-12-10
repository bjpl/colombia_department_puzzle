import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

export function OfflineIndicator() {
  const { isOnline } = usePWA();
  const [showOffline, setShowOffline] = React.useState(false);
  const [justWentOnline, setJustWentOnline] = React.useState(false);

  React.useEffect(() => {
    if (!isOnline) {
      setShowOffline(true);
      setJustWentOnline(false);
    } else if (showOffline) {
      // Was offline, now online - show "back online" message briefly
      setJustWentOnline(true);
      const timer = setTimeout(() => {
        setJustWentOnline(false);
        setShowOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, showOffline]);

  if (!showOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`px-4 py-2 text-center text-sm font-medium ${
          justWentOnline
            ? 'bg-green-600 text-white'
            : 'bg-yellow-600 text-white'
        }`}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-center justify-center gap-2">
          {justWentOnline ? (
            <>
              <Wifi className="h-4 w-4" />
              <span>You&apos;re back online!</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <span>You&apos;re offline - Using cached content</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OfflineIndicator;
