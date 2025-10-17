# Developer Setup Guide

## Prerequisites

### Required Software
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended

### Recommended VS Code Extensions
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Auto Rename Tag

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/bjpl/colombia_department_puzzle.git
cd colombia_puzzle_game
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages including:
- React 18 and React DOM
- TypeScript and type definitions
- Vite build tool
- Tailwind CSS
- @dnd-kit for drag and drop
- Zustand for state management
- D3-geo for map projections

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at: `http://localhost:5173`

## Project Structure

```
colombia_puzzle_game/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── context/           # State management
│   ├── data/             # Static data files
│   ├── constants/        # Configuration constants
│   ├── hooks/           # Custom React hooks
│   ├── services/        # Business logic services
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── i18n/           # Internationalization
│   ├── App.tsx         # Application root
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
│   └── data/          # GeoJSON files
├── docs/              # Documentation
├── .claude/           # Claude Flow configuration
└── package.json       # Project configuration
```

## Development Workflow

### 1. Understanding the Codebase

**Key Files to Review First**:
1. `src/App.tsx` - Application entry point
2. `src/components/GameContainer.tsx` - Main game orchestrator
3. `src/context/GameContext.tsx` - Game state management
4. `src/data/colombiaDepartments.ts` - Department data

### 2. Making Changes

#### Adding a New Feature

1. **Plan the Feature**
   - Review existing components
   - Identify reusable patterns
   - Consider state management needs

2. **Create Components**
   ```tsx
   // src/components/YourComponent.tsx
   import React from 'react';

   interface YourComponentProps {
     // Define props
   }

   export default function YourComponent({ }: YourComponentProps) {
     return (
       <div>
         {/* Component JSX */}
       </div>
     );
   }
   ```

3. **Update State if Needed**
   ```typescript
   // In GameContext.tsx
   interface GameState {
     // Add new state properties
     yourNewProperty: type;
   }
   ```

4. **Add Constants**
   ```typescript
   // In gameConstants.ts
   export const YOUR_CONSTANTS = {
     VALUE: 'value'
   } as const;
   ```

#### Modifying Existing Components

1. **Check Component Dependencies**
   - Review imports
   - Understand props and context usage
   - Check for child components

2. **Follow Existing Patterns**
   - Use consistent styling (Tailwind classes)
   - Maintain TypeScript typing
   - Keep accessibility features

3. **Test Your Changes**
   - Manual testing in browser
   - Check different screen sizes
   - Test drag and drop functionality

### 3. Code Style Guidelines

#### TypeScript
```typescript
// Use explicit types
interface Props {
  name: string;
  age: number;
}

// Prefer function components
export default function Component({ name, age }: Props) {
  // Implementation
}

// Use const for functions
const handleClick = () => {
  // Handler logic
};
```

#### React Patterns
```tsx
// Use hooks for state
const [state, setState] = useState<Type>(initialValue);

// Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensive();
}, [dependency]);

// Use proper event types
const handleDrag = (event: DragEvent<HTMLDivElement>) => {
  // Handle drag
};
```

#### Tailwind CSS
```tsx
// Use Tailwind utilities
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  {/* Content */}
</div>

// Conditional classes
<div className={`
  base-classes
  ${isActive ? 'active-classes' : 'inactive-classes'}
`}>
```

## Common Tasks

### Adding a New Department

1. Update `src/data/colombiaDepartments.ts`:
```typescript
{
  id: 'department-id',
  name: 'Department Name',
  capital: 'Capital City',
  region: 'Region Name',
  // Additional properties
}
```

2. Ensure GeoJSON has matching feature in `public/data/colombia.geojson`

### Adding a New Game Mode

1. Update `GameModeConfig` type in `src/components/GameModeSelector.tsx`

2. Add mode logic in `src/context/GameContext.tsx`

3. Update UI in `GameModeSelector` component

### Modifying Scoring System

1. Update constants in `src/constants/gameConstants.ts`:
```typescript
export const SCORING = {
  BASE_POINTS: 100,
  PENALTY_PER_ATTEMPT: 10,
  // Add new scoring rules
};
```

