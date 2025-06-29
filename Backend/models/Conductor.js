const mongoose = require('mongoose');

const ConductorSchema = new mongoose.Schema({
  nombreCompleto: String,
  documento: String,
  licenciaArchivo: String,
  placa: String,
  tipoVehiculo: String,
  soat: String,
  revision: String,
  telefono: String,
  correo: String,
  zona: String,
  password: String
}, { collection: 'UsuariosConductores' });

module.exports = mongoose.model('UsuariosConductores', ConductorSchema);
