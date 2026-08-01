import type { Permission } from './roles';

export const routes = {
  login: '/login',
  dashboard: '/dashboard',
  expedientes: '/expedientes',
  expedienteNuevo: '/expedientes/nueva',
  seguimientos: '/seguimientos',
  reportes: '/reportes',
  usuarios: '/administracion/usuarios',
  auditoria: '/administracion/auditoria',
  noAutorizado: '/no-autorizado',
};

export type MenuItem = {
  label: string;
  to: string;
  permission: Permission;
};

export const menuItems: MenuItem[] = [
  { label: 'Panel principal', to: routes.dashboard, permission: 'dashboard:view' },
  { label: 'Expedientes', to: routes.expedientes, permission: 'expedientes:read' },
  { label: 'Seguimientos', to: routes.seguimientos, permission: 'seguimientos:read' },
  { label: 'Reportes', to: routes.reportes, permission: 'reportes:read' },
  { label: 'Usuarios', to: routes.usuarios, permission: 'usuarios:admin' },
  { label: 'Auditoría', to: routes.auditoria, permission: 'auditoria:read' },
];
