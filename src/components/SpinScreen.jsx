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
const SPIN_DURATION = 6;
const SIZE = 460;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 22;
const POINTER_ANGLE = 270;

// Refined easing for heavier mechanical settle – long tail with subtle overshoot
const MECHANICAL_EASE = [0.0, 0.75, 0.15, 1.02];

function describeSlice(cx, cy, r, startAngle, endAngle) {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`;
}

// ---------------------------------------------------------------------
// Segment
// ---------------------------------------------------------------------
function Segment({ prize, index, isWinning, isAnticipating }) {
  const startAngle = index * SEG_ANGLE;
  const endAngle = startAngle + SEG_ANGLE;
  const midAngle = startAngle + SEG_ANGLE / 2;
  const pathD = describeSlice(CENTER, CENTER, RADIUS, startAngle, endAngle);
  const midRad = (midAngle * Math.PI) / 180;
  const emojiR = RADIUS * 0.52;
  const emojiX = CENTER + emojiR * Math.cos(midRad);
  const emojiY = CENTER + emojiR * Math.sin(midRad);
  const labelR = RADIUS * 0.74;
  const labelX = CENTER + labelR * Math.cos(midRad);
  const labelY = CENTER + labelR * Math.sin(midRad);

  return (
    <g>
      <defs>
        <linearGradient id={`segGrad${index}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={prize.color} />
          <stop offset="35%" stopColor={prize.accent} stopOpacity="0.25" />
          <stop offset="65%" stopColor={prize.accent} stopOpacity="0.1" />
          <stop offset="100%" stopColor={prize.color} />
        </linearGradient>
        <filter id={`emboss${index}`}>
          <feDropShadow dx="0.5" dy="0.5" stdDeviation="1.5" floodColor="#fff" floodOpacity="0.08" />
        </filter>
      </defs>

      <path d={pathD} fill={`url(#segGrad${index})`} stroke={prize.accent} strokeWidth="1.2" filter={`url(#emboss${index})`} />

      {isWinning && !isAnticipating && (
        <path d={pathD} fill="rgba(255,255,255,0.1)" stroke="#FBBF24" strokeWidth="3" className="winning-segment-overlay" />
      )}

      {isWinning && isAnticipating && (
        <path d={pathD} fill="rgba(255,255,255,0.2)" stroke="#FFF" strokeWidth="4" className="anticipation-glow" />
      )}

      <text x={emojiX} y={emojiY} textAnchor="middle" dominantBaseline="central" fontSize="28" fill="white" fontWeight="bold" transform={`rotate(${midAngle}, ${emojiX}, ${emojiY})`} style={{ pointerEvents: 'none', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.9))' }}>
        {prize.emoji}
      </text>

      <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="central" fontSize="12" fill={prize.accent} fontWeight="900" fontFamily="'Cormorant Garamond', serif" letterSpacing="2.5" transform={`rotate(${midAngle}, ${labelX}, ${labelY})`} stroke="rgba(0,0,0,0.5)" strokeWidth="0.8" paintOrder="stroke" style={{ pointerEvents: 'none', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.7))' }}>
        {prize.label.toUpperCase()}
      </text>
    </g>
  );
}

const MemoizedSegment = React.memo(Segment);

// ---------------------------------------------------------------------
// Bead Ring (unchanged)
// ---------------------------------------------------------------------
function BeadRing() {
  const beads = useMemo(() => Array.from({ length: 36 }, (_, i) => ({
    angle: (i * 360) / 36,
    delay: Math.random() * 2,
  })), []);

  return (
    <g>
      {beads.map((b, i) => {
        const rad = (b.angle * Math.PI) / 180;
        const bx = CENTER + (RADIUS + 12) * Math.cos(rad);
        const by = CENTER + (RADIUS + 12) * Math.sin(rad);
        return (
          <motion.circle
            key={i}
            cx={bx}
            cy={by}
            r="3"
            fill="#FCD34D"
            stroke="#B45309"
            strokeWidth="0.8"
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: b.delay, ease: 'easeInOut' }}
          />
        );
      })}
    </g>
  );
}

