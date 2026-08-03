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
  activa?: boolean;
};

export type DomicilioDto = { calle?: string | null; numeroExterior?: string | null; numeroInterior?: string | null; colonia?: string | null; codigoPostal?: string | null; municipio?: string | null; estado?: string | null; pais?: string | null };
export type FamiliarDto = { nombre?: string | null; edad?: number | null; parentesco?: string | null; ocupacion?: string | null; escolaridad?: string | null; enfermedad?: string | null };
export type PerfilSaludDto = { aQueSeDedica?: string | null; ingresoMensual?: number | null; jornadaLaboral?: string | null; fuenteIngresos?: string | null; jefaFamilia?: boolean | null; formacionEducativa?: string | null; vivienda?: string | null; servicioMedico?: string | null; embarazo?: boolean | null; enfermedad?: string | null; medicamentos?: string | null; drogas?: string | null; matrizCapacidades?: string | null; mediaFiliacion?: string | null };
export type RedApoyoDto = { tipoApoyo?: string | null; nombreCompleto?: string | null; tipoRelacion?: string | null; telefono?: string | null; direccionCompleta?: string | null };
export type PersonaGeneradoraViolenciaDto = { conocePersonaGeneradora?: boolean | null; nombre?: string | null; edad?: number | null; sexo?: string | null; parentesco?: string | null; ocupacion?: string | null; escolaridad?: string | null; domicilio?: string | null; telefono?: string | null };
export type HechosViolenciaDto = { fechaAgresion?: string | null; horaAgresion?: string | null; lugar?: string | null; municipio?: string | null; estado?: string | null; cantidadVeces?: number | null; ocurrioDiaFestivo?: boolean | null; autoridadConoceAsunto?: boolean | null; denuncio?: boolean | null; tiposViolencia?: string | null; modalidadesViolencia?: string | null; efectosFisicos?: string | null; efectosPsicologicos?: string | null; efectosEconomicos?: string | null; efectosSexuales?: string | null; agenteLesion?: string | null; areaAnatomicaLesionada?: string | null };
export type TrabajoSocialDto = { motivoAtencion?: string | null; recibioInformacion?: boolean | null; solicitudes?: string | null };
export type NarracionRevisionDto = { narracionHechos?: string | null; personaQueAtiende?: string | null; observacionesAutorizadas?: string | null; firmaHuellaEnExpedienteFisico: boolean; informacionRevisadaAntesDeGuardar: boolean };
export type ExpedienteCompletoUpdateDto = { domicilio?: DomicilioDto | null; familiares?: FamiliarDto[] | null; perfilSalud?: PerfilSaludDto | null; redesApoyo?: RedApoyoDto[] | null; personaGeneradoraViolencia?: PersonaGeneradoraViolenciaDto | null; hechosViolencia?: HechosViolenciaDto | null; trabajoSocial?: TrabajoSocialDto | null; narracionRevision?: NarracionRevisionDto | null };
export type ExpedienteCompletoResponseDto = ExpedienteCompletoUpdateDto & { usuaria?: UsuariaResponse | null };

function emptyToNull(value: string | undefined) {
  return value?.trim() ? value.trim() : null;
}

function toNullableNumber(value: number | '') {
  return value === '' ? null : Number(value);
}

