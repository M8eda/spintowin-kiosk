import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Gem, Sparkles } from 'lucide-react';

// Staggered entrance variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

function Particles() {
  const items = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 6,
    durationX: 4 + Math.random() * 6,
    durationY: 5 + Math.random() * 5,
    delay: Math.random() * 5,
    color: i % 3 === 0 ? 'amber' : i % 3 === 1 ? 'yellow' : 'gold',
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {items.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background:
              p.color === 'amber'
                ? 'radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(255,180,0,0.25) 100%)'
                : p.color === 'yellow'
                ? 'radial-gradient(circle, rgba(255,240,0,0.7) 0%, rgba(255,200,0,0.2) 100%)'
                : 'radial-gradient(circle, rgba(255,200,0,0.6) 0%, rgba(255,220,100,0.25) 100%)',
            boxShadow: '0 0 10px rgba(255,215,0,0.5)',
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 25, 0],
            y: [0, (Math.random() - 0.5) * 25, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            x: { duration: p.durationX, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: p.durationY, repeat: Infinity, ease: 'easeInOut', delay: p.delay * 0.2 },
            opacity: { duration: 3 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 4 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      ))}
    </div>
  );
}

export default function AttractScreen({ onTouch }) {
  return (
    <motion.div
      className="relative h-full w-full flex flex-col items-center justify-center cursor-pointer overflow-hidden"
      onClick={onTouch}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
    >
      <Particles />

      {/* Soft radial glow behind gem */}
      <div className="absolute left-1/2 top-[calc(50%-7rem)] w-44 h-44 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/3 via-transparent to-amber-900/5 pointer-events-none" />

      {/* Central content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="mb-4"
          variants={itemVariants}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-24 h-24 rounded-full border-2 border-amber-400/30 flex items-center justify-center bg-amber-500/10 backdrop-blur-sm shadow-[0_0_80px_rgba(255,215,0,0.15)] ring-1 ring-amber-400/20">
            <Gem className="w-10 h-10 text-amber-300" strokeWidth={1} />
          </div>
        </motion.div>

        <motion.h1
          className="text-[13vw] sm:text-[4.5rem] leading-[0.85] font-serif font-thin tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-200 to-amber-500 text-center px-6"
          variants={itemVariants}
        >
          PARKVILLE
        </motion.h1>

        <motion.div
          className="mx-auto w-16 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent -mt-2"
          variants={itemVariants}
        />

        <motion.p
          className="text-[2.5vw] sm:text-sm uppercase tracking-[0.6em] sm:tracking-[0.8em] text-amber-400/60 font-light -mt-2"
          variants={itemVariants}
        >
          Luxury Beauty Experience
        </motion.p>
      </motion.div>

      {/* CTA – Larger, breathing glow */}
      <motion.div
        className="absolute bottom-[10%] sm:bottom-[12%] flex flex-col items-center gap-5 z-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          className="relative px-12 py-4 sm:px-14 sm:py-5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-900 font-bold uppercase tracking-[0.35em] sm:tracking-[0.4em] text-base sm:text-lg flex items-center gap-3 overflow-hidden ring-1 ring-amber-300/30"
          animate={{
            scale: [1, 1.03, 1],
            boxShadow: [
              '0 0 50px rgba(255,215,0,0.4)',
              '0 0 80px rgba(255,215,0,0.7)',
              '0 0 50px rgba(255,215,0,0.4)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.06, boxShadow: '0 0 100px rgba(255,215,0,0.9)' }}
          whileTap={{ scale: 0.94 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
          <span className="relative z-10">Touch to Begin</span>
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
        </motion.div>

        <div className="flex gap-2">
          <motion.div
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400/60"
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <motion.div
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400/60"
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 0.3 }}
          />
          <motion.div
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400/60"
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 0.6 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
