import { defaultExpedienteForm } from './expediente.mock';
import type { Expediente, ExpedienteForm, ExpedienteListItem } from './expediente.types';

export type UsuariaCreateDto = {
  folioBanavim?: string | null;
  numeroExpediente?: string | null;
  fechaAtencion: string;
  comoSeEnteroServicio: string;
  esIndigena: boolean;
  esMigrante: boolean;
  esReingreso: boolean;
  violenciaUltimos12Meses: boolean;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombre: string;
  estadoCivil: string;
  sexo: string;
  edad: number | null;
  fechaNacimiento: string;
  municipioNacimiento: string;
  estadoNacimiento: string;
  paisNacimiento: string;
  nacionalidad: string;
  religion: string;
  curp: string;
  telefono: string;
  perteneceGrupoEtnico: boolean | null;
  lenguaIndigena: string;
  cualLenguaIndigena?: string | null;
  lenguaExtranjera: string;
  cualLenguaExtranjera?: string | null;
  numeroHijas: number | null;
  numeroHijos: number | null;
};

export type UsuariaUpdateDto = UsuariaCreateDto;

export type UsuariaResponse = Partial<UsuariaCreateDto> & {
  id?: string | number;
  usuariaId?: string | number;
  usuarioId?: string | number;
  nombre?: string;
  nombres?: string;
  nombreCompleto?: string;
  fechaAtencion?: string;
  ultimaAtencion?: string;
  estado?: string;
};

function emptyToNull(value: string | undefined) {
  return value?.trim() ? value.trim() : null;
}

function toNullableNumber(value: number | '') {
  return value === '' ? null : Number(value);
}

