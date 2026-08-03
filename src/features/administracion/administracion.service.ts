import { env } from '../../shared/config/env';
import type { Role } from '../../shared/config/roles';
import { apiClient } from '../../shared/lib/apiClient';

export type AdminUser = { id: string; nombre: string; usuario: string; rol: Role | string; rolSistemaId?: number; activo: boolean; bloqueado?: boolean; debeCambiarPassword?: boolean; ultimoAcceso?: string };
export type AdminUserInput = { id?: string; nombre: string; usuario: string; rolSistemaId: number; passwordTemporal?: string };
export type AdminRole = { id: number; nombre: string };
export type AuditRow = { id: string; usuario: string; accion: string; entidad: string; entidadId: string; descripcion: string; fecha: string; ip: string; userAgent: string; expediente: string; resumen: string };
export type AuditFilters = { usuario?: string; accion?: string; entidad?: string; entidadId?: string; fechaInicial?: string; fechaFinal?: string; pageNumber?: number; pageSize?: number };

type BackendUser = {
  id: number;
  nombreCompleto?: string | null;
  usuario?: string | null;
  activo: boolean;
  bloqueado?: boolean;
  debeCambiarPassword?: boolean;
  rolSistemaId?: number;
  rol?: string | null;
  ultimoAcceso?: string | null;
};

type BackendAudit = Partial<{ id: number; usuario: string; accion: string; entidad: string; entidadId: number | string; descripcion: string; fecha: string; ip: string; userAgent: string; expediente: string; resumen: string }>;

let users: AdminUser[] = [
  { id: 'usr-1', nombre: 'Responsable ficticia', usuario: 'admin.demo', rol: 'Administrador', rolSistemaId: 1, activo: true },
  { id: 'usr-2', nombre: 'Atención ficticia', usuario: 'atencion.demo', rol: 'PersonalAtencion', rolSistemaId: 2, activo: true },
];

const mockRoles: AdminRole[] = [
  { id: 1, nombre: 'Administrador' },
  { id: 2, nombre: 'PersonalAtencion' },
  { id: 3, nombre: 'ConsultaCoordinacion' },
];

function delay(ms = 250) { return new Promise((resolve) => window.setTimeout(resolve, ms)); }

function unwrapList<T>(response: T[] | { data?: T[]; items?: T[]; results?: T[] }) {
  if (Array.isArray(response)) return response;
  return response.data ?? response.items ?? response.results ?? [];
}

function mapUser(input: BackendUser): AdminUser {
  return { id: String(input.id), nombre: input.nombreCompleto ?? '', usuario: input.usuario ?? '', rol: input.rol ?? '', rolSistemaId: input.rolSistemaId, activo: input.activo, bloqueado: input.bloqueado, debeCambiarPassword: input.debeCambiarPassword, ultimoAcceso: input.ultimoAcceso ?? undefined };
}

function toRole(input: unknown): AdminRole {
  if (input && typeof input === 'object') {
    const row = input as Record<string, unknown>;
    return { id: Number(row.id ?? row.rolSistemaId ?? 0), nombre: String(row.nombre ?? row.rol ?? row.descripcion ?? '') };
  }
  return { id: 0, nombre: String(input) };
}

function toAuditQuery(filters: AuditFilters = {}) {
  const params = new URLSearchParams();
  if (filters.usuario) params.set('Usuario', filters.usuario);
  if (filters.accion) params.set('Accion', filters.accion);
  if (filters.entidad) params.set('Entidad', filters.entidad);
  if (filters.entidadId) params.set('EntidadId', filters.entidadId);
  if (filters.fechaInicial) params.set('FechaInicial', filters.fechaInicial);
  if (filters.fechaFinal) params.set('FechaFinal', filters.fechaFinal);
  if (filters.pageNumber) params.set('PageNumber', String(filters.pageNumber));
  if (filters.pageSize) params.set('PageSize', String(filters.pageSize));
  return params.toString();
}

