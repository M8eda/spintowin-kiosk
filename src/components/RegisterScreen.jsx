import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, ArrowRight, Crown, Sparkles } from 'lucide-react';

const FIELDS = [
  { key: 'name', icon: User, placeholder: 'Full Name', type: 'text', inputMode: 'text' },
  { key: 'mobile', icon: Phone, placeholder: 'Mobile Number', type: 'tel', inputMode: 'numeric' },
  { key: 'email', icon: Mail, placeholder: 'Email Address', type: 'email', inputMode: 'email' },
];

export default function RegisterScreen({ onSubmit }) {
  const [form, setForm] = useState({ name: '', mobile: '', email: '' });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);
  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  const handleCrownTap = () => {
    tapCount.current += 1;
    if (tapCount.current >= 3) {
      tapCount.current = 0;
      clearTimeout(tapTimer.current);
      onSubmit({
        name: 'Test User',
        mobile: '5551234567',
        email: 'test@parkville.com',
      });
      return;
    }
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 1000);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.mobile.trim() || !/^\+?[\d\s\-]{7,15}$/.test(form.mobile.trim())) e.mobile = 'Invalid';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Invalid';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    onSubmit({
      name: form.name.trim(),
      mobile: form.mobile.trim(),
      email: form.email.trim(),
    });
  };

  return (
    <div className="min-h-screen w-full grid place-items-center p-4">
      <div className="w-full max-w-[380px] bg-stone-900/80 backdrop-blur-2xl border border-amber-400/20 rounded-[2.5rem] p-8 shadow-2xl shadow-amber-500/10 mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col items-center">
            <motion.div
              className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-400/25 flex items-center justify-center mb-4"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              onClick={handleCrownTap}
            >
              <Crown className="w-8 h-8 text-amber-300" strokeWidth={1.5} />
            </motion.div>
            <h2 className="text-2xl font-serif text-amber-200 tracking-[0.25em] uppercase">Enter to Win</h2>
            <p className="text-xs text-amber-500/40 tracking-[0.2em] uppercase mt-2">Fill details to unlock</p>
          </div>

          {/* Inputs */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              {FIELDS.map(({ key, icon: Icon, placeholder, type, inputMode }, i) => (
                <motion.div key={key} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i, duration: 0.35 }}>
                  <div
                    className={`relative border-b-2 pb-3 transition-all duration-300 rounded-lg ${
                      focused === key ? 'border-amber-400 bg-white/5' : errors[key] ? 'border-red-400/50' : 'border-stone-700/50'
                    }`}
                  >
                    <motion.div
                      className="absolute left-4 inset-y-0 flex items-center"
                      animate={focused === key ? { scale: 1.15 } : { scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className={`w-5 h-5 transition-colors duration-300 ${focused === key ? 'text-amber-300' : errors[key] ? 'text-red-400' : 'text-stone-500'}`} strokeWidth={1.5} />
                    </motion.div>
                    <input
                      type={type}
                      inputMode={inputMode}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={(e) => { setForm(p => ({ ...p, [key]: e.target.value })); if (errors[key]) setErrors(p => ({ ...p, [key]: undefined })); }}
                      onFocus={() => setFocused(key)}
                      onBlur={() => setFocused(null)}
                      className="w-full bg-transparent text-white text-base placeholder-stone-400 outline-none py-3 leading-tight text-center pl-12 pr-4"
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

            {/* Divider */}
            <div className="w-2/3 mx-auto h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent my-6" />

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="relative w-full px-12 py-4 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-900 font-bold uppercase tracking-[0.35em] text-base flex items-center justify-center gap-2 overflow-hidden ring-1 ring-amber-300/30"
              animate={{
                scale: [1, 1.02, 1],
                boxShadow: [
                  '0 0 25px rgba(255,215,0,0.3)',
                  '0 0 50px rgba(255,215,0,0.5)',
                  '0 0 25px rgba(255,215,0,0.3)',
                ],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.04, boxShadow: '0 0 70px rgba(255,215,0,0.7)' }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />
              <Sparkles className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Unlock Spin</span>
              <ArrowRight className="w-5 h-5 relative z-10" strokeWidth={2} />
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
