import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch, type Resolver } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckboxGroup, FormSection, SelectField, TextAreaField, TextField } from '../../shared/components/FormControls';
import { Button, Modal } from '../../shared/components/Ui';
import { env } from '../../shared/config/env';
import { routes } from '../../shared/config/routes';
import { useToast } from '../../shared/components/ToastProvider';
import { accionesCapacidad, actosCometidos, agentesLesion, areasAnatomicas, capacidades, caracteristicasRiesgo, efectosEconomicos, efectosFisicos, efectosPsicologicos, efectosSexuales, escolaridades, estadosCiviles, modalidadesViolencia, riesgos, siNo, solicitudesTrabajoSocial, tiposViolencia, viviendas } from './expediente.catalogs';
import { expedienteSchema } from './expediente.schema';
import { createExpediente, findPossibleDuplicates, getExpediente, updateExpediente } from './expediente.service';
import type { ExpedienteForm, ExpedienteListItem } from './expediente.types';
import { defaultExpedienteForm, emptyFamily, emptySupport } from './expediente.mock';
import { PossibleDuplicateAlert } from './components/PossibleDuplicateAlert';

const steps = ['Identificación', 'Datos personales', 'Domicilio y familia', 'Perfil y salud', 'Persona generadora', 'Hechos y violencia', 'Trabajo social', 'Narración y revisión'];
const fieldLabels: Record<string, string> = {
  calle: 'Calle',
  numeroExterior: 'Número exterior',
  numeroInterior: 'Número interior',
  colonia: 'Colonia',
  codigoPostal: 'Código postal',
  municipio: 'Municipio',
  estado: 'Estado',
  pais: 'País',
  efectosFisicos: 'Efectos físicos',
  efectosPsicologicos: 'Efectos psicológicos',
  efectosEconomicos: 'Efectos económicos',
  efectosSexuales: 'Efectos sexuales',
};

