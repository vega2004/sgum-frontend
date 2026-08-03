import { z } from 'zod';

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
  useMocks: parsed.data.VITE_USE_MOCKS === 'true',
};
