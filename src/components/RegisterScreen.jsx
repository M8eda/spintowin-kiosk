import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, ArrowRight, Crown } from 'lucide-react';

const fields = [
  { key: 'name', icon: User, placeholder: 'Full Name', type: 'text' },
  { key: 'mobile', icon: Phone, placeholder: 'Mobile Number', type: 'tel' },
  { key: 'email', icon: Mail, placeholder: 'Email Address', type: 'email' },
];

export default function RegisterScreen({ onSubmit }) {
  const [form, setForm] = useState({ name: '', mobile: '', email: '' });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.mobile.trim() || !/^\+?[\d\s\-]{7,15}$/.test(form.mobile.trim()))
      e.mobile = 'Invalid number';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = 'Invalid email';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    onSubmit({ name: form.name.trim(), mobile: form.mobile.trim(), email: form.email.trim() });
  };

  return (
    <motion.div
      className="w-full max-w-md px-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="bg-stone-900/40 backdrop-blur-3xl border border-amber-400/15 rounded-[3rem] px-8 py-12 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 border border-amber-400/20 mb-5">
            <Crown className="w-6 h-6 text-amber-300" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-serif text-amber-200 tracking-[0.25em] uppercase">
            Enter to Win
          </h2>
          <p className="text-amber-500/40 text-xs tracking-[0.2em] uppercase mt-2">
            Fill details to unlock
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7" noValidate>
          {fields.map(({ key, icon: Icon, placeholder, type }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
            >
              <div
                className={`flex items-center gap-3 border-b-2 pb-3 transition-all duration-300 ${
                  focused === key ? 'border-amber-400' : errors[key] ? 'border-red-400/50' : 'border-stone-700/50'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors duration-300 ${
                    focused === key ? 'text-amber-300' : errors[key] ? 'text-red-400' : 'text-stone-500'
                  }`}
                  strokeWidth={1.5}
                />
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, [key]: e.target.value }));
                    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
                  }}
                  onFocus={() => setFocused(key)}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-transparent text-white text-base placeholder-stone-600 outline-none py-1"
                  inputMode={type === 'tel' ? 'numeric' : type === 'email' ? 'email' : 'text'}
                  autoComplete="off"
                />
              </div>
              {errors[key] && (
                <motion.p
                  className="text-red-400/80 text-xs mt-1.5 ml-8"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors[key]}
                </motion.p>
              )}
            </motion.div>
          ))}

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-stone-900 py-5 rounded-full font-bold uppercase tracking-[0.3em] text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 mt-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Unlock Spin
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
