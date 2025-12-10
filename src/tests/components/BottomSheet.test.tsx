/**
 * BottomSheet Component Tests
 *
 * Tests for mobile bottom drawer with swipe gestures and snap points.
 * Verifies touch handling, accessibility, and spring physics animations.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BottomSheet from '../../components/layout/BottomSheet';
import { BOTTOM_SHEET_SNAP_POINTS, MOBILE_LAYOUT } from '../../constants/responsive';

describe('BottomSheet', () => {
  // Mock window dimensions
  beforeEach(() => {
    // Set viewport dimensions for tests
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
  });

  describe('Rendering', () => {
    it('should render children content', () => {
      render(
        <BottomSheet>
          <div data-testid="child-content">Test Content</div>
        </BottomSheet>
      );

      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render drag handle', () => {
      render(
        <BottomSheet>
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza/i });
      expect(dragHandle).toBeInTheDocument();
    });

    it('should start at initial snap point', () => {
      render(
        <BottomSheet initialSnapPoint="half">
          <div>Content</div>
        </BottomSheet>
      );

      const sheet = screen.getByRole('dialog');
      expect(sheet).toBeInTheDocument();

      // Check transform style includes half snap point (50vh = 400px)
      const style = sheet.getAttribute('style');
      expect(style).toContain('translateY');
    });

    it('should apply custom className', () => {
      render(
        <BottomSheet className="custom-class">
          <div>Content</div>
        </BottomSheet>
      );

      const sheet = screen.getByRole('dialog');
      expect(sheet).toHaveClass('custom-class');
    });

    it('should have proper ARIA attributes', () => {
      render(
        <BottomSheet initialSnapPoint="collapsed">
          <div>Content</div>
        </BottomSheet>
      );

      const sheet = screen.getByRole('dialog');
      expect(sheet).toHaveAttribute('aria-label', 'Departamentos disponibles');
      expect(sheet).toHaveAttribute('aria-modal', 'false'); // collapsed state
    });

    it('should update aria-modal when expanded', () => {
      render(
        <BottomSheet initialSnapPoint="half">
          <div>Content</div>
        </BottomSheet>
      );

      const sheet = screen.getByRole('dialog');
      expect(sheet).toHaveAttribute('aria-modal', 'true'); // expanded state
    });
  });

  describe('Snap Points', () => {
    it('should snap to collapsed position (120px)', () => {
      render(
        <BottomSheet initialSnapPoint="collapsed">
          <div>Content</div>
        </BottomSheet>
      );

      const sheet = screen.getByRole('dialog');
      const style = sheet.getAttribute('style');

      // Height should be 120px for collapsed
      expect(BOTTOM_SHEET_SNAP_POINTS.collapsed).toBe(120);
      expect(style).toContain('translateY');
    });

    it('should snap to half position (50vh)', () => {
      render(
        <BottomSheet initialSnapPoint="half">
          <div>Content</div>
        </BottomSheet>
      );

      const sheet = screen.getByRole('dialog');
      const style = sheet.getAttribute('style');

      // Should use 50vh (400px with 800px viewport height)
      expect(BOTTOM_SHEET_SNAP_POINTS.half).toBe('50vh');
      expect(style).toContain('translateY');
    });

    it('should snap to full position (85vh)', () => {
      render(
        <BottomSheet initialSnapPoint="full">
          <div>Content</div>
        </BottomSheet>
      );

      const sheet = screen.getByRole('dialog');
      const style = sheet.getAttribute('style');

      // Should use 85vh (680px with 800px viewport height)
      expect(BOTTOM_SHEET_SNAP_POINTS.full).toBe('85vh');
      expect(style).toContain('translateY');
    });
  });

  describe('Gestures - Mouse Events', () => {
    it('should handle mouse down on drag handle', async () => {
      render(
        <BottomSheet initialSnapPoint="collapsed">
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza/i });

      fireEvent.mouseDown(dragHandle, { clientY: 700 });

      // Component should enter dragging state (tested via drag behavior)
      expect(dragHandle).toBeInTheDocument();
    });

    it('should track mouse drag movement', async () => {
      render(
        <BottomSheet initialSnapPoint="collapsed">
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza/i });
      const sheet = screen.getByRole('dialog');

      // Start drag
      fireEvent.mouseDown(dragHandle, { clientY: 700 });

      // Move mouse up (expand)
      fireEvent.mouseMove(document, { clientY: 600 });

      // Release
      fireEvent.mouseUp(document);

      await waitFor(() => {
        const style = sheet.getAttribute('style');
        expect(style).toContain('translateY');
      });
    });

    it('should snap based on velocity threshold (fast swipe up)', async () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet initialSnapPoint="collapsed" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza/i });

      // Fast swipe up (high velocity)
      fireEvent.mouseDown(dragHandle, { clientY: 700 });

      // Small delay to simulate fast movement
      await new Promise(resolve => setTimeout(resolve, 10));
      fireEvent.mouseMove(document, { clientY: 500 }); // 200px in 10ms = 20 px/ms
      fireEvent.mouseUp(document);

      await waitFor(() => {
        // Should snap to next level (half)
        expect(onSnapChange).toHaveBeenCalledWith('half');
      });
    });

    it('should snap based on velocity threshold (fast swipe down)', async () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet initialSnapPoint="half" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza/i });

      // Fast swipe down (negative velocity)
      fireEvent.mouseDown(dragHandle, { clientY: 400 });

      await new Promise(resolve => setTimeout(resolve, 10));
      fireEvent.mouseMove(document, { clientY: 600 }); // -200px in 10ms
      fireEvent.mouseUp(document);

      await waitFor(() => {
        // Should snap to previous level (collapsed)
        expect(onSnapChange).toHaveBeenCalledWith('collapsed');
      });
    });

    it('should snap based on position if velocity is low', async () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet initialSnapPoint="collapsed" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza/i });

      // Slow drag (low velocity)
      fireEvent.mouseDown(dragHandle, { clientY: 700 });

      await new Promise(resolve => setTimeout(resolve, 500)); // Long duration = low velocity
      fireEvent.mouseMove(document, { clientY: 500 }); // 200px in 500ms = 0.4 px/ms (below threshold)
      fireEvent.mouseUp(document);

      await waitFor(() => {
        // Should snap to nearest point based on distance
        expect(onSnapChange).toHaveBeenCalled();
      });
    });
  });

  describe('Gestures - Touch Events', () => {
    it('should handle touch start on drag handle', () => {
      render(
        <BottomSheet initialSnapPoint="collapsed">
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza/i });

      fireEvent.touchStart(dragHandle, {
        touches: [{ clientY: 700 }],
      });

      expect(dragHandle).toBeInTheDocument();
    });

    it('should track touch move during drag', () => {
      render(
        <BottomSheet initialSnapPoint="collapsed">
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza/i });

      // Start touch
      fireEvent.touchStart(dragHandle, {
        touches: [{ clientY: 700 }],
      });

      // Move touch up
      fireEvent.touchMove(dragHandle, {
        touches: [{ clientY: 600 }],
      });

      expect(dragHandle).toBeInTheDocument();
    });

    it('should complete snap on touch end', async () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet initialSnapPoint="collapsed" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza/i });

      // Complete touch gesture
      fireEvent.touchStart(dragHandle, {
        touches: [{ clientY: 700 }],
      });

      fireEvent.touchMove(dragHandle, {
        touches: [{ clientY: 500 }],
      });

      fireEvent.touchEnd(dragHandle);

      await waitFor(() => {
        expect(onSnapChange).toHaveBeenCalled();
      });
    });

    it('should respect velocity threshold for touch gestures', async () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet initialSnapPoint="half" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza/i });

      // Fast swipe
      fireEvent.touchStart(dragHandle, {
        touches: [{ clientY: 400 }],
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      fireEvent.touchMove(dragHandle, {
        touches: [{ clientY: 200 }],
      });

      fireEvent.touchEnd(dragHandle);

      await waitFor(() => {
        // Should expand to full due to high velocity
        expect(onSnapChange).toHaveBeenCalledWith('full');
      });
    });
  });

  describe('Backdrop', () => {
    it('should render backdrop when expanded', () => {
      render(
        <BottomSheet initialSnapPoint="half">
          <div>Content</div>
        </BottomSheet>
      );

      // Backdrop should be visible (not display: none)
      const backdrop = document.querySelector('.fixed.inset-0');
      expect(backdrop).toBeInTheDocument();
      const style = backdrop?.getAttribute('style');
      expect(style).not.toContain('display: none');
    });

    it('should hide backdrop when collapsed', () => {
      render(
        <BottomSheet initialSnapPoint="collapsed">
          <div>Content</div>
        </BottomSheet>
      );

      const backdrop = document.querySelector('.fixed.inset-0');
      expect(backdrop).toBeInTheDocument();
      const style = backdrop?.getAttribute('style');
      expect(style).toContain('display: none');
    });

    it('should collapse when backdrop is tapped', async () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet initialSnapPoint="half" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      const backdrop = document.querySelector('.fixed.inset-0') as HTMLElement;
      expect(backdrop).toBeInTheDocument();

      fireEvent.click(backdrop);

      await waitFor(() => {
        expect(onSnapChange).toHaveBeenCalledWith('collapsed');
      });
    });

    it('should not close on content click', async () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet initialSnapPoint="half" onSnapChange={onSnapChange}>
          <div data-testid="content">Content</div>
        </BottomSheet>
      );

      const content = screen.getByTestId('content');
      fireEvent.click(content);

      // Should not trigger snap change
      await waitFor(() => {
        expect(onSnapChange).not.toHaveBeenCalled();
      }, { timeout: 500 });
    });

    it('should update backdrop opacity based on sheet height', () => {
      const { rerender } = render(
        <BottomSheet initialSnapPoint="collapsed">
          <div>Content</div>
        </BottomSheet>
      );

      let backdrop = document.querySelector('.fixed.inset-0') as HTMLElement;
      let style = backdrop?.getAttribute('style');

      // Collapsed = no opacity (hidden)
      expect(style).toContain('display: none');

      // Rerender with half snap point
      rerender(
        <BottomSheet initialSnapPoint="half">
          <div>Content</div>
        </BottomSheet>
      );

      backdrop = document.querySelector('.fixed.inset-0') as HTMLElement;
      style = backdrop?.getAttribute('style');

      // Half should have some opacity
      expect(style).toContain('opacity:');
      expect(style).not.toContain('display: none');
    });
  });

  describe('Accessibility', () => {
    it('should close on Escape key', async () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet initialSnapPoint="half" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(onSnapChange).toHaveBeenCalledWith('collapsed');
      });
    });

    it('should not close on Escape when already collapsed', async () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet initialSnapPoint="collapsed" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(onSnapChange).not.toHaveBeenCalled();
      }, { timeout: 500 });
    });

    it('should have 44px minimum touch target for drag handle', () => {
      render(
        <BottomSheet>
          <div>Content</div>
        </BottomSheet>
      );

      screen.getByRole('button', { name: /Desliza/i });

      // Check that drag handle area meets WCAG AAA guidelines
      expect(MOBILE_LAYOUT.dragHandleHeight).toBe(44);
    });

    it('should have proper ARIA label on drag handle', () => {
      render(
        <BottomSheet initialSnapPoint="collapsed">
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza arriba para expandir/i });
      expect(dragHandle).toBeInTheDocument();
    });

    it('should update ARIA label based on current state', () => {
      const { rerender } = render(
        <BottomSheet initialSnapPoint="collapsed">
          <div>Content</div>
        </BottomSheet>
      );

      let dragHandle = screen.getByRole('button', { name: /Desliza arriba para expandir/i });
      expect(dragHandle).toBeInTheDocument();

      rerender(
        <BottomSheet initialSnapPoint="half">
          <div>Content</div>
        </BottomSheet>
      );

      dragHandle = screen.getByRole('button', { name: /Desliza abajo para colapsar/i });
      expect(dragHandle).toBeInTheDocument();
    });

    it('should support keyboard navigation on drag handle', async () => {
      const user = userEvent.setup();
      const onSnapChange = vi.fn();

      render(
        <BottomSheet initialSnapPoint="collapsed" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza/i });

      dragHandle.focus();
      expect(dragHandle).toHaveFocus();

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(onSnapChange).toHaveBeenCalledWith('half');
      });
    });

    it('should support Space key on drag handle', async () => {
      const user = userEvent.setup();
      const onSnapChange = vi.fn();

      render(
        <BottomSheet initialSnapPoint="collapsed" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza/i });

      dragHandle.focus();
      await user.keyboard(' ');

      await waitFor(() => {
        expect(onSnapChange).toHaveBeenCalledWith('half');
      });
    });

    it('should cycle through snap points with keyboard', async () => {
      const user = userEvent.setup();
      const onSnapChange = vi.fn();

      render(
        <BottomSheet initialSnapPoint="collapsed" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza/i });

      // collapsed -> half
      dragHandle.focus();
      await user.keyboard('{Enter}');
      await waitFor(() => expect(onSnapChange).toHaveBeenCalledWith('half'));

      onSnapChange.mockClear();

      // Simulate state change by rerendering
      render(
        <BottomSheet initialSnapPoint="half" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle2 = screen.getByRole('button', { name: /Desliza/i });

      // half -> full
      dragHandle2.focus();
      await user.keyboard('{Enter}');
      await waitFor(() => expect(onSnapChange).toHaveBeenCalledWith('full'));
    });

    it('should have tabIndex for keyboard focus', () => {
      render(
        <BottomSheet>
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza/i });
      expect(dragHandle).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Callbacks', () => {
    it('should call onSnapChange when snap point changes', async () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet initialSnapPoint="collapsed" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza/i });

      // Trigger gesture
      fireEvent.mouseDown(dragHandle, { clientY: 700 });
      await new Promise(resolve => setTimeout(resolve, 10));
      fireEvent.mouseMove(document, { clientY: 500 });
      fireEvent.mouseUp(document);

      await waitFor(() => {
        expect(onSnapChange).toHaveBeenCalled();
      });
    });

    it('should pass correct snap point to callback', async () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet initialSnapPoint="collapsed" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza/i });

      // Fast swipe up
      fireEvent.mouseDown(dragHandle, { clientY: 700 });
      await new Promise(resolve => setTimeout(resolve, 10));
      fireEvent.mouseMove(document, { clientY: 500 });
      fireEvent.mouseUp(document);

      await waitFor(() => {
        const callArg = onSnapChange.mock.calls[0][0];
        expect(['collapsed', 'half', 'full']).toContain(callArg);
      });
    });

    it('should not call callback if snap point unchanged', async () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet initialSnapPoint="collapsed" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza/i });

      // Small drag that returns to same position
      fireEvent.mouseDown(dragHandle, { clientY: 700 });
      await new Promise(resolve => setTimeout(resolve, 500)); // Slow = low velocity
      fireEvent.mouseMove(document, { clientY: 690 }); // Small movement
      fireEvent.mouseUp(document);

      await waitFor(() => {
        // Should snap back to collapsed without calling callback
        expect(onSnapChange).not.toHaveBeenCalled();
      }, { timeout: 500 });
    });

    it('should call callback on backdrop click', async () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet initialSnapPoint="half" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      const backdrop = document.querySelector('.fixed.inset-0') as HTMLElement;
      fireEvent.click(backdrop);

      await waitFor(() => {
        expect(onSnapChange).toHaveBeenCalledWith('collapsed');
      });
    });

    it('should call callback on Escape key', async () => {
      const onSnapChange = vi.fn();
      render(
        <BottomSheet initialSnapPoint="full" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(onSnapChange).toHaveBeenCalledWith('collapsed');
      });
    });
  });

  describe('Spring Physics Animation', () => {
    it('should have smooth transition when not dragging', () => {
      render(
        <BottomSheet initialSnapPoint="collapsed">
          <div>Content</div>
        </BottomSheet>
      );

      const sheet = screen.getByRole('dialog');
      const style = sheet.getAttribute('style');

      // Should have transition duration
      expect(style).toContain(`${MOBILE_LAYOUT.transitionDuration}ms`);
      expect(MOBILE_LAYOUT.transitionDuration).toBe(300);
    });

    it('should disable transition during drag', async () => {
      render(
        <BottomSheet initialSnapPoint="collapsed">
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza/i });
      const sheet = screen.getByRole('dialog');

      // Start drag
      fireEvent.mouseDown(dragHandle, { clientY: 700 });

      // During drag, transition should be 'none'
      await waitFor(() => {
        const style = sheet.getAttribute('style');
        expect(style).toContain('transition: none');
      });
    });

    it('should use cubic-bezier easing', () => {
      render(
        <BottomSheet initialSnapPoint="collapsed">
          <div>Content</div>
        </BottomSheet>
      );

      const sheet = screen.getByRole('dialog');
      const style = sheet.getAttribute('style');

      // Check for cubic-bezier easing function
      expect(style).toContain('cubic-bezier(0.4, 0.0, 0.2, 1)');
    });

    it('should use GPU-accelerated transform', () => {
      render(
        <BottomSheet initialSnapPoint="collapsed">
          <div>Content</div>
        </BottomSheet>
      );

      const sheet = screen.getByRole('dialog');
      const style = sheet.getAttribute('style');

      // Should use transform (GPU-accelerated) not top/bottom
      expect(style).toContain('transform');
      expect(style).toContain('translateY');
    });

    it('should have will-change optimization hint', () => {
      render(
        <BottomSheet initialSnapPoint="collapsed">
          <div>Content</div>
        </BottomSheet>
      );

      const sheet = screen.getByRole('dialog');
      const style = sheet.getAttribute('style');

      // Should have will-change: transform
      expect(style).toContain('will-change: transform');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid snap point changes', async () => {
      const onSnapChange = vi.fn();
      const { rerender } = render(
        <BottomSheet initialSnapPoint="collapsed" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      // Rapidly change snap points
      rerender(
        <BottomSheet initialSnapPoint="half" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      rerender(
        <BottomSheet initialSnapPoint="full" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      rerender(
        <BottomSheet initialSnapPoint="collapsed" onSnapChange={onSnapChange}>
          <div>Content</div>
        </BottomSheet>
      );

      const sheet = screen.getByRole('dialog');
      expect(sheet).toBeInTheDocument();
    });

    it('should handle window resize during drag', async () => {
      render(
        <BottomSheet initialSnapPoint="collapsed">
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza/i });

      // Start drag
      fireEvent.mouseDown(dragHandle, { clientY: 700 });

      // Resize window
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 600,
      });

      fireEvent.resize(window);

      // Complete drag
      fireEvent.mouseMove(document, { clientY: 500 });
      fireEvent.mouseUp(document);

      const sheet = screen.getByRole('dialog');
      expect(sheet).toBeInTheDocument();
    });

    it('should prevent browser scroll during drag', () => {
      render(
        <BottomSheet>
          <div>Content</div>
        </BottomSheet>
      );

      const sheet = screen.getByRole('dialog');
      const style = sheet.getAttribute('style');

      // Should have touch-action: none
      expect(style).toContain('touch-action: none');
    });

    it('should enforce max height safety limit', () => {
      render(
        <BottomSheet initialSnapPoint="full">
          <div>Content</div>
        </BottomSheet>
      );

      const sheet = screen.getByRole('dialog');
      const style = sheet.getAttribute('style');

      // Should have maxHeight: 90vh
      expect(style).toContain('max-height: 90vh');
    });

    it('should handle content overflow with scrolling', () => {
      render(
        <BottomSheet initialSnapPoint="half">
          <div style={{ height: '1000px' }}>Tall Content</div>
        </BottomSheet>
      );

      const contentArea = document.querySelector('.overflow-y-auto');
      expect(contentArea).toBeInTheDocument();
      expect(contentArea).toHaveClass('overflow-y-auto');
    });
  });

  describe('Safe Area Handling', () => {
    it('should include safe area padding for iOS notch', () => {
      render(
        <BottomSheet>
          <div>Content</div>
        </BottomSheet>
      );

      const sheet = screen.getByRole('dialog');
      const style = sheet.getAttribute('style');

      // Should include paddingBottom with safe area
      expect(style).toContain('padding-bottom');
    });
  });

  describe('Performance', () => {
    it('should cleanup mouse event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = render(
        <BottomSheet>
          <div>Content</div>
        </BottomSheet>
      );

      const dragHandle = screen.getByRole('button', { name: /Desliza/i });

      // Start drag to attach listeners
      fireEvent.mouseDown(dragHandle, { clientY: 700 });

      unmount();

      // Should remove mousemove and mouseup listeners
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });

    it('should cleanup keyboard event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = render(
        <BottomSheet initialSnapPoint="half">
          <div>Content</div>
        </BottomSheet>
      );

      unmount();

      // Should remove keydown listener
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });
});
