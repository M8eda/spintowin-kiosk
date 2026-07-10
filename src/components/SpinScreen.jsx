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
const RADIUS = SIZE / 2 - 20;
const POINTER_ANGLE = 270;

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

function Segment({ prize, index, isWinning }) {
  const startAngle = index * SEG_ANGLE;
  const endAngle = startAngle + SEG_ANGLE;
  const midAngle = startAngle + SEG_ANGLE / 2;
  const pathD = describeSlice(CENTER, CENTER, RADIUS, startAngle, endAngle);
  const midRad = (midAngle * Math.PI) / 180;
  
  // emoji: inner half
  const emojiR = RADIUS * 0.52;
  const emojiX = CENTER + emojiR * Math.cos(midRad);
  const emojiY = CENTER + emojiR * Math.sin(midRad);
  
  // label: closer to edge but still readable
  const labelR = RADIUS * 0.74;
  const labelX = CENTER + labelR * Math.cos(midRad);
  const labelY = CENTER + labelR * Math.sin(midRad);

  return (
    <g>
      <defs>
        <linearGradient id={`segGrad${index}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={prize.color} />
          <stop offset="100%" stopColor={prize.accent} stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <path d={pathD} fill={`url(#segGrad${index})`} stroke={prize.accent} strokeWidth="1.5" />
      
      {isWinning && (
        <path d={pathD} fill="rgba(255,215,0,0.35)" stroke="#FBBF24" strokeWidth="4" className="winning-segment-overlay" />
      )}
      
      <text
        x={emojiX}
        y={emojiY}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="28"
        fill="white"
        fontWeight="bold"
        transform={`rotate(${midAngle}, ${emojiX}, ${emojiY})`}
        style={{ pointerEvents: 'none', filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.8))' }}
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
        fontWeight="900"
        fontFamily="'Segoe UI', Arial, sans-serif"
        letterSpacing="2"
        transform={`rotate(${midAngle}, ${labelX}, ${labelY})`}
        style={{ pointerEvents: 'none', filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.7))' }}
      >
        {prize.label.toUpperCase()}
      </text>
    </g>
  );
}

const MemoizedSegment = React.memo(Segment);

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
            r="2.5"
            fill="#FCD34D"
            stroke="#B45309"
            strokeWidth="0.5"
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: b.delay, ease: 'easeInOut' }}
          />
        );
      })}
    </g>
  );
}

function BackgroundParticles() {
  const particles = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 1 + Math.random() * 3,
    duration: 5 + Math.random() * 7,
    delay: Math.random() * 6,
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-amber-300/20"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ y: [0, 40, 0], opacity: [0, 0.5, 0], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export default function SpinScreen({ onComplete }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winningIndex, setWinningIndex] = useState(-1);
  const spinTimeoutRef = useRef(null);
  const revealTimeoutRef = useRef(null);
  const completeTimeoutRef = useRef(null);
  const mountedRef = useRef(true);
  const tickTimerRef = useRef(null);
  const segments = useMemo(() => PRIZES, []);
  const { playTick, playWin } = useSound();

  const scheduleTick = useCallback((delay) => {
    if (!mountedRef.current) return;
    tickTimerRef.current = setTimeout(() => {
      playTick();
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
    if (showResult) playWin();
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
    if (spinning || result) return;
    setSpinning(true);
    setResult(null);
    setShowResult(false);
    setWinningIndex(-1);

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
      revealTimeoutRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setShowResult(true);
        completeTimeoutRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          onComplete(prize.label);
        }, 2000);
      }, 400);
    }, SPIN_DURATION * 1000);
  }, [spinning, result, rotation, segments, onComplete]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full px-4 overflow-hidden velvet-bg" onPointerDown={!spinning && !result ? spin : undefined}>
      <BackgroundParticles />

      {/* Theatrical spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-3xl pointer-events-none z-0" />

      {/* Header – clear of pointer */}
      <motion.div 
        className="text-center mb-10 mt-2 z-20"
        animate={!spinning && !result ? { opacity: [0.6, 1, 0.6] } : {}} 
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <h2 className="text-2xl sm:text-3xl font-serif text-amber-200 tracking-[0.4em] uppercase mb-2">
          {spinning ? 'Spinning...' : result ? 'Winner!' : 'Tap to Spin'}
        </h2>
        {!result && !spinning && (
          <p className="text-[0.7rem] text-stone-500 tracking-[0.35em] uppercase">Touch anywhere on the screen</p>
        )}
      </motion.div>

      {/* Wheel container */}
      <div className="relative flex-shrink-0 w-[460px] h-[460px] max-w-[82vw] max-h-[82vw] z-10">
        {/* Outer rim */}
        <div className="absolute inset-[-16px] rounded-full border-[8px] border-amber-700/30 shadow-[0_0_80px_rgba(255,215,0,0.25)]" />
        <div className="absolute inset-[-8px] rounded-full border-2 border-amber-400/20" />
        
        {/* Pointer – reduced upward extension */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-30">
          <svg width="52" height="56" viewBox="0 0 52 56">
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
            <polygon points="26,56 0,0 52,0" fill="url(#ptrGold4)" stroke="#78350F" strokeWidth="1.5" filter="url(#ptrShadow4)" />
            <circle cx="26" cy="14" r="4" fill="#FEF3C7" stroke="#78350F" strokeWidth="1" />
          </svg>
        </div>

        <svg width="100%" height="100%" viewBox={`0 0 ${SIZE} ${SIZE}`} className="drop-shadow-2xl" style={{ overflow: 'visible' }}>
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
          <circle cx={CENTER} cy={CENTER} r={RADIUS + 6} fill="none" stroke="url(#goldRing4)" strokeWidth="7" />
          <circle cx={CENTER} cy={CENTER} r={RADIUS + 3} fill="none" stroke="#451A03" strokeWidth="1.5" opacity="0.6" />

          <g style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: `${CENTER}px ${CENTER}px`,
            transition: spinning ? `transform ${SPIN_DURATION}s cubic-bezier(0.08, 0.82, 0.14, 1)` : 'none',
            willChange: spinning ? 'transform' : 'auto',
          }}>
            {segments.map((prize, i) => (
              <MemoizedSegment key={i} prize={prize} index={i} isWinning={i === winningIndex} />
            ))}
          </g>

          <circle cx={CENTER} cy={CENTER} r={RADIUS * 0.92} fill="none" stroke="#B45309" strokeWidth="1" opacity="0.4" />
          <circle cx={CENTER} cy={CENTER} r="58" fill="#0A0A0F" stroke="url(#goldRing4)" strokeWidth="4" />
          <circle cx={CENTER} cy={CENTER} r="42" fill="url(#hubGold4)" stroke="#78350F" strokeWidth="2.5" />
          <text x={CENTER} y={CENTER + 6} textAnchor="middle" dominantBaseline="central" fontSize="34" filter="url(#glow4)">⭐</text>
        </svg>
      </div>

      {/* Result – clear of wheel bottom */}
      <div className="h-[100px] flex items-center justify-center z-10 mt-8">
        <AnimatePresence>
          {showResult && result && (
            <motion.div className="text-center" initial={{ opacity: 0, y: 15, scale: 0.85 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
              <motion.p className="text-5xl mb-2" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, delay: 0.15 }}>{result.emoji}</motion.p>
              <motion.p className="text-2xl font-serif text-amber-300 tracking-widest font-bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>{result.label}</motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
