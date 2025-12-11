import { useState, useEffect, useRef, useCallback } from 'react';

interface AnimationMonitorOptions {
  threshold?: number;
  onFpsDrop?: (metrics: PerformanceMetrics) => void;
}

interface PerformanceMetrics {
  fps: number;
  averageFps: number;
  frameDrops: number;
  jankEvents: number;
  totalFrames: number;
  monitoringDuration: number;
}

interface UseAnimationMonitorReturn {
  fps: number;
  averageFps: number;
  frameDrops: number;
  jankEvents: number;
  isMonitoring: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  getMetrics: () => PerformanceMetrics;
}

const FRAME_DROP_THRESHOLD = 16.67; // 60fps target
const JANK_THRESHOLD = 50; // frames taking >50ms
const DEFAULT_FPS_THRESHOLD = 55;
const FPS_SAMPLE_SIZE = 30; // Rolling average window

export function useAnimationMonitor(
  options: AnimationMonitorOptions = {}
): UseAnimationMonitorReturn {
  const { threshold = DEFAULT_FPS_THRESHOLD, onFpsDrop } = options;

  // State
  const [fps, setFps] = useState(0);
  const [averageFps, setAverageFps] = useState(0);
  const [frameDrops, setFrameDrops] = useState(0);
  const [jankEvents, setJankEvents] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Refs for tracking
  const rafIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const totalFramesRef = useRef(0);
  const fpsHistoryRef = useRef<number[]>([]);
  const frameDropsRef = useRef(0);
  const jankEventsRef = useRef(0);

  // Calculate FPS from delta time
  const calculateFps = (deltaTime: number): number => {
    if (deltaTime <= 0) return 0;
    return 1000 / deltaTime;
  };

  // Update rolling average
  const updateAverageFps = (currentFps: number) => {
    fpsHistoryRef.current.push(currentFps);

    // Keep only last N samples
    if (fpsHistoryRef.current.length > FPS_SAMPLE_SIZE) {
      fpsHistoryRef.current.shift();
    }

    // Calculate average
    const sum = fpsHistoryRef.current.reduce((acc, val) => acc + val, 0);
    const average = sum / fpsHistoryRef.current.length;
    setAverageFps(average);

    return average;
  };

  // Animation frame callback
  const onFrame = useCallback(
    (timestamp: number) => {
      if (lastFrameTimeRef.current !== null) {
        const deltaTime = timestamp - lastFrameTimeRef.current;

        // Calculate current FPS
        const currentFps = calculateFps(deltaTime);
        setFps(currentFps);

        // Update rolling average
        const avgFps = updateAverageFps(currentFps);

        // Detect frame drops (>16.67ms)
        if (deltaTime > FRAME_DROP_THRESHOLD) {
          frameDropsRef.current++;
          setFrameDrops(frameDropsRef.current);
        }

        // Detect jank events (>50ms)
        if (deltaTime > JANK_THRESHOLD) {
          jankEventsRef.current++;
          setJankEvents(jankEventsRef.current);
        }

        // Trigger callback if FPS drops below threshold
        if (onFpsDrop && currentFps < threshold) {
          onFpsDrop({
            fps: currentFps,
            averageFps: avgFps,
            frameDrops: frameDropsRef.current,
            jankEvents: jankEventsRef.current,
            totalFrames: totalFramesRef.current,
            monitoringDuration: timestamp - (startTimeRef.current || timestamp),
          });
        }

        totalFramesRef.current++;
      } else {
        // First frame - just record timestamp
        startTimeRef.current = timestamp;
      }

      lastFrameTimeRef.current = timestamp;

      // Schedule next frame
      rafIdRef.current = requestAnimationFrame(onFrame);
    },
    [threshold, onFpsDrop]
  );

  // Start monitoring
  const start = useCallback(() => {
    if (isMonitoring) return; // Prevent multiple monitoring loops

    setIsMonitoring(true);
    lastFrameTimeRef.current = null;
    rafIdRef.current = requestAnimationFrame(onFrame);
  }, [isMonitoring, onFrame]);

  // Stop monitoring
  const stop = useCallback(() => {
    if (!isMonitoring) return;

    setIsMonitoring(false);

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, [isMonitoring]);

  // Reset metrics
  const reset = useCallback(() => {
    const wasMonitoring = isMonitoring;

    // Stop if monitoring
    if (wasMonitoring) {
      stop();
    }

    // Reset all state and refs
    setFps(0);
    setAverageFps(0);
    setFrameDrops(0);
    setJankEvents(0);

    lastFrameTimeRef.current = null;
    startTimeRef.current = null;
    totalFramesRef.current = 0;
    fpsHistoryRef.current = [];
    frameDropsRef.current = 0;
    jankEventsRef.current = 0;

    // Restart if was monitoring
    if (wasMonitoring) {
      setIsMonitoring(false); // Reset flag
      setTimeout(() => start(), 0); // Restart on next tick
    }
  }, [isMonitoring, start, stop]);

  // Get current metrics
  const getMetrics = useCallback((): PerformanceMetrics => {
    const now = performance.now();
    const duration = startTimeRef.current ? now - startTimeRef.current : 0;

    return {
      fps,
      averageFps,
      frameDrops,
      jankEvents,
      totalFrames: totalFramesRef.current,
      monitoringDuration: duration,
    };
  }, [fps, averageFps, frameDrops, jankEvents]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return {
    fps,
    averageFps,
    frameDrops,
    jankEvents,
    isMonitoring,
    start,
    stop,
    reset,
    getMetrics,
  };
}
