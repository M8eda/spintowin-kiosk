import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Crown, Gem } from 'lucide-react';

export default function WinnerScreen({ prize, onValidate }) {
  const frameRef = useRef(null);
  const [flash, setFlash] = useState(true);

  useEffect(() => {
    const duration = 4000;
    const end = Date.now() + duration;
    const colors = ['#dc2626', '#b91c1c', '#ffffff', '#ffffff', '#7f1d1d'];

    confetti({ particleCount: 100, spread: 120, origin: { y: 0.35 }, colors, gravity: 0.7, scalar: 1.2 });

    const frame = () => {
      confetti({ particleCount: 2, angle: 60, spread: 45, origin: { x: 0.1, y: 0.5 }, colors, scalar: 0.7 });
      confetti({ particleCount: 2, angle: 120, spread: 45, origin: { x: 0.9, y: 0.5 }, colors, scalar: 0.7 });
      if (Date.now() < end) frameRef.current = requestAnimationFrame(frame);
    };
    frameRef.current = requestAnimationFrame(frame);

    setTimeout(() => setFlash(false), 600);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, []);

  return (
    <>
      <AnimatePresence>
        {flash && (
          <motion.div
            className="fixed inset-0 z-20 bg-red-400/30 backdrop-blur-sm"
            initial={{ opacity: 1 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      <motion.div className="text-center px-5 w-full max-w-[320px] relative z-10"
        initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div className="mb-8 inline-flex items-center justify-center w-28 h-28 rounded-full bg-red-500/10 border-2 border-red-400/25 shadow-[0_0_60px_rgba(220,38,38,0.2)]"
          animate={{ rotate: [0, 6, -6, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Crown className="w-12 h-12 text-red-500" strokeWidth={1} />
        </motion.div>

        {/* Updated Congratulations to be Black */}
        <motion.h2 className="text-4xl font-serif text-black mb-3 tracking-wide"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
        >
          Congratulations!
        </motion.h2>

        <motion.div className="mb-10" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.4 }}>
          <p className="text-xs text-gray-500 tracking-[0.2em] uppercase mb-2">You won</p>
          <p className="text-3xl font-serif text-red-600 font-bold tracking-wide flex items-center justify-center gap-2">
            <Gem className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            {prize.name}
            <Gem className="w-5 h-5 text-red-500" strokeWidth={1.5} />
          </p>
        </motion.div>

        <motion.button onClick={onValidate}
          className="bg-red-600 text-white px-14 py-5 rounded-full font-bold uppercase tracking-[0.35em] text-sm shadow-xl w-full"
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
        >
          Validate Prize
        </motion.button>
      </motion.div>
    </>
  );
}