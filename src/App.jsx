import { useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider, useGame } from './context/GameContext';
import AttractScreen from './components/AttractScreen';
import RegisterScreen from './components/RegisterScreen';
import SpinScreen from './components/SpinScreen';
import WinnerScreen from './components/WinnerScreen';

const pageVariants = {
  initial: { opacity: 0, scale: 0.97, filter: 'blur(8px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, scale: 1.03, filter: 'blur(8px)', transition: { duration: 0.3 } },
};

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
    <div className="fixed inset-0 bg-[#08080c] text-white antialiased overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150vw] h-[50vh] rounded-full bg-amber-500/5 blur-[150px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150vw] h-[40vh] rounded-full bg-rose-600/4 blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">
        {state.screen === 'attract' && (
          <motion.div key="attract" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-10">
            <AttractScreen onTouch={() => dispatch({ type: 'GO', payload: 'register' })} />
          </motion.div>
        )}
        {state.screen === 'register' && (
          <motion.div key="register" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-10 flex items-center justify-center">
            <RegisterScreen onSubmit={(user) => { dispatch({ type: 'SET_USER', payload: user }); dispatch({ type: 'GO', payload: 'spinning' }); }} />
          </motion.div>
        )}
        {state.screen === 'spinning' && (
          <motion.div key="spinning" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-10 flex items-center justify-center">
            <SpinScreen onComplete={(prize) => dispatch({ type: 'SET_PRIZE', payload: prize })} />
          </motion.div>
        )}
        {state.screen === 'winner' && (
          <motion.div key="winner" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-10 flex items-center justify-center">
            <WinnerScreen prize={state.prize} onValidate={() => dispatch({ type: 'SAVE_AND_RESET' })} />
          </motion.div>
        )}
      </AnimatePresence>

      <SecretAdminButton onExport={exportCSV} leadCount={state.leads.length} />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <Router />
    </GameProvider>
  );
}
