import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import GameContainer from './components/GameContainer';
import { GameProvider } from './context/GameContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import ErrorBoundary from './components/ErrorBoundary';
import MobileBanner from './components/MobileBanner';
import { keyboardManager } from './services/keyboardManager';

function App() {
  useEffect(() => {
    // Initialize keyboard manager - singleton ensures it's only done once
    keyboardManager.setEnabled(true);
    console.log('Keyboard shortcuts initialized');
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter basename="/colombia_department_puzzle">
        <AccessibilityProvider>
          <GameProvider>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 overflow-x-hidden">
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