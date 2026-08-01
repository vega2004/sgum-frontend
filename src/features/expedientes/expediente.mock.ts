import { accionesCapacidad } from './expediente.catalogs';
import type { Expediente, ExpedienteForm, ExpedienteListItem, Familiar, RedApoyo } from './expediente.types';

export const emptyFamily: Familiar = { nombre: '', edad: '', parentesco: '', ocupacion: '', escolaridad: '', enfermedad: '' };
export const emptySupport: RedApoyo = { tipoApoyo: '', nombreCompleto: '', tipoRelacion: '', telefono: '', direccionCompleta: '' };

export const defaultExpedienteForm: ExpedienteForm = {
  folioBanavim: '', numeroExpediente: '', comoSeEntero: '', fechaAtencion: new Date().toISOString().slice(0, 10), indigena: 'No', migrante: 'No', reingreso: 'No', violenciaUltimos12Meses: 'No',
  apellidoPaterno: '', apellidoMaterno: '', nombres: '', estadoCivil: '', sexo: '', edad: '', fechaNacimiento: '', municipioNacimiento: '', estadoNacimiento: '', paisNacimiento: 'México', nacionalidad: 'Mexicana', religion: '', curp: '', telefono: '', grupoEtnico: 'No', hablaLenguaIndigena: 'No', lenguaIndigenaCual: '', hablaLenguaExtranjera: 'No', lenguaExtranjeraCual: '', hijas: 0, hijos: 0,
  calle: '', numeroExterior: '', numeroInterior: '', colonia: '', codigoPostal: '', municipio: 'Tula de Allende', estado: 'Hidalgo', pais: 'México', familiares: [emptyFamily],
  dedicacion: '', ingresoMensual: 0, jornadaLaboral: '', fuenteIngresos: '', jefaFamilia: 'No', escolaridad: '', vivienda: '', servicioMedico: '', embarazo: 'No', enfermedad: 'No', enfermedadCual: '', medicamentos: 'No', medicamentosCual: '', drogas: 'No', drogasCual: '', capacidades: Object.fromEntries(accionesCapacidad.map((item) => [item, 'No tiene dificultad'])), redesApoyo: [emptySupport], mediaFiliacion: '',
  conoceGenerador: 'No', generadorNombre: '', generadorRelacion: '', generadorRiesgo: 'Leve', actosCometidos: [], caracteristicasRiesgo: [], notasGenerador: '',
  fechaAgresion: '', horaAgresion: '', lugarAgresion: '', municipioAgresion: '', estadoAgresion: '', vecesAgresion: '', diaFestivo: 'No', diaFestivoCual: '', autoridadConoce: 'No', autoridadCual: '', denuncio: '', tiposViolencia: [], modalidadesViolencia: [], efectosFisicos: ['Ninguno'], efectosPsicologicos: ['Ninguno'], efectosEconomicos: ['Ninguno'], efectosSexuales: ['Ninguno'], agenteLesion: 'Ninguno', areaAnatomica: 'Ninguna',
  motivoAtencion: '', recibioInformacion: 'No', materiaInformacion: '', solicitudes: [], narracion: '', personaAtiende: '', observacionesAutorizadas: '', firmaFisica: false, confirmacionRevision: false,
};

const demoForm: ExpedienteForm = {
  ...defaultExpedienteForm,
  folioBanavim: 'BAN-FICT-001', numeroExpediente: 'EXP-FICT-001', comoSeEntero: 'Difusión institucional', fechaAtencion: '2026-07-15',
  apellidoPaterno: 'Demo', apellidoMaterno: 'Uno', nombres: 'Usuaria Ficticia', estadoCivil: 'Soltera', sexo: 'Mujer', edad: 34, fechaNacimiento: '1992-02-10', municipioNacimiento: 'Tula de Allende', estadoNacimiento: 'Hidalgo', curp: 'FICT920210MDFXXX00', telefono: '0000000000', hijas: 1, hijos: 0,
  calle: 'Calle ficticia', numeroExterior: '12', colonia: 'Colonia demostración', codigoPostal: '42800', dedicacion: 'Comercio', ingresoMensual: 6000, jornadaLaboral: 'Matutina', fuenteIngresos: 'Trabajo propio', jefaFamilia: 'Sí', escolaridad: 'Secundaria', vivienda: 'Rentada', servicioMedico: 'Centro de salud',
  familiares: [{ nombre: 'Integrante ficticio', edad: 8, parentesco: 'Hija', ocupacion: 'Estudiante', escolaridad: 'Primaria', enfermedad: 'Ninguna registrada' }],
  redesApoyo: [{ tipoApoyo: 'Familiar', nombreCompleto: 'Contacto ficticio', tipoRelacion: 'Hermana', telefono: '7730000000', direccionCompleta: 'Dirección ficticia' }],
  conoceGenerador: 'Sí', generadorNombre: 'Persona ficticia', generadorRelacion: 'Ex pareja', generadorRiesgo: 'Moderado', actosCometidos: ['Insultos, humillaciones y amenazas'], caracteristicasRiesgo: ['Celoso o posesivo'],
  fechaAgresion: '2026-07-10', lugarAgresion: 'Domicilio ficticio', municipioAgresion: 'Tula de Allende', estadoAgresion: 'Hidalgo', vecesAgresion: 1, tiposViolencia: ['Psicológica'], modalidadesViolencia: ['Familiar'],
  motivoAtencion: 'Orientación inicial', recibioInformacion: 'Sí', materiaInformacion: 'Servicios disponibles', solicitudes: ['Asesoría jurídica'], narracion: 'Narración ficticia para demostración, sin datos personales reales.', personaAtiende: 'Personal ficticio', confirmacionRevision: true,
};

