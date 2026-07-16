import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Phone } from 'lucide-react';

const ITEMS = [
  { viewBox: '0 0 48 48', path: 'M18 2 L30 2 M22 2 L22 40 C22 42 24 44 26 44 C28 44 30 42 30 40 L30 2 M18 2 L18 40 C18 42 16 44 14 44 C12 44 10 42 10 40 L10 2 Z' },
  { viewBox: '0 0 48 48', path: 'M14 6 L34 6 C36 6 38 8 38 10 L38 34 C38 36 36 38 34 38 L14 38 C12 38 10 36 10 34 L10 10 C10 8 12 6 14 6 Z M18 2 L30 2 L30 6 L18 6 Z M16 28 L32 28' },
  { viewBox: '0 0 48 48', path: 'M16 8 L32 8 C34 8 36 10 36 12 L36 36 C36 38 34 40 32 40 L16 40 C14 40 12 38 12 36 L12 12 C12 10 14 8 16 8 Z M20 4 L28 4 L28 8 L20 8 Z M24 4 L24 0' },
  { viewBox: '0 0 48 48', path: 'M14 6 L34 6 C36 6 38 8 38 10 L38 36 C38 38 36 40 34 40 L14 40 C12 40 10 38 10 36 L10 10 C10 8 12 6 14 6 Z M18 2 L30 2 L30 6 L18 6 Z M16 28 L32 28' },
  { viewBox: '0 0 48 48', path: 'M14 6 L34 6 C36 6 38 8 38 10 L38 38 C38 40 36 42 34 42 L14 42 C12 42 10 40 10 38 L10 10 C10 8 12 6 14 6 Z M18 2 L30 2 L30 6 L18 6 Z' },
  { viewBox: '0 0 48 48', path: 'M18 10 L30 10 C32 10 34 12 34 14 L34 34 C34 36 32 38 30 38 L18 38 C16 38 14 36 14 34 L14 14 C14 12 16 10 18 10 Z M22 2 L26 2 C27 2 28 3 28 4 L28 10 L20 10 L20 4 C20 3 21 2 22 2 Z M22 -2 C22 -6 26 -6 26 -2' },
  { viewBox: '0 0 48 48', path: 'M16 4 L32 4 C34 4 36 6 36 8 L36 36 C36 38 34 40 32 40 L16 40 C14 40 12 38 12 36 L12 8 C12 6 14 4 16 4 Z M20 0 L28 0 L28 4 L20 4 Z' },
  { viewBox: '0 0 48 48', path: 'M18 6 L30 6 C32 6 34 8 34 10 L34 38 C34 40 32 42 30 42 L18 42 C16 42 14 40 14 38 L14 10 C14 8 16 6 18 6 Z M20 2 L28 2 L28 6 L20 6 Z' },
  { viewBox: '0 0 48 48', path: 'M12 12 C12 6 18 2 24 2 C30 2 36 6 36 12 L36 32 C36 38 30 42 24 42 C18 42 12 38 12 32 Z M12 16 L36 16' },
  { viewBox: '0 0 48 48', path: 'M16 8 L32 8 C34 8 36 10 36 12 L36 34 C36 36 34 38 32 38 L16 38 C14 38 12 36 12 34 L12 12 C12 10 14 8 16 8 Z M18 4 L30 4 L30 8 L18 8 Z' },
  { viewBox: '0 0 48 48', path: 'M16 10 L32 10 C34 10 36 12 36 14 L36 38 C36 40 34 42 32 42 L16 42 C14 42 12 40 12 38 L12 14 C12 12 14 10 16 10 Z M20 4 L28 4 L28 10 L20 4 Z' },
  { viewBox: '0 0 48 48', path: 'M16 10 L32 10 C34 10 36 12 36 14 L36 34 C36 36 34 38 32 38 L16 38 C14 38 12 36 12 34 L12 14 C12 12 14 10 16 10 Z M20 2 L28 2 L28 10 L20 10 Z M24 0 L24 2' },
  { viewBox: '0 0 48 48', path: 'M24 2 C14 2 6 12 6 24 C6 36 14 46 24 46 C34 46 42 36 42 24 C42 12 34 2 24 2 Z' },
  { viewBox: '0 0 48 48', path: 'M14 2 C6 2 2 8 2 16 C2 24 6 30 14 30 L34 30 C42 30 46 24 46 16 C46 8 42 2 34 2 L14 2 Z M24 2 L24 30' },
  { viewBox: '0 0 48 48', path: 'M14 6 C8 6 4 11 4 18 C4 25 8 30 14 30 L34 30 C40 30 44 25 44 18 C44 11 40 6 34 6 L14 6 Z M24 2 L24 34' },
  { viewBox: '0 0 48 48', path: 'M8 4 L40 4 C42 4 44 6 44 8 L44 40 C44 42 42 44 40 44 L8 44 C6 44 4 42 4 40 L4 8 C4 6 6 4 8 4 Z M14 16 A 4 4 0 1 0 14 24 A 4 4 0 1 0 14 16 M24 16 A 4 4 0 1 0 24 24 A 4 4 0 1 0 24 16 M34 16 A 4 4 0 1 0 34 24 A 4 4 0 1 0 34 16 M14 30 A 4 4 0 1 0 14 38 A 4 4 0 1 0 14 30 M24 30 A 4 4 0 1 0 24 38 A 4 4 0 1 0 24 30 M34 30 A 4 4 0 1 0 34 38 A 4 4 0 1 0 34 30' },
  { viewBox: '0 0 48 48', path: 'M18 8 L30 8 C32 8 34 10 34 12 L34 28 C34 30 32 32 30 32 L18 32 C16 32 14 30 14 28 L14 12 C14 10 16 8 18 8 Z M20 2 L28 2 L28 8 L20 8 Z M22 -2 C22 -6 26 -6 26 -2' },
  { viewBox: '0 0 48 48', path: 'M12 10 L36 10 C38 10 40 12 40 14 L40 34 C40 36 38 38 36 38 L12 38 C10 38 8 36 8 34 L8 14 C8 12 10 10 12 10 Z M20 2 L28 2 L28 10 L20 10 Z M16 26 L32 26' },
  { viewBox: '0 0 48 48', path: 'M8 12 L40 12 M8 20 L40 20 M8 28 L40 28 M8 36 L40 36' },
  { viewBox: '0 0 48 48', path: 'M8 6 L40 6 C42 6 44 8 44 10 L44 38 C44 40 42 42 40 42 L8 42 C6 42 4 40 4 38 L4 10 C4 8 6 6 8 6 Z M16 6 L16 42 M32 6 L32 42' },
];

