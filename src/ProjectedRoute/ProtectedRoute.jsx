import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  return token && user?.isAdmin
    ? children
    : <Navigate to="/LoginPage" />;
};

export default AdminProtectedRoute;
