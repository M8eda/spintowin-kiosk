import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

export default function AttractScreen() {
   const { goToScreen } = useGame();

   return (
      <div
         onClick={() => goToScreen('registration')}
         className="w-full h-full flex flex-col items-center justify-between p-16 text-center cursor-pointer select-none relative"
      >
         {/* High-Resolution Inline Parkville Corporate Logo Emblem */}
         <div className="mt-20 flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full backdrop-blur-md">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-inner">
               <div className="w-3 h-3 rounded-full bg-[#0a39a6]" />
            </div>
            <span className="text-lg font-black tracking-[0.2em] uppercase text-white">
               PARKVILLE
            </span>
         </div>

         {/* Campaign Hero Block */}
         <div className="my-auto space-y-6 max-w-sm">
            <h1 className="text-6xl font-black tracking-tight uppercase leading-none text-white drop-shadow-md">
               WHEEL <br />
               <span className="text-yellow-400">OF LUCK</span>
            </h1>
            <p className="text-lg font-medium text-blue-100/80 tracking-wide max-w-xs mx-auto leading-relaxed">
               Tap the screen to validate your credentials and claim your exclusive reward campaign session.
            </p>
         </div>

         {/* Animated Action Prompt Housing */}
         <motion.div
            animate={{ scale: [1, 1.02, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="mb-16 w-full max-w-xs bg-white text-[#0a39a6] py-5 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_20px_40px_rgba(0,0,0,0.2)] text-center"
         >
            Touch To Play
         </motion.div>
      </div>
   );
}