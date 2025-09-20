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