import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Receipt, CreditCard, ArrowRight, Crown, Sparkles } from 'lucide-react';
import OnScreenKeyboard from './OnScreenKeyboard';

const FIELDS = [
  { key: 'fullName', icon: User, placeholder: 'Full Name', type: 'text', inputMode: 'text' },
  { key: 'phone', icon: Phone, placeholder: 'Phone Number', type: 'tel', inputMode: 'numeric' },
  { key: 'receipt', icon: Receipt, placeholder: 'Receipt Number', type: 'text', inputMode: 'text' },
  { key: 'idNumber', icon: CreditCard, placeholder: 'ID Number', type: 'text', inputMode: 'numeric' },
];

export default function RegisterScreen({ onSubmit }) {
  const [form, setForm] = useState({ fullName: '', phone: '', receipt: '', idNumber: '' });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [keyboardField, setKeyboardField] = useState(null);
  
  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  const handleSecretTap = () => {
    tapCount.current += 1;
    if (tapCount.current >= 3) {
      tapCount.current = 0;
      clearTimeout(tapTimer.current);
      onSubmit({
        fullName: 'Test User',
        phone: '01000000000',
        receipt: 'RCP-001',
        idNumber: 'ID-12345',
      });
      return;
    }
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 1000);
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Please enter your full name';
    if (!form.phone.trim() || !/^\+?[\d\s\-]{7,15}$/.test(form.phone.trim())) e.phone = 'Please enter a valid phone number';
    if (!form.receipt.trim()) e.receipt = 'Please enter your receipt number';
    if (!form.idNumber.trim()) e.idNumber = 'Please enter your ID number';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit({
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      receipt: form.receipt.trim(),
      idNumber: form.idNumber.trim(),
    });
  };

  const handleFieldFocus = (fieldKey, ev) => {
    setFocused(fieldKey);
    setKeyboardField(fieldKey);
    setKeyboardOpen(true);
    
    // Smoothly scroll the focused input into view above the keyboard
    if (ev && ev.target) {
      setTimeout(() => {
        ev.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  };

  const handleKeyboardChar = (char) => {
    if (!keyboardField) return;
    setForm(prev => ({
      ...prev,
      [keyboardField]: (prev[keyboardField] + char).slice(0, 50) // Limit to 50 chars
    }));
    if (errors[keyboardField]) {
      setErrors(prev => ({ ...prev, [keyboardField]: undefined }));
    }
  };

  const handleKeyboardBackspace = () => {
    if (!keyboardField) return;
    setForm(prev => ({
      ...prev,
      [keyboardField]: prev[keyboardField].slice(0, -1)
    }));
  };

  const handleKeyboardSubmit = () => {
    setKeyboardOpen(false);
    setKeyboardField(null);
    setFocused(null);
  };

  const handleKeyboardClose = () => {
    setKeyboardOpen(false);
    setKeyboardField(null);
    setFocused(null);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white flex flex-col select-none">
      {/* HEADER - Logo at the top */}
      <header className="w-full bg-white/80 backdrop-blur-md py-6 px-4 border-b border-gray-100 flex-shrink-0 sticky top-0 z-10">
        <div className="flex justify-center items-center">
          <img 
            src="/logo.png" 
            alt="Delmar & Attalla Pharmacies" 
            className="h-24 sm:h-28 object-contain drop-shadow-sm" 
          />
        </div>
      </header>

      {/* SCROLLABLE CONTENT */}
      <main className={`flex-1 overflow-y-auto px-6 py-10 flex flex-col items-center transition-all duration-300 ${
        keyboardOpen ? 'pb-[360px]' : 'pb-16'
      }`}>
        {/* Form Container */}
        <div className="w-full max-w-xl m-[7px]">
          {/* Title Section */}
          <div className="w-full flex flex-col items-center justify-center text-center mb-10">
            <motion.div
              className="w-16 h-16 rounded-full bg-red-500/10 border border-red-400/20 flex items-center justify-center mb-4 cursor-pointer shadow-inner"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              onClick={handleSecretTap}
            >
              <Crown className="w-8 h-8 text-red-500" strokeWidth={1.5} />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-wider mb-2">
              ENTER TO WIN
            </h1>
            <p className="text-base sm:text-lg text-red-600 tracking-widest uppercase font-semibold">
              Fill in your details to unlock your reward
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {FIELDS.map(({ key, icon: Icon, placeholder, type, inputMode }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.3 }}
                className="flex flex-col"
              >
                <div className="relative">
                  <input
                    type={type}
                    inputMode={inputMode}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={(e) => {
                      setForm(p => ({ ...p, [key]: e.target.value }));
                      if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }));
                    }}
                    onFocus={(e) => handleFieldFocus(key, e)}
                    // Removed onBlur so tapping the on-screen keyboard doesn't lose input highlight
                    className={`w-full bg-white border-2 rounded-2xl px-6 py-5 text-gray-900 text-xl font-medium placeholder-gray-400 outline-none transition-all duration-200 shadow-sm text-center ${
                      focused === key
                        ? 'border-red-500 ring-4 ring-red-500/10 shadow-md'
                        : errors[key]
                        ? 'border-red-500/80 bg-red-50/30'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    autoComplete="off"
                  />
                </div>
                {errors[key] && (
                  <motion.p
                    className="text-red-500 text-base font-medium mt-2 ml-3 flex items-center gap-1.5"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span>✕</span> {errors[key]}
                  </motion.p>
                )}
              </motion.div>
            ))}

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6" />

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:from-red-700 active:to-red-800 text-white font-bold uppercase tracking-widest py-6 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 shadow-xl shadow-red-600/20 text-xl sm:text-2xl"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-7 h-7" />
              <span>Submit Info</span>
              <ArrowRight className="w-7 h-7 ml-1" strokeWidth={2.5} />
            </motion.button>
          </form>
        </div>
      </main>

      {/* Keyboard Overlay */}
      <OnScreenKeyboard
        isOpen={keyboardOpen}
        value={keyboardField ? form[keyboardField] : ''}
        onChar={handleKeyboardChar}
        onBackspace={handleKeyboardBackspace}
        onSubmit={handleKeyboardSubmit}
        onClose={handleKeyboardClose}
        fieldLabel={FIELDS.find(f => f.key === keyboardField)?.placeholder || ''}
      />
    </div>
  );
}