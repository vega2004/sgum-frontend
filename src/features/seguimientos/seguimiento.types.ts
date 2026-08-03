<<<<<<< HEAD
export type SeguimientoInput = { expedienteId: string; estado: 'Activo' | 'En seguimiento' | 'Derivado' | 'Cerrado'; accionRealizada: string; proximaAccion: string; fechaProximaRevision?: string; observaciones?: string; derivacion?: boolean; institucion?: string; motivo?: string; responsable: string };
=======
export type SeguimientoInput = { expedienteId: string; numeroExpediente?: string; estado: 'Activo' | 'En seguimiento' | 'Derivado' | 'Cerrado'; accionRealizada: string; proximaAccion: string; fechaProximaRevision?: string; observaciones?: string; derivacion?: boolean; institucion?: string; motivo?: string; responsable: string };
>>>>>>> 9ec0819 (Conectar frontend con procesos backend reales)
export type SeguimientoItem = SeguimientoInput & { id: string; numeroExpediente: string; vencimiento: 'Próximo' | 'Vencido' | 'Sin fecha' | 'Cerrado' };
