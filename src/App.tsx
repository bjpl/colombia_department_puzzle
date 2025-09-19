import React from 'react';
import GameContainer from './components/GameContainer';
import { GameProvider } from './context/GameContext';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
          <GameContainer />
        </div>
      </GameProvider>
    </ErrorBoundary>
  );
}

export default App;