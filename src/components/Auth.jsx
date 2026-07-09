// src/components/Auth.jsx
//
// A single, reusable form component that handles BOTH login and
// registration, toggled via the `mode` prop. This avoids duplicating
// form markup/validation across two separate pages.

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const Auth = ({ mode = 'login' }) => {
  const isLogin = mode === 'login';
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (!isLogin && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
      } else {
        await signup(formData.email, formData.password, formData.name);
        toast.success('Account created! Welcome to Inkwell.');
      }
      navigate('/dashboard');
    } catch (error) {
      // Firebase error codes are mapped to friendlier messages.
      const messages = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-credential': 'Incorrect email or password.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect email or password.',
        'auth/weak-password': 'Password is too weak.',
        'auth/invalid-email': 'Please enter a valid email address.',
      };
      toast.error(messages[error.code] || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-gradient-to-br from-brand-50 via-white to-fuchsia-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-card"
      >
        <h1 className="mb-1 font-display text-2xl font-bold text-slate-800">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          {isLogin ? 'Log in to write and manage your posts.' : 'Join Inkwell and start publishing today.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="relative">
              <HiOutlineUser className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
                className="input-field pl-10"
              />
            </div>
          )}

          <div className="relative">
            <HiOutlineMail className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="email"
              name="email"
              required
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="input-field pl-10"
            />
          </div>

          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input-field pl-10"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="btn-primary mt-2 w-full"
          >
            {submitting ? 'Please wait…' : isLogin ? 'Log In' : 'Sign Up'}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <Link
            to={isLogin ? '/register' : '/login'}
            className="font-medium text-brand-600 hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
