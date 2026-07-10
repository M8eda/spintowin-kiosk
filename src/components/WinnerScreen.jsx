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

    // Big burst
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.35 },
      colors,
      gravity: 0.8,
      scalar: 1.2,
    });

    // Continuous stream
    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 50,
        origin: { x: 0.1, y: 0.5 },
        colors,
        scalar: 0.8,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 50,
        origin: { x: 0.9, y: 0.5 },
        colors,
        scalar: 0.8,
      });
      confetti({
        particleCount: 1,
        angle: 90,
        spread: 80,
        origin: { x: 0.5, y: 0.25 },
        colors,
        scalar: 1,
      });

      if (Date.now() < end) {
        frameRef.current = requestAnimationFrame(frame);
      }
    };

    frameRef.current = requestAnimationFrame(frame);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <motion.div
      className="text-center px-5 w-full max-w-md"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Trophy */}
      <motion.div
        className="mb-8 inline-flex items-center justify-center w-28 h-28 rounded-full bg-amber-500/10 border-2 border-amber-400/25 shadow-[0_0_60px_rgba(255,215,0,0.2)]"
        animate={{ rotate: [0, 6, -6, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Crown className="w-12 h-12 text-amber-300" strokeWidth={1} />
      </motion.div>

      {/* Title */}
      <motion.h2
        className="text-4xl font-serif text-amber-100 mb-4 tracking-wide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Congratulations!
      </motion.h2>

      {/* Prize */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <p className="text-sm text-stone-500 tracking-[0.2em] uppercase mb-2">You won</p>
        <p className="text-3xl font-serif text-amber-300 font-bold tracking-wide">
          <Gem className="inline w-6 h-6 text-amber-400 mr-2" strokeWidth={1.5} />
          {prize}
          <Gem className="inline w-6 h-6 text-amber-400 ml-2" strokeWidth={1.5} />
        </p>
      </motion.div>

      {/* Validate button */}
      <motion.button
        onClick={onValidate}
        className="bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-900 px-14 py-5 rounded-full font-bold uppercase tracking-[0.3em] text-lg shadow-xl shadow-amber-600/30 w-full max-w-xs"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        Validate Prize
      </motion.button>

      <motion.p
        className="mt-6 text-stone-600 text-xs tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Show to staff
      </motion.p>
    </motion.div>
  );
}
