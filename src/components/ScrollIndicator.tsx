import { useEffect, useState } from 'react';
import { Button } from '../design-system';

interface ScrollIndicatorProps {
  containerId: string;
}

export default function ScrollIndicator({ containerId }: ScrollIndicatorProps) {
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const checkScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setCanScrollUp(scrollTop > 5);
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 5);
    };

    checkScroll();
    container.addEventListener('scroll', checkScroll);

    // Check on resize too
    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      resizeObserver.disconnect();
    };
  }, [containerId]);

  const scrollUp = () => {
    const container = document.getElementById(containerId);
    if (container) {
      container.scrollTop -= 100;
    }
  };

  const scrollDown = () => {
    const container = document.getElementById(containerId);
    if (container) {
      container.scrollTop += 100;
    }
  };

  return (
    <>
      {/* Top scroll indicator */}
      {canScrollUp && (
        <div
          className="absolute top-8 right-2 z-20 bg-neutral-50/90 rounded-full shadow-md"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollUp}
            aria-label="Desplazar hacia arriba"
            title="Desplazar hacia arriba (↑)"
            className="rounded-full p-1 min-w-0 min-h-0"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 4L3 9h10L8 4z"/>
            </svg>
          </Button>
        </div>
      )}

      {/* Bottom scroll indicator */}
      {canScrollDown && (
        <div
          className="absolute bottom-2 right-2 z-20 bg-neutral-50/90 rounded-full shadow-md"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollDown}
            aria-label="Desplazar hacia abajo"
            title="Desplazar hacia abajo (↓)"
            className="rounded-full p-1 min-w-0 min-h-0"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 12L3 7h10L8 12z"/>
            </svg>
          </Button>
        </div>
      )}
    </>
  );
}