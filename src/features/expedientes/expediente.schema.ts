import { z } from 'zod';
import { curpSchema, notFutureDate, optionalNotFutureDate } from '../../shared/lib/validators';

const required = 'Este campo es obligatorio';
const siNo = z.enum(['Sí', 'No']);
const siNoDesconoce = z.enum(['Sí', 'No', 'Desconoce']);

const nonNegativeNumber = z.coerce.number({ message: 'Captura un número válido' }).min(0, 'No puede ser negativo');

const familiarSchema = z.object({
  nombre: z.string().min(1, required),
  edad: nonNegativeNumber.or(z.literal('')),
  parentesco: z.string().min(1, required),
  ocupacion: z.string().optional().default(''),
  escolaridad: z.string().optional().default(''),
  enfermedad: z.string().optional().default(''),
});

const redApoyoSchema = z.object({
  tipoApoyo: z.string().min(1, required),
  nombreCompleto: z.string().min(1, required),
  tipoRelacion: z.string().min(1, required),
  telefono: z.string().optional().default(''),
  direccionCompleta: z.string().optional().default(''),
});

export const expedienteSchema = z
  .object({
    folioBanavim: z.string().optional(),
    numeroExpediente: z.string().optional(),
    comoSeEntero: z.string().min(1, required),
    fechaAtencion: notFutureDate,
    indigena: siNo,
    migrante: siNo,
    reingreso: siNo,
    violenciaUltimos12Meses: siNo,
    apellidoPaterno: z.string().min(1, required),
    apellidoMaterno: z.string().min(1, required),
    nombres: z.string().min(1, required),
    estadoCivil: z.string().min(1, required),
    sexo: z.string().min(1, required),
    edad: nonNegativeNumber,
    fechaNacimiento: notFutureDate,
    municipioNacimiento: z.string().min(1, required),
    estadoNacimiento: z.string().min(1, required),
    paisNacimiento: z.string().min(1, required),
    nacionalidad: z.string().min(1, required),
    religion: z.string().optional().default(''),
    curp: curpSchema,
    telefono: z.string().regex(/^[0-9+()\-\s]{0,20}$/, 'El teléfono contiene caracteres no permitidos'),
    grupoEtnico: siNoDesconoce,
    hablaLenguaIndigena: siNo,
    lenguaIndigenaCual: z.string().optional(),
    hablaLenguaExtranjera: siNo,
    lenguaExtranjeraCual: z.string().optional(),
    hijas: nonNegativeNumber,
    hijos: nonNegativeNumber,
    calle: z.string().min(1, required),
    numeroExterior: z.string().min(1, required),
    numeroInterior: z.string().optional().default(''),
    colonia: z.string().min(1, required),
    codigoPostal: z.string().min(1, required),
    municipio: z.string().min(1, required),
    estado: z.string().min(1, required),
    pais: z.string().min(1, required),
    familiares: z.array(familiarSchema).min(1, 'Agrega al menos un integrante familiar'),
    dedicacion: z.string().min(1, required),
    ingresoMensual: nonNegativeNumber,
    jornadaLaboral: z.string().min(1, required),
    fuenteIngresos: z.string().min(1, required),
    jefaFamilia: siNo,
    escolaridad: z.string().min(1, required),
    vivienda: z.string().min(1, required),
    servicioMedico: z.string().min(1, required),
    embarazo: z.enum(['Sí', 'No', 'No sabe']),
    enfermedad: siNo,
    enfermedadCual: z.string().optional(),
    medicamentos: siNo,
    medicamentosCual: z.string().optional(),
    drogas: siNo,
    drogasCual: z.string().optional(),
    capacidades: z.record(z.string(), z.string()),
    redesApoyo: z.array(redApoyoSchema).min(1, 'Agrega al menos una red de apoyo o registra Sin red identificada'),
    mediaFiliacion: z.string().optional().default(''),
    conoceGenerador: siNo,
    generadorNombre: z.string().optional(),
    generadorRelacion: z.string().optional(),
    generadorRiesgo: z.enum(['Leve', 'Moderado', 'Grave']),
    actosCometidos: z.array(z.string()).default([]),
    caracteristicasRiesgo: z.array(z.string()).default([]),
    notasGenerador: z.string().optional(),
    fechaAgresion: optionalNotFutureDate.or(z.literal('')),
    horaAgresion: z.string().optional().default(''),
    lugarAgresion: z.string().optional().default(''),
    municipioAgresion: z.string().optional().default(''),
    estadoAgresion: z.string().optional().default(''),
    vecesAgresion: nonNegativeNumber.or(z.literal('')),
    diaFestivo: siNo,
    diaFestivoCual: z.string().optional(),
    autoridadConoce: siNo,
    autoridadCual: z.string().optional(),
    denuncio: z.string().optional().default(''),
    tiposViolencia: z.array(z.string()).min(1, 'Selecciona al menos un tipo de violencia'),
    modalidadesViolencia: z.array(z.string()).default([]),
    efectosFisicos: z.array(z.string()).default([]),
    efectosPsicologicos: z.array(z.string()).default([]),
    efectosEconomicos: z.array(z.string()).default([]),
    efectosSexuales: z.array(z.string()).default([]),
    agenteLesion: z.string().optional().default('Ninguno'),
    areaAnatomica: z.string().optional().default('Ninguna'),
    motivoAtencion: z.string().min(1, required),
    recibioInformacion: siNo,
    materiaInformacion: z.string().optional(),
    solicitudes: z.array(z.string()).min(1, 'Selecciona al menos una solicitud'),
    narracion: z.string().min(10, 'La narración debe contener la información autorizada para el expediente'),
    personaAtiende: z.string().min(1, required),
    observacionesAutorizadas: z.string().optional().default(''),
    firmaFisica: z.boolean(),
    confirmacionRevision: z.boolean().refine((value) => value, 'Confirma que la información fue revisada'),
  })
  .superRefine((value, ctx) => {
    ([['hablaLenguaIndigena', 'lenguaIndigenaCual'], ['hablaLenguaExtranjera', 'lenguaExtranjeraCual'], ['enfermedad', 'enfermedadCual'], ['medicamentos', 'medicamentosCual'], ['drogas', 'drogasCual'], ['diaFestivo', 'diaFestivoCual'], ['autoridadConoce', 'autoridadCual']] as const).forEach(([flag, detail]) => {
      if (value[flag] === 'Sí' && !value[detail]) ctx.addIssue({ code: 'custom', path: [detail], message: 'Captura cuál' });
    });
    if (value.conoceGenerador === 'Sí' && !value.generadorNombre) ctx.addIssue({ code: 'custom', path: ['generadorNombre'], message: 'Captura el nombre conocido' });
  });

export type ExpedienteSchema = z.infer<typeof expedienteSchema>;
