import { useState, useEffect, useRef } from 'react';
import { useGame, PRIZES } from '../context/GameContext';
import { useSound } from '../hooks/useSound';

export default function SpinScreen({ onComplete }) {
  const { state, dispatch } = useGame();
  const { playTick, playWin } = useSound();
  const [isSpinning, setIsSpinning] = useState(false);
  const canvasRef = useRef(null);
  const needleRef = useRef(null);
  const rotationRef = useRef(0);
  const animationFrameRef = useRef(null);

  const handleSpin = () => {
    if (isSpinning) return;

    // Determine the prize to award
    let selectedPrize;
    const session = state.activeSession;
    const deck = session ? state.sessionDecks[session] : null;

    if (session && deck && deck.length > 0) {
      // Use the first prize in the deck (it's already shuffled)
      selectedPrize = deck[0]; // This is a prize object
    } else {
      // No active session: use weighted random from global PRIZES
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

    if (!selectedPrize) {
      // fallback
      selectedPrize = PRIZES[0];
    }

    setIsSpinning(true);
    playTick();

    // Compute rotation to land on the selected prize's segment
    const prizeIndex = PRIZES.findIndex(p => p.id === selectedPrize.id);
    const arc = (2 * Math.PI) / PRIZES.length;
    const segmentCenterAngle = prizeIndex * arc + arc / 2;
    const targetNeedleAngle = 3 * Math.PI / 2;
    const extraSpins = 5 * 2 * Math.PI;
    const targetRotation = targetNeedleAngle - segmentCenterAngle + extraSpins;

    const startRotation = rotationRef.current;
    const distance = targetRotation - (startRotation % (2 * Math.PI));
    const duration = 5000;
    const startTime = performance.now();

    let lastTickAngle = startRotation;
    const tickStep = arc;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startRotation + distance * easeOut;
      rotationRef.current = current;

      if (Math.abs(current - lastTickAngle) >= tickStep) {
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

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        playWin();
        // Pass the exact prize we chose
        setTimeout(() => {
          onComplete(selectedPrize);
        }, 1000);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Continuous 60fps canvas rendering loop (unchanged)
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
      ctx.imageSmoothingQuality = 'high';

      PRIZES.forEach((prize, i) => {
        const angle = rotation + i * arc;
        ctx.beginPath();
        ctx.fillStyle = prize.color;
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius - 20, angle, angle + arc);
        ctx.lineTo(radius, radius);
        ctx.fill();

        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(angle + arc / 2);

        ctx.fillStyle = prize.text;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1.5;
        ctx.shadowOffsetY = 1.5;

        ctx.font = '26px "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(prize.emoji, radius * 0.70, 0);

        ctx.font = '800 11px "Montserrat", "Segoe UI", sans-serif';
        ctx.fillText(prize.name.toUpperCase(), radius * 0.40, 0);

        ctx.restore();
      });

      // Dividers, rim, LEDs, hub (unchanged ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ copied from original for brevity)
      for (let i = 0; i < PRIZES.length; i++) {
        const angle = rotation + i * arc;
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.lineTo(radius + (radius - 20) * Math.cos(angle), radius + (radius - 20) * Math.sin(angle));
        const dividerGrad = ctx.createLinearGradient(
          radius, radius,
          radius + (radius - 20) * Math.cos(angle), radius + (radius - 20) * Math.sin(angle)
        );
        dividerGrad.addColorStop(0, 'rgba(17,17,17,0.5)');
        dividerGrad.addColorStop(0.5, '#dc2626');
        dividerGrad.addColorStop(1, '#fca5a5');
        ctx.strokeStyle = dividerGrad;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 12;
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
      ctx.lineWidth = 22;
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
          ctx.save();
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, y, lightRadius - 1.5, 0, 2 * Math.PI);
          ctx.fillStyle = '#fecaca';
          ctx.fill();
          ctx.restore();
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
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
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

      ctx.save();
      ctx.fillStyle = '#fca5a5';
      ctx.font = '900 11px "Montserrat", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#dc2626';
      ctx.shadowBlur = 4;
      ctx.fillText('SPIN', radius, radius);
      ctx.restore();

      renderId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(renderId);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4 relative">
      <div className="absolute w-[360px] h-[360px] sm:w-[470px] sm:h-[470px] md:w-[520px] md:h-[520px] rounded-full bg-red-500/10 blur-[60px] pointer-events-none" />

      <div className="relative w-[340px] h-[340px] sm:w-[450px] sm:h-[450px] md:w-[500px] md:h-[500px] flex items-center justify-center">
        <div 
          ref={needleRef}
          className="absolute top-[-25px] left-1/2 -translate-x-1/2 z-20 w-16 h-20 filter drop-shadow-[0_8px_6px_rgba(0,0,0,0.55)] pointer-events-none transition-transform duration-75 origin-[30px_18px]"
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
            <path 
              d="M 30,15 L 42,15 L 34,70 C 32,76 28,76 26,70 L 18,15 Z" 
              fill="url(#needlered)" 
              stroke="#450a0a" 
              strokeWidth="1.5" 
              strokeLinejoin="round"
            />
            <path 
              d="M 28,52 L 32,52 L 30,72 Z" 
              fill="url(#pointerRed)" 
            />
            <circle 
              cx="30" 
              cy="18" 
              r="12" 
              fill="url(#pegred)" 
              stroke="#450a0a" 
              strokeWidth="1.5" 
            />
            <circle 
              cx="30" 
              cy="18" 
              r="5" 
              fill="#1c1917" 
              stroke="#fca5a5" 
              strokeWidth="1" 
            />
          </svg>
        </div>

        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="w-full h-full rounded-full shadow-2xl relative z-10"
        />
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className={`mt-10 px-12 py-5 rounded-full font-bold uppercase tracking-[0.3em] text-lg transition-all duration-300 shadow-xl z-10 ${
          isSpinning
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed scale-95 shadow-none'
            : 'bg-gradient-to-r from-red-500 to-red-700 text-black hover:from-red-400 hover:to-red-500 hover:scale-105 active:scale-95 hover:shadow-red-500/20'
        }`}
      >
        {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
      </button>
    </div>
  );
}