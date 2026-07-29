import React, { createContext, useContext, useReducer } from 'react';

export const PRIZES = [
  { id: '1', name: 'Quarter-gram Gold Bar', color: '#FFD700', text: '#1C1917', emoji: '🧈', weight: 4 },
  { id: '2', name: 'Half-gram Gold Bar', color: '#FFA500', text: '#1C1917', emoji: '🧈', weight: 4 },
  { id: '3', name: 'Gold Pound (Coin)', color: '#FFD700', text: '#1C1917', emoji: '🪙', weight: 4 },
  { id: '4', name: 'Mobile Phone', color: '#4CAF50', text: '#FFFFFF', emoji: '📱', weight: 1 },
  { id: '5', name: 'Smartwatch', color: '#2196F3', text: '#FFFFFF', emoji: '⌚', weight: 1 },
  { id: '6', name: 'Smart Earbuds', color: '#FFEB3B', text: '#1C1917', emoji: '🎧', weight: 1 },
  { id: '7', name: 'Shopping Voucher 500 EGP', color: '#9C27B0', text: '#FFFFFF', emoji: '🎟️', weight: 8 },
];

const PRIZE_POOL_DISTRIBUTION = {
  'Quarter-gram Gold Bar': 4,
  'Half-gram Gold Bar': 4,
  'Gold Pound (Coin)': 4,
  'Mobile Phone': 1,
  'Smartwatch': 1,
  'Smart Earbuds': 1,
  'Shopping Voucher 500 EGP': 8,
};

function generatePrizePool() {
  const pool = [];
  for (const [name, quantity] of Object.entries(PRIZE_POOL_DISTRIBUTION)) {
    const prize = PRIZES.find(p => p.name === name);
    if (!prize) continue;
    for (let i = 0; i < quantity; i++) {
      pool.push({ ...prize });
    }
  }
  return shuffleArray(pool);
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const GameContext = createContext();

const initialState = {
  screen: 'attract',
  activeSession: null,
  user: null,
  prize: null,
  leads: [],
  sessionDecks: {},
};

const getInitialState = () => {
  const savedLeads = loadFromLocalStorage('spin_to_win_leads');
  const savedDecks = loadFromLocalStorage('spin_to_win_decks');
  return {
    ...initialState,
    leads: savedLeads || [],
    sessionDecks: savedDecks || {},
  };
};

function loadFromLocalStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Failed to load from localStorage (${key}):`, error);
    return null;
  }
}

function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return { success: true };
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error(`Storage quota exceeded for key: ${key}`);
      return { success: false, error: 'Storage quota exceeded' };
    }
    console.error(`Failed to save to localStorage:`, error);
    return { success: false, error: error.message };
  }
}

function createLead(user, prize, activeSession) {
  return {
    id: (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    session: activeSession || 'General',
    fullName: user?.fullName || user?.name || '',
    phone: user?.phone || '',
    receipt: user?.receipt || '',
    idNumber: user?.idNumber || '',
    prize: prize?.name || 'Registered for Event',
  };
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'GO':
      return { ...state, screen: action.payload };

    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'START_SESSION': {
      const pool = generatePrizePool();
      const updatedDecks = { ...state.sessionDecks, main: pool };
      saveToLocalStorage('spin_to_win_decks', updatedDecks);
      return {
        ...state,
        activeSession: 'main',
        sessionDecks: updatedDecks,
        screen: 'loading_session',
      };
    }

    case 'RESET_POOL': {
      if (!state.activeSession) return state;
      const pool = generatePrizePool();
      const updatedDecks = { ...state.sessionDecks, main: pool };
      saveToLocalStorage('spin_to_win_decks', updatedDecks);
      return { ...state, sessionDecks: updatedDecks };
    }

    case 'SUBMIT_INFO': {
      const newUser = action.payload;
      const nextScreen = state.activeSession ? 'spinning' : 'processing';
      return { ...state, user: newUser, screen: nextScreen };
    }

    case 'SET_PRIZE': {
      const awardedPrize = action.payload;
      let updatedDecks = { ...state.sessionDecks };

      if (state.activeSession && state.sessionDecks[state.activeSession]?.length > 0) {
        const deck = [...state.sessionDecks[state.activeSession]];
        deck.splice(0, 1);
        updatedDecks[state.activeSession] = deck;
        saveToLocalStorage('spin_to_win_decks', updatedDecks);
      }

      return {
        ...state,
        screen: 'winner',
        prize: awardedPrize,
        sessionDecks: updatedDecks,
      };
    }

    case 'SAVE_AND_RESET': {
      if (!state.user || !state.prize) return state;
      const newLead = createLead(state.user, state.prize, state.activeSession);
      const updatedLeads = [...state.leads, newLead];
      saveToLocalStorage('spin_to_win_leads', updatedLeads);

      const remainingInSession = state.activeSession
        ? state.sessionDecks[state.activeSession]?.length
        : 0;
      const nextScreen = state.activeSession && remainingInSession > 0 ? 'register' : 'attract';
      const nextSession = remainingInSession > 0 ? state.activeSession : null;

      return {
        ...state,
        screen: nextScreen,
        activeSession: nextSession,
        user: null,
        prize: null,
        leads: updatedLeads,
      };
    }

    case 'REGISTER_LEAD': {
      if (!state.user) return state;
      const newLead = createLead(state.user, null, state.activeSession);
      const updatedLeads = [...state.leads, newLead];
      saveToLocalStorage('spin_to_win_leads', updatedLeads);
      return {
        ...state,
        screen: 'attract',
        user: null,
        prize: null,
        leads: updatedLeads,
      };
    }

    case 'CLEAR_LEADS':
      saveToLocalStorage('spin_to_win_leads', []);
      return { ...state, leads: [] };

    case 'RESET_ALL_DECKS':
      try {
        localStorage.removeItem('spin_to_win_decks');
      } catch (e) {}
      return { ...state, sessionDecks: {}, activeSession: null };

    case 'IDLE_RESET':
      // Only return to attract screen, keep session and leads intact
      return {
        ...state,
        screen: 'attract',
        user: null,
        prize: null,
        // activeSession remains unchanged
      };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, null, getInitialState);

  const exportCSV = () => {
    if (state.leads.length === 0) return;
    const headers = ['ID', 'Timestamp', 'Session', 'Full Name', 'Phone', 'Receipt', 'ID Number', 'Prize'];
    const rows = state.leads.map(lead => [
      lead.id || '',
      lead.timestamp || '',
      `"${lead.session || 'General'}"`,
      `"${(lead.fullName || lead.name || '').replace(/"/g, '""')}"`,
      `"${(lead.phone || '').replace(/"/g, '""')}"`,
      `"${(lead.receipt || '').replace(/"/g, '""')}"`,
      `"${(lead.idNumber || '').replace(/"/g, '""')}"`,
      `"${(lead.prize || '').replace(/"/g, '""')}"`,
    ]);
    const nl = '\n';
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join(nl);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `parkville_raffle_leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <GameContext.Provider value={{ state, dispatch, exportCSV }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
}