2. Update calculation in `GameContext.tsx` `placeDepartment` method

### Adding Sound Effects

1. Add sound type in `src/services/soundManager.ts`:
```typescript
type SoundType = 'correct' | 'incorrect' | 'your-new-sound';
```

2. Implement sound generation in `createSound` method

3. Use in components:
```typescript
const sound = useSoundEffect();
sound.playSound('your-new-sound');
```

## Testing

### Manual Testing Checklist

- [ ] All departments can be dragged
- [ ] Correct placements are recognized
- [ ] Score updates properly
- [ ] Timer works correctly
- [ ] Hints system functions
- [ ] Study mode displays information
- [ ] Post-game report shows statistics
- [ ] Regional modes filter correctly
- [ ] Sound effects play (if enabled)
- [ ] Responsive on different screen sizes
- [ ] Keyboard navigation works
- [ ] Error boundaries catch failures

### Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance Testing

```bash
# Build production version
npm run build

# Preview production build
npm run preview
```

Check:
- Bundle size (<500KB gzipped)
- Initial load time (<3s on 3G)
- 60 FPS during interactions
- Memory usage (<50MB)

## Debugging

### Common Issues

#### 1. Department Not Recognized
- Check ID normalization in `nameNormalizer.ts`
- Verify GeoJSON feature properties
- Check `departmentNameMap` for variations

#### 2. Drag and Drop Not Working
- Ensure `@dnd-kit/core` context is provided
- Check draggable/droppable IDs match
- Verify touch-action CSS properties

#### 3. State Not Updating
- Check Zustand store subscriptions
- Verify action calls
- Look for missing dependencies in effects

### Debugging Tools

1. **React DevTools**
   - Inspect component tree
   - Check props and state
   - Profile performance

2. **Browser DevTools**
   - Console for errors
   - Network tab for assets
   - Performance profiling

3. **VS Code Debugger**
   ```json
   // .vscode/launch.json
   {
     "type": "chrome",
     "request": "launch",
     "name": "Launch Chrome",
     "url": "http://localhost:5173",
     "webRoot": "${workspaceFolder}"
   }
   ```

## Lighthouse CI & Performance Monitoring

### Performance Budgets

The project uses Lighthouse CI to enforce performance budgets on every build. The budgets are defined in `lighthouse-budget.json` at the project root.

**Current Budgets:**

| Resource Type | Budget (KB) | Notes |
|--------------|-------------|-------|
| JavaScript | 200 | Total JavaScript bundle |
| CSS | 20 | Stylesheets |
| Images | 50 | Image assets |
| Fonts | 50 | Web fonts |
| Total | 350 | All resources combined |

**Performance Metrics:**

| Metric | Budget | Target |
|--------|--------|--------|
| First Contentful Paint (FCP) | 2000ms | <2s |
| Largest Contentful Paint (LCP) | 2500ms | <2.5s |
| Time to Interactive (TTI) | 3500ms | <3.5s |
| Cumulative Layout Shift (CLS) | 0.1 | <0.1 |
| First Input Delay (FID) | 100ms | <100ms |

### Running Lighthouse Locally

**1. Using Chrome DevTools:**
```bash
# Start production preview
npm run build
npm run preview

# Open Chrome DevTools (F12)
# Navigate to "Lighthouse" tab
# Select categories: Performance, Accessibility, Best Practices, SEO
# Click "Analyze page load"
```

**2. Using Lighthouse CLI:**
```bash
# Install Lighthouse globally
npm install -g lighthouse

# Build and preview your app
npm run build
npm run preview

# Run Lighthouse (in a new terminal)
lighthouse http://localhost:4173 --view

# Run with budget checks
lighthouse http://localhost:4173 --budget-path=lighthouse-budget.json --view
```

**3. Using npm script (recommended):**
```bash
# Run Lighthouse with budget validation
npm run lighthouse

# Output will show:
# ✓ Passed budgets
# ✗ Failed budgets (with details)
```

### Lighthouse CI in GitHub Actions

Lighthouse CI runs automatically on every pull request:

```yaml
# .github/workflows/lighthouse-ci.yml
name: Lighthouse CI
on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true
```

