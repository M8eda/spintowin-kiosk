import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../hooks/useSound';

const PRIZES = [
  { label: 'Perfume', emoji: '🧴', color: '#1E1028', accent: '#F59E0B' },
  { label: 'Gift Card', emoji: '💳', color: '#0B1A30', accent: '#FBBF24' },
  { label: 'Skin Care', emoji: '✨', color: '#1A0B2E', accent: '#F59E0B' },
  { label: '10% Off', emoji: '🏷️', color: '#1A1522', accent: '#FBBF24' },
  { label: 'Sample Set', emoji: '🎁', color: '#0B1A26', accent: '#F59E0B' },
  { label: 'VIP Pass', emoji: '🎟️', color: '#150F28', accent: '#FBBF24' },
  { label: 'Gold Set', emoji: '👑', color: '#1A101E', accent: '#F59E0B' },
  { label: 'Bronze', emoji: '🥉', color: '#141A22', accent: '#FBBF24' },
];

const SEG_COUNT = PRIZES.length;
const SEG_ANGLE = 360 / SEG_COUNT;
const SPIN_DURATION = 6; // seconds
const SIZE = 400;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 12;

// --- Helper: convert polar to cartesian ---
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

  // Position the emoji and label along the mid-angle
  const midRad = ((midAngle - 90) * Math.PI) / 180;
  const emojiR = RADIUS * 0.6;
  const labelR = RADIUS * 0.8;
  const emojiX = CENTER + emojiR * Math.cos(midRad);
  const emojiY = CENTER + emojiR * Math.sin(midRad);
  const labelX = CENTER + labelR * Math.cos(midRad);
  const labelY = CENTER + labelR * Math.sin(midRad);

  return (
    <g>
      <path d={pathD} fill={prize.color} stroke={prize.accent} strokeWidth="2" />
      <text
        x={emojiX}
        y={emojiY}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="28"
        fill="white"
        fontWeight="bold"
        transform={`rotate(${midAngle}, ${emojiX}, ${emojiY})`}
        style={{ pointerEvents: 'none' }}
      >
        {prize.emoji}
      </text>
      <text
        x={labelX}
        y={labelY}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="11"
        fill={prize.accent}
        fontWeight="800"
        fontFamily="sans-serif"
        letterSpacing="1.5"
        transform={`rotate(${midAngle}, ${labelX}, ${labelY})`}
        style={{ pointerEvents: 'none' }}
      >
        {prize.label.toUpperCase()}
      </text>
    </g>
  );
}

const MemoizedSegment = React.memo(Segment);

