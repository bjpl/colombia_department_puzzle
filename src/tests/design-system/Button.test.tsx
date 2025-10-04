import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../../design-system/components/Button';
import { Star } from 'lucide-react';

describe('Button', () => {
  describe('Rendering', () => {
    it('should render button with children', () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    it('should render button without children', () => {
      render(<Button aria-label="Icon button" />);

      const button = screen.getByRole('button', { name: /icon button/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render primary variant', () => {
      render(<Button variant="primary">Primary</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-sky-500');
    });

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-100');
    });

    it('should render ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent');
    });

    it('should render danger variant', () => {
      render(<Button variant="danger">Danger</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-500');
    });

    it('should default to secondary variant', () => {
      render(<Button>Default</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-100');
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      render(<Button size="sm">Small</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8');
    });

    it('should render medium size', () => {
      render(<Button size="md">Medium</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10');
    });

    it('should render large size', () => {
      render(<Button size="lg">Large</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12');
    });

    it('should default to medium size', () => {
      render(<Button>Default Size</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10');
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when loading', () => {
      render(<Button loading>Loading</Button>);

      const button = screen.getByRole('button');
      const spinner = button.querySelector('svg.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should be disabled when loading', () => {
      render(<Button loading>Loading</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should not show icon when loading', () => {
      render(
        <Button loading icon={<Star data-testid="star-icon" />}>
          Loading
        </Button>
      );

      expect(screen.queryByTestId('star-icon')).not.toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('should render icon on left by default', () => {
      render(
        <Button icon={<Star data-testid="star-icon" />}>
          With Icon
        </Button>
      );

      const button = screen.getByRole('button');
      const icon = screen.getByTestId('star-icon');

      expect(icon).toBeInTheDocument();
      expect(icon.closest('span')).toHaveClass('mr-2');
    });

    it('should render icon on right', () => {
      render(
        <Button icon={<Star data-testid="star-icon" />} iconPosition="right">
          With Icon
        </Button>
      );

      const icon = screen.getByTestId('star-icon');
      expect(icon.closest('span')).toHaveClass('ml-2');
    });

    it('should render icon without margin when no children', () => {
      render(
        <Button icon={<Star data-testid="star-icon" />} aria-label="Star" />
      );

      const icon = screen.getByTestId('star-icon');
      const span = icon.closest('span');
      expect(span).not.toHaveClass('mr-2');
      expect(span).not.toHaveClass('ml-2');
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should have disabled styling', () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:cursor-not-allowed');
      expect(button).toHaveClass('disabled:opacity-60');
    });

    it('should not trigger onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button disabled onClick={handleClick}>Disabled</Button>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Full Width', () => {
    it('should render full width when prop is true', () => {
      render(<Button fullWidth>Full Width</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });

    it('should not render full width by default', () => {
      render(<Button>Normal Width</Button>);

      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('w-full');
    });
  });

  describe('User Interactions', () => {
    it('should trigger onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple clicks', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('should support keyboard interaction', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Press me</Button>);

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      render(<Button className="custom-class">Custom</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should forward HTML button attributes', () => {
      render(<Button type="submit" name="submit-btn" data-testid="custom-btn">Submit</Button>);

      const button = screen.getByTestId('custom-btn');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('name', 'submit-btn');
    });

    it('should forward ref', () => {
      const ref = vi.fn();
      render(<Button ref={ref}>With Ref</Button>);

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      render(<Button>Accessible</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should support aria-label', () => {
      render(<Button aria-label="Custom label">Button</Button>);

      const button = screen.getByRole('button', { name: /custom label/i });
      expect(button).toBeInTheDocument();
    });

    it('should have focus styles', () => {
      render(<Button>Focus me</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:outline-none');
      expect(button).toHaveClass('focus:ring-offset-white');
    });
  });

  describe('Combination States', () => {
    it('should handle primary variant with large size', () => {
      render(<Button variant="primary" size="lg">Large Primary</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-sky-500');
      expect(button).toHaveClass('h-12');
    });

    it('should handle danger variant with loading', () => {
      render(<Button variant="danger" loading>Deleting...</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-500');
      expect(button).toBeDisabled();
      expect(button.querySelector('svg.animate-spin')).toBeInTheDocument();
    });

    it('should handle ghost variant with icon', () => {
      render(
        <Button variant="ghost" icon={<Star data-testid="icon" />}>
          Ghost with icon
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent');
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should handle full width with small size', () => {
      render(<Button fullWidth size="sm">Small Full Width</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
      expect(button).toHaveClass('h-8');
    });
  });
});
