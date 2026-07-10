import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';

export default function ResultScreen() {
   const { winningPrize, resetGame } = useGame();
   const [timerCount, setTimerCount] = useState(15);

   useEffect(() => {
      const countdownLoop = setInterval(() => {
         setTimerCount((prev) => {
            if (prev <= 1) {
               clearInterval(countdownLoop);
               resetGame();
               return 0;
            }
            return prev - 1;
         });
      }, 1000);
      return () => clearInterval(countdownLoop);
   }, [resetGame]);

   return (
      <div className="w-full h-full flex flex-col justify-between p-12 text-center select-none relative overflow-hidden">

         <div className="my-auto w-full max-w-md mx-auto space-y-10">

            {/* Crisp white layout housing verification check */}
            <div className="w-full bg-white rounded-[36px] p-10 shadow-[0_30px_70px_rgba(0,0,0,0.25)] border border-neutral-100 flex flex-col items-center gap-8 relative text-neutral-900">

               {/* Logo at the top of the card */}
               <div className="flex items-center gap-2 text-neutral-900">
                  <div className="w-5 h-5 rounded-full bg-[#0a39a6] flex items-center justify-center shadow-inner" />
                  <span className="text-sm font-black tracking-[0.2em] uppercase">PARKVILLE</span>
               </div>

               {/* Vibrant green checkmark icon */}
               <div className="w-28 h-28 rounded-full bg-emerald-50 border-4 border-emerald-500/10 flex items-center justify-center my-2">
                  <svg
                     className="w-16 h-16 text-emerald-500 stroke-[4.5]"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  >
                     <polyline points="20 6 9 17 4 12" />
                  </svg>
               </div>

               <div className="w-full h-[1px] bg-neutral-100 border-dashed border-t border-neutral-200" />

               {/* Allocation Text Stream */}
               <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-[0.25em] text-neutral-400">
                     Reward Allocated Successfully
                  </h3>
                  <h2 className="text-3xl font-black text-[#0a39a6] tracking-tight mt-2">
                     {winningPrize || 'Special Reward'}
                  </h2>
               </div>

               <div className="w-full h-[1px] bg-neutral-100 border-dashed border-t border-neutral-200" />

               <p className="text-sm text-neutral-500 font-medium max-w-xs">
                  Please show this confirmation layout container to the kiosk assistant to receive your prize token.
               </p>

            </div>

            {/* Countdown Auto Anchor Notification text */}
            <div className="text-blue-100/70 text-sm font-bold tracking-wide">
               Returning to start interface in <span className="font-mono text-white text-lg font-black">{timerCount}</span> seconds...
            </div>

            <button
               onClick={resetGame}
               className="w-full bg-white text-[#0a39a6] py-4 rounded-xl font-black text-lg uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-98 transition-all"
            >
               Done
            </button>

         </div>

      </div>
   );
}