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

describe('seguimientos', () => {
  it('cambia entre pestañas de seguimiento', async () => {
    window.history.pushState({}, '', '/login');
    render(<App />);
    await login();
    await userEvent.click(screen.getAllByRole('link', { name: /seguimientos/i })[0]);
    expect(await screen.findByRole('tab', { name: /próximos/i })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(screen.getByRole('tab', { name: /sin fecha/i }));
    expect(screen.getByRole('tab', { name: /sin fecha/i })).toHaveAttribute('aria-selected', 'true');
  });
});
