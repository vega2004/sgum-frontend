import { useState } from 'react';
import { Button, DataTable, EmptyState, ErrorState, LoadingState } from '../../shared/components/Ui';
import { SelectField, TextField } from '../../shared/components/FormControls';
import { normalizeApiError } from '../../shared/lib/apiErrors';
import { useNotification } from '../../shared/hooks/useNotification';
import { modalidadesViolencia, tiposViolencia } from '../expedientes/expediente.catalogs';
import { getReporteResumen, getReporteSeguimientos, getReporteUsuarias, type ReporteFilters, type ReporteRow } from './reporte.service';

type ReporteTipo = 'resumen' | 'usuarias' | 'seguimientos';

export function ReportesPage() {
  const { showInfo, showError } = useNotification();
  const [tipo, setTipo] = useState<ReporteTipo>('resumen');
  const [filters, setFilters] = useState<ReporteFilters>({});
  const [rows, setRows] = useState<ReporteRow[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    try {
      setStatus('loading');
      const service = tipo === 'usuarias' ? getReporteUsuarias : tipo === 'seguimientos' ? getReporteSeguimientos : getReporteResumen;
      setRows(await service(filters));
      setStatus('success');
    } catch (error) {
      const friendly = normalizeApiError(error);
      showError({ title: 'No fue posible generar la consulta del reporte.', description: friendly.description });
      setStatus('error');
    }
  }

  return (
    <section className="page">
      <div className="page-header"><h1>Reportes</h1><p>Resultados agregados para consulta institucional.</p></div>
      <p className="mock-note">Exportación PDF/Excel pendiente de integración. No se llaman endpoints inexistentes.</p>
      <form className="filters" onSubmit={submit}>
        <SelectField label="Reporte" value={tipo} onChange={(e) => setTipo(e.target.value as ReporteTipo)}><option value="resumen">Resumen</option><option value="usuarias">Usuarias</option><option value="seguimientos">Seguimientos</option></SelectField>
        <TextField label="Fecha inicial" type="date" value={filters.fechaInicial ?? ''} onChange={(e) => setFilters({ ...filters, fechaInicial: e.target.value })} />
        <TextField label="Fecha final" type="date" value={filters.fechaFinal ?? ''} onChange={(e) => setFilters({ ...filters, fechaFinal: e.target.value })} />
        <SelectField label="Tipo de violencia" value={filters.tipoViolencia ?? ''} onChange={(e) => setFilters({ ...filters, tipoViolencia: e.target.value })}><option value="">Todos</option>{tiposViolencia.map((item) => <option key={item}>{item}</option>)}</SelectField>
        <SelectField label="Modalidad" value={filters.modalidad ?? ''} onChange={(e) => setFilters({ ...filters, modalidad: e.target.value })}><option value="">Todas</option>{modalidadesViolencia.map((item) => <option key={item}>{item}</option>)}</SelectField>
        <TextField label="Estado de seguimiento" value={filters.estadoSeguimiento ?? ''} onChange={(e) => setFilters({ ...filters, estadoSeguimiento: e.target.value })} />
        <TextField label="Tipo de atención" value={filters.tipoAtencion ?? ''} onChange={(e) => setFilters({ ...filters, tipoAtencion: e.target.value })} />
        <Button type="submit">Buscar</Button>
        <Button type="button" variant="secondary" onClick={() => showInfo({ title: 'La exportación PDF/Excel está pendiente de integración.', description: 'Puedes consultar la información en pantalla.' })}>Exportar PDF</Button>
        <Button type="button" variant="secondary" onClick={() => showInfo({ title: 'La exportación PDF/Excel está pendiente de integración.', description: 'Puedes consultar la información en pantalla.' })}>Exportar Excel</Button>
      </form>
      {status === 'loading' ? <LoadingState /> : null}
      {status === 'error' ? <ErrorState message="No fue posible generar la consulta del reporte." /> : null}
      {status === 'success' && !rows.length ? <EmptyState message="No hay información para los filtros seleccionados." /> : null}
      {status === 'success' && rows.length ? <DataTable caption="Reporte" rows={rows} getKey={(row) => `${row.concepto}-${row.periodo}`} columns={[{ header: 'Concepto', render: (row) => row.concepto }, { header: 'Total', render: (row) => row.total }, { header: 'Periodo', render: (row) => row.periodo }]} /> : null}
    </section>
  );
}
