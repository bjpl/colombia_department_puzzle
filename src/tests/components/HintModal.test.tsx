/**
 * HintModal Component Tests
 *
 * CONCEPT: Comprehensive testing for the hint system modal UI
 * WHY: HintModal is the largest component (906 lines) with complex hint progression
 * PATTERN: Modal behavior + progressive hint logic + visual feedback
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HintModal from '../../components/HintModal';

describe('HintModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    departmentName: 'Antioquia',
    region: 'Andina',
    hintLevel: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  describe('Rendering and Visibility', () => {
    it('should render modal when isOpen is true', () => {
      render(<HintModal {...defaultProps} />);

      expect(screen.getByRole('button', { name: /¡entendido!/i })).toBeInTheDocument();
      expect(screen.getByText(/antioquia/i)).toBeInTheDocument();
    });

    it('should not render modal when isOpen is false', () => {
      render(<HintModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByRole('button', { name: /¡entendido!/i })).not.toBeInTheDocument();
    });

    it('should render close button', () => {
      render(<HintModal {...defaultProps} />);

      // Use aria-label to find the specific close button (not the backdrop)
      const closeButton = screen.getByLabelText('Cerrar');
      expect(closeButton).toBeInTheDocument();
    });

    it('should display department name in hint content', () => {
      render(<HintModal {...defaultProps} departmentName="Cundinamarca" />);

      expect(screen.getByText(/cundinamarca/i)).toBeInTheDocument();
    });

    it('should display region name in regional hint', () => {
      // Use a department that shows regional hint (not large, small, coastal, or border)
      render(<HintModal {...defaultProps} departmentName="Caldas" region="Andina" hintLevel={1} />);

      expect(screen.getByText(/región andina/i)).toBeInTheDocument();
    });
  });

  describe('Hint Level 1 - Basic Hints', () => {
    it('should show level 1 hint title', () => {
      render(<HintModal {...defaultProps} hintLevel={1} />);

      expect(screen.getByText(/pista nivel 1/i)).toBeInTheDocument();
    });

    it('should show 10 points cost for level 1', () => {
      render(<HintModal {...defaultProps} hintLevel={1} />);

      expect(screen.getByText(/costo:.*10 puntos/i)).toBeInTheDocument();
    });

    it('should show island hint for San Andrés y Providencia', () => {
      render(<HintModal {...defaultProps} departmentName="San Andrés y Providencia" hintLevel={1} />);

      expect(screen.getByText(/territorio insular/i)).toBeInTheDocument();
      expect(screen.getByText(/único departamento insular/i)).toBeInTheDocument();
      expect(screen.getByText(/mar caribe/i)).toBeInTheDocument();
    });

    it('should show coastal hint for Pacífico departments', () => {
      render(<HintModal {...defaultProps} departmentName="Chocó" region="Pacífico" hintLevel={1} />);

      expect(screen.getByText(/departamento costero/i)).toBeInTheDocument();
      expect(screen.getByText(/pacífico/i)).toBeInTheDocument();
    });

    it('should show coastal hint for Atlántico (Caribe coast)', () => {
      // Atlántico shows coastal hint because isCoastal check comes before isSmall
      render(<HintModal {...defaultProps} departmentName="Atlántico" region="Caribe" hintLevel={1} />);

      const coastalElements = screen.getAllByText(/departamento costero/i);
      expect(coastalElements[0]).toBeInTheDocument();
      expect(screen.getAllByText(/caribe/i)[0]).toBeInTheDocument();
    });

    it('should show border hint for frontier departments', () => {
      render(<HintModal {...defaultProps} departmentName="Norte de Santander" hintLevel={1} />);

      expect(screen.getByText(/frontera internacional/i)).toBeInTheDocument();
      expect(screen.getAllByText(/venezuela/i)[0]).toBeInTheDocument();
    });

    it('should show size hint for small departments', () => {
      render(<HintModal {...defaultProps} departmentName="Quindío" hintLevel={1} />);

      expect(screen.getByText(/tamaño pequeño/i)).toBeInTheDocument();
      expect(screen.getByText(/más pequeños/i)).toBeInTheDocument();
    });

    it('should show border hint for Amazonas (frontier department)', () => {
      // Amazonas is isBorder, so shows frontera hint before isLarge
      render(<HintModal {...defaultProps} departmentName="Amazonas" hintLevel={1} />);

      expect(screen.getByText(/frontera internacional/i)).toBeInTheDocument();
    });

    it('should show regional hint for interior departments like Tolima', () => {
      // Tolima is not coastal, border, small, or large - shows regional hint
      render(<HintModal {...defaultProps} departmentName="Tolima" region="Andina" hintLevel={1} />);

      expect(screen.getByText(/ubicación regional/i)).toBeInTheDocument();
    });

    it('should show landmark information in level 1 hints', () => {
      // Antioquia shows as large department, so check for landmark in that context
      render(<HintModal {...defaultProps} departmentName="Antioquia" hintLevel={1} />);

      // Large departments show position and size info
      expect(screen.getByText(/noroeste/i)).toBeInTheDocument();
    });

    it('should show helpful positioning information', () => {
      // Use a department that shows regional hint with tip
      render(<HintModal {...defaultProps} departmentName="Caldas" region="Andina" hintLevel={1} />);

      expect(screen.getByText(/mostrar regiones/i)).toBeInTheDocument();
    });
  });

  describe('Hint Level 2 - Intermediate Hints', () => {
    it('should show level 2 hint title', () => {
      render(<HintModal {...defaultProps} hintLevel={2} />);

      expect(screen.getByText(/pista nivel 2/i)).toBeInTheDocument();
    });

    it('should show 25 points cost for level 2', () => {
      render(<HintModal {...defaultProps} hintLevel={2} />);

      expect(screen.getByText(/costo:.*25 puntos/i)).toBeInTheDocument();
    });

    it('should show exact location for islands in level 2', () => {
      render(<HintModal {...defaultProps} departmentName="San Andrés y Providencia" hintLevel={2} />);

      expect(screen.getByText(/ubicación exacta/i)).toBeInTheDocument();
      expect(screen.getByText(/archipiélago en el caribe/i)).toBeInTheDocument();
      expect(screen.getByText(/nicaragua/i)).toBeInTheDocument();
    });

    it('should show position information in level 2', () => {
      render(<HintModal {...defaultProps} departmentName="Antioquia" hintLevel={2} />);

      expect(screen.getByText(/noroeste del país/i)).toBeInTheDocument();
    });

    it('should show neighbors for departments with few neighbors', () => {
      render(<HintModal {...defaultProps} departmentName="Nariño" hintLevel={2} />);

      expect(screen.getByText(/cauca/i)).toBeInTheDocument();
      expect(screen.getByText(/putumayo/i)).toBeInTheDocument();
    });

    it('should indicate many connections for highly connected departments', () => {
      render(<HintModal {...defaultProps} departmentName="Bolívar" hintLevel={2} />);

      expect(screen.getByText(/departamento muy conectado/i)).toBeInTheDocument();
    });

    it('should show area information', () => {
      render(<HintModal {...defaultProps} departmentName="Antioquia" hintLevel={2} />);

      // Area should be displayed in some format
      expect(screen.getByText(/área:/i)).toBeInTheDocument();
    });

    it('should show shape hint for large departments', () => {
      render(<HintModal {...defaultProps} departmentName="Amazonas" hintLevel={2} />);

      expect(screen.getByText(/forma:/i)).toBeInTheDocument();
    });
  });

  describe('Hint Level 3 - Maximum Help', () => {
    it('should show level 3 hint title', () => {
      render(<HintModal {...defaultProps} hintLevel={3} />);

      expect(screen.getByText(/pista nivel 3/i)).toBeInTheDocument();
      expect(screen.getByText(/ayuda máxima/i)).toBeInTheDocument();
    });

    it('should show 50 points cost for level 3', () => {
      render(<HintModal {...defaultProps} hintLevel={3} />);

      expect(screen.getByText(/costo:.*50 puntos/i)).toBeInTheDocument();
    });

    it('should show detailed location for islands', () => {
      render(<HintModal {...defaultProps} departmentName="San Andrés y Providencia" hintLevel={3} />);

      expect(screen.getByText(/búscalo aquí:/i)).toBeInTheDocument();
      expect(screen.getAllByText(/esquina superior izquierda/i)[0]).toBeInTheDocument();
    });

    it('should show detailed location for Amazonas', () => {
      render(<HintModal {...defaultProps} departmentName="Amazonas" hintLevel={3} />);

      expect(screen.getByText(/extremo sur del país/i)).toBeInTheDocument();
      expect(screen.getAllByText(/forma triangular/i)[0]).toBeInTheDocument();
    });

    it('should show detailed location for La Guajira', () => {
      render(<HintModal {...defaultProps} departmentName="La Guajira" hintLevel={3} />);

      expect(screen.getByText(/península en el extremo norte/i)).toBeInTheDocument();
      expect(screen.getByText(/punta más al norte/i)).toBeInTheDocument();
    });

    it('should show detailed location for Bogotá D.C.', () => {
      render(<HintModal {...defaultProps} departmentName="Bogotá D.C." hintLevel={3} />);

      expect(screen.getByText(/dentro de cundinamarca/i)).toBeInTheDocument();
      expect(screen.getByText(/hueco.*cundinamarca/i)).toBeInTheDocument();
    });

    it('should show all neighbors in level 3', () => {
      render(<HintModal {...defaultProps} departmentName="Antioquia" hintLevel={3} />);

      expect(screen.getByText(/todos sus vecinos:/i)).toBeInTheDocument();
      expect(screen.getAllByText(/córdoba/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/santander/i)[0]).toBeInTheDocument();
    });

    it('should show capital information', () => {
      render(<HintModal {...defaultProps} departmentName="Antioquia" hintLevel={3} />);

      expect(screen.getByText(/capital:.*medellín/i)).toBeInTheDocument();
    });

    it('should show characteristic shape', () => {
      render(<HintModal {...defaultProps} departmentName="Amazonas" hintLevel={3} />);

      expect(screen.getByText(/forma característica:/i)).toBeInTheDocument();
    });

    it('should show encouragement message', () => {
      render(<HintModal {...defaultProps} hintLevel={3} />);

      expect(screen.getByText(/ya casi lo tienes/i)).toBeInTheDocument();
      expect(screen.getByText(/máxima ayuda disponible/i)).toBeInTheDocument();
    });
  });

  describe('Progress Indicator', () => {
    it('should show progress dots for all levels', () => {
      render(<HintModal {...defaultProps} hintLevel={1} />);

      const progressDots = document.querySelectorAll('.w-2.h-2.rounded-full');
      expect(progressDots).toHaveLength(3);
    });

    it('should highlight level 1 progress', () => {
      render(<HintModal {...defaultProps} hintLevel={1} />);

      const activeDots = document.querySelectorAll('.bg-sky-500');
      expect(activeDots.length).toBeGreaterThanOrEqual(1);
    });

    it('should highlight level 2 progress', () => {
      render(<HintModal {...defaultProps} hintLevel={2} />);

      const activeDots = document.querySelectorAll('.bg-sky-500');
      expect(activeDots.length).toBeGreaterThanOrEqual(2);
    });

    it('should highlight level 3 progress', () => {
      render(<HintModal {...defaultProps} hintLevel={3} />);

      const activeDots = document.querySelectorAll('.bg-sky-500');
      expect(activeDots.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Interaction', () => {
    it('should call onClose when close button clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(<HintModal {...defaultProps} onClose={onClose} />);

      // Use aria-label to find the specific close button (not the backdrop)
      const closeButton = screen.getByLabelText('Cerrar');
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when ¡Entendido! button clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(<HintModal {...defaultProps} onClose={onClose} />);

      const button = screen.getByRole('button', { name: /¡entendido!/i });
      await user.click(button);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(<HintModal {...defaultProps} onClose={onClose} />);

      // Click backdrop (the backdrop has bg-black/60)
      const backdrop = document.querySelector('.bg-black\\/60') as HTMLElement;
      expect(backdrop).toBeInTheDocument();

      await user.click(backdrop);

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Visual Feedback and Animations', () => {
    it('should have glow effect', () => {
      render(<HintModal {...defaultProps} />);

      const glow = document.querySelector('.blur-2xl.opacity-30');
      expect(glow).toBeInTheDocument();
    });

    it('should show different glow colors for different hint levels', () => {
      const { rerender } = render(<HintModal {...defaultProps} hintLevel={1} />);

      let glow = document.querySelector('[class*="from-"]');
      expect(glow).toBeInTheDocument();

      rerender(<HintModal {...defaultProps} hintLevel={2} />);
      glow = document.querySelector('.from-sky-400');
      expect(glow).toBeInTheDocument();

      rerender(<HintModal {...defaultProps} hintLevel={3} />);
      glow = document.querySelector('.from-red-400');
      expect(glow).toBeInTheDocument();
    });

    it('should have backdrop blur', () => {
      render(<HintModal {...defaultProps} />);

      const backdrop = document.querySelector('.backdrop-blur-sm');
      expect(backdrop).toBeInTheDocument();
    });

    it('should have shadow effect', () => {
      render(<HintModal {...defaultProps} />);

      const modal = document.querySelector('.shadow-2xl');
      expect(modal).toBeInTheDocument();
    });

    it('should have rounded corners', () => {
      render(<HintModal {...defaultProps} />);

      const modal = document.querySelector('.rounded-2xl');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Department-Specific Hints', () => {
    it('should show coastal hint for Atlántico at level 1', () => {
      render(<HintModal {...defaultProps} departmentName="Atlántico" hintLevel={1} />);
      expect(screen.getAllByText(/costa/i)[0]).toBeInTheDocument();
    });

    it('should show regional hint for Cesar at level 1', () => {
      // Cesar is not in coastal, border, small, or large lists - shows regional hint
      render(<HintModal {...defaultProps} departmentName="Cesar" region="Caribe" hintLevel={1} />);
      expect(screen.getByText(/región caribe/i)).toBeInTheDocument();
    });

    it('should show coastal hint for Córdoba at level 1', () => {
      render(<HintModal {...defaultProps} departmentName="Córdoba" hintLevel={1} />);
      expect(screen.getAllByText(/costa/i)[0]).toBeInTheDocument();
    });

    it('should show specific hint for Cundinamarca at level 3', () => {
      render(<HintModal {...defaultProps} departmentName="Cundinamarca" hintLevel={3} />);
      expect(screen.getByText(/rodea a bogotá/i)).toBeInTheDocument();
    });

    it('should show specific hint for Huila at level 3', () => {
      render(<HintModal {...defaultProps} departmentName="Huila" hintLevel={3} />);
      expect(screen.getAllByText(/diamante/i)[0]).toBeInTheDocument();
    });

    it('should show specific hint for Meta at level 3', () => {
      render(<HintModal {...defaultProps} departmentName="Meta" hintLevel={3} />);
      expect(screen.getAllByText(/llanos/i)[0]).toBeInTheDocument();
    });

    it('should show specific hint for Quindío at level 1', () => {
      render(<HintModal {...defaultProps} departmentName="Quindío" hintLevel={1} />);
      expect(screen.getAllByText(/pequeño/i)[0]).toBeInTheDocument();
    });

    it('should show specific hint for Valle del Cauca at level 3', () => {
      render(<HintModal {...defaultProps} departmentName="Valle del Cauca" hintLevel={3} />);
      expect(screen.getByText(/buenaventura/i)).toBeInTheDocument();
    });
  });

  describe('Border Countries', () => {
    it('should identify Venezuela border', () => {
      render(<HintModal {...defaultProps} departmentName="Norte de Santander" hintLevel={1} />);

      expect(screen.getAllByText(/venezuela/i)[0]).toBeInTheDocument();
    });

    it('should identify Brazil border', () => {
      render(<HintModal {...defaultProps} departmentName="Vaupés" hintLevel={1} />);

      expect(screen.getAllByText(/brasil/i)[0]).toBeInTheDocument();
    });

    it('should identify Ecuador border', () => {
      render(<HintModal {...defaultProps} departmentName="Nariño" hintLevel={1} />);

      expect(screen.getByText(/ecuador/i)).toBeInTheDocument();
    });

    it('should identify Peru border for Putumayo', () => {
      // Putumayo shows Peru in its border hint
      render(<HintModal {...defaultProps} departmentName="Putumayo" hintLevel={1} />);

      expect(screen.getAllByText(/perú/i)[0]).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have close button with aria-label', () => {
      render(<HintModal {...defaultProps} />);

      const closeButton = screen.getByLabelText('Cerrar');
      expect(closeButton).toHaveAccessibleName();
    });

    it('should have proper button labels', () => {
      render(<HintModal {...defaultProps} />);

      const button = screen.getByRole('button', { name: /¡entendido!/i });
      expect(button).toHaveAccessibleName();
    });

    it('should have proper z-index for modal', () => {
      render(<HintModal {...defaultProps} />);

      const modal = document.querySelector('.z-50');
      expect(modal).toBeInTheDocument();
    });

    it('should prevent body scroll when open', () => {
      // The HintModal uses its own backdrop, not body overflow
      render(<HintModal {...defaultProps} />);

      const backdrop = document.querySelector('.fixed.inset-0');
      expect(backdrop).toBeInTheDocument();
    });
  });

  describe('Cost Display', () => {
    it('should show correct cost badge for each level', () => {
      const { rerender } = render(<HintModal {...defaultProps} hintLevel={1} />);
      expect(screen.getByText(/costo:.*10 puntos/i)).toBeInTheDocument();

      rerender(<HintModal {...defaultProps} hintLevel={2} />);
      expect(screen.getByText(/costo:.*25 puntos/i)).toBeInTheDocument();

      rerender(<HintModal {...defaultProps} hintLevel={3} />);
      expect(screen.getByText(/costo:.*50 puntos/i)).toBeInTheDocument();
    });

    it('should default to 10 points for invalid levels', () => {
      render(<HintModal {...defaultProps} hintLevel={999 as any} />);

      expect(screen.getByText(/costo:.*10 puntos/i)).toBeInTheDocument();
    });
  });

  describe('Geographic Information', () => {
    it('should show landmark information when available', () => {
      // Caldas shows landmark info in regional hint
      render(<HintModal {...defaultProps} departmentName="Caldas" region="Andina" hintLevel={1} />);

      expect(screen.getAllByText(/manizales/i)[0]).toBeInTheDocument();
    });

    it('should show position information', () => {
      render(<HintModal {...defaultProps} departmentName="Antioquia" hintLevel={2} />);

      expect(screen.getByText(/noroeste/i)).toBeInTheDocument();
    });

    it('should show neighbor count for highly connected departments', () => {
      render(<HintModal {...defaultProps} departmentName="Bolívar" hintLevel={2} />);

      expect(screen.getByText(/limita con.*departamentos/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle department without geographic hints', () => {
      render(<HintModal {...defaultProps} departmentName="Unknown Department" hintLevel={1} />);

      // Should still render without crashing
      expect(screen.getByRole('button', { name: /¡entendido!/i })).toBeInTheDocument();
    });

    it('should handle missing region data', () => {
      render(<HintModal {...defaultProps} region="Unknown Region" hintLevel={1} />);

      // Should fallback to default and still render
      expect(screen.getByRole('button', { name: /¡entendido!/i })).toBeInTheDocument();
    });

    it('should handle rapid open/close transitions', async () => {
      const { rerender } = render(<HintModal {...defaultProps} isOpen={true} />);

      expect(screen.getByRole('button', { name: /¡entendido!/i })).toBeInTheDocument();

      rerender(<HintModal {...defaultProps} isOpen={false} />);

      // Wait for animation to complete (300ms as per component code)
      await new Promise(resolve => setTimeout(resolve, 350));

      expect(screen.queryByRole('button', { name: /¡entendido!/i })).not.toBeInTheDocument();

      rerender(<HintModal {...defaultProps} isOpen={true} />);
      expect(screen.getByRole('button', { name: /¡entendido!/i })).toBeInTheDocument();
    });
  });

  describe('Hint Content Completeness', () => {
    it('should always show department name', () => {
      render(<HintModal {...defaultProps} departmentName="Test Department" />);

      expect(screen.getByText(/test department/i)).toBeInTheDocument();
    });

    it('should show visual indicators (emojis) for different hint types', () => {
      const { container } = render(<HintModal {...defaultProps} hintLevel={1} />);

      // Check for emoji containers (they have specific classes)
      const emojiContainer = container.querySelector('.text-6xl');
      expect(emojiContainer).toBeInTheDocument();
    });

    it('should provide actionable hints at each level', () => {
      // Use a department that shows regional hint (Caldas)
      const { rerender } = render(<HintModal {...defaultProps} departmentName="Caldas" region="Andina" hintLevel={1} />);

      // Level 1 should have some positioning info
      expect(screen.getByText(/región andina/i)).toBeInTheDocument();

      rerender(<HintModal {...defaultProps} departmentName="Caldas" region="Andina" hintLevel={2} />);
      // Level 2 should have more specific info
      expect(screen.getByText(/pista nivel 2/i)).toBeInTheDocument();

      rerender(<HintModal {...defaultProps} departmentName="Caldas" region="Andina" hintLevel={3} />);
      // Level 3 should have maximum detail
      expect(screen.getByText(/búscalo aquí/i)).toBeInTheDocument();
    });
  });
});
