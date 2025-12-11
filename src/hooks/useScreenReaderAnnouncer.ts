import { useCallback, useEffect, useRef } from 'react';

/**
 * Options for screen reader announcements
 */
export interface AnnouncementOptions {
  /**
   * Priority level for the announcement
   * - 'polite': Wait for screen reader to finish current announcement (default)
   * - 'assertive': Interrupt current announcement immediately
   */
  priority?: 'polite' | 'assertive';

  /**
   * Duration in milliseconds before clearing the announcement
   * Minimum: 100ms, Default: 3000ms
   */
  timeout?: number;
}

/**
 * Queued announcement with metadata
 */
interface QueuedAnnouncement {
  message: string;
  priority: 'polite' | 'assertive';
  timeout: number;
}

/**
 * Return type for useScreenReaderAnnouncer hook
 */
export interface ScreenReaderAnnouncer {
  /**
   * Announce a message to screen readers
   * @param message - Text to announce
   * @param options - Configuration for the announcement
   */
  announce: (message: string, options?: AnnouncementOptions) => void;

  /**
   * Announce modal state changes (open/close)
   * @param state - 'open' or 'close'
   * @param modalName - Name of the modal
   */
  announceModalState: (state: 'open' | 'close', modalName: string) => void;
}

const ANNOUNCER_ID = 'sr-announcer';
const DEFAULT_TIMEOUT = 3000;
const MIN_TIMEOUT = 100;
const CLEAR_DELAY = 50; // Delay before clearing to ensure screen reader starts reading
const NEXT_ANNOUNCEMENT_DELAY = 100; // Delay before processing next announcement

/**
 * Custom hook for managing screen reader announcements
 *
 * Creates a visually hidden aria-live region for announcing dynamic content changes
 * to screen reader users. Implements queue management to prevent announcement overlap.
 *
 * Features:
 * - Lazy creation of aria-live region on first announcement
 * - Support for 'polite' and 'assertive' politeness levels
 * - Automatic queueing to prevent announcement collisions
 * - Configurable timeout for clearing announcements
 * - Priority-based queue (assertive announcements jump ahead)
 * - Proper cleanup on unmount
 *
 * @returns Object with announce methods
 *
 * @example
 * ```tsx
 * const { announce, announceModalState } = useScreenReaderAnnouncer();
 *
 * // Regular announcement
 * announce('Map piece collected');
 *
 * // Urgent announcement
 * announce('Game over!', { priority: 'assertive' });
 *
 * // Modal state
 * announceModalState('open', 'Settings');
 * ```
 */
