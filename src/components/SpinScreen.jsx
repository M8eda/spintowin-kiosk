import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PRIZES = [
  { label: 'Perfume', icon: '🧴', color: '#1a1025', accent: '#d4a853' },
  { label: 'Gift Card', icon: '💳', color: '#0f1a2e', accent: '#c9a84c' },
  { label: 'Skin Care', icon: '✨', color: '#1a0a2e', accent: '#e2b84c' },
  { label: '10% Off', icon: '🏷️', color: '#1a1520', accent: '#b8953a' },
  { label: 'Sample Set', icon: '🎁', color: '#0f1a25', accent: '#d4a843' },
  { label: 'VIP Pass', icon: '🎟️', color: '#150f25', accent: '#c9a04c' },
  { label: 'Gold Set', icon: '👑', color: '#1a1018', accent: '#e2b04c' },
  { label: 'Bronze', icon: '🥉', color: '#151a20', accent: '#c89838' },
];

const SEG_COUNT = PRIZES.length;
const SEG_ANGLE = 360 / SEG_COUNT;
const SPIN_TIME = 5500;

export default function SpinScreen({ onComplete }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const wheelRef = useRef(null);
  const timeoutRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const spin = useCallback(() => {
    if (spinning || result) return;
    setSpinning(true);
    setResult(null);
    setShowResult(false);

    const idx = Math.floor(Math.random() * PRIZES.length);
    const target = idx * SEG_ANGLE + SEG_ANGLE / 2;
    const spins = 7 * 360;
    const newRot = rotation + spins + (360 - target);
    setRotation(newRot);

    timeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setResult(PRIZES[idx]);
      setSpinning(false);
      setTimeout(() => {
        if (!mountedRef.current) return;
        setShowResult(true);
        setTimeout(() => {
          if (!mountedRef.current) return;
          onComplete(PRIZES[idx].label);
        }, 2000);
      }, 300);
    }, SPIN_TIME);
  }, [spinning, result, rotation, onComplete]);

  const size = 320;
  const center = size / 2;
  const radius = size / 2 - 8;

  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full h-full px-4 gap-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onClick={!spinning && !result ? spin : undefined}
    >
      {/* Title */}
      <motion.h2
        className="text-xl font-serif text-amber-200 tracking-[0.3em] uppercase text-center"
        animate={!spinning && !result ? { opacity: [0.5, 1, 0.5] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {spinning ? 'Spinning...' : result ? 'Winner!' : 'Tap to Spin'}
      </motion.h2>

      {/* Wheel Container */}
      <div className="relative" ref={wheelRef}>
        {/* Golden outer glow */}
        <div className="absolute inset-[-24px] rounded-full animate-golden-glow" />

        {/* Outer decorative ring */}
        <div className="absolute inset-[-8px] rounded-full border-[3px] border-amber-500/40 shadow-[0_0_30px_rgba(255,215,0,0.2)]" />
        <div className="absolute inset-[-14px] rounded-full border border-amber-300/20" />

        {/* Pointer */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30">
          <svg width="36" height="44" viewBox="0 0 36 44">
            <defs>
              <linearGradient id="pointerGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <filter id="pointerShadow">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.5" />
              </filter>
            </defs>
            <polygon
              points="18,44 0,0 36,0"
              fill="url(#pointerGold)"
              stroke="#78350f"
              strokeWidth="1"
              filter="url(#pointerShadow)"
            />
          </svg>
        </div>

        {/* Wheel SVG */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="drop-shadow-2xl"
        >
          <defs>
            {/* Gold gradient for segments */}
            <linearGradient id="goldBorder" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            {/* Hub gradient */}
            <radialGradient id="hubGold" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="40%" stopColor="#fbbf24" />
              <stop offset="80%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>
            {/* Sparkle filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer gold ring */}
          <circle
            cx={center}
            cy={center}
            r={radius + 2}
            fill="none"
            stroke="url(#goldBorder)"
            strokeWidth="4"
          />

          {/* Segments group */}
          <g
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: `${center}px ${center}px`,
              transition: spinning
                ? `transform ${SPIN_TIME}ms cubic-bezier(0.08, 0.82, 0.14, 1)`
                : 'none',
            }}
          >
            {PRIZES.map((prize, i) => {
              const startAngle = i * SEG_ANGLE;
              const endAngle = startAngle + SEG_ANGLE;
              const startRad = ((startAngle - 90) * Math.PI) / 180;
              const endRad = ((endAngle - 90) * Math.PI) / 180;

              const x1 = center + radius * Math.cos(startRad);
              const y1 = center + radius * Math.sin(startRad);
              const x2 = center + radius * Math.cos(endRad);
              const y2 = center + radius * Math.sin(endRad);
              const largeArc = SEG_ANGLE > 180 ? 1 : 0;

              const midAngle = (startAngle + endAngle) / 2;
              const midRad = ((midAngle - 90) * Math.PI) / 180;
              const textR = radius * 0.58;
              const tx = center + textR * Math.cos(midRad);
              const ty = center + textR * Math.sin(midRad);

              return (
                <g key={i}>
                  {/* Segment */}
                  <path
                    d={`M${center},${center} L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`}
                    fill={prize.color}
                    stroke={prize.accent}
                    strokeWidth="1.5"
                  />
                  {/* Inner gold line */}
                  <path
                    d={`M${center},${center} L${center + (radius * 0.15) * Math.cos(startRad)},${center + (radius * 0.15) * Math.sin(startRad)}`}
                    stroke={prize.accent}
                    strokeWidth="0.8"
                    opacity="0.5"
                  />
                  {/* Icon */}
                  <text
                    x={tx}
                    y={ty - 8}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="18"
                    filter="url(#glow)"
                  >
                    {prize.icon}
                  </text>
                  {/* Label */}
                  <text
                    x={tx}
                    y={ty + 14}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={prize.accent}
                    fontSize="8"
                    fontWeight="700"
                    fontFamily="sans-serif"
                    letterSpacing="1.5"
                    opacity="0.9"
                  >
                    {prize.label.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Hub outer ring */}
          <circle cx={center} cy={center} r="38" fill="#0a0a0f" stroke="url(#goldBorder)" strokeWidth="3" />
          {/* Hub inner */}
          <circle cx={center} cy={center} r="28" fill="url(#hubGold)" stroke="#78350f" strokeWidth="1.5" />
          {/* Star in hub */}
          <text
            x={center}
            y={center + 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="20"
            filter="url(#glow)"
          >
            ⭐
          </text>
        </svg>
      </div>

      {/* Result reveal */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <motion.p
              className="text-5xl mb-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {result.icon}
            </motion.p>
            <motion.p
              className="text-2xl font-serif text-amber-300 tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {result.label}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
