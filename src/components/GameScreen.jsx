import { motion } from 'framer-motion';
import PrizeWheel from './PrizeWheel';

export default function GameScreen({ onSpinComplete }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2
        className="text-rose-200 text-2xl font-serif mb-12 tracking-widest uppercase"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        Spin to Reveal
      </motion.h2>
      <PrizeWheel onSpinComplete={onSpinComplete} />
    </motion.div>
  );
}