import { useEffect, useState } from 'react';
import { Button, DataTable, EmptyState, ErrorState, LoadingState } from '../../shared/components/Ui';
import { TextField } from '../../shared/components/FormControls';
import { normalizeApiError } from '../../shared/lib/apiErrors';
import { useNotification } from '../../shared/hooks/useNotification';
import { listAudit, type AuditFilters, type AuditRow } from './administracion.service';

export function AuditoriaPage() {
  const { showError } = useNotification();
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [filters, setFilters] = useState<AuditFilters>({ pageNumber: 1, pageSize: 100 });
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  async function load() {
    try {
      setStatus('loading');
      setRows(await listAudit(filters));
      setStatus('success');
    } catch (error) {
      const friendly = normalizeApiError(error);
      showError({ title: 'No fue posible consultar la auditoría.', description: friendly.description });
      setStatus('error');
    }
  }

  useEffect(() => { void load(); }, []);

  return (
    <section className="page">
      <div className="page-header"><h1>Auditoría</h1><p>Consulta de acciones sin mostrar contenido completo de datos modificados.</p></div>
      <form className="filters" onSubmit={(event) => { event.preventDefault(); void load(); }}>
        <TextField label="Usuario" value={filters.usuario ?? ''} onChange={(e) => setFilters({ ...filters, usuario: e.target.value })} />
        <TextField label="Acción" value={filters.accion ?? ''} onChange={(e) => setFilters({ ...filters, accion: e.target.value })} />
        <TextField label="Entidad" value={filters.entidad ?? ''} onChange={(e) => setFilters({ ...filters, entidad: e.target.value })} />
        <TextField label="Entidad ID" value={filters.entidadId ?? ''} onChange={(e) => setFilters({ ...filters, entidadId: e.target.value })} />
        <TextField label="Fecha inicial" type="date" value={filters.fechaInicial ?? ''} onChange={(e) => setFilters({ ...filters, fechaInicial: e.target.value })} />
        <TextField label="Fecha final" type="date" value={filters.fechaFinal ?? ''} onChange={(e) => setFilters({ ...filters, fechaFinal: e.target.value })} />
        <Button type="submit">Buscar</Button>
      </form>
      {status === 'loading' ? <LoadingState /> : null}
      {status === 'error' ? <ErrorState message="No fue posible consultar la auditoría." onRetry={() => void load()} /> : null}
      {status === 'success' && rows.length === 0 ? <EmptyState message="No hay movimientos de auditoría con los filtros seleccionados." /> : null}
      {status === 'success' && rows.length > 0 ? <DataTable caption="Auditoría" rows={rows} getKey={(row) => row.id} columns={[{ header: 'Usuario', render: (row) => row.usuario }, { header: 'Acción', render: (row) => row.accion }, { header: 'Entidad', render: (row) => row.entidad }, { header: 'Entidad ID', render: (row) => row.entidadId }, { header: 'Descripción', render: (row) => row.descripcion }, { header: 'Fecha', render: (row) => row.fecha }, { header: 'IP', render: (row) => row.ip }, { header: 'User agent', render: (row) => row.userAgent }]} /> : null}
    </section>
  );
}
