// ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ element, requiredRole }) => {
  const { authState } = useContext(AuthContext);

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && authState.userRole !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;