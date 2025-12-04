import { afterEach, vi, beforeEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// CI Environment Detection
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

// Ensure window is defined for jsdom environment
if (typeof window === 'undefined') {
  (global as Record<string, unknown>).window = {};
}

// Mock ResizeObserver for CI headless environment
if (typeof ResizeObserver === 'undefined') {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Mock IntersectionObserver for CI headless environment
if (typeof IntersectionObserver === 'undefined') {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
    root = null;
    rootMargin = '';
    thresholds = [];
    takeRecords() { return []; }
  } as unknown as typeof IntersectionObserver;
}

// Mock window.scrollTo for CI headless environment
if (typeof window !== 'undefined' && !window.scrollTo) {
  window.scrollTo = vi.fn();
}

// Mock requestAnimationFrame for CI headless environment
if (typeof requestAnimationFrame === 'undefined') {
  global.requestAnimationFrame = (cb: FrameRequestCallback) => {
    return setTimeout(() => cb(Date.now()), 16);
  };
  global.cancelAnimationFrame = (id: number) => clearTimeout(id);
}

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Handle cleanup errors gracefully
afterAll(() => {
  vi.restoreAllMocks();
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

global.localStorage = localStorageMock as Storage;

// Mock window.matchMedia - must be set before any imports use it
const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: matchMediaMock,
});

// Reset matchMedia mock before each test
beforeEach(() => {
  matchMediaMock.mockClear();
});
