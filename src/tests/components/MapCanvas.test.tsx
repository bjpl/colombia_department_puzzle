import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import MapCanvas from '../../components/MapCanvas';
import { renderWithProviders } from '../utils/testProviders';

/**
 * MapCanvas Component Tests
 *
 * CONCEPT: Tests for the map canvas wrapper component
 * WHY: Ensures the map rendering container works correctly
 * PATTERN: Simple wrapper component testing with mocked sub-components
 */

// Mock OptimizedColombiaMap since it has complex SVG/D3 logic
vi.mock('../../components/OptimizedColombiaMap', () => ({
  default: () => <div data-testid="mocked-colombia-map">Mocked Map</div>,
}));

describe('MapCanvas', () => {
  it('should render without crashing', () => {
    const { container } = renderWithProviders(<MapCanvas />);
    expect(container).toBeInTheDocument();
  });

  it('should render with gray background', () => {
    const { container } = renderWithProviders(<MapCanvas />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toBeInTheDocument();
    expect(wrapper.style.backgroundColor).toBeTruthy();
  });

  it('should render OptimizedColombiaMap child component', () => {
    const { getByTestId } = renderWithProviders(<MapCanvas />);

    // Verify the mocked map component renders
    expect(getByTestId('mocked-colombia-map')).toBeInTheDocument();
  });
});

