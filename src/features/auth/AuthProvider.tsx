import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../shared/config/routes';
import { setAccessToken } from '../../shared/lib/apiClient';
import type { AuthUser, LoginInput } from './auth.types';
import * as authService from './auth.service';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const navigate = useNavigate();

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      async login(input) {
        const response = await authService.login(input);
        setAccessToken(response.token);
        setUser(response.user);
        navigate(routes.dashboard, { replace: true });
      },
      logout() {
        setAccessToken(null);
        setUser(null);
        navigate(routes.login, { replace: true });
      },
    }),
    [navigate, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
