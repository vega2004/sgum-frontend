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
<<<<<<< HEAD

export function setAccessToken(token: string | null) {
  accessToken = token;
=======
const tokenStorageKey = 'sgum.accessToken';

function canUseSessionStorage() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (!canUseSessionStorage()) return;
  if (token) window.sessionStorage.setItem(tokenStorageKey, token);
  else window.sessionStorage.removeItem(tokenStorageKey);
}

export function getAccessToken() {
  if (accessToken) return accessToken;
  if (!canUseSessionStorage()) return null;
  accessToken = window.sessionStorage.getItem(tokenStorageKey);
  return accessToken;
>>>>>>> 9ec0819 (Conectar frontend con procesos backend reales)
}

type ErrorPayload = {
  mensaje?: string;
  message?: string;
  title?: string;
  errors?: Record<string, string[]> | string[] | string;
<<<<<<< HEAD
=======
  detalle?: string;
>>>>>>> 9ec0819 (Conectar frontend con procesos backend reales)
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
<<<<<<< HEAD
  return payload.mensaje ?? payload.message ?? payload.title ?? formatErrors(payload.errors) ?? 'No fue posible completar la operación.';
}

function buildUrl(path: string) {
  return `${env.apiBaseUrl}/${path.replace(/^\/+/, '')}`;
}

export async function apiClient<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(buildUrl(path), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError('No fue posible conectar con SGUM.Api. Verifica la conexión o la disponibilidad del backend.');
  }
=======
  return payload.mensaje ?? payload.message ?? payload.title ?? payload.detalle ?? formatErrors(payload.errors) ?? 'No fue posible completar la operación.';
}

export async function apiClient<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
>>>>>>> 9ec0819 (Conectar frontend con procesos backend reales)

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
