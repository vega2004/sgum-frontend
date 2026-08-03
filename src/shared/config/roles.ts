export const roles = ['Administrador', 'PersonalAtencion', 'ConsultaCoordinacion'] as const;

export type Role = (typeof roles)[number];

export const roleLabels: Record<Role, string> = {
  Administrador: 'Administrador',
  PersonalAtencion: 'Personal de Atención',
  ConsultaCoordinacion: 'Consulta/Coordinación',
};
