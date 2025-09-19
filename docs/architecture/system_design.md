# System Architecture: Colombia Departments Puzzle

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Colombia Puzzle Game                         │
├─────────────────────────────────────────────────────────────────────┤
│                      Presentation Layer                             │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  React Components                                                │ │
│ │  ├── GameContainer      (Main game orchestrator)                │ │
│ │  ├── MapCanvas         (SVG/Canvas rendering)                  │ │
│ │  ├── DepartmentPiece   (Draggable puzzle pieces)              │ │
│ │  ├── PuzzleBoard       (Drop target map)                       │ │
│ │  ├── ProgressTracker   (Learning progress UI)                  │ │
│ │  └── EducationalPanel  (Department info display)               │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                      Business Logic Layer                           │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  Game Engine                                                     │ │
│ │  ├── PuzzleValidator   (Placement validation)                   │ │
│ │  ├── ScoreCalculator   (Points and achievements)               │ │
│ │  ├── HintSystem        (Progressive hints)                      │ │
│ │  └── GameStateManager  (Save/load/reset)                       │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                      Data Access Layer                              │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  Data Services                                                   │ │
│ │  ├── GeographyService  (Department boundaries)                  │ │
│ │  ├── StorageService    (LocalStorage/IndexedDB)                │ │
│ │  ├── AnalyticsService  (Learning metrics)                       │ │
│ │  └── AssetLoader       (Images, sounds, data)                   │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **State Management**: Zustand for global state
- **Drag & Drop**: @dnd-kit for accessible DnD
- **Styling**: Tailwind CSS for rapid UI development
- **Build Tool**: Vite for fast development

### Geographic Rendering
- **Map Projection**: D3-geo for Mercator projection
- **Data Format**: TopoJSON for efficient boundaries
- **Rendering**: Hybrid SVG/Canvas based on performance
- **Optimization**: WebGL via PixiJS for complex scenes

### Performance Optimization
- **Code Splitting**: Dynamic imports for features
- **Asset Optimization**: WebP images, compressed JSON
- **Caching**: Service Worker for offline play
- **Memory Management**: Object pooling for drag items

## Data Flow Architecture

```
User Input → Event Handler → State Update → Re-render
    ↓             ↓              ↓             ↓
Touch/Mouse  Validation    Zustand Store  React Update
    ↓             ↓              ↓             ↓
DnD Library  Game Logic    LocalStorage   DOM/Canvas
```

## Component Hierarchy

```
App
├── GameProvider (Context/State)
├── GameContainer
│   ├── Header
│   │   ├── Score
│   │   ├── Timer
│   │   └── MenuButton
│   ├── GameBoard
│   │   ├── MapCanvas
│   │   │   ├── BaseMap
│   │   │   ├── PlacedDepartments
│   │   │   └── DropZones
│   │   └── DepartmentTray
│   │       └── DraggableDepartment[]
│   └── Sidebar
│       ├── DepartmentInfo
│       ├── HintButton
│       └── ProgressBar
└── Modals
    ├── WinModal
    ├── PauseModal
    └── SettingsModal
```

## Performance Targets

- **Initial Load**: <3s on 3G
- **Time to Interactive**: <1.5s
- **Frame Rate**: 60 FPS during drag
- **Memory Usage**: <50MB active
- **Bundle Size**: <500KB gzipped