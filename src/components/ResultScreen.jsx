import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export default function ResultScreen({ prize, onRestart }) {
  // Fire confetti on mount
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#FFD700', '#FF3366', '#FFFFFF'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#FFD700', '#FF3366', '#FFFFFF'],
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();
  }, []);

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.h2
        className="text-5xl font-serif text-rose-200 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        You Won: {prize}!
      </motion.h2>

      <motion.button
        onClick={onRestart}
        className="bg-rose-500 text-stone-900 px-12 py-4 rounded-full font-bold uppercase tracking-widest text-lg min-h-[60px]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        Validate Prize
      </motion.button>
    </motion.div>
  );
}