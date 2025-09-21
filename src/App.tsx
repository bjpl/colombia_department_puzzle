import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameContainer from './components/GameContainer';
import { GameProvider } from './context/GameContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import ErrorBoundary from './components/ErrorBoundary';
import MobileBanner from './components/MobileBanner';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter basename="/colombia_department_puzzle">
        <AccessibilityProvider>
          <GameProvider>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
              <MobileBanner />
              <Routes>
                <Route path="/" element={<GameContainer />} />
                <Route path="*" element={<GameContainer />} />
              </Routes>
            </div>
          </GameProvider>
        </AccessibilityProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;