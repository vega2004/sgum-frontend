export const roles = ['Administrador', 'PersonalAtencion', 'ConsultaCoordinacion'] as const;

export type Role = (typeof roles)[number];

export type Permission =
  | 'dashboard:view'
  | 'expedientes:read'
  | 'expedientes:write'
  | 'narracion:read'
  | 'atenciones:write'
  | 'seguimientos:read'
  | 'seguimientos:write'
  | 'reportes:read'
  | 'usuarios:admin'
  | 'auditoria:read';

export const roleLabels: Record<Role, string> = {
  Administrador: 'Administrador',
  PersonalAtencion: 'Personal de Atención',
  ConsultaCoordinacion: 'Consulta/Coordinación',
};

const backendPermissionsByPermission: Partial<Record<Permission, string[]>> = {
  'expedientes:read': ['Usuarias.Leer'],
  'expedientes:write': ['Usuarias.Crear', 'Usuarias.Editar'],
  'atenciones:write': ['Atenciones.Crear'],
  'seguimientos:read': ['Seguimientos.Leer'],
  'seguimientos:write': ['Seguimientos.Crear', 'Seguimientos.Editar'],
  'reportes:read': ['Reportes.Leer'],
  'usuarios:admin': ['Usuarios.Administrar'],
  'auditoria:read': ['Auditoria.Leer'],
};

const permissionsByRole: Record<Role, Permission[]> = {
  Administrador: [
    'dashboard:view',
    'expedientes:read',
    'expedientes:write',
    'narracion:read',
    'atenciones:write',
    'seguimientos:read',
    'seguimientos:write',
    'reportes:read',
    'usuarios:admin',
    'auditoria:read',
  ],
  PersonalAtencion: [
    'dashboard:view',
    'expedientes:read',
    'expedientes:write',
    'narracion:read',
    'atenciones:write',
    'seguimientos:read',
    'seguimientos:write',
  ],
  ConsultaCoordinacion: ['dashboard:view', 'expedientes:read', 'seguimientos:read', 'reportes:read', 'auditoria:read'],
};

export function hasPermission(role: Role | undefined, permission: Permission, permisos?: string[]) {
  if (!role) return false;
  if (permisos) {
    if (permission === 'dashboard:view') return true;
    const backendPermissions = backendPermissionsByPermission[permission];
    return backendPermissions ? backendPermissions.some((backendPermission) => permisos.includes(backendPermission)) : false;
  }
  return permissionsByRole[role].includes(permission);
}

export function hasAnyPermission(role: Role | undefined, permissions: Permission[], permisos?: string[]) {
  return permissions.some((permission) => hasPermission(role, permission, permisos));
}
