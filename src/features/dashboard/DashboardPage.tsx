import { Link } from 'react-router-dom';
import { CalendarClock, ClipboardCheck, ExternalLink, FileText, FolderOpen, Search, UserPlus } from 'lucide-react';
<<<<<<< HEAD
import { Alert, PageHeader, StatCard } from '../../shared/components/Ui';
=======
import { useEffect, useState } from 'react';
import { Alert, ErrorState, LoadingState, PageHeader, StatCard } from '../../shared/components/Ui';
>>>>>>> 9ec0819 (Conectar frontend con procesos backend reales)
import { env } from '../../shared/config/env';
import { hasPermission } from '../../shared/config/roles';
import { routes } from '../../shared/config/routes';
import { useAuth } from '../auth/AuthProvider';
<<<<<<< HEAD

export function DashboardPage() {
  const { user } = useAuth();
  const cards = [
    { label: 'Expedientes activos', value: '18', description: 'Casos que actualmente permanecen abiertos.', icon: <FolderOpen /> },
    { label: 'Seguimientos pendientes', value: '6', description: 'Actividades que requieren atención.', icon: <ClipboardCheck /> },
    { label: 'Seguimientos próximos', value: '4', description: 'Revisiones programadas en fechas cercanas.', icon: <CalendarClock /> },
    { label: 'Casos derivados', value: '3', description: 'Casos canalizados a otras instituciones.', icon: <ExternalLink /> },
    { label: 'Atenciones del periodo', value: '11', description: 'Atenciones registradas en el periodo actual.', icon: <FileText /> },
=======
import { getDashboardSummary, type DashboardSummary } from './dashboard.service';

export function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  async function load() {
    try {
      setStatus('loading');
      setSummary(await getDashboardSummary());
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => { void load(); }, []);

  const cards = [
    { label: 'Expedientes activos', value: String(summary?.expedientesActivos ?? 0), description: 'Casos que actualmente permanecen abiertos.', icon: <FolderOpen /> },
    { label: 'Seguimientos pendientes', value: String(summary?.seguimientosPendientes ?? 0), description: 'Actividades que requieren atención.', icon: <ClipboardCheck /> },
    { label: 'Seguimientos próximos', value: String(summary?.seguimientosProximos ?? 0), description: 'Revisiones programadas en fechas cercanas.', icon: <CalendarClock /> },
    { label: 'Casos derivados', value: String(summary?.casosDerivados ?? 0), description: 'Casos canalizados a otras instituciones.', icon: <ExternalLink /> },
    { label: 'Atenciones del periodo', value: String(summary?.atencionesPeriodo ?? 0), description: 'Atenciones registradas en el periodo actual.', icon: <FileText /> },
>>>>>>> 9ec0819 (Conectar frontend con procesos backend reales)
  ];
  return (
    <section className="page">
      <PageHeader title="Panel principal" description="Resumen general de la operación institucional." />
      {env.useMocks ? <Alert>Modo demostración activo. La información mostrada es ficticia.</Alert> : null}
<<<<<<< HEAD
=======
      {status === 'loading' ? <LoadingState /> : null}
      {status === 'error' ? <ErrorState message="No fue posible cargar el resumen del panel." onRetry={() => void load()} /> : null}
      {status === 'success' && !summary ? <Alert tone="warning">No hay datos disponibles para el resumen.</Alert> : null}
>>>>>>> 9ec0819 (Conectar frontend con procesos backend reales)
      <div className="metric-grid">{cards.map((card) => <StatCard key={card.label} {...card} />)}</div>
      <section className="content-card">
        <h2>Acciones rápidas</h2>
        <div className="action-grid">
          {hasPermission(user?.role, 'expedientes:write', user?.permisos) ? <Link className="action-card" to={routes.expedienteNuevo}><UserPlus aria-hidden="true" /><strong>Registrar nueva usuaria</strong><span>Iniciar captura institucional por pasos.</span></Link> : null}
          {hasPermission(user?.role, 'expedientes:read', user?.permisos) ? <Link className="action-card" to={routes.expedientes}><Search aria-hidden="true" /><strong>Buscar expediente</strong><span>Localizar registros con datos autorizados.</span></Link> : null}
          {hasPermission(user?.role, 'seguimientos:read', user?.permisos) ? <Link className="action-card" to={routes.seguimientos}><CalendarClock aria-hidden="true" /><strong>Consultar seguimientos</strong><span>Revisar actividades próximas o pendientes.</span></Link> : null}
        </div>
      </section>
      <section className="content-card">
        <h2>Pendientes de atención</h2>
        <div className="pending-grid">
<<<<<<< HEAD
          <article><strong>6</strong><span>Semana actual</span><p>Seguimientos pendientes</p><Link to={routes.seguimientos}>Consultar</Link></article>
          <article><strong>2</strong><span>Sin fecha</span><p>Casos pendientes de programación</p><Link to={routes.seguimientos}>Programar revisión</Link></article>
=======
          <article><strong>{summary?.seguimientosPendientes ?? 0}</strong><span>Semana actual</span><p>Seguimientos pendientes</p><Link to={routes.seguimientos}>Consultar</Link></article>
          <article><strong>{summary ? Math.max(summary.seguimientosPendientes - summary.seguimientosProximos, 0) : 0}</strong><span>Sin fecha o vencidos</span><p>Casos pendientes de programación</p><Link to={routes.seguimientos}>Programar revisión</Link></article>
>>>>>>> 9ec0819 (Conectar frontend con procesos backend reales)
        </div>
      </section>
    </section>
  );
}
