import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../../design-system/components/Modal';

describe('Modal', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    // Create a portal root element
    const portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'portal-root');
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
  });

  describe('Rendering', () => {
    it('should render modal when open is true', () => {
      render(<Modal {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should not render modal when open is false', () => {
      render(<Modal {...defaultProps} open={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render modal with title', () => {
      render(<Modal {...defaultProps} title="Test Title" />);

      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render modal with description', () => {
      render(<Modal {...defaultProps} description="Test description" />);

      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('should render modal with title and description', () => {
      render(
        <Modal {...defaultProps} title="Title" description="Description" />
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should render small modal', () => {
      render(<Modal {...defaultProps} size="sm" />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('max-w-md');
    });

    it('should render medium modal', () => {
      render(<Modal {...defaultProps} size="md" />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('max-w-lg');
    });

    it('should render large modal', () => {
      render(<Modal {...defaultProps} size="lg" />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('max-w-2xl');
    });

    it('should render extra large modal', () => {
      render(<Modal {...defaultProps} size="xl" />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('max-w-4xl');
    });

    it('should default to medium size', () => {
      render(<Modal {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('max-w-lg');
    });
  });

  describe('Close Button', () => {
    it('should show close button by default', () => {
      render(<Modal {...defaultProps} />);

      const closeButton = screen.getByRole('button', { name: /cerrar modal/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('should hide close button when showCloseButton is false', () => {
      render(<Modal {...defaultProps} showCloseButton={false} />);

      const closeButton = screen.queryByRole('button', { name: /cerrar modal/i });
      expect(closeButton).not.toBeInTheDocument();
    });

    it('should call onOpenChange when close button clicked', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(<Modal {...defaultProps} onOpenChange={onOpenChange} />);

      const closeButton = screen.getByRole('button', { name: /cerrar modal/i });
      await user.click(closeButton);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Backdrop', () => {
    it('should render backdrop', () => {
      render(<Modal {...defaultProps} />);

      const backdrop = document.body.querySelector('[aria-hidden="true"]');
      expect(backdrop).toBeInTheDocument();
      expect(backdrop).toHaveClass('bg-black/50');
    });

    it('should close modal when backdrop clicked', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Modal {...defaultProps} onOpenChange={onOpenChange} />
      );

      const backdrop = document.body.querySelector('[aria-hidden="true"]') as HTMLElement;
      await user.click(backdrop);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Keyboard Interactions', () => {
    it('should close modal on Escape key', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(<Modal {...defaultProps} onOpenChange={onOpenChange} />);

      await user.keyboard('{Escape}');

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should not close on Escape when modal is closed', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(<Modal {...defaultProps} open={false} onOpenChange={onOpenChange} />);

      await user.keyboard('{Escape}');

      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  describe('Body Scroll Lock', () => {
    it('should prevent body scroll when modal is open', () => {
      render(<Modal {...defaultProps} />);

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body scroll when modal closes', () => {
      const { rerender } = render(<Modal {...defaultProps} />);

      expect(document.body.style.overflow).toBe('hidden');

      rerender(<Modal {...defaultProps} open={false} />);

      expect(document.body.style.overflow).toBe('');
    });

    it('should restore body scroll on unmount', () => {
      const { unmount } = render(<Modal {...defaultProps} />);

      expect(document.body.style.overflow).toBe('hidden');

      unmount();

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Accessibility', () => {
    it('should have dialog role', () => {
      render(<Modal {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('should have aria-modal attribute', () => {
      render(<Modal {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('should link title with aria-labelledby', () => {
      render(<Modal {...defaultProps} title="Test Title" />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');

      const title = document.getElementById('modal-title');
      expect(title).toHaveTextContent('Test Title');
    });

    it('should link description with aria-describedby', () => {
      render(<Modal {...defaultProps} description="Test description" />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-describedby', 'modal-description');

      const description = document.getElementById('modal-description');
      expect(description).toHaveTextContent('Test description');
    });

    it('should not have aria-labelledby when no title', () => {
      render(<Modal {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).not.toHaveAttribute('aria-labelledby');
    });

    it('should have accessible close button', () => {
      render(<Modal {...defaultProps} />);

      const closeButton = screen.getByRole('button', { name: /cerrar modal/i });
      expect(closeButton).toHaveAccessibleName();
    });
  });

  describe('Portal', () => {
    it('should render modal in document.body', () => {
      render(<Modal {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog.parentElement?.parentElement).toBe(document.body);
    });
  });

  describe('Styling', () => {
    it('should have proper z-index', () => {
      render(<Modal {...defaultProps} />);

      const wrapper = document.body.querySelector('.fixed.inset-0.z-50');
      expect(wrapper).toBeInTheDocument();
    });

    it('should have backdrop blur', () => {
      render(<Modal {...defaultProps} />);

      const backdrop = document.body.querySelector('.backdrop-blur-sm');
      expect(backdrop).toBeInTheDocument();
    });

    it('should have rounded corners', () => {
      render(<Modal {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('rounded-2xl');
    });

    it('should have shadow', () => {
      render(<Modal {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('shadow-2xl');
    });

    it('should have max height constraint', () => {
      render(<Modal {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('max-h-[90vh]');
    });
  });

  describe('Content Layout', () => {
    it('should render content in scrollable area', () => {
      render(<Modal {...defaultProps}>Scrollable content</Modal>);

      // Find the scrollable content wrapper in the DOM
      const scrollableWrapper = document.body.querySelector('.overflow-y-auto');
      expect(scrollableWrapper).toBeInTheDocument();
      expect(scrollableWrapper).toHaveClass('p-6');
    });

    it('should show header only when title or close button exists', () => {
      const { rerender } = render(
        <Modal {...defaultProps} showCloseButton={false} />
      );

      let header = document.body.querySelector('.border-b');
      expect(header).not.toBeInTheDocument();

      rerender(<Modal {...defaultProps} title="Title" showCloseButton={false} />);

      header = document.body.querySelector('.border-b');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle rapid open/close', () => {
      const { rerender } = render(<Modal {...defaultProps} open={true} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      rerender(<Modal {...defaultProps} open={false} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      rerender(<Modal {...defaultProps} open={true} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should handle multiple children', () => {
      render(
        <Modal {...defaultProps}>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </Modal>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });

    it('should forward ref', () => {
      const ref = { current: null };
      render(<Modal {...defaultProps} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Integration', () => {
    it('should work with form submission', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn((e) => e.preventDefault());

      render(
        <Modal {...defaultProps}>
          <form onSubmit={onSubmit}>
            <input type="text" name="name" />
            <button type="submit">Submit</button>
          </form>
        </Modal>
      );

      const input = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /submit/i });

      await user.type(input, 'Test');
      await user.click(submitButton);

      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
