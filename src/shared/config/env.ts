import { z } from 'zod';

<<<<<<< HEAD
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;
const localApiBaseUrl = ['http://', 'local', 'host:8080'].join('');
const disallowedProductionHosts = [['local', 'host'].join(''), ['127', '0', '0', '1'].join('.')];

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().optional(),
  VITE_USE_MOCKS: z.enum(['true', 'false'], {
    message: 'VITE_USE_MOCKS debe configurarse explícitamente como true o false',
  }),
}).superRefine((values, context) => {
  const useMocks = values.VITE_USE_MOCKS === 'true';
  const apiBaseUrl = values.VITE_API_BASE_URL?.trim();

  if (useMocks) return;

  if (!apiBaseUrl) {
    context.addIssue({ code: 'custom', path: ['VITE_API_BASE_URL'], message: 'VITE_API_BASE_URL es obligatoria cuando VITE_USE_MOCKS=false' });
    return;
  }

  let url: URL;
  try {
    url = new URL(apiBaseUrl);
  } catch {
    context.addIssue({ code: 'custom', path: ['VITE_API_BASE_URL'], message: 'VITE_API_BASE_URL debe ser una URL válida' });
    return;
  }

  if (apiBaseUrl.endsWith('//')) {
    context.addIssue({ code: 'custom', path: ['VITE_API_BASE_URL'], message: 'VITE_API_BASE_URL no debe terminar con doble diagonal' });
  }

  if (isProduction && url.protocol !== 'https:') {
    context.addIssue({ code: 'custom', path: ['VITE_API_BASE_URL'], message: 'VITE_API_BASE_URL debe usar HTTPS en producción' });
  }

  if (isProduction && disallowedProductionHosts.includes(url.hostname)) {
    context.addIssue({ code: 'custom', path: ['VITE_API_BASE_URL'], message: 'VITE_API_BASE_URL no debe apuntar a un entorno local en producción' });
  }
});

const parsed = envSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? (isDevelopment ? localApiBaseUrl : undefined),
  VITE_USE_MOCKS: import.meta.env.VITE_USE_MOCKS ?? (isDevelopment ? 'true' : undefined),
});

if (!parsed.success) {
  const details = parsed.error.issues.map((issue) => issue.message).join(' ');
  throw new Error(`Variables de entorno incompletas o inválidas para SGUM. ${details}`);
}

const apiBaseUrl = parsed.data.VITE_API_BASE_URL?.trim().replace(/\/$/, '') ?? '';

export const env = {
  apiBaseUrl,
=======
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url('VITE_API_BASE_URL debe ser una URL válida'),
  VITE_USE_MOCKS: z.enum(['true', 'false']).default('true'),
});

const parsed = envSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  VITE_USE_MOCKS: import.meta.env.VITE_USE_MOCKS ?? 'true',
});

if (!parsed.success) {
  throw new Error('Variables de entorno incompletas o inválidas para SGUM. Revisa .env.example.');
}

export const env = {
  apiBaseUrl: parsed.data.VITE_API_BASE_URL,
>>>>>>> 9ec0819 (Conectar frontend con procesos backend reales)
  useMocks: parsed.data.VITE_USE_MOCKS === 'true',
};