function mapAudit(input: BackendAudit, index: number): AuditRow {
  const entidadId = String(input.entidadId ?? '');
  const descripcion = input.descripcion ?? input.resumen ?? '';
  return { id: String(input.id ?? index), usuario: input.usuario ?? '', accion: input.accion ?? '', entidad: input.entidad ?? '', entidadId, descripcion, fecha: input.fecha?.slice(0, 19).replace('T', ' ') ?? '', ip: input.ip ?? '', userAgent: input.userAgent ?? '', expediente: input.expediente ?? entidadId, resumen: descripcion };
}

export async function listRoles() {
  if (env.useMocks) return mockRoles;
  const response = await apiClient<unknown[] | { data?: unknown[]; items?: unknown[]; results?: unknown[] }>('/api/roles');
  return unwrapList(response).map(toRole).filter((role) => role.id && role.nombre);
}

export async function listUsers() {
  if (env.useMocks) { await delay(); return users; }
  const response = await apiClient<BackendUser[]>('/api/usuarios');
  return response.map(mapUser);
}

export async function saveUser(input: AdminUserInput): Promise<AdminUser> {
  if (!env.useMocks) {
    const payload = input.id ? { nombreCompleto: input.nombre, usuario: input.usuario, rolSistemaId: input.rolSistemaId } : { nombreCompleto: input.nombre, usuario: input.usuario, passwordTemporal: input.passwordTemporal, rolSistemaId: input.rolSistemaId };
    const response = await apiClient<BackendUser>(input.id ? `/api/usuarios/${input.id}` : '/api/usuarios', { method: input.id ? 'PUT' : 'POST', body: JSON.stringify(payload) });
    return mapUser(response);
  }
  await delay();
  const role = mockRoles.find((item) => item.id === input.rolSistemaId)?.nombre ?? 'PersonalAtencion';
  const saved: AdminUser = { id: input.id ?? `usr-${Date.now()}`, nombre: input.nombre, usuario: input.usuario, rol: role, rolSistemaId: input.rolSistemaId, activo: true };
  users = input.id ? users.map((u) => u.id === input.id ? saved : u) : [saved, ...users];
  return saved;
}

export async function activateUser(id: string) {
  if (!env.useMocks) return mapUser(await apiClient<BackendUser>(`/api/usuarios/${id}/activar`, { method: 'PATCH' }));
  await delay();
  users = users.map((user) => user.id === id ? { ...user, activo: true } : user);
  return users.find((user) => user.id === id)!;
}

export async function deactivateUser(id: string) {
  if (!env.useMocks) return mapUser(await apiClient<BackendUser>(`/api/usuarios/${id}/desactivar`, { method: 'PATCH' }));
  await delay();
  users = users.map((user) => user.id === id ? { ...user, activo: false } : user);
  return users.find((user) => user.id === id)!;
}

export async function unlockUser(id: string) {
  if (!env.useMocks) return mapUser(await apiClient<BackendUser>(`/api/usuarios/${id}/desbloquear`, { method: 'PATCH' }));
  await delay();
  users = users.map((user) => user.id === id ? { ...user, bloqueado: false } : user);
  return users.find((user) => user.id === id)!;
}

export async function changeUserPassword(id: string, nuevaPassword: string) {
  if (!env.useMocks) return mapUser(await apiClient<BackendUser>(`/api/usuarios/${id}/cambiar-password`, { method: 'PATCH', body: JSON.stringify({ nuevaPassword }) }));
  await delay();
  return users.find((user) => user.id === id)!;
}

export async function listAudit(filters: AuditFilters = {}) {
  if (env.useMocks) return [{ id: 'aud-1', usuario: 'admin.demo', accion: 'Consulta de expediente', entidad: 'Expediente', entidadId: 'EXP-FICT-001', descripcion: 'Resumen de acción sin contenido completo modificado', fecha: '2026-07-20', ip: '127.0.0.1', userAgent: 'Demo', expediente: 'EXP-FICT-001', resumen: 'Resumen de acción sin contenido completo modificado' }];
  const query = toAuditQuery(filters);
  const response = await apiClient<BackendAudit[] | { data?: BackendAudit[]; items?: BackendAudit[]; results?: BackendAudit[] }>(`/api/auditorias${query ? `?${query}` : ''}`);
  return unwrapList(response).map(mapAudit);
}
