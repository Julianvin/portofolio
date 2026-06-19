import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

export default function AdminAuthBoundary({ children, requireAuth = true }) {
  return (
    <AuthProvider>
      {requireAuth ? <ProtectedRoute>{children}</ProtectedRoute> : children}
    </AuthProvider>
  );
}
