import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

const PRIZES = [
   { text: 'AirPods Pro 🎧', color: '#002f94', textCol: '#ffffff' },
   { text: 'Try Again 💫', color: '#f4f4f5', textCol: '#71717a' },
   { text: 'Free Skincare 🧴', color: '#0a39a6', textCol: '#ffffff' },
   { text: 'Mystery Gift 🎁', color: '#eab308', textCol: '#0a39a6' },
   { text: 'Special Promo 🎟️', color: '#18181b', textCol: '#ffffff' },
   { text: 'Try Again 💫', color: '#f4f4f5', textCol: '#71717a' },
   { text: 'Hair Serum 💧', color: '#0f46be', textCol: '#ffffff' },
   { text: 'Mega Jackpot 👑', color: '#eab308', textCol: '#0a39a6' }
];

export default function PrizeWheel() {
   const { isSpinning, setIsSpinning, triggerWin } = useGame();
   const canvasRef = useRef(null);

   const currentRotation = useRef(0);
   const angularVelocity = useRef(0);
   const isAnimating = useRef(false);

   const drawWheel = (ctx, rotation) => {
      const size = 480;
      const center = size / 2;
      const radius = center - 24;
      const numSegments = PRIZES.length;
      const arcSize = (2 * Math.PI) / numSegments;

      ctx.clearRect(0, 0, size, size);

      // Outer Frame Boundary Housing Ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, radius + 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.restore();

      // Render Individual Campaign Segments
      PRIZES.forEach((prize, idx) => {
         const startAngle = idx * arcSize + rotation;
         const endAngle = startAngle + arcSize;

         ctx.save();
         ctx.beginPath();
         ctx.moveTo(center, center);
         ctx.arc(center, center, radius, startAngle, endAngle);
         ctx.closePath();
         ctx.fillStyle = prize.color;
         ctx.fill();
         ctx.strokeStyle = 'rgba(255,255,255,0.15)';
         ctx.lineWidth = 1.5;
         ctx.stroke();
         ctx.restore();

         // Render Typography Core Labels
         ctx.save();
         ctx.translate(center, center);
         ctx.rotate(startAngle + arcSize / 2);
         ctx.textAlign = 'right';
         ctx.textBaseline = 'middle';
         ctx.fillStyle = prize.textCol;
         ctx.font = 'bold 15px sans-serif';
         ctx.fillText(prize.text.toUpperCase(), radius - 35, 0);
         ctx.restore();
      });

      // Central Gloss Axis Core Button Pin Rim
      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, 45, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#0a39a6';
      ctx.font = 'black 13px sans-serif';
      ctx.fillText('LUCK', center, center);
      ctx.restore();
   };

   useEffect(() => {
      if (isSpinning && !isAnimating.current) {
         isAnimating.current = true;
         angularVelocity.current = Math.random() * 0.35 + 0.45;
      }
   }, [isSpinning]);

   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      let animationId;
      const loop = () => {
         if (angularVelocity.current > 0.0015) {
            angularVelocity.current *= 0.983;
            currentRotation.current += angularVelocity.current;
            drawWheel(ctx, currentRotation.current);
            animationId = requestAnimationFrame(loop);
         } else if (isAnimating.current) {
            angularVelocity.current = 0;
            isAnimating.current = false;

            const numSegments = PRIZES.length;
            const arcSize = (2 * Math.PI) / numSegments;
            let normRot = currentRotation.current % (2 * Math.PI);
            const landingIdx = Math.floor((2 * Math.PI - normRot) / arcSize) % numSegments;

            setTimeout(() => {
               triggerWin(PRIZES[landingIdx].text);
            }, 800);
         } else {
            drawWheel(ctx, currentRotation.current);
         }
      };

      loop();
      return () => cancelAnimationFrame(animationId);
   }, [isSpinning, triggerWin]);

   return (
      <div className="relative flex items-center justify-center">
         <div className="absolute -top-1.5 z-30 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[32px] border-t-yellow-400 drop-shadow-md" />
         <canvas ref={canvasRef} width={480} height={480} className="w-[340px] h-[340px] md:w-[410px] md:h-[410px] rounded-full" />
      </div>
   );
}