// ---------------------------------------------------------------------
// Sparkle burst (unchanged)
// ---------------------------------------------------------------------
function Sparkles({ active }) {
  const sparkles = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
    id: i,
    angle: Math.random() * 360,
    distance: 100 + Math.random() * 200,
    size: 2 + Math.random() * 6,
    duration: 0.8 + Math.random() * 1.2,
    delay: Math.random() * 0.3,
  })), []);

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {sparkles.map(s => {
        const rad = (s.angle * Math.PI) / 180;
        const x = Math.cos(rad) * s.distance;
        const y = Math.sin(rad) * s.distance;
        return (
          <motion.div
            key={s.id}
            className="absolute left-1/2 top-1/2 rounded-full bg-yellow-300"
            style={{ width: s.size, height: s.size, boxShadow: '0 0 8px #FBBF24' }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{ x, y, opacity: 0, scale: 1.5 }}
            transition={{ duration: s.duration, delay: s.delay, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------
// Main SpinScreen
// ---------------------------------------------------------------------
export default function SpinScreen({ onComplete }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winningIndex, setWinningIndex] = useState(-1);
  const [sparkleActive, setSparkleActive] = useState(false);
  const [anticipating, setAnticipating] = useState(false);

  // Pointer jolt: toggle key to replay animation on each tick
  const [tickJolt, setTickJolt] = useState(0);

  const spinTimeoutRef = useRef(null);
  const revealTimeoutRef = useRef(null);
  const completeTimeoutRef = useRef(null);
  const mountedRef = useRef(true);
  const tickTimerRef = useRef(null);
  const segments = useMemo(() => PRIZES, []);
  const { playTick, playWin } = useSound();

  // Schedule tick with pointer jolt trigger
  const scheduleTick = useCallback((delay) => {
    if (!mountedRef.current) return;
    tickTimerRef.current = setTimeout(() => {
      playTick();
      setTickJolt(prev => prev + 1); // triggers pointer animation refresh
      const nextDelay = delay * 1.08;
      if (nextDelay < 400) scheduleTick(nextDelay);
    }, delay);
  }, [playTick]);

  useEffect(() => {
    if (spinning) scheduleTick(40);
    else clearTimeout(tickTimerRef.current);
    return () => clearTimeout(tickTimerRef.current);
  }, [spinning, scheduleTick]);

  useEffect(() => {
    if (showResult) {
      playWin();
      setSparkleActive(true);
      setTimeout(() => setSparkleActive(false), 1500);
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

  const spin = useCallback(() => {
    if (spinning || result || anticipating) return;
    setSpinning(true);
    setResult(null);
    setShowResult(false);
    setWinningIndex(-1);
    setSparkleActive(false);
    setAnticipating(false);

    const winIdx = Math.floor(Math.random() * segments.length);
    const prize = segments[winIdx];
    const segMid = winIdx * SEG_ANGLE + SEG_ANGLE / 2;
    let targetRotation = (POINTER_ANGLE - segMid + 360) % 360;
    const fullTurns = (5 + Math.floor(Math.random() * 4)) * 360;
    const newRotation = rotation + fullTurns + targetRotation;
    setRotation(newRotation);

    spinTimeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setSpinning(false);
      setWinningIndex(winIdx);
      setResult(prize);
      setAnticipating(true);

      revealTimeoutRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setAnticipating(false);
        setShowResult(true);
        completeTimeoutRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          onComplete(prize.label);
        }, 2000);
      }, 1000);
    }, SPIN_DURATION * 1000);
  }, [spinning, result, anticipating, rotation, segments, onComplete]);

  return (
    <div
      className="relative flex flex-col items-center justify-around h-full w-full px-4 overflow-hidden velvet-bg py-8"
      onPointerDown={!spinning && !result && !anticipating ? spin : undefined}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none z-0" />

      <AnimatePresence>
        {anticipating && (
          <motion.div
            className="absolute inset-0 z-30 anticipation-dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <div className="text-center mt-2 mb-4 z-50">
        <h2 className="text-3xl sm:text-4xl playfair tracking-[0.3em] uppercase mb-2 text-amber-200">
          {spinning ? 'Spinning...' : anticipating ? '' : result ? 'Winner!' : 'Tap to Spin'}
        </h2>
        {!result && !spinning && !anticipating && (
          <p className="text-[0.75rem] text-stone-400 tracking-[0.35em] uppercase cormorant">Touch anywhere on the screen</p>
        )}
      </div>

      {/* Wheel wrapper – idle breathing + anticipation pulse */}
      <motion.div
        className="relative z-10"
        animate={
          anticipating
            ? { scale: 1.03 } // dramatic anticipation scale
            : !spinning && !result
            ? { scale: [1, 1.015, 1], rotate: [0, 0.3, 0] }
            : {}
        }
        transition={
          anticipating
            ? { duration: 0.5, ease: 'easeOut' }
            : { duration: 5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <div className="relative w-[460px] h-[460px] max-w-[80vw] max-h-[80vw]">
          <div className="absolute inset-[-20px] rounded-full rim-light" />

          {/* Pointer – precise peg jolt using tick sound */}
          <motion.div
            className="absolute top-4 left-1/2 -translate-x-1/2 z-30"
            key={tickJolt} // remounts on each tick, resets animation
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 4, -4, 0] }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
          >
            <svg width="56" height="60" viewBox="0 0 56 60">
              <defs>
                <linearGradient id="ptrGold4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FEF3C7" />
                  <stop offset="30%" stopColor="#FCD34D" />
                  <stop offset="70%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#92400E" />
                </linearGradient>
                <filter id="ptrShadow4">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.7" />
                </filter>
              </defs>
              <polygon points="28,60 0,0 56,0" fill="url(#ptrGold4)" stroke="#78350F" strokeWidth="1.5" filter="url(#ptrShadow4)" />
              <circle cx="28" cy="16" r="5" fill="#FEF3C7" stroke="#78350F" strokeWidth="1" />
            </svg>
          </motion.div>

          <svg width="100%" height="100%" viewBox={`0 0 ${SIZE} ${SIZE}`} className="drop-shadow-2xl relative z-10" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="goldRing4" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FCD34D" />
                <stop offset="30%" stopColor="#D97706" />
                <stop offset="70%" stopColor="#FCD34D" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
              <radialGradient id="hubGold4" cx="45%" cy="45%">
                <stop offset="0%" stopColor="#FEF3C7" />
                <stop offset="25%" stopColor="#FBBF24" />
                <stop offset="65%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#78350F" />
              </radialGradient>
              <filter id="glow4">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            <BeadRing />
            <circle cx={CENTER} cy={CENTER} r={RADIUS + 6} fill="none" stroke="url(#goldRing4)" strokeWidth="8" />
            <circle cx={CENTER} cy={CENTER} r={RADIUS + 3} fill="none" stroke="#451A03" strokeWidth="2" opacity="0.5" />

            <g style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: `${CENTER}px ${CENTER}px`,
              transition: spinning ? `transform ${SPIN_DURATION}s cubic-bezier(${MECHANICAL_EASE.join(',')})` : 'none',
              willChange: spinning ? 'transform' : 'auto',
            }}>
              {segments.map((prize, i) => (
                <MemoizedSegment key={i} prize={prize} index={i} isWinning={i === winningIndex} isAnticipating={anticipating} />
              ))}
            </g>

            <circle cx={CENTER} cy={CENTER} r={RADIUS * 0.88} fill="none" stroke="#B45309" strokeWidth="1.5" opacity="0.35" />

            <circle cx={CENTER} cy={CENTER} r="64" fill="#0A0A0F" stroke="url(#goldRing4)" strokeWidth="4" />
            <circle cx={CENTER} cy={CENTER} r="54" fill="url(#hubGold4)" stroke="#78350F" strokeWidth="2.5" className={spinning ? 'hub-pulse' : ''} />
            <circle cx={CENTER} cy={CENTER} r="54" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="3" />
            <text x={CENTER} y={CENTER + 6} textAnchor="middle" dominantBaseline="central" fontSize="36" filter="url(#glow4)">⭐</text>
          </svg>
        </div>
      </motion.div>

      <Sparkles active={sparkleActive} />

      <div className="text-center mb-2 mt-4 z-10">
        <AnimatePresence>
          {showResult && result && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <motion.p className="text-6xl mb-3" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, delay: 0.2 }}>
                {result.emoji}
              </motion.p>
              <motion.h3
                className="text-3xl sm:text-4xl cormorant tracking-widest text-amber-200 drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {result.label}
              </motion.h3>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
