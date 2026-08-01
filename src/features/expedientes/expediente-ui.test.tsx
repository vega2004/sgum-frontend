import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from '../../app/App';

async function login() {
  await userEvent.type(screen.getByLabelText(/usuario o correo/i), 'atencion.demo');
  await userEvent.type(screen.getByLabelText(/^contraseña$/i, { selector: 'input' }), 'Demo123!');
  await userEvent.click(screen.getByRole('button', { name: /ingresar al sistema/i }));
  await screen.findByRole('heading', { name: /panel principal/i });
}

describe('búsqueda de expedientes', () => {
  it('limpia filtros y muestra estado inicial', async () => {
    window.history.pushState({}, '', '/login');
    render(<App />);
    await login();
    await userEvent.click(screen.getByRole('link', { name: /expedientes/i }));
    await userEvent.type(await screen.findByLabelText(/búsqueda general/i), 'sin coincidencias');
    await userEvent.click(screen.getByRole('button', { name: /^buscar$/i }));
    expect(await screen.findByText(/no se encontraron expedientes/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /limpiar búsqueda/i }));
    expect(screen.getByText(/utilice los criterios de búsqueda/i)).toBeInTheDocument();
  }, 10000);
});
