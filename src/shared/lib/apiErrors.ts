import { ApiError } from './apiClient';

export type FriendlyError = {
  title: string;
  description: string;
  status?: number;
};

export function normalizeApiError(error: unknown): FriendlyError {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return {
        status: 0,
        title: 'No se pudo conectar con el servidor.',
        description: 'Revisa tu conexión a internet e intenta nuevamente. Si estabas capturando información, el borrador se conservará temporalmente.',
      };
    }
    if (error.status === 400) return { status: 400, title: 'Hay datos pendientes o incorrectos.', description: 'Revisa los campos marcados antes de continuar.' };
    if (error.status === 401) return { status: 401, title: 'La sesión expiró.', description: 'Por seguridad, inicia sesión nuevamente.' };
    if (error.status === 403) return { status: 403, title: 'No tienes permiso para realizar esta acción.', description: 'Consulta con una persona administradora del sistema.' };
    if (error.status === 404) return { status: 404, title: 'No se encontró la información solicitada.', description: 'El registro pudo haber sido modificado o dado de baja.' };
    if (error.status === 409) return { status: 409, title: 'Ya existe un registro con información similar.', description: 'Revisa si la usuaria ya fue registrada previamente.' };
    if (error.status && error.status >= 500) return { status: error.status, title: 'Ocurrió un detalle al procesar la solicitud.', description: 'Intenta nuevamente en unos minutos. Si el problema continúa, repórtalo al área responsable del sistema.' };
  }

  if (error instanceof TypeError || (error instanceof Error && /failed to fetch|network/i.test(error.message))) {
    return {
      status: 0,
      title: 'No se pudo conectar con el servidor.',
      description: 'Revisa tu conexión a internet e intenta nuevamente. Si estabas capturando información, el borrador se conservará temporalmente.',
    };
  }

  return {
    title: 'No fue posible completar la acción.',
    description: 'Intenta nuevamente. Si el problema continúa, repórtalo al área responsable.',
  };
}

export function getFriendlyErrorMessage(error: unknown) {
  const friendly = normalizeApiError(error);
  return `${friendly.title} ${friendly.description}`;
}
