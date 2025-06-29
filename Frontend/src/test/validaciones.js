import {
  coincidenContraseñas,
  esCorreoValido,
  esNombreValido,
  esFechaEnRango
} from '../utils/validaciones';

describe('Validaciones de campos', () => {
  test('coincidenContraseñas funciona correctamente', () => {
    expect(coincidenContraseñas('123', '123')).toBe(true);
    expect(coincidenContraseñas('abc', 'xyz')).toBe(false);
  });

  test('esCorreoValido reconoce correos válidos e inválidos', () => {
    expect(esCorreoValido('nombre@dominio.com')).toBe(true);
    expect(esCorreoValido('correo sin @')).toBe(false);
  });

  test('esNombreValido detecta nombres reales', () => {
    expect(esNombreValido('Pedro')).toBe(true);
    expect(esNombreValido(' Ana María')).toBe(false);
    expect(esNombreValido('1234')).toBe(false);
  });

  test('esFechaEnRango valida fechas entre límites', () => {
    const hoy = new Date();
    const min = new Date(hoy.getFullYear() - 1, hoy.getMonth(), hoy.getDate()).toISOString().split('T')[0];
    const max = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1).toISOString().split('T')[0];

    expect(esFechaEnRango('2020-01-01', min, max)).toBe(false);
    expect(esFechaEnRango(max, min, max)).toBe(true);
  });
});
