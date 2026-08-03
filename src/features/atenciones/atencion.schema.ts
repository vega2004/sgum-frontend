import { z } from 'zod';
import { notFutureDate } from '../../shared/lib/validators';

export const atencionSchema = z.object({
  usuariaId: z.string().min(1),
  fechaAtencion: notFutureDate,
  tipoAtencion: z.string().min(1, 'Captura el tipo de atención'),
  areaAtencion: z.string().min(1, 'Captura el área de atención'),
  responsable: z.string().min(1, 'Captura la persona responsable'),
  motivo: z.string().min(1, 'Captura el motivo'),
  observaciones: z.string().optional().default(''),
  resultado: z.string().min(1, 'Captura el resultado'),
  confirmar: z.boolean().refine((value) => value, 'Confirma antes de guardar'),
});
