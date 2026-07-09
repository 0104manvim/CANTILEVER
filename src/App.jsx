// src/App.jsx
//
// Root component: sets up routing and wraps each route in a
// Framer Motion transition so navigating between pages feels smooth
// rather than an abrupt swap.

import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostPage from './pages/PostPage';

// Shared fade/slide transition applied to every routed page.
const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};

const AnimatedPage = ({ children }) => (
  <motion.div {...pageTransition}>{children}</motion.div>
);

function App() {
  // `location` + `key` on <Routes> lets AnimatePresence detect route
  // changes and animate the outgoing/incoming page accordingly.
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
            <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
            <Route path="/post/:id" element={<AnimatedPage><PostPage /></AnimatedPage>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AnimatedPage>
                    <Dashboard />
                  </AnimatedPage>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>

      <footer className="border-t border-slate-100 py-6 text-center text-sm text-slate-400">
        Built with React, Firebase &amp; Framer Motion — Inkwell © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;
