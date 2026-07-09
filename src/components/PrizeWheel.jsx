import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../context/GameContext';

const PRIZES = [
  { text: 'Grand Jackpot 👑', color: '#10b981', textColor: '#ffffff' },
  { text: 'Try Again 💫', color: '#171717', textColor: '#a3a3a3' },
  { text: 'Free Coffee ☕', color: '#8b5cf6', textColor: '#ffffff' },
  { text: 'Mystery Box 🎁', color: '#ec4899', textColor: '#ffffff' },
  { text: '20% Off Coupon 🎟️', color: '#f59e0b', textColor: '#ffffff' },
  { text: 'Free Sticker ⚡', color: '#171717', textColor: '#a3a3a3' },
  { text: 'VIP Pass 🎫', color: '#3b82f6', textColor: '#ffffff' },
  { text: 'Special Merch 👕', color: '#ef4444', textColor: '#ffffff' },
];

export default function PrizeWheel() {
  const { isSpinning, setIsSpinning, triggerWin } = useGame();
  const canvasRef = useRef(null);
  
  // Physics Animation State Trackers
  const currentRotation = useRef(0);
  const angularVelocity = useRef(0);
  const isAnimating = useRef(false);

  // Redraw the entire premium graphics canvas layout layers
  const drawWheel = (ctx, rotation) => {
    const size = 480;
    const center = size / 2;
    const radius = center - 20;
    const numSegments = PRIZES.length;
    const arcSize = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, size, size);

    // Layer 1: Outer Premium Neon Glowing Rim Rim Outer Casting
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#141414';
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 30;
    ctx.fill();
    ctx.strokeStyle = '#262626';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();

    // Layer 2: Draw Individual Slices with Gradients
    PRIZES.forEach((prize, index) => {
      const startAngle = index * arcSize + rotation;
      const endAngle = startAngle + arcSize;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      
      // Slice background fills
      ctx.fillStyle = prize.color;
      ctx.fill();

      // Subtle slice separating panel lines
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Layer 3: Render Typography inside Slices
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + arcSize / 2);
      
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = prize.textColor;
      ctx.font = 'black 16px sans-serif';
      
      // Upper professional typography lettering casing transformations
      ctx.fillText(prize.text.toUpperCase(), radius - 30, 0);
      ctx.restore();
    });

    // Layer 4: Outer Target Pointer Pins Indicator
    PRIZES.forEach((_, index) => {
      const pinAngle = index * arcSize + rotation;
      const pinX = center + radius * Math.cos(pinAngle);
      const pinY = center + radius * Math.sin(pinAngle);

      ctx.save();
      ctx.beginPath();
      ctx.arc(pinX, pinY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    });

    // Layer 5: Polished Cyber-Glass Center Core Axis Hub
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, 45, 0, 2 * Math.PI);
    ctx.fillStyle = '#0a0a0a';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.strokeStyle = '#3a3a3a';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Core Center Branding Node Text Accents
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'black 12px sans-serif';
    ctx.fillText('SPIN', center, center);
    ctx.restore();
  };

  // Launch Core Spin Calculations Sequence Loop
  useEffect(() => {
    if (isSpinning && !isAnimating.current) {
      isAnimating.current = true;
      // Inject heavy explosive speed force, then decay using friction metrics
      angularVelocity.current = Math.random() * 0.4 + 0.5; 
    }
  }, [isSpinning]);

  // Handle continuous physics redraw ticks loop frames
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;

    const renderLoop = () => {
      if (angularVelocity.current > 0.001) {
        // Friction Damping Factor Formula
        angularVelocity.current *= 0.982; 
        currentRotation.current += angularVelocity.current;
        drawWheel(ctx, currentRotation.current);
        animationFrameId = requestAnimationFrame(renderLoop);
      } else if (isAnimating.current) {
        // Physics have settled, finalize accurate prize segment bounds mapping
        angularVelocity.current = 0;
        isAnimating.current = false;

        const numSegments = PRIZES.length;
        const arcSize = (2 * Math.PI) / numSegments;
        
        // Normalize rotation back into standard unit circle space
        let normalizedRotation = currentRotation.current % (2 * Math.PI);
        
        // Calculate slice sitting directly under top indicator layout pin (at 0 radians / 3 o'clock default)
        // Adjust for desired target pin placement offset alignment coordinates
        const landingIndex = Math.floor(
          (2 * Math.PI - normalizedRotation) / arcSize
        ) % numSegments;

        const winningSegment = PRIZES[landingIndex];
        
        setTimeout(() => {
          triggerWin(winningSegment.text);
        }, 800);
      } else {
        drawWheel(ctx, currentRotation.current);
      }
    };

    renderLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isSpinning, triggerWin]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Visual Top Pin Pointer Needle Overlay */}
      <div className="absolute -top-1 z-30 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />
      
      {/* Ultra Smooth Graphics Raster Layer Surface */}
      <canvas
        ref={canvasRef}
        width={480}
        height={480}
        className="w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-full"
      />
    </div>
  );
}