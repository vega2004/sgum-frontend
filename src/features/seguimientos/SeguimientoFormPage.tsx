import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { SelectField, TextAreaField, TextField } from '../../shared/components/FormControls';
import { Button, ErrorState, LoadingState } from '../../shared/components/Ui';
import { normalizeApiError } from '../../shared/lib/apiErrors';
import { useNotification } from '../../shared/hooks/useNotification';
import { getExpediente } from '../expedientes/expediente.service';
import { seguimientoSchema } from './seguimiento.schema';
import { createSeguimiento, getSeguimiento, updateSeguimiento } from './seguimiento.service';
import type { SeguimientoInput } from './seguimiento.types';

export function SeguimientoFormPage() {
  const { id = '', seguimientoId = '' } = useParams(); const navigate = useNavigate(); const { showSuccess, showError } = useNotification();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const isEditing = Boolean(seguimientoId);
  const form = useForm<SeguimientoInput>({ resolver: zodResolver(seguimientoSchema), defaultValues: { expedienteId: id, numeroExpediente: '', estado: 'En seguimiento', accionRealizada: '', proximaAccion: '', responsable: '', derivacion: false } });
  useEffect(() => {
    async function load() {
      try {
        setStatus('loading');
        if (seguimientoId) {
          const seguimiento = await getSeguimiento(seguimientoId);
          form.reset(seguimiento);
        } else {
          const expediente = await getExpediente(id);
          form.reset({ expedienteId: id, numeroExpediente: expediente.numeroExpediente, estado: 'En seguimiento', accionRealizada: '', proximaAccion: '', responsable: '', derivacion: false });
        }
        setStatus('success');
      } catch {
        setStatus('error');
      }
    }
    void load();
  }, [form, id, seguimientoId]);
  async function submit(values: SeguimientoInput) { try { if (isEditing) await updateSeguimiento(seguimientoId, values); else await createSeguimiento(values); showSuccess({ title: isEditing ? 'Seguimiento actualizado correctamente.' : 'Seguimiento registrado correctamente.', description: 'La acción quedó registrada en el sistema.' }); navigate(`/expedientes/${values.expedienteId}`); } catch (error) { const friendly = normalizeApiError(error); showError({ title: 'No fue posible guardar el seguimiento.', description: friendly.description }); } }
  if (status === 'loading') return <LoadingState />;
  if (status === 'error') return <ErrorState message="No existe una usuaria asociada para registrar seguimiento." />;
  return <section className="page"><div className="page-header"><h1>{isEditing ? 'Editar seguimiento' : 'Registrar seguimiento'}</h1><p>Expediente asociado: {form.getValues('numeroExpediente') || form.getValues('expedienteId')}</p></div><form onSubmit={form.handleSubmit(submit)} className="form-grid"><SelectField label="Estado" {...form.register('estado')}><option>Activo</option><option>En seguimiento</option><option>Derivado</option><option>Cerrado</option></SelectField><TextAreaField label="Acción realizada" {...form.register('accionRealizada')} error={form.formState.errors.accionRealizada} /><TextAreaField label="Próxima acción" {...form.register('proximaAccion')} error={form.formState.errors.proximaAccion} /><TextField label="Fecha de próxima revisión" type="date" {...form.register('fechaProximaRevision')} /><TextAreaField label="Observaciones" {...form.register('observaciones')} /><label className="check-option field-wide"><input type="checkbox" {...form.register('derivacion')} /> <span>Derivación</span></label><TextField label="Institución" {...form.register('institucion')} /><TextField label="Motivo" {...form.register('motivo')} /><TextField label="Responsable" {...form.register('responsable')} error={form.formState.errors.responsable} /><div className="form-actions"><Button type="button" className="button-ghost" onClick={() => navigate(`/expedientes/${form.getValues('expedienteId') || id}`)}>Cancelar</Button><Button type="submit" disabled={form.formState.isSubmitting}>Guardar</Button></div></form></section>;
}
