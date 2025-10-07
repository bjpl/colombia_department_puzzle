import { useState, useEffect } from 'react';

/**
 * useMediaQuery Hook
 *
 * Reactive hook that listens to media query changes.
 * Returns true when media query matches, false otherwise.
 *
 * @param query - CSS media query string (e.g., "(max-width: 768px)")
 * @returns boolean indicating if query matches
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 767px)');
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with current match state (prevents hydration mismatch in SSR)
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    // Create media query list
    const mediaQueryList = window.matchMedia(query);

    // Update state when query match changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value
    setMatches(mediaQueryList.matches);

    // Modern browsers use addEventListener
    // Legacy browsers use addListener (deprecated)
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQueryList.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
}

/**
 * useViewportCategory Hook
 *
 * Returns current viewport category: 'mobile' | 'tablet' | 'desktop'
 * Automatically updates when window is resized.
 *
 * @example
 * const viewport = useViewportCategory();
 * if (viewport === 'mobile') { ... }
 */
export function useViewportCategory(): 'mobile' | 'tablet' | 'desktop' {
  const [category, setCategory] = useState<'mobile' | 'tablet' | 'desktop'>(() => {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width <= 767) return 'mobile';
    if (width <= 1023) return 'tablet';
    return 'desktop';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 767) setCategory('mobile');
      else if (width <= 1023) setCategory('tablet');
      else setCategory('desktop');
    };

    // Debounce resize events (300ms)
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 300);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  return category;
}
