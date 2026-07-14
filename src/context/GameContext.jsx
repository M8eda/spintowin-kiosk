import React, { createContext, useContext, useReducer } from 'react';

export const PRIZES = [
  { id: '1', name: '0.5 g Gold Bar', color: '#F44336', text: '#FFFFFF', emoji: '🧈', weight: 1 },
  { id: '2', name: '0.25 g Gold Bar', color: '#FF9800', text: '#1C1917', emoji: '🧈', weight: 2 },
  { id: '3', name: 'Smart Earbuds', color: '#FFEB3B', text: '#1C1917', emoji: '🎧', weight: 5 },
  { id: '4', name: 'Smartwatch', color: '#4CAF50', text: '#FFFFFF', emoji: '⌚', weight: 4 },
  { id: '5', name: 'Gold Pound', color: '#2196F3', text: '#FFFFFF', emoji: '🪙', weight: 1 },
  { id: '6', name: '1,000 Reward Points', color: '#9C27B0', text: '#FFFFFF', emoji: '🎫️', weight: 30 },
  { id: '7', name: '3,000 Reward Points', color: '#00BCD4', text: '#1C1917', emoji: '🎫️', weight: 15 },
  { id: '8', name: 'Giveaway Item', color: '#795548', text: '#FFFFFF', emoji: '🎁', weight: 42 }
];

const HOURLY_INVENTORY_NAMES = {
  '7pm': ['0.5 g Gold Bar', 'Smart Earbuds', '1,000 Reward Points', '1,000 Reward Points', '3,000 Reward Points', '3,000 Reward Points', 'Giveaway Item', 'Giveaway Item'],
  '8pm': ['Gold Pound', 'Smartwatch', '0.25 g Gold Bar', '1,000 Reward Points', '1,000 Reward Points', '3,000 Reward Points', '3,000 Reward Points', 'Giveaway Item', 'Giveaway Item'],
  '9pm': ['0.25 g Gold Bar', '0.25 g Gold Bar', 'Smart Earbuds', '1,000 Reward Points', '1,000 Reward Points', '3,000 Reward Points', '3,000 Reward Points', 'Giveaway Item', 'Giveaway Item'],
  '10pm': ['Gold Pound', 'Smart Earbuds', '1,000 Reward Points', '1,000 Reward Points', '3,000 Reward Points', '3,000 Reward Points', 'Giveaway Item', 'Giveaway Item']
};

function mapInventoryToPrizeObjects(names) {
  return names.map(name => {
    const prize = PRIZES.find(p => p.name === name);
    if (!prize) {
      console.warn(`Prize "${name}" not found in PRIZES`);
      return null;
    }
    return { ...prize };
  }).filter(p => p !== null);
}

const GameContext = createContext();

const initialState = {
  screen: 'attract',
  activeSession: null,
  user: null,
  prize: null,
  leads: [],
  sessionDecks: {}
};

const getInitialState = () => {
  const savedLeads = loadFromLocalStorage('spin_to_win_leads');
  const savedDecks = loadFromLocalStorage('spin_to_win_decks');
  return {
    ...initialState,
    leads: savedLeads || [],
    sessionDecks: savedDecks || {}
  };
};

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Helper: Create a lead object from user data
 * Ensures consistent lead structure across the app
 */
function createLead(user, prize, activeSession) {
  return {
    id: (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    session: activeSession || 'General',
    fullName: user?.fullName || user?.name || '',
    phone: user?.phone || '',
    receipt: user?.receipt || '',
    idNumber: user?.idNumber || '',
    prize: prize?.name || 'Registered for Event'
  };
}

/**
 * Helper: Safely save data to localStorage with error reporting
 */
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

/**
 * Helper: Safely read data from localStorage
 */
function loadFromLocalStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Failed to load from localStorage (${key}):`, error);
    return null;
  }
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'GO':
      return { ...state, screen: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'START_SESSION': {
      const sessionKey = action.payload;
      let currentDeck = state.sessionDecks[sessionKey];
      if (!currentDeck || currentDeck.length === 0) {
        const names = HOURLY_INVENTORY_NAMES[sessionKey];
        if (!names) {
          console.error(`No inventory for ${sessionKey}`);
          return state;
        }
        const prizeObjects = mapInventoryToPrizeObjects(names);
        currentDeck = shuffleArray(prizeObjects);
      }
      const updatedDecks = { ...state.sessionDecks, [sessionKey]: currentDeck };
      saveToLocalStorage('spin_to_win_decks', updatedDecks);
      return {
        ...state,
        activeSession: sessionKey,
        sessionDecks: updatedDecks,
        screen: 'loading_session'
      };
    }

    // Centralized submit: decides next screen based on activeSession
    case 'SUBMIT_INFO': {
      const newUser = action.payload;
      // If an hourly draw is active, go directly to spinning (skip processing)
      const nextScreen = state.activeSession ? 'spinning' : 'processing';
      return { ...state, user: newUser, screen: nextScreen };
    }

    case 'SET_PRIZE': {
      const awardedPrize = action.payload;
      let updatedDecks = { ...state.sessionDecks };

      if (state.activeSession && state.sessionDecks[state.activeSession]?.length > 0) {
        const deck = [...state.sessionDecks[state.activeSession]];
        const index = deck.findIndex(p => p.id === awardedPrize.id);
        if (index !== -1) {
          deck.splice(index, 1);
          updatedDecks[state.activeSession] = deck;
          saveToLocalStorage('spin_to_win_decks', updatedDecks);
        }
      }

      return {
        ...state,
        screen: 'winner',
        prize: awardedPrize,
        sessionDecks: updatedDecks
      };
    }

    case 'SAVE_AND_RESET': {
      if (!state.user || !state.prize) return state;
      const newLead = createLead(state.user, state.prize, state.activeSession);
      const updatedLeads = [...state.leads, newLead];
      saveToLocalStorage('spin_to_win_leads', updatedLeads);

      const remainingInSession = state.activeSession ? state.sessionDecks[state.activeSession]?.length : 0;
      const nextScreen = (state.activeSession && remainingInSession > 0) ? 'register' : 'attract';
      const nextSession = (remainingInSession > 0) ? state.activeSession : null;

      return {
        ...state,
        screen: nextScreen,
        activeSession: nextSession,
        user: null,
        prize: null,
        leads: updatedLeads
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
        leads: updatedLeads
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
      // Return to attract and forget any half‑filled registration
      return {
        ...state,
        screen: 'attract',
        user: null,
        prize: null,
        activeSession: null,
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
      `"${(lead.prize || '').replace(/"/g, '""')}"`
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