let expedientes: Expediente[] = [
  {
    id: 'exp-1', numeroExpediente: 'EXP-FICT-001', folioBanavim: 'BAN-FICT-001', nombreCompleto: 'Usuaria Ficticia Demo Uno', curp: 'FICT920210MDFXXX00', telefono: '0000000000', ultimaAtencion: '2026-07-15', estado: 'En seguimiento', detalle: demoForm,
    historial: [
      { fecha: '2026-07-15', evento: 'Registro inicial de expediente', responsable: 'Personal de Atención' },
      { fecha: '2026-07-20', evento: 'Seguimiento programado', responsable: 'Personal de Atención' },
    ],
  },
  {
    id: 'exp-2', numeroExpediente: 'EXP-FICT-002', folioBanavim: 'BAN-FICT-002', nombreCompleto: 'Usuaria Ficticia Demo Dos', curp: 'DEMO900101MDFXXX01', telefono: '0000000001', ultimaAtencion: '2026-07-08', estado: 'Activo', detalle: { ...demoForm, numeroExpediente: 'EXP-FICT-002', folioBanavim: 'BAN-FICT-002', nombres: 'Usuaria Ficticia', apellidoPaterno: 'Demo', apellidoMaterno: 'Dos', curp: 'DEMO900101MDFXXX01', telefono: '0000000001' }, historial: [{ fecha: '2026-07-08', evento: 'Consulta autorizada', responsable: 'Coordinación' }],
  },
];

function delay(ms = 450) { return new Promise((resolve) => window.setTimeout(resolve, ms)); }

export async function mockSearchExpedientes(filters: Record<string, string | undefined>): Promise<ExpedienteListItem[]> {
  await delay();
  const query = Object.values(filters).filter(Boolean).join(' ').toLowerCase();
  if (!query) return expedientes;
  return expedientes.filter((item) => [item.nombreCompleto, item.curp, item.numeroExpediente, item.folioBanavim, item.estado].join(' ').toLowerCase().includes(query));
}

export async function mockGetExpediente(id: string) {
  await delay();
  const expediente = expedientes.find((item) => item.id === id);
  if (!expediente) throw new Error('No se encontró el expediente solicitado.');
  return expediente;
}

export async function mockCreateExpediente(input: ExpedienteForm) {
  await delay(700);
  const id = `exp-${Date.now()}`;
  const item: Expediente = {
    id,
    numeroExpediente: input.numeroExpediente || `EXP-FICT-${expedientes.length + 1}`,
    folioBanavim: input.folioBanavim,
    nombreCompleto: `${input.nombres} ${input.apellidoPaterno} ${input.apellidoMaterno}`.trim(),
    curp: input.curp,
    telefono: input.telefono,
    ultimaAtencion: input.fechaAtencion,
    estado: 'Activo',
    detalle: input,
    historial: [{ fecha: input.fechaAtencion, evento: 'Registro inicial de expediente en modo demostración', responsable: input.personaAtiende || 'Personal autorizado' }],
  };
  expedientes = [item, ...expedientes];
  return item;
}

export async function mockUpdateExpediente(id: string, input: ExpedienteForm) {
  await delay(700);
  const existing = expedientes.find((item) => item.id === id);
  if (!existing) throw new Error('No se encontró el expediente solicitado.');
  const updated: Expediente = {
    ...existing,
    numeroExpediente: input.numeroExpediente || existing.numeroExpediente,
    folioBanavim: input.folioBanavim,
    nombreCompleto: `${input.nombres} ${input.apellidoPaterno} ${input.apellidoMaterno}`.trim(),
    curp: input.curp,
    telefono: input.telefono,
    ultimaAtencion: input.fechaAtencion,
    detalle: input,
  };
  expedientes = expedientes.map((item) => item.id === id ? updated : item);
  return updated;
}

export async function mockDeleteExpediente(id: string) {
  await delay(300);
  expedientes = expedientes.filter((item) => item.id !== id);
}

export async function mockFindDuplicates(input: Pick<ExpedienteForm, 'curp' | 'folioBanavim' | 'numeroExpediente' | 'nombres' | 'apellidoPaterno' | 'apellidoMaterno'>) {
  await delay(300);
  const name = `${input.nombres} ${input.apellidoPaterno} ${input.apellidoMaterno}`.toLowerCase();
  return expedientes.filter((item) => item.curp === input.curp || item.folioBanavim === input.folioBanavim || item.numeroExpediente === input.numeroExpediente || item.nombreCompleto.toLowerCase().includes(name.trim())).slice(0, 3);
}
