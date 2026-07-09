import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import PrizeWheel from './PrizeWheel';
import { HelpCircle } from 'lucide-react';

export default function GameScreen() {
  const { isSpinning, setIsSpinning, triggerWin } = useGame();

  // Simulated target selector routine (Hooks up smoothly to physics callback engines)
  const handleSpinClick = () => {
    if (isSpinning) return;
    setIsSpinning(true);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between bg-neutral-950 p-12 text-center select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.03),transparent_70%)] pointer-events-none" />

      {/* Top Status Context Banner */}
      <div className="mt-16 space-y-2 z-10">
        <span className="text-xs font-black tracking-[0.4em] uppercase text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
          Token Active
        </span>
        <h2 className="text-4xl font-black uppercase tracking-tight text-white mt-3">
          Test Your Luck
        </h2>
        <p className="text-lg text-neutral-400 font-light">
          Tap the center core or launch button to spin the wheel!
        </p>
      </div>

      {/* High-Resolution Physical Wheel Canvas Core Nesting Wrapper */}
      <div className="w-full flex items-center justify-center my-auto z-10 relative py-8">
        <div className="relative p-4 rounded-full bg-neutral-900/40 border border-neutral-800/60 shadow-[0_0_80px_rgba(0,0,0,0.6)]">
          <PrizeWheel />
        </div>
      </div>

      {/* Lower Tactical Launch Touch Action Bar Container */}
      <div className="w-full flex flex-col items-center gap-8 mb-16 z-10">
        <button
          onClick={handleSpinClick}
          disabled={isSpinning}
          className={`w-full max-w-md py-6 rounded-2xl font-black text-2xl uppercase tracking-widest transition-all ${
            isSpinning
              ? 'bg-neutral-900 border-2 border-neutral-800 text-neutral-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white hover:scale-[1.03] active:scale-95 shadow-[0_0_50px_rgba(219,39,119,0.25)]'
          }`}
        >
          {isSpinning ? 'Matrix Spinning...' : 'Launch Spin'}
        </button>

        {/* Footnote Compliance Banner */}
        <p className="text-xs font-semibold tracking-wider text-neutral-600 uppercase flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" /> Limit one spin attempt per registered profile sequence
        </p>
      </div>

    </div>
  );
}