export default function SpinScreen({ onComplete }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [rotation, setRotation] = useState(0);
  const spinTimeoutRef = useRef(null);
  const revealTimeoutRef = useRef(null);
  const completeTimeoutRef = useRef(null);
  const mountedRef = useRef(true);
  const tickTimerRef = useRef(null);
  const segments = useMemo(() => PRIZES, []);
  const { playTick, playWin } = useSound();

  // --- Tick sound that slows down ---
  const scheduleTick = useCallback((delay) => {
    if (!mountedRef.current) return;
    tickTimerRef.current = setTimeout(() => {
      playTick();
      // Increase delay gradually – simulate deceleration
      const nextDelay = delay * 1.08; // 8% increase each tick
      if (nextDelay < 400) {
        scheduleTick(nextDelay);
      }
    }, delay);
  }, [playTick]);

  useEffect(() => {
    if (spinning) {
      // Start fast ticks
      scheduleTick(40);
    } else {
      clearTimeout(tickTimerRef.current);
    }
    return () => clearTimeout(tickTimerRef.current);
  }, [spinning, scheduleTick]);

  // --- Win sound ---
  useEffect(() => {
    if (showResult) {
      playWin();
    }
  }, [showResult, playWin]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimeout(spinTimeoutRef.current);
      clearTimeout(revealTimeoutRef.current);
      clearTimeout(completeTimeoutRef.current);
      clearTimeout(tickTimerRef.current);
    };
  }, []);

  // --- Calculate winner from rotation angle ---
  const getWinnerFromRotation = useCallback((rot) => {
    // Normalize rotation to 0-360
    const normalized = ((rot % 360) + 360) % 360;
    // Pointer is at top (12 o'clock) which is 270° in standard math (0° = 3 o'clock)
    const pointerAngle = 0; // degrees
    // Winning segment index: angle of segment midpoint = index * SEG_ANGLE + SEG_ANGLE/2
    // We need: (segMid + normalized) mod 360 = pointerAngle
    // => segMid ≡ pointerAngle - normalized (mod 360)
    const segMid = ((pointerAngle - normalized) + 360) % 360;
    const idx = Math.floor(segMid / SEG_ANGLE);
    return idx % SEG_COUNT;
  }, []);

  const spin = useCallback(() => {
    if (spinning || result) return;
    setSpinning(true);
    setResult(null);
    setShowResult(false);

    // Random final rotation: several full turns + random extra
    const fullTurns = 5 + Math.floor(Math.random() * 4); // 5-8 turns
    const randomExtra = Math.random() * 360;
    const newRot = rotation + fullTurns * 360 + randomExtra;
    setRotation(newRot);

    // When spin animation ends (CSS transition duration)
    spinTimeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setSpinning(false);

      // Determine winner
      const winIdx = getWinnerFromRotation(newRot);
      const prize = segments[winIdx];
      setResult(prize);

      // Show result after a short delay
      revealTimeoutRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setShowResult(true);
        completeTimeoutRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          onComplete(prize.label);
        }, 2000);
      }, 400);
    }, SPIN_DURATION * 1000);
  }, [spinning, result, rotation, getWinnerFromRotation, segments, onComplete]);

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full px-4 gap-5 overflow-hidden"
      onPointerDown={!spinning && !result ? spin : undefined}
    >
      <motion.h2
        className="text-xl font-serif text-amber-200 tracking-[0.3em] uppercase text-center"
        animate={!spinning && !result ? { opacity: [0.5, 1, 0.5] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {spinning ? 'Spinning...' : result ? 'Winner!' : 'Tap to Spin'}
      </motion.h2>

      <div className="relative flex-shrink-0 w-[400px] h-[400px] max-w-[85vw] max-h-[85vw]">
        <div className="absolute inset-[-30px] rounded-full bg-amber-500/10 blur-2xl" />

        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30">
          <svg width="48" height="52" viewBox="0 0 48 52">
            <defs>
              <linearGradient id="ptrGold2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FCD34D" />
                <stop offset="40%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
              <filter id="ptrShadow2">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.6" />
              </filter>
            </defs>
            <polygon points="24,52 0,0 48,0" fill="url(#ptrGold2)" stroke="#78350F" strokeWidth="1.5" filter="url(#ptrShadow2)" />
          </svg>
        </div>

        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="drop-shadow-2xl"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="goldRing2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="40%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#FCD34D" />
            </linearGradient>
            <radialGradient id="hubGold2" cx="45%" cy="45%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="30%" stopColor="#FBBF24" />
              <stop offset="70%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </radialGradient>
          </defs>

          <circle cx={CENTER} cy={CENTER} r={RADIUS + 4} fill="none" stroke="url(#goldRing2)" strokeWidth="5" />

          <g style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: `${CENTER}px ${CENTER}px`,
            transition: spinning ? `transform ${SPIN_DURATION}s cubic-bezier(0.08, 0.82, 0.14, 1)` : 'none',
            willChange: spinning ? 'transform' : 'auto',
          }}>
            {segments.map((prize, i) => (
              <MemoizedSegment key={i} prize={prize} index={i} />
            ))}
          </g>

          <circle cx={CENTER} cy={CENTER} r="52" fill="#0A0A0F" stroke="url(#goldRing2)" strokeWidth="3" />
          <circle cx={CENTER} cy={CENTER} r="38" fill="url(#hubGold2)" stroke="#78350F" strokeWidth="2" />
          <text x={CENTER} y={CENTER + 4} textAnchor="middle" dominantBaseline="central" fontSize="28" fill="url(#hubGold2)" filter="drop-shadow(0 0 4px #000)">⭐</text>
        </svg>
      </div>

      <div className="h-[60px] flex items-center justify-center">
        <AnimatePresence>
          {showResult && result && (
            <motion.div className="text-center" initial={{ opacity: 0, y: 15, scale: 0.85 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
              <motion.p className="text-4xl mb-1" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.4, delay: 0.15 }}>{result.emoji}</motion.p>
              <motion.p className="text-xl font-serif text-amber-300 tracking-widest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>{result.label}</motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

