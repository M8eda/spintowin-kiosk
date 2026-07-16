import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider, useGame } from './context/GameContext';
import Layout from './components/Layout';
import AttractScreen from './components/AttractScreen';
import RegisterScreen from './components/RegisterScreen';
import ProcessingScreen from './components/ProcessingScreen';
import SpinScreen from './components/SpinScreen';
import WinnerScreen from './components/WinnerScreen';
import AdminPortal from './components/AdminPortal';
import { Clock } from 'lucide-react';
import { useIdleTimer } from './hooks/useIdleTimer';

// ----- Loading Session Screen (unchanged) -----
function LoadingSessionScreen({ session, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 2500);
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

// ----- Router (with idle timer) -----
function Router() {
  const { state, dispatch, exportCSV } = useGame();

  const handleIdleReset = useCallback(() => {
    dispatch({ type: 'IDLE_RESET' });
  }, [dispatch]);

  // Disable idle timer while an admin session is active
  useIdleTimer(handleIdleReset, 60000, !state.activeSession);

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
            <RegisterScreen onSubmit={(user) => dispatch({ type: 'SUBMIT_INFO', payload: user })} />
          </motion.div>
        )}
        {state.screen === 'processing' && (
          <motion.div key="processing" className="absolute inset-0 z-10 flex items-center justify-center">
            <ProcessingScreen onComplete={() => dispatch({ type: 'REGISTER_LEAD' })} />
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
      <AdminPortal onExport={exportCSV} leadCount={state.leads.length} />
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