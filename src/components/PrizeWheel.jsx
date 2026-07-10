import { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

const prizes = [
  { name: 'Perfume 🧴', color: '#FF3366' },
  { name: 'Gift Card 💳', color: '#00E5FF' },
  { name: 'Skin Care ✨', color: '#FFD700' },
  { name: '10% Off 🏷️', color: '#FF5722' },
  { name: 'Sample 🎁', color: '#9C27B0' },
  { name: 'VIP Pass 🎟️', color: '#4CAF50' },
  { name: 'Gold Set 👑', color: '#E91E63' },
  { name: 'Silver 🥈', color: '#2196F3' },
  { name: 'Bronze 🥉', color: '#FF9800' },
  { name: 'Mystery ❓', color: '#607D8B' },
  { name: '2x Points ⚡', color: '#795548' },
  { name: 'Lucky Day 🍀', color: '#E53935' },
];

export default function PrizeWheel({ onSpinComplete }) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    };
  }, []);

  const spin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);

    const sliceAngle = 360 / prizes.length;
    const randomSlice = Math.floor(Math.random() * prizes.length);
    const extraRotation = randomSlice * sliceAngle;
    const newRotation = rotation + 1800 + extraRotation + sliceAngle / 2;
    setRotation(newRotation);

    spinTimeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;

      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#FFD700', '#FFFFFF'],
      });

      setIsSpinning(false);
      onSpinComplete(prizes[randomSlice].name);
    }, 8000);
  }, [isSpinning, rotation, onSpinComplete]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Pointer */}
      <div className="absolute top-[-40px] z-30 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="#FFD700" stroke="#B8860B" strokeWidth="1">
          <path d="M12 22L2 2h20z" />
        </svg>
      </div>

      {/* Wheel Container */}
      <div className="p-4 rounded-full border-4 border-dashed border-yellow-500/50 shadow-[0_0_60px_rgba(255,215,0,0.2)]">
        <svg
          viewBox="0 0 100 100"
          className={`w-[450px] h-[450px] transition-transform duration-[8000ms] ease-[cubic-bezier(0.17,0.67,0.12,0.99)] ${
            isSpinning ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'
          }`}
          style={{ transform: `rotate(${rotation}deg)`, transitionProperty: 'transform' }}
          onClick={spin}
        >
          {prizes.map((p, i) => {
            const sliceAngle = 360 / prizes.length;
            const startAngle = i * sliceAngle;
            const midAngle = startAngle + sliceAngle / 2;
            const rad = (midAngle - 90) * (Math.PI / 180);
            const textX = 50 + 35 * Math.cos(rad);
            const textY = 50 + 35 * Math.sin(rad);

            return (
              <g key={i}>
                <path
                  d={`M 50 50 L 50 0 A 50 50 0 0 1 ${50 + 50 * Math.sin((sliceAngle * Math.PI) / 180)} ${50 - 50 * Math.cos((sliceAngle * Math.PI) / 180)} Z`}
                  fill={p.color}
                  stroke="#fff"
                  strokeWidth="1"
                  transform={`rotate(${startAngle}, 50, 50)`}
                />
                <text
                  x={textX}
                  y={textY}
                  fontSize="3"
                  fill="#fff"
                  fontWeight="800"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                >
                  {p.name}
                </text>
              </g>
            );
          })}
          <circle cx="50" cy="50" r="10" fill="url(#goldGradient)" stroke="#8B4513" strokeWidth="1" />
          <defs>
            <radialGradient id="goldGradient">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#B8860B" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}