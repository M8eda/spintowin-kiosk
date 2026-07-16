import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  { progress: 0, text: 'Processing your information...' },
  { progress: 30, text: 'Verifying details...' },
  { progress: 60, text: 'Information verified!' },
  { progress: 80, text: 'Registration successful!' },
  { progress: 100, text: 'Thank you for choosing Delmar & Attalla' },
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
    <div className="fixed inset-0 flex items-center justify-center bg-stone-50 overflow-hidden p-4">
      <div className="absolute w-[500px] h-[500px] bg-red-100 rounded-full blur-[120px] opacity-50" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white/70 backdrop-blur-2xl border border-white/50 rounded-[2rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-sm w-full flex flex-col items-center gap-8"
      >
        {/* Icon: Pulsing Red Heart when finished */}
        <motion.div
          className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-lg ${
            isFinished ? 'bg-red-600' : 'bg-stone-200'
          }`}
          animate={isFinished ? { scale: [1, 1.1, 1], backgroundColor: '#dc2626' } : { scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            animate={isFinished ? { scale: [1, 1.2, 1] } : { opacity: [0.5, 1, 0.5] }}
            transition={{ duration: isFinished ? 1.5 : 1.5, repeat: Infinity }}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
          >
            {isFinished ? (
              <span className="text-3xl" role="img" aria-label="heart">❤️</span>
            ) : (
              <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </motion.div>
        </motion.div>

        {/* Dynamic Text: Properly centered and sized for long brand names */}
        <div className="min-h-[80px] flex items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentMessage.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`font-medium leading-snug ${isFinished ? 'text-xl md:text-2xl text-red-700' : 'text-xl text-stone-800'}`}
            >
              {currentMessage.text}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-stone-200/50 backdrop-blur-sm overflow-hidden border border-stone-200/50 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 relative"
            style={{ width: progress + '%' }}
            transition={{ ease: 'linear' }}
          >
            {!isFinished && (
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-[shimmer_2s_infinite]" />
            )}
          </motion.div>
        </div>

        <motion.p 
          animate={{ opacity: isFinished ? 0 : [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[10px] text-stone-400 font-bold tracking-[0.2em] uppercase"
        >
          {isFinished ? "Closing..." : "Please wait..."}
        </motion.p>
      </motion.div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}