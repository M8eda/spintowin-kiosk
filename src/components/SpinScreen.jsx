import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame, PRIZES } from '../context/GameContext';
import { useSound } from '../hooks/useSound';

// Custom drawing for a premium 3D Gold Ingot stack (No more cheese!)
function drawGoldIngot(ctx, x, y, w, h) {
  ctx.save();
  ctx.translate(x, y);
  
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 2;

  // Base Trapezoid
  ctx.beginPath();
  ctx.moveTo(-w * 0.35, -h/2); 
  ctx.lineTo(w * 0.35, -h/2);  
  ctx.lineTo(w * 0.5, h/2);    
  ctx.lineTo(-w * 0.5, h/2);   
  ctx.closePath();
  
  const goldGrad = ctx.createLinearGradient(-w/2, -h/2, w/2, h/2);
  goldGrad.addColorStop(0, '#FFE875'); // Pure gold highlight
  goldGrad.addColorStop(0.3, '#F5B041'); // Base rich gold
  goldGrad.addColorStop(0.7, '#D35400'); // Warm copper shadow
  goldGrad.addColorStop(1, '#873B00'); // Deep dark core
  ctx.fillStyle = goldGrad;
  ctx.fill();

  // Shiny top bevel line
  ctx.beginPath();
  ctx.moveTo(-w * 0.35, -h/2);
  ctx.lineTo(w * 0.35, -h/2);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // "999.9" Fine Gold Inscription Stamp
  ctx.fillStyle = 'rgba(113, 63, 18, 0.9)';
  ctx.font = '800 7px "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('999.9', 0, 1);

  ctx.restore();
}

