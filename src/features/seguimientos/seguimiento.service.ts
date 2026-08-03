import { env } from '../../shared/config/env';
import { apiClient } from '../../shared/lib/apiClient';
import type { SeguimientoInput, SeguimientoItem } from './seguimiento.types';

export type SeguimientoFilters = { estado?: string; fechaInicial?: string; fechaFinal?: string; responsable?: string; numeroExpediente?: string; pageNumber?: number; pageSize?: number };

type BackendSeguimiento = {
  id: number;
  usuariaId: number;
  numeroExpediente?: string | null;
  estado?: string | null;
  periodo?: string | null;
  proximaAccion?: string | null;
  fechaProgramada?: string | null;
  responsable?: string | null;
  observaciones?: string | null;
  fechaCierre?: string | null;
  activo: boolean;
};

let seguimientos: SeguimientoItem[] = [
  { id: 'seg-1', expedienteId: 'exp-1', numeroExpediente: 'EXP-FICT-001', estado: 'En seguimiento', accionRealizada: 'Llamada institucional ficticia', proximaAccion: 'Revisión documental', fechaProximaRevision: '2026-08-05', responsable: 'Personal ficticio', vencimiento: 'Próximo' },
  { id: 'seg-2', expedienteId: 'exp-2', numeroExpediente: 'EXP-FICT-002', estado: 'Activo', accionRealizada: 'Orientación ficticia', proximaAccion: 'Agendar cita', responsable: 'Personal ficticio', vencimiento: 'Sin fecha' },
];

function delay(ms = 400) { return new Promise((resolve) => window.setTimeout(resolve, ms)); }

function toQuery(filters: SeguimientoFilters = {}) {
  const params = new URLSearchParams();
  if (filters.estado) params.set('Estado', filters.estado);
  if (filters.fechaInicial) params.set('FechaInicial', filters.fechaInicial);
  if (filters.fechaFinal) params.set('FechaFinal', filters.fechaFinal);
  if (filters.responsable) params.set('Responsable', filters.responsable);
  if (filters.numeroExpediente) params.set('NumeroExpediente', filters.numeroExpediente);
  if (filters.pageNumber) params.set('PageNumber', String(filters.pageNumber));
  if (filters.pageSize) params.set('PageSize', String(filters.pageSize));
  return params.toString();
}

function unwrapList<T>(response: T[] | { data?: T[]; items?: T[]; results?: T[] }) {
  if (Array.isArray(response)) return response;
  return response.data ?? response.items ?? response.results ?? [];
}

function toPeriodo(input: SeguimientoInput): SeguimientoItem['vencimiento'] {
  if (input.estado === 'Cerrado') return 'Cerrado';
  if (!input.fechaProximaRevision) return 'Sin fecha';
  return input.fechaProximaRevision < new Date().toISOString().slice(0, 10) ? 'Vencido' : 'Próximo';
}

function normalizePeriodo(value?: string | null): SeguimientoItem['vencimiento'] {
  if (value === 'Proximo' || value === 'Próximo') return 'Próximo';
  if (value === 'Vencido') return 'Vencido';
  if (value === 'Cerrado') return 'Cerrado';
  return 'Sin fecha';
}

function backendPeriodo(value: SeguimientoItem['vencimiento']) {
  return value === 'Próximo' ? 'Proximo' : value === 'Sin fecha' ? 'SinFecha' : value;
}

function mapBackendSeguimiento(input: BackendSeguimiento): SeguimientoItem {
  return {
    id: String(input.id),
    expedienteId: String(input.usuariaId),
    numeroExpediente: input.numeroExpediente ?? '',
    estado: (input.estado as SeguimientoInput['estado']) || 'En seguimiento',
    accionRealizada: '',
    proximaAccion: input.proximaAccion ?? '',
    fechaProximaRevision: input.fechaProgramada?.slice(0, 10) ?? undefined,
    observaciones: input.observaciones ?? undefined,
    responsable: input.responsable ?? '',
    vencimiento: normalizePeriodo(input.periodo),
  };
}

