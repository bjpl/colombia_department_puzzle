/**
 * ComponentTemplate - Reference implementation for component patterns
 *
 * Follow this pattern when creating new components:
 * - TypeScript interface for props
 * - forwardRef for DOM access
 * - Proper accessibility attributes
 * - Memoization where beneficial
 */
import { forwardRef, memo, type ReactNode } from 'react';

export interface ComponentTemplateProps {
  /** Primary content */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Accessible label */
  'aria-label'?: string;
  /** Test ID for testing */
  'data-testid'?: string;
}

export const ComponentTemplate = memo(
  forwardRef<HTMLDivElement, ComponentTemplateProps>(
    ({ children, className, 'aria-label': ariaLabel, 'data-testid': testId, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={className}
          aria-label={ariaLabel}
          data-testid={testId}
          {...props}
        >
          {children}
        </div>
      );
    }
  )
);

ComponentTemplate.displayName = 'ComponentTemplate';

export default ComponentTemplate;
