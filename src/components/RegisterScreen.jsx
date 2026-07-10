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
    <div className="w-full max-w-[360px] px-5">
      <div className="bg-stone-900/50 backdrop-blur-3xl border border-amber-400/12 rounded-[2.5rem] px-7 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border border-amber-400/20 mb-4">
            <Crown className="w-5 h-5 text-amber-300" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-serif text-amber-200 tracking-[0.25em] uppercase">Enter to Win</h2>
          <p className="text-[0.65rem] text-amber-500/40 tracking-[0.2em] uppercase mt-1.5">Fill details to unlock</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {FIELDS.map(({ key, icon: Icon, placeholder, type, inputMode }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.35 }}
            >
              <div className={`flex items-center gap-3 border-b-2 pb-2.5 transition-colors duration-300 ${
                focused === key ? 'border-amber-400' : errors[key] ? 'border-red-400/50' : 'border-stone-700/50'
              }`}>
                <Icon className={`w-4 h-4 shrink-0 transition-colors duration-300 ${
                  focused === key ? 'text-amber-300' : errors[key] ? 'text-red-400' : 'text-stone-500'
                }`} strokeWidth={1.5} />
                <input
                  type={type}
                  inputMode={inputMode}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => { setForm(p => ({ ...p, [key]: e.target.value })); if (errors[key]) setErrors(p => ({ ...p, [key]: undefined })); }}
                  onFocus={() => setFocused(key)}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-transparent text-white text-sm placeholder-stone-600 outline-none py-0.5"
                  autoComplete="off"
                />
              </div>
              {errors[key] && (
                <motion.p className="text-red-400/80 text-[0.65rem] mt-1 ml-7" initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }}>
                  {errors[key]}
                </motion.p>
              )}
            </motion.div>
          ))}

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-stone-900 py-4 rounded-full font-bold uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 mt-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Unlock Spin
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
