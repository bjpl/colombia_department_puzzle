/**
 * Application version management and cache invalidation utilities
 *
 * This module handles:
 * - Version tracking across deployments
 * - Automatic cache invalidation on version changes
 * - Build timestamp tracking for debugging
 */

export const APP_VERSION = '1.1.0'; // Bumped to force cache invalidation

/**
 * Checks if the application version has changed since the last load.
 * If a version change is detected, performs aggressive cache invalidation:
 * - Clears all Cache Storage caches
 * - Unregisters all service workers
 * - Clears localStorage cache markers
 * - Forces a hard reload
 *
 * @returns true if version changed and caches were cleared, false otherwise
 */
export function checkVersionChange(): boolean {
  const stored = localStorage.getItem('app_version');

  if (stored !== APP_VERSION) {
    console.log(`[Version] App version changed: ${stored || 'none'} → ${APP_VERSION}`);

    // Perform nuclear cache invalidation
    performNuclearCacheInvalidation();

    // Update stored version
    localStorage.setItem('app_version', APP_VERSION);
    return true;
  }

  return false;
}

/**
 * Nuclear cache invalidation: Clears ALL caches and forces reload
 * This is the most aggressive cache-busting strategy
 */
async function performNuclearCacheInvalidation(): Promise<void> {
  console.log('[Version] 🚨 Performing NUCLEAR cache invalidation...');

  try {
    // Step 1: Unregister ALL service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log(`[Version] Found ${registrations.length} service worker(s) to unregister`);

      await Promise.all(
        registrations.map(async (registration) => {
          const success = await registration.unregister();
          console.log(`[Version] ${success ? '✓' : '✗'} Unregistered SW: ${registration.scope}`);
          return success;
        })
      );
    }

    // Step 2: Clear ALL Cache Storage caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      console.log(`[Version] Clearing ${cacheNames.length} cache(s):`, cacheNames);

      await Promise.all(
        cacheNames.map(async (name) => {
          const success = await caches.delete(name);
          console.log(`[Version] ${success ? '✓' : '✗'} Cleared cache: ${name}`);
          return success;
        })
      );
    }

    // Step 3: Clear localStorage cache markers
    localStorage.removeItem('mobileWelcomeDismissed');

    console.log('[Version] ✓ Nuclear cache invalidation complete');

    // Step 4: Force hard reload after short delay
    setTimeout(() => {
      console.log('[Version] 🔄 Forcing hard reload...');
      window.location.reload();
    }, 500);

  } catch (error) {
    console.error('[Version] ✗ Nuclear cache invalidation failed:', error);
  }
}

/**
 * Gets the current application version
 */
export function getAppVersion(): string {
  return APP_VERSION;
}

/**
 * Gets the build timestamp (injected at build time)
 * Returns ISO 8601 string or 'development' if not available
 */
export function getBuildDate(): string {
  // This will be replaced by Vite's define plugin at build time
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - __BUILD_DATE__ is injected at build time
  return typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : 'development';
}

/**
 * Logs version information to console (useful for debugging production issues)
 */
export function logVersionInfo(): void {
  console.log(`
╔═══════════════════════════════════════════╗
║  Colombia Department Puzzle               ║
║  Version: ${APP_VERSION}                       ║
║  Built: ${getBuildDate()}                 ║
╚═══════════════════════════════════════════╝
  `);
}
