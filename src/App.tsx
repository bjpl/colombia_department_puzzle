import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameContainer from './components/GameContainer';
import StudyModeContainer from './components/StudyMode/StudyModeContainer';
import NavigationMenu from './components/NavigationMenu';
import { GameProvider } from './context/GameContext';
import ErrorBoundary from './components/ErrorBoundary';
import MobileBanner from './components/MobileBanner';

function HomePage() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        🇨🇴 Colombia Learning Hub
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        <a href="/puzzle" className="block p-8 bg-blue-100 rounded-lg hover:bg-blue-200 transition">
          <h2 className="text-2xl font-bold mb-4">🧩 Puzzle Game</h2>
          <p className="text-gray-700">Learn Colombian departments through an interactive drag-and-drop puzzle game.</p>
        </a>
        <a href="/study" className="block p-8 bg-green-100 rounded-lg hover:bg-green-200 transition">
          <h2 className="text-2xl font-bold mb-4">📚 Study Mode</h2>
          <p className="text-gray-700">Master regional Spanish vocabulary with flashcards and practice exercises.</p>
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <GameProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            <NavigationMenu />
            <MobileBanner />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/puzzle" element={<GameContainer />} />
              <Route path="/study" element={<StudyModeContainer />} />
            </Routes>
          </div>
        </GameProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;