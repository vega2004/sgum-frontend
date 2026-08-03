import { env } from '../../shared/config/env';
import { apiClient } from '../../shared/lib/apiClient';
import type { Expediente, ExpedienteFilters, ExpedienteForm, ExpedienteListItem } from './expediente.types';
import { mockCreateExpediente, mockDeleteExpediente, mockFindDuplicates, mockGetExpediente, mockSearchExpedientes, mockUpdateExpediente } from './expediente.mock';
<<<<<<< HEAD
import { mapExpedienteFormToUsuariaCreateDto, mapExpedienteFormToUsuariaUpdateDto, mapUsuariaListItemToExpedienteListItem, mapUsuariaResponseToExpediente, type UsuariaResponse } from './expediente.mappers';
=======
import { mapExpedienteFormToExpedienteCompletoUpdateDto, mapExpedienteFormToUsuariaCreateDto, mapExpedienteFormToUsuariaUpdateDto, mapUsuariaListItemToExpedienteListItem, mapUsuariaResponseToExpediente, mergeExpedienteCompleto, type ExpedienteCompletoResponseDto, type UsuariaResponse } from './expediente.mappers';
>>>>>>> 9ec0819 (Conectar frontend con procesos backend reales)

type PagedResponse<T> = T[] | { data?: T[]; items?: T[]; results?: T[] };

function toQuery(filters: ExpedienteFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (!value) return;
    if (key === 'busqueda' && !filters.nombre) {
      params.set('nombre', value);
      return;
    }
    if (key !== 'busqueda') params.set(key, value);
  });
  return params.toString();
}

function unwrapList<T>(response: PagedResponse<T>): T[] {
  if (Array.isArray(response)) return response;
  return response.data ?? response.items ?? response.results ?? [];
}

export async function searchExpedientes(filters: ExpedienteFilters): Promise<ExpedienteListItem[]> {
  if (env.useMocks) return mockSearchExpedientes(filters);
  const query = toQuery(filters);
  const response = await apiClient<PagedResponse<UsuariaResponse>>(`/api/usuarias/buscar${query ? `?${query}` : ''}`);
  return unwrapList(response).map(mapUsuariaListItemToExpedienteListItem);
}

export async function getExpediente(id: string): Promise<Expediente> {
  if (env.useMocks) return mockGetExpediente(id);
  const response = await apiClient<UsuariaResponse>(`/api/usuarias/${id}`);
<<<<<<< HEAD
  return mapUsuariaResponseToExpediente(response);
=======
  try {
    const completo = await apiClient<ExpedienteCompletoResponseDto>(`/api/usuarias/${id}/expediente-completo`);
    return mergeExpedienteCompleto(response, completo);
  } catch {
    return mapUsuariaResponseToExpediente(response);
  }
>>>>>>> 9ec0819 (Conectar frontend con procesos backend reales)
}

export async function createExpediente(input: ExpedienteForm): Promise<Expediente> {
  if (env.useMocks) return mockCreateExpediente(input);
  const response = await apiClient<UsuariaResponse>('/api/usuarias', { method: 'POST', body: JSON.stringify(mapExpedienteFormToUsuariaCreateDto(input)) });
<<<<<<< HEAD
  return mapUsuariaResponseToExpediente(response);
=======
  const id = String(response.id ?? response.usuariaId ?? response.usuarioId ?? '');
  if (!id) return mapUsuariaResponseToExpediente(response);
  const completo = await apiClient<ExpedienteCompletoResponseDto>(`/api/usuarias/${id}/expediente-completo`, { method: 'PUT', body: JSON.stringify(mapExpedienteFormToExpedienteCompletoUpdateDto(input)) });
  return mergeExpedienteCompleto(response, completo);
>>>>>>> 9ec0819 (Conectar frontend con procesos backend reales)
}

export async function updateExpediente(id: string, input: ExpedienteForm): Promise<Expediente> {
  if (env.useMocks) return mockUpdateExpediente(id, input);
  const response = await apiClient<UsuariaResponse>(`/api/usuarias/${id}`, { method: 'PUT', body: JSON.stringify(mapExpedienteFormToUsuariaUpdateDto(input)) });
<<<<<<< HEAD
  return mapUsuariaResponseToExpediente(response);
=======
  const completo = await apiClient<ExpedienteCompletoResponseDto>(`/api/usuarias/${id}/expediente-completo`, { method: 'PUT', body: JSON.stringify(mapExpedienteFormToExpedienteCompletoUpdateDto(input)) });
  return mergeExpedienteCompleto(response, completo);
>>>>>>> 9ec0819 (Conectar frontend con procesos backend reales)
}

export async function deleteExpediente(id: string): Promise<void> {
  if (env.useMocks) return mockDeleteExpediente(id);
  await apiClient<void>(`/api/usuarias/${id}`, { method: 'DELETE' });
}

export async function findPossibleDuplicates(input: Pick<ExpedienteForm, 'curp' | 'folioBanavim' | 'numeroExpediente' | 'nombres' | 'apellidoPaterno' | 'apellidoMaterno'>) {
  if (env.useMocks) return mockFindDuplicates(input);
  return searchExpedientes({ curp: input.curp, folioBanavim: input.folioBanavim, numeroExpediente: input.numeroExpediente, nombre: `${input.nombres} ${input.apellidoPaterno} ${input.apellidoMaterno}` });
}