**What happens on PR:**
1. App is built and deployed to temporary URL
2. Lighthouse runs performance audit
3. Results are compared against budgets
4. PR is blocked if budgets are exceeded
5. Detailed report is posted as PR comment

### Interpreting Lighthouse Results

**Score Ranges:**
- 90-100: ✅ Good (Green)
- 50-89: ⚠️ Needs Improvement (Orange)
- 0-49: ❌ Poor (Red)

**Key Metrics Explained:**

**First Contentful Paint (FCP):** Time until first text/image appears
- Target: <2s
- Impact: User sees page is loading

**Largest Contentful Paint (LCP):** Time until main content is visible
- Target: <2.5s
- Impact: User sees useful content

**Cumulative Layout Shift (CLS):** Visual stability score
- Target: <0.1
- Impact: Content doesn't jump around

**Time to Interactive (TTI):** When page becomes fully interactive
- Target: <3.5s
- Impact: User can interact with page

### Troubleshooting Budget Violations

**JavaScript bundle too large:**
```bash
# Analyze bundle composition
npm run build
npx vite-bundle-visualizer

# Solutions:
# - Enable code splitting
# - Lazy load heavy components
# - Remove unused dependencies
# - Use dynamic imports
```

**Images too large:**
```bash
# Compress images
npm install --save-dev imagemin

# Use modern formats (WebP, AVIF)
# Implement responsive images
# Lazy load images below fold
```

**Poor LCP score:**
```bash
# Preload critical assets
<link rel="preload" as="image" href="/map-background.svg">
<link rel="preload" as="font" href="/fonts/main.woff2">

# Optimize images
# Remove render-blocking resources
# Use CDN for static assets
```

### Updating Performance Budgets

Edit `lighthouse-budget.json` to adjust budgets:

```json
{
  "resourceSizes": [
    {
      "resourceType": "script",
      "budget": 250  // Increase if needed
    }
  ],
  "timings": [
    {
      "metric": "interactive",
      "budget": 4000  // Adjust based on requirements
    }
  ]
}
```

**When to adjust budgets:**
- ✅ After adding critical features (document in commit)
- ✅ Based on real user metrics
- ❌ Just to make CI pass (fix the issue instead!)

### Performance Monitoring in Production

**Track Core Web Vitals:**
```typescript
// Add to src/main.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

**Resources:**
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

## Building for Production

### 1. Build the Application

```bash
npm run build
```

This creates optimized files in `dist/` directory.

### 2. Test Production Build

```bash
npm run preview
```

### 3. Deploy to GitHub Pages

```bash
npm run deploy
```

This builds and deploys to: https://bjpl.github.io/colombia_department_puzzle

## Environment Variables

Create `.env.local` for local development:

```env
# Example environment variables
VITE_API_URL=http://localhost:3000
VITE_ENABLE_ANALYTICS=false
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Contributing Guidelines

### 1. Branch Strategy

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Create bugfix branch
git checkout -b fix/bug-description
```

### 2. Commit Messages

Follow conventional commits:
```
feat: Add new game mode
fix: Resolve San Andrés recognition issue
docs: Update README with new features
style: Format code with Prettier
refactor: Simplify department validation
test: Add component unit tests
chore: Update dependencies
```

### 3. Pull Request Process

1. Update documentation
2. Test all changes
3. Ensure no console errors
4. Update version if needed
5. Request review

## Troubleshooting

### npm install fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port already in use

```bash
# Use different port
npm run dev -- --port 3000
```

### Build errors

```bash
# Check TypeScript errors
npx tsc --noEmit

# Check for lint errors
npm run lint
```

## Resources

### Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [@dnd-kit Documentation](https://docs.dndkit.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [D3-geo](https://github.com/d3/d3-geo)

### Learning Resources
- [React Patterns](https://reactpatterns.com)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Game Development in React](https://www.joshwcomeau.com)

## Support

For help and questions:
- Open an issue on [GitHub](https://github.com/bjpl/colombia_department_puzzle/issues)
- Check existing issues for solutions
- Provide detailed reproduction steps for bugs

---

Happy coding! 🚀