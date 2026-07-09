import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';

const PRIZES = [
  { label: 'Free Coffee', color: '#EF4444' },
  { label: '10% Discount', color: '#F59E0B' },
  { label: 'Mystery Gift', color: '#10B981' },
  { label: 'Try Again', color: '#3B82F6' },
  { label: 'Super Prize', color: '#8B5CF6' },
  { label: '5% Discount', color: '#EC4899' },
  { label: 'Free Sticker', color: '#06B6D4' },
  { label: 'Jackpot!', color: '#F43F5E' }
];

export default function GameScreen() {
  const { triggerWin, isSpinning, setIsSpinning } = useGame();
  const canvasRef = useRef(null);
  const spinVelocityRef = useRef(0);
  const currentAngleRef = useRef(0);

  // High-DPI Resolution setup for crisp text on massive displays
  const CANVAS_RESOLUTION = 800; 

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = CANVAS_RESOLUTION;
    const center = size / 2;
    const radius = center - 16;
    const arcSize = (2 * Math.PI) / PRIZES.length;

    const drawWheel = () => {
      ctx.clearRect(0, 0, size, size);
      
      PRIZES.forEach((prize, i) => {
        const angle = currentAngleRef.current + (i * arcSize);
        
        // Draw Core Segment Slice
        ctx.beginPath();
        ctx.fillStyle = prize.color;
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, angle, angle + arcSize);
        ctx.lineTo(center, center);
        ctx.fill();
        ctx.strokeStyle = '#171717';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Overlay Segment Typography (Upscaled to 28px for standing legibility)
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 28px sans-serif';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'right';
        ctx.translate(center, center);
        ctx.rotate(angle + (arcSize / 2));
        ctx.fillText(prize.label, radius - 45, 0);
        ctx.restore();
      });

      // Draw Center Hub Pin Ring
      ctx.beginPath();
      ctx.fillStyle = '#171717';
      ctx.arc(center, center, 60, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 6;
      ctx.stroke();
    };

    let animationFrameId;
    const updatePhysics = () => {
      if (spinVelocityRef.current > 0) {
        currentAngleRef.current += spinVelocityRef.current;
        spinVelocityRef.current *= 0.984; // Slightly tuned premium friction matrix

        if (spinVelocityRef.current < 0.0015) {
          spinVelocityRef.current = 0;
          setIsSpinning(false);

          const totalSegments = PRIZES.length;
          const normalizedAngle = (2 * Math.PI - (currentAngleRef.current % (2 * Math.PI))) % (2 * Math.PI);
          const rawIndex = Math.floor((normalizedAngle / (2 * Math.PI)) * totalSegments);
          const winningIndex = (rawIndex + totalSegments) % totalSegments;
          
          setTimeout(() => {
            triggerWin(PRIZES[winningIndex]);
          }, 800);
        }
      }
      
      drawWheel();
      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    updatePhysics();
    return () => cancelAnimationFrame(animationFrameId);
  }, [setIsSpinning, triggerWin]);

  const handleSpinInit = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    spinVelocityRef.current = Math.random() * 0.25 + 0.45; // Dynamic acceleration impulse
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between bg-neutral-950 p-12 relative select-none">
      
      {/* Top Header Branding Container */}
      <div className="text-center mt-8 space-y-2 z-20">
        <h2 className="text-4xl font-black uppercase tracking-[0.25em] text-neutral-500">
          Test Your Luck
        </h2>
        <p className="text-xl text-neutral-400 font-light">
          Give it a spin and see what you win!
        </p>
      </div>

      {/* Massive Responsive Wheel Housing Assembly */}
      <div className="relative w-full max-w-[760px] aspect-square flex items-center justify-center my-auto z-10">
        
        {/* Physical Top Selector Arrow Pin Indicator (Enlarged) */}
        <div className="absolute -top-4 z-30 w-0 h-0 border-l-[28px] border-l-transparent border-r-[28px] border-r-transparent border-t-[48px] border-t-yellow-400 drop-shadow-[0_8px_12px_rgba(0,0,0,0.7)]" />
        
        {/* Crisp Rendering High-Resolution Graphics Core */}
        <canvas 
          ref={canvasRef} 
          width={CANVAS_RESOLUTION} 
          height={CANVAS_RESOLUTION} 
          className="w-full h-full rounded-full drop-shadow-[0_35px_35px_rgba(0,0,0,0.85)] border-8 border-neutral-900"
        />
      </div>

      {/* Heavy-Duty Action Touch Surface Button */}
      <div className="w-full flex justify-center mb-12 z-20">
        <button
          onClick={handleSpinInit}
          disabled={isSpinning}
          className={`w-full max-w-md py-6 rounded-2xl font-black text-3xl uppercase tracking-widest transition-all transform duration-200 ${
            isSpinning 
              ? 'bg-neutral-900 text-neutral-600 scale-95 cursor-not-allowed border border-neutral-800' 
              : 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-neutral-950 hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(245,158,11,0.25)]'
          }`}
        >
          {isSpinning ? 'Good Luck...' : 'Tap To Spin'}
        </button>
      </div>
    </div>
  );
}