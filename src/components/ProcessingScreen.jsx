import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  { progress: 0, icon: '📄', text: 'Processing your information...' },
  { progress: 30, icon: '🛡️', text: 'Verifying details...' },
  { progress: 60, icon: '⚙️', text: 'Information verified!' },
  { progress: 80, icon: '✅', text: 'Registration successful!' },
  { progress: 100, icon: '❤️', text: 'Thank you for choosing Delmar & Attalla' },
];

export default function ProcessingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 6000;
    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const p = Math.min((elapsed / duration) * 100, 100);
      setProgress(p);
      if (p < 100) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(onComplete, 3000);
      }
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  const currentMessage = [...messages].reverse().find(m => progress >= m.progress) || messages[0];
  const isFinished = progress >= 100;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-stone-50 p-6 overflow-y-auto">
      {/* Ambient glow */}
      <div className="absolute w-[500px] h-[500px] bg-red-100 rounded-full blur-[120px] opacity-50 pointer-events-none" />

      {/* Card – now with a maximum height and internal scroll if needed */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white/70 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-sm w-full flex flex-col items-center gap-6 sm:gap-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Dynamic Icon Container */}
        <motion.div
          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-lg ${
            isFinished ? 'bg-red-600' : 'bg-stone-200'
          }`}
          animate={isFinished ? { scale: [1, 1.1, 1], backgroundColor: '#dc2626' } : { scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            key={currentMessage.icon}
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-sm"
          >
            <span className="text-2xl sm:text-3xl">{currentMessage.icon}</span>
          </motion.div>
        </motion.div>

        {/* Dynamic Text */}
        <div className="min-h-[60px] flex items-center justify-center text-center w-full px-2">
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentMessage.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`font-medium leading-snug text-lg sm:text-xl ${
                isFinished ? 'text-red-700' : 'text-stone-800'
              }`}
            >
              {currentMessage.text}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Progress Bar – now safely inside the card */}
        <div className="w-full">
          <div className="w-full h-3 rounded-full bg-stone-200/50 backdrop-blur-sm overflow-hidden border border-stone-200/50">
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-full relative"
              style={{ width: progress + '%' }}
              transition={{ ease: 'linear' }}
            >
              {!isFinished && (
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-shimmer" />
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}