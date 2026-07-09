import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { User, Phone, Mail, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';

const COUNTRIES = [
  { code: 'AE', dial: '+971', flag: '🇦🇪', name: 'UAE', mask: /^\d{7,9}$/ },
  { code: 'SA', dial: '+966', flag: '🇸🇦', name: 'Saudi Arabia', mask: /^\d{9}$/ },
  { code: 'EG', dial: '+20', flag: '🇪🇬', name: 'Egypt', mask: /^\d{10}$/ },
  { code: 'US', dial: '+1', flag: '🇺🇸', name: 'United States', mask: /^\d{10}$/ },
  { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'United Kingdom', mask: /^\d{10}$/ }
];

export default function RegistrationScreen() {
  const { saveLead, goToScreen } = useGame();
  
  // Field States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // Country Selector States
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Error Monitoring
  const [validationError, setValidationError] = useState('');

  // Strict Name Input Guard (Accepts alphabetical characters and spaces only)
  const handleNameChange = (e) => {
    const rawValue = e.target.value;
    const cleanValue = rawValue.replace(/[^a-zA-Z\s]/g, '');
    setName(cleanValue);
  };

  const handleFormSubmission = (e) => {
    e.preventDefault();
    setValidationError('');

    // 1. Structural Checklist
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setValidationError('All identification fields must be completed.');
      return;
    }

    // 2. Strict Email Regex Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setValidationError('Please enter a valid, fully qualified email address.');
      return;
    }

    // 3. Dynamic Phone Field Numerical Parsing & Country Mask Checks
    const cleanPhone = phone.replace(/\D/g, '');
    if (!selectedCountry.mask.test(cleanPhone)) {
      setValidationError(`Invalid number layout for ${selectedCountry.name}. Check length.`);
      return;
    }

    // Format final lead entry structure
    saveLead({
      name: name.trim(),
      phone: `${selectedCountry.dial} ${cleanPhone}`,
      email: email.trim().toLowerCase()
    });

    goToScreen('game');
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between bg-neutral-950 p-12 text-center select-none relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.05),transparent_50%)] pointer-events-none" />

      {/* Corporate Kiosk Branding Header */}
      <div className="mt-16 space-y-4 z-10">
        <span className="text-xs font-black tracking-[0.4em] uppercase text-purple-500 bg-purple-500/10 px-4 py-1.5 rounded-full border border-purple-500/20">
          Player Registration
        </span>
        <h2 className="text-5xl font-black uppercase tracking-tight text-white">
          Claim Your Session Token
        </h2>
        <p className="text-xl text-neutral-400 font-light max-w-sm mx-auto">
          Verify your coordinates below to activate the prize matrix.
        </p>
      </div>

      {/* High-End Touch Form Interface Container */}
      <form onSubmit={handleFormSubmission} className="w-full max-w-md space-y-6 my-auto text-left z-10 relative">
        
        {/* Full Name Input Slot */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Full Name</label>
          <div className="relative flex items-center">
            <User className="absolute left-5 text-neutral-500 w-6 h-6" />
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={handleNameChange}
              className="w-full bg-neutral-900 border-2 border-neutral-800/80 focus:border-purple-500/80 rounded-2xl py-5 pl-14 pr-6 text-xl text-white outline-none transition-all font-medium placeholder-neutral-600"
            />
          </div>
        </div>

        {/* Dynamic International Phone Input Combo Slot */}
        <div className="space-y-2 relative">
          <label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Phone Number</label>
          <div className="flex gap-2 relative">
            
            {/* Custom Touch Country Flag Selector Dropdown Toggle Button */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-neutral-900 border-2 border-neutral-800/80 rounded-2xl px-4 text-xl text-white active:bg-neutral-800 transition-colors shrink-0"
            >
              <span className="text-2xl">{selectedCountry.flag}</span>
              <span className="text-base font-bold text-neutral-400">{selectedCountry.dial}</span>
              <ChevronDown className="w-4 h-4 text-neutral-500" />
            </button>

            {/* Scrolling Touch Popover Menu Overlay */}
            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 bottom-[calc(100%+8px)] w-72 max-h-60 overflow-y-auto bg-neutral-900/95 backdrop-blur-2xl border-2 border-neutral-800 rounded-2xl shadow-2xl z-40 p-2 space-y-1 custom-scrollbar"
                  >
                    {COUNTRIES.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(country);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-3.5 hover:bg-neutral-800/80 rounded-xl transition-all text-left text-white"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{country.flag}</span>
                          <span className="text-base font-medium">{country.name}</span>
                        </div>
                        <span className="text-sm font-bold font-mono text-neutral-500">{country.dial}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Numerical Digit Field Entry Input */}
            <div className="relative flex items-center w-full">
              <Phone className="absolute left-5 text-neutral-500 w-6 h-6" />
              <input
                type="tel"
                placeholder="000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-neutral-900 border-2 border-neutral-800/80 focus:border-purple-500/80 rounded-2xl py-5 pl-14 pr-6 text-xl text-white outline-none transition-all font-medium placeholder-neutral-600"
              />
            </div>
          </div>
        </div>

        {/* Email Identification Input Slot */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Email Address</label>
          <div className="relative flex items-center">
            <Mail className="absolute left-5 text-neutral-500 w-6 h-6" />
            <input
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-900 border-2 border-neutral-800/80 focus:border-purple-500/80 rounded-2xl py-5 pl-14 pr-6 text-xl text-white outline-none transition-all font-medium placeholder-neutral-600"
            />
          </div>
        </div>

        {/* Inline Error Reporting Interface */}
        <div className="min-h-[28px] flex items-center justify-center">
          <AnimatePresence>
            {validationError && (
              <motion.p 
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-400 font-bold text-base text-center tracking-wide"
              >
                {validationError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </form>

      {/* Form Submission Action Interface Trigger */}
      <div className="w-full flex justify-center mb-16 z-10">
        <button
          onClick={handleFormSubmission}
          className="w-full max-w-md py-6 rounded-2xl font-black text-2xl uppercase tracking-widest bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white hover:scale-[1.03] active:scale-95 shadow-[0_0_50px_rgba(168,85,247,0.2)] flex items-center justify-center gap-3 transition-all"
        >
          Proceed to Wheel
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}