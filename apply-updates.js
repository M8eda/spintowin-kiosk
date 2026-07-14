// apply-updates.js
import { writeFileSync } from 'fs';
import { join } from 'path';

// ------------------------------------------------------
// AttractScreen – lift bottom section higher
// ------------------------------------------------------
const attractScreenPath = join(process.cwd(), 'src', 'components', 'AttractScreen.jsx');
const attractContent = `import { useMemo } from 'react';
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

function SonarRipples() {
  return (
    <>
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-red-400/30"
        animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border border-red-400/20"
        animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
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
      className="relative h-full w-full flex flex-col items-center justify-between cursor-pointer overflow-hidden bg-white"
      onClick={onTouch}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <FallingProducts />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />

      {/* Main content – centered in upper portion */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm px-4">
        <motion.div variants={logoVariant} className="w-full flex justify-center">
          <img src="/logo.png" alt="Delmar & Attalla Pharmacies" className="w-[80vw] max-w-[320px] h-auto object-contain drop-shadow-sm" />
        </motion.div>

        <motion.div className="w-16 h-1 bg-red-600 rounded-full mt-6" variants={dividerVariant} />

        <motion.h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 text-center tracking-wide mt-6" variants={textVariant}>
          Exclusive Rewards
        </motion.h1>

        <motion.p className="text-sm sm:text-base font-sans text-stone-500 uppercase tracking-[0.3em] text-center mt-4" variants={textVariant}>
          Tap to enter the draw
        </motion.p>
      </div>

      {/* Bottom group – lifted upward with pb-36 */}
      <div className="w-full flex flex-col items-center pb-36 px-6">
        {/* CTA Button */}
        <motion.div
          className="relative w-full max-w-[320px]"
          variants={textVariant}
        >
          <div className="relative py-5 rounded-2xl bg-red-600 text-white font-bold uppercase tracking-widest text-lg flex items-center justify-center gap-3 shadow-[0_8px_20px_rgba(220,38,38,0.3)] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <SonarRipples />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none" />
            <Sparkles className="w-5 h-5 relative z-10" />
            <span className="relative z-10 font-sans">Start Now</span>
          </div>
        </motion.div>

        {/* Hotline */}
        <motion.div
          className="flex items-center gap-3 text-red-600 mt-6"
          variants={textVariant}
        >
          <Phone className="w-8 h-8" strokeWidth={1.5} />
          <span className="text-4xl font-bold font-sans tracking-wide">19955</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
`;

writeFileSync(attractScreenPath, attractContent, 'utf8');
console.log('AttractScreen updated – bottom section lifted with pb-36.');

