import { env } from '../../shared/config/env';
import { mockPermissionsByRole } from '../../shared/config/permissions';
import { apiClient } from '../../shared/lib/apiClient';
import type { Role } from '../../shared/config/roles';
import type { AuthUser, BackendCurrentUserResponse, BackendLoginRequest, BackendLoginResponse, LoginInput, LoginResponse } from './auth.types';

export const demoAccounts = [
  { label: 'Administrador', username: 'admin.demo', password: 'Demo123!', user: mockUser('mock-admin', 'Responsable Administrativa', 'admin.demo', 'Administrador') },
  { label: 'Personal de Atención', username: 'atencion.demo', password: 'Demo123!', user: mockUser('mock-atencion', 'Personal de Atención', 'atencion.demo', 'PersonalAtencion') },
  { label: 'Coordinación', username: 'coordinacion.demo', password: 'Demo123!', user: mockUser('mock-coordinacion', 'Coordinación Autorizada', 'coordinacion.demo', 'ConsultaCoordinacion') },
];

function mockUser(id: string, name: string, username: string, role: Role): AuthUser {
  return { id, name, username, role, permisos: [...mockPermissionsByRole[role]] };
}

function delay(ms = 550) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  if (!env.useMocks) {
    const request: BackendLoginRequest = { usuario: input.username, password: input.password };
    const backend = await apiClient<BackendLoginResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(request) });
    return {
      token: backend.token,
      user: {
        id: String(backend.usuarioId),
        name: backend.nombreCompleto,
        username: backend.usuario,
        role: backend.rol,
        permisos: backend.permisos ?? [],
      },
    };
  }

  await delay();
  const account = demoAccounts.find((item) => item.username === input.username.trim() && item.password === input.password);
  if (!account) {
    throw new Error('Usuario o contraseña inválidos. Verifica la información capturada.');
  }

  return {
    token: `mock-token-${account.user.role}`,
    user: account.user,
  };
}

export async function getCurrentUser() {
  const backend = await apiClient<BackendCurrentUserResponse>('/api/auth/me');
  return {
    id: String(backend.usuarioId),
    name: backend.nombreCompleto,
    username: backend.usuario,
    role: backend.rol,
    permisos: backend.permisos ?? [],
  };
}
