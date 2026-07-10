import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';

function Particles() {
  const items = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${8 + Math.random() * 84}%`,
    top: `${8 + Math.random() * 84}%`,
    size: 3 + Math.random() * 6,
    duration: 3 + Math.random() * 5,
    delay: Math.random() * 4,
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-br from-amber-300 to-yellow-500"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ y: [-15, 15, -15], opacity: [0.15, 0.55, 0.15], scale: [1, 1.3, 1] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export default function AttractScreen({ onTouch }) {
  return (
    <motion.div
      className="h-full w-full flex flex-col items-center justify-center gap-8 px-6 cursor-pointer"
      onClick={onTouch}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Particles />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="w-20 h-20 rounded-full border-2 border-amber-400/25 flex items-center justify-center bg-amber-500/5 shadow-[0_0_50px_rgba(255,215,0,0.12)]"
      >
        <Gem className="w-8 h-8 text-amber-300" strokeWidth={1} />
      </motion.div>

      <div className="text-center">
        <motion.h1
          className="text-[4.5rem] leading-[0.9] font-serif font-thin tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-200 to-amber-500"
          animate={{ scale: [1, 1.012, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          PARKVILLE
        </motion.h1>
        <motion.p
          className="text-[0.7rem] uppercase tracking-[0.7em] text-amber-500/50 font-light mt-2"
          animate={{ opacity: [0.25, 0.65, 0.25] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Luxury Beauty Experience
        </motion.p>
      </div>

      <motion.div
        className="flex flex-col items-center gap-4"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="px-7 py-2.5 rounded-full border border-amber-400/25 bg-amber-500/5">
          <span className="text-sm uppercase tracking-[0.4em] text-amber-300/80 font-light">
            Touch to Begin
          </span>
        </div>
        <motion.div
          className="w-1 h-8 rounded-full bg-amber-400/40"
          animate={{ scaleY: [0.6, 1.6, 0.6], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
}
