// src/components/ProtectedRoute.jsx
//
// Wraps any route that requires authentication (e.g. Dashboard).
// Redirects unauthenticated users to /login, preserving where they
// came from so we could optionally redirect back after login.

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const { currentUser, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <Loader />;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
