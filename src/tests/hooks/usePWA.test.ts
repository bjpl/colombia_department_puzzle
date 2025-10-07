import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePWA } from '../../hooks/usePWA';

describe('usePWA', () => {
  beforeEach(() => {
    // Reset localStorage
    localStorage.clear();

    // Mock navigator.onLine
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);

    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('should initialize with online state', () => {
    const { result } = renderHook(() => usePWA());

    expect(result.current.isOnline).toBe(true);
    expect(result.current.isInstalled).toBe(false);
    expect(result.current.isInstallable).toBe(false);
    expect(result.current.updateAvailable).toBe(false);
  });

  it('should detect offline state', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    const { result } = renderHook(() => usePWA());

    expect(result.current.isOnline).toBe(false);
  });

  it('should update online state when network changes', () => {
    const { result } = renderHook(() => usePWA());

    expect(result.current.isOnline).toBe(true);

    // Simulate going offline
    act(() => {
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOnline).toBe(false);

    // Simulate coming back online
    act(() => {
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current.isOnline).toBe(true);
  });

  it('should detect standalone mode (installed)', () => {
    // Mock standalone mode
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(display-mode: standalone)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => usePWA());

    expect(result.current.isInstalled).toBe(true);
  });

  it('should handle beforeinstallprompt event', () => {
    const { result } = renderHook(() => usePWA());

    expect(result.current.isInstallable).toBe(false);

    // Simulate beforeinstallprompt event
    const mockEvent = new Event('beforeinstallprompt');
    Object.defineProperty(mockEvent, 'preventDefault', {
      value: vi.fn(),
    });

    act(() => {
      window.dispatchEvent(mockEvent);
    });

    expect(result.current.isInstallable).toBe(true);
    expect(result.current.deferredPrompt).toBeDefined();
  });

  it('should respect install prompt cooldown', () => {
    // Set dismissed timestamp within cooldown period
    const recentTimestamp = Date.now() - 1000; // 1 second ago
    localStorage.setItem('pwa-install-dismissed', recentTimestamp.toString());

    const { result } = renderHook(() => usePWA());

    // Simulate beforeinstallprompt event
    const mockEvent = new Event('beforeinstallprompt');
    Object.defineProperty(mockEvent, 'preventDefault', {
      value: vi.fn(),
    });

    act(() => {
      window.dispatchEvent(mockEvent);
    });

    // Should not show prompt due to cooldown
    expect(result.current.isInstallable).toBe(false);
  });

  it('should allow install prompt after cooldown expires', () => {
    // Set dismissed timestamp beyond cooldown period
    const oldTimestamp = Date.now() - 8 * 24 * 60 * 60 * 1000; // 8 days ago
    localStorage.setItem('pwa-install-dismissed', oldTimestamp.toString());

    const { result } = renderHook(() => usePWA());

    // Simulate beforeinstallprompt event
    const mockEvent = new Event('beforeinstallprompt');
    Object.defineProperty(mockEvent, 'preventDefault', {
      value: vi.fn(),
    });

    act(() => {
      window.dispatchEvent(mockEvent);
    });

    // Should show prompt as cooldown expired
    expect(result.current.isInstallable).toBe(true);
  });

  it('should dismiss install prompt with cooldown', () => {
    const { result } = renderHook(() => usePWA());

    act(() => {
      result.current.dismissInstallPrompt();
    });

    const dismissedTime = localStorage.getItem('pwa-install-dismissed');
    expect(dismissedTime).toBeDefined();
    expect(parseInt(dismissedTime!, 10)).toBeGreaterThan(Date.now() - 1000);
    expect(result.current.isInstallable).toBe(false);
  });

  it('should handle appinstalled event', () => {
    const { result } = renderHook(() => usePWA());

    // Set up installable state
    const mockEvent = new Event('beforeinstallprompt');
    Object.defineProperty(mockEvent, 'preventDefault', {
      value: vi.fn(),
    });

    act(() => {
      window.dispatchEvent(mockEvent);
    });

    expect(result.current.isInstallable).toBe(true);

    // Simulate app installation
    act(() => {
      window.dispatchEvent(new Event('appinstalled'));
    });

    expect(result.current.isInstalled).toBe(true);
    expect(result.current.isInstallable).toBe(false);
    expect(localStorage.getItem('pwa-install-dismissed')).toBeNull();
  });

  it('should provide promptInstall function', () => {
    const { result } = renderHook(() => usePWA());

    expect(typeof result.current.promptInstall).toBe('function');
  });

  it('should provide dismissInstallPrompt function', () => {
    const { result } = renderHook(() => usePWA());

    expect(typeof result.current.dismissInstallPrompt).toBe('function');
  });

  it('should provide checkForUpdates function', () => {
    const { result } = renderHook(() => usePWA());

    expect(typeof result.current.checkForUpdates).toBe('function');
  });
});
