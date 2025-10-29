/**
 * Application version management and cache invalidation utilities
 *
 * This module handles:
 * - Version tracking across deployments
 * - Automatic cache invalidation on version changes
 * - Build timestamp tracking for debugging
 */

export const APP_VERSION = '1.0.0';

/**
 * Checks if the application version has changed since the last load.
 * If a version change is detected, clears all application caches.
 *
 * @returns true if version changed and caches were cleared, false otherwise
 */
export function checkVersionChange(): boolean {
  const stored = localStorage.getItem('app_version');

  if (stored !== APP_VERSION) {
    console.log(`[Version] App version changed: ${stored || 'none'} → ${APP_VERSION}`);

    // Clear all caches on version change
    if ('caches' in window) {
      caches.keys().then(names => {
        console.log(`[Version] Clearing ${names.length} cache(s):`, names);
        names.forEach(name => {
          caches.delete(name).then(success => {
            if (success) {
              console.log(`[Version] ✓ Cleared cache: ${name}`);
            } else {
              console.warn(`[Version] ✗ Failed to clear cache: ${name}`);
            }
          });
        });
      }).catch(error => {
        console.error('[Version] Failed to clear caches:', error);
      });
    }

    // Update stored version
    localStorage.setItem('app_version', APP_VERSION);
    return true;
  }

  return false;
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
