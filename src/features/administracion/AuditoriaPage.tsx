import { useEffect, useState } from 'react';
import { DataTable } from '../../shared/components/Ui';
import { TextField } from '../../shared/components/FormControls';
import { listAudit, type AuditRow } from './administracion.service';

export function AuditoriaPage() {
  const [rows, setRows] = useState<AuditRow[]>([]); const [query, setQuery] = useState('');
  useEffect(() => { void listAudit().then(setRows); }, []);
  const visible = rows.filter((row) => [row.usuario, row.accion, row.fecha, row.expediente].join(' ').toLowerCase().includes(query.toLowerCase()));
  return <section className="page"><div className="page-header"><h1>Auditoría</h1><p>Consulta de acciones sin mostrar contenido completo de datos modificados.</p></div><div className="filters"><TextField label="Filtrar por usuario, acción, fecha o expediente" value={query} onChange={(e) => setQuery(e.target.value)} /></div><DataTable caption="Auditoría" rows={visible} getKey={(row) => row.id} columns={[{ header: 'Usuario', render: (row) => row.usuario }, { header: 'Acción', render: (row) => row.accion }, { header: 'Fecha', render: (row) => row.fecha }, { header: 'Expediente', render: (row) => row.expediente }, { header: 'Resumen', render: (row) => row.resumen }]} /></section>;
}
