import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAnimationMonitor } from '../../hooks/useAnimationMonitor';

describe('useAnimationMonitor - London School TDD', () => {
  let mockRaf: ReturnType<typeof vi.fn>;
  let mockCancelRaf: ReturnType<typeof vi.fn>;
  let mockPerformanceNow: ReturnType<typeof vi.fn>;
  let rafCallbacks: Map<number, FrameRequestCallback>;
  let rafIdCounter: number;
  let currentTime: number;

  beforeEach(() => {
    // Setup mocks
    rafCallbacks = new Map();
    rafIdCounter = 0;
    currentTime = 0;

    // Mock requestAnimationFrame
    mockRaf = vi.fn((callback: FrameRequestCallback) => {
      const id = ++rafIdCounter;
      rafCallbacks.set(id, callback);
      return id;
    });

    // Mock cancelAnimationFrame
    mockCancelRaf = vi.fn((id: number) => {
      rafCallbacks.delete(id);
    });

    // Mock performance.now()
    mockPerformanceNow = vi.fn(() => currentTime);

    // Apply mocks to global
    global.requestAnimationFrame = mockRaf;
    global.cancelAnimationFrame = mockCancelRaf;
    global.performance = { now: mockPerformanceNow } as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Helper to simulate frame
  const simulateFrame = (deltaMs: number) => {
    currentTime += deltaMs;
    rafCallbacks.forEach((callback) => {
      callback(currentTime);
    });
  };

  describe('Initialization', () => {
    it('should initialize with default metrics', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      expect(result.current.fps).toBe(0);
      expect(result.current.averageFps).toBe(0);
      expect(result.current.frameDrops).toBe(0);
      expect(result.current.jankEvents).toBe(0);
      expect(result.current.isMonitoring).toBe(false);
    });

    it('should not start monitoring automatically', () => {
      renderHook(() => useAnimationMonitor());

      expect(mockRaf).not.toHaveBeenCalled();
    });

    it('should accept custom threshold via options', () => {
      const onFpsDrop = vi.fn();
      const { result } = renderHook(() =>
        useAnimationMonitor({ threshold: 45, onFpsDrop })
      );

      expect(result.current.isMonitoring).toBe(false);
      // Threshold will be verified through behavior
    });
  });

  describe('Start/Stop Monitoring', () => {
    it('should start monitoring when start() is called', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      expect(result.current.isMonitoring).toBe(true);
      expect(mockRaf).toHaveBeenCalled();
    });

    it('should stop monitoring when stop() is called', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      const rafCallCountAfterStart = mockRaf.mock.calls.length;

      act(() => {
        result.current.stop();
      });

      expect(result.current.isMonitoring).toBe(false);
      expect(mockCancelRaf).toHaveBeenCalled();
    });

    it('should handle multiple start calls gracefully', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
        result.current.start();
        result.current.start();
      });

      expect(result.current.isMonitoring).toBe(true);
      // Should not create multiple monitoring loops
    });

    it('should handle stop when not monitoring', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.stop();
      });

      expect(result.current.isMonitoring).toBe(false);
      expect(mockCancelRaf).not.toHaveBeenCalled();
    });
  });

  describe('FPS Calculation', () => {
    it('should calculate FPS correctly for 60fps (16.67ms frames)', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      // Simulate perfect 60fps
      act(() => {
        simulateFrame(16.67); // Frame 1
        simulateFrame(16.67); // Frame 2
        simulateFrame(16.67); // Frame 3
      });

      expect(result.current.fps).toBeCloseTo(60, 0);
    });

    it('should calculate FPS correctly for 30fps (33.33ms frames)', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      // Simulate 30fps
      act(() => {
        simulateFrame(33.33);
        simulateFrame(33.33);
        simulateFrame(33.33);
      });

      expect(result.current.fps).toBeCloseTo(30, 0);
    });

    it('should handle first frame correctly (no previous frame)', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      act(() => {
        simulateFrame(16.67);
      });

      // First frame should not calculate FPS yet
      expect(result.current.fps).toBe(0);
    });

    it('should calculate rolling average FPS over multiple frames', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      // Mix of frame times
      act(() => {
        simulateFrame(16.67); // 60fps
        simulateFrame(16.67); // 60fps
        simulateFrame(33.33); // 30fps
        simulateFrame(16.67); // 60fps
        simulateFrame(16.67); // 60fps
      });

      // Average should be between 30 and 60
      expect(result.current.averageFps).toBeGreaterThan(30);
      expect(result.current.averageFps).toBeLessThan(60);
    });
  });

  describe('Frame Drop Detection', () => {
    it('should detect frame drop when frame time exceeds 16.67ms', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      act(() => {
        simulateFrame(16.67); // Normal
        simulateFrame(20); // Drop (>16.67ms)
        simulateFrame(16.67); // Normal
      });

      expect(result.current.frameDrops).toBe(1);
    });

    it('should count multiple frame drops', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      act(() => {
        simulateFrame(16.67); // Normal
        simulateFrame(25); // Drop
        simulateFrame(30); // Drop
        simulateFrame(16.67); // Normal
        simulateFrame(18); // Drop
      });

      expect(result.current.frameDrops).toBe(3);
    });

    it('should not count first frame as drop', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      act(() => {
        simulateFrame(50); // First frame with high delta
      });

      expect(result.current.frameDrops).toBe(0);
    });
  });

  describe('Jank Event Detection', () => {
    it('should detect jank event when frame time exceeds 50ms', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      act(() => {
        simulateFrame(16.67); // Normal
        simulateFrame(55); // Jank (>50ms)
        simulateFrame(16.67); // Normal
      });

      expect(result.current.jankEvents).toBe(1);
    });

    it('should count multiple jank events', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      act(() => {
        simulateFrame(16.67); // Normal
        simulateFrame(60); // Jank
        simulateFrame(75); // Jank
        simulateFrame(16.67); // Normal
        simulateFrame(51); // Jank
      });

      expect(result.current.jankEvents).toBe(3);
    });

    it('should count jank as frame drop as well', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      act(() => {
        simulateFrame(16.67); // Normal
        simulateFrame(60); // Jank (also frame drop)
      });

      expect(result.current.jankEvents).toBe(1);
      expect(result.current.frameDrops).toBe(1);
    });
  });

  describe('FPS Drop Callback', () => {
    it('should call onFpsDrop when FPS drops below threshold (default 55)', () => {
      const onFpsDrop = vi.fn();
      const { result } = renderHook(() => useAnimationMonitor({ onFpsDrop }));

      act(() => {
        result.current.start();
      });

      // Simulate low FPS (30fps)
      act(() => {
        simulateFrame(16.67); // Normal
        simulateFrame(33.33); // 30fps
        simulateFrame(33.33); // 30fps
      });

      expect(onFpsDrop).toHaveBeenCalled();
      expect(onFpsDrop).toHaveBeenCalledWith(
        expect.objectContaining({
          fps: expect.any(Number),
          averageFps: expect.any(Number),
          frameDrops: expect.any(Number),
        })
      );
    });

    it('should call onFpsDrop with custom threshold', () => {
      const onFpsDrop = vi.fn();
      const { result } = renderHook(() =>
        useAnimationMonitor({ threshold: 45, onFpsDrop })
      );

      act(() => {
        result.current.start();
      });

      // Simulate 50fps (above custom threshold of 45)
      act(() => {
        simulateFrame(16.67); // Normal
        simulateFrame(20); // 50fps
        simulateFrame(20); // 50fps
      });

      expect(onFpsDrop).not.toHaveBeenCalled();
    });

    it('should not call onFpsDrop when FPS is above threshold', () => {
      const onFpsDrop = vi.fn();
      const { result } = renderHook(() => useAnimationMonitor({ onFpsDrop }));

      act(() => {
        result.current.start();
      });

      // Simulate good FPS (60fps)
      act(() => {
        simulateFrame(16.67);
        simulateFrame(16.67);
        simulateFrame(16.67);
      });

      expect(onFpsDrop).not.toHaveBeenCalled();
    });

    it('should not call onFpsDrop if callback not provided', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      // Should not throw error even without callback
      act(() => {
        simulateFrame(16.67);
        simulateFrame(33.33); // Low FPS
        simulateFrame(33.33);
      });

      // Test passes if no error thrown
      expect(result.current.fps).toBeLessThan(55);
    });
  });

  describe('Performance Metrics Summary', () => {
    it('should provide getMetrics() function', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      expect(result.current.getMetrics).toBeDefined();
      expect(typeof result.current.getMetrics).toBe('function');
    });

    it('should return comprehensive metrics summary', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      act(() => {
        simulateFrame(16.67); // Normal
        simulateFrame(25); // Drop
        simulateFrame(60); // Jank
        simulateFrame(16.67); // Normal
      });

      const metrics = result.current.getMetrics();

      expect(metrics).toEqual({
        fps: expect.any(Number),
        averageFps: expect.any(Number),
        frameDrops: expect.any(Number),
        jankEvents: expect.any(Number),
        totalFrames: expect.any(Number),
        monitoringDuration: expect.any(Number),
      });
    });

    it('should track total frames monitored', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      act(() => {
        simulateFrame(16.67);
        simulateFrame(16.67);
        simulateFrame(16.67);
        simulateFrame(16.67);
        simulateFrame(16.67);
      });

      const metrics = result.current.getMetrics();
      expect(metrics.totalFrames).toBe(5);
    });

    it('should track monitoring duration', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      act(() => {
        simulateFrame(16.67);
        simulateFrame(16.67);
        simulateFrame(16.67);
      });

      const metrics = result.current.getMetrics();
      expect(metrics.monitoringDuration).toBeCloseTo(50.01, 0); // 3 frames * 16.67ms
    });
  });

  describe('Reset Functionality', () => {
    it('should provide reset() function', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      expect(result.current.reset).toBeDefined();
      expect(typeof result.current.reset).toBe('function');
    });

    it('should reset all metrics when reset() is called', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      act(() => {
        simulateFrame(16.67);
        simulateFrame(25); // Drop
        simulateFrame(60); // Jank
      });

      expect(result.current.frameDrops).toBeGreaterThan(0);
      expect(result.current.jankEvents).toBeGreaterThan(0);

      act(() => {
        result.current.reset();
      });

      expect(result.current.fps).toBe(0);
      expect(result.current.averageFps).toBe(0);
      expect(result.current.frameDrops).toBe(0);
      expect(result.current.jankEvents).toBe(0);
    });

    it('should continue monitoring after reset if was monitoring', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      act(() => {
        simulateFrame(16.67);
        simulateFrame(16.67);
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.isMonitoring).toBe(true);

      act(() => {
        simulateFrame(16.67);
      });

      // Should track new frames
      const metrics = result.current.getMetrics();
      expect(metrics.totalFrames).toBeGreaterThan(0);
    });
  });

  describe('Cleanup', () => {
    it('should stop monitoring when component unmounts', () => {
      const { result, unmount } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      expect(result.current.isMonitoring).toBe(true);

      unmount();

      expect(mockCancelRaf).toHaveBeenCalled();
    });

    it('should not throw error on unmount if not monitoring', () => {
      const { unmount } = renderHook(() => useAnimationMonitor());

      // Should not throw
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very high frame times gracefully', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      act(() => {
        simulateFrame(16.67);
        simulateFrame(1000); // 1 second frame time
      });

      expect(result.current.fps).toBeGreaterThan(0);
      expect(result.current.jankEvents).toBeGreaterThan(0);
    });

    it('should handle zero or negative time deltas', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      // Simulate same timestamp (0 delta)
      act(() => {
        simulateFrame(0);
      });

      // Should not crash or produce invalid FPS
      expect(result.current.fps).toBeGreaterThanOrEqual(0);
    });

    it('should maintain accuracy over many frames', () => {
      const { result } = renderHook(() => useAnimationMonitor());

      act(() => {
        result.current.start();
      });

      // Simulate 120 frames at 60fps
      act(() => {
        for (let i = 0; i < 120; i++) {
          simulateFrame(16.67);
        }
      });

      const metrics = result.current.getMetrics();
      expect(metrics.totalFrames).toBe(120);
      expect(result.current.averageFps).toBeCloseTo(60, 0);
    });
  });

  describe('Multiple Instances', () => {
    it('should allow multiple independent monitor instances', () => {
      const { result: result1 } = renderHook(() => useAnimationMonitor());
      const { result: result2 } = renderHook(() => useAnimationMonitor());

      act(() => {
        result1.current.start();
      });

      expect(result1.current.isMonitoring).toBe(true);
      expect(result2.current.isMonitoring).toBe(false);

      act(() => {
        simulateFrame(16.67);
        simulateFrame(25); // Drop
      });

      expect(result1.current.frameDrops).toBeGreaterThan(0);
      // result2 should not be affected
      expect(result2.current.frameDrops).toBe(0);
    });
  });
});
