import { useEffect, useState } from 'react';

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
        <button
          onClick={scrollUp}
          className="absolute top-8 right-2 z-20 bg-white/90 rounded-full p-1 shadow-md hover:bg-white transition-colors"
          aria-label="Desplazar hacia arriba"
          title="Desplazar hacia arriba (↑)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 4L3 9h10L8 4z"/>
          </svg>
        </button>
      )}

      {/* Bottom scroll indicator */}
      {canScrollDown && (
        <button
          onClick={scrollDown}
          className="absolute bottom-2 right-2 z-20 bg-white/90 rounded-full p-1 shadow-md hover:bg-white transition-colors"
          aria-label="Desplazar hacia abajo"
          title="Desplazar hacia abajo (↓)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 12L3 7h10L8 12z"/>
          </svg>
        </button>
      )}
    </>
  );
}