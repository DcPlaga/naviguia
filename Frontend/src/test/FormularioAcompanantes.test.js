import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { useNavigate } from 'react-router-dom';
import FormularioAcompanantes from '../formularios/RegistroAcompanantes.jsx';
import { verificarCorreo } from '../utils/verificarCorreo';

// Mockeamos useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mockeamos verificarCorreo
jest.mock('../utils/verificarCorreo', () => ({
  verificarCorreo: jest.fn(),
}));

// Mockeamos window.location.href
Object.defineProperty(window, 'location', {
  value: { href: '' },
  writable: true,
});

describe('FormularioAcompanantes Component', () => {
  let mockNavigate;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    verificarCorreo.mockImplementation((correo, setCorreoExistente, setValidandoCorreo) => {
      setValidandoCorreo(false);
      setCorreoExistente(false);
    });
    render(<FormularioAcompanantes />);
  });

  test('renders form with all elements', async () => {
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /formulario de registro/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/zona de disponibilidad/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/experiencia en acompañamiento/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/horarios disponibles/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /inicia sesión/i })).toBeInTheDocument();
    });
  });

  test('updates form inputs and select correctly', async () => {
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/nombre/i), 'Juan');
      await userEvent.type(screen.getByLabelText(/apellido/i), 'Pérez');
      await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'juan@example.com');
      await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123');
      await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), 'password123');
      await userEvent.type(screen.getByLabelText(/zona de disponibilidad/i), 'Centro');
      await userEvent.selectOptions(screen.getByLabelText(/experiencia en acompañamiento/i), 'sí');
      await userEvent.type(screen.getByLabelText(/horarios disponibles/i), '9-17');
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/nombre/i)).toHaveValue('Juan');
      expect(screen.getByLabelText(/apellido/i)).toHaveValue('Pérez');
      expect(screen.getByLabelText(/correo electrónico/i)).toHaveValue('juan@example.com');
      expect(screen.getByLabelText(/contraseña/i)).toHaveValue('password123');
      expect(screen.getByLabelText(/confirmar contraseña/i)).toHaveValue('password123');
      expect(screen.getByLabelText(/zona de disponibilidad/i)).toHaveValue('Centro');
      expect(screen.getByLabelText(/experiencia en acompañamiento/i)).toHaveValue('sí');
      expect(screen.getByLabelText(/horarios disponibles/i)).toHaveValue('9-17');
    });
  });

  test('shows error if email is already registered', async () => {
    verificarCorreo.mockImplementation((correo, setCorreoExistente, setValidandoCorreo) => {
      setValidandoCorreo(false);
      setCorreoExistente(true);
    });

    await act(async () => {
      await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'existente@example.com');
    });

    await waitFor(() => {
      expect(screen.getByText(/este correo ya está registrado/i)).toBeInTheDocument();
    });

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /registrarse/i }));
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Este correo ya está registrado. Por favor usa otro.');
    });
  });

  test('shows error and focuses password field if passwords do not match', async () => {
    const passwordInput = screen.getByLabelText(/contraseña/i);

    await act(async () => {
      await userEvent.type(passwordInput, 'password123');
      await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), 'different123');
      await userEvent.click(screen.getByRole('button', { name: /registrarse/i }));
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Las contraseñas no coinciden.');
      expect(passwordInput).toHaveFocus();
    });
  });

  test('submits form successfully and navigates to login', async () => {
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/nombre/i), 'Juan');
      await userEvent.type(screen.getByLabelText(/apellido/i), 'Pérez');
      await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'juan@example.com');
      await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123');
      await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), 'password123');
      await userEvent.type(screen.getByLabelText(/zona de disponibilidad/i), 'Centro');
      await userEvent.selectOptions(screen.getByLabelText(/experiencia en acompañamiento/i), 'sí');
      await userEvent.type(screen.getByLabelText(/horarios disponibles/i), '9-17');
      await userEvent.click(screen.getByRole('button', { name: /registrarse/i }));
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(screen.getByLabelText(/nombre/i)).toHaveValue('');
      expect(screen.getByLabelText(/correo electrónico/i)).toHaveValue('');
    });
  });

  test('navigates to login when clicking Inicia sesión', async () => {
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /inicia sesión/i }));
    });

    await waitFor(() => {
      expect(window.location.href).toBe('/login');
    });
  });

  test('handles API error gracefully', async () => {
    const { server } = require('../mocks/server');
    server.use(
      rest.post('http://localhost:4000/api/RegistroAcompanantes', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    jest.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      await userEvent.type(screen.getByLabelText(/nombre/i), 'Juan');
      await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'juan@example.com');
      await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123');
      await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), 'password123');
      await userEvent.click(screen.getByRole('button', { name: /registrarse/i }));
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error al registrar acompañante');
    });

    console.error.mockRestore();
  });
});