function toPayload(input: SeguimientoInput) {
  const periodo = toPeriodo(input);
  return {
    usuariaId: Number(input.expedienteId),
    numeroExpediente: input.numeroExpediente,
    estado: input.estado,
    periodo: backendPeriodo(periodo),
    proximaAccion: input.proximaAccion,
    fechaProgramada: input.fechaProximaRevision || null,
    responsable: input.responsable,
    observaciones: [input.accionRealizada, input.observaciones].filter(Boolean).join('\n'),
  };
}

export async function listSeguimientos(filters: SeguimientoFilters = {}) {
  if (env.useMocks) {
    await delay();
    return seguimientos.filter((row) => {
      const byEstado = !filters.estado || row.estado === filters.estado;
      const byResponsable = !filters.responsable || row.responsable.toLowerCase().includes(filters.responsable.toLowerCase());
      const byExpediente = !filters.numeroExpediente || row.numeroExpediente.toLowerCase().includes(filters.numeroExpediente.toLowerCase());
      const byDateStart = !filters.fechaInicial || (row.fechaProximaRevision ?? '') >= filters.fechaInicial;
      const byDateEnd = !filters.fechaFinal || (row.fechaProximaRevision ?? '') <= filters.fechaFinal;
      return byEstado && byResponsable && byExpediente && byDateStart && byDateEnd;
    });
  }
  const query = toQuery(filters);
  const response = await apiClient<BackendSeguimiento[] | { data?: BackendSeguimiento[]; items?: BackendSeguimiento[]; results?: BackendSeguimiento[] }>(`/api/seguimientos${query ? `?${query}` : ''}`);
  return unwrapList(response).map(mapBackendSeguimiento);
}

export async function getSeguimiento(id: string) {
  if (env.useMocks) {
    await delay(250);
    const item = seguimientos.find((row) => row.id === id);
    if (!item) throw new Error('No se encontró el seguimiento solicitado.');
    return item;
  }
  return mapBackendSeguimiento(await apiClient<BackendSeguimiento>(`/api/seguimientos/${id}`));
}

export async function createSeguimiento(input: SeguimientoInput): Promise<SeguimientoItem> {
  if (!env.useMocks) return mapBackendSeguimiento(await apiClient<BackendSeguimiento>('/api/seguimientos', { method: 'POST', body: JSON.stringify(toPayload(input)) }));
  await delay(450);
  const item = { id: `seg-${Date.now()}`, numeroExpediente: input.numeroExpediente || 'EXP-FICT', vencimiento: toPeriodo(input), ...input } as SeguimientoItem;
  seguimientos = [item, ...seguimientos];
  return item;
}

export async function updateSeguimiento(id: string, input: SeguimientoInput) {
  if (!env.useMocks) return mapBackendSeguimiento(await apiClient<BackendSeguimiento>(`/api/seguimientos/${id}`, { method: 'PUT', body: JSON.stringify(toPayload(input)) }));
  await delay(350);
  const item = { id, numeroExpediente: input.numeroExpediente || 'EXP-FICT', vencimiento: toPeriodo(input), ...input } as SeguimientoItem;
  seguimientos = seguimientos.map((row) => row.id === id ? item : row);
  return item;
}

export async function closeSeguimiento(id: string) {
  if (!env.useMocks) return mapBackendSeguimiento(await apiClient<BackendSeguimiento>(`/api/seguimientos/${id}/cerrar`, { method: 'PATCH' }));
  await delay(250);
  const item = seguimientos.find((row) => row.id === id);
  if (!item) throw new Error('No se encontró el seguimiento solicitado.');
  const closed = { ...item, estado: 'Cerrado' as const, vencimiento: 'Cerrado' as const };
  seguimientos = seguimientos.map((row) => row.id === id ? closed : row);
  return closed;
}

export async function deleteSeguimiento(id: string) {
  if (!env.useMocks) return apiClient<void>(`/api/seguimientos/${id}`, { method: 'DELETE' });
  await delay(250);
  seguimientos = seguimientos.filter((row) => row.id !== id);
}
