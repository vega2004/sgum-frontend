import { env } from '../../shared/config/env';

export type ReporteFilters = { fechaInicial?: string; fechaFinal?: string; tipoViolencia?: string; modalidad?: string; estadoSeguimiento?: string; tipoAtencion?: string };
export type ReporteRow = { concepto: string; total: number; periodo: string };

export async function getReporteAtenciones(filters: ReporteFilters): Promise<ReporteRow[]> {
  await new Promise((resolve) => window.setTimeout(resolve, 450));
  return [
    { concepto: env.useMocks ? filters.tipoViolencia || 'Psicológica' : 'Módulo pendiente de integración backend', total: env.useMocks ? 8 : 0, periodo: 'Periodo filtrado' },
    { concepto: filters.modalidad || 'Familiar', total: env.useMocks ? 5 : 0, periodo: 'Periodo filtrado' },
  ];
}
