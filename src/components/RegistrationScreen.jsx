export default function RegistrationScreen({ onSubmit }) {
  return (
    <main className="w-full max-w-md bg-stone-900/40 backdrop-blur-2xl border border-rose-300/20 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in duration-500">
      <form className="space-y-6" onSubmit={onSubmit}>
        <input type="text" name="name" placeholder="Full Name" required className="w-full bg-transparent border-b border-stone-600 p-2 focus:border-rose-400 outline-none text-rose-100" />
        <input type="tel" name="mobile" placeholder="Mobile Number" required className="w-full bg-transparent border-b border-stone-600 p-2 focus:border-rose-400 outline-none text-rose-100" />
        <input type="email" name="email" placeholder="Email Address" required className="w-full bg-transparent border-b border-stone-600 p-2 focus:border-rose-400 outline-none text-rose-100" />
        <button className="w-full bg-rose-500 text-stone-900 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-rose-400 transition-colors">Unlock Spin</button>
      </form>
    </main>
  );
}
