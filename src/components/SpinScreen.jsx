import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
const SPIN_DURATION = 5.5;
const SIZE = 320;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 8;

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return `M${cx},${cy} L${start.x},${start.y} A${r},${r} 0 ${largeArc} 0 ${end.x},${end.y} Z`;
}

function Segment({ prize, index }) {
  const startAngle = index * SEG_ANGLE;
  const endAngle = startAngle + SEG_ANGLE;
  const midAngle = startAngle + SEG_ANGLE / 2;
  const pathD = describeArc(CENTER, CENTER, RADIUS, startAngle, endAngle);
  const midRad = ((midAngle - 90) * Math.PI) / 180;
  const textR = RADIUS * 0.58;
  const tx = CENTER + textR * Math.cos(midRad);
  const ty = CENTER + textR * Math.sin(midRad);

  return (
    <g transform={`rotate(${startAngle}, ${CENTER}, ${CENTER})`}>
      <path d={pathD} fill={prize.color} stroke={prize.accent} strokeWidth="1.5" />
      <line x1={CENTER} y1={CENTER} x2={CENTER + RADIUS * 0.15} y2={CENTER} stroke={prize.accent} strokeWidth="0.8" opacity="0.5" />
      <text x={tx} y={ty - 8} textAnchor="middle" dominantBaseline="central" fontSize="18" filter="url(#segmentGlow)">{prize.icon}</text>
      <text x={tx} y={ty + 14} textAnchor="middle" dominantBaseline="central" fill={prize.accent} fontSize="8" fontWeight="700" fontFamily="sans-serif" letterSpacing="1.5" opacity="0.9">{prize.label.toUpperCase()}</text>
    </g>
  );
}

export default function SpinScreen({ onComplete }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [rotation, setRotation] = useState(0);
  const spinTimeoutRef = useRef(null);
  const revealTimeoutRef = useRef(null);
  const completeTimeoutRef = useRef(null);
  const mountedRef = useRef(true);

  const segments = useMemo(() => PRIZES, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimeout(spinTimeoutRef.current);
      clearTimeout(revealTimeoutRef.current);
      clearTimeout(completeTimeoutRef.current);
    };
  }, []);

  const spin = useCallback(() => {
    if (spinning || result) return;
    setSpinning(true);
    setResult(null);
    setShowResult(false);

    const idx = Math.floor(Math.random() * segments.length);
    const target = idx * SEG_ANGLE + SEG_ANGLE / 2;
    const spins = 7 * 360;
    const newRotation = rotation + spins + (360 - target);
    setRotation(newRotation);

    spinTimeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setResult(segments[idx]);
      setSpinning(false);
      revealTimeoutRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setShowResult(true);
        completeTimeoutRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          onComplete(segments[idx].label);
        }, 2000);
      }, 300);
    }, SPIN_DURATION * 1000);
  }, [spinning, result, rotation, segments, onComplete]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full h-full px-4 gap-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onPointerDown={!spinning && !result ? spin : undefined}
    >
      <motion.h2
        className="text-xl font-serif text-amber-200 tracking-[0.3em] uppercase text-center"
        animate={!spinning && !result ? { opacity: [0.5, 1, 0.5] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {spinning ? 'Spinning...' : result ? 'Winner!' : 'Tap to Spin'}
      </motion.h2>

      <div className="relative">
        <div className="absolute inset-[-24px] rounded-full animate-golden-glow" />
        <div className="absolute inset-[-8px] rounded-full border-[3px] border-amber-500/40 shadow-[0_0_30px_rgba(255,215,0,0.2)]" />
        <div className="absolute inset-[-14px] rounded-full border border-amber-300/20" />

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
            <polygon points="18,44 0,0 36,0" fill="url(#pointerGold)" stroke="#78350f" strokeWidth="1" filter="url(#pointerShadow)" />
          </svg>
        </div>

        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="drop-shadow-2xl">
          <defs>
            <linearGradient id="goldBorder" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <radialGradient id="hubGold" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="40%" stopColor="#fbbf24" />
              <stop offset="80%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>
            <filter id="segmentGlow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx={CENTER} cy={CENTER} r={RADIUS + 2} fill="none" stroke="url(#goldBorder)" strokeWidth="4" />

          <g
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: `${CENTER}px ${CENTER}px`,
              transition: spinning ? `transform ${SPIN_DURATION}s cubic-bezier(0.08, 0.82, 0.14, 1)` : 'none',
              willChange: spinning ? 'transform' : 'auto',
            }}
          >
            {segments.map((prize, i) => (
              <Segment key={i} prize={prize} index={i} />
            ))}
          </g>

          <circle cx={CENTER} cy={CENTER} r="38" fill="#0a0a0f" stroke="url(#goldBorder)" strokeWidth="3" />
          <circle cx={CENTER} cy={CENTER} r="28" fill="url(#hubGold)" stroke="#78350f" strokeWidth="1.5" />
          <text x={CENTER} y={CENTER + 2} textAnchor="middle" dominantBaseline="central" fontSize="20" filter="url(#segmentGlow)">⭐</text>
        </svg>
      </div>

      <AnimatePresence>
        {showResult && result && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <motion.p className="text-5xl mb-2" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, delay: 0.2 }}>{result.icon}</motion.p>
            <motion.p className="text-2xl font-serif text-amber-300 tracking-widest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>{result.label}</motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
