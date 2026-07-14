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

const KEYBOARD_HEIGHT = 300;

export default function RegisterScreen({ onSubmit }) {
  const [form, setForm] = useState({ fullName: '', phone: '', receipt: '', idNumber: '' });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [keyboardField, setKeyboardField] = useState(null);
  const [keyboardType, setKeyboardType] = useState('text'); // 'text' | 'number'

  const inputRefs = useRef({});
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
    if (!form.phone.trim() || !/^\+?[\d\s\-]{7,15}$/.test(form.phone.trim()))
      e.phone = 'Please enter a valid phone number';
    if (!form.receipt.trim()) e.receipt = 'Please enter your receipt number';
    if (!form.idNumber.trim()) e.idNumber = 'Please enter your ID number';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      // Focus the first invalid field
      const firstError = FIELDS.find(f => errs[f.key])?.key;
      if (firstError) openField(firstError);
      return;
    }
    onSubmit({
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      receipt: form.receipt.trim(),
      idNumber: form.idNumber.trim(),
    });
  };

  const openField = (fieldKey) => {
    setFocused(fieldKey);
    setKeyboardField(fieldKey);
    // Auto-select keyboard type: digits for phone & idNumber, otherwise full keyboard
    setKeyboardType(fieldKey === 'phone' || fieldKey === 'idNumber' ? 'number' : 'text');
    setKeyboardOpen(true);
    // Lift the field above the keyboard
    setTimeout(() => {
      const el = inputRefs.current[fieldKey];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  };

  const toggleKeyboard = () => {
    setKeyboardType(prev => (prev === 'text' ? 'number' : 'text'));
  };

  const handleKeyboardChar = (char) => {
    if (!keyboardField) return;
    setForm(prev => ({
      ...prev,
      [keyboardField]: (prev[keyboardField] + char).slice(0, 50),
    }));
    if (errors[keyboardField]) setErrors(prev => ({ ...prev, [keyboardField]: undefined }));
  };

  const handleKeyboardBackspace = () => {
    if (!keyboardField) return;
    setForm(prev => ({
      ...prev,
      [keyboardField]: prev[keyboardField].slice(0, -1),
    }));
  };

  const closeKeyboard = () => {
    setKeyboardOpen(false);
    setKeyboardField(null);
    setFocused(null);
  };

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white select-none"
      style={{ height: '100dvh' }}
    >
      {/* HEADER */}
      <header
        className="flex-shrink-0 w-full bg-white/85 backdrop-blur-md border-b border-gray-100 flex justify-center items-center px-4 py-3"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <img
          src="/logo.png"
          alt="Delmar & Attalla Pharmacies"
          className="h-14 sm:h-16 object-contain drop-shadow-sm"
        />
      </header>

      {/* SCROLLABLE CONTENT */}
      <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div
          className={`min-h-full w-full flex flex-col items-center px-5 transition-[padding,justify-content] duration-300 ${
            keyboardOpen ? 'justify-start pt-6' : 'justify-center py-6'
          }`}
          style={{ paddingBottom: keyboardOpen ? KEYBOARD_HEIGHT + 24 : 24 }}
        >
          <div className="w-full max-w-md">
            {/* Title */}
            <div className="flex flex-col items-center text-center mb-6">
              <motion.div
                className="w-14 h-14 rounded-full bg-red-500/10 border border-red-400/20 flex items-center justify-center mb-3 cursor-pointer shadow-inner"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                onClick={handleSecretTap}
              >
                <Crown className="w-7 h-7 text-red-500" strokeWidth={1.5} />
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-wider mb-1.5">
                ENTER TO WIN
              </h1>
              <p className="text-sm sm:text-base text-red-600 tracking-wide uppercase font-semibold leading-snug">
                Fill in your details to unlock your reward
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {FIELDS.map(({ key, icon: Icon, placeholder, type, inputMode }, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.3 }}
                  className="flex flex-col"
                >
                  <div className="relative">
                    <Icon
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors ${
                        focused === key ? 'text-red-500' : 'text-gray-400'
                      }`}
                      strokeWidth={1.75}
                    />
                    <input
                      ref={(el) => (inputRefs.current[key] = el)}
                      type={type}
                      inputMode={inputMode}
                      readOnly
                      aria-label={placeholder}
                      placeholder={placeholder}
                      value={form[key]}
                      onFocus={() => openField(key)}
                      onClick={() => openField(key)}
                      className={`w-full bg-white border-2 rounded-2xl pl-12 pr-4 py-4 text-gray-900 text-lg font-medium placeholder-gray-400 outline-none transition-all duration-200 shadow-sm text-center cursor-pointer ${
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
                      className="text-red-500 text-sm font-medium mt-1.5 ml-3 flex items-center gap-1.5"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span aria-hidden>✕</span> {errors[key]}
                    </motion.p>
                  )}
                </motion.div>
              ))}

              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2" />

              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:from-red-700 active:to-red-800 text-white font-bold uppercase tracking-widest py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 shadow-xl shadow-red-600/20 text-lg sm:text-xl"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="w-6 h-6" />
                <span>Submit Info</span>
                <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
              </motion.button>
            </form>
          </div>
        </div>
      </main>

      {/* Keyboard Overlay */}
      <OnScreenKeyboard
        isOpen={keyboardOpen}
        value={keyboardField ? form[keyboardField] : ''}
        onChar={handleKeyboardChar}
        onBackspace={handleKeyboardBackspace}
        onSubmit={closeKeyboard}
        onClose={closeKeyboard}
        fieldLabel={FIELDS.find(f => f.key === keyboardField)?.placeholder || ''}
        keyboardType={keyboardType}
        onToggleKeyboard={toggleKeyboard}
      />
    </div>
  );
}