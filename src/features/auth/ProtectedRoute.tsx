import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingState } from '../../shared/components/Ui';
import { routes } from '../../shared/config/routes';
import { useAuth } from './AuthProvider';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const location = useLocation();
  if (isAuthLoading) return <LoadingState message="Validando sesión..." />;
  if (!isAuthenticated) return <Navigate to={routes.login} replace state={{ from: location }} />;
  return children;
}
