import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    const handler = (event: CustomEvent) => {
      setShowUpdate(true);
      setRegistration(event.detail.registration);
    };

    window.addEventListener('swUpdateAvailable' as any, handler);

    return () => {
      window.removeEventListener('swUpdateAvailable' as any, handler);
    };
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      // Tell the service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });

      // Reload the page when the new service worker takes control
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    } else {
      // Fallback: just reload
      window.location.reload();
    }
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 px-4">
      <div className="mx-auto max-w-md">
        <div className="rounded-lg bg-green-600 text-white shadow-2xl">
          <div className="flex items-center gap-4 px-5 py-4">
            <RefreshCw className="h-6 w-6 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">New version available!</p>
              <p className="text-xs text-green-100 mt-0.5">
                Click to update and get the latest features
              </p>
            </div>
            <button
              onClick={handleUpdate}
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateNotification;
