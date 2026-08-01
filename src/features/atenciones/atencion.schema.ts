import { z } from 'zod';
import { notFutureDate } from '../../shared/lib/validators';

export const atencionSchema = z.object({
  expedienteId: z.string().min(1),
  fecha: notFutureDate,
  motivo: z.string().min(1, 'Captura el motivo'),
  servicioOtorgado: z.string().min(1, 'Captura el servicio otorgado'),
  acciones: z.string().min(1, 'Captura las acciones realizadas'),
  observaciones: z.string().optional().default(''),
  datosHechos: z.string().optional().default(''),
  confirmar: z.boolean().refine((value) => value, 'Confirma antes de guardar'),
});