export function useScreenReaderAnnouncer(): ScreenReaderAnnouncer {
  // Ref to the aria-live DOM element
  const ariaLiveRegionRef = useRef<HTMLDivElement | null>(null);

  // Queue for pending announcements
  const queueRef = useRef<QueuedAnnouncement[]>([]);

  // Track if an announcement is currently being processed
  const processingRef = useRef(false);

  // Timeout for clearing current announcement
  const clearTimeoutRef = useRef<number | null>(null);

  // Timeout for processing next announcement
  const nextAnnouncementTimeoutRef = useRef<number | null>(null);

  // Track if component is mounted
  const isMountedRef = useRef(true);

  /**
   * Creates or retrieves the aria-live region
   */
  const getOrCreateAriaLiveRegion = useCallback((): HTMLDivElement | null => {
    if (!isMountedRef.current) {
      return null;
    }

    // Return existing region if already created
    if (ariaLiveRegionRef.current) {
      return ariaLiveRegionRef.current;
    }

    // Check if region already exists in DOM (e.g., from previous mount)
    let region = document.getElementById(ANNOUNCER_ID) as HTMLDivElement;

    if (!region) {
      // Create new region
      region = document.createElement('div');
      region.id = ANNOUNCER_ID;

      // Position off-screen but accessible to screen readers
      region.style.position = 'absolute';
      region.style.left = '-10000px';
      region.style.width = '1px';
      region.style.height = '1px';
      region.style.overflow = 'hidden';

      // Set ARIA attributes
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');

      // Add to DOM
      document.body.appendChild(region);
    }

    ariaLiveRegionRef.current = region;
    return region;
  }, []);

  /**
   * Updates the aria-live attribute for politeness level
   */
  const updatePoliteness = useCallback((priority: 'polite' | 'assertive') => {
    const region = ariaLiveRegionRef.current;
    if (region) {
      region.setAttribute('aria-live', priority);
      region.setAttribute('aria-atomic', 'true');
    }
  }, []);

  /**
   * Processes the next announcement in the queue
   */
  const processQueue = useCallback(() => {
    if (!isMountedRef.current || processingRef.current || queueRef.current.length === 0) {
      return;
    }

    processingRef.current = true;

    // Get next announcement (assertive messages have priority)
    const assertiveIndex = queueRef.current.findIndex(a => a.priority === 'assertive');
    const nextIndex = assertiveIndex !== -1 ? assertiveIndex : 0;
    const announcement = queueRef.current.splice(nextIndex, 1)[0];

    const region = getOrCreateAriaLiveRegion();
    if (!region) {
      processingRef.current = false;
      return;
    }

    // Clear any existing timeouts
    if (clearTimeoutRef.current !== null) {
      window.clearTimeout(clearTimeoutRef.current);
      clearTimeoutRef.current = null;
    }

    // Update politeness level
    updatePoliteness(announcement.priority);

    // Set the announcement text
    region.textContent = announcement.message;

    // Ensure timeout is at least MIN_TIMEOUT
    const timeout = Math.max(announcement.timeout, MIN_TIMEOUT);

    // Clear announcement after timeout
    clearTimeoutRef.current = window.setTimeout(() => {
      if (!isMountedRef.current || !region) {
        return;
      }

      region.textContent = '';
      clearTimeoutRef.current = null;
      processingRef.current = false;

      // Process next announcement in queue after a small delay
      if (queueRef.current.length > 0) {
        nextAnnouncementTimeoutRef.current = window.setTimeout(() => {
          processQueue();
        }, NEXT_ANNOUNCEMENT_DELAY);
      }
    }, timeout);
  }, [getOrCreateAriaLiveRegion, updatePoliteness]);

  /**
   * Announce a message to screen readers
   */
  const announce = useCallback((message: string, options: AnnouncementOptions = {}) => {
    // Ignore empty or whitespace-only messages
    if (!message || !message.trim()) {
      return;
    }

    if (!isMountedRef.current) {
      return;
    }

    const priority = options.priority || 'polite';
    const timeout = options.timeout !== undefined ? options.timeout : DEFAULT_TIMEOUT;

    // Add to queue
    queueRef.current.push({
      message: message.trim(),
      priority,
      timeout,
    });

    // Start processing if not already processing
    if (!processingRef.current) {
      // Small delay to allow React to batch updates
      setTimeout(() => {
        processQueue();
      }, CLEAR_DELAY);
    }
  }, [processQueue]);

  /**
   * Announce modal state changes
   */
  const announceModalState = useCallback((state: 'open' | 'close', modalName: string) => {
    const action = state === 'open' ? 'opened' : 'closed';
    const message = `${modalName} ${action}`;

    announce(message, { priority: 'assertive' });
  }, [announce]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      isMountedRef.current = false;

      // Clear all timeouts
      if (clearTimeoutRef.current !== null) {
        window.clearTimeout(clearTimeoutRef.current);
      }
      if (nextAnnouncementTimeoutRef.current !== null) {
        window.clearTimeout(nextAnnouncementTimeoutRef.current);
      }

      // Remove aria-live region from DOM
      const region = ariaLiveRegionRef.current;
      if (region && region.parentNode) {
        region.parentNode.removeChild(region);
      }

      // Clear refs
      ariaLiveRegionRef.current = null;
      queueRef.current = [];
      processingRef.current = false;
    };
  }, []);

  return {
    announce,
    announceModalState,
  };
}
