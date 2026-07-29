import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame, PRIZES } from '../context/GameContext';
import { useSound } from '../hooks/useSound';

// Helper to split long prize names into two lines
function getSplitLabel(name) {
  switch (name) {
    case 'Quarter-gram Gold Bar':
      return ['Quarter-gram', 'Gold Bar'];
    case 'Half-gram Gold Bar':
      return ['Half-gram', 'Gold Bar'];
    case 'Gold Pound (Coin)':
      return ['Gold Pound', '(Coin)'];
    case 'Shopping Voucher 500 EGP':
      return ['Shopping Voucher', ' 500 EGP'];
    default:
      return [name, ''];
  }
}

// Custom drawing for Gold Ingot (used by gold bars)
function drawGoldIngot(ctx, x, y, w, h) {
  ctx.save();
  ctx.translate(x, y);
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 2;

  ctx.beginPath();
  ctx.moveTo(-w * 0.35, -h/2);
  ctx.lineTo(w * 0.35, -h/2);
  ctx.lineTo(w * 0.5, h/2);
  ctx.lineTo(-w * 0.5, h/2);
  ctx.closePath();

  const goldGrad = ctx.createLinearGradient(-w/2, -h/2, w/2, h/2);
  goldGrad.addColorStop(0, '#FFE875');
  goldGrad.addColorStop(0.3, '#F5B041');
  goldGrad.addColorStop(0.7, '#D35400');
  goldGrad.addColorStop(1, '#873B00');
  ctx.fillStyle = goldGrad;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-w * 0.35, -h/2);
  ctx.lineTo(w * 0.35, -h/2);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = 'rgba(113, 63, 18, 0.9)';
  ctx.font = '800 7px "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('999.9', 0, 1);
  ctx.restore();
}

