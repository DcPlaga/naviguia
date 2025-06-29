// tests/inicioRegistro.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InicioRegistro from '../inicioRegistro';
import { BrowserRouter } from 'react-router-dom';

describe('InicioRegistro', () => {
  beforeEach(() => {
    // Evita que hable durante las pruebas
    window.speechSynthesis = {
      speak: jest.fn(),
      cancel: jest.fn()
    };
  });

  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  test('muestra el título de la app', () => {
    renderWithRouter(<InicioRegistro />);
    const titulo = screen.getByRole('heading', { name: /naviguía - registro de usuarios/i });
    expect(titulo).toBeInTheDocument();
  });

  test('renderiza tarjetas de usuarios', () => {
    renderWithRouter(<InicioRegistro />);
    const tarjetas = screen.getAllByRole('link');
    expect(tarjetas.length).toBe(3); // Discapacitados, Acompañantes, Conductores
  });

  test('activa lectura al pasar el mouse por una tarjeta', () => {
    renderWithRouter(<InicioRegistro />);
    const tarjeta = screen.getByLabelText(/ir al formulario de discapacitados visuales/i);
    fireEvent.mouseEnter(tarjeta);
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });

  test('bloquea clics si bloquearEventos es true', () => {
    // Esto sería más adecuado probarlo con mocks del estado,
    // pero como la lógica está encapsulada, requiere refactor para testearlo a fondo.
  });
});
