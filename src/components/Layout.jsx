import { motion } from 'framer-motion';
export default function Layout({ children }) {
  return (
    <div className="fixed inset-0 bg-white text-stone-900 antialiased overflow-hidden">
      <div className="absolute inset-3 rounded-3xl border-2 border-red-100 pointer-events-none z-50" />
      <motion.div className="absolute inset-3 z-10 overflow-hidden">{children}</motion.div>
    </div>
  );
}