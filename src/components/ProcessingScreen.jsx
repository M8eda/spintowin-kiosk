import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const messages = [
  { progress: 0, text: 'Processing your information...' },
  { progress: 30, text: 'Verifying details...' },
  { progress: 60, text: 'Information verified!' },
  { progress: 80, text: 'Registration successful!' },
  { progress: 100, text: 'Stay tuned for our events!' },
];

export default function ProcessingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 4000; // 4 seconds total
    const start = performance.now();
    
    const animate = (now) => {
      const elapsed = now - start;
      const p = Math.min((elapsed / duration) * 100, 100);
      setProgress(p);
      if (p < 100) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(onComplete, 800); // small delay after reaching 100%
      }
    };
    
    requestAnimationFrame(animate);
  }, [onComplete]);

  const currentMessage = [...messages].reverse().find(m => progress >= m.progress) || messages[0];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-white via-white to-stone-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl border border-red-200/50 rounded-[3rem] p-10 shadow-2xl shadow-red-500/5 max-w-sm w-full flex flex-col items-center gap-8"
      >
        <motion.div
          className="w-20 h-20 rounded-full bg-red-500/10 border border-red-400/25 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>

        <h2 className="text-2xl font-serif text-stone-800 tracking-wider text-center">
          {currentMessage.text}
        </h2>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-stone-200/80 overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-red-600 to-red-800 rounded-full"
            style={{ width: progress + '%' }}
            transition={{ ease: 'easeOut' }}
          />
        </div>

        <p className="text-xs text-stone-400 tracking-widest uppercase">
          Please wait...
        </p>
      </motion.div>
    </div>
  );
}
