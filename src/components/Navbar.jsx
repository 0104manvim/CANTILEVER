// src/components/Navbar.jsx
//
// Top navigation bar. Shows different actions depending on auth state,
// with small hover/tap animations powered by Framer Motion.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiOutlinePencilAlt } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out.');
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <HiOutlinePencilAlt className="text-brand-600" size={24} />
          <span className="text-gradient">Inkwell</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600">
            Home
          </Link>

          {currentUser ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
              >
                Dashboard
              </Link>
              <span className="text-sm text-slate-400">
                Hi, {currentUser.displayName || currentUser.email.split('@')[0]}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="btn-secondary !py-2"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !py-2">
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="btn-primary !py-2">
                  Get Started
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="text-slate-700 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX size={26} /> : <HiMenu size={26} />}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-slate-100 bg-white md:hidden"
          >
            <div className="flex flex-col gap-3 px-6 py-4">
              <Link to="/" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-slate-600">
                Home
              </Link>
              {currentUser ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-slate-600"
                  >
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="btn-secondary w-full">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary w-full">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary w-full">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
