import type { Role } from '../../shared/config/roles';

export type AuthUser = {
  id: string;
  name: string;
  username: string;
  role: Role;
  permisos?: string[];
};

export type LoginInput = {
  username: string;
  password: string;
};

export type LoginResponse = {
  user: AuthUser;
  token: string;
};

export type BackendLoginRequest = {
  usuario: string;
  password: string;
};

export type BackendLoginResponse = {
  token: string;
  expiration: string;
  usuarioId: number;
  nombreCompleto: string;
  usuario: string;
  rol: Role;
  permisos: string[];
};
<<<<<<< HEAD
=======

export type BackendCurrentUserResponse = {
  usuarioId: number;
  nombreCompleto: string;
  usuario: string;
  rol: Role;
  permisos?: string[];
};
>>>>>>> 9ec0819 (Conectar frontend con procesos backend reales)
