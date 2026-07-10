import { useState } from 'react';
import { motion } from 'framer-motion';

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.1 * i, duration: 0.4 },
  }),
};

export default function RegistrationScreen({ onSubmit }) {
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
    else if (!/^\+?[\d\s-]{7,15}$/.test(formData.mobile.trim()))
      newErrors.mobile = 'Enter a valid mobile number';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      newErrors.email = 'Enter a valid email';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({
      name: formData.name.trim(),
      mobile: formData.mobile.trim(),
      email: formData.email.trim(),
    });
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <motion.main
      className="w-full max-w-md bg-stone-900/40 backdrop-blur-2xl border border-rose-300/20 rounded-[2.5rem] p-10 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        {['name', 'mobile', 'email'].map((field, i) => (
          <motion.div key={field} custom={i} variants={inputVariants} initial="hidden" animate="visible">
            <input
              type={field === 'email' ? 'email' : field === 'mobile' ? 'tel' : 'text'}
              name={field}
              placeholder={field === 'name' ? 'Full Name' : field === 'mobile' ? 'Mobile Number' : 'Email Address'}
              value={formData[field]}
              onChange={handleChange(field)}
              className={`w-full bg-transparent border-b p-2 outline-none text-rose-100 text-lg ${
                errors[field] ? 'border-red-400' : 'border-stone-600 focus:border-rose-400'
              }`}
              autoComplete="off"
            />
            {errors[field] && (
              <p className="text-red-400 text-xs mt-1">{errors[field]}</p>
            )}
          </motion.div>
        ))}

        <motion.button
          type="submit"
          className="w-full bg-rose-500 text-stone-900 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-rose-400 transition-colors text-lg min-h-[60px]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Unlock Spin
        </motion.button>
      </form>
    </motion.main>
  );
}