import { z } from 'zod';

export const seguimientoSchema = z.object({
  expedienteId: z.string().min(1),
  numeroExpediente: z.string().optional(),
  estado: z.enum(['Activo', 'En seguimiento', 'Derivado', 'Cerrado']),
  accionRealizada: z.string().min(1, 'Captura la acción realizada'),
  proximaAccion: z.string().min(1, 'Captura la próxima acción'),
  fechaProximaRevision: z.string().optional(),
  observaciones: z.string().optional(),
  derivacion: z.boolean().optional(),
  institucion: z.string().optional(),
  motivo: z.string().optional(),
  responsable: z.string().min(1, 'Captura la persona responsable'),
});
