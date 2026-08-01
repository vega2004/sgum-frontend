import { Link } from 'react-router-dom';
import type { ExpedienteListItem } from '../expediente.types';

export function PossibleDuplicateAlert({ duplicates }: { duplicates: ExpedienteListItem[] }) {
  if (!duplicates.length) return null;
  return (
    <div className="warning-box" role="status">
      <strong>Posible duplicado detectado</strong>
      <p>Revisa los expedientes similares antes de guardar. No se muestra información sensible completa.</p>
      {duplicates.map((item) => <Link key={item.id} to={`/expedientes/${item.id}`}>{item.numeroExpediente} - {item.estado}</Link>)}
    </div>
  );
}
