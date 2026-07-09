import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

export default function AttractScreen() {
  const { goToScreen } = useGame();

  return (
    <div 
      onClick={() => goToScreen('game')}
      className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 cursor-pointer p-8 relative select-none"
    >
      {/* Ambient Pulsing Glow in the Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.08),transparent_60%)] pointer-events-none" />

      {/* Main Title Typography Block */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center z-10 flex flex-col items-center gap-4"
      >
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
          Spin To Win
        </h1>
        
        <p className="text-neutral-400 text-lg md:text-2xl font-light max-w-md tracking-wide mt-2">
          Tap anywhere to claim your exclusive reward
        </p>
      </motion.div>

      {/* Rhythmic Touch Call-to-Action Indicator */}
      <motion.div
        animate={{ 
          scale: [1, 1.03, 1],
          opacity: [0.6, 1, 0.6] 
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute bottom-28 z-10 flex flex-col items-center"
      >
        <span className="text-xl md:text-2xl font-bold uppercase tracking-[0.3em] text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]">
          TOUCH TO PLAY
        </span>
      </motion.div>
    </div>
  );
}