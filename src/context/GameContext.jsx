import React, { createContext, useState, useCallback, useMemo, use } from 'react';

// 1. Instantiate the raw context engine
export const GameContext = createContext(null);

// 2. State Machine Wrapper to control the Kiosk loop
export function GameProvider({ children }) {
  // Screens: 'attract' (Idle loop) | 'game' (Active Spin) | 'result' (Prize Win)
  const [currentScreen, setCurrentScreen] = useState('attract');
  const [winningPrize, setWinningPrize] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Standard safe screen transitions
  const goToScreen = useCallback((screen) => {
    setCurrentScreen(screen);
  }, []);

  // Set the final selected prize and pivot to the rewards panel
  const triggerWin = useCallback((prize) => {
    setWinningPrize(prize);
    setCurrentScreen('result');
  }, []);

  // Hard reset back to idle state for the next user in line
  const resetGame = useCallback(() => {
    setWinningPrize(null);
    setIsSpinning(false);
    setCurrentScreen('attract');
  }, []);

  // Stabilize the context object in memory to prevent layout stuttering
  const stateValue = useMemo(() => ({
    currentScreen,
    winningPrize,
    isSpinning,
    setIsSpinning,
    goToScreen,
    triggerWin,
    resetGame
  }), [currentScreen, winningPrize, isSpinning, goToScreen, triggerWin, resetGame]);

  // Modern React 19 Syntax: <Context> used directly instead of <Context.Provider>
  return (
    <GameContext value={stateValue}>
      {children}
    </GameContext>
  );
}

// 3. Custom native Hook for instant context consumption across screens
export function useGame() {
  const context = use(GameContext);
  if (!context) {
    throw new Error('useGame must be consumed within a valid GameProvider template');
  }
  return context;
}