// Custom drawing for a realistic shiny Gold Pound coin
function drawGoldPound(ctx, x, y, r) {
  ctx.save();
  ctx.translate(x, y);

  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 2;

  // Outer Gold Rim Circle
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, 2 * Math.PI);
  const goldGrad = ctx.createLinearGradient(-r, -r, r, r);
  goldGrad.addColorStop(0, '#FFF59D');
  goldGrad.addColorStop(0.3, '#F5B041');
  goldGrad.addColorStop(0.7, '#CA8A04');
  goldGrad.addColorStop(1, '#713F12');
  ctx.fillStyle = goldGrad;
  ctx.fill();

  // Outer relief ridges
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.beginPath();
  ctx.arc(0, 0, r - 2.5, 0, 2 * Math.PI);
  ctx.strokeStyle = '#713F12';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Glossy central coin face
  ctx.beginPath();
  ctx.arc(0, 0, r - 4.5, 0, 2 * Math.PI);
  const innerGrad = ctx.createRadialGradient(-2, -2, 0, 0, 0, r - 4.5);
  innerGrad.addColorStop(0, '#FFFDE7');
  innerGrad.addColorStop(0.6, '#F5B041');
  innerGrad.addColorStop(1, '#A47A0F');
  ctx.fillStyle = innerGrad;
  ctx.fill();

  // Sterling £ Currency relief symbol
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
        
        // Highly localized deflection. Never alters absolute center position
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

      const timeFactor = Math.floor(performance.now() / 180);

      // 1. Draw Wheel Sectors
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
        
        // 3D Inner radial shadow depth overlay
        const sectorGrad = ctx.createRadialGradient(radius, radius, 20, radius, radius, radius - 24);
        sectorGrad.addColorStop(0, 'rgba(255,255,255,0.15)');
        sectorGrad.addColorStop(1, 'rgba(0,0,0,0.3)');
        ctx.fillStyle = sectorGrad;
        ctx.fill();

        // Pulsing Neon Chamber Lights in alternating segments
        if (isSegmentGlowing) {
          const glowGrad = ctx.createRadialGradient(radius, radius, radius * 0.4, radius, radius, radius - 24);
          glowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
          glowGrad.addColorStop(0.6, 'rgba(255, 254, 215, 0.12)');
          glowGrad.addColorStop(1, 'rgba(254, 240, 138, 0.35)'); // Golden glowing edges
          ctx.fillStyle = glowGrad;
          ctx.fill();

          // Rim-facing dynamic inner light neon stroke
          ctx.beginPath();
          ctx.arc(radius, radius, radius - 26, angle, angle + arc);
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 3.5;
          ctx.shadowColor = '#eab308';
          ctx.shadowBlur = 8;
          ctx.stroke();
          ctx.shadowBlur = 0; // reset
        }

        // Sector Content Translation Setup
        ctx.translate(radius, radius);
        ctx.rotate(angle + arc / 2);
        
        const prizeNameLower = prize.name.toLowerCase();

        // Check for Gold Bar and substitute cheese with metallic 3D ingots
        if (prizeNameLower.includes('gold bar')) {
          drawGoldIngot(ctx, radius * 0.62, -14, 38, 22);
        } 
        // Check for Gold Pound and substitute building/flat icon with custom gold coin
        else if (prizeNameLower.includes('gold pound')) {
          drawGoldPound(ctx, radius * 0.62, -14, 15);
        } 
        // Default Emojis for standard sectors
        else {
          ctx.shadowColor = 'rgba(0,0,0,0.4)';
          ctx.shadowBlur = 6;
          ctx.font = '32px "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(prize.emoji, radius * 0.62, -14);
        }
        
        // Premium Typography Label
        const label = prize.name.replace('Reward ', '').toUpperCase();
        ctx.font = '800 11px "Montserrat", sans-serif';
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(label, radius * 0.62, 22);
        
        ctx.restore();
      });

      // 2. Draw Sector Divider Lines
      for (let i = 0; i < PRIZES.length; i++) {
        const angle = rotation + i * arc;
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.lineTo(radius + (radius - 24) * Math.cos(angle), radius + (radius - 24) * Math.sin(angle));
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 3. Luxury Outer Bezel Rim
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

      // 4. Perimeter Lights & Metallic Acoustic Pegs
      const numElements = 24;
      const lightingFactor = Math.floor(performance.now() / 200);
      
      for (let i = 0; i < numElements; i++) {
        const elementAngle = (i * 2 * Math.PI) / numElements;
        const x = radius + (radius - 12) * Math.cos(elementAngle);
        const y = radius + (radius - 12) * Math.sin(elementAngle);

        if (i % 2 === 0) {
          // Alternating LED Lights
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
          // Acoustic Sound Pins (Perfect balance on the bezel rim)
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

      // 5. Solid Center Core Hub with Polished Bezel
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 6;
      
      // Outer Gold Bezel Frame
      ctx.beginPath();
      ctx.arc(radius, radius, 42, 0, 2 * Math.PI);
      const goldGrad = ctx.createLinearGradient(radius - 42, radius - 42, radius + 42, radius + 42);
      goldGrad.addColorStop(0, '#fef08a');
      goldGrad.addColorStop(0.5, '#ca8a04');
      goldGrad.addColorStop(1, '#713f12');
      ctx.fillStyle = goldGrad;
      ctx.fill();
      
      // Ruby Core Disc
      ctx.beginPath();
      ctx.arc(radius, radius, 36, 0, 2 * Math.PI);
      const hubGrad = ctx.createRadialGradient(radius - 10, radius - 10, 0, radius, radius, 36);
      hubGrad.addColorStop(0, '#fca5a5');
      hubGrad.addColorStop(0.3, '#dc2626');
      hubGrad.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = hubGrad;
      ctx.fill();
      ctx.restore();

      // Core typography
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
      
      {/* HEADER */}
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

      {/* WHEEL CONTAINER */}
      <main className="flex-shrink-0 flex items-center justify-center px-6">
        <div 
          onClick={handleSpin}
          className="relative w-full max-w-[400px] aspect-square flex items-center justify-center z-10 group"
        >
          {/* STATIC OUTER CONTAINER - Absolutely locks horizontal position */}
          <div className="absolute top-[-5.5%] left-1/2 -translate-x-1/2 z-20 w-[14%] h-[20%] pointer-events-none">
            {/* DYNAMIC ROTATING ELEMENT - Rotates safely inside without translation shifts */}
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
            width={500}
            height={500}
            className="w-full h-full rounded-full shadow-[0_25px_60px_rgba(0,0,0,0.22)] cursor-pointer transition-transform duration-300 group-hover:scale-[1.01] active:scale-[0.98]"
          />
        </div>
      </main>

      {/* FOOTER */}
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