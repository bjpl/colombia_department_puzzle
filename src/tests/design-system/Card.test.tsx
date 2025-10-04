import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../design-system/components/Card';

describe('Card', () => {
  describe('Basic Rendering', () => {
    it('should render card with children', () => {
      render(<Card>Card content</Card>);

      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('should render empty card', () => {
      const { container } = render(<Card />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render default variant', () => {
      const { container } = render(<Card variant="default">Default</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('shadow-sm');
    });

    it('should render elevated variant', () => {
      const { container } = render(<Card variant="elevated">Elevated</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('shadow-lg');
    });

    it('should render outlined variant', () => {
      const { container } = render(<Card variant="outlined">Outlined</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('border-2');
    });

    it('should default to default variant', () => {
      const { container } = render(<Card>No variant</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('shadow-sm');
    });
  });

  describe('Padding', () => {
    it('should render with no padding', () => {
      const { container } = render(<Card padding="none">No padding</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).not.toHaveClass('p-4');
      expect(card).not.toHaveClass('p-6');
      expect(card).not.toHaveClass('p-8');
    });

    it('should render with small padding', () => {
      const { container } = render(<Card padding="sm">Small padding</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-4');
    });

    it('should render with medium padding', () => {
      const { container } = render(<Card padding="md">Medium padding</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-6');
    });

    it('should render with large padding', () => {
      const { container } = render(<Card padding="lg">Large padding</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-8');
    });

    it('should default to medium padding', () => {
      const { container } = render(<Card>Default padding</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-6');
    });
  });

  describe('Hover Effect', () => {
    it('should add hover effect when hover prop is true', () => {
      const { container } = render(<Card hover>Hoverable</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('hover:shadow-md');
      expect(card).toHaveClass('hover:border-gray-300');
    });

    it('should not add hover effect by default', () => {
      const { container } = render(<Card>No hover</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).not.toHaveClass('hover:shadow-md');
    });
  });

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      const { container } = render(<Card className="custom-class">Custom</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('custom-class');
    });

    it('should forward HTML div attributes', () => {
      const { container } = render(
        <Card data-testid="test-card" role="region">
          Test
        </Card>
      );

      const card = screen.getByTestId('test-card');
      expect(card).toHaveAttribute('role', 'region');
    });

    it('should forward ref', () => {
      const ref = { current: null };
      render(<Card ref={ref}>With Ref</Card>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Styling', () => {
    it('should have rounded corners', () => {
      const { container } = render(<Card>Rounded</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('rounded-xl');
    });

    it('should have transition', () => {
      const { container } = render(<Card>Transition</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('transition-all');
      expect(card).toHaveClass('duration-200');
    });
  });
});

describe('CardHeader', () => {
  it('should render card header', () => {
    render(<CardHeader>Header content</CardHeader>);

    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('should have flex column layout', () => {
    const { container } = render(<CardHeader>Header</CardHeader>);

    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass('flex');
    expect(header).toHaveClass('flex-col');
  });

  it('should accept custom className', () => {
    const { container } = render(<CardHeader className="custom">Header</CardHeader>);

    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass('custom');
  });
});

describe('CardTitle', () => {
  it('should render card title', () => {
    render(<CardTitle>Title text</CardTitle>);

    const title = screen.getByRole('heading', { name: /title text/i });
    expect(title).toBeInTheDocument();
  });

  it('should render as h3 element', () => {
    render(<CardTitle>Title</CardTitle>);

    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toBeInTheDocument();
  });

  it('should have proper styling', () => {
    const { container } = render(<CardTitle>Styled Title</CardTitle>);

    const title = screen.getByRole('heading');
    expect(title).toHaveClass('text-lg');
    expect(title).toHaveClass('font-semibold');
    expect(title).toHaveClass('text-gray-900');
  });

  it('should accept custom className', () => {
    render(<CardTitle className="custom-title">Title</CardTitle>);

    const title = screen.getByRole('heading');
    expect(title).toHaveClass('custom-title');
  });
});

describe('CardDescription', () => {
  it('should render card description', () => {
    render(<CardDescription>Description text</CardDescription>);

    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('should render as paragraph element', () => {
    const { container } = render(<CardDescription>Description</CardDescription>);

    const description = container.querySelector('p');
    expect(description).toBeInTheDocument();
  });

  it('should have proper styling', () => {
    const { container } = render(<CardDescription>Styled</CardDescription>);

    const description = container.querySelector('p');
    expect(description).toHaveClass('text-sm');
    expect(description).toHaveClass('text-gray-600');
  });

  it('should accept custom className', () => {
    const { container } = render(
      <CardDescription className="custom-desc">Description</CardDescription>
    );

    const description = container.querySelector('p');
    expect(description).toHaveClass('custom-desc');
  });
});

describe('CardContent', () => {
  it('should render card content', () => {
    render(<CardContent>Content area</CardContent>);

    expect(screen.getByText('Content area')).toBeInTheDocument();
  });

  it('should have top padding reset', () => {
    const { container } = render(<CardContent>Content</CardContent>);

    const content = container.firstChild as HTMLElement;
    expect(content).toHaveClass('pt-0');
  });

  it('should accept custom className', () => {
    const { container } = render(<CardContent className="custom-content">Content</CardContent>);

    const content = container.firstChild as HTMLElement;
    expect(content).toHaveClass('custom-content');
  });
});

describe('CardFooter', () => {
  it('should render card footer', () => {
    render(<CardFooter>Footer content</CardFooter>);

    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('should have flex layout', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);

    const footer = container.firstChild as HTMLElement;
    expect(footer).toHaveClass('flex');
    expect(footer).toHaveClass('items-center');
  });

  it('should have top padding', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);

    const footer = container.firstChild as HTMLElement;
    expect(footer).toHaveClass('pt-6');
  });

  it('should accept custom className', () => {
    const { container } = render(<CardFooter className="custom-footer">Footer</CardFooter>);

    const footer = container.firstChild as HTMLElement;
    expect(footer).toHaveClass('custom-footer');
  });
});

describe('Card Composition', () => {
  it('should render complete card with all subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description goes here</CardDescription>
        </CardHeader>
        <CardContent>Main content area</CardContent>
        <CardFooter>Footer actions</CardFooter>
      </Card>
    );

    expect(screen.getByRole('heading', { name: /card title/i })).toBeInTheDocument();
    expect(screen.getByText('Card description goes here')).toBeInTheDocument();
    expect(screen.getByText('Main content area')).toBeInTheDocument();
    expect(screen.getByText('Footer actions')).toBeInTheDocument();
  });

  it('should support nested content', () => {
    render(
      <Card>
        <CardContent>
          <div>
            <p>Nested paragraph</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );

    expect(screen.getByText('Nested paragraph')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });
});

describe('Card Variants Combinations', () => {
  it('should combine elevated variant with hover', () => {
    const { container } = render(
      <Card variant="elevated" hover>
        Elevated with hover
      </Card>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('shadow-lg');
    expect(card).toHaveClass('hover:shadow-md');
  });

  it('should combine outlined variant with large padding', () => {
    const { container } = render(
      <Card variant="outlined" padding="lg">
        Outlined large padding
      </Card>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('border-2');
    expect(card).toHaveClass('p-8');
  });

  it('should support no padding with custom className', () => {
    const { container } = render(
      <Card padding="none" className="custom-spacing">
        Custom
      </Card>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-spacing');
    expect(card).not.toHaveClass('p-6');
  });
});