// Custom drawing for Gold Pound coin
function drawGoldPound(ctx, x, y, r) {
  ctx.save();
  ctx.translate(x, y);
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 2;

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, 2 * Math.PI);
  const goldGrad = ctx.createLinearGradient(-r, -r, r, r);
  goldGrad.addColorStop(0, '#FFF59D');
  goldGrad.addColorStop(0.3, '#F5B041');
  goldGrad.addColorStop(0.7, '#CA8A04');
  goldGrad.addColorStop(1, '#713F12');
  ctx.fillStyle = goldGrad;
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.beginPath();
  ctx.arc(0, 0, r - 2.5, 0, 2 * Math.PI);
  ctx.strokeStyle = '#713F12';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, r - 4.5, 0, 2 * Math.PI);
  const innerGrad = ctx.createRadialGradient(-2, -2, 0, 0, 0, r - 4.5);
  innerGrad.addColorStop(0, '#FFFDE7');
  innerGrad.addColorStop(0.6, '#F5B041');
  innerGrad.addColorStop(1, '#A47A0F');
  ctx.fillStyle = innerGrad;
  ctx.fill();

  ctx.fillStyle = '#713F12';
  ctx.font = 'bold 13px "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('£', 0, 0);
  ctx.restore();
}

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
    const session = state?.activeSession;
    const deck = session ? state?.sessionDecks?.[session] : null;

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
          needleRef.current.style.transform = 'rotate(-16deg)';
          setTimeout(() => {
            if (needleRef.current) {
              needleRef.current.style.transform = 'rotate(0deg)';
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
        setTimeout(() => onComplete(selectedPrize), 1000);
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
    const dpr = window.devicePixelRatio || 1;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        renderId = requestAnimationFrame(draw);
        return;
      }

      const ctx = canvas.getContext('2d');
      // Set up high-DPI canvas dimensions once
      if (canvas.width !== 500 * dpr || canvas.height !== 500 * dpr) {
        canvas.width = 500 * dpr;
        canvas.height = 500 * dpr;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        ctx.scale(dpr, dpr);
      }

      const size = 500; // logical size
      const radius = size / 2;
      const arc = (2 * Math.PI) / PRIZES.length;
      const rotation = rotationRef.current;

      ctx.clearRect(0, 0, size, size);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const timeFactor = Math.floor(performance.now() / 180);

      // Draw wheel sectors
      PRIZES.forEach((prize, i) => {
        ctx.save();
        const angle = rotation + i * arc;
        const isSegmentGlowing = (i + timeFactor) % 2 === 0;

        ctx.beginPath();
        ctx.fillStyle = prize.color;
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius - 24, angle, angle + arc);
        ctx.lineTo(radius, radius);
        ctx.fill();

        const sectorGrad = ctx.createRadialGradient(radius, radius, 20, radius, radius, radius - 24);
        sectorGrad.addColorStop(0, 'rgba(255,255,255,0.15)');
        sectorGrad.addColorStop(1, 'rgba(0,0,0,0.3)');
        ctx.fillStyle = sectorGrad;
        ctx.fill();

        if (isSegmentGlowing) {
          const glowGrad = ctx.createRadialGradient(radius, radius, radius * 0.4, radius, radius, radius - 24);
          glowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
          glowGrad.addColorStop(0.6, 'rgba(255, 254, 215, 0.12)');
          glowGrad.addColorStop(1, 'rgba(254, 240, 138, 0.35)');
          ctx.fillStyle = glowGrad;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(radius, radius, radius - 26, angle, angle + arc);
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 3.5;
          ctx.shadowColor = '#eab308';
          ctx.shadowBlur = 8;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        ctx.translate(radius, radius);
        ctx.rotate(angle + arc / 2);

        const prizeNameLower = prize.name.toLowerCase();

        if (prizeNameLower.includes('gold bar')) {
          drawGoldIngot(ctx, radius * 0.62, -14, 38, 22);
        } else if (prizeNameLower.includes('gold pound')) {
          drawGoldPound(ctx, radius * 0.62, -14, 15);
        } else {
          ctx.shadowColor = 'rgba(0,0,0,0.4)';
          ctx.shadowBlur = 6;
          ctx.font = '32px "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(prize.emoji, radius * 0.62, -14);
        }

        const [line1, line2] = getSplitLabel(prize.name);
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '800 10px "Montserrat", sans-serif';
        ctx.textAlign = 'center';

        if (line2) {
          ctx.fillText(line1, radius * 0.62, 16);
          ctx.fillText(line2, radius * 0.62, 30);
        } else {
          ctx.fillText(line1, radius * 0.62, 22);
        }

        ctx.restore();
      });

      // Sector divider lines
      for (let i = 0; i < PRIZES.length; i++) {
        const angle = rotation + i * arc;
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.lineTo(radius + (radius - 24) * Math.cos(angle), radius + (radius - 24) * Math.sin(angle));
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Outer bezel rim
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 8;
      ctx.beginPath();
      ctx.arc(radius, radius, radius - 12, 0, 2 * Math.PI);
      const rimGrad = ctx.createRadialGradient(radius, radius, radius - 24, radius, radius, radius);
      rimGrad.addColorStop(0, '#450a0a');
      rimGrad.addColorStop(0.15, '#b91c1c');
      rimGrad.addColorStop(0.5, '#fca5a5');
      rimGrad.addColorStop(0.85, '#dc2626');
      rimGrad.addColorStop(1, '#450a0a');
      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = 24;
      ctx.stroke();
      ctx.restore();

      // Perimeter lights & pegs
      const numElements = 24;
      const lightingFactor = Math.floor(performance.now() / 200);
      for (let i = 0; i < numElements; i++) {
        const elementAngle = (i * 2 * Math.PI) / numElements;
        const x = radius + (radius - 12) * Math.cos(elementAngle);
        const y = radius + (radius - 12) * Math.sin(elementAngle);
        if (i % 2 === 0) {
          const isLightOn = ((i / 2) + lightingFactor) % 2 === 0;
          ctx.beginPath();
          ctx.arc(x, y, 4.5, 0, 2 * Math.PI);
          if (isLightOn) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#fef08a';
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
            ctx.fillStyle = '#fde047';
            ctx.fill();
          } else {
            ctx.fillStyle = '#450a0a';
            ctx.shadowBlur = 0;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, 2 * Math.PI);
            ctx.fillStyle = '#991b1b';
            ctx.fill();
          }
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, 3.5, 0, 2 * Math.PI);
          const pegGrad = ctx.createRadialGradient(x - 1, y - 1, 0, x, y, 3.5);
          pegGrad.addColorStop(0, '#fef08a');
          pegGrad.addColorStop(0.5, '#eab308');
          pegGrad.addColorStop(1, '#713f12');
          ctx.fillStyle = pegGrad;
          ctx.shadowColor = 'rgba(0,0,0,0.6)';
          ctx.shadowBlur = 3;
          ctx.fill();
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.restore();
        }
      }

      // Center hub
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 6;
      ctx.beginPath();
      ctx.arc(radius, radius, 42, 0, 2 * Math.PI);
      const goldGrad = ctx.createLinearGradient(radius - 42, radius - 42, radius + 42, radius + 42);
      goldGrad.addColorStop(0, '#fef08a');
      goldGrad.addColorStop(0.5, '#ca8a04');
      goldGrad.addColorStop(1, '#713f12');
      ctx.fillStyle = goldGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(radius, radius, 36, 0, 2 * Math.PI);
      const hubGrad = ctx.createRadialGradient(radius - 10, radius - 10, 0, radius, radius, 36);
      hubGrad.addColorStop(0, '#fca5a5');
      hubGrad.addColorStop(0.3, '#dc2626');
      hubGrad.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = hubGrad;
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 15px "Montserrat", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText('SPIN', radius, radius);

      renderId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(renderId);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-b from-white via-stone-50/50 to-stone-100 overflow-hidden select-none">
      <header className="flex-1 flex flex-col items-center justify-center px-4">
        <motion.img
          src="/logo.png"
          alt="Logo"
          className="max-h-[80px] sm:max-h-[100px] w-auto object-contain mb-3 drop-shadow-md"
          animate={{
            y: [0, -6, 0],
            filter: [
              'drop-shadow(0 4px 6px rgba(0,0,0,0.08))',
              'drop-shadow(0 10px 15px rgba(220,38,38,0.25))',
              'drop-shadow(0 4px 6px rgba(0,0,0,0.08))'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <p className="text-xs sm:text-sm font-serif font-semibold text-stone-600 tracking-[0.25em] uppercase">
          Spin to Reveal Your Reward
        </p>
      </header>

      <main className="flex-shrink-0 flex items-center justify-center px-6">
        <div
          onClick={handleSpin}
          className="relative w-full max-w-[400px] aspect-square flex items-center justify-center z-10 group"
        >
          <div className="absolute top-[-5.5%] left-1/2 -translate-x-1/2 z-20 w-[14%] h-[20%] pointer-events-none">
            <div
              ref={needleRef}
              className="w-full h-full filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.45)] transition-transform duration-75 ease-out"
              style={{ transformOrigin: '50% 22.5%', transform: 'rotate(0deg)' }}
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
                <circle cx="30" cy="18" r="4.5" fill="#1c1917" stroke="#fef08a" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            className="w-full h-full rounded-full shadow-[0_25px_60px_rgba(0,0,0,0.22)] cursor-pointer transition-transform duration-300 group-hover:scale-[1.01] active:scale-[0.98]"
            // No width/height attributes – handled by DPI scaling
          />
        </div>
      </main>

      <footer className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="w-full max-w-[320px]">
          <p className="text-xs text-stone-500 mb-3 text-center font-bold tracking-[0.2em] uppercase">
            {isSpinning ? 'Processing Reward...' : 'Tap wheel to spin'}
          </p>
          <div className="w-full h-3.5 rounded-full bg-stone-200/80 backdrop-blur-md shadow-inner overflow-hidden p-0.5 border border-stone-300/50">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 rounded-full transition-all duration-200 ease-out shadow-[0_0_10px_rgba(220,38,38,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}