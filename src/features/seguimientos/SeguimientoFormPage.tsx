import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { SelectField, TextAreaField, TextField } from '../../shared/components/FormControls';
import { Button } from '../../shared/components/Ui';
import { useToast } from '../../shared/components/ToastProvider';
import { seguimientoSchema } from './seguimiento.schema';
import { createSeguimiento } from './seguimiento.service';
import type { SeguimientoInput } from './seguimiento.types';

export function SeguimientoFormPage() {
  const { id = '' } = useParams(); const navigate = useNavigate(); const { showToast } = useToast();
  const form = useForm<SeguimientoInput>({ resolver: zodResolver(seguimientoSchema), defaultValues: { expedienteId: id, estado: 'En seguimiento', accionRealizada: '', proximaAccion: '', responsable: '', derivacion: false } });
  async function submit(values: SeguimientoInput) { try { await createSeguimiento(values); showToast('Seguimiento registrado correctamente.', 'success'); navigate(`/expedientes/${id}`); } catch (error) { showToast(error instanceof Error ? error.message : 'No fue posible registrar el seguimiento.', 'error'); } }
  return <section className="page"><div className="page-header"><h1>Registrar seguimiento</h1><p>Expediente asociado: {id}</p></div><form onSubmit={form.handleSubmit(submit)} className="form-grid"><SelectField label="Estado" {...form.register('estado')}><option>Activo</option><option>En seguimiento</option><option>Derivado</option><option>Cerrado</option></SelectField><TextAreaField label="Acción realizada" {...form.register('accionRealizada')} error={form.formState.errors.accionRealizada} /><TextAreaField label="Próxima acción" {...form.register('proximaAccion')} error={form.formState.errors.proximaAccion} /><TextField label="Fecha de próxima revisión" type="date" {...form.register('fechaProximaRevision')} /><TextAreaField label="Observaciones" {...form.register('observaciones')} /><label className="check-option field-wide"><input type="checkbox" {...form.register('derivacion')} /> <span>Derivación</span></label><TextField label="Institución" {...form.register('institucion')} /><TextField label="Motivo" {...form.register('motivo')} /><TextField label="Responsable" {...form.register('responsable')} error={form.formState.errors.responsable} /><div className="form-actions"><Button type="button" className="button-ghost" onClick={() => navigate(`/expedientes/${id}`)}>Cancelar</Button><Button type="submit" disabled={form.formState.isSubmitting}>Guardar</Button></div></form></section>;
}
