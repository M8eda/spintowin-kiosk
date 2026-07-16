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

  // ... [Keep handleSpin, useEffects, and drawing logic exactly the same as before]
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
              if (needleRef.current) needleRef.current.style.transform = 'translateX(-50%) rotate(0deg)';
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
      return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
    }, []);

    useEffect(() => {
      let renderId;
      const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) { renderId = requestAnimationFrame(draw); return; }
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
        rimGrad.addColorStop(0, '#7f1d1d'); rimGrad.addColorStop(0.2, '#dc2626'); rimGrad.addColorStop(0.5, '#fca5a5'); rimGrad.addColorStop(0.8, '#dc2626'); rimGrad.addColorStop(1, '#450a0a');
        ctx.strokeStyle = rimGrad;
        ctx.lineWidth = 28;
        ctx.stroke();
        ctx.restore();
        const numLights = 24; const lightRadius = 4; const timeFactor = Math.floor(performance.now() / 180);
        for (let i = 0; i < numLights; i++) {
          const lightAngle = (i * 2 * Math.PI) / numLights;
          const x = radius + (radius - 11) * Math.cos(lightAngle);
          const y = radius + (radius - 11) * Math.sin(lightAngle);
          ctx.beginPath(); ctx.arc(x, y, lightRadius, 0, 2 * Math.PI);
          const isLightOn = (i + timeFactor) % 2 === 0;
          if (isLightOn) { ctx.fillStyle = '#ffffff'; ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 10; ctx.fill(); ctx.beginPath(); ctx.arc(x, y, lightRadius - 1.5, 0, 2 * Math.PI); ctx.fillStyle = '#fecaca'; ctx.fill(); }
          else { ctx.fillStyle = '#450a0a'; ctx.fill(); ctx.beginPath(); ctx.arc(x, y, lightRadius - 1.5, 0, 2 * Math.PI); ctx.fillStyle = '#7f1d1d'; ctx.fill(); }
        }
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4; ctx.beginPath(); ctx.arc(radius, radius, 36, 0, 2 * Math.PI);
        const hubGrad = ctx.createRadialGradient(radius, radius, 0, radius, radius, 36);
        hubGrad.addColorStop(0, '#fca5a5'); hubGrad.addColorStop(0.3, '#dc2626'); hubGrad.addColorStop(1, '#7f1d1d');
        ctx.fillStyle = hubGrad; ctx.fill(); ctx.restore();
        ctx.beginPath(); ctx.arc(radius, radius, 28, 0, 2 * Math.PI); ctx.fillStyle = '#1c1917'; ctx.fill(); ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = '#fca5a5'; ctx.font = '900 14px "Montserrat", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('SPIN', radius, radius);
        renderId = requestAnimationFrame(draw);
      };
      draw();
      return () => cancelAnimationFrame(renderId);
    }, []);

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-b from-white via-white to-stone-50 overflow-hidden">
      
      {/* HEADER: flex-1 ensures it takes up the top space and centers content vertically */}
      <header className="flex-1 flex flex-col items-center justify-center px-4">
        <img
          src="/logo.png"
          alt="Logo"
          className="max-h-[80px] sm:max-h-[100px] w-auto object-contain mb-4 animate-pulse drop-shadow-lg"
        />
        <p className="text-sm sm:text-base font-serif text-stone-500 tracking-widest uppercase">
          Spin to Reveal Your Reward
        </p>
      </header>

      {/* WHEEL: flex-shrink-0 keeps it exactly the size it needs to be in the center */}
      <main className="flex-shrink-0 flex items-center justify-center px-6">
        <div 
          onClick={handleSpin}
          className="relative w-full max-w-[400px] aspect-square flex items-center justify-center z-10"
        >
          {/* Needle Container - same as before */}
          <div
            ref={needleRef}
            className="absolute top-[-7%] left-1/2 -translate-x-1/2 z-20 w-[14%] h-[20%] filter drop-shadow-[0_8px_6px_rgba(0,0,0,0.55)] transition-transform duration-75"
            style={{ transformOrigin: '50% 22.5%' }}
          >
            <svg viewBox="0 0 60 80" width="100%" height="100%">
              <defs>
                 <linearGradient id="needlered" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fca5a5" /><stop offset="35%" stopColor="#dc2626" /><stop offset="100%" stopColor="#b91c1c" /></linearGradient>
                 <radialGradient id="pegred" cx="50%" cy="30%" r="50%"><stop offset="0%" stopColor="#ffffff" /><stop offset="40%" stopColor="#dc2626" /><stop offset="100%" stopColor="#7f1d1d" /></radialGradient>
                 <linearGradient id="pointerRed" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#ff4b4b" /><stop offset="100%" stopColor="#b30000" /></linearGradient>
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
            className="w-full h-full rounded-full shadow-2xl cursor-pointer active:scale-[0.98] transition-transform"
          />
        </div>
      </main>

      {/* FOOTER: flex-1 ensures it takes up the bottom space and centers content vertically */}
      <footer className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="w-full max-w-[320px]">
          <p className="text-xs text-stone-500 mb-4 text-center font-bold tracking-[0.2em] uppercase">
            {isSpinning ? 'Processing Reward...' : 'Tap wheel to spin'}
          </p>
          <div className="w-full h-3 rounded-full bg-stone-200/80 backdrop-blur-sm shadow-inner overflow-hidden border border-stone-100">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 rounded-full transition-all duration-200 ease-out shadow-[0_0_8px_rgba(220,38,38,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}