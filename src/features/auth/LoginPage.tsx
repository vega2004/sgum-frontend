import { zodResolver } from '@hookform/resolvers/zod';
import { LockKeyhole, ShieldCheck, ClipboardList, UserRound, FolderSearch } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { z } from 'zod';
import { Button, Alert } from '../../shared/components/Ui';
import { PasswordField, TextField } from '../../shared/components/FormControls';
import { env } from '../../shared/config/env';
import { routes } from '../../shared/config/routes';
import { normalizeApiError } from '../../shared/lib/apiErrors';
import { useAuth } from './AuthProvider';
import type { LoginInput } from './auth.types';
import { demoAccounts } from './auth.service';

const loginSchema = z.object({
  username: z.string().min(3, 'Captura tu usuario o correo institucional'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState, setValue } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  if (isAuthenticated) return <Navigate to={routes.dashboard} replace />;

  async function onSubmit(values: LoginInput) {
    setError('');
    try {
      await login(values);
    } catch (err) {
      if (env.useMocks && err instanceof Error) {
        setError(err.message);
        return;
      }
      const friendly = normalizeApiError(err);
      setError(`${friendly.title} ${friendly.description}`);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-info">
          <span className="eyebrow">SGUM</span>
          <h1>Sistema de Gestión de Usuarias Municipal</h1>
          <p>Plataforma institucional para organizar expedientes, registrar atenciones y dar seguimiento a los casos de manera segura.</p>
          <Alert tone="warning">Este sistema contiene información confidencial. Su consulta y uso están restringidos al personal autorizado de la Instancia Municipal para el Desarrollo de la Mujer.</Alert>
          <div className="login-benefits" aria-label="Características del sistema">
            <div><ShieldCheck aria-hidden="true" /><span>Acceso protegido</span></div>
            <div><FolderSearch aria-hidden="true" /><span>Información organizada</span></div>
            <div><ClipboardList aria-hidden="true" /><span>Seguimiento institucional</span></div>
          </div>
        </div>
        <form className="login-form" onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
          <div>
            <span className="eyebrow">Acceso institucional</span>
            <h2 id="login-title">Iniciar sesión</h2>
            <p>Ingrese sus datos de acceso institucional.</p>
          </div>
          <div className="field-with-icon"><UserRound aria-hidden="true" /><TextField label="Usuario o correo" autoComplete="username" error={formState.errors.username} {...register('username')} /></div>
          <div className="field-with-icon"><LockKeyhole aria-hidden="true" /><PasswordField label="Contraseña" autoComplete="off" error={formState.errors.password} {...register('password')} /></div>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <Button type="submit" className="button-full" loading={formState.isSubmitting}>Ingresar al sistema</Button>
          {env.useMocks ? (
            <details className="demo-access">
              <summary>Accesos de demostración</summary>
              <p>Estos accesos utilizan información ficticia y solo están disponibles en modo demostración.</p>
              <div className="demo-buttons">
                {demoAccounts.map((account) => <Button key={account.username} type="button" variant="outline" onClick={() => { setValue('username', account.username, { shouldValidate: true }); setValue('password', account.password, { shouldValidate: true }); }}>{account.label}</Button>)}
              </div>
            </details>
          ) : null}
        </form>
      </section>
    </main>
  );
}
