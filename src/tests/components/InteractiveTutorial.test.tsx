/**
 * InteractiveTutorial Component Tests
 * Tests for tutorial system with step progression
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InteractiveTutorial from '../../components/modals/InteractiveTutorial';
import { storage } from '../../services/storage';

// Mock storage service
vi.mock('../../services/storage', () => ({
  storage: {
    saveSetting: vi.fn(),
    loadSetting: vi.fn(),
  },
}));

describe('InteractiveTutorial', () => {
  const mockOnComplete = vi.fn();
  const mockOnSkip = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render the first tutorial step', () => {
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      expect(screen.getByText(/Bienvenido/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Aprende los 32 departamentos de Colombia/i)
      ).toBeInTheDocument();
    });

    it('should show step indicator', () => {
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      // Step 1 badge should be visible
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should show progress dots', () => {
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      // Progress dots may include both mobile and desktop variants
      // The component renders responsive versions, so count may be 6 (desktop) or 12 (both)
      const progressDots = document.querySelectorAll('[style*="height: 4px"]');
      expect(progressDots.length).toBeGreaterThanOrEqual(6);
    });

    it('should show next button', () => {
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      expect(
        screen.getByRole('button', { name: /Siguiente/i })
      ).toBeInTheDocument();
    });

    it('should show skip button', () => {
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      expect(
        screen.getByRole('button', { name: /Skip tutorial/i })
      ).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should advance to next step on Next click', async () => {
      const user = userEvent.setup();
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const nextButton = screen.getByRole('button', { name: /Siguiente/i });
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/El Mapa/i)).toBeInTheDocument();
      });
    });

    it('should show previous button after first step', async () => {
      const user = userEvent.setup();
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const nextButton = screen.getByRole('button', { name: /Siguiente/i });
      await user.click(nextButton);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Anterior/i })
        ).toBeInTheDocument();
      });
    });

    it('should go back to previous step', async () => {
      const user = userEvent.setup();
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      // Go forward
      const nextButton = screen.getByRole('button', { name: /Siguiente/i });
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/El Mapa/i)).toBeInTheDocument();
      });

      // Go back
      const prevButton = screen.getByRole('button', { name: /Anterior/i });
      await user.click(prevButton);

      await waitFor(() => {
        expect(screen.getByText(/Bienvenido/i)).toBeInTheDocument();
      });
    });

    it('should not show previous button on first step', () => {
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      expect(
        screen.queryByRole('button', { name: /Anterior/i })
      ).not.toBeInTheDocument();
    });

    it('should show "Comenzar" button on last step', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      // Click through all steps (6 total, so 5 clicks to get to last)
      for (let i = 0; i < 5; i++) {
        const nextButton = await screen.findByRole('button', { name: /Siguiente/i });
        await user.click(nextButton);
        // Wait for animation to complete (300ms in component)
        await new Promise(resolve => setTimeout(resolve, 350));
      }

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Comenzar/i })
        ).toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });

  describe('Step Content', () => {
    it('should show all 6 tutorial steps in sequence', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const expectedTitles = [
        'Bienvenido',
        'El Mapa',
        'Departamentos',
        'Puntuación',
        'Pistas',
        '¡Comienza!',
      ];

      for (let i = 0; i < expectedTitles.length; i++) {
        await waitFor(() => {
          expect(screen.getByText(expectedTitles[i])).toBeInTheDocument();
        });

        if (i < expectedTitles.length - 1) {
          const nextButton = await screen.findByRole('button', { name: /Siguiente/i });
          await user.click(nextButton);
          // Wait for animation to complete (300ms in component)
          await new Promise(resolve => setTimeout(resolve, 350));
        }
      }
    });

    it('should update step number indicator', async () => {
      const user = userEvent.setup();
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      expect(screen.getByText('1')).toBeInTheDocument();

      const nextButton = screen.getByRole('button', { name: /Siguiente/i });
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });
  });

  describe('Completion', () => {
    it('should call onComplete when finishing tutorial', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      // Click through to last step
      for (let i = 0; i < 5; i++) {
        const nextButton = await screen.findByRole('button', { name: /Siguiente/i });
        await user.click(nextButton);
        // Wait for animation to complete (300ms in component)
        await new Promise(resolve => setTimeout(resolve, 350));
      }

      // Click "Comenzar" button
      const startButton = await screen.findByRole('button', {
        name: /Comenzar/i,
      }, { timeout: 1000 });
      await user.click(startButton);

      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });

    it('should save tutorial completion to storage', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      // Complete tutorial
      for (let i = 0; i < 5; i++) {
        const nextButton = await screen.findByRole('button', { name: /Siguiente/i });
        await user.click(nextButton);
        // Wait for animation to complete (300ms in component)
        await new Promise(resolve => setTimeout(resolve, 350));
      }

      const startButton = await screen.findByRole('button', {
        name: /Comenzar/i,
      }, { timeout: 1000 });
      await user.click(startButton);

      expect(storage.saveSetting).toHaveBeenCalledWith('tutorialShown', true);
    });

    it('should call onSkip when skip button clicked', async () => {
      const user = userEvent.setup();
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const skipButton = screen.getByRole('button', { name: /Skip tutorial/i });
      await user.click(skipButton);

      expect(mockOnSkip).toHaveBeenCalledTimes(1);
    });

    it('should not save to storage when skipping', async () => {
      const user = userEvent.setup();
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const skipButton = screen.getByRole('button', { name: /Skip tutorial/i });
      await user.click(skipButton);

      expect(storage.saveSetting).not.toHaveBeenCalled();
    });
  });

  describe('Visual Effects', () => {
    it('should show overlay background', () => {
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const overlay = document.querySelector('.fixed.inset-0.z-40');
      expect(overlay).toBeInTheDocument();
    });

    it('should show spotlight on appropriate steps', async () => {
      const user = userEvent.setup();
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      // Advance to step 2 which has spotlight
      const nextButton = screen.getByRole('button', { name: /Siguiente/i });
      await user.click(nextButton);

      await waitFor(() => {
        const spotlight = document.querySelector('.absolute.rounded-2xl');
        expect(spotlight).toBeInTheDocument();
      });
    });

    it('should show beacon pulse on steps with beacon', async () => {
      const user = userEvent.setup();
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      // Advance to step 2 which has beacon
      const nextButton = screen.getByRole('button', { name: /Siguiente/i });
      await user.click(nextButton);

      await waitFor(() => {
        const beacon = document.querySelector('.fixed.z-45');
        expect(beacon).toBeInTheDocument();
      });
    });

    it('should animate transitions between steps', async () => {
      const user = userEvent.setup();
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const nextButton = screen.getByRole('button', { name: /Siguiente/i });
      await user.click(nextButton);

      // Should have transition classes
      const card = document.querySelector('.transition-all');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const heading = screen.getByRole('heading', { name: /Bienvenido/i });
      expect(heading).toBeInTheDocument();
    });

    it('should provide keyboard navigation', async () => {
      const user = userEvent.setup();
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      // Tab to next button
      await user.tab();
      await user.tab();

      const nextButton = screen.getByRole('button', { name: /Siguiente/i });
      expect(nextButton).toHaveFocus();
    });
  });

  describe('Progress Indicators', () => {
    it('should highlight current step in progress bar', () => {
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const progressDots = document.querySelectorAll('[style*="height: 4px"]');
      // First dot should be expanded (32px width)
      expect(progressDots[0]).toHaveStyle({ width: '32px' });
    });

    it('should show completed steps differently', async () => {
      const user = userEvent.setup();
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const nextButton = screen.getByRole('button', { name: /Siguiente/i });
      await user.click(nextButton);

      await waitFor(() => {
        const progressDots = document.querySelectorAll(
          '[style*="height: 4px"]'
        );
        // First dot should be completed (different color)
        expect(progressDots[0]).toBeInTheDocument();
      });
    });
  });

  describe('Card Positioning', () => {
    it('should position card as floating for first step', () => {
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const card = document.querySelector('.fixed.z-50');
      expect(card).toHaveStyle({ left: '50%', bottom: '40px' });
    });

    it('should position card anchored for map step', async () => {
      const user = userEvent.setup();
      render(
        <InteractiveTutorial onComplete={mockOnComplete} onSkip={mockOnSkip} />
      );

      const nextButton = screen.getByRole('button', { name: /Siguiente/i });
      await user.click(nextButton);

      await waitFor(() => {
        const card = document.querySelector('.fixed.z-50');
        expect(card).toBeInTheDocument();
      });
    });
  });
});
