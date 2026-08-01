import { env } from '../../shared/config/env';
import type { SeguimientoInput, SeguimientoItem } from './seguimiento.types';

let seguimientos: SeguimientoItem[] = [
  { id: 'seg-1', expedienteId: 'exp-1', numeroExpediente: 'EXP-FICT-001', estado: 'En seguimiento', accionRealizada: 'Llamada institucional ficticia', proximaAccion: 'Revisión documental', fechaProximaRevision: '2026-08-05', responsable: 'Personal ficticio', vencimiento: 'Próximo' },
  { id: 'seg-2', expedienteId: 'exp-2', numeroExpediente: 'EXP-FICT-002', estado: 'Activo', accionRealizada: 'Orientación ficticia', proximaAccion: 'Agendar cita', responsable: 'Personal ficticio', vencimiento: 'Sin fecha' },
];

export async function listSeguimientos() { await new Promise((resolve) => window.setTimeout(resolve, 400)); return seguimientos; }
export async function createSeguimiento(input: SeguimientoInput): Promise<SeguimientoItem> { await new Promise((resolve) => window.setTimeout(resolve, 450)); if (!env.useMocks) throw new Error('Módulo pendiente de integración backend.'); const item = { id: `seg-${Date.now()}`, numeroExpediente: 'EXP-FICT', vencimiento: input.estado === 'Cerrado' ? 'Cerrado' : input.fechaProximaRevision ? 'Próximo' : 'Sin fecha', ...input } as SeguimientoItem; seguimientos = [item, ...seguimientos]; return item; }
