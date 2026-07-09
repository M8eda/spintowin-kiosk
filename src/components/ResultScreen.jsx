import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { Gift, ArrowLeft } from 'lucide-react';

export default function ResultScreen() {
  const { winningPrize, resetGame } = useGame();
  const [countdown, setCountdown] = useState(15); // 15-second safety boundary

  // Automatic Kiosk Idle Reset Watchdog
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          resetGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resetGame]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 p-12 text-center relative select-none">
      
      {/* Upper Status Block */}
      <div className="w-full flex flex-col items-center mt-12 gap-2">
        <span className="text-yellow-400 font-black tracking-[0.4em] uppercase text-xl">
          Allocation Successful
        </span>
        <div className="h-1 w-32 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
      </div>

      {/* Center Congratulations Block - Scaled for High-Impact Tall Displays */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="flex flex-col items-center gap-8 max-w-xl z-10"
      >
        {/* Animated Reward Icon Shield */}
        <div 
          className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.15)] border border-yellow-400/20"
          style={{ backgroundColor: winningPrize?.color || '#8B5CF6' }}
        >
          <Gift className="w-16 h-16 text-white drop-shadow-md" />
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-light text-neutral-400 uppercase tracking-wide">
            Congratulations!
          </h2>
          <h3 className="text-6xl md:text-7xl font-black tracking-tight text-white uppercase drop-shadow-lg">
            {winningPrize?.label || 'Exclusive Prize'}
          </h3>
        </div>

        <p className="text-neutral-400 text-xl font-normal max-w-md bg-neutral-900/50 backdrop-blur-md px-6 py-4 rounded-xl border border-neutral-800">
          Please present this touchscreen interface to the counter staff to instantly redeem your reward voucher.
        </p>
      </motion.div>

      {/* Lower Control Actions & Active Safety Countdown Gauges */}
      <div className="w-full flex flex-col items-center mb-12 gap-8 z-10">
        <button
          onClick={resetGame}
          className="flex items-center gap-3 px-8 py-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold tracking-wide border border-neutral-800 transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          Done / Next Player
        </button>

        {/* Visual Countdown Progress Indicator */}
        <div className="flex items-center gap-2 text-sm font-semibold tracking-widest text-neutral-600 uppercase">
          <span>Auto-resetting in</span>
          <span className="text-yellow-500/80 font-mono text-base bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800/60">
            {countdown}s
          </span>
        </div>
      </div>
    </div>
  );
}