import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame, HOURLY_INVENTORY_NAMES } from '../context/GameContext';
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
    setPin(e.target.value.slice(0, 8));
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

  // --- Triple-tap detection ---
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
            className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-modal-title"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[460px] bg-white border border-gray-200 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col items-center max-h-[92vh] overflow-y-auto"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-red-500/10 blur-3xl pointer-events-none" />

              <button
                onClick={closeAdmin}
                aria-label="Close admin portal"
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 p-2.5 rounded-full border border-gray-200 hover:border-gray-400 bg-white/80 active:scale-90 transition-all duration-200 z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <AnimatePresence mode="wait">
                {currentScreen === 'password' ? (
                  <motion.div
                    key="password-screen"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="w-full flex flex-col items-center mt-2"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4 shadow-inner">
                      <Lock className="w-9 h-9 text-red-600" aria-hidden="true" />
                    </div>
                    <h3 id="admin-modal-title" className="text-2xl font-bold font-sans text-gray-900 tracking-wider uppercase text-center">
                      Security Portal
                    </h3>
                    <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mt-1 text-center">
                      Authorized Access Only
                    </p>

                    <div className="my-6 w-full flex flex-col items-center gap-2">
                      <div className="relative h-16 w-full">
                        <div className="h-16 w-full bg-gray-50 rounded-2xl border-2 border-gray-200 flex items-center justify-center tracking-[0.5em] text-3xl text-gray-800 font-mono shadow-inner" aria-live="polite">
                          {pin ? '●'.repeat(pin.length) : <span className="text-gray-400 text-sm tracking-widest font-sans uppercase font-medium">Enter PIN</span>}
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
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-600 text-xs font-bold uppercase tracking-wider text-center mt-1" role="alert">
                          {error}
                        </motion.p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3 w-full mb-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleNumberPress(num.toString())}
                          aria-label={`Enter digit ${num}`}
                          className="h-16 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 font-bold text-2xl flex items-center justify-center active:scale-[0.96] transition-all duration-150 shadow-sm"
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        onClick={handleBackspace}
                        aria-label="Delete last digit"
                        className="h-16 rounded-2xl bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-500 hover:text-red-600 text-base font-bold flex items-center justify-center active:scale-[0.96] transition-all duration-150 uppercase tracking-wider shadow-sm"
                      >
                        Del
                      </button>
                      <button
                        onClick={() => handleNumberPress('0')}
                        aria-label="Enter digit 0"
                        className="h-16 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 font-bold text-2xl flex items-center justify-center active:scale-[0.96] transition-all duration-150 shadow-sm"
                      >
                        0
                      </button>
                      <button
                        onClick={handlePinSubmit}
                        aria-label="Submit PIN"
                        className="h-16 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-base flex items-center justify-center active:scale-[0.96] transition-all duration-150 uppercase tracking-widest shadow-md shadow-red-600/20"
                      >
                        Enter
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="admin-screen"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full flex flex-col items-center mt-2"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-3 shadow-inner">
                      <Shield className="w-9 h-9 text-red-600" aria-hidden="true" />
                    </div>

                    <h3 className="text-2xl font-black font-sans text-gray-900 tracking-wider uppercase text-center mb-6">
                      Event Console
                    </h3>

                    {/* Hourly Draw Buttons – no numbers */}
                    <div className="w-full space-y-3 mb-6">
                      <p className="text-xs text-gray-400 tracking-widest uppercase font-bold px-1">
                        Launch Live Draw
                      </p>
                      {sessions.map((s) => {
                        const deck = state.sessionDecks[s.key];
                        const isExhausted = deck && deck.length === 0;
                        return (
                          <button
                            key={s.key}
                            onClick={() => startHourlyDraw(s.key)}
                            disabled={isExhausted}
                            aria-label={`Start ${s.label}`}
                            className={`w-full py-4 px-5 rounded-2xl font-bold uppercase tracking-wider text-sm sm:text-base flex items-center justify-between border-2 transition-all duration-200 ${
                              isExhausted
                                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-900 hover:bg-black border-transparent text-white active:scale-[0.98] shadow-md hover:shadow-lg'
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <Play className={`w-5 h-5 ${isExhausted ? 'text-gray-400 fill-gray-400' : 'text-red-500 fill-red-500'}`} aria-hidden="true" />
                              {s.label}
                            </span>
                            {/* badge removed completely */}
                          </button>
                        );
                      })}
                    </div>

                    {/* Data Management */}
                    <div className="w-full space-y-3 pt-6 border-t border-gray-200">
                      <p className="text-xs text-gray-400 tracking-widest uppercase font-bold px-1">
                        Data Management
                      </p>
                      <motion.button
                        onClick={() => { onExport(); }}
                        disabled={leadCount === 0}
                        aria-label={`Export CSV with ${leadCount} leads`}
                        className={`w-full py-4 rounded-2xl font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-3 border transition-all duration-200 ${
                          leadCount > 0
                            ? 'bg-red-600 hover:bg-red-500 text-white border-transparent shadow-lg shadow-red-600/20 active:scale-[0.98]'
                            : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        <FileSpreadsheet className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
                        Export CSV ({leadCount})
                      </motion.button>

                      {!showClearPrompt ? (
                        <button
                          onClick={() => setShowClearPrompt(true)}
                          className="w-full py-4 rounded-2xl font-bold uppercase tracking-wider text-xs border-2 border-gray-200 text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                          <Trash2 className="w-4 h-4" /> Clear All Leads
                        </button>
                      ) : (
                        <div className="p-4 bg-gray-50 border border-red-200 rounded-2xl space-y-3 w-full">
                          <p className="text-xs font-bold text-red-600 uppercase tracking-wider text-center">
                            Confirm Leads Deletion
                          </p>
                          <input
                            type="password"
                            placeholder="Enter PIN"
                            value={clearPassword}
                            onChange={(e) => { setClearPassword(e.target.value); setClearError(''); }}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-center font-mono text-lg tracking-widest focus:outline-none focus:border-red-500"
                            autoFocus
                          />
                          {clearError && <p className="text-red-600 font-bold text-xs text-center">{clearError}</p>}
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setShowClearPrompt(false); setClearPassword(''); setClearError(''); }}
                              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold text-xs uppercase tracking-wider active:scale-95 transition-all"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleClearLeads}
                              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all"
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* System Controls */}
                    <div className="w-full pt-6 mt-6 border-t border-gray-200 flex gap-3">
                      <button
                        onClick={resetDecks}
                        aria-label="Reset all hourly draw decks"
                        className="flex-1 py-4 rounded-2xl font-bold uppercase tracking-wider text-xs border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" aria-hidden="true" /> Reset Decks
                      </button>
                      <button
                        onClick={closeAdmin}
                        aria-label="Exit admin console"
                        className="flex-1 py-4 rounded-2xl font-bold uppercase tracking-wider text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 active:scale-[0.98] transition-all text-center"
                      >
                        Exit Console
                      </button>
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