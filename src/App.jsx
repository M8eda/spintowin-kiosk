import { useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider, useGame } from './context/GameContext';
import AttractScreen from './components/AttractScreen';
import RegisterScreen from './components/RegisterScreen';
import SpinScreen from './components/SpinScreen';
import WinnerScreen from './components/WinnerScreen';

const pageVariants = {
  initial: { opacity: 0, filter: 'blur(16px)', scale: 0.96 },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    filter: 'blur(16px)',
    scale: 1.04,
    transition: { duration: 0.35, ease: 'easeIn' },
  },
};

function SecretAdminButton({ onExport, leadCount }) {
  const [visible, setVisible] = useState(false);
  const taps = useRef(0);
  const timer = useRef(null);

  const handleTap = useCallback(() => {
    taps.current += 1;
    if (taps.current >= 3) {
      setVisible(true);
      taps.current = 0;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { taps.current = 0; }, 1500);
  }, []);

  return (
    <>
      <div
        className="fixed top-0 right-0 w-[70px] h-[70px] z-[999]"
        onClick={handleTap}
      />
      <AnimatePresence>
        {visible && (
          <motion.button
            initial={{ opacity: 0, y: -15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.9 }}
            onClick={() => { onExport(); setVisible(false); }}
            className="fixed top-5 right-5 z-[1000] bg-stone-900/95 text-amber-400 text-[11px] px-4 py-2.5 rounded-full uppercase tracking-widest border border-amber-500/30 backdrop-blur-xl shadow-2xl"
          >
            Export CSV ({leadCount})
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

function Router() {
  const { state, dispatch, exportCSV } = useGame();

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#0a0a0f] text-white antialiased">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[120vw] h-[120vw] rounded-full bg-amber-500/6 blur-[120px]" />
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] rounded-full bg-rose-500/5 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] rounded-full bg-yellow-500/4 blur-[100px]" />
      </div>

      <AnimatePresence mode="wait">
        {state.screen === 'attract' && (
          <motion.div key="attract" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="relative z-10 h-full w-full">
            <AttractScreen onTouch={() => dispatch({ type: 'GO', payload: 'register' })} />
          </motion.div>
        )}
        {state.screen === 'register' && (
          <motion.div key="register" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="relative z-10 h-full w-full flex items-center justify-center">
            <RegisterScreen
              onSubmit={(user) => {
                dispatch({ type: 'SET_USER', payload: user });
                dispatch({ type: 'GO', payload: 'spinning' });
              }}
            />
          </motion.div>
        )}
        {state.screen === 'spinning' && (
          <motion.div key="spinning" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="relative z-10 h-full w-full flex items-center justify-center">
            <SpinScreen
              onComplete={(prize) => dispatch({ type: 'SET_PRIZE', payload: prize })}
            />
          </motion.div>
        )}
        {state.screen === 'winner' && (
          <motion.div key="winner" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="relative z-10 h-full w-full flex items-center justify-center">
            <WinnerScreen
              prize={state.prize}
              onValidate={() => dispatch({ type: 'SAVE_AND_RESET' })}
            />
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
