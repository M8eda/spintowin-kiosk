import { useState } from 'react';
import AttractScreen from './components/AttractScreen';
import RegistrationScreen from './components/RegistrationScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';

export default function App() {
  const [screen, setScreen] = useState('attract');
  const [userData, setUserData] = useState({ name: '', mobile: '', email: '', prize: '' });
  const [entries, setEntries] = useState([]);

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
    setScreen('attract');
  };

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["Name,Mobile,Email,Prize,Timestamp"].concat(
        entries.map(e => `${e.name},${e.mobile},${e.email},${e.prize},${e.timestamp}`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "kiosk_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="min-h-screen w-full bg-stone-950 text-stone-100 font-sans overflow-hidden relative flex flex-col items-center justify-center">
      {screen === 'attract' && <AttractScreen onStart={() => setScreen('registration')} />}
      {screen === 'registration' && <RegistrationScreen onSubmit={handleRegister} />}
      {screen === 'spinning' && <GameScreen onSpinComplete={handleSpinComplete} />}
      {screen === 'winner' && <ResultScreen prize={userData.prize} onRestart={finalizeWinner} />}
      
      <footer className="absolute bottom-2 left-2">
        <button onClick={downloadCSV} className="text-[8px] text-stone-800 hover:text-stone-500 uppercase tracking-widest">Admin Export</button>
      </footer>
    </div>
  );
}
