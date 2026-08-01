import { z } from 'zod';

export const todayIso = () => new Date().toISOString().slice(0, 10);

export const notFutureDate = z
  .string()
  .min(1, 'La fecha es obligatoria')
  .refine((value) => value <= todayIso(), 'La fecha no puede ser futura');

export const optionalNotFutureDate = z
  .string()
  .optional()
  .refine((value) => !value || value <= todayIso(), 'La fecha no puede ser futura');

export const curpSchema = z
  .string()
  .trim()
  .transform((value) => value.toUpperCase())
  .refine((value) => !value || /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(value), {
    message: 'La CURP debe tener 18 caracteres y estructura básica válida',
  });

export const phoneSchema = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || /^[0-9+()\-\s]{7,20}$/.test(value), 'El teléfono contiene caracteres no permitidos');
