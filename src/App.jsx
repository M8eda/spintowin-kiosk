import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider, useGame } from './context/GameContext';
import Layout from './components/Layout';
import AttractScreen from './components/AttractScreen';
import RegisterScreen from './components/RegisterScreen';
import SpinScreen from './components/SpinScreen';
import WinnerScreen from './components/WinnerScreen';
import { Lock, X, Shield, FileSpreadsheet, Play, RotateCcw, Clock } from 'lucide-react';

// Transition screen when an usher triggers an hour
function LoadingSessionScreen({ session, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.1, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 border border-red-500/30 p-10 rounded-[3rem] shadow-2xl flex flex-col items-center max-w-md"
      >
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-400/40 flex items-center justify-center mb-6 animate-pulse">
          <Clock className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-sm font-sans tracking-[0.4em] text-gray-400 uppercase mb-2">Live Raffle Draw</h2>
        <h1 className="text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-red-400 to-red-500 mb-6">
          {session.toUpperCase()} SESSION
        </h1>
        <div className="w-16 h-1 bg-red-500/40 rounded-full mb-6" />
        <p className="text-lg font-serif text-red-100 tracking-wider">Let's Begin!</p>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-2">Good luck to all participants</p>
      </motion.div>
    </div>
  );
}

function SecretAdminButton({ onExport, leadCount }) {
  const { state, dispatch } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('password'); // 'password' | 'admin'
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const taps = useRef(0);
  const timer = useRef(null);

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
    if (pin === '123') {
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
    if (window.confirm('Are you sure you want to reset all hourly draw decks back to 8 prizes each?')) {
      dispatch({ type: 'RESET_ALL_DECKS' });
    }
  };

  const sessions = [
    { label: "7 O'Clock Spin", key: '7pm' },
    { label: "8 O'Clock Spin", key: '8pm' },
    { label: "9 O'Clock Spin", key: '9pm' },
    { label: "10 O'Clock Spin", key: '10pm' },
  ];

  return (
    <>
      <div className="fixed top-0 right-0 w-[80px] h-[80px] z-[9999]" onClick={handleTap} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-white/90 backdrop-blur-2xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[400px] bg-white/95 border border-red-500/25 rounded-[2.5rem] p-8 shadow-2xl shadow-red-500/5 overflow-hidden flex flex-col items-center max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/5 blur-3xl pointer-events-none" />

              <button 
                onClick={closeAdmin}
                className="absolute top-6 right-6 text-gray-500 hover:text-red-400 p-1.5 rounded-full border border-gray-300 hover:border-red-500/30 bg-white/50 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>

              <AnimatePresence mode="wait">
                {currentScreen === 'password' ? (
                  <motion.div
                    key="password-screen"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="w-full flex flex-col items-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-400/25 flex items-center justify-center mb-5">
                      <Lock className="w-7 h-7 text-red-300 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-serif text-red-200 tracking-[0.2em] uppercase text-center">Security Portal</h3>
                    <p className="text-xs text-gray-500 tracking-wider uppercase mt-2 text-center">Authorized Access Only</p>

                    <div className="my-6 w-full flex flex-col items-center gap-2">
                      <div className="h-14 w-full bg-white/60 rounded-2xl border border-gray-300 flex items-center justify-center tracking-[0.5em] text-2xl text-red-400 font-mono">
                        {pin ? 'ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢'.repeat(pin.length) : <span className="text-gray-700 text-sm tracking-widest font-sans uppercase">Enter PIN</span>}
                      </div>
                      {error && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs font-semibold uppercase tracking-wider text-center">
                          {error}
                        </motion.p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3 w-full mb-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button key={num} onClick={() => handleNumberPress(num.toString())} className="h-14 rounded-xl bg-white/40 border border-gray-300/80 hover:border-red-500/40 text-gray-300 font-medium text-xl flex items-center justify-center active:scale-95 transition-all duration-150">
                          {num}
                        </button>
                      ))}
                      <button onClick={handleBackspace} className="h-14 rounded-xl bg-white/40 border border-gray-300/80 hover:border-red-500/40 text-gray-500 hover:text-red-400 text-sm font-semibold flex items-center justify-center active:scale-95 transition-all duration-150 uppercase tracking-wider">
                        Del
                      </button>
                      <button onClick={() => handleNumberPress('0')} className="h-14 rounded-xl bg-white/40 border border-gray-300/80 hover:border-red-500/40 text-gray-300 font-medium text-xl flex items-center justify-center active:scale-95 transition-all duration-150">
                        0
                      </button>
                      <button onClick={handlePinSubmit} className="h-14 rounded-xl bg-red-500 text-black font-bold text-sm flex items-center justify-center active:scale-95 hover:bg-red-400 transition-all duration-150 uppercase tracking-widest">
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
                    className="w-full flex flex-col items-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-400/25 flex items-center justify-center mb-4">
                      <Shield className="w-7 h-7 text-red-300" />
                    </div>
                    <h3 className="text-xl font-serif text-red-200 tracking-[0.2em] uppercase text-center">Event Console</h3>
                    <p className="text-xs text-gray-500 tracking-wider uppercase mt-1 text-center">Raffle & Inventory Control</p>

                    {/* Hourly Draw Launch Buttons */}
                    <div className="w-full my-6 space-y-2.5">
                      <p className="text-[11px] text-red-400/80 tracking-widest uppercase font-semibold mb-2 text-center">Launch Hourly Live Draw</p>
                      {sessions.map((s) => {
                        const deck = state.sessionDecks[s.key];
                        const remaining = deck ? deck.length : 8; // if no deck yet, assume full
                        const isExhausted = deck && deck.length === 0;

                        return (
                          <button
                            key={s.key}
                            onClick={() => startHourlyDraw(s.key)}
                            disabled={isExhausted}
                            className={`w-full py-3.5 px-5 rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center justify-between border transition-all duration-200 ${
                              isExhausted 
                                ? 'bg-white border-gray-300 text-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-gray-900 via-gray-900 to-red-950/40 hover:to-red-900/60 border-red-500/30 text-red-200 active:scale-98 shadow-md'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <Play className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                              {s.label}
                            </span>
                            <span className={`text-[10px] px-2.5 py-1 rounded-full ${isExhausted ? 'bg-white text-gray-600' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                              {isExhausted ? 'Completed' : `${remaining} Left`}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Stats & Actions */}
                    <div className="space-y-3 w-full border-t border-gray-300 pt-4">
                      <motion.button
                        onClick={() => { onExport(); }}
                        disabled={leadCount === 0}
                        className={`w-full py-3.5 rounded-full font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 border transition-all duration-300 ${
                          leadCount > 0 
                            ? 'bg-gradient-to-r from-red-500 to-red-700 text-black border-transparent shadow-lg shadow-red-600/15 active:scale-95' 
                            : 'bg-white text-gray-600 border-gray-300 cursor-not-allowed'
                        }`}
                      >
                        <FileSpreadsheet className="w-4 h-4" strokeWidth={1.5} />
                        Export CSV ({leadCount})
                      </motion.button>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={resetDecks}
                          className="flex-1 py-3 rounded-full font-semibold uppercase tracking-wider text-[10px] border border-gray-300 text-gray-500 hover:border-red-500/40 hover:text-red-400 transition-all flex items-center justify-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Reset Decks
                        </button>
                        <button
                          onClick={closeAdmin}
                          className="flex-1 py-3 rounded-full font-semibold uppercase tracking-wider text-[10px] border border-gray-300 text-gray-400 hover:bg-white/40 hover:text-black transition-all"
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

function Router() {
  const { state, dispatch, exportCSV } = useGame();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {state.screen === 'attract' && (
          <motion.div key="attract" className="absolute inset-0 z-10">
            <AttractScreen onTouch={() => dispatch({ type: 'GO', payload: 'register' })} />
          </motion.div>
        )}
        {state.screen === 'loading_session' && (
          <motion.div key="loading_session" className="absolute inset-0 z-10 flex items-center justify-center">
            <LoadingSessionScreen session={state.activeSession} onComplete={() => dispatch({ type: 'GO', payload: 'register' })} />
          </motion.div>
        )}
        {state.screen === 'register' && (
          <motion.div key="register" className="absolute inset-0 z-10 flex items-center justify-center">
            <RegisterScreen onSubmit={(user) => { dispatch({ type: 'SET_USER', payload: user }); dispatch({ type: 'GO', payload: 'spinning' }); }} />
          </motion.div>
        )}
        {state.screen === 'spinning' && (
          <motion.div key="spinning" className="absolute inset-0 z-10 flex items-center justify-center">
            <SpinScreen onComplete={(prize) => dispatch({ type: 'SET_PRIZE', payload: prize })} />
          </motion.div>
        )}
        {state.screen === 'winner' && (
          <motion.div key="winner" className="absolute inset-0 z-10 flex items-center justify-center">
            <WinnerScreen prize={state.prize} onValidate={() => dispatch({ type: 'SAVE_AND_RESET' })} />
          </motion.div>
        )}
      </AnimatePresence>
      <SecretAdminButton onExport={exportCSV} leadCount={state.leads.length} />
    </Layout>
  );
}

export default function App() {
  return (
    <GameProvider>
      <Router />
    </GameProvider>
  );
}