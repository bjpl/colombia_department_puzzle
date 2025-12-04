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

// Mock AudioContext for CI headless environment (Web Audio API)
if (typeof window !== 'undefined' && !window.AudioContext) {
  const MockAudioContext = class MockAudioContext {
    state = 'running';
    destination = {};
    currentTime = 0;
    sampleRate = 44100;

    createOscillator() {
      return {
        type: 'sine',
        frequency: { value: 440, setValueAtTime: () => {} },
        connect: () => {},
        start: () => {},
        stop: () => {},
        disconnect: () => {},
      };
    }

    createGain() {
      return {
        gain: { value: 1, setValueAtTime: () => {}, linearRampToValueAtTime: () => {} },
        connect: () => {},
        disconnect: () => {},
      };
    }

    createAnalyser() {
      return {
        fftSize: 2048,
        frequencyBinCount: 1024,
        connect: () => {},
        disconnect: () => {},
        getByteFrequencyData: () => {},
        getByteTimeDomainData: () => {},
      };
    }

    createMediaElementSource() {
      return { connect: () => {}, disconnect: () => {} };
    }

    createBufferSource() {
      return {
        buffer: null,
        connect: () => {},
        start: () => {},
        stop: () => {},
        disconnect: () => {},
      };
    }

    decodeAudioData() {
      return Promise.resolve({});
    }

    resume() {
      return Promise.resolve();
    }

    suspend() {
      return Promise.resolve();
    }

    close() {
      return Promise.resolve();
    }
  };

  (window as unknown as Record<string, unknown>).AudioContext = MockAudioContext;
  (window as unknown as Record<string, unknown>).webkitAudioContext = MockAudioContext;
}

// Mock navigator.vibrate for haptic feedback tests
if (typeof navigator !== 'undefined' && !navigator.vibrate) {
  Object.defineProperty(navigator, 'vibrate', {
    value: () => true,
    writable: true,
    configurable: true,
  });
}

// Mock PointerEvent for drag-and-drop tests in CI
if (typeof PointerEvent === 'undefined') {
  global.PointerEvent = class PointerEvent extends MouseEvent {
    pointerId: number;
    width: number;
    height: number;
    pressure: number;
    tiltX: number;
    tiltY: number;
    pointerType: string;
    isPrimary: boolean;

    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerId = params.pointerId ?? 0;
      this.width = params.width ?? 1;
      this.height = params.height ?? 1;
      this.pressure = params.pressure ?? 0;
      this.tiltX = params.tiltX ?? 0;
      this.tiltY = params.tiltY ?? 0;
      this.pointerType = params.pointerType ?? 'mouse';
      this.isPrimary = params.isPrimary ?? true;
    }
  } as unknown as typeof PointerEvent;
}

// Mock Touch and TouchEvent for mobile tests
if (typeof Touch === 'undefined') {
  global.Touch = class Touch {
    identifier: number;
    target: EventTarget;
    clientX: number;
    clientY: number;
    screenX: number;
    screenY: number;
    pageX: number;
    pageY: number;
    radiusX: number;
    radiusY: number;
    rotationAngle: number;
    force: number;

    constructor(params: TouchInit) {
      this.identifier = params.identifier;
      this.target = params.target;
      this.clientX = params.clientX ?? 0;
      this.clientY = params.clientY ?? 0;
      this.screenX = params.screenX ?? 0;
      this.screenY = params.screenY ?? 0;
      this.pageX = params.pageX ?? 0;
      this.pageY = params.pageY ?? 0;
      this.radiusX = params.radiusX ?? 0;
      this.radiusY = params.radiusY ?? 0;
      this.rotationAngle = params.rotationAngle ?? 0;
      this.force = params.force ?? 0;
    }
  } as unknown as typeof Touch;
}

if (typeof TouchEvent === 'undefined') {
  global.TouchEvent = class TouchEvent extends Event {
    touches: TouchList;
    targetTouches: TouchList;
    changedTouches: TouchList;

    constructor(type: string, params: TouchEventInit = {}) {
      super(type, params);
      this.touches = params.touches as TouchList ?? ([] as unknown as TouchList);
      this.targetTouches = params.targetTouches as TouchList ?? ([] as unknown as TouchList);
      this.changedTouches = params.changedTouches as TouchList ?? ([] as unknown as TouchList);
    }
  } as unknown as typeof TouchEvent;
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
