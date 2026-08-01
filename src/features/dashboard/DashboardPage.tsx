import { Link } from 'react-router-dom';
import { CalendarClock, ClipboardCheck, ExternalLink, FileText, FolderOpen, Search, UserPlus } from 'lucide-react';
import { Alert, PageHeader, StatCard } from '../../shared/components/Ui';
import { env } from '../../shared/config/env';
import { hasPermission } from '../../shared/config/roles';
import { routes } from '../../shared/config/routes';
import { useAuth } from '../auth/AuthProvider';

export function DashboardPage() {
  const { user } = useAuth();
  const cards = [
    { label: 'Expedientes activos', value: '18', description: 'Casos que actualmente permanecen abiertos.', icon: <FolderOpen /> },
    { label: 'Seguimientos pendientes', value: '6', description: 'Actividades que requieren atención.', icon: <ClipboardCheck /> },
    { label: 'Seguimientos próximos', value: '4', description: 'Revisiones programadas en fechas cercanas.', icon: <CalendarClock /> },
    { label: 'Casos derivados', value: '3', description: 'Casos canalizados a otras instituciones.', icon: <ExternalLink /> },
    { label: 'Atenciones del periodo', value: '11', description: 'Atenciones registradas en el periodo actual.', icon: <FileText /> },
  ];
  return (
    <section className="page">
      <PageHeader title="Panel principal" description="Resumen general de la operación institucional." />
      {env.useMocks ? <Alert>Modo demostración activo. La información mostrada es ficticia.</Alert> : null}
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
          <article><strong>6</strong><span>Semana actual</span><p>Seguimientos pendientes</p><Link to={routes.seguimientos}>Consultar</Link></article>
          <article><strong>2</strong><span>Sin fecha</span><p>Casos pendientes de programación</p><Link to={routes.seguimientos}>Programar revisión</Link></article>
        </div>
      </section>
    </section>
  );
}
