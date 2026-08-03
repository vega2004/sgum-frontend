import { describe, expect, it } from 'vitest';
import { hasPermission } from '../../shared/config/roles';
import { expedienteSchema } from './expediente.schema';
import { defaultExpedienteForm } from './expediente.mock';
import { findPossibleDuplicates, searchExpedientes } from './expediente.service';

const validForm = {
  ...defaultExpedienteForm,
  comoSeEntero: 'Difusión', apellidoPaterno: 'Prueba', apellidoMaterno: 'Ficticia', nombres: 'Usuaria', estadoCivil: 'Soltera', sexo: 'Mujer', edad: 30, fechaNacimiento: '1996-01-01', municipioNacimiento: 'Tula', estadoNacimiento: 'Hidalgo', curp: 'PUFU960101MDFRRS08', telefono: '7731234567', calle: 'Ficticia', numeroExterior: '1', colonia: 'Centro', codigoPostal: '42800', dedicacion: 'Trabajo', ingresoMensual: 1, jornadaLaboral: 'Matutina', fuenteIngresos: 'Propia', escolaridad: 'Primaria', vivienda: 'Rentada', servicioMedico: 'Centro de salud', familiares: [{ nombre: 'Familiar ficticio', edad: 1, parentesco: 'Hija', ocupacion: '', escolaridad: '', enfermedad: '' }], redesApoyo: [{ tipoApoyo: 'Familiar', nombreCompleto: 'Apoyo ficticio', tipoRelacion: 'Hermana', telefono: '', direccionCompleta: '' }], tiposViolencia: ['Psicológica'], motivoAtencion: 'Orientación', solicitudes: ['Asesoría jurídica'], narracion: 'Narración ficticia suficiente para validar.', personaAtiende: 'Personal ficticio', confirmacionRevision: true,
};

describe('expedientes', () => {
  it('valida datos personales y CURP básica', () => {
    const result = expedienteSchema.safeParse({ ...validForm, curp: 'abc' });
    expect(result.success).toBe(false);
  });

  it('requiere ¿Cuál? cuando lengua indígena es Sí', () => {
    const result = expedienteSchema.safeParse({ ...validForm, hablaLenguaIndigena: 'Sí', lenguaIndigenaCual: '' });
    expect(result.success).toBe(false);
  });

  it('valida agregar integrantes familiares y redes de apoyo', () => {
    expect(expedienteSchema.safeParse({ ...validForm, familiares: [] }).success).toBe(false);
    expect(expedienteSchema.safeParse({ ...validForm, redesApoyo: [] }).success).toBe(false);
    expect(expedienteSchema.safeParse(validForm).success).toBe(true);
  });

  it('detecta duplicados simulados', async () => {
    const duplicates = await findPossibleDuplicates({ curp: 'LOPM920210MDFPRR05', folioBanavim: '', numeroExpediente: '', nombres: '', apellidoPaterno: '', apellidoMaterno: '' });
    expect(duplicates.length).toBeGreaterThan(0);
  });

  it('busca expedientes', async () => {
    const results = await searchExpedientes({ numeroExpediente: 'EXP-FICT-001' });
    expect(results.some((item) => item.numeroExpediente === 'EXP-FICT-001')).toBe(true);
  });

  it('protege narración por permiso', () => {
    expect(hasPermission('ConsultaCoordinacion', 'narracion:read')).toBe(false);
    expect(hasPermission('PersonalAtencion', 'narracion:read')).toBe(true);
  });
});
