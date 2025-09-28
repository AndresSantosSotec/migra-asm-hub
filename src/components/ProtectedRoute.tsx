import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser, isAdminOrSpecialUser, hasMigrationAccessFromUser } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />; 
  }

  // allow admin or special user quickly
  if (isAdminOrSpecialUser(user)) return <>{children}</>;

  // otherwise evaluate permissions / allowedViews
  if (hasMigrationAccessFromUser(user)) return <>{children}</>;

  return <Navigate to="/404" replace />;

  return children;
}
