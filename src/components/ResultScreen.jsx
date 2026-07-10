export default function ResultScreen({ prize, onRestart }) {
  return (
    <div className="text-center animate-in slide-in-from-bottom-10 duration-500">
      <h2 className="text-4xl font-serif text-rose-200 mb-8">You Won: {prize}!</h2>
      <button onClick={onRestart} className="bg-rose-500 text-stone-900 px-12 py-4 rounded-full font-bold uppercase tracking-widest">Validate Prize</button>
    </div>
  );
}
