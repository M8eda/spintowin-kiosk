import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { HOURLY_INVENTORY_NAMES } from '../context/GameContext'; // <-- import
import { Lock, X, Shield, FileSpreadsheet, Play, RotateCcw, Trash2 } from 'lucide-react';

export default function AdminPortal({ onExport, leadCount }) {
  const { state, dispatch } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('password');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const taps = useRef(0);
  const timer = useRef(null);

  // --- Physical keyboard capture for PIN screen ---
  const pinInputRef = useRef(null);

  useEffect(() => {
    if (currentScreen === 'password' && isOpen && pinInputRef.current) {
      pinInputRef.current.focus();
    }
  }, [currentScreen, isOpen]);

  const handlePinChange = (e) => {
    setPin(e.target.value.slice(0, 8)); // max 8 digits
    setError('');
  };

  const handlePinKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handlePinSubmit();
    }
  };

  // --- Clear Leads sub-state ---
  const [showClearPrompt, setShowClearPrompt] = useState(false);
  const [clearPassword, setClearPassword] = useState('');
  const [clearError, setClearError] = useState('');

  const handleClearLeads = () => {
    if (clearPassword === '1234') {
      dispatch({ type: 'CLEAR_LEADS' });
      setShowClearPrompt(false);
      setClearPassword('');
      setClearError('');
    } else {
      setClearError('Incorrect password');
      setClearPassword('');
    }
  };

  // --- Triple-tap detection unchanged ---
  const handleTap = useCallback(() => {
    taps.current += 1;
    if (taps.current >= 3) {
      setIsOpen(true);
      setCurrentScreen('password');
      setPin('');
      setError('');
      taps.current = 0;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { taps.current = 0; }, 1500);
  }, []);

  const closeAdmin = () => {
    setIsOpen(false);
    setPin('');
    setError('');
    setShowClearPrompt(false);
    setClearPassword('');
    setClearError('');
  };

  const handleNumberPress = (num) => {
    setError('');
    if (pin.length >= 8) return;
    setPin(p => p + num);
  };

  const handleBackspace = () => {
    setPin(p => p.slice(0, -1));
  };

  const handlePinSubmit = (e) => {
    if (e) e.preventDefault();
    const correctPin = import.meta.env.VITE_ADMIN_PIN || '123';
    if (pin === correctPin) {
      setCurrentScreen('admin');
      setPin('');
      setError('');
    } else {
      setError('Invalid Access PIN');
      setPin('');
    }
  };

  const startHourlyDraw = (hourKey) => {
    dispatch({ type: 'START_SESSION', payload: hourKey });
    closeAdmin();
  };

  const resetDecks = () => {
    if (window.confirm('Are you sure you want to reset all hourly draw decks back to their original prizes?')) {
      dispatch({ type: 'RESET_ALL_DECKS' });
    }
  };

  // Sessions renamed and with correct max counts
  const sessions = [
    { label: 'Session 1', key: '7pm' },
    { label: 'Session 2', key: '8pm' },
    { label: 'Session 3', key: '9pm' },
    { label: 'Session 4', key: '10pm' },
  ];

  return (
    <>
      <div
        className="fixed top-0 right-0 w-[80px] h-[80px] z-[9999]"
        onClick={handleTap}
        aria-label="Admin access trigger"
        role="button"
        tabIndex={0}
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-white/90 backdrop-blur-2xl flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-modal-title"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[420px] bg-white/95 border border-red-500/25 rounded-[3rem] p-8 shadow-2xl shadow-red-500/5 overflow-hidden flex flex-col items-center max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/5 blur-3xl pointer-events-none" />
              <button
                onClick={closeAdmin}
                aria-label="Close admin portal"
                className="absolute top-6 right-6 text-gray-500 hover:text-red-400 p-2 rounded-full border border-gray-300 hover:border-red-500/30 bg-white/50 transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>

              <AnimatePresence mode="wait">
                {currentScreen === 'password' ? (
                  <motion.div key="password-screen" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="w-full flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-400/25 flex items-center justify-center mb-5">
                      <Lock className="w-9 h-9 text-red-300 animate-pulse" aria-hidden="true" />
                    </div>
                    <h3 id="admin-modal-title" className="text-2xl font-serif text-red-200 tracking-[0.2em] uppercase text-center">Security Portal</h3>
                    <p className="text-sm text-gray-500 tracking-wider uppercase mt-2 text-center">Authorized Access Only</p>
                    
                    {/* PIN display + hidden input for physical keyboard */}
                    <div className="my-8 w-full flex flex-col items-center gap-3">
                      <div className="relative h-16 w-full">
                        <div className="h-16 w-full bg-white/60 rounded-2xl border-2 border-gray-300 flex items-center justify-center tracking-[0.5em] text-3xl text-red-400 font-mono" aria-live="polite">
                          {pin ? '●'.repeat(pin.length) : <span className="text-gray-700 text-base tracking-widest font-sans uppercase">Enter PIN</span>}
                        </div>
                        <input
                          ref={pinInputRef}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          autoComplete="off"
                          value={pin}
                          onChange={handlePinChange}
                          onKeyDown={handlePinKeyDown}
                          className="absolute inset-0 opacity-0 cursor-default"
                          aria-hidden="true"
                        />
                      </div>
                      {error && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm font-semibold uppercase tracking-wider text-center" role="alert">{error}</motion.p>
                      )}
                    </div>

                    {/* Numpad (still works) */}
                    <div className="grid grid-cols-3 gap-4 w-full mb-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleNumberPress(num.toString())}
                          aria-label={`Enter digit ${num}`}
                          className="h-16 rounded-2xl bg-white/40 border-2 border-gray-300/80 hover:border-red-500/40 text-gray-700 font-bold text-2xl flex items-center justify-center active:scale-95 transition-all duration-150"
                        >
                          {num}
                        </button>
                      ))}
                      <button onClick={handleBackspace} aria-label="Delete last digit" className="h-16 rounded-2xl bg-white/40 border-2 border-gray-300/80 hover:border-red-500/40 text-gray-500 hover:text-red-400 text-base font-semibold flex items-center justify-center active:scale-95 transition-all duration-150 uppercase tracking-wider">Del</button>
                      <button onClick={() => handleNumberPress('0')} aria-label="Enter digit 0" className="h-16 rounded-2xl bg-white/40 border-2 border-gray-300/80 hover:border-red-500/40 text-gray-700 font-bold text-2xl flex items-center justify-center active:scale-95 transition-all duration-150">0</button>
                      <button onClick={handlePinSubmit} aria-label="Submit PIN" className="h-16 rounded-2xl bg-red-500 text-white font-bold text-lg flex items-center justify-center active:scale-95 hover:bg-red-400 transition-all duration-150 uppercase tracking-widest">Enter</button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="admin-screen" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-400/25 flex items-center justify-center mb-4">
                      <Shield className="w-9 h-9 text-red-300" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-serif text-red-200 tracking-[0.2em] uppercase text-center">Event Console</h3>
                    <p className="text-sm text-gray-500 tracking-wider uppercase mt-1 text-center">Raffle & Inventory Control</p>

                    {/* Hourly Draw Buttons */}
                    <div className="w-full my-8 space-y-4">
                      <p className="text-sm text-red-400/80 tracking-widest uppercase font-semibold mb-3 text-center">Launch Hourly Live Draw</p>
                      {sessions.map((s) => {
                        const deck = state.sessionDecks[s.key];
                        const maxForSession = HOURLY_INVENTORY_NAMES[s.key]?.length || 8;
                        const remaining = deck ? deck.length : maxForSession;
                        const isExhausted = deck && deck.length === 0;
                        return (
                          <button
                            key={s.key}
                            onClick={() => startHourlyDraw(s.key)}
                            disabled={isExhausted}
                            aria-label={`Start ${s.label} (${remaining} prizes remaining)`}
                            className={`w-full py-5 px-6 rounded-2xl font-bold uppercase tracking-wider text-base flex items-center justify-between border-2 transition-all duration-200 ${
                              isExhausted
                                ? 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-gray-900 via-gray-900 to-red-950/40 hover:to-red-900/60 border-red-500/40 text-red-200 active:scale-[0.98] shadow-lg'
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <Play className="w-5 h-5 text-red-400 fill-red-400" aria-hidden="true" />
                              {s.label}
                            </span>
                            <span className={`text-sm px-3 py-1.5 rounded-full font-semibold ${
                              isExhausted ? 'bg-gray-100 text-gray-600' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}>
                              {isExhausted ? 'Completed' : remaining}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div className="space-y-4 w-full border-t border-gray-300 pt-6">
                      <motion.button
                        onClick={() => { onExport(); }}
                        disabled={leadCount === 0}
                        aria-label={`Export CSV with ${leadCount} leads`}
                        className={`w-full py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-base flex items-center justify-center gap-3 border-2 transition-all duration-300 ${
                          leadCount > 0
                            ? 'bg-gradient-to-r from-red-500 to-red-700 text-white border-transparent shadow-lg shadow-red-600/15 active:scale-95'
                            : 'bg-gray-50 text-gray-500 border-gray-300 cursor-not-allowed'
                        }`}
                      >
                        <FileSpreadsheet className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
                        Export CSV ({leadCount})
                      </motion.button>

                      {/* Clear All Leads button */}
                      {!showClearPrompt ? (
                        <button
                          onClick={() => setShowClearPrompt(true)}
                          className="w-full py-4 rounded-2xl font-semibold uppercase tracking-wider text-sm border-2 border-gray-300 text-gray-600 hover:border-red-500/40 hover:text-red-400 transition-all flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Clear All Leads
                        </button>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <input
                              type="password"
                              placeholder="Password"
                              value={clearPassword}
                              onChange={(e) => { setClearPassword(e.target.value); setClearError(''); }}
                              className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-300 text-center"
                              autoFocus
                            />
                            <button
                              onClick={handleClearLeads}
                              className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => { setShowClearPrompt(false); setClearPassword(''); setClearError(''); }}
                              className="px-4 py-2 bg-gray-200 rounded-xl"
                            >
                              Cancel
                            </button>
                          </div>
                          {clearError && <p className="text-red-500 text-xs text-center">{clearError}</p>}
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={resetDecks}
                          aria-label="Reset all hourly draw decks"
                          className="flex-1 py-4 rounded-2xl font-semibold uppercase tracking-wider text-sm border-2 border-gray-300 text-gray-600 hover:border-red-500/40 hover:text-red-400 transition-all flex items-center justify-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" aria-hidden="true" /> Reset Decks
                        </button>
                        <button
                          onClick={closeAdmin}
                          aria-label="Exit admin console"
                          className="flex-1 py-4 rounded-2xl font-semibold uppercase tracking-wider text-sm border-2 border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-black transition-all"
                        >
                          Exit Console
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}