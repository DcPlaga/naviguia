const Discapacitado = require('../models/Discapacitado');

exports.registrarDiscapacitado = async (req, res) => {
  try {
    const { nombre, apellido, correo, password } = req.body;
    if (!nombre || !apellido || !correo || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    const nuevo = new Discapacitado({ nombre, apellido, correo, password });
    await nuevo.save();
    res.json({ message: 'Has sido registrado correctamente!' });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar en la base de datos' });
  }
};
