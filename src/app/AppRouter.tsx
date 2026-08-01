import { Navigate, Route, Routes } from 'react-router-dom';
import { AuditoriaPage } from '../features/administracion/AuditoriaPage';
import { UsuariosPage } from '../features/administracion/UsuariosPage';
import { AtencionFormPage } from '../features/atenciones/AtencionFormPage';
import { LoginPage } from '../features/auth/LoginPage';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';
import { RoleRoute } from '../features/auth/RoleRoute';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { ExpedienteDetailPage } from '../features/expedientes/ExpedienteDetailPage';
import { ExpedienteFormPage } from '../features/expedientes/ExpedienteFormPage';
import { ExpedientesListPage } from '../features/expedientes/ExpedientesListPage';
import { ReportesPage } from '../features/reportes/ReportesPage';
import { SeguimientoFormPage } from '../features/seguimientos/SeguimientoFormPage';
import { SeguimientosPage } from '../features/seguimientos/SeguimientosPage';
import { routes } from '../shared/config/routes';
import { Button, PageHeader } from '../shared/components/Ui';
import { AppLayout } from '../shared/layout/AppLayout';

function NoAutorizado() { return <section className="page"><PageHeader title="Acceso no autorizado" description="No cuenta con permisos para consultar esta sección." action={<Button type="button" onClick={() => { window.location.href = routes.dashboard; }}>Volver al panel principal</Button>} /></section>; }
function NotFound() { return <section className="page"><h1>Página no encontrada</h1><p>La ruta solicitada no existe.</p></section>; }

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={routes.dashboard} replace />} />
      <Route path={routes.login} element={<LoginPage />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path={routes.dashboard} element={<RoleRoute permissions={['dashboard:view']}><DashboardPage /></RoleRoute>} />
        <Route path={routes.expedientes} element={<RoleRoute permissions={['expedientes:read']}><ExpedientesListPage /></RoleRoute>} />
        <Route path={routes.expedienteNuevo} element={<RoleRoute permissions={['expedientes:write']}><ExpedienteFormPage /></RoleRoute>} />
        <Route path="/expedientes/:id" element={<RoleRoute permissions={['expedientes:read']}><ExpedienteDetailPage /></RoleRoute>} />
        <Route path="/expedientes/:id/editar" element={<RoleRoute permissions={['expedientes:write']}><ExpedienteFormPage /></RoleRoute>} />
        <Route path="/expedientes/:id/atenciones/nueva" element={<RoleRoute permissions={['atenciones:write']}><AtencionFormPage /></RoleRoute>} />
        <Route path="/expedientes/:id/seguimiento" element={<RoleRoute permissions={['seguimientos:write']}><SeguimientoFormPage /></RoleRoute>} />
        <Route path={routes.seguimientos} element={<RoleRoute permissions={['seguimientos:read']}><SeguimientosPage /></RoleRoute>} />
        <Route path={routes.reportes} element={<RoleRoute permissions={['reportes:read']}><ReportesPage /></RoleRoute>} />
        <Route path={routes.usuarios} element={<RoleRoute permissions={['usuarios:admin']}><UsuariosPage /></RoleRoute>} />
        <Route path={routes.auditoria} element={<RoleRoute permissions={['auditoria:read']}><AuditoriaPage /></RoleRoute>} />
        <Route path={routes.noAutorizado} element={<NoAutorizado />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
