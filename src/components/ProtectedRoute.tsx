import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser, isAdminOrSpecialUser } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdminOrSpecialUser(user)) {
    return <Navigate to="/404" replace />;
  }

  return children;
}
