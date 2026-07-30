import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight } from 'lucide-react';
import { PRIZES } from '../context/GameContext';

// Same segment colours as the wheel
const SEGMENT_COLORS = [
  '#d63d73',
  '#4c9e38',
  '#016ba7',
  '#6b3e93',
  '#1e9a9a',
  '#f6a21c',
  '#c51f2b',
];

function GoldIngotIcon() {
  return (
    <svg width="80" height="60" viewBox="0 0 80 60" className="drop-shadow-md mx-auto">
      <defs>
        <linearGradient id="ingotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE875" />
          <stop offset="30%" stopColor="#F5B041" />
          <stop offset="70%" stopColor="#D35400" />
          <stop offset="100%" stopColor="#873B00" />
        </linearGradient>
      </defs>
      <path d="M15 10 L65 10 L72 50 L8 50 Z" fill="url(#ingotGrad)" stroke="#713F12" strokeWidth="2" strokeLinejoin="round" />
      <line x1="15" y1="10" x2="65" y2="10" stroke="#FFFFFF" strokeWidth="2" />
      <text x="40" y="32" textAnchor="middle" dominantBaseline="central" fill="#713F12" fontSize="10" fontWeight="800" fontFamily="Montserrat,sans-serif">999.9</text>
    </svg>
  );
}

function GoldPoundIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" className="drop-shadow-md mx-auto">
      <defs>
        <linearGradient id="poundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF59D" />
          <stop offset="30%" stopColor="#F5B041" />
          <stop offset="70%" stopColor="#CA8A04" />
          <stop offset="100%" stopColor="#713F12" />
        </linearGradient>
        <radialGradient id="poundInner" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFFDE7" />
          <stop offset="60%" stopColor="#F5B041" />
          <stop offset="100%" stopColor="#A47A0F" />
        </radialGradient>
      </defs>
      <circle cx="30" cy="30" r="24" fill="url(#poundGrad)" stroke="#713F12" strokeWidth="1.5" />
      <circle cx="30" cy="30" r="19" fill="url(#poundInner)" stroke="#713F12" strokeWidth="0.8" />
      <text x="30" y="36" textAnchor="middle" dominantBaseline="central" fill="#713F12" fontSize="20" fontWeight="bold" fontFamily="Montserrat,sans-serif">£</text>
    </svg>
  );
}

export default function WinnerScreen({ prize, onValidate }) {
  const frameRef = useRef(null);
  const [flash, setFlash] = useState(true);

  const prizeIndex = PRIZES.findIndex(p => p.id === prize?.id);
  const segmentColor = prizeIndex >= 0 ? SEGMENT_COLORS[prizeIndex % SEGMENT_COLORS.length] : '#d63d73';

  useEffect(() => {
    const duration = 4000;
    const end = Date.now() + duration;
    const colors = ['#dc2626', '#991b1b', '#ef4444', '#ffffff', '#000000'];

    confetti({ particleCount: 120, spread: 100, origin: { y: 0.4 }, colors, gravity: 0.8, scalar: 1.2 });

    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0.05, y: 0.6 }, colors, scalar: 0.8 });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 0.95, y: 0.6 }, colors, scalar: 0.8 });
      if (Date.now() < end) frameRef.current = requestAnimationFrame(frame);
    };
    frameRef.current = requestAnimationFrame(frame);

    const timer = setTimeout(() => setFlash(false), 500);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      clearTimeout(timer);
    };
  }, []);

  const prizeName = prize?.name?.toLowerCase() || '';
  const isGoldBar = prizeName.includes('gold bar');
  const isGoldPound = prizeName.includes('gold pound');

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white via-gray-50/50 to-white select-none p-6" style={{ height: '100dvh' }}>
      <AnimatePresence>
        {flash && (
          <motion.div
            className="fixed inset-0 z-30 bg-red-600/20 backdrop-blur-md"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      <div className="absolute w-[500px] h-[500px] bg-red-600/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <motion.div
        className="relative z-20 w-full max-w-md bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] text-center flex flex-col items-center justify-between min-h-[560px]"
        initial={{ opacity: 0, scale: 0.9, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        role="status"
        aria-live="polite"
        aria-label={`Congratulations! You won ${prize?.name}`}
      >
        {/* Header badge */}
        <div className="w-full flex flex-col items-center">
          <motion.div
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold tracking-widest uppercase mb-4 shadow-inner"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-3.5 h-3.5 fill-red-600" />
            <span>Official Winner</span>
          </motion.div>

          {/* Glowing text only – no border or lights */}
          <motion.h2
            className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-amber-400 to-red-600 animate-gradient-x"
            style={{
              textShadow: '0 0 12px rgba(220,38,38,0.4), 0 0 40px rgba(220,38,38,0.2)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Congratulations!
          </motion.h2>
        </div>

        {/* Prize circle with delayed colour fill */}
        <motion.div
          className="my-4 relative flex items-center justify-center w-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5, ease: 'out' }}
        >
          <div className="relative z-10 w-44 h-44 rounded-full shadow-[0_15px_40px_rgba(220,38,38,0.12)] flex items-center justify-center overflow-hidden">
            {/* White background – visible first */}
            <div className="absolute inset-0 bg-white" />
            {/* Coloured fill – grows from center with a longer duration and delay */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: segmentColor }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            />
            {/* Inner subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-full" />

            {/* Icon on top */}
            <div className="relative z-10 flex items-center justify-center w-full h-full">
              {isGoldBar ? (
                <GoldIngotIcon />
              ) : isGoldPound ? (
                <GoldPoundIcon />
              ) : (
                <span className="text-7xl drop-shadow-md select-none" role="img" aria-label={prize?.name || 'Reward'}>
                  {prize?.emoji || '🎁'}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Prize name */}
        <motion.div
          className="w-full mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs font-sans text-gray-400 tracking-[0.25em] uppercase mb-1 font-semibold">
            You Have Won
          </p>
          <h3 className="text-2xl md:text-3xl font-serif text-red-600 font-bold tracking-wide px-4 leading-snug">
            {prize?.name || 'Exclusive Reward'}
          </h3>
        </motion.div>

        {/* Validate button */}
        <motion.div className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <motion.button
            onClick={onValidate}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:from-red-700 active:to-red-800 text-white font-sans font-bold uppercase tracking-[0.2em] text-lg py-5 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer"
            animate={{
              scale: [1, 1.04, 1],
              boxShadow: [
                '0 8px 25px rgba(220,38,38,0.25)',
                '0 8px 45px rgba(220,38,38,0.5)',
                '0 8px 25px rgba(220,38,38,0.25)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            aria-label={`Validate ${prize?.name || 'prize'}`}
          >
            <span>Validate Prize</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </motion.button>

          <p className="text-xs text-gray-400 mt-4 font-sans tracking-wide">
            Please show this screen to the staff to claim
          </p>
        </motion.div>
      </motion.div>

      {/* Tailwind custom animations (only gradient‑x is needed now) */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 2s ease infinite;
        }
      `}</style>
    </div>
  );
}