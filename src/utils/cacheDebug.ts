/**
 * Cache debugging utilities for troubleshooting cache issues
 *
 * Usage in browser console:
 * - window.__clearAllCaches() - Nuclear option: clear everything
 * - window.__inspectCaches() - See what's cached
 * - window.__unregisterServiceWorkers() - Remove all SWs
 */

/**
 * Nuclear cache clear: removes everything and forces reload
 */
async function clearAllCaches(): Promise<void> {
  console.log('🚨 NUCLEAR CACHE CLEAR INITIATED');

  try {
    // Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log(`Found ${registrations.length} service worker(s)`);

      for (const registration of registrations) {
        await registration.unregister();
        console.log(`✓ Unregistered SW: ${registration.scope}`);
      }
    }

    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      console.log(`Found ${cacheNames.length} cache(s):`, cacheNames);

      for (const name of cacheNames) {
        await caches.delete(name);
        console.log(`✓ Deleted cache: ${name}`);
      }
    }

    // Clear storage
    localStorage.clear();
    sessionStorage.clear();
    console.log('✓ Cleared localStorage and sessionStorage');

    console.log('✓ Cache clear complete - reloading in 1 second...');
    setTimeout(() => window.location.reload(), 1000);
  } catch (error) {
    console.error('✗ Cache clear failed:', error);
  }
}

/**
 * Inspect all caches and service workers
 */
async function inspectCaches(): Promise<void> {
  console.group('🔍 Cache Inspection');

  try {
    // Check service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log(`\n📦 Service Workers (${registrations.length}):`);
      registrations.forEach((reg, i) => {
        console.log(`  ${i + 1}. ${reg.scope}`);
        console.log(`     Active: ${reg.active ? '✓' : '✗'}`);
        console.log(`     Installing: ${reg.installing ? '✓' : '✗'}`);
        console.log(`     Waiting: ${reg.waiting ? '✓' : '✗'}`);
      });
    }

    // Check caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      console.log(`\n💾 Cache Storage (${cacheNames.length} caches):`);

      for (const name of cacheNames) {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        console.log(`\n  📁 ${name} (${keys.length} entries):`);
        keys.slice(0, 5).forEach(req => {
          console.log(`     - ${req.url}`);
        });
        if (keys.length > 5) {
          console.log(`     ... and ${keys.length - 5} more`);
        }
      }
    }

    // Check storage
    console.log(`\n🗄️ Storage:`);
    console.log(`  localStorage: ${Object.keys(localStorage).length} keys`);
    console.log(`  sessionStorage: ${Object.keys(sessionStorage).length} keys`);

    // App version
    console.log(`\n📌 App Version: ${localStorage.getItem('app_version') || 'not set'}`);

  } catch (error) {
    console.error('✗ Inspection failed:', error);
  }

  console.groupEnd();
}

/**
 * Unregister all service workers without clearing caches
 */
async function unregisterServiceWorkers(): Promise<void> {
  console.log('🔧 Unregistering service workers...');

  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();

      for (const registration of registrations) {
        await registration.unregister();
        console.log(`✓ Unregistered: ${registration.scope}`);
      }

      console.log('✓ All service workers unregistered - reload to take effect');
    } else {
      console.log('Service workers not supported');
    }
  } catch (error) {
    console.error('✗ Unregistration failed:', error);
  }
}

// Export to window for browser console access
export function registerDebugUtils(): void {
  (window as any).__clearAllCaches = clearAllCaches;
  (window as any).__inspectCaches = inspectCaches;
  (window as any).__unregisterServiceWorkers = unregisterServiceWorkers;

  console.log(`
╔═════════════════════════════════════════════╗
║  Cache Debug Utils Registered               ║
║                                             ║
║  Available commands in console:             ║
║  • window.__clearAllCaches()                ║
║  • window.__inspectCaches()                 ║
║  • window.__unregisterServiceWorkers()      ║
╚═════════════════════════════════════════════╝
  `);
}
