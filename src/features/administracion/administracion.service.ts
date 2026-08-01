import { env } from '../../shared/config/env';
import type { Role } from '../../shared/config/roles';

export type AdminUser = { id: string; nombre: string; usuario: string; rol: Role; activo: boolean };
export type AuditRow = { id: string; usuario: string; accion: string; fecha: string; expediente: string; resumen: string };

let users: AdminUser[] = [
  { id: 'usr-1', nombre: 'Responsable ficticia', usuario: 'admin.demo', rol: 'Administrador', activo: true },
  { id: 'usr-2', nombre: 'Atención ficticia', usuario: 'atencion.demo', rol: 'PersonalAtencion', activo: true },
];

export async function listUsers() { if (!env.useMocks) return [{ id: 'pending-users', nombre: 'Módulo pendiente de integración backend', usuario: 'pendiente', rol: 'Administrador' as Role, activo: false }]; return users; }
export async function saveUser(input: Omit<AdminUser, 'id'> & { id?: string }): Promise<AdminUser> { if (!env.useMocks) throw new Error('Módulo pendiente de integración backend.'); const saved: AdminUser = { ...input, id: input.id ?? `usr-${Date.now()}` }; users = input.id ? users.map((u) => u.id === input.id ? saved : u) : [saved, ...users]; return saved; }
export async function listAudit() { return [{ id: 'aud-1', usuario: env.useMocks ? 'admin.demo' : 'pendiente', accion: env.useMocks ? 'Consulta de expediente' : 'Módulo pendiente de integración backend', fecha: '2026-07-20', expediente: env.useMocks ? 'EXP-FICT-001' : 'N/A', resumen: env.useMocks ? 'Resumen de acción sin contenido completo modificado' : 'Auditoría aún no cuenta con endpoint real.' }]; }
