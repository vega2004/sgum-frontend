import { env } from '../../shared/config/env';
import { apiClient } from '../../shared/lib/apiClient';
import type { AtencionFilters, AtencionInput, AtencionItem } from './atencion.types';

type BackendAtencion = {
  id: number;
  usuariaId: number;
  fechaAtencion: string;
  tipoAtencion?: string | null;
  areaAtencion?: string | null;
  responsable?: string | null;
  motivo?: string | null;
  observaciones?: string | null;
  resultado?: string | null;
  activo: boolean;
};

let atenciones: AtencionItem[] = [];

function delay(ms = 450) { return new Promise((resolve) => window.setTimeout(resolve, ms)); }

function toQuery(filters: AtencionFilters = {}) {
  const params = new URLSearchParams();
  if (filters.usuariaId) params.set('UsuariaId', filters.usuariaId);
  if (filters.fechaInicial) params.set('FechaInicial', filters.fechaInicial);
  if (filters.fechaFinal) params.set('FechaFinal', filters.fechaFinal);
  if (filters.tipoAtencion) params.set('TipoAtencion', filters.tipoAtencion);
  if (filters.responsable) params.set('Responsable', filters.responsable);
  if (filters.pageNumber) params.set('PageNumber', String(filters.pageNumber));
  if (filters.pageSize) params.set('PageSize', String(filters.pageSize));
  return params.toString();
}

function unwrapList<T>(response: T[] | { data?: T[]; items?: T[]; results?: T[] }) {
  if (Array.isArray(response)) return response;
  return response.data ?? response.items ?? response.results ?? [];
}

function mapBackendAtencion(input: BackendAtencion): AtencionItem {
  return {
    id: String(input.id),
    usuariaId: String(input.usuariaId),
    fechaAtencion: input.fechaAtencion?.slice(0, 10) ?? '',
    tipoAtencion: input.tipoAtencion ?? '',
    areaAtencion: input.areaAtencion ?? '',
    responsable: input.responsable ?? '',
    motivo: input.motivo ?? '',
    observaciones: input.observaciones ?? '',
    resultado: input.resultado ?? '',
    activo: input.activo,
  };
}

function toPayload(input: AtencionInput) {
  return {
    usuariaId: Number(input.usuariaId),
    fechaAtencion: input.fechaAtencion,
    tipoAtencion: input.tipoAtencion,
    areaAtencion: input.areaAtencion,
    responsable: input.responsable,
    motivo: input.motivo,
    observaciones: input.observaciones,
    resultado: input.resultado,
  };
}

export async function listAtenciones(filters: AtencionFilters = {}) {
  if (env.useMocks) {
    await delay(250);
    return atenciones.filter((item) => !filters.usuariaId || item.usuariaId === filters.usuariaId);
  }
  const query = toQuery(filters);
  const response = await apiClient<BackendAtencion[] | { data?: BackendAtencion[]; items?: BackendAtencion[]; results?: BackendAtencion[] }>(`/api/atenciones${query ? `?${query}` : ''}`);
  return unwrapList(response).map(mapBackendAtencion);
}

export async function getAtencion(id: string) {
  if (env.useMocks) {
    await delay(250);
    const item = atenciones.find((row) => row.id === id);
    if (!item) throw new Error('No se encontró la atención solicitada.');
    return item;
  }
  return mapBackendAtencion(await apiClient<BackendAtencion>(`/api/atenciones/${id}`));
}

export async function createAtencion(input: AtencionInput) {
  if (!env.useMocks) return mapBackendAtencion(await apiClient<BackendAtencion>('/api/atenciones', { method: 'POST', body: JSON.stringify(toPayload(input)) }));
  await delay();
  const item: AtencionItem = { id: `atencion-${Date.now()}`, ...input, activo: true };
  atenciones = [item, ...atenciones];
  return item;
}

export async function updateAtencion(id: string, input: AtencionInput) {
  if (!env.useMocks) return mapBackendAtencion(await apiClient<BackendAtencion>(`/api/atenciones/${id}`, { method: 'PUT', body: JSON.stringify(toPayload(input)) }));
  await delay();
  const item: AtencionItem = { id, ...input, activo: true };
  atenciones = atenciones.map((row) => row.id === id ? item : row);
  return item;
}

export async function deleteAtencion(id: string) {
  if (!env.useMocks) return apiClient<void>(`/api/atenciones/${id}`, { method: 'DELETE' });
  await delay(250);
  atenciones = atenciones.filter((row) => row.id !== id);
}
