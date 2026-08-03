import { useEffect, useState } from 'react';
import { Button, DataTable, ErrorState, LoadingState, StatusBadge } from '../../shared/components/Ui';
import { PasswordField, SelectField, TextField } from '../../shared/components/FormControls';
import { roleLabels, type Role } from '../../shared/config/roles';
import { normalizeApiError } from '../../shared/lib/apiErrors';
import { useNotification } from '../../shared/hooks/useNotification';
import { activateUser, changeUserPassword, deactivateUser, listRoles, listUsers, saveUser, unlockUser, type AdminRole, type AdminUser } from './administracion.service';

function roleName(role: string) {
  return roleLabels[role as Role] ?? role;
}

export function UsuariosPage() {
  const { showSuccess, showError } = useNotification();
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [form, setForm] = useState({ nombre: '', usuario: '', passwordTemporal: '', rolSistemaId: 1 });

  async function load() {
    try {
      setStatus('loading');
      const [nextRoles, nextUsers] = await Promise.all([listRoles(), listUsers()]);
      setRoles(nextRoles);
      setRows(nextUsers);
      setForm((current) => ({ ...current, rolSistemaId: nextRoles[0]?.id ?? current.rolSistemaId }));
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => { void load(); }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const saved = await saveUser(form);
      setRows((current) => [saved, ...current]);
      setForm({ nombre: '', usuario: '', passwordTemporal: '', rolSistemaId: roles[0]?.id ?? 1 });
      showSuccess({ title: 'Usuario registrado correctamente.' });
    } catch (error) {
      const friendly = normalizeApiError(error);
      showError({ title: 'No fue posible completar la operación del usuario.', description: friendly.description });
    }
  }

  async function updateRow(action: () => Promise<AdminUser>, successTitle: string) {
    try {
      const saved = await action();
      setRows((current) => current.map((item) => item.id === saved.id ? saved : item));
      showSuccess({ title: successTitle });
    } catch (error) {
      const friendly = normalizeApiError(error);
      showError({ title: 'No fue posible completar la operación del usuario.', description: friendly.description });
    }
  }

  async function changePassword(row: AdminUser) {
    const nuevaPassword = window.prompt(`Nueva contraseña temporal para ${row.usuario}`);
    if (!nuevaPassword) return;
    await updateRow(() => changeUserPassword(row.id, nuevaPassword), 'Contraseña actualizada correctamente.');
  }

  if (status === 'loading') return <LoadingState />;
  if (status === 'error') return <ErrorState message="No fue posible cargar usuarios." onRetry={() => void load()} />;

  return (
    <section className="page">
      <div className="page-header"><h1>Administración de usuarios</h1><p>No se muestran ni precargan contraseñas.</p></div>
      <form className="filters" onSubmit={submit}>
        <TextField label="Nombre completo" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
        <TextField label="Usuario" value={form.usuario} onChange={(e) => setForm({ ...form, usuario: e.target.value })} required />
        <PasswordField label="Contraseña temporal" value={form.passwordTemporal} onChange={(e) => setForm({ ...form, passwordTemporal: e.target.value })} autoComplete="new-password" required />
        <SelectField label="Rol" value={form.rolSistemaId} onChange={(e) => setForm({ ...form, rolSistemaId: Number(e.target.value) })}>{roles.map((role) => <option value={role.id} key={role.id}>{roleName(role.nombre)}</option>)}</SelectField>
        <Button type="submit">Guardar usuario</Button>
      </form>
      <DataTable caption="Usuarios" rows={rows} getKey={(row) => row.id} columns={[
        { header: 'Nombre', render: (row) => row.nombre },
        { header: 'Usuario', render: (row) => row.usuario },
        { header: 'Rol', render: (row) => roleName(String(row.rol)) },
        { header: 'Estado', render: (row) => <StatusBadge tone={row.activo ? 'success' : 'warning'}>{row.activo ? 'Activo' : 'Inactivo'}{row.bloqueado ? ' / Bloqueado' : ''}</StatusBadge> },
        { header: 'Acciones', render: (row) => <div className="table-actions"><Button type="button" variant="outline" onClick={() => void updateRow(() => row.activo ? deactivateUser(row.id) : activateUser(row.id), row.activo ? 'Usuario desactivado correctamente.' : 'Usuario activado correctamente.')}>{row.activo ? 'Desactivar' : 'Activar'}</Button><Button type="button" variant="outline" disabled={!row.bloqueado} onClick={() => void updateRow(() => unlockUser(row.id), 'Usuario desbloqueado correctamente.')}>Desbloquear</Button><Button type="button" variant="ghost" onClick={() => void changePassword(row)}>Cambiar contraseña</Button></div> },
      ]} />
    </section>
  );
}
