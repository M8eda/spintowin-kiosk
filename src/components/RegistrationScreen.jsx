import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { User, Smartphone, Mail, ArrowRight } from 'lucide-react';

export default function RegistrationScreen() {
   const { saveLead, goToScreen } = useGame();

   const [name, setName] = useState('');
   const [phone, setPhone] = useState('');
   const [email, setEmail] = useState('');
   const [error, setError] = useState('');

   const handleValidation = (e) => {
      e.preventDefault();
      setError('');

      if (!name.trim() || !phone.trim() || !email.trim()) {
         setError('All fields are strictly required to activate token.');
         return;
      }

      if (phone.length < 10) {
         setError('Please provide a valid mobile number format.');
         return;
      }

      saveLead({ name: name.trim(), phone: phone.trim(), email: email.trim().toLowerCase() });
      goToScreen('game');
   };

   return (
      <div className="w-full h-full flex flex-col justify-between p-12 text-center select-none relative">

         {/* Brand Identity Header */}
         <div className="mt-12 space-y-2 shrink-0">
            <h1 className="text-4xl font-black tracking-[0.15em] uppercase drop-shadow-md">
               PARKVILLE
            </h1>
            <p className="text-lg font-bold text-blue-100 tracking-wide max-w-xs mx-auto">
               Validate to receive new customer
            </p>
         </div>

         {/* Pristine High-Contrast Content Card */}
         <div className="w-full max-w-md mx-auto my-auto bg-white rounded-[32px] p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] text-neutral-900 border border-neutral-100 text-left">

            {error && (
               <div className="mb-5 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl text-rose-700 font-bold text-sm">
                  {error}
               </div>
            )}

            <div className="space-y-5">
               {/* Full Name Input */}
               <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-neutral-400">Full Name</label>
                  <div className="relative flex items-center">
                     <User className="absolute left-4 text-neutral-400 w-5 h-5" />
                     <input
                        type="text"
                        placeholder="Enter full name"
                        value={name}
                        onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                        className="w-full bg-neutral-50 border-2 border-neutral-200 focus:border-[#0a39a6] rounded-xl py-4 pl-12 pr-4 text-base font-bold outline-none transition-all text-neutral-900 placeholder-neutral-300"
                     />
                  </div>
               </div>

               {/* Mobile Input */}
               <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-neutral-400">Mobile Number</label>
                  <div className="relative flex items-center">
                     <Smartphone className="absolute left-4 text-neutral-400 w-5 h-5" />
                     <input
                        type="tel"
                        placeholder="01xxxxxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-neutral-50 border-2 border-neutral-200 focus:border-[#0a39a6] rounded-xl py-4 pl-12 pr-4 text-base font-mono font-bold outline-none transition-all text-neutral-900 placeholder-neutral-300"
                     />
                  </div>
               </div>

               {/* Email Input */}
               <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-neutral-400">Email Address</label>
                  <div className="relative flex items-center">
                     <Mail className="absolute left-4 text-neutral-400 w-5 h-5" />
                     <input
                        type="email"
                        placeholder="name@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-neutral-50 border-2 border-neutral-200 focus:border-[#0a39a6] rounded-xl py-4 pl-12 pr-4 text-base font-bold outline-none transition-all text-neutral-900 placeholder-neutral-300"
                     />
                  </div>
               </div>
            </div>

            {/* Validate Command Button */}
            <button
               onClick={handleValidation}
               className="w-full bg-[#0a39a6] hover:bg-[#0f46be] text-white py-4 rounded-xl font-black text-lg uppercase tracking-wider shadow-lg transition-all mt-6 flex items-center justify-center gap-2"
            >
               Validate
               <ArrowRight className="w-5 h-5" />
            </button>

         </div>

         {/* Footer Branding Context */}
         <div className="mb-6 shrink-0 text-blue-200/50 text-xs font-bold uppercase tracking-widest">
            Official Campaign Hardware Node
         </div>

      </div>
   );
}