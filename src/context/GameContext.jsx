import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'parkville_kiosk_leads';

const initialState = {
  screen: 'attract',
  user: { name: '', mobile: '', email: '' },
  prize: null,
  leads: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'GO':
      return { ...state, screen: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_PRIZE':
      return { ...state, prize: action.payload, screen: 'winner' };
    case 'SAVE_AND_RESET': {
      const entry = {
        name: state.user.name,
        mobile: state.user.mobile,
        email: state.user.email,
        prize: state.prize,
        timestamp: new Date().toISOString(),
      };
      const updated = [...state.leads, entry];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { ...initialState, leads: updated };
    }
    case 'LOAD_LEADS':
      return { ...state, leads: action.payload };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'LOAD_LEADS', payload: JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    if (state.screen === 'attract') return;
    const t = setTimeout(() => dispatch({ type: 'SAVE_AND_RESET' }), 60_000);
    return () => clearTimeout(t);
  }, [state.screen]);

  const exportCSV = useCallback(() => {
    if (!state.leads.length) return;
    const header = 'Name,Mobile,Email,Prize,Timestamp';
    const rows = state.leads.map((l) =>
      [l.name, l.mobile, l.email, l.prize, l.timestamp]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parkville-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state.leads]);

  return (
    <GameContext.Provider value={{ state, dispatch, exportCSV }}>
      {children}
    </GameContext.Provider>
  );
}

const GameContext = createContext(null);
export const useGame = () => useContext(GameContext);
