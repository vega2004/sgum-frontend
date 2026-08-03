import { Navigate, Route, Routes } from 'react-router-dom';
import { AuditoriaPage } from '../features/administracion/AuditoriaPage';
import { UsuariosPage } from '../features/administracion/UsuariosPage';
import { AtencionFormPage } from '../features/atenciones/AtencionFormPage';
import { AtencionesListPage } from '../features/atenciones/AtencionesListPage';
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

function NoAutorizado() { return <section className="page"><PageHeader title="Acceso no autorizado" description="No tienes permiso para consultar esta sección." action={<Button type="button" onClick={() => { window.location.href = routes.dashboard; }}>Volver al panel principal</Button>} /></section>; }
function NotFound() { return <section className="page"><h1>Página no encontrada</h1><p>La ruta solicitada no existe.</p></section>; }

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={routes.dashboard} replace />} />
      <Route path={routes.login} element={<LoginPage />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path={routes.dashboard} element={<DashboardPage />} />
        <Route path={routes.expedientes} element={<RoleRoute permissions={['Usuarias.Leer']}><ExpedientesListPage /></RoleRoute>} />
        <Route path={routes.expedienteNuevo} element={<RoleRoute permissions={['Usuarias.Crear']}><ExpedienteFormPage /></RoleRoute>} />
        <Route path="/expedientes/:id" element={<RoleRoute permissions={['Usuarias.Leer']}><ExpedienteDetailPage /></RoleRoute>} />
        <Route path="/expedientes/:id/editar" element={<RoleRoute permissions={['Usuarias.Editar']}><ExpedienteFormPage /></RoleRoute>} />
        <Route path={routes.atenciones} element={<RoleRoute permissions={['Atenciones.Leer']}><AtencionesListPage /></RoleRoute>} />
        <Route path="/atenciones/:atencionId/editar" element={<RoleRoute permissions={['Atenciones.Editar']}><AtencionFormPage /></RoleRoute>} />
        <Route path="/expedientes/:id/atenciones/nueva" element={<RoleRoute permissions={['Atenciones.Crear']}><AtencionFormPage /></RoleRoute>} />
        <Route path="/expedientes/:id/seguimiento" element={<RoleRoute permissions={['Seguimientos.Crear']}><SeguimientoFormPage /></RoleRoute>} />
        <Route path="/seguimientos/:seguimientoId/editar" element={<RoleRoute permissions={['Seguimientos.Editar']}><SeguimientoFormPage /></RoleRoute>} />
        <Route path={routes.seguimientos} element={<RoleRoute permissions={['Seguimientos.Leer']}><SeguimientosPage /></RoleRoute>} />
        <Route path={routes.reportes} element={<RoleRoute permissions={['Reportes.Leer']}><ReportesPage /></RoleRoute>} />
        <Route path={routes.usuarios} element={<RoleRoute permissions={['Usuarios.Administrar']}><UsuariosPage /></RoleRoute>} />
        <Route path={routes.auditoria} element={<RoleRoute permissions={['Auditoria.Leer']}><AuditoriaPage /></RoleRoute>} />
        <Route path={routes.noAutorizado} element={<NoAutorizado />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
