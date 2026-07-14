# fix-attract.ps1
# Overwrites AttractScreen.jsx with a valid version that shows only the logo.

$projectRoot = $PSScriptRoot
if (-not $projectRoot) { $projectRoot = (Get-Location).Path }
Set-Location $projectRoot

$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

$correctAttract = @'
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

function Particles() {
  const items = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 6,
    durationX: 4 + Math.random() * 6,
    durationY: 5 + Math.random() * 5,
    delay: Math.random() * 5,
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {items.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: 'radial-gradient(circle, rgba(220,38,38,0.6) 0%, rgba(220,38,38,0.2) 100%)',
            boxShadow: '0 0 10px rgba(220,38,38,0.4)',
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 25, 0],
            y: [0, (Math.random() - 0.5) * 25, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            x: { duration: p.durationX, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: p.durationY, repeat: Infinity, ease: 'easeInOut', delay: p.delay * 0.2 },
            opacity: { duration: 3 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 4 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      ))}
    </div>
  );
}

export default function AttractScreen({ onTouch }) {
  return (
    <motion.div
      className="relative h-full w-full flex flex-col items-center justify-center cursor-pointer overflow-hidden"
      onClick={onTouch}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
    >
      <Particles />

      <div className="absolute left-1/2 top-[calc(50%-7rem)] w-44 h-44 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-red-500/3 via-transparent to-red-900/5 pointer-events-none" />

      <motion.div
        className="relative z-10 flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-6" variants={itemVariants}>
          <img 
            src="/logo.png" 
            alt="Delmar & Attalla Pharmacies" 
            className="w-64 sm:w-80 md:w-96 h-auto object-contain"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-[10%] sm:bottom-[12%] flex flex-col items-center gap-5 z-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          className="relative px-12 py-4 sm:px-14 sm:py-5 rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white font-bold uppercase tracking-[0.35em] sm:tracking-[0.4em] text-base sm:text-lg flex items-center gap-3 overflow-hidden ring-1 ring-red-300/30"
          animate={{
            scale: [1, 1.03, 1],
            boxShadow: [
              '0 0 50px rgba(220,38,38,0.4)',
              '0 0 80px rgba(220,38,38,0.7)',
              '0 0 50px rgba(220,38,38,0.4)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.06, boxShadow: '0 0 100px rgba(220,38,38,0.9)' }}
          whileTap={{ scale: 0.94 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
          <span className="relative z-10">Touch to Begin</span>
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
        </motion.div>

        <div className="flex gap-2">
          <motion.div
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400/60"
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <motion.div
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400/60"
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 0.3 }}
          />
          <motion.div
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400/60"
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 0.6 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
'@

$fullPath = Join-Path $projectRoot "src\components\AttractScreen.jsx"
$dir = Split-Path $fullPath -Parent
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
[System.IO.File]::WriteAllText($fullPath, $correctAttract, $utf8NoBOM)

Write-Host "AttractScreen.jsx replaced with the corrected version." -ForegroundColor Green
Write-Host "Now restart your dev server: npm run dev" -ForegroundColor Yellow