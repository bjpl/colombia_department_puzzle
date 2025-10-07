import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BottomSheet from '../../src/components/BottomSheet';

describe('BottomSheet Component', () => {
  beforeEach(() => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, // iPhone size
    });
  });

  describe('Rendering', () => {
    it('should render children content', () => {
      render(
        <BottomSheet>
          <div>Test Content</div>
        </BottomSheet>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render drag handle', () => {
      render(<BottomSheet>Content</BottomSheet>);

      const handle = screen.getByRole('button', { name: /desliza/i });
      expect(handle).toBeInTheDocument();
    });

    it('should have correct ARIA attributes', () => {
      render(<BottomSheet>Content</BottomSheet>);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-label', 'Departamentos disponibles');
    });
  });

  describe('Snap Points', () => {
    it('should start at collapsed snap point by default', () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet onSnapChange={onSnapChange}>
          Content
        </BottomSheet>
      );

      // Should be at collapsed position (120px)
      const dialog = screen.getByRole('dialog');
      expect(dialog.style.transform).toContain('120px');
    });

    it('should start at specified initial snap point', () => {
      render(
        <BottomSheet initialSnapPoint="half">
          Content
        </BottomSheet>
      );

      const dialog = screen.getByRole('dialog');
      // Half should be 50vh = 400px (50% of 800px)
      expect(dialog.style.transform).toContain('400px');
    });

    it('should call onSnapChange when snap point changes', async () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet onSnapChange={onSnapChange}>
          Content
        </BottomSheet>
      );

      const handle = screen.getByRole('button', { name: /desliza/i });

      // Simulate Enter key to cycle snap points
      fireEvent.keyDown(handle, { key: 'Enter' });

      await waitFor(() => {
        expect(onSnapChange).toHaveBeenCalledWith('half');
      });
    });
  });

  describe('Touch Gestures', () => {
    it('should handle touch start event', () => {
      render(<BottomSheet>Content</BottomSheet>);

      const handle = screen.getByRole('button', { name: /desliza/i });

      fireEvent.touchStart(handle, {
        touches: [{ clientY: 500 }],
      });

      // Should not throw error
      expect(handle).toBeInTheDocument();
    });

    it('should update position during touch move', () => {
      render(<BottomSheet>Content</BottomSheet>);

      const handle = screen.getByRole('button', { name: /desliza/i });

      // Start touch
      fireEvent.touchStart(handle, {
        touches: [{ clientY: 500 }],
      });

      // Move touch upward (drag up)
      fireEvent.touchMove(handle, {
        touches: [{ clientY: 300 }],
      });

      // Position should update
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('should snap to nearest point on touch end', async () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet onSnapChange={onSnapChange}>
          Content
        </BottomSheet>
      );

      const handle = screen.getByRole('button', { name: /desliza/i });

      // Simulate swipe up gesture
      fireEvent.touchStart(handle, {
        touches: [{ clientY: 500 }],
      });

      fireEvent.touchMove(handle, {
        touches: [{ clientY: 200 }],
      });

      fireEvent.touchEnd(handle);

      await waitFor(() => {
        // Should snap to half or full based on distance/velocity
        expect(onSnapChange).toHaveBeenCalled();
      });
    });
  });

  describe('Mouse Events (Desktop Testing)', () => {
    it('should handle mouse down event', () => {
      render(<BottomSheet>Content</BottomSheet>);

      const handle = screen.getByRole('button', { name: /desliza/i });

      fireEvent.mouseDown(handle, { clientY: 500 });

      expect(handle).toBeInTheDocument();
    });

    it('should handle drag with mouse', () => {
      render(<BottomSheet>Content</BottomSheet>);

      const handle = screen.getByRole('button', { name: /desliza/i });

      fireEvent.mouseDown(handle, { clientY: 500 });

      // Mouse move is handled on document
      fireEvent.mouseMove(document, { clientY: 300 });
      fireEvent.mouseUp(document);

      expect(handle).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should cycle through snap points with Enter key', async () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet initialSnapPoint="collapsed" onSnapChange={onSnapChange}>
          Content
        </BottomSheet>
      );

      const handle = screen.getByRole('button', { name: /desliza/i });

      // Enter should go from collapsed -> half
      fireEvent.keyDown(handle, { key: 'Enter' });
      await waitFor(() => {
        expect(onSnapChange).toHaveBeenCalledWith('half');
      });
    });

    it('should cycle through snap points with Space key', async () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet initialSnapPoint="collapsed" onSnapChange={onSnapChange}>
          Content
        </BottomSheet>
      );

      const handle = screen.getByRole('button', { name: /desliza/i });

      fireEvent.keyDown(handle, { key: ' ' });
      await waitFor(() => {
        expect(onSnapChange).toHaveBeenCalledWith('half');
      });
    });

    it('should collapse on Escape key', async () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet initialSnapPoint="full" onSnapChange={onSnapChange}>
          Content
        </BottomSheet>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(onSnapChange).toHaveBeenCalledWith('collapsed');
      });
    });
  });

  describe('Backdrop Interaction', () => {
    it('should show backdrop when not collapsed', () => {
      render(
        <BottomSheet initialSnapPoint="half">
          Content
        </BottomSheet>
      );

      // Backdrop should be visible (not display: none)
      const backdrop = document.querySelector('.fixed.inset-0');
      expect(backdrop).toBeInTheDocument();
      expect(backdrop).not.toHaveStyle({ display: 'none' });
    });

    it('should hide backdrop when collapsed', () => {
      render(
        <BottomSheet initialSnapPoint="collapsed">
          Content
        </BottomSheet>
      );

      const backdrop = document.querySelector('.fixed.inset-0');
      expect(backdrop).toHaveStyle({ display: 'none' });
    });

    it('should collapse on backdrop click', async () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet initialSnapPoint="half" onSnapChange={onSnapChange}>
          Content
        </BottomSheet>
      );

      const backdrop = document.querySelector('.fixed.inset-0');
      fireEvent.click(backdrop!);

      await waitFor(() => {
        expect(onSnapChange).toHaveBeenCalledWith('collapsed');
      });
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      render(<BottomSheet>Content</BottomSheet>);

      const handle = screen.getByRole('button', { name: /desliza/i });
      expect(handle).toHaveAttribute('tabIndex', '0');
    });

    it('should update aria-label based on state', () => {
      render(
        <BottomSheet initialSnapPoint="collapsed">
          Content
        </BottomSheet>
      );

      const handle = screen.getByRole('button');
      expect(handle).toHaveAttribute('aria-label', expect.stringContaining('arriba'));
    });

    it('should be announced to screen readers', () => {
      render(<BottomSheet>Content</BottomSheet>);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-label');
    });
  });

  describe('Performance', () => {
    it('should use transform for animations (GPU accelerated)', () => {
      render(<BottomSheet>Content</BottomSheet>);

      const dialog = screen.getByRole('dialog');
      expect(dialog.style.willChange).toBe('transform');
      expect(dialog.style.transform).toBeTruthy();
    });

    it('should disable transitions during drag', () => {
      render(<BottomSheet>Content</BottomSheet>);

      const handle = screen.getByRole('button', { name: /desliza/i });
      const dialog = screen.getByRole('dialog');

      // Start dragging
      fireEvent.touchStart(handle, {
        touches: [{ clientY: 500 }],
      });

      fireEvent.touchMove(handle, {
        touches: [{ clientY: 300 }],
      });

      // Transition should be 'none' during drag for instant response
      expect(dialog.style.transition).toContain('none');
    });
  });
});
