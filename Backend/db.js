const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/NaviGuiaApp', {
      useNewUrlParser: true,
    });
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error('Error de conexión a MongoDB:', err);
  }
};

module.exports = conectarDB;
