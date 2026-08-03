import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, DataTable, EmptyState, ErrorState, LoadingState, PageHeader } from '../../shared/components/Ui';
import { TextField } from '../../shared/components/FormControls';
import { canDelete, canEdit, canViewModule } from '../../shared/config/permissions';
import { normalizeApiError } from '../../shared/lib/apiErrors';
import { formatDate } from '../../shared/lib/formatters';
import { useNotification } from '../../shared/hooks/useNotification';
import { useAuth } from '../auth/AuthProvider';
import { deleteAtencion, listAtenciones } from './atencion.service';
import type { AtencionFilters, AtencionItem } from './atencion.types';

export function AtencionesListPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [rows, setRows] = useState<AtencionItem[]>([]);
  const [filters, setFilters] = useState<AtencionFilters>({ pageNumber: 1, pageSize: 100 });
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  async function load() {
    try {
      setStatus('loading');
      setRows(await listAtenciones({ ...filters, pageNumber: 1, pageSize: 100 }));
      setStatus('success');
    } catch (error) {
      const friendly = normalizeApiError(error);
      showError({ title: 'No fue posible consultar atenciones.', description: friendly.description });
      setStatus('error');
    }
  }

  useEffect(() => { void load(); }, []);

  async function deleteRow(row: AtencionItem) {
    if (!window.confirm('La atención será dada de baja. ¿Continuar?')) return;
    try {
      await deleteAtencion(row.id);
      showSuccess({ title: 'Atención dada de baja correctamente.' });
      await load();
    } catch (error) {
      const friendly = normalizeApiError(error);
      showError({ title: 'No fue posible dar de baja la atención.', description: friendly.description });
    }
  }

  return (
    <section className="page">
      <PageHeader title="Atenciones" description="Consulta de atenciones registradas por expediente." />
      <section className="content-card filters-card">
        <div className="card-heading"><div><h2>Filtros de atención</h2><p>Refine la consulta con criterios básicos.</p></div></div>
        <form className="filters" onSubmit={(event) => { event.preventDefault(); void load(); }}>
          <TextField label="Usuaria ID" value={filters.usuariaId ?? ''} onChange={(e) => setFilters({ ...filters, usuariaId: e.target.value })} />
          <TextField label="Fecha inicial" type="date" value={filters.fechaInicial ?? ''} onChange={(e) => setFilters({ ...filters, fechaInicial: e.target.value })} />
          <TextField label="Fecha final" type="date" value={filters.fechaFinal ?? ''} onChange={(e) => setFilters({ ...filters, fechaFinal: e.target.value })} />
          <TextField label="Tipo de atención" value={filters.tipoAtencion ?? ''} onChange={(e) => setFilters({ ...filters, tipoAtencion: e.target.value })} />
          <TextField label="Responsable" value={filters.responsable ?? ''} onChange={(e) => setFilters({ ...filters, responsable: e.target.value })} />
          <Button type="submit">Buscar</Button>
        </form>
      </section>
      {status === 'loading' ? <LoadingState /> : null}
      {status === 'error' ? <ErrorState message="No fue posible consultar atenciones." onRetry={() => void load()} /> : null}
      {status === 'success' && rows.length === 0 ? <EmptyState message="No hay atenciones con los filtros seleccionados." /> : null}
      {status === 'success' && rows.length > 0 ? <section className="content-card"><DataTable caption="Atenciones" rows={rows} getKey={(row) => row.id} columns={[
        { header: 'Fecha', render: (row) => formatDate(row.fechaAtencion) },
        { header: 'Tipo', render: (row) => row.tipoAtencion },
        { header: 'Área', render: (row) => row.areaAtencion },
        { header: 'Responsable', render: (row) => row.responsable },
        { header: 'Resultado', render: (row) => row.resultado },
        { header: 'Acciones', render: (row) => <div className="table-actions">{canViewModule(user, 'expedientes') ? <Link className="button button-outline button-small" to={`/expedientes/${row.usuariaId}`}>Ver expediente</Link> : null}{canEdit(user, 'atenciones') ? <Link className="button button-outline button-small" to={`/atenciones/${row.id}/editar`}>Editar</Link> : null}{canDelete(user, 'atenciones') ? <Button type="button" variant="danger" onClick={() => void deleteRow(row)}>Baja</Button> : null}</div> },
      ]} /></section> : null}
    </section>
  );
}
