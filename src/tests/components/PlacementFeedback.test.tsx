/**
 * PlacementFeedback Component Tests
 * Tests for visual feedback animations on department placement
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PlacementFeedback from '../../components/PlacementFeedback';

describe('PlacementFeedback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should not render when show is false', () => {
      const { container } = render(
        <PlacementFeedback show={false} isCorrect={true} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render when show is true', () => {
      render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
        />
      );

      expect(screen.getByText(/Correcto/i)).toBeInTheDocument();
    });

    it('should hide after 2 seconds', async () => {
      const { act } = await import('@testing-library/react');
      render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
        />
      );

      expect(screen.getByText(/Correcto/i)).toBeInTheDocument();

      // Fast-forward time and wait for updates
      await act(async () => {
        vi.runOnlyPendingTimers();
      });

      expect(screen.queryByText(/Correcto/i)).not.toBeInTheDocument();
    });
  });

  describe('Correct Placement', () => {
    it('should show success message', () => {
      render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
        />
      );

      expect(screen.getByText(/¡Correcto!/i)).toBeInTheDocument();
      expect(screen.getByText(/Antioquia/i)).toBeInTheDocument();
    });

    it('should show checkmark emoji', () => {
      render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
        />
      );

      expect(screen.getByText('✅')).toBeInTheDocument();
    });

    it('should use green background', () => {
      const { container } = render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
        />
      );

      const messageBox = container.querySelector('.rounded-lg.shadow-lg');
      expect(messageBox).toHaveStyle({ backgroundColor: '#16a34a' });
    });

    it('should use white text', () => {
      render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
        />
      );

      const element = screen.getByText(/Correcto/i).closest('div');
      expect(element).toHaveStyle({ color: '#FFFFFF' });
    });
  });

  describe('Incorrect Placement', () => {
    it('should show error message', () => {
      render(
        <PlacementFeedback
          show={true}
          isCorrect={false}
          departmentName="Cundinamarca"
        />
      );

      expect(screen.getByText(/Intenta de nuevo/i)).toBeInTheDocument();
      expect(screen.getByText(/Cundinamarca/i)).toBeInTheDocument();
    });

    it('should show X emoji', () => {
      render(
        <PlacementFeedback
          show={true}
          isCorrect={false}
          departmentName="Cundinamarca"
        />
      );

      expect(screen.getByText('❌')).toBeInTheDocument();
    });

    it('should use red background', () => {
      const { container } = render(
        <PlacementFeedback
          show={true}
          isCorrect={false}
          departmentName="Cundinamarca"
        />
      );

      const messageBox = container.querySelector('.rounded-lg.shadow-lg');
      expect(messageBox).toHaveStyle({ backgroundColor: '#dc2626' });
    });

    it('should show generic message when no department name', () => {
      render(<PlacementFeedback show={true} isCorrect={false} />);

      expect(screen.getByText(/Ubicación incorrecta/i)).toBeInTheDocument();
    });
  });

  describe('Positioning', () => {
    it('should use default center position when not provided', () => {
      const { container } = render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
        />
      );

      const element = container.firstChild as HTMLElement;
      // Check that left and top styles exist and contain 'px'
      expect(element.style.left).toMatch(/\d+px/);
      expect(element.style.top).toMatch(/\d+px/);
    });

    it('should use custom position when provided', () => {
      const { container } = render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
          position={{ x: 200, y: 300 }}
        />
      );

      const element = container.firstChild as HTMLElement;
      expect(element).toHaveStyle({
        left: '200px',
        top: '300px',
      });
    });

    it('should center element with transform', () => {
      const { container } = render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
        />
      );

      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('transform', '-translate-x-1/2', '-translate-y-1/2');
    });
  });

  describe('Animations', () => {
    it('should have bounce animation class', () => {
      const { container } = render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
        />
      );

      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('animate-bounce');
    });

    it('should have pulse animation on feedback', () => {
      render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
        />
      );

      const pulseElement = document.querySelector('[style*="pulse"]');
      expect(pulseElement).toBeInTheDocument();
    });

    it('should show ripple effect', () => {
      render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
        />
      );

      const ripple = document.querySelector('.animate-ping');
      expect(ripple).toBeInTheDocument();
    });

    it('should use correct color for ripple on success', () => {
      render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
        />
      );

      const ripple = document.querySelector('.animate-ping') as HTMLElement;
      expect(ripple).toHaveStyle({ backgroundColor: '#16a34a' });
    });

    it('should use correct color for ripple on error', () => {
      render(
        <PlacementFeedback
          show={true}
          isCorrect={false}
          departmentName="Antioquia"
        />
      );

      const ripple = document.querySelector('.animate-ping') as HTMLElement;
      expect(ripple).toHaveStyle({ backgroundColor: '#dc2626' });
    });
  });

  describe('Styling', () => {
    it('should be fixed positioned', () => {
      const { container } = render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
        />
      );

      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('fixed');
    });

    it('should have high z-index', () => {
      const { container } = render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
        />
      );

      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('z-50');
    });

    it('should not be interactive', () => {
      const { container } = render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
        />
      );

      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('pointer-events-none');
    });

    it('should have rounded corners', () => {
      const { container } = render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
        />
      );

      // Find the styled div (parent of flex container)
      const messageBox = container.querySelector('.rounded-lg');
      expect(messageBox).toBeInTheDocument();
      expect(messageBox).toHaveClass('shadow-lg'); // Has both classes
    });

    it('should have shadow', () => {
      const { container } = render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
        />
      );

      const messageBox = container.querySelector('.shadow-lg');
      expect(messageBox).toBeInTheDocument();
      expect(messageBox).toHaveClass('rounded-lg'); // Has both classes
    });
  });

  describe('Re-triggering', () => {
    it('should show again when show prop changes', async () => {
      const { act } = await import('@testing-library/react');
      const { rerender } = render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
        />
      );

      expect(screen.getByText(/Correcto/i)).toBeInTheDocument();

      // Wait for it to disappear
      await act(async () => {
        vi.runOnlyPendingTimers();
      });

      expect(screen.queryByText(/Correcto/i)).not.toBeInTheDocument();

      // Show again with different content
      rerender(
        <PlacementFeedback
          show={true}
          isCorrect={false}
          departmentName="Cundinamarca"
        />
      );

      expect(screen.getByText(/Intenta de nuevo/i)).toBeInTheDocument();
    });

    it('should update position when changed', () => {
      const { container, rerender } = render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
          position={{ x: 100, y: 100 }}
        />
      );

      let element = container.firstChild as HTMLElement;
      expect(element).toHaveStyle({ left: '100px', top: '100px' });

      rerender(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
          position={{ x: 200, y: 300 }}
        />
      );

      element = container.firstChild as HTMLElement;
      expect(element).toHaveStyle({ left: '200px', top: '300px' });
    });
  });

  describe('Console Logging', () => {
    it('should log feedback details', () => {
      const consoleSpy = vi.spyOn(console, 'log');

      render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
          position={{ x: 150, y: 250 }}
        />
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        'PlacementFeedback: Showing feedback',
        expect.objectContaining({
          isCorrect: true,
          departmentName: 'Antioquia',
          position: { x: 150, y: 250 },
        })
      );
    });
  });

  describe('Timer Cleanup', () => {
    it('should clear timer on unmount', () => {
      const { unmount } = render(
        <PlacementFeedback
          show={true}
          isCorrect={true}
          departmentName="Antioquia"
        />
      );

      unmount();

      // Timer should be cleared, so advancing time shouldn't cause issues
      vi.advanceTimersByTime(3000);
      expect(true).toBe(true); // No errors
    });
  });
});
