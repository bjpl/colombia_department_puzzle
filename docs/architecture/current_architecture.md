# Current System Architecture: Colombia Departments Puzzle

## Overview
This document describes the current architecture of the Colombia Departments Puzzle game as of version 1.0.0.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Colombia Puzzle Game v1.0                        │
├─────────────────────────────────────────────────────────────────────┤
│                         Frontend Layer                              │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  React 18 + TypeScript Application                              │ │
│ │  ├── GameContainer     (Main orchestrator)                      │ │
│ │  ├── OptimizedColombiaMap (GeoJSON SVG renderer)               │ │
│ │  ├── DepartmentTray    (Draggable chips)                       │ │
│ │  ├── StudyMode        (Learning interface)                     │ │
│ │  ├── GameModeSelector (Mode selection)                         │ │
│ │  ├── PostGameReport   (Analytics & achievements)               │ │
│ │  └── Error Boundaries (Component isolation)                    │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                      State Management Layer                         │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  Zustand Store (GameContext)                                    │ │
│ │  ├── Game State       (score, attempts, timer)                 │ │
│ │  ├── Department State (placed, current, active)                │ │
│ │  ├── Mode State      (game mode, regions)                     │ │
│ │  └── UI State        (modals, feedback)                       │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                        Services Layer                               │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  Business Logic Services                                        │ │
│ │  ├── StorageService   (LocalStorage profiles)                  │ │
│ │  ├── SoundManager     (Audio feedback)                         │ │
│ │  ├── NameNormalizer   (ID consistency)                         │ │
│ │  └── HintSystem       (Progressive hints)                      │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                          Data Layer                                 │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  Static Data Assets                                             │ │
│ │  ├── colombia.geojson (Geographic boundaries)                   │ │
│ │  ├── colombiaDepartments.ts (Department metadata)              │ │
│ │  ├── gameConstants.ts (Configuration)                          │ │
│ │  └── regionColors.ts  (Visual theming)                         │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Core Components

#### GameContainer (`src/components/GameContainer.tsx`)
- **Purpose**: Main game orchestrator and layout manager
- **Responsibilities**:
  - Drag and drop context provider (@dnd-kit/core)
  - Modal management
  - Game flow control
  - Layout orchestration (map, tray, educational panel)
- **Key Features**:
  - Error boundary integration
  - Responsive layout switching
  - Keyboard navigation support

#### OptimizedColombiaMap (`src/components/OptimizedColombiaMap.tsx`)
- **Purpose**: Render interactive Colombia map with droppable zones
- **Responsibilities**:
  - GeoJSON parsing and rendering
  - SVG path generation with D3-geo
  - Droppable zones for each department
  - Visual feedback for placed departments
- **Special Handling**:
  - San Andrés archipelago name mapping
  - Responsive viewport scaling
  - Pan and zoom controls

#### DepartmentTray (`src/components/DepartmentTray.tsx`)
- **Purpose**: Display draggable department chips
- **Layout Modes**:
  - Horizontal grid (default)
  - Vertical sidebar
  - Compact chips
  - Ultra-compact mini chips
- **Features**:
  - Regional grouping
  - Color coding by region
  - Accessibility labels

### Game Modes

#### Study Mode
- Interactive exploration without time pressure
- Department information display
- Regional focus options
- No scoring or penalties

#### Practice Modes
- **Complete Colombia**: All 33 departments
- **Regional Practice**: Focus on specific regions (unlocked)
- **Time Challenge**: Speed-based gameplay
- **Progression Mode**: Unlock regions through achievements

### State Management

#### Zustand Store Structure
```typescript
interface GameState {
  // Core game state
  departments: Department[]
  placedDepartments: Set<string>
  currentDepartment: Department | null
  score: number
  attempts: number
  hints: number
  elapsedTime: number

  // Game flow
  isGameStarted: boolean
  isGameComplete: boolean
  isPaused: boolean

  // Mode configuration
  gameMode: GameModeConfig
  activeDepartments: Department[]
  regionProgress: Map<string, RegionProgress>

  // Actions
  selectDepartment: (dept: Department) => void
  placeDepartment: (id: string, correct: boolean) => void
  resetGame: () => void
  useHint: () => void
}
```

