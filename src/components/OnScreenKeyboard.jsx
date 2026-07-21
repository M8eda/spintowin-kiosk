// src/components/OnScreenKeyboard.jsx
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, Delete, CornerDownLeft, Type, Hash, GripHorizontal } from 'lucide-react';

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
  const dragControls = useDragControls();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 40 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          
          /* --- Native Framer Motion Drag Configuration --- */
          drag
          dragControls={dragControls}
          dragListener={false} /* Only trigger drag from the handle */
          dragMomentum={false}
          dragElastic={0.1}
          dragConstraints={{ top: -600, bottom: 200, left: -300, right: 300 }} /* Keeps keyboard on-screen */
          
          className="fixed z-50 bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl px-4 pt-3 select-none rounded-2xl left-1/2 -translate-x-1/2"
          style={{
            bottom: '80px', /* Positioned comfortably higher for kiosk ergonomics */
            width: 'calc(100% - 2rem)',
            maxWidth: 520,
            paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
            touchAction: 'none',
          }}
        >
          {/* Dedicated Drag Handle */}
          <div
            onPointerDown={(e) => dragControls.start(e)}
            className="flex items-center justify-center mb-1 cursor-grab active:cursor-grabbing py-2 touch-none"
          >
            <GripHorizontal className="w-10 h-10 text-gray-400 hover:text-gray-600" />
          </div>

          {/* Top Bar (Close / Label / Toggle / Submit) */}
          <div className="flex items-center justify-between px-1 mb-3">
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-red-500 rounded-lg">
              <X className="w-7 h-7" />
            </button>
            <span className="text-base font-semibold text-gray-700 truncate mx-2 flex-1 text-center">
              {fieldLabel}
            </span>
            <div className="flex items-center gap-2">
              {onToggleKeyboard && (
                <button
                  onClick={onToggleKeyboard}
                  className="p-2 text-gray-500 hover:text-red-500 rounded-lg"
                  title={keyboardType === 'number' ? 'Switch to full keyboard' : 'Switch to digits only'}
                >
                  {keyboardType === 'number' ? <Type className="w-6 h-6" /> : <Hash className="w-6 h-6" />}
                </button>
              )}
              <button onClick={onSubmit} className="p-2 text-red-500 hover:text-red-600 rounded-lg">
                <CornerDownLeft className="w-7 h-7" />
              </button>
            </div>
          </div>

          {/* Key Rows */}
          <div className="flex flex-col gap-2">
            {keys.map((row, ri) => (
              <div key={ri} className="flex justify-center gap-2">
                {ri === keys.length - 1 && keyboardType === 'text' && (
                  <button
                    onClick={onBackspace}
                    className="h-14 w-16 bg-gray-200 rounded-xl text-gray-700 font-bold flex items-center justify-center active:bg-gray-300 text-xl"
                  >
                    <Delete className="w-6 h-6" />
                  </button>
                )}
                {row.map((key) => (
                  <button
                    key={key}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      onChar(key);
                    }}
                    className="h-14 flex-1 bg-white border-2 border-gray-200 rounded-xl text-2xl font-semibold text-gray-900 active:bg-gray-100 transition-colors shadow-sm"
                  >
                    {key}
                  </button>
                ))}
                {ri === keys.length - 1 && keyboardType !== 'text' && (
                  <button
                    onClick={onBackspace}
                    className="h-14 w-16 bg-gray-200 rounded-xl text-gray-700 font-bold flex items-center justify-center active:bg-gray-300 text-xl"
                  >
                    <Delete className="w-6 h-6" />
                  </button>
                )}
              </div>
            ))}

            {/* Number Keyboard Extra Row */}
            {keyboardType === 'number' && (
              <div className="flex justify-center gap-2 mt-1">
                <button
                  onClick={onBackspace}
                  className="h-14 flex-1 bg-gray-200 rounded-xl text-gray-700 font-bold flex items-center justify-center active:bg-gray-300 text-xl"
                >
                  <Delete className="w-6 h-6" />
                </button>
                <button
                  onClick={onSubmit}
                  className="h-14 flex-1 bg-red-500 rounded-xl text-white font-bold flex items-center justify-center active:bg-red-600 text-xl"
                >
                  <CornerDownLeft className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}