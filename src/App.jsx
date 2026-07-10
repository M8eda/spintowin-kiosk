import { useState, useEffect } from 'react';

export default function App() {
  const [screen, setScreen] = useState('attract'); // attract, registration, spinning, winner
  const [userData, setUserData] = useState({ name: '', mobile: '', email: '', prize: '' });
  const [entries, setEntries] = useState([]); // This stores the history for the CSV export

  const handleRegister = (e) => {
    e.preventDefault();
    setUserData({ ...userData, name: e.target.name.value, mobile: e.target.mobile.value, email: e.target.email.value });
    setScreen('spinning');
  };

  const handleSpinComplete = (prize) => {
    setUserData({ ...userData, prize });
    setScreen('winner');
  };

  const finalizeWinner = () => {
    const newEntry = { ...userData, timestamp: new Date().toLocaleString() };
    setEntries([...entries, newEntry]);
    setScreen('attract'); // Restart loop
  };

  // CSV Export Logic (Secretly hidden in the footer)
  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["Name,Mobile,Email,Prize,Timestamp"].concat(
        entries.map(e => `${e.name},${e.mobile},${e.email},${e.prize},${e.timestamp}`)
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "kiosk_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="min-h-screen w-full bg-stone-950 text-stone-100 font-sans overflow-hidden relative">
      
      {/* 1. ATTRACT SCREEN */}
      {screen === 'attract' && (
        <div className="h-screen w-full flex flex-col items-center justify-center cursor-pointer" onClick={() => setScreen('registration')}>
          <h1 className="text-8xl font-serif font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-rose-200 to-rose-500 animate-pulse">PARKVILLE</h1>
          <p className="mt-8 text-xl uppercase tracking-[0.5em] text-stone-400">Touch to Begin</p>
        </div>
      )}

      {/* 2. REGISTRATION SCREEN */}
      {screen === 'registration' && (
        <div className="h-screen flex items-center justify-center p-8 animate-in fade-in duration-500">
           <main className="w-full max-w-md bg-stone-900/40 backdrop-blur-2xl border border-rose-300/20 rounded-[2.5rem] p-10 shadow-2xl">
            <form className="space-y-6" onSubmit={handleRegister}>
              <input type="text" name="name" placeholder="Full Name" required className="w-full bg-transparent border-b border-stone-600 p-2 focus:border-rose-400 outline-none" />
              <input type="tel" name="mobile" placeholder="Mobile Number" required className="w-full bg-transparent border-b border-stone-600 p-2 focus:border-rose-400 outline-none" />
              <input type="email" name="email" placeholder="Email Address" required className="w-full bg-transparent border-b border-stone-600 p-2 focus:border-rose-400 outline-none" />
              <button className="w-full bg-rose-500 text-stone-900 py-4 rounded-full font-bold uppercase tracking-widest">Unlock Spin</button>
            </form>
           </main>
        </div>
      )}

      {/* 3. SPINNING SCREEN */}
      {screen === 'spinning' && (
        <div className="h-screen flex flex-col items-center justify-center animate-in zoom-in duration-500" onClick={() => handleSpinComplete("Luxury Gift Set")}>
          <div className="w-80 h-80 border-[16px] border-rose-500 rounded-full flex items-center justify-center animate-spin">
             <span className="text-4xl font-serif">SPIN</span>
          </div>
          <p className="mt-12 text-stone-400">Touch anywhere to spin...</p>
        </div>
      )}

      {/* 4. WINNER SCREEN */}
      {screen === 'winner' && (
        <div className="h-screen flex flex-col items-center justify-center text-center animate-in slide-in-from-bottom-10 duration-500">
          <h2 className="text-4xl font-serif text-rose-200 mb-8">You Won: {userData.prize}!</h2>
          <button onClick={finalizeWinner} className="bg-rose-500 text-stone-900 px-12 py-4 rounded-full font-bold">Validate Prize</button>
        </div>
      )}

      {/* HIDDEN ADMIN FOOTER */}
      <footer className="absolute bottom-2 left-2">
        <button onClick={downloadCSV} className="text-[8px] text-stone-800 hover:text-stone-500 uppercase tracking-widest">
          Admin Export
        </button>
      </footer>
    </div>
  );
}