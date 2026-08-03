export type AtencionInput = { usuariaId: string; fechaAtencion: string; tipoAtencion: string; areaAtencion: string; responsable: string; motivo: string; observaciones: string; resultado: string; confirmar: boolean };
export type AtencionItem = Omit<AtencionInput, 'confirmar'> & { id: string; activo: boolean };
export type AtencionFilters = { usuariaId?: string; fechaInicial?: string; fechaFinal?: string; tipoAtencion?: string; responsable?: string; pageNumber?: number; pageSize?: number };
