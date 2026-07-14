import React, { createContext, useContext, useReducer } from 'react';

// Master list of available segment metadata
export const PRIZES = [
  { id: '1', name: '0.5 g Gold Bar', color: '#F44336', text: '#FFFFFF', emoji: '\uD83E\uDDC8', weight: 1 },
  { id: '2', name: '0.25 g Gold Bar', color: '#FF9800', text: '#1C1917', emoji: '\uD83E\uDDC8', weight: 2 },
  { id: '3', name: 'Smart Earbuds', color: '#FFEB3B', text: '#1C1917', emoji: '\uD83C\uDFA7', weight: 5 },
  { id: '4', name: 'Smartwatch', color: '#4CAF50', text: '#FFFFFF', emoji: '\u231A', weight: 4 },
  { id: '5', name: 'Gold Pound', color: '#2196F3', text: '#FFFFFF', emoji: '\uD83E\uDE99', weight: 1 },
  { id: '6', name: '1,000 Reward Points', color: '#9C27B0', text: '#FFFFFF', emoji: '\uD83C\uDFAB\uFE0F', weight: 30 },
  { id: '7', name: '3,000 Reward Points', color: '#00BCD4', text: '#1C1917', emoji: '\uD83C\uDFAB\uFE0F', weight: 15 },
  { id: '8', name: 'Giveaway Item', color: '#795548', text: '#FFFFFF', emoji: '\uD83C\uDF81', weight: 42 }
];

// Prize inventory â€“ names only (will be mapped to objects)
const HOURLY_INVENTORY_NAMES = {
  '7pm': ['0.5 g Gold Bar', 'Smart Earbuds', '1,000 Reward Points', '1,000 Reward Points', '3,000 Reward Points', '3,000 Reward Points', 'Giveaway Item', 'Giveaway Item'],
  '8pm': ['Gold Pound', 'Smartwatch', '0.25 g Gold Bar', '1,000 Reward Points', '1,000 Reward Points', '3,000 Reward Points', '3,000 Reward Points', 'Giveaway Item', 'Giveaway Item'],
  '9pm': ['0.25 g Gold Bar', '0.25 g Gold Bar', 'Smart Earbuds', '1,000 Reward Points', '1,000 Reward Points', '3,000 Reward Points', '3,000 Reward Points', 'Giveaway Item', 'Giveaway Item'],
  '10pm': ['Gold Pound', 'Smart Earbuds', '1,000 Reward Points', '1,000 Reward Points', '3,000 Reward Points', '3,000 Reward Points', 'Giveaway Item', 'Giveaway Item']
};

// Helper: map names to full prize objects
function mapInventoryToPrizeObjects(names) {
  return names.map(name => {
    const prize = PRIZES.find(p => p.name === name);
    if (!prize) {
      console.warn(`Prize "${name}" not found in PRIZES`);
      return null;
    }
    return { ...prize }; // clone to avoid mutation
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
  try {
    const savedLeads = localStorage.getItem('spin_to_win_leads');
    const savedDecks = localStorage.getItem('spin_to_win_decks');
    return {
      ...initialState,
      leads: savedLeads ? JSON.parse(savedLeads) : [],
      sessionDecks: savedDecks ? JSON.parse(savedDecks) : {}
    };
  } catch (e) {
    return initialState;
  }
};

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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
      // If deck doesn't exist or is empty, build it from inventory
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
      try {
        localStorage.setItem('spin_to_win_decks', JSON.stringify(updatedDecks));
      } catch (e) {}
      return {
        ...state,
        activeSession: sessionKey,
        sessionDecks: updatedDecks,
        screen: 'loading_session'
      };
    }

    case 'SET_PRIZE': {
      // action.payload is the prize object chosen by SpinScreen
      const awardedPrize = action.payload;
      let updatedDecks = { ...state.sessionDecks };

      if (state.activeSession && state.sessionDecks[state.activeSession]?.length > 0) {
        const deck = [...state.sessionDecks[state.activeSession]];
        // Remove the prize with matching id
        const index = deck.findIndex(p => p.id === awardedPrize.id);
        if (index !== -1) {
          deck.splice(index, 1);
          updatedDecks[state.activeSession] = deck;
          try {
            localStorage.setItem('spin_to_win_decks', JSON.stringify(updatedDecks));
          } catch (e) {}
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
      const newLead = {
        id: (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        session: state.activeSession || 'General',
        name: state.user.name,
        email: state.user.email,
        mobile: state.user.mobile,        // keep original
        phone: state.user.mobile,         // add phone for CSV compatibility
        prize: state.prize.name
      };
      const updatedLeads = [...state.leads, newLead];
      try {
        localStorage.setItem('spin_to_win_leads', JSON.stringify(updatedLeads));
      } catch (e) {}

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

    case 'CLEAR_LEADS':
      try {
        localStorage.removeItem('spin_to_win_leads');
      } catch (e) {}
      return { ...state, leads: [] };

    case 'RESET_ALL_DECKS':
      try {
        localStorage.removeItem('spin_to_win_decks');
      } catch (e) {}
      return { ...state, sessionDecks: {}, activeSession: null };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, null, getInitialState);

  const exportCSV = () => {
    if (state.leads.length === 0) return;
    const headers = ['ID', 'Timestamp', 'Session', 'Name', 'Email', 'Phone', 'Prize'];
    const rows = state.leads.map(lead => [
      lead.id,
      lead.timestamp,
      `"${lead.session || 'General'}"`,
      `"${lead.name.replace(/"/g, '""')}"`,
      lead.email,
      `"${lead.phone || lead.mobile || ''}"`,  // fallback to mobile
      `"${lead.prize}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
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