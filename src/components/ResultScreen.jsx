import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { Gift, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function ResultScreen() {
  const { winningPrize, resetGame } = useGame();
  const [countdown, setCountdown] = useState(15);

  // Automatic safety loop: forces kiosk back to attract screen if player walks away
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
    <div className="w-full h-full flex flex-col items-center justify-between bg-neutral-950 p-12 text-center select-none relative overflow-hidden">
      
      {/* Immersive Premium Background Light Ambient Flares */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-md h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

      {/* Top Verification Status Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-5 py-2.5 rounded-full"
      >
        <ShieldCheck className="w-5 h-5 text-emerald-400" />
        <span className="text-xs font-black uppercase tracking-[0.25em] text-emerald-400">
          Secure Allocation Successful
        </span>
      </motion.div>

      {/* Central Luxurious Digital Voucher Ticket */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        className="w-full max-w-md bg-gradient-to-b from-neutral-900 to-neutral-950 border-2 border-neutral-800/80 rounded-[32px] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative"
      >
        {/* Decorative Ticket Punch Side Cutouts */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-neutral-950 border-r-2 border-neutral-800 rounded-full" />
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-neutral-950 border-l-2 border-neutral-800 rounded-full" />

        <div className="flex flex-col items-center gap-6">
          {/* Glowing Reward Icon Floating Frame */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 p-[2px] shadow-[0_0_40px_rgba(16,185,129,0.25)]">
            <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
              <Gift className="w-9 h-9 text-emerald-400" />
            </div>
          </div>

          {/* Winning Tier Text Blocks */}
          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-neutral-500">
              Congratulations
            </h3>
            <h2 className="text-4xl font-black tracking-tight text-white uppercase bg-clip-text">
              {winningPrize || "Mystery Gift"}
            </h2>
          </div>

          <div className="w-full border-t border-dashed border-neutral-800 my-2" />

          {/* Operator Action Callout Frame */}
          <p className="text-base text-neutral-400 font-medium leading-relaxed max-w-[280px]">
            Please present this touchscreen interface to the counter staff to instantly redeem your reward voucher.
          </p>
        </div>
      </motion.div>

      {/* Lower Kiosk Reset Operational Triggers */}
      <div className="w-full max-w-md flex flex-col items-center gap-6 mb-16">
        <button
          onClick={resetGame}
          className="w-full py-6 rounded-2xl font-black text-xl uppercase tracking-widest bg-neutral-900 border-2 border-neutral-800 text-neutral-200 hover:text-white active:scale-95 hover:bg-neutral-800/60 transition-all flex items-center justify-center gap-3 shadow-lg"
        >
          Done / Next Player
          <ArrowRight className="w-5 h-5 text-neutral-500" />
        </button>

        {/* Dynamic Countdown Status Gauge Bar */}
        <div className="flex flex-col items-center gap-2 w-full px-4">
          <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 15, ease: "linear" }}
              className="h-full bg-neutral-700 rounded-full"
            />
          </div>
          <span className="text-xs font-mono font-bold tracking-widest text-neutral-600 uppercase">
            Auto-resetting in {countdown}s
          </span>
        </div>
      </div>

    </div>
  );
}