# Colombia Puzzle Game Documentation

Welcome to the comprehensive documentation for the Colombia Departments Puzzle Game. This educational game helps players learn the geography of Colombia through interactive gameplay.

## 📚 Documentation Index

### Getting Started
- [**README**](../README.md) - Project overview and quick start guide
- [**Developer Guide**](DEVELOPER_GUIDE.md) - Complete setup and development instructions
- [**Game Mechanics**](GAME_MECHANICS.md) - Detailed gameplay rules and systems

### Technical Documentation
- [**Current Architecture**](architecture/current_architecture.md) - System design and structure
- [**Component API**](COMPONENT_API.md) - Detailed component reference
- [**SPARC Map Rendering**](SPARC_MAP_RENDERING.md) - Map rendering specifications

### Design System & Style
- [**Design System Guide**](DESIGN_SYSTEM_GUIDE.md) - Complete design system usage ✨ NEW
- [**Style Guide**](STYLE_GUIDE.md) - Code and visual style standards ✨ NEW
- [**Design Tokens Reference**](DESIGN_TOKENS_REFERENCE.md) - Quick token reference ✨ NEW
- [**Design System Migration Plan**](DESIGN_SYSTEM_MIGRATION_PLAN.md) - Migration progress
- [**FAQ**](FAQ.md) - Frequently asked questions ✨ NEW

### Archive
- [**Archive Folder**](archive/) - Historical documentation and reports
- [**System Design**](architecture/system_design.md) - Original architecture plans

## 🎮 Game Overview

### What is Colombia Puzzle Game?
An interactive educational web application that teaches players the geography of Colombia's 33 departments (32 departments + Bogotá D.C.) through engaging drag-and-drop gameplay.

### Key Features
- ✅ Real GeoJSON map with accurate boundaries
- ✅ Multiple game modes (Complete, Regional, Time Challenge, Study)
- ✅ Progressive hint system
- ✅ Achievement system
- ✅ Performance tracking and analytics
- ✅ Responsive design for all devices
- ✅ Accessibility features

## 🏗️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Drag & Drop**: @dnd-kit/core
- **Map Rendering**: D3-geo with GeoJSON
- **Deployment**: GitHub Pages

## 🚀 Quick Links

### For Players
- [Play the Game](https://bjpl.github.io/colombia_department_puzzle)
- [Game Mechanics](GAME_MECHANICS.md)
- [Learning Objectives](../README.md#-learning-objectives)

### For Developers
- [Setup Instructions](DEVELOPER_GUIDE.md#initial-setup)
- [Component Reference](COMPONENT_API.md)
- [Architecture Overview](architecture/current_architecture.md)
- [Design System Guide](DESIGN_SYSTEM_GUIDE.md)
- [Style Guide](STYLE_GUIDE.md)
- [Contributing Guidelines](DEVELOPER_GUIDE.md#contributing-guidelines)
- [FAQ](FAQ.md)

### For Contributors
- [GitHub Repository](https://github.com/bjpl/colombia_department_puzzle)
- [Issue Tracker](https://github.com/bjpl/colombia_department_puzzle/issues)
- [Development Workflow](DEVELOPER_GUIDE.md#development-workflow)

## 📊 Project Status

### Current Version: 1.0.0

#### Implemented Features
- ✅ Core drag-and-drop gameplay
- ✅ All 33 departments with accurate boundaries
- ✅ 6 game modes including Study Mode
- ✅ Sound effects and visual feedback
- ✅ Progress tracking and profiles
- ✅ Post-game analytics
- ✅ Achievement system
- ✅ Responsive design

#### Upcoming Features
- 🚧 Multiplayer competition mode
- 🚧 Additional mini-games
- 🚧 Mobile app versions
- 🚧 Voice pronunciation guide
- 🚧 Social features and leaderboards

## 🎯 Learning Outcomes

Players will master:
1. **Geographic Knowledge**: Location of all 33 Colombian departments
2. **Regional Understanding**: Six geographic regions and their characteristics
3. **Capital Cities**: Each department's capital
4. **Spatial Relationships**: Borders and relative positions
5. **Cultural Awareness**: Regional diversity and characteristics

## 🛠️ Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Key Commands
- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages
- `npm run lint` - Run ESLint
- `npm run test` - Run tests (when implemented)

## 📈 Performance Metrics

- **Bundle Size**: ~450KB gzipped
- **Load Time**: <2s on 3G
- **Frame Rate**: 60 FPS during interactions
- **Lighthouse Score**: 95+ Performance
- **Browser Support**: Chrome, Firefox, Safari, Edge (latest versions)

## 🤝 Contributing

We welcome contributions! Please see our [Developer Guide](DEVELOPER_GUIDE.md#contributing-guidelines) for details on:
- Setting up your development environment
- Code style guidelines
- Testing procedures
- Pull request process

## 📄 License

MIT License - See [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- Geographic data from DANE (Departamento Administrativo Nacional de Estadística)
- Built with React, TypeScript, and modern web technologies
- Community contributors and testers

## 📞 Support

For help or questions:
- Open an [issue on GitHub](https://github.com/bjpl/colombia_department_puzzle/issues)
- Check the [Developer Guide](DEVELOPER_GUIDE.md#troubleshooting)
- Review [Game Mechanics](GAME_MECHANICS.md) for gameplay questions

---

**Last Updated**: October 2025
**Version**: 1.0.0
**Status**: Production (Mobile v1.0)

*Made with ❤️ for learning Colombian geography*