function toText(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function toNumberOrEmpty(value: unknown): number | '' {
  return typeof value === 'number' ? value : '';
}

function resolveId(input: UsuariaResponse) {
  return String(input.id ?? input.usuariaId ?? input.usuarioId ?? '');
}

function resolveNombreCompleto(input: UsuariaResponse) {
  return input.nombreCompleto ?? [input.nombre ?? input.nombres, input.apellidoPaterno, input.apellidoMaterno].filter(Boolean).join(' ').trim();
}

export function mapSiNoToBool(value: 'Sí' | 'No') {
  return value === 'Sí';
}

export function mapBackendBoolToSiNo(value: boolean | null | undefined): 'Sí' | 'No' {
  return value ? 'Sí' : 'No';
}

function mapGrupoEtnico(value: 'Sí' | 'No' | 'Desconoce') {
  if (value === 'Desconoce') return null;
  return value === 'Sí';
}

function mapBackendGrupoEtnico(value: boolean | null | undefined): 'Sí' | 'No' | 'Desconoce' {
  if (value === null || value === undefined) return 'Desconoce';
  return value ? 'Sí' : 'No';
}

export function mapExpedienteFormToUsuariaCreateDto(input: ExpedienteForm): UsuariaCreateDto {
  return {
    folioBanavim: emptyToNull(input.folioBanavim),
    numeroExpediente: emptyToNull(input.numeroExpediente),
    fechaAtencion: input.fechaAtencion,
    comoSeEnteroServicio: input.comoSeEntero,
    esIndigena: mapSiNoToBool(input.indigena),
    esMigrante: mapSiNoToBool(input.migrante),
    esReingreso: mapSiNoToBool(input.reingreso),
    violenciaUltimos12Meses: mapSiNoToBool(input.violenciaUltimos12Meses),
    apellidoPaterno: input.apellidoPaterno,
    apellidoMaterno: input.apellidoMaterno,
    nombre: input.nombres,
    estadoCivil: input.estadoCivil,
    sexo: input.sexo,
    edad: toNullableNumber(input.edad),
    fechaNacimiento: input.fechaNacimiento,
    municipioNacimiento: input.municipioNacimiento,
    estadoNacimiento: input.estadoNacimiento,
    paisNacimiento: input.paisNacimiento,
    nacionalidad: input.nacionalidad,
    religion: input.religion,
    curp: input.curp,
    telefono: input.telefono,
    perteneceGrupoEtnico: mapGrupoEtnico(input.grupoEtnico),
    lenguaIndigena: input.hablaLenguaIndigena,
    cualLenguaIndigena: emptyToNull(input.lenguaIndigenaCual),
    lenguaExtranjera: input.hablaLenguaExtranjera,
    cualLenguaExtranjera: emptyToNull(input.lenguaExtranjeraCual),
    numeroHijas: toNullableNumber(input.hijas),
    numeroHijos: toNullableNumber(input.hijos),
  };
}

export function mapExpedienteFormToUsuariaUpdateDto(input: ExpedienteForm): UsuariaUpdateDto {
  return mapExpedienteFormToUsuariaCreateDto(input);
}

export function mapUsuariaListItemToExpedienteListItem(input: UsuariaResponse): ExpedienteListItem {
  return {
    id: resolveId(input),
    numeroExpediente: toText(input.numeroExpediente) || 'Sin expediente',
    folioBanavim: input.folioBanavim ?? undefined,
    nombreCompleto: resolveNombreCompleto(input),
    curp: input.curp ?? undefined,
    telefono: input.telefono ?? undefined,
    ultimaAtencion: input.ultimaAtencion ?? input.fechaAtencion ?? '',
    estado: 'Activo',
  };
}

export function mapUsuariaResponseToExpediente(input: UsuariaResponse): Expediente {
  const detalle: ExpedienteForm = {
    ...defaultExpedienteForm,
    folioBanavim: toText(input.folioBanavim),
    numeroExpediente: toText(input.numeroExpediente),
    comoSeEntero: toText(input.comoSeEnteroServicio),
    fechaAtencion: toText(input.fechaAtencion) || defaultExpedienteForm.fechaAtencion,
    indigena: mapBackendBoolToSiNo(input.esIndigena),
    migrante: mapBackendBoolToSiNo(input.esMigrante),
    reingreso: mapBackendBoolToSiNo(input.esReingreso),
    violenciaUltimos12Meses: mapBackendBoolToSiNo(input.violenciaUltimos12Meses),
    apellidoPaterno: toText(input.apellidoPaterno),
    apellidoMaterno: toText(input.apellidoMaterno),
    nombres: toText(input.nombre ?? input.nombres),
    estadoCivil: toText(input.estadoCivil),
    sexo: toText(input.sexo),
    edad: toNumberOrEmpty(input.edad),
    fechaNacimiento: toText(input.fechaNacimiento),
    municipioNacimiento: toText(input.municipioNacimiento),
    estadoNacimiento: toText(input.estadoNacimiento),
    paisNacimiento: toText(input.paisNacimiento),
    nacionalidad: toText(input.nacionalidad),
    religion: toText(input.religion),
    curp: toText(input.curp),
    telefono: toText(input.telefono),
    grupoEtnico: mapBackendGrupoEtnico(input.perteneceGrupoEtnico),
    hablaLenguaIndigena: input.lenguaIndigena === 'Sí' ? 'Sí' : 'No',
    lenguaIndigenaCual: toText(input.cualLenguaIndigena),
    hablaLenguaExtranjera: input.lenguaExtranjera === 'Sí' ? 'Sí' : 'No',
    lenguaExtranjeraCual: toText(input.cualLenguaExtranjera),
    hijas: toNumberOrEmpty(input.numeroHijas),
    hijos: toNumberOrEmpty(input.numeroHijos),
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    colonia: '',
    codigoPostal: '',
    municipio: '',
    estado: '',
    pais: '',
    familiares: [],
    redesApoyo: [],
    narracion: '',
    confirmacionRevision: false,
  };
  const listItem = mapUsuariaListItemToExpedienteListItem(input);
  return {
    ...listItem,
    detalle,
    historial: detalle.fechaAtencion ? [{ fecha: detalle.fechaAtencion, evento: 'Registro de usuaria', responsable: 'Backend SGUM.Api' }] : [],
  };
}
