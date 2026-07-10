import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Gem, Sparkles } from 'lucide-react';

function Particles() {
  const items = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    top: `${5 + Math.random() * 90}%`,
    size: 2 + Math.random() * 5,
    duration: 3 + Math.random() * 5,
    delay: Math.random() * 4,
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {items.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-br from-amber-300/50 to-yellow-400/30"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ y: [-12, 12, -12], opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
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
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <Particles />

      {/* Rotating gem logo */}
      <motion.div className="mb-8" animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}>
        <div className="w-20 h-20 rounded-full border-2 border-amber-400/30 flex items-center justify-center bg-amber-500/10 shadow-[0_0_60px_rgba(255,215,0,0.15)]">
          <Gem className="w-9 h-9 text-amber-300" strokeWidth={1} />
        </div>
      </motion.div>

      <motion.h1
        className="text-[14vw] sm:text-[4.5rem] leading-[0.85] font-serif font-thin tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-200 to-amber-500 text-center px-6"
        animate={{ scale: [1, 1.012, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        PARKVILLE
      </motion.h1>

      <motion.p
        className="text-[2.8vw] sm:text-xs uppercase tracking-[0.6em] sm:tracking-[0.8em] text-amber-500/50 font-light mt-2"
        animate={{ opacity: [0.2, 0.65, 0.2] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        Luxury Beauty Experience
      </motion.p>

      {/* Glowing CTA button */}
      <motion.div
        className="absolute bottom-[10%]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          className="relative px-10 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-900 font-bold uppercase tracking-[0.35em] text-sm shadow-[0_0_40px_rgba(255,215,0,0.3)] flex items-center gap-2"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Sparkles className="w-4 h-4" />
          Touch to Begin
          <Sparkles className="w-4 h-4" />
        </motion.div>
        <div className="flex justify-center mt-4 gap-1.5">
          <motion.div className="w-1.5 h-6 rounded-full bg-amber-400/50" animate={{ scaleY: [0.6, 1.8, 0.6], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <motion.div className="w-1.5 h-4 rounded-full bg-amber-400/30" animate={{ scaleY: [0.6, 1.6, 0.6], opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} />
        </div>
      </motion.div>
    </motion.div>
  );
}
