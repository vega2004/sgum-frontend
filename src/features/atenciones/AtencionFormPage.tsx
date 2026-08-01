import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { TextAreaField, TextField } from '../../shared/components/FormControls';
import { Button, ErrorState, LoadingState } from '../../shared/components/Ui';
import { useToast } from '../../shared/components/ToastProvider';
import { getExpediente } from '../expedientes/expediente.service';
import type { Expediente } from '../expedientes/expediente.types';
import { atencionSchema } from './atencion.schema';
import { createAtencion } from './atencion.service';
import type { AtencionInput } from './atencion.types';

export function AtencionFormPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [expediente, setExpediente] = useState<Expediente | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const form = useForm<AtencionInput>({ resolver: zodResolver(atencionSchema) as unknown as Resolver<AtencionInput>, defaultValues: { expedienteId: id, fecha: new Date().toISOString().slice(0, 10), motivo: '', servicioOtorgado: '', acciones: '', observaciones: '', datosHechos: '', confirmar: false } });
  useEffect(() => { getExpediente(id).then((data) => { setExpediente(data); setStatus('success'); }).catch(() => setStatus('error')); }, [id]);
  async function submit(values: AtencionInput) { try { await createAtencion(values); showToast('Atención registrada correctamente.', 'success'); navigate(`/expedientes/${id}`); } catch (error) { showToast(error instanceof Error ? error.message : 'No fue posible registrar la atención.', 'error'); } }
  if (status === 'loading') return <LoadingState />;
  if (status === 'error' || !expediente) return <ErrorState message="No existe una usuaria asociada para registrar atención." />;
  return <section className="page"><div className="page-header"><h1>Registrar atención</h1><p>Expediente: {expediente.numeroExpediente}. Usuaria asociada en modo solo lectura.</p></div><form onSubmit={form.handleSubmit(submit)} className="form-grid" noValidate><TextField label="Fecha" type="date" {...form.register('fecha')} error={form.formState.errors.fecha} /><TextAreaField label="Motivo" {...form.register('motivo')} error={form.formState.errors.motivo} /><TextAreaField label="Servicio otorgado" {...form.register('servicioOtorgado')} error={form.formState.errors.servicioOtorgado} /><TextAreaField label="Acciones" {...form.register('acciones')} error={form.formState.errors.acciones} /><TextAreaField label="Observaciones" {...form.register('observaciones')} /><TextAreaField label="Datos de hechos cuando corresponda" {...form.register('datosHechos')} /><label className="check-option field-wide"><input type="checkbox" {...form.register('confirmar')} /> <span>Confirmo que la información fue revisada antes de guardar.</span></label>{form.formState.errors.confirmar ? <p className="error-text">{form.formState.errors.confirmar.message}</p> : null}<div className="form-actions"><Button type="button" className="button-ghost" onClick={() => navigate(`/expedientes/${id}`)}>Cancelar</Button><Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Guardando...' : 'Guardar'}</Button></div></form></section>;
}
