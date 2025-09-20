import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
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
        🇨🇴 Centro de Aprendizaje de Colombia
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Link to="/puzzle" className="block p-8 bg-blue-100 rounded-lg hover:bg-blue-200 transition">
          <h2 className="text-2xl font-bold mb-4">🧩 Juego de Rompecabezas</h2>
          <p className="text-gray-700">Aprende los departamentos colombianos a través de un juego interactivo de arrastrar y soltar.</p>
        </Link>
        <Link to="/study" className="block p-8 bg-green-100 rounded-lg hover:bg-green-200 transition">
          <h2 className="text-2xl font-bold mb-4">📚 Modo de Estudio</h2>
          <p className="text-gray-700">Aprende las capitales y datos geográficos de los departamentos colombianos con tarjetas didácticas.</p>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter basename="/colombia_department_puzzle">
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