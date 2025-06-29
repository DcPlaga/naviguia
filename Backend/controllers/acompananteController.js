const Acompanante = require('../models/Acompanante');

exports.registrarAcompanante = async (req, res) => {
  try {
    const nuevo = new Acompanante(req.body);
    await nuevo.save();
    res.json({ message: 'Acompañante registrado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar acompañante' });
  }
};
