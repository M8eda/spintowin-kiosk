import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Gem, Sparkles } from 'lucide-react';

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
                ? 'radial-gradient(circle, rgba(255,215,0,0.7) 0%, rgba(255,180,0,0.2) 100%)'
                : p.color === 'yellow'
                ? 'radial-gradient(circle, rgba(255,240,0,0.6) 0%, rgba(255,200,0,0.2) 100%)'
                : 'radial-gradient(circle, rgba(255,200,0,0.5) 0%, rgba(255,220,100,0.2) 100%)',
            boxShadow: '0 0 8px rgba(255,215,0,0.4)',
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 30, 0],
            y: [0, (Math.random() - 0.5) * 30, 0],
            opacity: [0.2, 0.7, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            x: { duration: p.durationX, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: p.durationY, repeat: Infinity, ease: 'easeInOut', delay: p.delay * 0.3 },
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
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <Particles />

      {/* Central glow behind gem – centered */}
      <motion.div
        className="absolute left-1/2 top-[calc(50%-6rem)] w-40 h-40 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Rotating gem logo */}
      <motion.div
        className="mb-8 sm:mb-10 z-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-amber-400/40 flex items-center justify-center bg-amber-500/15 shadow-[0_0_80px_rgba(255,215,0,0.2)] backdrop-blur-sm">
          <Gem className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300" strokeWidth={1} />
        </div>
      </motion.div>

      {/* Brand name – smaller on mobile */}
      <motion.h1
        className="text-[12vw] sm:text-[4.5rem] leading-[0.9] font-serif font-thin tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-200 to-amber-500 text-center px-6 z-10"
        animate={{ scale: [1, 1.015, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        PARKVILLE
      </motion.h1>

      {/* Decorative line – centered */}
      <motion.div
        className="mx-auto w-16 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mt-5 mb-3 z-10"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Tagline */}
      <motion.p
        className="text-[2.5vw] sm:text-sm uppercase tracking-[0.6em] sm:tracking-[0.8em] text-amber-400/60 font-light z-10"
        animate={{ opacity: [0.2, 0.7, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        Luxury Beauty Experience
      </motion.p>

      {/* CTA Section */}
      <motion.div
        className="absolute bottom-[10%] sm:bottom-[12%] flex flex-col items-center gap-4 sm:gap-5 z-10"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          className="relative px-10 py-3.5 sm:px-12 sm:py-4 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-900 font-bold uppercase tracking-[0.35em] sm:tracking-[0.4em] text-sm sm:text-base shadow-[0_0_50px_rgba(255,215,0,0.4)] flex items-center gap-2 sm:gap-3"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          Touch to Begin
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.div>

        {/* Indicator dots */}
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
