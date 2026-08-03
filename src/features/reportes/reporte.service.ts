import { env } from '../../shared/config/env';
<<<<<<< HEAD
=======
import { apiClient } from '../../shared/lib/apiClient';
>>>>>>> 9ec0819 (Conectar frontend con procesos backend reales)

export type ReporteFilters = { fechaInicial?: string; fechaFinal?: string; tipoViolencia?: string; modalidad?: string; estadoSeguimiento?: string; tipoAtencion?: string };
export type ReporteRow = { concepto: string; total: number; periodo: string };

<<<<<<< HEAD
export async function getReporteAtenciones(filters: ReporteFilters): Promise<ReporteRow[]> {
  await new Promise((resolve) => window.setTimeout(resolve, 450));
  return [
    { concepto: env.useMocks ? filters.tipoViolencia || 'Psicológica' : 'Módulo pendiente de integración backend', total: env.useMocks ? 8 : 0, periodo: 'Periodo filtrado' },
=======
function delay(ms = 450) { return new Promise((resolve) => window.setTimeout(resolve, ms)); }

function toQuery(filters: ReporteFilters) {
  const params = new URLSearchParams();
  if (filters.fechaInicial) params.set('fechaInicial', filters.fechaInicial);
  if (filters.fechaFinal) params.set('fechaFinal', filters.fechaFinal);
  return params.toString();
}

function rowsFromUnknown(data: unknown, periodo = 'Periodo filtrado'): ReporteRow[] {
  if (Array.isArray(data)) {
    return data.map((item, index) => {
      if (item && typeof item === 'object') {
        const row = item as Record<string, unknown>;
        const concepto = String(row.concepto ?? row.nombre ?? row.etiqueta ?? row.tipo ?? `Registro ${index + 1}`);
        const total = Number(row.total ?? row.cantidad ?? row.valor ?? 0);
        return { concepto, total: Number.isFinite(total) ? total : 0, periodo: String(row.periodo ?? periodo) };
      }
      return { concepto: String(item), total: 0, periodo };
    });
  }
  if (data && typeof data === 'object') {
    return Object.entries(data as Record<string, unknown>).map(([concepto, value]) => ({ concepto, total: Number(value) || 0, periodo }));
  }
  return [];
}

export async function getReporteResumen(filters: ReporteFilters): Promise<ReporteRow[]> {
  if (env.useMocks) return getReporteAtenciones(filters);
  const query = toQuery(filters);
  return rowsFromUnknown(await apiClient<unknown>(`/api/reportes/resumen${query ? `?${query}` : ''}`));
}

export async function getReporteUsuarias(filters: ReporteFilters): Promise<ReporteRow[]> {
  if (env.useMocks) return getReporteAtenciones(filters);
  const query = toQuery(filters);
  return rowsFromUnknown(await apiClient<unknown>(`/api/reportes/usuarias${query ? `?${query}` : ''}`));
}

export async function getReporteSeguimientos(filters: ReporteFilters): Promise<ReporteRow[]> {
  if (env.useMocks) return getReporteAtenciones(filters);
  const query = toQuery(filters);
  return rowsFromUnknown(await apiClient<unknown>(`/api/reportes/seguimientos${query ? `?${query}` : ''}`));
}

export async function getReporteAtenciones(filters: ReporteFilters): Promise<ReporteRow[]> {
  await delay();
  return [
    { concepto: env.useMocks ? filters.tipoViolencia || 'Psicológica' : 'Atenciones', total: env.useMocks ? 8 : 0, periodo: 'Periodo filtrado' },
>>>>>>> 9ec0819 (Conectar frontend con procesos backend reales)
    { concepto: filters.modalidad || 'Familiar', total: env.useMocks ? 5 : 0, periodo: 'Periodo filtrado' },
  ];
}
