// src/context/AuthContext.jsx
//
// This context is the single source of truth for "who is logged in".
// It wraps Firebase Auth's imperative API (signUp/logIn/logOut) in a
// React-friendly shape, and keeps `currentUser` in sync via onAuthStateChanged.

import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext(null);

// Custom hook — lets any component do `const { currentUser } = useAuth()`
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  // `authLoading` prevents flicker: we don't know if a user is logged in
  // until Firebase confirms it, so we block rendering protected routes
  // until this resolves at least once.
  const [authLoading, setAuthLoading] = useState(true);

  // Register a brand-new user with email/password, then attach their
  // display name to the Firebase Auth profile so we can show it in the UI.
  const signup = async (email, password, displayName) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }
    return credential;
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  useEffect(() => {
    // Subscribe once on mount; Firebase calls this back whenever auth
    // state changes (login, logout, token refresh, tab restore, etc.)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return unsubscribe; // clean up the listener on unmount
  }, []);

  const value = {
    currentUser,
    authLoading,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
