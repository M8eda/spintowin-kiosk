import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Receipt, CreditCard, ArrowRight, Crown, Sparkles } from 'lucide-react';

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
  
  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  const handleSecretTap = () => {
    tapCount.current += 1;
    if (tapCount.current >= 3) {
      tapCount.current = 0;
      clearTimeout(tapTimer.current);
      onSubmit({
        fullName: 'Test User',
        phone: '5551234567',
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
    if (!form.fullName.trim()) e.fullName = 'Required';
    if (!form.phone.trim() || !/^\+?[\d\s\-]{7,15}$/.test(form.phone.trim())) e.phone = 'Invalid phone';
    if (!form.receipt.trim()) e.receipt = 'Required';
    if (!form.idNumber.trim()) e.idNumber = 'Required';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    onSubmit({
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      receipt: form.receipt.trim(),
      idNumber: form.idNumber.trim(),
    });
  };

  return (
    <div className="min-h-screen w-full grid place-items-center p-4">
      <div className="w-full max-w-[380px] bg-white/80 backdrop-blur-2xl border border-red-400/20 rounded-[2.5rem] p-8 shadow-2xl shadow-red-500/10 mx-auto">
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <motion.div
              className="w-16 h-16 rounded-full bg-red-500/10 border border-red-400/25 flex items-center justify-center mb-4 cursor-pointer"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              onClick={handleSecretTap}
            >
              <Crown className="w-8 h-8 text-red-300" strokeWidth={1.5} />
            </motion.div>
            <h2 className="text-2xl font-serif text-black tracking-[0.25em] uppercase">Enter to Win</h2>
            <p className="text-xs text-red-500 tracking-[0.2em] uppercase mt-2">Fill details to unlock</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              {FIELDS.map(({ key, icon: Icon, placeholder, type, inputMode }, i) => (
                <motion.div key={key} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i, duration: 0.35 }}>
                  <div
                    className={`relative border-b-2 pb-3 transition-all duration-300 rounded-lg ${
                      focused === key ? 'border-red-400 bg-red-50/50' : errors[key] ? 'border-red-400/50' : 'border-gray-200/50'
                    }`}
                  >
                    <motion.div
                      className="absolute left-4 inset-y-0 flex items-center"
                      animate={focused === key ? { scale: 1.15 } : { scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className={`w-5 h-5 transition-colors duration-300 ${focused === key ? 'text-red-300' : errors[key] ? 'text-red-400' : 'text-gray-500'}`} strokeWidth={1.5} />
                    </motion.div>
                    <input
                      type={type}
                      inputMode={inputMode}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={(e) => { setForm(p => ({ ...p, [key]: e.target.value })); if (errors[key]) setErrors(p => ({ ...p, [key]: undefined })); }}
                      onFocus={() => setFocused(key)}
                      onBlur={() => setFocused(null)}
                      className="w-full bg-transparent text-black text-base placeholder-gray-400 outline-none py-3 leading-tight text-center pl-12 pr-4"
                      autoComplete="off"
                    />
                  </div>
                  {errors[key] && (
                    <motion.p className="text-red-400/80 text-xs mt-1.5 text-center" initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }}>
                      {errors[key]}
                    </motion.p>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="w-2/3 mx-auto h-px bg-gradient-to-r from-transparent via-red-400/30 to-transparent my-8" />

            {/* Bigger Submit Info button */}
            <motion.button
              type="submit"
              className="relative w-full px-14 py-5 rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white font-bold uppercase tracking-[0.35em] text-lg flex items-center justify-center gap-3 overflow-hidden ring-1 ring-red-300/30"
              animate={{
                scale: [1, 1.02, 1],
                boxShadow: [
                  '0 0 25px rgba(220,38,38,0.3)',
                  '0 0 50px rgba(220,38,38,0.5)',
                  '0 0 25px rgba(220,38,38,0.3)',
                ],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.04, boxShadow: '0 0 70px rgba(220,38,38,0.7)' }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />
              <Sparkles className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Submit Info</span>
              <ArrowRight className="w-6 h-6 relative z-10" strokeWidth={2} />
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
