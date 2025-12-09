# Component Template Reference

This directory contains reference implementations and patterns for component creation during the M7 refactoring process.

## Usage

When creating new components, follow the patterns established in `ComponentTemplate.tsx`:

### 1. TypeScript Interface
```typescript
export interface YourComponentProps {
  /** JSDoc comment for each prop */
  children?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}
```

### 2. Component Implementation
```typescript
export const YourComponent = memo(
  forwardRef<HTMLDivElement, YourComponentProps>(
    ({ children, className, ...props }, ref) => {
      return <div ref={ref} className={className} {...props}>{children}</div>;
    }
  )
);

YourComponent.displayName = 'YourComponent';
```

## Best Practices

### Accessibility
- Always provide `aria-label` for interactive elements
- Use semantic HTML elements
- Ensure keyboard navigation works
- Add proper ARIA roles where needed

### Performance
- Use `memo` for components that don't need frequent re-renders
- Use `forwardRef` when parent components need DOM access
- Avoid inline function definitions in props

### Type Safety
- Define explicit TypeScript interfaces
- Use proper generic types for refs
- Leverage TypeScript's type inference

### Testing
- Write unit tests for all public components
- Test accessibility features
- Test edge cases and error states

## Component Categories

### UI Components (`/ui`)
Reusable primitives like buttons, inputs, cards

### Layout Components (`/layout`)
Page structure, grids, containers

### Game Components (`/game`)
Game-specific elements like maps, pieces, boards

### Feedback Components (`/feedback`)
Toasts, progress indicators, notifications

### Modal Components (`/modals`)
Dialogs, sheets, overlays

## Migration Strategy

During M7.2-M7.10:
1. Create new component in appropriate category
2. Follow template pattern
3. Write tests
4. Update imports in consuming code
5. Deprecate old component
6. Remove after full migration
