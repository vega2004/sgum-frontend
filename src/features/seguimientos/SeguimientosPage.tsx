import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import { DataTable, EmptyState, ErrorState, LoadingState, PageHeader, StatusBadge, Tabs } from '../../shared/components/Ui';
import { SelectField, TextField } from '../../shared/components/FormControls';
import { listSeguimientos } from './seguimiento.service';
=======
import { Button, DataTable, EmptyState, ErrorState, LoadingState, PageHeader, StatusBadge, Tabs } from '../../shared/components/Ui';
import { SelectField, TextField } from '../../shared/components/FormControls';
import { closeSeguimiento, deleteSeguimiento, listSeguimientos, type SeguimientoFilters } from './seguimiento.service';
>>>>>>> 9ec0819 (Conectar frontend con procesos backend reales)
import type { SeguimientoItem } from './seguimiento.types';

type TabValue = 'Próximo' | 'Vencido' | 'Sin fecha' | 'Cerrado' | 'Todos';

function badgeTone(periodo: string) {
  if (periodo === 'Próximo') return 'info' as const;
  if (periodo === 'Vencido') return 'error' as const;
  if (periodo === 'Cerrado') return 'success' as const;
  return 'neutral' as const;
}

export function SeguimientosPage() {
  const [rows, setRows] = useState<SeguimientoItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [tab, setTab] = useState<TabValue>('Próximo');
  const [filters, setFilters] = useState({ estado: '', fechaInicial: '', fechaFinal: '', responsable: '', expediente: '' });
<<<<<<< HEAD
  async function load() { try { setStatus('loading'); setRows(await listSeguimientos()); setStatus('success'); } catch { setStatus('error'); } }
  useEffect(() => { void load(); }, []);
  const tabs: Array<{ value: TabValue; label: string; count: number }> = ['Próximo', 'Vencido', 'Sin fecha', 'Cerrado', 'Todos'].map((value) => ({ value: value as TabValue, label: value === 'Próximo' ? 'Próximos' : value === 'Todos' ? 'Todos' : value, count: value === 'Todos' ? rows.length : rows.filter((row) => row.vencimiento === value).length }));
  const visible = rows.filter((row) => {
    const byTab = tab === 'Todos' || row.vencimiento === tab;
    const byEstado = !filters.estado || row.estado === filters.estado;
    const byResponsable = !filters.responsable || row.responsable.toLowerCase().includes(filters.responsable.toLowerCase());
    const byExpediente = !filters.expediente || row.numeroExpediente.toLowerCase().includes(filters.expediente.toLowerCase());
    const byDateStart = !filters.fechaInicial || (row.fechaProximaRevision ?? '') >= filters.fechaInicial;
    const byDateEnd = !filters.fechaFinal || (row.fechaProximaRevision ?? '') <= filters.fechaFinal;
    return byTab && byEstado && byResponsable && byExpediente && byDateStart && byDateEnd;
  });
  return <section className="page"><PageHeader title="Seguimientos" description="Consulte las acciones de seguimiento programadas y los casos que requieren atención." /><Tabs tabs={tabs} value={tab} onChange={setTab} /><section className="content-card filters-card"><div className="card-heading"><div><h2>Filtros de seguimiento</h2><p>Refine la consulta sin mostrar información sensible innecesaria.</p></div></div><div className="filters"><SelectField label="Estado del caso" value={filters.estado} onChange={(e) => setFilters({ ...filters, estado: e.target.value })}><option value="">Todos</option><option>Activo</option><option>En seguimiento</option><option>Derivado</option><option>Cerrado</option></SelectField><TextField label="Fecha inicial" type="date" value={filters.fechaInicial} onChange={(e) => setFilters({ ...filters, fechaInicial: e.target.value })} /><TextField label="Fecha final" type="date" value={filters.fechaFinal} onChange={(e) => setFilters({ ...filters, fechaFinal: e.target.value })} /><TextField label="Responsable" value={filters.responsable} onChange={(e) => setFilters({ ...filters, responsable: e.target.value })} /><TextField label="Número de expediente" value={filters.expediente} onChange={(e) => setFilters({ ...filters, expediente: e.target.value })} /></div></section>{status === 'loading' ? <LoadingState /> : null}{status === 'error' ? <ErrorState message="No fue posible cargar seguimientos." onRetry={() => void load()} /> : null}{status === 'success' && visible.length === 0 ? <EmptyState message="No hay seguimientos para el filtro seleccionado." /> : null}{status === 'success' && visible.length ? <section className="content-card"><DataTable caption="Seguimientos" rows={visible} getKey={(row) => row.id} columns={[{ header: 'Expediente', render: (row) => row.numeroExpediente }, { header: 'Estado', render: (row) => <StatusBadge>{row.estado}</StatusBadge> }, { header: 'Periodo', render: (row) => <StatusBadge tone={badgeTone(row.vencimiento)}>{row.vencimiento}</StatusBadge> }, { header: 'Próxima acción', render: (row) => row.proximaAccion }, { header: 'Fecha programada', render: (row) => row.fechaProximaRevision || 'Sin fecha' }, { header: 'Responsable', render: (row) => row.responsable }, { header: 'Acción', render: (row) => <Link className="button button-outline button-small" to={`/expedientes/${row.expedienteId}`}>Ver seguimiento</Link> }]} /></section> : null}</section>;
=======

  async function load(nextFilters = filters) {
    const serviceFilters: SeguimientoFilters = {
      estado: nextFilters.estado || undefined,
      fechaInicial: nextFilters.fechaInicial || undefined,
      fechaFinal: nextFilters.fechaFinal || undefined,
      responsable: nextFilters.responsable || undefined,
      numeroExpediente: nextFilters.expediente || undefined,
      pageNumber: 1,
      pageSize: 100,
    };
    try {
      setStatus('loading');
      setRows(await listSeguimientos(serviceFilters));
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => { void load(); }, []);

  async function closeRow(row: SeguimientoItem) {
    await closeSeguimiento(row.id);
    await load();
  }

  async function deleteRow(row: SeguimientoItem) {
    if (!window.confirm('El seguimiento será dado de baja. ¿Continuar?')) return;
    await deleteSeguimiento(row.id);
    await load();
  }

  const tabs: Array<{ value: TabValue; label: string; count: number }> = ['Próximo', 'Vencido', 'Sin fecha', 'Cerrado', 'Todos'].map((value) => ({ value: value as TabValue, label: value === 'Próximo' ? 'Próximos' : value === 'Todos' ? 'Todos' : value, count: value === 'Todos' ? rows.length : rows.filter((row) => row.vencimiento === value).length }));
  const visible = rows.filter((row) => tab === 'Todos' || row.vencimiento === tab);

  return (
    <section className="page">
      <PageHeader title="Seguimientos" description="Consulte las acciones de seguimiento programadas y los casos que requieren atención." />
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      <section className="content-card filters-card">
        <div className="card-heading"><div><h2>Filtros de seguimiento</h2><p>Refine la consulta sin mostrar información sensible innecesaria.</p></div></div>
        <form className="filters" onSubmit={(event) => { event.preventDefault(); void load(); }}>
          <SelectField label="Estado del caso" value={filters.estado} onChange={(e) => setFilters({ ...filters, estado: e.target.value })}><option value="">Todos</option><option>Activo</option><option>En seguimiento</option><option>Derivado</option><option>Cerrado</option></SelectField>
          <TextField label="Fecha inicial" type="date" value={filters.fechaInicial} onChange={(e) => setFilters({ ...filters, fechaInicial: e.target.value })} />
          <TextField label="Fecha final" type="date" value={filters.fechaFinal} onChange={(e) => setFilters({ ...filters, fechaFinal: e.target.value })} />
          <TextField label="Responsable" value={filters.responsable} onChange={(e) => setFilters({ ...filters, responsable: e.target.value })} />
          <TextField label="Número de expediente" value={filters.expediente} onChange={(e) => setFilters({ ...filters, expediente: e.target.value })} />
          <Button type="submit">Buscar</Button>
        </form>
      </section>
      {status === 'loading' ? <LoadingState /> : null}
      {status === 'error' ? <ErrorState message="No fue posible cargar seguimientos." onRetry={() => void load()} /> : null}
      {status === 'success' && visible.length === 0 ? <EmptyState message="No hay seguimientos para el filtro seleccionado." /> : null}
      {status === 'success' && visible.length ? (
        <section className="content-card">
          <DataTable caption="Seguimientos" rows={visible} getKey={(row) => row.id} columns={[
            { header: 'Expediente', render: (row) => row.numeroExpediente || 'Sin expediente' },
            { header: 'Estado', render: (row) => <StatusBadge>{row.estado}</StatusBadge> },
            { header: 'Periodo', render: (row) => <StatusBadge tone={badgeTone(row.vencimiento)}>{row.vencimiento}</StatusBadge> },
            { header: 'Próxima revisión', render: (row) => row.fechaProximaRevision ?? 'Sin fecha' },
            { header: 'Responsable', render: (row) => row.responsable },
            { header: 'Acciones', render: (row) => <div className="table-actions"><Link className="button button-outline button-small" to={`/expedientes/${row.expedienteId}`}>Ver expediente</Link><Button type="button" variant="outline" onClick={() => void closeRow(row)} disabled={row.estado === 'Cerrado'}>Cerrar</Button><Button type="button" variant="danger" onClick={() => void deleteRow(row)}>Baja</Button></div> },
          ]} />
        </section>
      ) : null}
    </section>
  );
>>>>>>> 9ec0819 (Conectar frontend con procesos backend reales)
}