function toText(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function toDateInput(value: unknown) {
  const text = toText(value);
  return text ? text.slice(0, 10) : '';
}

function toDateTime(value: string | undefined) {
  return value ? value : null;
}

function joinList(value: string[] | undefined) {
  return value?.length ? value.join(', ') : null;
}

function splitList(value: unknown) {
  return toText(value).split(',').map((item) => item.trim()).filter(Boolean);
}

function parseCapabilities(value: unknown) {
  const text = toText(value);
  if (!text) return defaultExpedienteForm.capacidades;
  try {
    const parsed = JSON.parse(text) as Record<string, string>;
    return { ...defaultExpedienteForm.capacidades, ...parsed };
  } catch {
    return defaultExpedienteForm.capacidades;
  }
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

function mapBoolToSiNoDesconoce(value: boolean | null | undefined): 'Sí' | 'No' | 'No sabe' {
  if (value === null || value === undefined) return 'No sabe';
  return value ? 'Sí' : 'No';
}

function mapTextToBool(value: string | undefined) {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (['sí', 'si', 'true', '1'].includes(normalized)) return true;
  if (['no', 'false', '0'].includes(normalized)) return false;
  return null;
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

export function mapExpedienteFormToExpedienteCompletoUpdateDto(input: ExpedienteForm): ExpedienteCompletoUpdateDto {
  return {
    domicilio: {
      calle: emptyToNull(input.calle),
      numeroExterior: emptyToNull(input.numeroExterior),
      numeroInterior: emptyToNull(input.numeroInterior),
      colonia: emptyToNull(input.colonia),
      codigoPostal: emptyToNull(input.codigoPostal),
      municipio: emptyToNull(input.municipio),
      estado: emptyToNull(input.estado),
      pais: emptyToNull(input.pais),
    },
    familiares: input.familiares.map((item) => ({
      nombre: emptyToNull(item.nombre),
      edad: toNullableNumber(item.edad),
      parentesco: emptyToNull(item.parentesco),
      ocupacion: emptyToNull(item.ocupacion),
      escolaridad: emptyToNull(item.escolaridad),
      enfermedad: emptyToNull(item.enfermedad),
    })),
    perfilSalud: {
      aQueSeDedica: emptyToNull(input.dedicacion),
      ingresoMensual: toNullableNumber(input.ingresoMensual),
      jornadaLaboral: emptyToNull(input.jornadaLaboral),
      fuenteIngresos: emptyToNull(input.fuenteIngresos),
      jefaFamilia: mapSiNoToBool(input.jefaFamilia),
      formacionEducativa: emptyToNull(input.escolaridad),
      vivienda: emptyToNull(input.vivienda),
      servicioMedico: emptyToNull(input.servicioMedico),
      embarazo: input.embarazo === 'No sabe' ? null : mapSiNoToBool(input.embarazo),
      enfermedad: input.enfermedad === 'Sí' ? emptyToNull(input.enfermedadCual) ?? 'Sí' : 'No',
      medicamentos: input.medicamentos === 'Sí' ? emptyToNull(input.medicamentosCual) ?? 'Sí' : 'No',
      drogas: input.drogas === 'Sí' ? emptyToNull(input.drogasCual) ?? 'Sí' : 'No',
      matrizCapacidades: JSON.stringify(input.capacidades),
      mediaFiliacion: emptyToNull(input.mediaFiliacion),
    },
    redesApoyo: input.redesApoyo.map((item) => ({
      tipoApoyo: emptyToNull(item.tipoApoyo),
      nombreCompleto: emptyToNull(item.nombreCompleto),
      tipoRelacion: emptyToNull(item.tipoRelacion),
      telefono: emptyToNull(item.telefono),
      direccionCompleta: emptyToNull(item.direccionCompleta),
    })),
    personaGeneradoraViolencia: {
      conocePersonaGeneradora: mapSiNoToBool(input.conoceGenerador),
      nombre: emptyToNull(input.generadorNombre),
      parentesco: emptyToNull(input.generadorRelacion),
    },
    hechosViolencia: {
      fechaAgresion: toDateTime(input.fechaAgresion),
      horaAgresion: emptyToNull(input.horaAgresion),
      lugar: emptyToNull(input.lugarAgresion),
      municipio: emptyToNull(input.municipioAgresion),
      estado: emptyToNull(input.estadoAgresion),
      cantidadVeces: toNullableNumber(input.vecesAgresion),
      ocurrioDiaFestivo: mapSiNoToBool(input.diaFestivo),
      autoridadConoceAsunto: mapSiNoToBool(input.autoridadConoce),
      denuncio: mapTextToBool(input.denuncio),
      tiposViolencia: joinList(input.tiposViolencia),
      modalidadesViolencia: joinList(input.modalidadesViolencia),
      efectosFisicos: joinList(input.efectosFisicos),
      efectosPsicologicos: joinList(input.efectosPsicologicos),
      efectosEconomicos: joinList(input.efectosEconomicos),
      efectosSexuales: joinList(input.efectosSexuales),
      agenteLesion: emptyToNull(input.agenteLesion),
      areaAnatomicaLesionada: emptyToNull(input.areaAnatomica),
    },
    trabajoSocial: {
      motivoAtencion: emptyToNull(input.motivoAtencion),
      recibioInformacion: mapSiNoToBool(input.recibioInformacion),
      solicitudes: joinList(input.solicitudes),
    },
    narracionRevision: {
      narracionHechos: emptyToNull(input.narracion),
      personaQueAtiende: emptyToNull(input.personaAtiende),
      observacionesAutorizadas: emptyToNull(input.observacionesAutorizadas),
      firmaHuellaEnExpedienteFisico: input.firmaFisica,
      informacionRevisadaAntesDeGuardar: input.confirmacionRevision,
    },
  };
}

export function mergeExpedienteCompleto(base: UsuariaResponse, completo?: ExpedienteCompletoResponseDto | null): Expediente {
  const expediente = mapUsuariaResponseToExpediente(completo?.usuaria ?? base);
  const detalle: ExpedienteForm = {
    ...expediente.detalle,
    calle: toText(completo?.domicilio?.calle),
    numeroExterior: toText(completo?.domicilio?.numeroExterior),
    numeroInterior: toText(completo?.domicilio?.numeroInterior),
    colonia: toText(completo?.domicilio?.colonia),
    codigoPostal: toText(completo?.domicilio?.codigoPostal),
    municipio: toText(completo?.domicilio?.municipio),
    estado: toText(completo?.domicilio?.estado),
    pais: toText(completo?.domicilio?.pais),
    familiares: completo?.familiares?.length ? completo.familiares.map((item) => ({ nombre: toText(item.nombre), edad: toNumberOrEmpty(item.edad), parentesco: toText(item.parentesco), ocupacion: toText(item.ocupacion), escolaridad: toText(item.escolaridad), enfermedad: toText(item.enfermedad) })) : expediente.detalle.familiares,
    dedicacion: toText(completo?.perfilSalud?.aQueSeDedica),
    ingresoMensual: toNumberOrEmpty(completo?.perfilSalud?.ingresoMensual),
    jornadaLaboral: toText(completo?.perfilSalud?.jornadaLaboral),
    fuenteIngresos: toText(completo?.perfilSalud?.fuenteIngresos),
    jefaFamilia: mapBackendBoolToSiNo(completo?.perfilSalud?.jefaFamilia),
    escolaridad: toText(completo?.perfilSalud?.formacionEducativa),
    vivienda: toText(completo?.perfilSalud?.vivienda),
    servicioMedico: toText(completo?.perfilSalud?.servicioMedico),
    embarazo: mapBoolToSiNoDesconoce(completo?.perfilSalud?.embarazo),
    enfermedad: completo?.perfilSalud?.enfermedad && completo.perfilSalud.enfermedad !== 'No' ? 'Sí' : 'No',
    enfermedadCual: completo?.perfilSalud?.enfermedad === 'No' ? '' : toText(completo?.perfilSalud?.enfermedad),
    medicamentos: completo?.perfilSalud?.medicamentos && completo.perfilSalud.medicamentos !== 'No' ? 'Sí' : 'No',
    medicamentosCual: completo?.perfilSalud?.medicamentos === 'No' ? '' : toText(completo?.perfilSalud?.medicamentos),
    drogas: completo?.perfilSalud?.drogas && completo.perfilSalud.drogas !== 'No' ? 'Sí' : 'No',
    drogasCual: completo?.perfilSalud?.drogas === 'No' ? '' : toText(completo?.perfilSalud?.drogas),
    capacidades: parseCapabilities(completo?.perfilSalud?.matrizCapacidades),
    mediaFiliacion: toText(completo?.perfilSalud?.mediaFiliacion),
    redesApoyo: completo?.redesApoyo?.length ? completo.redesApoyo.map((item) => ({ tipoApoyo: toText(item.tipoApoyo), nombreCompleto: toText(item.nombreCompleto), tipoRelacion: toText(item.tipoRelacion), telefono: toText(item.telefono), direccionCompleta: toText(item.direccionCompleta) })) : expediente.detalle.redesApoyo,
    conoceGenerador: mapBackendBoolToSiNo(completo?.personaGeneradoraViolencia?.conocePersonaGeneradora),
    generadorNombre: toText(completo?.personaGeneradoraViolencia?.nombre),
    generadorRelacion: toText(completo?.personaGeneradoraViolencia?.parentesco),
    fechaAgresion: toDateInput(completo?.hechosViolencia?.fechaAgresion),
    horaAgresion: toText(completo?.hechosViolencia?.horaAgresion),
    lugarAgresion: toText(completo?.hechosViolencia?.lugar),
    municipioAgresion: toText(completo?.hechosViolencia?.municipio),
    estadoAgresion: toText(completo?.hechosViolencia?.estado),
    vecesAgresion: toNumberOrEmpty(completo?.hechosViolencia?.cantidadVeces),
    diaFestivo: mapBackendBoolToSiNo(completo?.hechosViolencia?.ocurrioDiaFestivo),
    autoridadConoce: mapBackendBoolToSiNo(completo?.hechosViolencia?.autoridadConoceAsunto),
    denuncio: mapBackendBoolToSiNo(completo?.hechosViolencia?.denuncio),
    tiposViolencia: splitList(completo?.hechosViolencia?.tiposViolencia),
    modalidadesViolencia: splitList(completo?.hechosViolencia?.modalidadesViolencia),
    efectosFisicos: splitList(completo?.hechosViolencia?.efectosFisicos),
    efectosPsicologicos: splitList(completo?.hechosViolencia?.efectosPsicologicos),
    efectosEconomicos: splitList(completo?.hechosViolencia?.efectosEconomicos),
    efectosSexuales: splitList(completo?.hechosViolencia?.efectosSexuales),
    agenteLesion: toText(completo?.hechosViolencia?.agenteLesion),
    areaAnatomica: toText(completo?.hechosViolencia?.areaAnatomicaLesionada),
    motivoAtencion: toText(completo?.trabajoSocial?.motivoAtencion),
    recibioInformacion: mapBackendBoolToSiNo(completo?.trabajoSocial?.recibioInformacion),
    solicitudes: splitList(completo?.trabajoSocial?.solicitudes),
    narracion: toText(completo?.narracionRevision?.narracionHechos),
    personaAtiende: toText(completo?.narracionRevision?.personaQueAtiende),
    observacionesAutorizadas: toText(completo?.narracionRevision?.observacionesAutorizadas),
    firmaFisica: Boolean(completo?.narracionRevision?.firmaHuellaEnExpedienteFisico),
    confirmacionRevision: Boolean(completo?.narracionRevision?.informacionRevisadaAntesDeGuardar),
  };
  return { ...expediente, detalle };
}
