import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [screen, setScreen] = useState('attract'); // attract -> registration -> game -> result
  const [winningPrize, setWinningPrize] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [leads, setLeads] = useState([]);

  // Load existing leads from localStorage on boot
  useEffect(() => {
    const storedLeads = localStorage.getItem('kiosk_leads');
    if (storedLeads) {
      try {
        setLeads(JSON.parse(storedLeads));
      } catch (e) {
        console.error("Error reading storage map", e);
      }
    }
  }, []);

  const goToScreen = (targetScreen) => setScreen(targetScreen);

  // Append new lead data to local storage database
  const saveLead = (userData) => {
    const updatedLeads = [...leads, { ...userData, timestamp: new Date().toISOString() }];
    setLeads(updatedLeads);
    localStorage.setItem('kiosk_leads', JSON.stringify(updatedLeads));
  };

  // Compile local leads database into a raw downloadable CSV file
  const exportToCSV = () => {
    if (leads.length === 0) {
      alert("No data collected yet!");
      return;
    }
    const headers = ['Name', 'Phone', 'Email', 'Timestamp'];
    const rows = leads.map(l => [
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${l.timestamp}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `kiosk_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerWin = (prize) => {
    setWinningPrize(prize);
    setScreen('result');
  };

  const resetGame = () => {
    setWinningPrize(null);
    setIsSpinning(false);
    setScreen('attract');
  };

  return (
    <GameContext.Provider value={{
      screen,
      goToScreen,
      winningPrize,
      triggerWin,
      isSpinning,
      setIsSpinning,
      resetGame,
      saveLead,
      exportToCSV,
      leadsCount: leads.length
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);