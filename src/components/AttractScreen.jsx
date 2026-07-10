import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';

function FloatingGems() {
  const gems = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: `${10 + Math.random() * 80}%`,
        top: `${10 + Math.random() * 80}%`,
        size: 4 + Math.random() * 8,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 5,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {gems.map((g) => (
        <motion.div
          key={g.id}
          className="absolute"
          style={{ left: g.left, top: g.top, width: g.size, height: g.size }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.6, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: g.duration,
            repeat: Infinity,
            delay: g.delay,
            ease: 'easeInOut',
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
        </motion.div>
      ))}
    </div>
  );
}

export default function AttractScreen({ onTouch }) {
  return (
    <motion.div
      className="relative h-full w-full flex flex-col items-center justify-center cursor-pointer px-6"
      onClick={onTouch}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <FloatingGems />

      {/* Logo */}
      <motion.div
        className="mb-10"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-24 h-24 rounded-full border-2 border-amber-400/30 flex items-center justify-center bg-gradient-to-br from-amber-500/10 to-yellow-500/5 backdrop-blur-sm shadow-[0_0_60px_rgba(255,215,0,0.15)]">
          <Gem className="w-10 h-10 text-amber-300" strokeWidth={1} />
        </div>
      </motion.div>

      {/* Brand */}
      <motion.h1
        className="text-[5rem] leading-none font-serif font-thin tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-500"
        animate={{ scale: [1, 1.015, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        PARKVILLE
      </motion.h1>

      <motion.p
        className="mt-4 text-xs uppercase tracking-[0.6em] text-amber-500/60 font-light"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        Luxury Beauty
      </motion.p>

      {/* CTA */}
      <motion.div
        className="mt-16 flex flex-col items-center gap-5"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="px-8 py-3 rounded-full border border-amber-400/30 bg-amber-500/5 backdrop-blur">
          <motion.p
            className="text-base uppercase tracking-[0.4em] text-amber-300/80 font-light"
            whileHover={{ scale: 1.03 }}
          >
            Touch to Begin
          </motion.p>
        </div>
        <motion.div className="flex flex-col items-center gap-1.5">
          <motion.div
            className="w-1 h-6 rounded-full bg-amber-400/50"
            animate={{ scaleY: [1, 1.8, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="w-1 h-4 rounded-full bg-amber-400/30"
            animate={{ scaleY: [1, 1.5, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.3, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
