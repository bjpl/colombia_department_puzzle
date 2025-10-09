# Contributing to Colombia Departments Puzzle Game

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Code Style Guidelines](#code-style-guidelines)
5. [Testing Requirements](#testing-requirements)
6. [Pull Request Process](#pull-request-process)
7. [Architecture Overview](#architecture-overview)

---

## 🤝 Code of Conduct

This project follows a professional,


 inclusive development environment:

- Be respectful and constructive in all interactions
- Focus on what is best for the project and community
- Show empathy towards other contributors
- Accept constructive criticism gracefully

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v18+ (LTS recommended)
- **npm:** v9+ (comes with Node.js)
- **Git:** Latest stable version
- **Code editor:** VS Code recommended (with ESLint, Prettier extensions)

### Initial Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/colombia_puzzle_game.git
cd colombia_puzzle_game

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Verify everything works
npm run typecheck
npm run lint
npm test -- --run
npm run build
```

### Project Structure

```
colombia_puzzle_game/
├── src/
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── context/           # React context providers
│   ├── design-system/     # Design tokens and components
│   ├── constants/         # Constants and configuration
│   ├── data/              # Static data (departments, regions)
│   ├── services/          # Business logic (sound, storage)
│   ├── utils/             # Utility functions
│   └── tests/             # Unit and integration tests
├── docs/                  # Documentation
├── daily_reports/         # Development logs
└── public/                # Static assets
```

---

## 💻 Development Workflow

### Branch Strategy

```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# OR for bug fixes
git checkout -b fix/issue-description
```

**Branch Naming:**
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/fixes

### Development Cycle

1. **Make changes** following code style guidelines
2. **Run checks** continuously:
   ```bash
   npm run typecheck  # Check TypeScript errors
   npm run lint       # Check code quality
   npm test           # Run tests in watch mode
   ```
3. **Test locally**:
   ```bash
   npm run dev        # Test in browser
   npm run build      # Ensure production build works
   npm run preview    # Test production build
   ```
4. **Commit changes** with clear messages:
   ```bash
   git add .
   git commit -m "feat: add department filtering by region"
   ```

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions or fixes
- `chore`: Build process or auxiliary tool changes

**Examples:**
```bash
feat(study-mode): add region filtering
fix(mobile): correct touch target sizes
docs(accessibility): update WCAG compliance guide
perf(map): optimize department path rendering
```

---

## 📝 Code Style Guidelines

### TypeScript

```typescript
// ✅ GOOD: Clear types, descriptive names
interface Department {
  id: string;
  name: string;
  region: Region;
  capital: string;
}

function filterDepartmentsByRegion(
  departments: Department[],
  region: Region
): Department[] {
  return departments.filter(dept => dept.region === region);
}

// ❌ BAD: Any types, unclear names
function filter(arr: any[], val: string): any[] {
  return arr.filter(x => x.region === val);
}
```

### React Components

```tsx
// ✅ GOOD: Functional component with TypeScript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn('button', `button-${variant}`)}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}

// ❌ BAD: Props without types, unclear structure
export function Button(props: any) {
  return <button {...props} />;
}
```

### Hooks

```typescript
// ✅ GOOD: Custom hook with clear purpose
function useDebounced<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
const debouncedSearch = useDebounced(searchTerm, 300);
```

### File Naming

- **Components:** PascalCase (e.g., `GameContainer.tsx`)
- **Hooks:** camelCase with "use" prefix (e.g., `useGameTimer.ts`)
- **Utilities:** camelCase (e.g., `nameNormalizer.ts`)
- **Constants:** camelCase or SCREAMING_SNAKE_CASE (e.g., `regionColors.ts`, `GAME_CONSTANTS.ts`)

---

## 🧪 Testing Requirements

### Test Coverage

- **Minimum:** 90% overall coverage
- **Required:** All new features must include tests
- **Critical paths:** 100% coverage

### Writing Tests

```typescript
// Component test example
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button onClick={() => {}}>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(<Button onClick={() => {}} disabled>Click</Button>);
    expect(screen.getByText('Click')).toBeDisabled();
  });
});
```

### Running Tests

```bash
# Watch mode (during development)
npm test

# Single run (before committing)
npm test -- --run

# With coverage
npm test -- --run --coverage

# Specific file
npm test -- GameContainer.test.tsx
```

---

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure all checks pass:**
   ```bash
   npm run validate  # Runs typecheck + lint + tests
   npm run build     # Verify production build
   ```

2. **Update documentation** if needed:
   - README.md for user-facing changes
   - Technical docs in `/docs` for implementation details
   - Code comments for complex logic

3. **Add tests** for new functionality

4. **Rebase on main** if needed:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All tests passing

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console.log statements (except intentional logging)
- [ ] Accessibility considered
- [ ] Mobile responsiveness tested
```

### Review Process

1. **Automated checks** run on PR submission (coming soon)
2. **Code review** by maintainer
3. **Address feedback** if requested
4. **Merge** once approved

---

## 🏗️ Architecture Overview

### Key Patterns

**1. Context + Zustand State Management:**
```typescript
// GameContext.tsx - Zustand store wrapped in React Context
const gameStore = create<GameState>((set) => ({
  departments: colombiaDepartments,
  placedDepartments: new Set(),
  score: 0,
  placeDepartment: (id) => set((state) => ({
    placedDepartments: new Set([...state.placedDepartments, id]),
    score: state.score + 10,
  })),
}));
```

**2. Design System Tokens:**
```typescript
// Centralized design tokens
import { colors, spacing, typography } from './design-system';

// Used consistently across components
<div style={{ color: colors.text.primary, padding: spacing[4] }}>
  Content
</div>
```

**3. Accessibility-First:**
```tsx
// All interactive elements have ARIA labels
<button
  aria-label="Close modal"
  onClick={handleClose}
>
  <X aria-hidden="true" />
</button>
```

### Performance Considerations

- **Lazy loading:** Study Mode and other heavy components
- **React.memo:** Prevent unnecessary re-renders
- **useMemo/useCallback:** Optimize expensive operations
- **Code splitting:** Separate vendor and app bundles

### Mobile Support

- **Touch targets:** Minimum 44×44px (WCAG AAA)
- **Bottom sheet:** Google Maps-style swipeable drawer
- **PWA:** Offline-capable with smart caching
- **Safe areas:** iOS notch/home indicator support

---

## 📚 Additional Resources

### Documentation
- [Mobile Development Guide](./docs/MOBILE_DEVELOPMENT_GUIDE.md)
- [Accessibility Guide](./docs/ACCESSIBILITY_GUIDE.md)
- [Architecture Decision Records](./docs/adr/)

### External Resources
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues
2. Verify issue in latest version
3. Test in multiple browsers

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the issue

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Device: [e.g., iPhone 14 Pro]
```

---

## 💡 Feature Requests

We welcome feature suggestions! Please provide:

1. **Use case:** What problem does this solve?
2. **Proposed solution:** How should it work?
3. **Alternatives:** Other approaches considered
4. **Additional context:** Mockups, examples, etc.

---

## ❓ Questions

For questions:
- Check existing documentation
- Search closed issues
- Open a new discussion (preferred over issues)

---

**Thank you for contributing to make this educational game better!**
