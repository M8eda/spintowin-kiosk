import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, ArrowRight, Crown } from 'lucide-react';

const FIELDS = [
  { key: 'name', icon: User, placeholder: 'Full Name', type: 'text', inputMode: 'text' },
  { key: 'mobile', icon: Phone, placeholder: 'Mobile Number', type: 'tel', inputMode: 'numeric' },
  { key: 'email', icon: Mail, placeholder: 'Email Address', type: 'email', inputMode: 'email' },
];

export default function RegisterScreen({ onSubmit }) {
  const [form, setForm] = useState({ name: '', mobile: '', email: '' });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);

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
    onSubmit({ name: form.name.trim(), mobile: form.mobile.trim(), email: form.email.trim() });
  };

  return (
    <div className="h-full w-full flex items-center justify-center px-4">
      <div className="w-full max-w-[360px] bg-stone-900/60 backdrop-blur-3xl border border-amber-400/15 rounded-[3rem] px-5 sm:px-7 py-8 sm:py-9 shadow-2xl shadow-amber-500/5">
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <motion.div
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-amber-500/10 border border-amber-400/25 flex items-center justify-center mb-2 sm:mb-3"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" strokeWidth={1.5} />
          </motion.div>
          <h2 className="text-lg sm:text-xl font-serif text-amber-200 tracking-[0.25em] uppercase">Enter to Win</h2>
          <p className="text-[0.6rem] sm:text-[0.65rem] text-amber-500/40 tracking-[0.2em] uppercase mt-1">Fill details to unlock</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 sm:gap-5">
          {FIELDS.map(({ key, icon: Icon, placeholder, type, inputMode }, i) => (
            <motion.div key={key} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i, duration: 0.35 }}>
              <div className={`flex items-center gap-2.5 sm:gap-3 border-b-2 pb-2 sm:pb-2.5 transition-colors duration-300 ${focused === key ? 'border-amber-400' : errors[key] ? 'border-red-400/50' : 'border-stone-700/50'}`}>
                <motion.div animate={focused === key ? { scale: 1.1 } : { scale: 1 }} transition={{ duration: 0.2 }}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-colors duration-300 ${focused === key ? 'text-amber-300' : errors[key] ? 'text-red-400' : 'text-stone-500'}`} strokeWidth={1.5} />
                </motion.div>
                <input
                  type={type}
                  inputMode={inputMode}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => { setForm(p => ({ ...p, [key]: e.target.value })); if (errors[key]) setErrors(p => ({ ...p, [key]: undefined })); }}
                  onFocus={() => setFocused(key)}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-transparent text-white text-sm placeholder-stone-600 outline-none py-1 leading-tight"
                  autoComplete="off"
                />
              </div>
              {errors[key] && (
                <motion.p className="text-red-400/80 text-[0.6rem] sm:text-[0.65rem] mt-1 ml-7 sm:ml-8" initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }}>
                  {errors[key]}
                </motion.p>
              )}
            </motion.div>
          ))}

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-900 py-3.5 sm:py-4 rounded-full font-bold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 mt-4 sm:mt-5"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Unlock Spin
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
