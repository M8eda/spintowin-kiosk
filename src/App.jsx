import { useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider, useGame } from './context/GameContext';
import Layout from './components/Layout';
import AttractScreen from './components/AttractScreen';
import RegisterScreen from './components/RegisterScreen';
import SpinScreen from './components/SpinScreen';
import WinnerScreen from './components/WinnerScreen';

function SecretAdminButton({ onExport, leadCount }) {
  const [visible, setVisible] = useState(false);
  const taps = useRef(0);
  const timer = useRef(null);

  const handleTap = useCallback(() => {
    taps.current += 1;
    if (taps.current >= 3) { setVisible(true); taps.current = 0; }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { taps.current = 0; }, 1500);
  }, []);

  return (
    <>
      <div className="fixed top-0 right-0 w-[60px] h-[60px] z-[999]" onClick={handleTap} />
      <AnimatePresence>
        {visible && (
          <motion.button
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            onClick={() => { onExport(); setVisible(false); }}
            className="fixed top-4 right-4 z-[1000] bg-stone-900/95 text-amber-400 text-[10px] px-4 py-2.5 rounded-full uppercase tracking-widest border border-amber-500/30 backdrop-blur-xl shadow-2xl"
          >
            CSV ({leadCount})
          </motion.button>
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
