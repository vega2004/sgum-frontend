import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, DataTable, ErrorState, LoadingState, StatusBadge } from '../../shared/components/Ui';
import { canCreate, canDelete, canEdit, hasPermission } from '../../shared/config/permissions';
import { routes } from '../../shared/config/routes';
import { normalizeApiError } from '../../shared/lib/apiErrors';
import { formatDate, maskCurp, maskPhone } from '../../shared/lib/formatters';
import { useNotification } from '../../shared/hooks/useNotification';
import { useAuth } from '../auth/AuthProvider';
import { deleteAtencion, listAtenciones } from '../atenciones/atencion.service';
import type { AtencionItem } from '../atenciones/atencion.types';
import { deleteExpediente, getExpediente } from './expediente.service';
import type { Expediente } from './expediente.types';

export function ExpedienteDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [data, setData] = useState<Expediente | null>(null);
  const [atenciones, setAtenciones] = useState<AtencionItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const load = useCallback(async () => { try { setStatus('loading'); const [expediente, expedienteAtenciones] = await Promise.all([getExpediente(id), listAtenciones({ usuariaId: id, pageNumber: 1, pageSize: 100 })]); setData(expediente); setAtenciones(expedienteAtenciones); setStatus('success'); } catch (error) { const friendly = normalizeApiError(error); showError({ title: 'No fue posible cargar el expediente.', description: friendly.description }); setStatus('error'); } }, [id, showError]);
  useEffect(() => { void load(); }, [load]);
  async function deleteCurrentExpediente() {
    if (!data || !window.confirm('El expediente será dado de baja. ¿Continuar?')) return;
    try {
      await deleteExpediente(data.id);
      showSuccess({ title: 'Expediente dado de baja correctamente.' });
      navigate(routes.expedientes);
    } catch (error) {
      const friendly = normalizeApiError(error);
      showError({ title: 'No fue posible dar de baja el expediente.', description: friendly.description });
    }
  }
  async function deleteAtencionRow(row: AtencionItem) {
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
  if (status === 'loading') return <LoadingState />;
  if (status === 'error' || !data) return <ErrorState message="No fue posible cargar el expediente." onRetry={() => void load()} />;
  const d = data.detalle;
  return (
    <section className="page">
      <div className="page-header"><div><h1>Expediente {data.numeroExpediente}</h1><p>Consulta autorizada por secciones.</p></div><StatusBadge>{data.estado}</StatusBadge></div>
      <div className="quick-actions">{canEdit(user, 'expedientes') ? <Link className="button button-outline" to={`/expedientes/${data.id}/editar`}>Editar expediente</Link> : null}{canDelete(user, 'expedientes') ? <Button type="button" variant="danger" onClick={() => void deleteCurrentExpediente()}>Dar de baja expediente</Button> : null}{canCreate(user, 'atenciones') ? <Link className="button" to={`/expedientes/${data.id}/atenciones/nueva`}>Registrar atención</Link> : null}{canCreate(user, 'seguimientos') ? <Link className="button button-secondary" to={`/expedientes/${data.id}/seguimiento`}>Registrar seguimiento</Link> : null}</div>
      <div className="tabs-panel">
        <section><h2>Resumen</h2><p>Última atención: {formatDate(data.ultimaAtencion)}</p><p>Folio BANAVIM: {data.folioBanavim ?? 'No registrado'}</p></section>
        <section><h2>Datos personales</h2><p>Nombre: {data.nombreCompleto}</p><p>CURP: {maskCurp(data.curp)}</p><p>Teléfono: {maskPhone(data.telefono)}</p></section>
        <section><h2>Domicilio y familia</h2><p>{d.municipio}, {d.estado}. Domicilio completo visible solo al personal autorizado en expediente.</p><p>Integrantes registrados: {d.familiares.length}</p></section>
        <section><h2>Perfil y salud</h2><p>Escolaridad: {d.escolaridad || 'No registrada'}</p><p>Servicio médico: {d.servicioMedico || 'No registrado'}</p></section>
        <section><h2>Historial cronológico</h2><ol className="timeline">{data.historial.map((item) => <li key={`${item.fecha}-${item.evento}`}><strong>{formatDate(item.fecha)}</strong> {item.evento} <span>{item.responsable}</span></li>)}</ol></section>
        <section><h2>Atenciones</h2>{atenciones.length ? <DataTable caption="Atenciones del expediente" rows={atenciones} getKey={(row) => row.id} columns={[{ header: 'Fecha', render: (row) => formatDate(row.fechaAtencion) }, { header: 'Tipo', render: (row) => row.tipoAtencion }, { header: 'Área', render: (row) => row.areaAtencion }, { header: 'Responsable', render: (row) => row.responsable }, { header: 'Resultado', render: (row) => row.resultado }, { header: 'Acciones', render: (row) => <div className="table-actions">{canEdit(user, 'atenciones') ? <Link className="button button-outline button-small" to={`/atenciones/${row.id}/editar`}>Editar</Link> : null}{canDelete(user, 'atenciones') ? <Button type="button" variant="danger" onClick={() => void deleteAtencionRow(row)}>Baja</Button> : null}</div> }]} /> : <p>No hay atenciones registradas.</p>}</section>
        {hasPermission(user, 'Narracion.Leer') ? <section><h2>Narración autorizada</h2><p className="sensitive-box">{d.narracion}</p></section> : <section><h2>Narración</h2><p>Sección restringida por perfil.</p></section>}
      </div>
    </section>
  );
}
