import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button, DataTable, EmptyState, ErrorState, LoadingState, PageHeader, StatusBadge } from '../../shared/components/Ui';
import { TextField, SelectField } from '../../shared/components/FormControls';
import { hasPermission } from '../../shared/config/roles';
import { routes } from '../../shared/config/routes';
import { formatDate, maskCurp, protectName } from '../../shared/lib/formatters';
import { useAuth } from '../auth/AuthProvider';
import { estadosCaso } from './expediente.catalogs';
import { searchExpedientes } from './expediente.service';
import type { ExpedienteFilters, ExpedienteListItem } from './expediente.types';

export function ExpedientesListPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<ExpedienteFilters>({});
  const [rows, setRows] = useState<ExpedienteListItem[]>([]);
  const [status, setStatus] = useState<'initial' | 'loading' | 'success' | 'error'>('initial');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const load = useCallback(async (nextFilters: ExpedienteFilters = {}) => {
    setStatus('loading');
    try { setRows(await searchExpedientes(nextFilters)); setStatus('success'); } catch { setStatus('error'); }
  }, []);

  useEffect(() => { setStatus('initial'); }, []);

  function update(name: keyof ExpedienteFilters, value: string) { setFilters((current) => ({ ...current, [name]: value })); }
  function clearFilters() { setFilters({}); setRows([]); setStatus('initial'); }
  const activeFilters = Object.values(filters).filter(Boolean).length;

  return (
    <section className="page">
      <PageHeader title="Expedientes" description="Busque expedientes mediante los datos autorizados." action={hasPermission(user?.role, 'expedientes:write', user?.permisos) ? <Link className="button button-primary" to={routes.expedienteNuevo}>Registrar nueva usuaria</Link> : null} />
      <section className="content-card filters-card">
        <div className="card-heading"><div><h2>Criterios de búsqueda</h2><p>Complete uno o más campos para localizar un expediente.</p></div><Button type="button" variant="outline" className="filters-toggle" onClick={() => setFiltersOpen((current) => !current)}>{filtersOpen ? 'Ocultar filtros' : 'Mostrar filtros'}</Button></div>
        <form className={`filters ${filtersOpen ? 'filters-open' : ''}`} onSubmit={(event) => { event.preventDefault(); void load(filters); }}>
          <div className="field-with-icon"><Search aria-hidden="true" /><TextField label="Búsqueda general" value={filters.busqueda ?? ''} onChange={(e) => update('busqueda', e.target.value)} /></div>
          <TextField label="Nombre" value={filters.nombre ?? ''} onChange={(e) => update('nombre', e.target.value)} />
          <TextField label="CURP" value={filters.curp ?? ''} onChange={(e) => update('curp', e.target.value.toUpperCase())} />
          <TextField label="Folio BANAVIM" value={filters.folioBanavim ?? ''} onChange={(e) => update('folioBanavim', e.target.value)} />
          <TextField label="Número de expediente" value={filters.numeroExpediente ?? ''} onChange={(e) => update('numeroExpediente', e.target.value)} />
          <TextField label="Fecha de atención" type="date" value={filters.fechaAtencion ?? ''} onChange={(e) => update('fechaAtencion', e.target.value)} />
          <SelectField label="Estado" value={filters.estado ?? ''} onChange={(e) => update('estado', e.target.value)}><option value="">Todos</option>{estadosCaso.map((item) => <option key={item}>{item}</option>)}</SelectField>
          <div className="filter-actions"><Button type="submit">Buscar</Button><Button type="button" variant="outline" onClick={clearFilters}>Limpiar filtros</Button></div>
        </form>
      </section>
      {status === 'initial' ? <EmptyState message="Utilice los criterios de búsqueda para localizar un expediente." /> : null}
      {status === 'loading' ? <LoadingState /> : null}
      {status === 'error' ? <ErrorState message="No fue posible consultar expedientes." onRetry={() => void load(filters)} /> : null}
      {status === 'success' && rows.length === 0 ? <div><EmptyState message="No se encontraron expedientes con los criterios ingresados." /><Button type="button" variant="outline" onClick={clearFilters}>Limpiar búsqueda</Button></div> : null}
      {status === 'success' && rows.length > 0 ? <section className="content-card results-card"><div className="card-heading"><div><h2>Resultados</h2><p>{rows.length} coincidencia{rows.length === 1 ? '' : 's'} encontradas. Filtros activos: {activeFilters}.</p></div><Button type="button" variant="outline" onClick={clearFilters}>Limpiar búsqueda</Button></div><DataTable caption="Resultados de expedientes" rows={rows} getKey={(row) => row.id} columns={[
        { header: 'Expediente', render: (row) => row.numeroExpediente },
        { header: 'Nombre protegido', render: (row) => protectName(row.nombreCompleto) },
        { header: 'CURP', render: (row) => maskCurp(row.curp) },
        { header: 'Última atención', render: (row) => formatDate(row.ultimaAtencion) },
        { header: 'Estado', render: (row) => <StatusBadge>{row.estado}</StatusBadge> },
        { header: 'Acciones', render: (row) => <Link className="button button-outline button-small" to={`/expedientes/${row.id}`}>Ver expediente</Link> },
      ]} /></section> : null}
    </section>
  );
}