function generateFallingItems(count = 20) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const icon = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    const x = Math.random() * 100;
    const duration = 10 + Math.random() * 10;
    const delay = Math.random() * 15;
    const rotate = (Math.random() - 0.5) * 30;
    const color = Math.random() > 0.3 ? 'text-red-300' : 'text-stone-300';
    const size = 28 + Math.random() * 20;
    items.push({ icon, x, duration, delay, rotate, color, size });
  }
  return items;
}

function FallingProducts() {
  const items = useMemo(() => generateFallingItems(20), []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute ${item.color}`}
          style={{ left: `${item.x}%`, top: -30, width: item.size, height: item.size, opacity: 0.35 }}
          animate={{ y: ['0vh', '110vh'], rotate: [0, item.rotate], opacity: [0.3, 0.4, 0.2] }}
          transition={{ duration: item.duration, repeat: Infinity, delay: item.delay, ease: 'linear' }}
        >
          <svg viewBox={item.icon.viewBox} width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={item.icon.path} />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

// 💥 Dynamic Cascading Triple Sonar Waves
function SonarRipples() {
  return (
    <>
      <motion.div
        className="absolute inset-0 rounded-2xl border-[4px] border-red-500/50 pointer-events-none"
        animate={{ scale: [1, 1.8], opacity: [1, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl border-[3px] border-red-400/40 pointer-events-none"
        animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-red-300/30 pointer-events-none"
        animate={{ scale: [1, 1.2], opacity: [0.6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
      />
    </>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
};

const logoVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: 'easeOut' } },
};

const dividerVariant = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const textVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function AttractScreen({ onTouch }) {
  return (
    <motion.div
      className="relative h-full w-full flex flex-col items-center justify-start cursor-pointer overflow-hidden bg-white pt-12"
      onClick={onTouch}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      role="button"
      aria-label="Enter the raffle draw - tap to begin"
      tabIndex={0}
    >
      <FallingProducts />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm px-4">
        <motion.div variants={logoVariant} className="w-full flex justify-center">
          <img src="/logo.png" alt="Delmar & Attalla Pharmacies - Luxury beauty brand" className="w-[80vw] max-w-[320px] h-auto object-contain drop-shadow-sm" />
        </motion.div>

        <motion.div className="w-16 h-1 bg-red-600 rounded-full mt-6" variants={dividerVariant} aria-hidden="true" />

        <motion.h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 text-center tracking-wide mt-6" variants={textVariant}>
          Exclusive Rewards
        </motion.h1>

        <motion.p className="text-sm sm:text-base font-sans text-stone-500 uppercase tracking-[0.3em] text-center mt-4" variants={textVariant}>
          Tap to enter the draw
        </motion.p>
      </div>

      <div className="w-full flex flex-col items-center mt-auto pb-0 px-6 -mb-6">
        <motion.div className="relative w-full max-w-[320px]" variants={textVariant}>
          
          {/* 🔥 Energetic High-Impact Kiosk Button */}
          <motion.div 
            className="relative w-full py-5 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white font-black uppercase tracking-[0.2em] text-xl flex items-center justify-center gap-3 overflow-hidden select-none border border-white/20" 
            aria-label="Start button - begin raffle entry"
            
            // Heartbeat + Jiggle Choreography Loop
            animate={{
              // Rapid pulse, small rebound, brief pause, quick shake, repeat
              scale: [1, 1.08, 0.96, 1.04, 1, 1, 1, 1],
              rotate: [0, 0, 0, 0, 0, 1.5, -1.5, 0],
              boxShadow: [
                "0 0 15px rgba(239,68,68,0.4)",
                "0 0 40px rgba(239,68,68,0.85)",
                "0 0 15px rgba(239,68,68,0.4)",
                "0 0 35px rgba(239,68,68,0.7)",
                "0 0 15px rgba(239,68,68,0.4)",
                "0 0 15px rgba(239,68,68,0.4)",
                "0 0 15px rgba(239,68,68,0.4)",
                "0 0 15px rgba(239,68,68,0.4)",
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            {/* Rapidly Cascading Sonar Rings */}
            <SonarRipples />

            {/* High-speed White Sheen Shimmer */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
              initial={{ x: "-150%" }}
              animate={{ x: "150%" }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 1.6,
                ease: "linear",
                repeatDelay: 0.8
              }}
            />

            {/* Hyper-active Sparkle Icon */}
            <motion.div
              animate={{ 
                rotate: 360, 
                scale: [1, 1.3, 1] 
              }}
              transition={{ 
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative z-10 flex items-center"
            >
              <Sparkles className="w-6 h-6 text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" aria-hidden="true" />
            </motion.div>

            <span className="relative z-10 font-sans tracking-[0.2em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              Start Now
            </span>
          </motion.div>

        </motion.div>

        <motion.div className="flex items-center gap-3 text-red-600 mt-6" variants={textVariant}>
          <Phone className="w-8 h-8" strokeWidth={1.5} aria-hidden="true" />
          <span className="text-4xl font-bold font-sans tracking-wide" aria-label="Support phone number: 19955">19955</span>
        </motion.div>
      </div>
    </motion.div>
  );
}