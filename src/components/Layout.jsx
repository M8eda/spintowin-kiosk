import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, scale: 0.97, filter: 'blur(8px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, scale: 1.03, filter: 'blur(8px)', transition: { duration: 0.3 } },
};

export default function Layout({ children }) {
  return (
    <div className="fixed inset-0 bg-white text-black antialiased overflow-hidden">
      {/* Persistent velvet background */}
      <div className="absolute inset-0 velvet-bg z-0 pointer-events-none" />

      {/* Ambient glow (behind everything) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150vw] h-[50vh] rounded-full bg-red-500/5 blur-[150px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150vw] h-[40vh] rounded-full bg-red-600/4 blur-[120px]" />
      </div>

      {/* Golden inner border Ã¢â‚¬â€œ never blocks touches */}
      <div className="absolute inset-4 rounded-3xl ring-1 ring-red-400/10 pointer-events-none z-50" />

      {/* Page content */}
      <motion.div
        className="absolute inset-0 z-10"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </div>
  );
}
