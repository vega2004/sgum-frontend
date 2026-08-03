import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { routes } from '../../shared/config/routes';
import { hasAnyPermission, type Permission } from '../../shared/config/permissions';
import { useAuth } from './AuthProvider';

export function RoleRoute({ permissions, children }: { permissions: Permission[]; children: ReactNode }) {
  const { user } = useAuth();
  if (!hasAnyPermission(user, permissions)) return <Navigate to={routes.noAutorizado} replace />;
  return children;
}
