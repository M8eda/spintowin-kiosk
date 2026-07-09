import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { Compass } from 'lucide-react';

export default function AttractScreen() {
  const { goToScreen } = useGame();

  return (
    <div 
      onClick={() => goToScreen('registration')}
      className="w-full h-full flex flex-col items-center justify-between p-16 text-center cursor-pointer select-none relative"
    >
      {/* Top Brand Mark Accent */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mt-16 flex flex-col items-center gap-3"
      >
        <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center shadow-md">
          <Compass className="w-5 h-5 text-white animate-spin duration-[20s]" />
        </div>
        <span className="text-xs font-black tracking-[0.4em] uppercase text-neutral-400">
          The Premium Suite Experience
        </span>
      </motion.div>

      {/* Center Grand Typography Display */}
      <div className="my-auto space-y-6 max-w-lg">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-7xl font-black tracking-tight uppercase text-neutral-900 leading-[0.95]"
        >
          Spin <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-500">
            To Win.
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg font-medium text-neutral-500 tracking-wide max-w-xs mx-auto"
        >
          Tap anywhere on the glass surface to unlock exclusive brand tier rewards.
        </motion.p>
      </div>

      {/* Bottom Ultra-Premium Touch Indicator Trigger */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="mb-16 w-full max-w-sm bg-white border border-neutral-200/80 shadow-[0_15px_35px_rgba(0,0,0,0.04)] py-6 rounded-2xl flex flex-col items-center justify-center gap-2"
      >
        <span className="text-sm font-bold tracking-[0.2em] uppercase text-neutral-900">
          Touch Glass to Start
        </span>
        <div className="w-6 h-1 bg-neutral-900 rounded-full animate-bounce mt-1" />
      </motion.div>
    </div>
  );
}