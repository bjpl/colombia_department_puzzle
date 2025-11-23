# Colombia Departments Puzzle Game

An interactive educational puzzle game for learning Colombian geography through drag-and-drop gameplay.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Learning Objectives](#learning-objectives)
- [Game Mechanics](#game-mechanics)
- [Technology Stack](#technology-stack)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Overview

An interactive educational puzzle game to learn all 33 departments of Colombia (32 departments plus Bogotá D.C.) through engaging drag-and-drop gameplay with multiple game modes and difficulty levels. Built with SPARC methodology and Claude Flow symbiotic architecture.

**Version**: 1.0.0
**Status**: VERY ACTIVE - 10 commits in last 30 days

## Live Demo

**Deployed Application:** [View Live Demo](https://bjpl.github.io/colombia_department_puzzle)

This project demonstrates interactive educational game development for geographic learning, focusing specifically on Colombian geography. Unlike general puzzle games, this implementation emphasizes culturally relevant educational content including regional information, capital cities, and Colombia-specific facts that support meaningful learning outcomes.

## Technical Overview

**Key Technologies:**
- React 18 with TypeScript 5.9 for robust type safety
- Vite 7.1 for lightning-fast development and builds
- D3-geo 3.1.0 for accurate geographic projections
- @dnd-kit/core 6.1.0 for accessible drag-and-drop
- Zustand 4.4 for efficient state management
- Supabase 2.75.0 for backend services
- Vitest 3.2 with 1,792 comprehensive tests

**Implementation Highlights:**
- Real GeoJSON map data with accurate Colombian department boundaries
- D3-geo 3.1.0 for precise geographic projections
- @dnd-kit for accessible drag-and-drop with keyboard navigation
- Six regional focus modes targeting specific geographic areas
- Educational content integration (capitals, regions, cultural facts)
- PWA with offline support for classroom and low-connectivity use
- Comprehensive test suite with 1,792 tests

## Features

### Core Gameplay
- Smooth, intuitive drag-and-drop mechanics using @dnd-kit
- Multiple game modes: Complete Colombia, Regional Practice, Time Challenge, Progression Mode
- Educational content with capitals, regions, and interesting facts
- Real GeoJSON map with accurate geographic boundaries

### Learning Tools
- Study mode for interactive exploration without time pressure
- Progressive hint system with three levels
- Post-game reports with detailed performance analytics
- Achievement system with badges for speed, accuracy, and persistence

### User Experience
- Progressive Web App with offline support
- Responsive design optimized for mobile (landscape/portrait modes)
- Security hardening with comprehensive features
- Accessibility support with screen reader and keyboard navigation
- Optional sound effects for actions
- Multiple layout options for department trays
- Robust error boundaries for uninterrupted gameplay

## Exploring the Code

The project demonstrates systematic game development using SPARC methodology:

```
colombia_puzzle_game/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── context/           # State management
│   ├── data/             # GeoJSON and game data
│   ├── hooks/           # Custom React hooks
│   ├── services/        # Business logic
│   └── utils/          # Utilities and algorithms
├── docs/               # Documentation
├── scripts/            # Utility scripts
└── .claude/            # Claude Flow configuration
```

**Architecture Highlights:**
- Component-based React architecture with TypeScript
- D3-geo integration for accurate geographic rendering
- Zustand for performant state management
- Service layer pattern for business logic separation
- Comprehensive error boundaries for graceful failure handling
- PWA architecture with service worker for offline capability

**Game Mechanics Demonstrate:**
- Interactive drag-and-drop with collision detection
- Six regional focus modes for targeted learning
- Progressive difficulty with dynamic scoring system
- Educational content integration (capitals, regions, facts)
- Achievement tracking and performance analytics

**SPARC Methodology Implementation:**
1. **Specification** - Document requirements and user stories
2. **Pseudocode** - Design algorithms before implementation
3. **Architecture** - Plan system structure and patterns
4. **Refinement** - Implement with quality focus
5. **Completion** - Polish and comprehensive testing

**For Technical Review:**

Those interested in the implementation details can explore:
- `/src/components` for React component architecture
- `/src/services` for game logic and algorithms
- `/docs` for SPARC methodology documentation
- Test files demonstrating 1,792 comprehensive tests

<details>
<summary>Local Development Setup (Optional)</summary>

**Prerequisites:**
- Node.js 18+
- Modern web browser

**Setup:**
```bash
# Clone repository
git clone https://github.com/bjpl/colombia_department_puzzle.git
cd colombia_department_puzzle

# Install dependencies
npm install

# Start development server
npm run dev
```

Open browser at http://localhost:5173

**Available Scripts:**
```bash
npm run dev              # Development server
npm run build            # Production build
npm run deploy           # Deploy to GitHub Pages
npm run test             # Run tests
npm run typecheck        # Type checking
```

</details>

## Project Structure

```
colombia_puzzle_game/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── context/           # State management
│   ├── data/             # Game data
│   ├── constants/        # Configuration
│   ├── hooks/           # Custom React hooks
│   ├── services/        # Business logic
│   └── utils/          # Utilities
├── docs/               # Documentation
├── scripts/            # Utility scripts
├── .claude/            # Claude Flow config
├── public/            # Static assets
└── [Config files]     # Root configurations
```

## Learning Objectives

Players will learn:
- Names and locations of all 33 Colombian departments (including Bogotá D.C.)
- Capital cities of each department
- Six geographic regions: Andina, Caribe, Pacífica, Orinoquía, Amazonía, Insular
- Spatial relationships and borders between departments
- Cultural and geographic diversity of Colombia

## Game Mechanics

### Basic Gameplay
1. Select a department from the organized tray
2. Drag the department piece across the screen
3. Release on the correct location on the map
4. Receive instant visual and audio confirmation
5. View educational information about placed departments
6. Complete the game by placing all departments

### Scoring System
- Base Score: 100 points per correct placement
- Attempt Penalty: -10 points per incorrect attempt
- Minimum Score: 10 points per department
- Hint Costs: Region hint (-10), Letter hint (-20), Location flash (-50)
- Achievement Bonuses: Perfect game (+500), Speed run (+300), No hints (+200)

## Technology Stack

### Frontend
- React 18 with TypeScript 5.9 for robust type safety
- Vite 7.1 for lightning-fast development
- D3-geo 3.1.0 for geographic projections
- @dnd-kit/core 6.1.0 for accessible drag-and-drop
- Zustand 4.4 for efficient state management

### Backend Services
- Supabase 2.75.0 for backend services
- React Router 7.9.4 for navigation

### Testing
- Vitest 3.2 for testing
- Playwright 1.56 for end-to-end testing
- 1,792 total tests

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run tests
npm run typecheck        # Type checking
npm run lint             # Linting

# Deployment
npm run deploy           # Deploy to GitHub Pages
```

### Performance Optimizations

#### Current Optimizations
- Optimized SVG rendering with efficient path rendering
- Memoized components with React.memo
- Debounced interactions for smooth drag operations
- Lazy state updates with batched Zustand updates
- Error boundaries for isolated component failures
- Responsive scaling with adaptive viewport calculations

#### Bundle Optimizations
- Tree shaking to remove unused dependencies
- Code splitting with dynamic imports
- Asset optimization with compressed GeoJSON data
- Production build with minified and optimized output

## Contributing

Contributions are welcome. Please follow the SPARC methodology for new features.

### Development Workflow
1. Document specifications
2. Design algorithms in pseudocode
3. Plan architecture with systems thinking
4. Implement with quality refinements
5. Polish and test thoroughly

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