// ------------------------------------------------------
// SpinScreen – push header logo down
// ------------------------------------------------------
const spinScreenPath = join(process.cwd(), 'src', 'components', 'SpinScreen.jsx');
const spinContent = `// VERSION: v9-HEADER-SPACING
import { useState, useEffect, useRef } from 'react';
import { useGame, PRIZES } from '../context/GameContext';
import { useSound } from '../hooks/useSound';

export default function SpinScreen({ onComplete }) {
  const { state } = useGame();
  const { playTick, playWin } = useSound();
  const [isSpinning, setIsSpinning] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef(null);
  const needleRef = useRef(null);
  const rotationRef = useRef(0);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const tickStepRef = useRef(0);

  const handleSpin = () => {
    if (isSpinning) return;

    let selectedPrize;
    const session = state.activeSession;
    const deck = session ? state.sessionDecks[session] : null;

    if (session && deck && deck.length > 0) {
      selectedPrize = deck[0];
    } else {
      const totalWeight = PRIZES.reduce((sum, p) => sum + p.weight, 0);
      let random = Math.random() * totalWeight;
      for (const prize of PRIZES) {
        if (random < prize.weight) {
          selectedPrize = prize;
          break;
        }
        random -= prize.weight;
      }
    }
    if (!selectedPrize) selectedPrize = PRIZES[0];

    setIsSpinning(true);
    setProgress(0);
    playTick();

    const prizeIndex = PRIZES.findIndex(p => p.id === selectedPrize.id);
    const arc = (2 * Math.PI) / PRIZES.length;
    const segmentCenterAngle = prizeIndex * arc + arc / 2;
    const targetNeedleAngle = 3 * Math.PI / 2;
    const extraSpins = 5 * 2 * Math.PI;
    const targetRotation = targetNeedleAngle - segmentCenterAngle + extraSpins;

    const startRotation = rotationRef.current;
    const distance = targetRotation - (startRotation % (2 * Math.PI));
    const duration = 5000;
    startTimeRef.current = performance.now();
    tickStepRef.current = arc;
    let lastTickAngle = startRotation;

    const animate = (now) => {
      const elapsed = now - startTimeRef.current;
      const prog = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - prog, 3);
      const current = startRotation + distance * easeOut;
      rotationRef.current = current;

      setProgress(Math.floor(prog * 100));

      if (Math.abs(current - lastTickAngle) >= tickStepRef.current) {
        playTick();
        lastTickAngle = current;
        if (needleRef.current) {
          needleRef.current.style.transform = 'translateX(-50%) rotate(-18deg)';
          setTimeout(() => {
            if (needleRef.current) {
              needleRef.current.style.transform = 'translateX(-50%) rotate(0deg)';
            }
          }, 60);
        }
      }

      if (prog < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setProgress(100);
        playWin();
        setTimeout(() => {
          onComplete(selectedPrize);
        }, 1000);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    let renderId;
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        renderId = requestAnimationFrame(draw);
        return;
      }
      const ctx = canvas.getContext('2d');
      const size = canvas.width;
      const radius = size / 2;
      const arc = (2 * Math.PI) / PRIZES.length;
      const rotation = rotationRef.current;

      ctx.clearRect(0, 0, size, size);
      ctx.imageSmoothingEnabled = true;

      PRIZES.forEach((prize, i) => {
        ctx.save();
        const angle = rotation + i * arc;
        ctx.beginPath();
        ctx.fillStyle = prize.color;
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius - 20, angle, angle + arc);
        ctx.lineTo(radius, radius);
        ctx.fill();

        ctx.translate(radius, radius);
        ctx.rotate(angle + arc / 2);

        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 4;
        ctx.font = '30px "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(prize.emoji, radius * 0.65, -15);

        const label = prize.name.replace('Reward ', '').toUpperCase();
        ctx.font = '700 10px "Montserrat", sans-serif';
        ctx.shadowBlur = 3;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(label, radius * 0.65, 20);

        ctx.restore();
      });

      for (let i = 0; i < PRIZES.length; i++) {
        const angle = rotation + i * arc;
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.lineTo(radius + (radius - 20) * Math.cos(angle), radius + (radius - 20) * Math.sin(angle));
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.45)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 6;
      ctx.beginPath();
      ctx.arc(radius, radius, radius - 11, 0, 2 * Math.PI);
      const rimGrad = ctx.createRadialGradient(radius, radius, radius - 22, radius, radius, radius);
      rimGrad.addColorStop(0, '#7f1d1d');
      rimGrad.addColorStop(0.2, '#dc2626');
      rimGrad.addColorStop(0.5, '#fca5a5');
      rimGrad.addColorStop(0.8, '#dc2626');
      rimGrad.addColorStop(1, '#450a0a');
      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = 28;
      ctx.stroke();
      ctx.restore();

      const numLights = 24;
      const lightRadius = 4;
      const timeFactor = Math.floor(performance.now() / 180);
      for (let i = 0; i < numLights; i++) {
        const lightAngle = (i * 2 * Math.PI) / numLights;
        const x = radius + (radius - 11) * Math.cos(lightAngle);
        const y = radius + (radius - 11) * Math.sin(lightAngle);
        ctx.beginPath();
        ctx.arc(x, y, lightRadius, 0, 2 * Math.PI);
        const isLightOn = (i + timeFactor) % 2 === 0;
        if (isLightOn) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, y, lightRadius - 1.5, 0, 2 * Math.PI);
          ctx.fillStyle = '#fecaca';
          ctx.fill();
        } else {
          ctx.fillStyle = '#450a0a';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, y, lightRadius - 1.5, 0, 2 * Math.PI);
          ctx.fillStyle = '#7f1d1d';
          ctx.fill();
        }
      }

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;
      ctx.beginPath();
      ctx.arc(radius, radius, 36, 0, 2 * Math.PI);
      const hubGrad = ctx.createRadialGradient(radius, radius, 0, radius, radius, 36);
      hubGrad.addColorStop(0, '#fca5a5');
      hubGrad.addColorStop(0.3, '#dc2626');
      hubGrad.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = hubGrad;
      ctx.fill();
      ctx.restore();

      ctx.beginPath();
      ctx.arc(radius, radius, 28, 0, 2 * Math.PI);
      ctx.fillStyle = '#1c1917';
      ctx.fill();
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#fca5a5';
      ctx.font = '900 14px "Montserrat", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SPIN', radius, radius);

      renderId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(renderId);
  }, []);

  return (
    <div
      className="relative min-h-screen flex flex-col items-center bg-gradient-to-b from-white via-white to-stone-50 overflow-hidden"
      onClick={handleSpin}
    >
      {/* Header – pushed down with mt-24 */}
      <header className="min-h-[120px] w-full flex flex-col items-center justify-center pt-4 pb-2 mt-24 sm:mt-28">
        <img
          src="/logo.png"
          alt="Logo"
          className="max-h-[80px] w-auto object-contain mb-3 animate-pulse drop-shadow-lg"
        />
        <p className="text-sm sm:text-base font-serif text-stone-500 tracking-wider">
          Spin to Reveal Your Reward
        </p>
      </header>

      {/* Main – wheel */}
      <main className="flex-1 flex items-center justify-center relative w-full">
        <div className="relative w-[340px] h-[340px] sm:w-[450px] sm:h-[450px] md:w-[500px] md:h-[500px] flex items-center justify-center z-10">
          <div
            ref={needleRef}
            className="absolute top-[-25px] left-1/2 -translate-x-1/2 z-20 w-16 h-20 filter drop-shadow-[0_8px_6px_rgba(0,0,0,0.55)] transition-transform duration-75 origin-[30px_18px]"
          >
            <svg viewBox="0 0 60 80" width="100%" height="100%">
              <defs>
                <linearGradient id="needlered" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fca5a5" />
                  <stop offset="35%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#b91c1c" />
                </linearGradient>
                <radialGradient id="pegred" cx="50%" cy="30%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#7f1d1d" />
                </radialGradient>
                <linearGradient id="pointerRed" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff4b4b" />
                  <stop offset="100%" stopColor="#b30000" />
                </linearGradient>
              </defs>
              <path d="M 30,15 L 42,15 L 34,70 C 32,76 28,76 26,70 L 18,15 Z" fill="url(#needlered)" stroke="#450a0a" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M 28,52 L 32,52 L 30,72 Z" fill="url(#pointerRed)" />
              <circle cx="30" cy="18" r="12" fill="url(#pegred)" stroke="#450a0a" strokeWidth="1.5" />
              <circle cx="30" cy="18" r="5" fill="#1c1917" stroke="#fca5a5" strokeWidth="1" />
            </svg>
          </div>
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            className="w-full h-full rounded-full shadow-2xl"
          />
        </div>
      </main>

      {/* Footer */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[80%] max-w-sm">
        <p className="text-xs text-stone-500 mb-2 text-center font-medium tracking-widest uppercase">
          {isSpinning ? 'Processing Reward...' : 'Tap anywhere to spin'}
        </p>
        <div className="w-full h-2 rounded-full bg-stone-200/80 backdrop-blur-sm shadow-inner overflow-hidden bg-white/50 backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-red-800 rounded-full transition-all duration-200 ease-out shadow-[0_0_6px_rgba(220,38,38,0.5)]"
            style={{ width: \`\${progress}%\` }}
          />
        </div>
      </div>
    </div>
  );
}
`;

writeFileSync(spinScreenPath, spinContent, 'utf8');
console.log('SpinScreen updated – header moved down with mt-24.');