import React from 'react';
import { useGame } from '../context/GameContext';
import PrizeWheel from './PrizeWheel';

export default function GameScreen() {
   const { isSpinning, setIsSpinning } = useGame();

   return (
      <div className="w-full h-full flex flex-col items-center justify-between p-12 text-center select-none relative">

         {/* Logo Header */}
         <div className="mt-12 space-y-1 z-10 shrink-0">
            <h1 className="text-4xl font-black tracking-[0.15em] uppercase drop-shadow-md">
               PARKVILLE
            </h1>
            <p className="text-sm font-bold text-blue-200 uppercase tracking-widest">
               Campaign Token Validated
            </p>
         </div>

         {/* Center Wheel Housing Assembly Component */}
         <div className="w-full flex items-center justify-center my-auto z-10 relative py-4">
            <div className="relative p-3 rounded-full bg-white/5 border border-white/10 shadow-2xl">
               <PrizeWheel />
            </div>
         </div>

         {/* Heavy-Duty Touch Trigger Launch Action Button Container */}
         <div className="w-full max-w-md mx-auto mb-12 z-10 shrink-0">
            <button
               onClick={() => { if (!isSpinning) setIsSpinning(true); }}
               disabled={isSpinning}
               className={`w-full py-5 rounded-2xl font-black text-2xl uppercase tracking-widest transition-all border-2 ${
                  isSpinning
                     ? 'bg-white/10 border-white/5 text-blue-200/40 cursor-not-allowed scale-98'
                     : 'bg-yellow-400 text-[#0a39a6] border-yellow-300 shadow-[0_15px_40px_rgba(234,179,8,0.3)] hover:scale-[1.02] active:scale-95'
               }`}
            >
               {isSpinning ? 'Spinning...' : 'Tap To Spin'}
            </button>
         </div>

      </div>
   );
}