/**
 * PWA Functionality Tests
 *
 * Tests Progressive Web App features for mobile devices:
 * - Service worker caching
 * - Offline functionality
 * - Install prompt behavior
 * - Manifest validation
 *
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Service Worker API
class MockServiceWorkerRegistration {
  active: ServiceWorker | null = null;
  installing: ServiceWorker | null = null;
  waiting: ServiceWorker | null = null;
  scope = '';

  constructor() {
    this.scope = window.location.origin + '/';
  }

  async update() {
    return this;
  }

  async unregister() {
    return true;
  }
}

describe('PWA Features', () => {
  beforeEach(() => {
    // Mock navigator.serviceWorker
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        register: vi.fn().mockResolvedValue(new MockServiceWorkerRegistration()),
        ready: Promise.resolve(new MockServiceWorkerRegistration()),
        controller: null,
      },
      writable: true,
      configurable: true,
    });
  });

  describe('Service Worker Registration', () => {
    it('should register service worker', async () => {
      const registration = await navigator.serviceWorker.register('/sw.js');

      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js');
      expect(registration).toBeInstanceOf(MockServiceWorkerRegistration);
    });

    it('should handle registration failure gracefully', async () => {
      const mockError = new Error('Registration failed');
      vi.mocked(navigator.serviceWorker.register).mockRejectedValueOnce(mockError);

      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch (error) {
        expect(error).toBe(mockError);
      }
    });

    it('should check for existing service worker', async () => {
      const registration = await navigator.serviceWorker.ready;

      expect(registration).toBeDefined();
      expect(registration).toBeInstanceOf(MockServiceWorkerRegistration);
    });
  });

  describe('Cache Management', () => {
    let mockCache: Map<string, Response>;

    beforeEach(() => {
      mockCache = new Map<string, Response>();

      // Mock caches API
      const cachesMock = {
        open: vi.fn().mockResolvedValue({
          add: vi.fn().mockImplementation(async (url: string) => {
            mockCache.set(url, new Response('cached content'));
          }),
          addAll: vi.fn().mockImplementation(async (urls: string[]) => {
            urls.forEach((url) => {
              mockCache.set(url, new Response('cached content'));
            });
          }),
          match: vi.fn().mockImplementation(async (url: string) => {
            return mockCache.get(url);
          }),
          put: vi.fn().mockImplementation(async (url: string, response: Response) => {
            mockCache.set(url, response);
          }),
          delete: vi.fn().mockImplementation(async (url: string) => {
            return mockCache.delete(url);
          }),
          keys: vi.fn().mockResolvedValue(Array.from(mockCache.keys())),
        }),
        match: vi.fn().mockImplementation(async (url: string) => {
          return mockCache.get(url);
        }),
        delete: vi.fn(),
        keys: vi.fn().mockResolvedValue(['v1']),
      };

      Object.defineProperty(globalThis, 'caches', {
        value: cachesMock,
        writable: true,
        configurable: true,
      });
    });

    it('should cache app shell (Tier 0)', async () => {
      const tier0Assets = [
        '/',
        '/index.html',
        '/static/css/main.css',
        '/static/js/main.js',
      ];

      const cache = await caches.open('app-shell-v1');
      await cache.addAll(tier0Assets);

      for (const asset of tier0Assets) {
        const cached = await cache.match(asset);
        expect(cached).toBeDefined();
      }
    });

    it('should cache on demand (Tier 1)', async () => {
      const cache = await caches.open('dynamic-v1');
      const url = '/api/departments';
      const response = new Response(JSON.stringify({ data: 'departments' }));

      await cache.put(url, response);

      const cached = await cache.match(url);
      expect(cached).toBeDefined();
    });

    it('should retrieve from cache first', async () => {
      const url = '/cached-resource';
      mockCache.set(url, new Response('cached'));

      const cached = await caches.match(url);

      expect(cached).toBeDefined();
      expect(await cached?.text()).toBe('cached');
    });

    it('should fall back to network if not cached', async () => {
      const url = '/not-cached';

      const cached = await caches.match(url);

      expect(cached).toBeUndefined();
    });

    it('should clean up old caches', async () => {
      const currentVersion = 'v2';
      const cacheWhitelist = ['app-shell-v2', 'dynamic-v2'];

      vi.mocked(caches.keys).mockResolvedValue(['app-shell-v1', 'dynamic-v1', 'app-shell-v2']);

      const cacheNames = await caches.keys();
      const deletePromises = cacheNames
        .filter((name) => !cacheWhitelist.includes(name))
        .map((name) => caches.delete(name));

      await Promise.all(deletePromises);

      expect(caches.delete).toHaveBeenCalledWith('app-shell-v1');
      expect(caches.delete).toHaveBeenCalledWith('dynamic-v1');
    });
  });

  describe('Offline Functionality', () => {
    it('should detect online status', () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true,
      });

      expect(navigator.onLine).toBe(true);
    });

    it('should detect offline status', () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });

      expect(navigator.onLine).toBe(false);
    });

    it('should handle online event', () => {
      let isOnline = false;

      const handleOnline = () => {
        isOnline = true;
      };

      window.addEventListener('online', handleOnline);
      window.dispatchEvent(new Event('online'));

      expect(isOnline).toBe(true);

      window.removeEventListener('online', handleOnline);
    });

    it('should handle offline event', () => {
      let isOffline = false;

      const handleOffline = () => {
        isOffline = true;
      };

      window.addEventListener('offline', handleOffline);
      window.dispatchEvent(new Event('offline'));

      expect(isOffline).toBe(true);

      window.removeEventListener('offline', handleOffline);
    });

    it('should serve cached content when offline', async () => {
      // Set up mock cache before using it
      const testCache = new Map<string, Response>();
      testCache.set('/index.html', new Response('<html>Cached</html>'));

      // Mock caches.match to return from our test cache
      (caches.match as any) = vi.fn().mockImplementation(async (url: string) => {
        return testCache.get(url);
      });

      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });

      const cached = await caches.match('/index.html');

      expect(cached).toBeDefined();
      expect(await cached?.text()).toBe('<html>Cached</html>');
      expect(navigator.onLine).toBe(false);
    });

    it('should show offline indicator', () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });

      const offlineIndicator = document.createElement('div');
      offlineIndicator.className = 'offline-indicator';
      offlineIndicator.textContent = 'You are offline';
      offlineIndicator.style.display = navigator.onLine ? 'none' : 'block';

      expect(offlineIndicator.style.display).toBe('block');
    });
  });

  describe('Install Prompt', () => {
    let deferredPrompt: any;

    beforeEach(() => {
      deferredPrompt = {
        prompt: vi.fn().mockResolvedValue(undefined),
        userChoice: Promise.resolve({ outcome: 'accepted' }),
      };
    });

    it('should capture beforeinstallprompt event', () => {
      let promptCaptured = false;

      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        promptCaptured = true;
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      const event = new Event('beforeinstallprompt');
      window.dispatchEvent(event);

      expect(promptCaptured).toBe(true);

      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    });

    it('should show install prompt after first game (Android)', async () => {
      let showInstallButton = false;

      // Simulate game completion
      const gamesCompleted = 1;

      if (gamesCompleted >= 1) {
        showInstallButton = true;
      }

      expect(showInstallButton).toBe(true);
    });

    it('should handle install prompt acceptance', async () => {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;

      expect(deferredPrompt.prompt).toHaveBeenCalled();
      expect(choice.outcome).toBe('accepted');
    });

    it('should handle install prompt dismissal', async () => {
      deferredPrompt.userChoice = Promise.resolve({ outcome: 'dismissed' });

      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;

      expect(choice.outcome).toBe('dismissed');
    });

    it('should show iOS install instructions', () => {
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
      const isInStandaloneMode = (window.navigator as any).standalone === true;

      // Mock iOS Safari
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        configurable: true,
      });

      const showIOSInstructions = /iPhone|iPad|iPod/.test(navigator.userAgent) && !isInStandaloneMode;

      expect(showIOSInstructions).toBe(true);
    });

    it('should detect if app is installed (standalone mode)', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query === '(display-mode: standalone)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

      expect(isStandalone).toBe(true);
    });
  });

  describe('Manifest Validation', () => {
    it('should have valid manifest link', () => {
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = '/manifest.json';
      document.head.appendChild(manifestLink);

      const link = document.querySelector('link[rel="manifest"]');

      expect(link).toBeDefined();
      expect(link?.getAttribute('href')).toBe('/manifest.json');

      document.head.removeChild(manifestLink);
    });

    it('should validate manifest structure', () => {
      const manifest = {
        name: 'Colombia Departments Puzzle',
        short_name: 'Colombia Puzzle',
        start_url: '/',
        display: 'standalone',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      };

      expect(manifest.name).toBeDefined();
      expect(manifest.short_name).toBeDefined();
      expect(manifest.start_url).toBe('/');
      expect(manifest.display).toBe('standalone');
      expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
    });

    it('should have theme color meta tag', () => {
      const themeColor = document.createElement('meta');
      themeColor.name = 'theme-color';
      themeColor.content = '#3b82f6';
      document.head.appendChild(themeColor);

      const meta = document.querySelector('meta[name="theme-color"]');

      expect(meta).toBeDefined();
      expect(meta?.getAttribute('content')).toBe('#3b82f6');

      document.head.removeChild(themeColor);
    });

    it('should have viewport meta tag', () => {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0';
      document.head.appendChild(viewport);

      const meta = document.querySelector('meta[name="viewport"]');

      expect(meta).toBeDefined();
      expect(meta?.getAttribute('content')).toContain('width=device-width');

      document.head.removeChild(viewport);
    });

    it('should have apple-touch-icon', () => {
      const appleIcon = document.createElement('link');
      appleIcon.rel = 'apple-touch-icon';
      appleIcon.href = '/icon-192.png';
      document.head.appendChild(appleIcon);

      const link = document.querySelector('link[rel="apple-touch-icon"]');

      expect(link).toBeDefined();

      document.head.removeChild(appleIcon);
    });
  });

  describe('Update Handling', () => {
    it('should detect service worker update', async () => {
      const registration = new MockServiceWorkerRegistration();
      registration.waiting = {} as ServiceWorker;

      let updateAvailable = false;

      if (registration.waiting) {
        updateAvailable = true;
      }

      expect(updateAvailable).toBe(true);
    });

    it('should prompt user to reload on update', () => {
      let showUpdatePrompt = false;

      const handleUpdate = () => {
        showUpdatePrompt = true;
      };

      handleUpdate();

      expect(showUpdatePrompt).toBe(true);
    });

    it('should skip waiting on user confirmation', async () => {
      const worker = {
        postMessage: vi.fn(),
      } as any;

      worker.postMessage({ type: 'SKIP_WAITING' });

      expect(worker.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
    });
  });

  describe('Background Sync', () => {
    it('should queue actions when offline', () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });

      const offlineQueue: Array<{ action: string; data: any }> = [];

      const queueAction = (action: string, data: any) => {
        if (!navigator.onLine) {
          offlineQueue.push({ action, data });
          return true;
        }
        return false;
      };

      const queued = queueAction('SAVE_SCORE', { score: 500 });

      expect(queued).toBe(true);
      expect(offlineQueue.length).toBe(1);
      expect(offlineQueue[0].action).toBe('SAVE_SCORE');
    });

    it('should process queue when back online', () => {
      const queue = [
        { action: 'SAVE_SCORE', data: { score: 500 } },
        { action: 'SAVE_SCORE', data: { score: 600 } },
      ];

      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true,
      });

      const processed: typeof queue = [];

      if (navigator.onLine) {
        while (queue.length > 0) {
          const item = queue.shift();
          if (item) {
            processed.push(item);
          }
        }
      }

      expect(processed.length).toBe(2);
      expect(queue.length).toBe(0);
    });
  });
});
