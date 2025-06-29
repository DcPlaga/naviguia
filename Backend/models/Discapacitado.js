const mongoose = require('mongoose');

const DiscapacitadoSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  correo: String,
  password: String
}, { collection: 'UsuariosDiscapacitados' });

module.exports = mongoose.model('UsuariosDiscapacitados', DiscapacitadoSchema);
