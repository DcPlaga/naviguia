const mongoose = require('mongoose');

const AcompananteSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  correo: String,
  zona: String,
  experiencia: String,
  horarios: String,
  password: String
}, { collection: 'UsuariosAcompanantes' });

module.exports = mongoose.model('UsuariosAcompanantes', AcompananteSchema);
