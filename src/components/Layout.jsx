import { motion } from 'framer-motion';
export default function Layout({ children }) {
  return (
    <div className="fixed inset-0 bg-white text-stone-900 antialiased overflow-hidden">
      <motion.div className="absolute inset-3 z-10 overflow-y-auto">{children}</motion.div>
    </div>
  );
}