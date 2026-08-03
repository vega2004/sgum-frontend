import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
<<<<<<< HEAD
=======
import { LoadingState } from '../../shared/components/Ui';
>>>>>>> 9ec0819 (Conectar frontend con procesos backend reales)
import { routes } from '../../shared/config/routes';
import { useAuth } from './AuthProvider';

export function ProtectedRoute({ children }: { children: ReactNode }) {
<<<<<<< HEAD
  const { isAuthenticated } = useAuth();
  const location = useLocation();
=======
  const { isAuthenticated, isAuthLoading } = useAuth();
  const location = useLocation();
  if (isAuthLoading) return <LoadingState message="Validando sesión..." />;
>>>>>>> 9ec0819 (Conectar frontend con procesos backend reales)
  if (!isAuthenticated) return <Navigate to={routes.login} replace state={{ from: location }} />;
  return children;
}
