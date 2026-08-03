import type { AppModule } from './permissions';

export const routes = {
  login: '/login',
  dashboard: '/dashboard',
  expedientes: '/expedientes',
  expedienteNuevo: '/expedientes/nueva',
  atenciones: '/atenciones',
  seguimientos: '/seguimientos',
  reportes: '/reportes',
  usuarios: '/administracion/usuarios',
  auditoria: '/administracion/auditoria',
  noAutorizado: '/no-autorizado',
};

export type MenuItem = {
  label: string;
  to: string;
  module: AppModule;
};

export const menuItems: MenuItem[] = [
  { label: 'Panel principal', to: routes.dashboard, module: 'dashboard' },
  { label: 'Expedientes', to: routes.expedientes, module: 'expedientes' },
  { label: 'Atenciones', to: routes.atenciones, module: 'atenciones' },
  { label: 'Seguimientos', to: routes.seguimientos, module: 'seguimientos' },
  { label: 'Reportes', to: routes.reportes, module: 'reportes' },
  { label: 'Usuarios', to: routes.usuarios, module: 'usuarios' },
  { label: 'Auditoría', to: routes.auditoria, module: 'auditoria' },
];
