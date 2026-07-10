import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Crown, Gem } from 'lucide-react';

export default function WinnerScreen({ prize, onValidate }) {
  const frameRef = useRef(null);

  useEffect(() => {
    const duration = 4000;
    const end = Date.now() + duration;
    const colors = ['#fbbf24', '#f59e0b', '#ffffff', '#fef3c7', '#d97706'];

    confetti({ particleCount: 80, spread: 100, origin: { y: 0.35 }, colors, gravity: 0.7, scalar: 1.1 });

    const frame = () => {
      confetti({ particleCount: 2, angle: 60, spread: 45, origin: { x: 0.1, y: 0.5 }, colors, scalar: 0.7 });
      confetti({ particleCount: 2, angle: 120, spread: 45, origin: { x: 0.9, y: 0.5 }, colors, scalar: 0.7 });
      confetti({ particleCount: 1, angle: 90, spread: 70, origin: { x: 0.5, y: 0.2 }, colors, scalar: 0.9 });
      if (Date.now() < end) frameRef.current = requestAnimationFrame(frame);
    };
    frameRef.current = requestAnimationFrame(frame);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, []);

  return (
    <motion.div
      className="text-center px-5 w-full max-w-[320px]"
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        className="mb-7 inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-500/10 border-2 border-amber-400/20 shadow-[0_0_50px_rgba(255,215,0,0.15)]"
        animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Crown className="w-10 h-10 text-amber-300" strokeWidth={1} />
      </motion.div>

      <motion.h2
        className="text-3xl font-serif text-amber-100 mb-3 tracking-wide"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
      >
        Congratulations!
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45, duration: 0.35 }}
      >
        <p className="text-xs text-stone-500 tracking-[0.2em] uppercase mb-1.5">You won</p>
        <p className="text-2xl font-serif text-amber-300 font-bold tracking-wide flex items-center justify-center gap-2">
          <Gem className="w-5 h-5 text-amber-400" strokeWidth={1.5} />
          {prize}
          <Gem className="w-5 h-5 text-amber-400" strokeWidth={1.5} />
        </p>
      </motion.div>

      <motion.button
        onClick={onValidate}
        className="bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-900 px-12 py-4 rounded-full font-bold uppercase tracking-[0.3em] text-sm shadow-xl shadow-amber-600/25 w-full"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        Validate Prize
      </motion.button>

      <motion.p
        className="mt-5 text-stone-600 text-[0.6rem] tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Show to staff
      </motion.p>
    </motion.div>
  );
}
