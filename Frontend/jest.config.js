// jest.config.js
module.exports = {
  testEnvironment: 'jsdom', // Necesario para probar componentes React
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'], // Carga configuraciones adicionales después del entorno
};