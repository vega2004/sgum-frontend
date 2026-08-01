import { env } from '../../shared/config/env';
import type { AtencionInput } from './atencion.types';

export async function createAtencion(input: AtencionInput) {
  await new Promise((resolve) => window.setTimeout(resolve, 450));
  if (!env.useMocks) throw new Error('Módulo pendiente de integración backend.');
  return { id: `atencion-${Date.now()}`, ...input };
}
