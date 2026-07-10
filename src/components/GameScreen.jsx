import PrizeWheel from './PrizeWheel';

export default function GameScreen({ onSpinComplete }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-stone-950">
      <h2 className="text-rose-200 text-2xl font-serif mb-12 tracking-widest uppercase">Spin to Reveal</h2>
      <PrizeWheel onSpinComplete={onSpinComplete} />
    </div>
  );
}
