import { describe, expect, it } from 'vitest';
import { createSeguimiento, listSeguimientos } from './seguimiento.service';

describe('seguimientos', () => {
  it('registra cambio de estado de seguimiento', async () => {
    const item = await createSeguimiento({ expedienteId: 'exp-1', estado: 'Cerrado', accionRealizada: 'Acción ficticia', proximaAccion: 'Sin acción', responsable: 'Personal ficticio' });
    expect(item.estado).toBe('Cerrado');
    const rows = await listSeguimientos();
    expect(rows.some((row) => row.id === item.id)).toBe(true);
  });
});
