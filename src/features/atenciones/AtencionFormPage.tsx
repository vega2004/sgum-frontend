import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { TextAreaField, TextField } from '../../shared/components/FormControls';
import { Button, ErrorState, LoadingState } from '../../shared/components/Ui';
import { normalizeApiError } from '../../shared/lib/apiErrors';
import { useNotification } from '../../shared/hooks/useNotification';
import { getExpediente } from '../expedientes/expediente.service';
import type { Expediente } from '../expedientes/expediente.types';
import { atencionSchema } from './atencion.schema';
import { createAtencion, getAtencion, updateAtencion } from './atencion.service';
import type { AtencionInput } from './atencion.types';

export function AtencionFormPage() {
  const { id = '', atencionId = '' } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [expediente, setExpediente] = useState<Expediente | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const isEditing = Boolean(atencionId);
  const form = useForm<AtencionInput>({ resolver: zodResolver(atencionSchema) as unknown as Resolver<AtencionInput>, defaultValues: { usuariaId: id, fechaAtencion: new Date().toISOString().slice(0, 10), tipoAtencion: '', areaAtencion: '', responsable: '', motivo: '', observaciones: '', resultado: '', confirmar: false } });
  useEffect(() => {
    async function load() {
      try {
        setStatus('loading');
        const atencion = atencionId ? await getAtencion(atencionId) : null;
        const expedienteId = atencion?.usuariaId ?? id;
        if (!expedienteId) throw new Error('No existe una usuaria asociada para registrar atención.');
        const data = await getExpediente(expedienteId);
        if (atencion) form.reset({ ...atencion, confirmar: false });
        setExpediente(data);
        setStatus('success');
      } catch {
        setStatus('error');
      }
    }
    void load();
  }, [atencionId, form, id]);
  async function submit(values: AtencionInput) { try { if (isEditing) await updateAtencion(atencionId, values); else await createAtencion(values); showSuccess({ title: isEditing ? 'Atención actualizada correctamente.' : 'Atención registrada correctamente.', description: 'La información quedó registrada en el expediente.' }); navigate(`/expedientes/${values.usuariaId}`); } catch (error) { const friendly = normalizeApiError(error); showError({ title: 'No fue posible guardar la atención.', description: friendly.description }); } }
  if (status === 'loading') return <LoadingState />;
  if (status === 'error' || !expediente) return <ErrorState message="No existe una usuaria asociada para registrar atención." />;
  return <section className="page"><div className="page-header"><h1>{isEditing ? 'Editar atención' : 'Registrar atención'}</h1><p>Expediente: {expediente.numeroExpediente}. Usuaria asociada en modo solo lectura.</p></div><form onSubmit={form.handleSubmit(submit)} className="form-grid" noValidate><TextField label="Fecha" type="date" {...form.register('fechaAtencion')} error={form.formState.errors.fechaAtencion} /><TextField label="Tipo de atención" {...form.register('tipoAtencion')} error={form.formState.errors.tipoAtencion} /><TextField label="Área de atención" {...form.register('areaAtencion')} error={form.formState.errors.areaAtencion} /><TextField label="Responsable" {...form.register('responsable')} error={form.formState.errors.responsable} /><TextAreaField label="Motivo" {...form.register('motivo')} error={form.formState.errors.motivo} /><TextAreaField label="Observaciones" {...form.register('observaciones')} /><TextAreaField label="Resultado" {...form.register('resultado')} error={form.formState.errors.resultado} /><label className="check-option field-wide"><input type="checkbox" {...form.register('confirmar')} /> <span>Confirmo que la información fue revisada antes de guardar.</span></label>{form.formState.errors.confirmar ? <p className="error-text">{form.formState.errors.confirmar.message}</p> : null}<div className="form-actions"><Button type="button" className="button-ghost" onClick={() => navigate(`/expedientes/${form.getValues('usuariaId') || id}`)}>Cancelar</Button><Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Guardando...' : 'Guardar'}</Button></div></form></section>;
}
