import { motion, AnimatePresence } from 'framer-motion';
import { X, Delete, CornerDownLeft, Type, Hash } from 'lucide-react';

const FULL_KEYS = [
  ['1','2','3','4','5','6','7','8','9','0'],
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m'],
];

const NUM_KEYS = [
  ['1','2','3'],
  ['4','5','6'],
  ['7','8','9'],
  ['0'],
];

export default function OnScreenKeyboard({
  isOpen,
  value = '',
  onChar,
  onBackspace,
  onSubmit,
  onClose,
  fieldLabel = '',
  keyboardType = 'text',
  onToggleKeyboard,
}) {
  const keys = keyboardType === 'number' ? NUM_KEYS : FULL_KEYS;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl px-3 pt-3 pb-safe select-none"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-1 mb-2">
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-red-500">
              <X className="w-6 h-6" />
            </button>
            <span className="text-sm font-medium text-gray-700 truncate mx-2 flex-1 text-center">
              {fieldLabel}
            </span>
            <div className="flex items-center gap-1">
              {onToggleKeyboard && (
                <button
                  onClick={onToggleKeyboard}
                  className="p-2 text-gray-500 hover:text-red-500 rounded-lg"
                  title={keyboardType === 'number' ? 'Switch to full keyboard' : 'Switch to digits only'}
                >
                  {keyboardType === 'number' ? <Type className="w-5 h-5" /> : <Hash className="w-5 h-5" />}
                </button>
              )}
              <button onClick={onSubmit} className="p-2 text-red-500 hover:text-red-600">
                <CornerDownLeft className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Key rows */}
          <div className="flex flex-col gap-1.5">
            {keys.map((row, ri) => (
              <div key={ri} className="flex justify-center gap-1.5">
                {ri === keys.length - 1 && keyboardType === 'text' && (
                  <button
                    onClick={onBackspace}
                    className="h-12 w-14 bg-gray-200 rounded-xl text-gray-700 font-bold flex items-center justify-center active:bg-gray-300"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                )}
                {row.map(key => (
                  <button
                    key={key}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      onChar(key);
                    }}
                    className="h-12 flex-1 bg-white border border-gray-200 rounded-xl text-lg font-medium text-gray-900 active:bg-gray-100 transition-colors shadow-sm"
                  >
                    {key}
                  </button>
                ))}
                {ri === keys.length - 1 && keyboardType === 'text' ? null : ri === keys.length - 1 && (
                  <button
                    onClick={onBackspace}
                    className="h-12 w-14 bg-gray-200 rounded-xl text-gray-700 font-bold flex items-center justify-center active:bg-gray-300"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}

            {/* Backspace + Submit row for number keyboard */}
            {keyboardType === 'number' && (
              <div className="flex justify-center gap-1.5 mt-1">
                <button
                  onClick={onBackspace}
                  className="h-12 flex-1 bg-gray-200 rounded-xl text-gray-700 font-bold flex items-center justify-center active:bg-gray-300"
                >
                  <Delete className="w-5 h-5" />
                </button>
                <button
                  onClick={onSubmit}
                  className="h-12 flex-1 bg-red-500 rounded-xl text-white font-bold flex items-center justify-center active:bg-red-600"
                >
                  <CornerDownLeft className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}