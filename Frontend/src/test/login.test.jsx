import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils'; // Importamos act
import Login from '../login.jsx';

// Mockeamos window.location.href para probar la navegación
const mockNavigate = jest.fn();
Object.defineProperty(window, 'location', {
  value: { href: '' },
  writable: true,
});

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<Login />);
  });

  test('renders login form with all elements', () => {
    expect(screen.getByRole('heading', { name: /inicio de sesión/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /volver al inicio/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /modo oscuro/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /inicia sesión/i })).toBeInTheDocument();
  });

  test('updates form inputs correctly', async () => {
    const correoInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);

    await act(async () => {
      await userEvent.type(correoInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
    });

    expect(correoInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('shows error message when submitting empty form', async () => {
    const submitButton = screen.getByRole('button', { name: /ingresar/i });

    await act(async () => {
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/por favor, complete todos los campos/i)).toBeInTheDocument();
    });
  });

  test('shows success message and clears form on valid submission', async () => {
    const correoInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /ingresar/i });

    await act(async () => {
      await userEvent.type(correoInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/inicio de sesión exitoso/i)).toBeInTheDocument();
      expect(correoInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
    });
  });

  test('toggles dark mode correctly', async () => {
    const modoOscuroButton = screen.getByRole('button', { name: /modo oscuro/i });

    expect(document.body).not.toHaveClass('dark');

    await act(async () => {
      await userEvent.click(modoOscuroButton);
    });

    await waitFor(() => {
      expect(document.body).toHaveClass('dark');
      expect(screen.getByRole('button', { name: /modo claro/i })).toBeInTheDocument();
    });

    await act(async () => {
      await userEvent.click(modoOscuroButton);
    });

    await waitFor(() => {
      expect(document.body).not.toHaveClass('dark');
      expect(screen.getByRole('button', { name: /modo oscuro/i })).toBeInTheDocument();
    });
  });

  test('navigates to home when clicking Volver al inicio', async () => {
    const volverButton = screen.getByRole('button', { name: /volver al inicio/i });

    await act(async () => {
      await userEvent.click(volverButton);
    });

    expect(window.location.href).toBe('/');
  });

  test('navigates to register when clicking Inicia sesión', async () => {
    const registerButton = screen.getByRole('button', { name: /inicia sesión/i });

    await act(async () => {
      await userEvent.click(registerButton);
    });

    expect(window.location.href).toBe('/registro');
  });

  test('focuses on message container when it appears', async () => {
    const submitButton = screen.getByRole('button', { name: /ingresar/i });

    await act(async () => {
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      const mensajeContainer = screen.getByRole('region', { name: /polite/i });
      expect(mensajeContainer).toHaveFocus();
    });
  });
});