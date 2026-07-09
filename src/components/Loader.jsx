// src/components/Loader.jsx
// A small, reusable animated loading spinner used while auth/data resolves.

import { motion } from 'framer-motion';

const Loader = ({ fullScreen = true }) => {
  return (
    <div
      className={
        fullScreen
          ? 'flex min-h-screen w-full items-center justify-center bg-slate-50'
          : 'flex w-full items-center justify-center py-16'
      }
    >
      <motion.div
        className="h-12 w-12 rounded-full border-4 border-brand-100 border-t-brand-600"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      />
    </div>
  );
};

export default Loader;