export function ExpedienteFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [duplicates, setDuplicates] = useState<ExpedienteListItem[]>([]);
  const [confirmSave, setConfirmSave] = useState(false);
  const form = useForm<ExpedienteForm>({ resolver: zodResolver(expedienteSchema) as unknown as Resolver<ExpedienteForm>, defaultValues: defaultExpedienteForm, mode: 'onBlur' });
  const family = useFieldArray({ control: form.control, name: 'familiares' });
  const supports = useFieldArray({ control: form.control, name: 'redesApoyo' });
  const values = useWatch({ control: form.control });
  const isEditing = Boolean(id);

  useEffect(() => {
    function beforeUnload(event: BeforeUnloadEvent) { if (form.formState.isDirty) { event.preventDefault(); event.returnValue = ''; } }
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [form.formState.isDirty]);

  useEffect(() => {
    if (!id) return;
    void getExpediente(id).then((expediente) => form.reset(expediente.detalle)).catch(() => showToast('No fue posible cargar el expediente para edición.', 'error'));
  }, [form, id, showToast]);

  async function checkDuplicates() {
    const current = form.getValues();
    setDuplicates(await findPossibleDuplicates(current));
  }

  function removeFamily(index: number) {
    const item = form.getValues(`familiares.${index}`);
    if (Object.values(item).some(Boolean) && !window.confirm('La fila contiene información. ¿Deseas eliminarla antes de guardar?')) return;
    family.remove(index);
  }

  function removeSupport(index: number) {
    const item = form.getValues(`redesApoyo.${index}`);
    if (Object.values(item).some(Boolean) && !window.confirm('La red de apoyo contiene información. ¿Deseas eliminarla antes de guardar?')) return;
    supports.remove(index);
  }

  async function submit(values: ExpedienteForm) {
    if (!confirmSave) { setConfirmSave(true); return; }
    const saved = id ? await updateExpediente(id, values) : await createExpediente(values);
    showToast(env.useMocks ? 'Expediente guardado en modo demostración.' : 'Expediente guardado correctamente.', 'success');
    navigate(`/expedientes/${saved.id || id}`);
  }

  return (
    <section className="page form-page">
      <div className="page-header"><div><h1>{isEditing ? 'Edición de usuaria' : 'Registro de nueva usuaria'}</h1><p>Asistente por pasos basado en la cédula institucional. El guardado ocurre al finalizar.</p></div></div>
      {env.useMocks ? <p className="mock-note">Modo demostración: todos los datos capturados permanecen solo en memoria de esta sesión del navegador.</p> : null}
      <div className="stepper" aria-label="Progreso del formulario">{steps.map((label, index) => <button type="button" key={label} className={index === step ? 'active' : ''} onClick={() => setStep(index)}>{index + 1}. {label}</button>)}</div>
      <PossibleDuplicateAlert duplicates={duplicates} />
      <form onSubmit={form.handleSubmit(submit)} noValidate autoComplete="off">
        {step === 0 ? <FormSection title="Identificación de la atención" description="Captura los datos administrativos disponibles sin hacer obligatorios folio o expediente.">
          <TextField label="Folio BANAVIM" {...form.register('folioBanavim')} error={form.formState.errors.folioBanavim} />
          <TextField label="Número de expediente" {...form.register('numeroExpediente')} error={form.formState.errors.numeroExpediente} />
          <TextField label="¿Cómo se enteró del servicio?" {...form.register('comoSeEntero')} error={form.formState.errors.comoSeEntero} />
          <TextField label="Fecha de atención" type="date" {...form.register('fechaAtencion')} error={form.formState.errors.fechaAtencion} />
          {(['indigena', 'migrante', 'reingreso', 'violenciaUltimos12Meses'] as const).map((name) => <SelectField key={name} label={name === 'violenciaUltimos12Meses' ? 'Violencia en los últimos 12 meses' : name} {...form.register(name)} error={form.formState.errors[name]}>{siNo.map((item) => <option key={item}>{item}</option>)}</SelectField>)}
          <Button type="button" className="button-secondary" onClick={() => void checkDuplicates()}>Revisar posible duplicado</Button>
        </FormSection> : null}

        {step === 1 ? <FormSection title="Datos personales" description="La CURP se valida solo por longitud y estructura básica; no se afirma validez oficial.">
          <TextField label="Apellido paterno" {...form.register('apellidoPaterno')} error={form.formState.errors.apellidoPaterno} />
          <TextField label="Apellido materno" {...form.register('apellidoMaterno')} error={form.formState.errors.apellidoMaterno} />
          <TextField label="Nombre o nombres" {...form.register('nombres')} error={form.formState.errors.nombres} />
          <SelectField label="Estado civil" {...form.register('estadoCivil')} error={form.formState.errors.estadoCivil}><option value="">Selecciona</option>{estadosCiviles.map((item) => <option key={item}>{item}</option>)}</SelectField>
          <TextField label="Sexo" {...form.register('sexo')} error={form.formState.errors.sexo} />
          <TextField label="Edad" type="number" min="0" {...form.register('edad')} error={form.formState.errors.edad} />
          <TextField label="Fecha de nacimiento" type="date" {...form.register('fechaNacimiento')} error={form.formState.errors.fechaNacimiento} />
          <TextField label="Municipio de nacimiento" {...form.register('municipioNacimiento')} error={form.formState.errors.municipioNacimiento} />
          <TextField label="Estado de nacimiento" {...form.register('estadoNacimiento')} error={form.formState.errors.estadoNacimiento} />
          <TextField label="País de nacimiento" {...form.register('paisNacimiento')} error={form.formState.errors.paisNacimiento} />
          <TextField label="Nacionalidad" {...form.register('nacionalidad')} error={form.formState.errors.nacionalidad} />
          <TextField label="Religión" {...form.register('religion')} error={form.formState.errors.religion} />
          <TextField label="CURP" maxLength={18} {...form.register('curp', { onChange: (event) => { event.target.value = event.target.value.toUpperCase(); } })} error={form.formState.errors.curp} />
          <TextField label="Teléfono" {...form.register('telefono')} error={form.formState.errors.telefono} />
          <SelectField label="¿Pertenece a algún grupo étnico?" {...form.register('grupoEtnico')}><option>Sí</option><option>No</option><option>Desconoce</option></SelectField>
          <SelectField label="¿Habla lengua indígena?" {...form.register('hablaLenguaIndigena')}>{siNo.map((item) => <option key={item}>{item}</option>)}</SelectField>
          {values.hablaLenguaIndigena === 'Sí' ? <TextField label="¿Cuál lengua indígena?" {...form.register('lenguaIndigenaCual')} error={form.formState.errors.lenguaIndigenaCual} /> : null}
          <SelectField label="¿Habla lengua extranjera?" {...form.register('hablaLenguaExtranjera')}>{siNo.map((item) => <option key={item}>{item}</option>)}</SelectField>
          {values.hablaLenguaExtranjera === 'Sí' ? <TextField label="¿Cuál lengua extranjera?" {...form.register('lenguaExtranjeraCual')} error={form.formState.errors.lenguaExtranjeraCual} /> : null}
          <TextField label="Cantidad de hijas" type="number" min="0" {...form.register('hijas')} error={form.formState.errors.hijas} />
          <TextField label="Cantidad de hijos" type="number" min="0" {...form.register('hijos')} error={form.formState.errors.hijos} />
          <Button type="button" className="button-secondary" onClick={() => void checkDuplicates()}>Verificar duplicados</Button>
        </FormSection> : null}

        {step === 2 ? <FormSection title="Domicilio y estructura familiar">
          {(['calle', 'numeroExterior', 'numeroInterior', 'colonia', 'codigoPostal', 'municipio', 'estado', 'pais'] as const).map((name) => <TextField key={name} label={fieldLabels[name]} {...form.register(name)} error={form.formState.errors[name]} />)}
          <div className="field-wide dynamic-list"><h3>Estructura familiar</h3>{family.fields.map((field, index) => <div className="dynamic-row" key={field.id}><TextField label="Nombre" {...form.register(`familiares.${index}.nombre`)} /><TextField label="Edad" type="number" min="0" {...form.register(`familiares.${index}.edad`)} /><TextField label="Parentesco" {...form.register(`familiares.${index}.parentesco`)} /><TextField label="Ocupación" {...form.register(`familiares.${index}.ocupacion`)} /><TextField label="Escolaridad" {...form.register(`familiares.${index}.escolaridad`)} /><TextField label="Enfermedad" {...form.register(`familiares.${index}.enfermedad`)} /><Button type="button" className="button-ghost" onClick={() => removeFamily(index)}>Eliminar fila</Button></div>)}<Button type="button" className="button-secondary" onClick={() => family.append(emptyFamily)}>Agregar integrante</Button></div>
        </FormSection> : null}

        {step === 3 ? <FormSection title="Perfil, educación, vivienda, salud y redes">
          <TextField label="¿A qué se dedica?" {...form.register('dedicacion')} error={form.formState.errors.dedicacion} />
          <TextField label="Ingreso mensual" type="number" min="0" {...form.register('ingresoMensual')} error={form.formState.errors.ingresoMensual} />
          <TextField label="Jornada laboral" {...form.register('jornadaLaboral')} error={form.formState.errors.jornadaLaboral} />
          <TextField label="Fuente de ingresos" {...form.register('fuenteIngresos')} error={form.formState.errors.fuenteIngresos} />
          <SelectField label="Jefa de familia" {...form.register('jefaFamilia')}>{siNo.map((item) => <option key={item}>{item}</option>)}</SelectField>
          <SelectField label="Formación educativa" {...form.register('escolaridad')} error={form.formState.errors.escolaridad}><option value="">Selecciona</option>{escolaridades.map((item) => <option key={item}>{item}</option>)}</SelectField>
          <SelectField label="Vivienda" {...form.register('vivienda')} error={form.formState.errors.vivienda}><option value="">Selecciona</option>{viviendas.map((item) => <option key={item}>{item}</option>)}</SelectField>
          <details className="field-wide" open><summary>Salud física</summary><div className="form-grid"><TextField label="Servicio médico" {...form.register('servicioMedico')} error={form.formState.errors.servicioMedico} /><SelectField label="Embarazo" {...form.register('embarazo')}><option>Sí</option><option>No</option><option>No sabe</option></SelectField>{(['enfermedad', 'medicamentos', 'drogas'] as const).map((name) => <div className="field" key={name}><SelectField label={name} {...form.register(name)}>{siNo.map((item) => <option key={item}>{item}</option>)}</SelectField>{values[name] === 'Sí' ? <TextField label={`¿Cuál ${name}?`} {...form.register(`${name}Cual` as const)} /> : null}</div>)}</div></details>
          <details className="field-wide"><summary>Matriz de capacidades</summary><div className="form-grid">{accionesCapacidad.map((accion) => <SelectField key={accion} label={accion} {...form.register(`capacidades.${accion}`)}>{capacidades.map((item) => <option key={item}>{item}</option>)}</SelectField>)}</div></details>
          <div className="field-wide dynamic-list"><h3>Redes de apoyo</h3>{supports.fields.map((field, index) => <div className="dynamic-row" key={field.id}><TextField label="Tipo de apoyo" {...form.register(`redesApoyo.${index}.tipoApoyo`)} /><TextField label="Nombre completo" {...form.register(`redesApoyo.${index}.nombreCompleto`)} /><TextField label="Tipo de relación" {...form.register(`redesApoyo.${index}.tipoRelacion`)} /><TextField label="Teléfono" {...form.register(`redesApoyo.${index}.telefono`)} /><TextField label="Dirección completa" {...form.register(`redesApoyo.${index}.direccionCompleta`)} /><Button type="button" className="button-ghost" onClick={() => removeSupport(index)}>Eliminar red</Button></div>)}<Button type="button" className="button-secondary" onClick={() => supports.append(emptySupport)}>Agregar red de apoyo</Button></div>
          <details className="field-wide"><summary>Media filiación</summary><TextAreaField label="Tez, nariz, ojos, cabello, cara, boca, estatura y señas particulares" {...form.register('mediaFiliacion')} /></details>
        </FormSection> : null}

        {step === 4 ? <FormSection title="Datos de la persona generadora de violencia" description="El riesgo no se calcula automáticamente; lo selecciona personal autorizado.">
          <SelectField label="¿Conoce a la persona generadora de violencia?" {...form.register('conoceGenerador')}>{siNo.map((item) => <option key={item}>{item}</option>)}</SelectField>
          {values.conoceGenerador === 'Sí' ? <><TextField label="Nombre completo" {...form.register('generadorNombre')} error={form.formState.errors.generadorNombre} /><TextField label="Relación con la usuaria" {...form.register('generadorRelacion')} /><SelectField label="Estado de riesgo" {...form.register('generadorRiesgo')}>{riesgos.map((item) => <option key={item}>{item}</option>)}</SelectField><Controller control={form.control} name="actosCometidos" render={({ field }) => <CheckboxGroup legend="Actos cometidos" options={actosCometidos} value={field.value} onChange={field.onChange} />} /><Controller control={form.control} name="caracteristicasRiesgo" render={({ field }) => <CheckboxGroup legend="Características de riesgo" options={caracteristicasRiesgo} value={field.value} onChange={field.onChange} />} /><TextAreaField label="Notas" {...form.register('notasGenerador')} /></> : <p className="field-wide">Al indicar No, los datos personales de la persona generadora no son obligatorios.</p>}
        </FormSection> : null}

        {step === 5 ? <FormSection title="Hechos y violencia">
          <TextField label="Fecha de la agresión" type="date" {...form.register('fechaAgresion')} error={form.formState.errors.fechaAgresion} /><TextField label="Hora" type="time" {...form.register('horaAgresion')} /><TextField label="Lugar" {...form.register('lugarAgresion')} /><TextField label="Municipio" {...form.register('municipioAgresion')} /><TextField label="Estado" {...form.register('estadoAgresion')} /><TextField label="Cantidad de veces" type="number" min="0" {...form.register('vecesAgresion')} />
          <SelectField label="¿Ocurrió en día festivo?" {...form.register('diaFestivo')}>{siNo.map((item) => <option key={item}>{item}</option>)}</SelectField>{values.diaFestivo === 'Sí' ? <TextField label="¿Cuál día festivo?" {...form.register('diaFestivoCual')} error={form.formState.errors.diaFestivoCual} /> : null}
          <SelectField label="¿Alguna autoridad conoce el asunto?" {...form.register('autoridadConoce')}>{siNo.map((item) => <option key={item}>{item}</option>)}</SelectField>{values.autoridadConoce === 'Sí' ? <TextField label="¿Cuál autoridad?" {...form.register('autoridadCual')} error={form.formState.errors.autoridadCual} /> : null}<TextField label="¿Denunció?" {...form.register('denuncio')} />
          <Controller control={form.control} name="tiposViolencia" render={({ field }) => <CheckboxGroup legend="Tipo de violencia" options={tiposViolencia} value={field.value} onChange={field.onChange} error={form.formState.errors.tiposViolencia?.message} />} />
          <Controller control={form.control} name="modalidadesViolencia" render={({ field }) => <CheckboxGroup legend="Modalidad de violencia" options={modalidadesViolencia} value={field.value} onChange={field.onChange} />} />
          {(['efectosFisicos', 'efectosPsicologicos', 'efectosEconomicos', 'efectosSexuales'] as const).map((name) => <Controller key={name} control={form.control} name={name} render={({ field }) => <CheckboxGroup legend={fieldLabels[name]} options={{ efectosFisicos, efectosPsicologicos, efectosEconomicos, efectosSexuales }[name]} value={field.value} onChange={field.onChange} />} />)}
          <SelectField label="Agente de lesión" {...form.register('agenteLesion')}>{agentesLesion.map((item) => <option key={item}>{item}</option>)}</SelectField><SelectField label="Área anatómica lesionada" {...form.register('areaAnatomica')}>{areasAnatomicas.map((item) => <option key={item}>{item}</option>)}</SelectField>
        </FormSection> : null}

        {step === 6 ? <FormSection title="Trabajo social">
          <TextAreaField label="Motivo de atención" {...form.register('motivoAtencion')} error={form.formState.errors.motivoAtencion} /><SelectField label="Recibió información" {...form.register('recibioInformacion')}>{siNo.map((item) => <option key={item}>{item}</option>)}</SelectField>{values.recibioInformacion === 'Sí' ? <TextField label="Materia" {...form.register('materiaInformacion')} /> : null}<Controller control={form.control} name="solicitudes" render={({ field }) => <CheckboxGroup legend="Solicita" options={solicitudesTrabajoSocial} value={field.value} onChange={field.onChange} error={form.formState.errors.solicitudes?.message} />} />
        </FormSection> : null}

        {step === 7 ? <FormSection title="Narración y revisión" description="La narración no se muestra en tablas ni se guarda en almacenamiento local.">
          <TextAreaField label="Narración de hechos" rows={8} {...form.register('narracion')} error={form.formState.errors.narracion} /><TextField label="Persona que atiende" {...form.register('personaAtiende')} error={form.formState.errors.personaAtiende} /><TextAreaField label="Observaciones autorizadas" {...form.register('observacionesAutorizadas')} />
          <label className="check-option field-wide"><input type="checkbox" {...form.register('firmaFisica')} /> <span>Firma o huella conservada únicamente en expediente físico.</span></label>
          <label className="check-option field-wide"><input type="checkbox" {...form.register('confirmacionRevision')} /> <span>Confirmo que la información fue revisada antes de guardar.</span></label>
          {form.formState.errors.confirmacionRevision ? <p className="error-text">{form.formState.errors.confirmacionRevision.message}</p> : null}
          <div className="review-box field-wide"><h3>Resumen</h3><p>Usuaria: {values.nombres || 'Pendiente'} {values.apellidoPaterno || ''}</p><p>Expediente: {values.numeroExpediente || 'Se asignará según backend'}</p><p>Tipos de violencia seleccionados: {values.tiposViolencia?.length ?? 0}</p><p>Campos pendientes se indican junto a cada campo al intentar guardar.</p><p className="confidentiality">Este sistema contiene información confidencial. Su consulta y uso están restringidos al personal autorizado de la Instancia Municipal para el Desarrollo de la Mujer.</p></div>
        </FormSection> : null}

        <div className="form-actions"><Button type="button" className="button-ghost" onClick={() => form.formState.isDirty && !window.confirm('Hay cambios sin guardar. ¿Deseas cancelar?') ? undefined : navigate(routes.expedientes)}>Cancelar</Button><Button type="button" className="button-secondary" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}>Anterior</Button>{step < steps.length - 1 ? <Button type="button" onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}>Continuar</Button> : <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Guardando...' : 'Guardar'}</Button>}</div>
      </form>
      {confirmSave ? <Modal title="Confirmar guardado" onClose={() => setConfirmSave(false)}><p>Se guardará el expediente con información confidencial. Verifica que la captura fue revisada y autorizada.</p><div className="form-actions"><Button type="button" className="button-ghost" onClick={() => setConfirmSave(false)}>Volver a revisar</Button><Button type="button" onClick={() => void form.handleSubmit(submit)()}>Confirmar y guardar</Button></div></Modal> : null}
    </section>
  );
}
