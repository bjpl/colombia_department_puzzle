# 🇨🇴 Colombia Departments Puzzle Game

An interactive educational puzzle game to learn the 32 departments of Colombia through engaging drag-and-drop gameplay.

## 🎮 Features

- **Interactive Drag & Drop**: Intuitive gameplay where users drag department pieces onto the map
- **Educational Content**: Learn about each department's capital, area, population, and interesting facts
- **Progress Tracking**: Real-time score, timer, and completion percentage
- **Hint System**: Get helpful hints when stuck (with score penalties)
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Beautiful UI**: Modern, clean interface with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bjpl/colombia_department_puzzle.git
cd colombia_department_puzzle
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🏗️ Architecture

This project uses the **SPARC methodology** with **Claude Flow** and **ruv-swarm** symbiotic architecture:

- **Specification**: Clear requirements for each feature
- **Pseudocode**: Algorithm design before implementation
- **Architecture**: Systems thinking for scalable design
- **Refinement**: Iterative improvement and optimization
- **Completion**: Polish and deployment readiness

### Technology Stack

- **React 18** with TypeScript for robust type safety
- **Vite** for lightning-fast development
- **Tailwind CSS** for beautiful, responsive styling
- **@dnd-kit** for accessible drag-and-drop
- **Zustand** for efficient state management
- **D3-geo** for geographic projections

## 🎯 Learning Objectives

Players will learn:
- Names and locations of all 32 Colombian departments
- Capital cities of each department
- Regional geography (Andina, Caribe, Pacífico, Orinoquía, Amazonía)
- Interesting facts about each department
- Spatial relationships between departments

## 📊 Game Mechanics

1. **Drag**: Select a department from the tray
2. **Drop**: Place it in the correct location on the map
3. **Score**: Earn points for correct placements
4. **Learn**: Read educational content about each department
5. **Complete**: Place all 32 departments to win!

### Scoring System

- Correct placement: +100 points (minus 10 for each failed attempt)
- Using hints: -50 points
- Time bonus: Faster completion yields higher scores

## 🛠️ Development

### Project Structure

```
colombia_departments_puzzle/
├── src/
│   ├── components/     # React components
│   ├── context/        # Game state management
│   ├── data/          # Department data and GeoJSON
│   ├── utils/         # Helper functions
│   └── App.tsx        # Main application
├── docs/              # SPARC documentation
│   ├── architecture/  # System design docs
│   └── pseudocode/    # Algorithm designs
└── public/           # Static assets
```

### Contributing

Contributions are welcome! Please follow the SPARC methodology for new features:
1. Document specifications
2. Design algorithms in pseudocode
3. Plan architecture with systems thinking
4. Implement with quality refinements
5. Polish and test thoroughly

## 📈 Performance Optimizations

- **WebGL acceleration** for complex map rendering
- **SIMD optimizations** via ruv-swarm for computational tasks
- **Lazy loading** for department data and images
- **Service Worker** for offline gameplay
- **Code splitting** for optimal bundle sizes

## 🌟 Future Enhancements

- [ ] Actual GeoJSON map with accurate boundaries
- [ ] Multiple difficulty levels
- [ ] Multiplayer competition mode
- [ ] Achievement system
- [ ] Sound effects and music
- [ ] Additional educational mini-games
- [ ] Historical timeline mode
- [ ] Export learning progress

## 📄 License

MIT License - feel free to use this project for educational purposes!

## 🙏 Acknowledgments

- Colombian geographic data from DANE (Departamento Administrativo Nacional de Estadística)
- Built with the power of Claude Flow and ruv-swarm symbiotic architecture
- Inspired by educational gaming best practices

## 🤝 Contact

For questions or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for learning Colombian geography**