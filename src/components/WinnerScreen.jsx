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

// Gold icons
function GoldIngotIcon() {
  return (
    <svg width="80" height="60" viewBox="0 0 80 60" className="mx-auto">
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
    <svg width="60" height="60" viewBox="0 0 60 60" className="mx-auto">
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

// ✨ Twinkling star accent around the text
function TwinklingStar({ top, left, size, delay }) {
  return (
    <motion.svg
      className="absolute pointer-events-none z-20"
      style={{ top, left, width: size, height: size }}
      viewBox="0 0 24 24"
      fill="none"
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
        rotate: [0, 90, 180]
      }}
      transition={{
        duration: 1.8 + Math.random(),
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
    >
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="#FFF2A1" />
    </motion.svg>
  );
}

// ✨ Continuous Fine Gold Dust Waterfall
function GoldDustWaterfall() {
  const particleCount = 60; 
  return (
    <div className="absolute top-[100px] bottom-4 left-0 right-0 overflow-hidden pointer-events-none z-10">
      {Array.from({ length: particleCount }).map((_, i) => {
        const isMicro = i % 3 === 0;
        const size = isMicro ? 1.5 + Math.random() * 1.2 : 2.5 + Math.random() * 1.5;
        const xStart = 5 + Math.random() * 90; 
        const xSway = (Math.random() - 0.5) * 30; 
        const duration = 2.8 + Math.random() * 3.2;
        const delay = Math.random() * 4;
        const maxOpacity = 0.4 + Math.random() * 0.5;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${xStart}%`,
              width: size,
              height: size,
              backgroundColor: i % 2 === 0 ? '#FFF8E1' : '#F5B041',
              boxShadow: size > 2 ? '0 0 5px #FFD700, 0 0 2px #FFF' : '0 0 3px #FFD700',
            }}
            initial={{ y: 0, x: 0, opacity: 0, scale: 0.5 }}
            animate={{
              y: ['0px', '420px'], 
              x: [0, xSway, -xSway, xSway * 0.5],
              opacity: [0, maxOpacity, maxOpacity, 0], 
              scale: [0.5, 1.2, 1, 0.2],
            }}
            transition={{
              y: { duration, repeat: Infinity, ease: 'linear', delay },
              x: { duration: duration * 1.2, repeat: Infinity, ease: 'easeInOut', delay },
              opacity: { duration, repeat: Infinity, times: [0, 0.15, 0.8, 1], delay },
              scale: { duration, repeat: Infinity, delay },
            }}
          />
        );
      })}
    </div>
  );
}

export default function WinnerScreen({ prize, onValidate }) {
  const frameRef = useRef(null);
  const [flash, setFlash] = useState(true);

  const prizeIndex = PRIZES.findIndex(p => p.id === prize?.id);
  const segmentColor = prizeIndex >= 0 ? SEGMENT_COLORS[prizeIndex % SEGMENT_COLORS.length] : '#d63d73';

  // ✨ Upgraded Massive Confetti Blast
  useEffect(() => {
    const duration = 8000;
    const end = Date.now() + duration;
    // Added official red and bright white to the gold mix for a punchier contrast
    const colors = ['#BF953F', '#FCF6B5', '#B38728', '#FBF5B7', '#dc2626', '#ffffff'];

    // Initial massive explosion
    confetti({
      particleCount: 350, // Much larger count
      spread: 160,        // Wider spread covering the screen
      origin: { y: 0.35 },
      colors,
      gravity: 0.8,
      scalar: 1.2,
      startVelocity: 45,  // Shoots higher
    });

    // Secondary delayed burst for a "double pop" effect
    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.4, x: 0.5 },
        colors,
        gravity: 0.6,
        scalar: 1.1,
        startVelocity: 30,
      });
    }, 250);

    // Continuous robust side cannons
    const frame = () => {
      confetti({
        particleCount: 8, // Increased steady stream
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.7 }, // Pushed further down and to the edge
        colors,
        scalar: Math.random() > 0.5 ? 1.1 : 0.8, // Variable sizes for depth
        startVelocity: 22,
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.7 },
        colors,
        scalar: Math.random() > 0.5 ? 1.1 : 0.8,
        startVelocity: 22,
      });
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

      {/* Main Winner Card Container */}
      <motion.div
        className="relative z-20 w-full max-w-md bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] text-center flex flex-col items-center justify-between min-h-[560px] overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        role="status"
        aria-live="polite"
      >
        {/* Realistic Gold Dust Waterfall Layer */}
        <GoldDustWaterfall />

        {/* Header Badge */}
        <div className="w-full flex flex-col items-center relative z-20">
          <motion.div
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold tracking-widest uppercase mb-3 shadow-inner"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-3.5 h-3.5 fill-red-600" />
            <span>Official Winner</span>
          </motion.div>

          {/* Sparkly Gold Word Container */}
          <div className="relative w-full flex justify-center items-center py-1">
            <TwinklingStar top="-15%" left="8%" size={18} delay={0.2} />
            <TwinklingStar top="0%" left="88%" size={22} delay={0.8} />
            <TwinklingStar top="75%" left="12%" size={15} delay={1.4} />
            <TwinklingStar top="70%" left="82%" size={18} delay={0.5} />

            {/* "Congratulations!" */}
            <motion.h2
              className="text-4xl md:text-5xl font-serif font-bold tracking-tight relative z-10 leading-snug pb-3 px-2"
              style={{
                background: 'linear-gradient(135deg, #BF953F 0%, #FCF6B5 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% 200%',
                textShadow: '0 0 30px rgba(191,149,63,0.35)',
                paddingBottom: '0.18em', 
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, backgroundPosition: ['0% 50%', '100% 50%'] }}
              transition={{
                opacity: { delay: 0.3, duration: 0.5 },
                backgroundPosition: { duration: 3.5, repeat: Infinity, ease: 'linear', repeatType: 'reverse' },
              }}
            >
              Congratulations!
            </motion.h2>
          </div>
        </div>

        {/* Prize Circle */}
        <motion.div
          className="my-3 relative flex items-center justify-center w-full z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5, ease: 'out' }}
        >
          <div className="relative z-10 w-44 h-44 rounded-full shadow-[0_15px_40px_rgba(220,38,38,0.12)] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-white" />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: segmentColor }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-full" />

            {/* ✨ Floating & Pulsating Item Wrapper */}
            <motion.div 
              className="relative z-10 flex items-center justify-center w-full h-full"
              animate={{
                y: [0, -8, 0], // Floats up and down smoothly
                scale: [1, 1.1, 1], // Pulsates slowly
                filter: [
                  'drop-shadow(0px 8px 6px rgba(0,0,0,0.25))', // Stronger shadow when high
                  'drop-shadow(0px 18px 12px rgba(0,0,0,0.4))', // Bigger, softer shadow when low
                  'drop-shadow(0px 8px 6px rgba(0,0,0,0.25))'
                ]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {isGoldBar ? (
                <GoldIngotIcon />
              ) : isGoldPound ? (
                <GoldPoundIcon />
              ) : (
                <span className="text-7xl select-none" role="img" aria-label={prize?.name || 'Reward'}>
                  {prize?.emoji || '🎁'}
                </span>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Prize Name */}
        <motion.div
          className="w-full mb-6 relative z-20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs font-sans text-gray-400 tracking-[0.25em] uppercase mb-1 font-semibold">
            You Have Won
          </p>
          <motion.h3
            className="text-2xl md:text-3xl font-serif font-bold tracking-wide px-4 leading-snug"
            style={{
              color: '#dc2626',
              textShadow: '0 2px 8px rgba(220,38,38,0.3), 0 4px 20px rgba(220,38,38,0.15)',
            }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {prize?.name || 'Exclusive Reward'}
          </motion.h3>
        </motion.div>

        {/* Validate Button */}
        <motion.div className="w-full relative z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <motion.button
            onClick={onValidate}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:from-red-700 active:to-red-800 text-white font-sans font-bold uppercase tracking-[0.2em] text-lg py-5 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer shadow-[0_8px_25px_rgba(220,38,38,0.3)]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            <span>Validate Prize</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </motion.button>

          <p className="text-xs text-gray-400 mt-4 font-sans tracking-wide">
            Please show this screen to the staff to claim
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}