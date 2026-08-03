import { env } from '../../shared/config/env';
import { apiClient } from '../../shared/lib/apiClient';

export type DashboardSummary = {
  expedientesActivos: number;
  seguimientosPendientes: number;
  seguimientosProximos: number;
  casosDerivados: number;
  atencionesPeriodo: number;
};

type BackendResumen = Partial<{
  totalUsuariasActivas: number;
  seguimientosProximos: number;
  seguimientosVencidos: number;
  seguimientosSinFecha: number;
  totalAtenciones: number;
  casosDerivados: number;
}>;

export async function getDashboardSummary(): Promise<DashboardSummary> {
  if (env.useMocks) {
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    return { expedientesActivos: 18, seguimientosPendientes: 6, seguimientosProximos: 4, casosDerivados: 3, atencionesPeriodo: 11 };
  }
  const data = await apiClient<BackendResumen>('/api/reportes/resumen');
  const proximos = data.seguimientosProximos ?? 0;
  const vencidos = data.seguimientosVencidos ?? 0;
  const sinFecha = data.seguimientosSinFecha ?? 0;
  return {
    expedientesActivos: data.totalUsuariasActivas ?? 0,
    seguimientosPendientes: proximos + vencidos + sinFecha,
    seguimientosProximos: proximos,
    casosDerivados: data.casosDerivados ?? 0,
    atencionesPeriodo: data.totalAtenciones ?? 0,
  };
}
