export default function AttractScreen({ onStart }) {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center cursor-pointer" onClick={onStart}>
      <h1 className="text-8xl font-serif font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-rose-200 to-rose-500 animate-pulse">PARKVILLE</h1>
      <p className="mt-8 text-xl uppercase tracking-[0.5em] text-stone-400">Touch to Begin</p>
    </div>
  );
}
