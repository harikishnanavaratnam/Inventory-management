import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAdmin = !!localStorage.getItem('token');
  return isAdmin ? children : <Navigate to="/admin/login" />;
};

export default ProtectedRoute; 