## Data Flow

### Drag and Drop Flow
```
User Interaction → DraggableChip → DndContext → GameContainer
                                        ↓
                              Collision Detection
                                        ↓
                            DroppableDepartment Match
                                        ↓
                              Validation Logic
                                        ↓
                         State Update (Zustand)
                                        ↓
                            UI Re-render
```

### Score Calculation
```
Base Score (100)
  - (Attempts × 10)
  - Hint Penalties
  + Achievement Bonuses
  = Final Score
```

## Performance Characteristics

### Current Metrics
- **Bundle Size**: ~450KB gzipped
- **Initial Load**: <2s on 3G
- **Frame Rate**: 60 FPS during drag
- **Memory Usage**: ~35MB active
- **Lighthouse Score**: 95+ Performance

### Optimization Techniques
1. **React.memo**: Prevent unnecessary re-renders
2. **useMemo/useCallback**: Expensive computations
3. **Lazy Loading**: Modal components
4. **SVG Optimization**: Simplified paths
5. **Debounced Updates**: Smooth interactions

## Error Handling Strategy

### Three-Layer Error Boundaries
1. **MapErrorBoundary**: Isolates map rendering failures
2. **GameLogicErrorBoundary**: Catches game state errors
3. **ComponentErrorBoundary**: Generic component protection

### Recovery Mechanisms
- Automatic retry (up to 3 attempts)
- Graceful degradation
- User-friendly error messages
- State preservation on error

## Storage Architecture

### LocalStorage Schema
```javascript
{
  "colombia_puzzle_profiles": [...],
  "colombia_puzzle_active_profile": "uuid",
  "colombia_puzzle_sessions": [...],
  "colombia_puzzle_settings": {
    soundEnabled: boolean,
    musicEnabled: boolean,
    animations: boolean,
    tutorialShown: boolean
  }
}
```

### Profile Structure
```typescript
interface Profile {
  id: string
  name: string
  avatar: string
  createdAt: number
  stats: {
    gamesPlayed: number
    gamesCompleted: number
    totalScore: number
    highScore: number
    bestTime: number
    totalTime: number
    accuracy: number
    hintsUsed: number
    perfectGames: number
  }
}
```

## Deployment Configuration

### Build Process
1. TypeScript compilation
2. Vite bundling with Rollup
3. Asset optimization (images, JSON)
4. HTML injection
5. GitHub Pages deployment

### Environment Support
- **Development**: Vite dev server with HMR
- **Production**: Static files on GitHub Pages
- **Preview**: Local production build testing

## Security Considerations

- No sensitive data storage
- XSS protection via React
- Content Security Policy headers
- Input validation for drag targets
- Safe JSON parsing for GeoJSON

## Accessibility Features

- ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements
- High contrast mode support
- Focus indicators
- Semantic HTML structure

## Browser Compatibility

### Supported Browsers
- Chrome 90+ ✓
- Firefox 88+ ✓
- Safari 14+ ✓
- Edge 90+ ✓

### Required APIs
- Drag and Drop API
- LocalStorage API
- Web Audio API
- SVG rendering
- CSS Grid/Flexbox

## Future Architecture Considerations

### Potential Enhancements
1. **PWA Support**: Service worker for offline play
2. **Backend Integration**: User accounts and leaderboards
3. **WebGL Renderer**: For complex animations
4. **Multiplayer**: WebSocket-based real-time competition
5. **Mobile Apps**: React Native ports

### Scalability Points
- Component lazy loading ready
- State management extensible
- Modular service architecture
- Clean separation of concerns
- TypeScript for maintainability