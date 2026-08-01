import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from '../../app/App';

async function loginAs(username: string) {
  await userEvent.type(screen.getByLabelText(/usuario o correo/i), username);
  await userEvent.type(screen.getByLabelText(/^contraseña$/i, { selector: 'input' }), 'Demo123!');
  await userEvent.click(screen.getByRole('button', { name: /ingresar al sistema/i }));
  await screen.findByRole('heading', { name: /panel principal/i });
}

describe('autenticación y rutas', () => {
  it('valida el formulario de inicio de sesión', async () => {
    window.history.pushState({}, '', '/login');
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /ingresar al sistema/i }));
    expect(await screen.findByText(/captura tu usuario/i)).toBeInTheDocument();
    expect(screen.getByText(/al menos 8 caracteres/i)).toBeInTheDocument();
  });

  it('permite mostrar y ocultar contraseña', async () => {
    window.history.pushState({}, '', '/login');
    render(<App />);
    const password = screen.getByLabelText(/^contraseña$/i, { selector: 'input' });
    expect(password).toHaveAttribute('type', 'password');
    await userEvent.click(screen.getByRole('button', { name: /mostrar contraseña/i }));
    expect(password).toHaveAttribute('type', 'text');
    await userEvent.click(screen.getByRole('button', { name: /ocultar contraseña/i }));
    expect(password).toHaveAttribute('type', 'password');
  });

  it('muestra error con credenciales incorrectas', async () => {
    window.history.pushState({}, '', '/login');
    render(<App />);
    await userEvent.type(screen.getByLabelText(/usuario o correo/i), 'admin.demo');
    await userEvent.type(screen.getByLabelText(/^contraseña$/i, { selector: 'input' }), 'Incorrecta1');
    await userEvent.click(screen.getByRole('button', { name: /ingresar al sistema/i }));
    expect(await screen.findByText(/usuario o contraseña inválidos/i)).toBeInTheDocument();
  });

  it('usa accesos de demostración y obtiene el rol desde autenticación', async () => {
    window.history.pushState({}, '', '/login');
    render(<App />);
    await userEvent.click(screen.getByText(/accesos de demostración/i));
    await userEvent.click(screen.getByRole('button', { name: /administrador/i }));
    await userEvent.click(screen.getByRole('button', { name: /ingresar al sistema/i }));
    await screen.findByRole('heading', { name: /panel principal/i });
    expect(screen.getByText(/administrador/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /usuarios/i })).toBeInTheDocument();
  });

  it('protege rutas privadas redirigiendo a login', () => {
    window.history.pushState({}, '', '/dashboard');
    render(<App />);
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('restringe rutas por rol y muestra no autorizado', async () => {
    window.history.pushState({}, '', '/login');
    render(<App />);
    await loginAs('coordinacion.demo');
    window.history.pushState({}, '', '/administracion/usuarios');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(await screen.findByRole('heading', { name: /acceso no autorizado/i })).toBeInTheDocument();
  });

  it('permite cerrar sesión desde el menú de usuario', async () => {
    window.history.pushState({}, '', '/login');
    render(<App />);
    await loginAs('atencion.demo');
    await userEvent.click(await screen.findByRole('button', { name: /personal de atención/i }));
    await userEvent.click(screen.getByRole('menuitem', { name: /cerrar sesión/i }));
    expect(await screen.findByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('muestra botón de menú móvil', async () => {
    window.history.pushState({}, '', '/login');
    render(<App />);
    await loginAs('atencion.demo');
    expect(await screen.findByRole('button', { name: /abrir menú/i })).toBeInTheDocument();
  });
});
