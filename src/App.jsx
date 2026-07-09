import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import AttractScreen from './components/AttractScreen';
import RegistrationScreen from './components/RegistrationScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import { Download, Sliders } from 'lucide-react';

function KioskContent() {
  const { screen, exportToCSV, leadsCount } = useGame();
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#fbfbfa] text-neutral-900 relative font-sans antialiased select-none touch-none">
      
      {/* High-End Ambient Lighting Orbs (Soft, elegant warm glows) */}
      <div className="absolute top-[-10%] left-[-20%] w-[800px] h-[800px] bg-gradient-to-br from-amber-100/40 to-rose-100/30 rounded-full blur-[140px] pointer-events-none animate-pulse duration-[8s]" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[800px] h-[800px] bg-gradient-to-tr from-purple-100/30 to-blue-100/40 rounded-full blur-[140px] pointer-events-none animate-pulse duration-[12s]" />

      {/* Invisible Admin Secret Corner Target Touch Area */}
      <div 
        className="absolute top-0 right-0 w-24 h-24 z-50 cursor-default"
        onDoubleClick={() => setShowAdminMenu(!showAdminMenu)}
      />

      {/* Dynamic Screen Lifecycle Router Switch Matrix */}
      <div className="w-full h-full relative z-10">
        {screen === 'attract' && <AttractScreen />}
        {screen === 'registration' && <RegistrationScreen />}
        {screen === 'game' && <GameScreen />}
        {screen === 'result' && <ResultScreen />}
      </div>

      {/* Premium Minimalist Slide-over Control Panel */}
      {showAdminMenu && (
        <div className="absolute top-6 right-6 z-50 flex items-center gap-4 bg-white/90 backdrop-blur-2xl px-5 py-3 rounded-2xl border border-neutral-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-1.5">
              <Sliders className="w-3 h-3 text-neutral-500" /> System Metrics
            </span>
            <span className="text-sm font-mono font-bold text-neutral-800 mt-0.5">{leadsCount} Records Secured</span>
          </div>
          <div className="h-6 w-[1px] bg-neutral-200" />
          <button 
            onClick={exportToCSV}
            className="p-3 bg-neutral-900 hover:bg-neutral-800 active:scale-95 rounded-xl text-white transition-all flex items-center justify-center shadow-sm"
            title="Download Raw Data CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <KioskContent />
    </GameProvider>
  );
}