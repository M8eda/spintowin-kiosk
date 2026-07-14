import { motion, AnimatePresence } from 'framer-motion';
import { Delete, ArrowRight } from 'lucide-react';

const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export default function OnScreenKeyboard({ isOpen, value, onChar, onBackspace, onSubmit, onClose, fieldLabel }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-0 left-0 right-0 z-[9000] bg-white/95 backdrop-blur-2xl border-t-2 border-red-500/25 rounded-t-[2rem] p-4 shadow-2xl shadow-red-500/10 max-h-[55vh] overflow-y-auto"
        >
          <div className="w-full">
            {/* Field Label & Display */}
            <div className="mb-4 flex flex-col items-center gap-2">
              <p className="text-xs text-gray-500 tracking-widest uppercase font-semibold">{fieldLabel}</p>
              <div className="h-12 w-full max-w-[600px] bg-white/60 rounded-lg border-2 border-gray-300 flex items-center justify-center text-base text-gray-700 font-semibold px-3 text-center overflow-hidden text-ellipsis" aria-live="polite">
                {value || <span className="text-gray-400 text-xs tracking-widest uppercase">Enter text</span>}
              </div>
            </div>

            {/* Keyboard */}
            <div className="space-y-2">
              {KEYBOARD_LAYOUT.map((row, rowIdx) => (
                <div key={rowIdx} className="flex justify-center gap-1.5 px-2">
                  {/* Left Padding for Center Rows */}
                  {rowIdx > 0 && <div className="w-4" />}
                  
                  {row.map((char) => (
                    <button
                      key={char}
                      onClick={() => onChar(char)}
                      className="flex-1 min-h-10 max-w-[3rem] bg-white/40 border-2 border-gray-300/80 hover:border-red-500/40 hover:bg-white/60 text-gray-700 font-bold text-sm flex items-center justify-center active:scale-95 transition-all duration-150 rounded-md"
                      aria-label={`Letter ${char}`}
                    >
                      {char}
                    </button>
                  ))}
                </div>
              ))}

              {/* Bottom Row: Space, Backspace, Submit, Close */}
              <div className="flex justify-center gap-1.5 mt-3 px-2">
                <button
                  onClick={() => onChar(' ')}
                  className="flex-1 h-10 bg-white/40 border-2 border-gray-300/80 hover:border-red-500/40 hover:bg-white/60 text-gray-700 font-bold text-xs flex items-center justify-center active:scale-95 transition-all duration-150 rounded-md uppercase tracking-wider"
                  aria-label="Space"
                >
                  Space
                </button>
                <button
                  onClick={onBackspace}
                  aria-label="Delete last character"
                  className="h-10 w-12 bg-white/40 border-2 border-gray-300/80 hover:border-red-500/40 hover:bg-white/60 text-gray-500 hover:text-red-400 flex items-center justify-center active:scale-95 transition-all duration-150 rounded-md"
                >
                  <Delete className="w-4 h-4" />
                </button>
                <button
                  onClick={onSubmit}
                  className="h-10 px-4 bg-red-500 hover:bg-red-400 text-white font-bold text-xs flex items-center justify-center active:scale-95 transition-all duration-150 rounded-md uppercase tracking-wider gap-1.5"
                  aria-label="Submit entry"
                >
                  <span>Done</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onClose}
                  className="h-10 w-16 bg-white/40 border-2 border-gray-300/80 hover:border-red-500/40 hover:bg-white/60 text-gray-500 hover:text-red-400 font-bold text-xs flex items-center justify-center active:scale-95 transition-all duration-150 rounded-md uppercase tracking-wider"
                  aria-label="Close keyboard"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
