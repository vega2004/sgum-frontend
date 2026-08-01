import { useEffect, useState } from 'react';
import { Button, DataTable, StatusBadge } from '../../shared/components/Ui';
import { SelectField, TextField } from '../../shared/components/FormControls';
import { roleLabels, roles, type Role } from '../../shared/config/roles';
import { useToast } from '../../shared/components/ToastProvider';
import { listUsers, saveUser, type AdminUser } from './administracion.service';

export function UsuariosPage() {
  const { showToast } = useToast();
  const [rows, setRows] = useState<AdminUser[]>([]); const [form, setForm] = useState<Omit<AdminUser, 'id'>>({ nombre: '', usuario: '', rol: 'PersonalAtencion', activo: true });
  useEffect(() => { void listUsers().then(setRows); }, []);
  async function submit(event: React.FormEvent) { event.preventDefault(); try { const saved = await saveUser(form); setRows((current) => [saved, ...current]); setForm({ nombre: '', usuario: '', rol: 'PersonalAtencion', activo: true }); } catch (error) { showToast(error instanceof Error ? error.message : 'No fue posible guardar el usuario.', 'error'); } }
  async function disable(user: AdminUser) { if (!window.confirm('La cuenta será deshabilitada, no eliminada físicamente. ¿Continuar?')) return; try { const saved = await saveUser({ ...user, activo: false }); setRows((current) => current.map((item) => item.id === saved.id ? saved : item)); } catch (error) { showToast(error instanceof Error ? error.message : 'No fue posible deshabilitar el usuario.', 'error'); } }
  return <section className="page"><div className="page-header"><h1>Administración de usuarios</h1><p>No se muestran ni precargan contraseñas.</p></div><form className="filters" onSubmit={submit}><TextField label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required /><TextField label="Usuario" value={form.usuario} onChange={(e) => setForm({ ...form, usuario: e.target.value })} required /><SelectField label="Rol" value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value as Role })}>{roles.map((role) => <option value={role} key={role}>{roleLabels[role]}</option>)}</SelectField><Button type="submit">Guardar usuario</Button></form><DataTable caption="Usuarios" rows={rows} getKey={(row) => row.id} columns={[{ header: 'Nombre', render: (row) => row.nombre }, { header: 'Usuario', render: (row) => row.usuario }, { header: 'Rol', render: (row) => roleLabels[row.rol] }, { header: 'Estado', render: (row) => <StatusBadge>{row.activo ? 'Activo' : 'Inactivo'}</StatusBadge> }, { header: 'Acciones', render: (row) => <Button type="button" className="button-ghost" disabled={!row.activo} onClick={() => void disable(row)}>Deshabilitar</Button> }]} /></section>;
}
