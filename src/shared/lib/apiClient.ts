import { env } from '../config/env';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
  }
}

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

type ErrorPayload = {
  mensaje?: string;
  message?: string;
  title?: string;
  errors?: Record<string, string[]> | string[] | string;
};

function formatErrors(errors: ErrorPayload['errors']) {
  if (!errors) return undefined;
  if (typeof errors === 'string') return errors;
  if (Array.isArray(errors)) return errors.join(' ');
  return Object.values(errors).flat().join(' ');
}

function getErrorMessage(data: unknown) {
  if (typeof data === 'string' && data.trim()) return data;
  if (!data || typeof data !== 'object') return 'No fue posible completar la operación.';
  const payload = data as ErrorPayload;
  return payload.mensaje ?? payload.message ?? payload.title ?? formatErrors(payload.errors) ?? 'No fue posible completar la operación.';
}

export async function apiClient<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    setAccessToken(null);
    throw new ApiError('La sesión expiró. Vuelve a iniciar sesión.', 401);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new ApiError(getErrorMessage(data), response.status);
  }

  return data as T;
}
