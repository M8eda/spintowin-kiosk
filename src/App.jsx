import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import AttractScreen from './components/AttractScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';

// Internal routing shell to read the active state machine screen
function KioskContent() {
  const { currentScreen } = useGame();

  switch (currentScreen) {
    case 'attract':
      return <AttractScreen />;
    case 'game':
      return <GameScreen />;
    case 'result':
      return <ResultScreen />;
    default:
      return <AttractScreen />;
  }
}

// Global wrapper providing context, layout bounds, and touch-surface protection
export default function App() {
  return (
    <GameProvider>
      <main className="w-screen h-screen overflow-hidden bg-neutral-950 text-neutral-50 font-sans select-none touch-none">
        <KioskContent />
      </main>
    </GameProvider>
  );
}