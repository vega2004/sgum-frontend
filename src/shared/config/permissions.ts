import { env } from './env';
import type { Role } from './roles';

export type BackendPermission =
  | 'Dashboard.Leer'
  | 'Usuarias.Leer'
  | 'Usuarias.Crear'
  | 'Usuarias.Editar'
  | 'Usuarias.Eliminar'
  | 'Atenciones.Leer'
  | 'Atenciones.Crear'
  | 'Atenciones.Editar'
  | 'Atenciones.Eliminar'
  | 'Seguimientos.Leer'
  | 'Seguimientos.Crear'
  | 'Seguimientos.Editar'
  | 'Seguimientos.Cerrar'
  | 'Seguimientos.Eliminar'
  | 'Reportes.Leer'
  | 'Usuarios.Administrar'
  | 'Auditoria.Leer';

export type Permission = BackendPermission | 'Narracion.Leer';
export type AppModule = 'dashboard' | 'expedientes' | 'atenciones' | 'seguimientos' | 'reportes' | 'usuarios' | 'auditoria';
export type Resource = 'expedientes' | 'atenciones' | 'seguimientos' | 'usuarios';

export type PermissionUser = {
  role?: Role;
  permisos?: string[];
} | null | undefined;

export const allBackendPermissions: BackendPermission[] = [
  'Dashboard.Leer',
  'Usuarias.Leer',
  'Usuarias.Crear',
  'Usuarias.Editar',
  'Usuarias.Eliminar',
  'Atenciones.Leer',
  'Atenciones.Crear',
  'Atenciones.Editar',
  'Atenciones.Eliminar',
  'Seguimientos.Leer',
  'Seguimientos.Crear',
  'Seguimientos.Editar',
  'Seguimientos.Cerrar',
  'Seguimientos.Eliminar',
  'Reportes.Leer',
  'Usuarios.Administrar',
  'Auditoria.Leer',
];

export const mockPermissionsByRole: Record<Role, Permission[]> = {
  Administrador: [...allBackendPermissions, 'Narracion.Leer'],
  PersonalAtencion: [
    'Dashboard.Leer',
    'Usuarias.Leer',
    'Usuarias.Crear',
    'Usuarias.Editar',
    'Atenciones.Leer',
    'Atenciones.Crear',
    'Atenciones.Editar',
    'Seguimientos.Leer',
    'Seguimientos.Crear',
    'Seguimientos.Editar',
    'Seguimientos.Cerrar',
    'Narracion.Leer',
  ],
  ConsultaCoordinacion: [
    'Dashboard.Leer',
    'Usuarias.Leer',
    'Atenciones.Leer',
    'Seguimientos.Leer',
    'Reportes.Leer',
    'Auditoria.Leer',
  ],
};

const modulePermissions: Record<Exclude<AppModule, 'dashboard'>, BackendPermission> = {
  expedientes: 'Usuarias.Leer',
  atenciones: 'Atenciones.Leer',
  seguimientos: 'Seguimientos.Leer',
  reportes: 'Reportes.Leer',
  usuarios: 'Usuarios.Administrar',
  auditoria: 'Auditoria.Leer',
};

const createPermissions: Partial<Record<Resource, BackendPermission>> = {
  expedientes: 'Usuarias.Crear',
  atenciones: 'Atenciones.Crear',
  seguimientos: 'Seguimientos.Crear',
  usuarios: 'Usuarios.Administrar',
};

const editPermissions: Partial<Record<Resource, BackendPermission>> = {
  expedientes: 'Usuarias.Editar',
  atenciones: 'Atenciones.Editar',
  seguimientos: 'Seguimientos.Editar',
  usuarios: 'Usuarios.Administrar',
};

const deletePermissions: Partial<Record<Resource, BackendPermission>> = {
  expedientes: 'Usuarias.Eliminar',
  atenciones: 'Atenciones.Eliminar',
  seguimientos: 'Seguimientos.Eliminar',
  usuarios: 'Usuarios.Administrar',
};

function roleFallback(user: PermissionUser, permission: Permission) {
  if (!env.useMocks || !user?.role) return false;
  return mockPermissionsByRole[user.role].includes(permission);
}

export function hasPermission(user: PermissionUser, permiso: Permission) {
  if (!user) return false;
  if (permiso === 'Dashboard.Leer') return true;
  if (user.permisos) return user.permisos.includes(permiso);
  return roleFallback(user, permiso);
}

export function hasAnyPermission(user: PermissionUser, permisos: Permission[]) {
  return permisos.some((permiso) => hasPermission(user, permiso));
}

export function hasAllPermissions(user: PermissionUser, permisos: Permission[]) {
  return permisos.every((permiso) => hasPermission(user, permiso));
}

export function canViewModule(user: PermissionUser, module: AppModule) {
  if (module === 'dashboard') return Boolean(user);
  return hasPermission(user, modulePermissions[module]);
}

export function canCreate(user: PermissionUser, resource: Resource) {
  const permiso = createPermissions[resource];
  return permiso ? hasPermission(user, permiso) : false;
}

export function canEdit(user: PermissionUser, resource: Resource) {
  const permiso = editPermissions[resource];
  return permiso ? hasPermission(user, permiso) : false;
}

export function canDelete(user: PermissionUser, resource: Resource) {
  const permiso = deletePermissions[resource];
  return permiso ? hasPermission(user, permiso) : false;
}

export function canReviewOrClose(user: PermissionUser, resource: Resource) {
  if (resource !== 'seguimientos') return canEdit(user, resource);
  return hasAnyPermission(user, ['Seguimientos.Editar', 'Seguimientos.Cerrar']);
}
