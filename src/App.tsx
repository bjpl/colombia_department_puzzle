import React from 'react';
import GameContainer from './components/GameContainer';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <GameContainer />
      </div>
    </GameProvider>
  );
}

export default App;