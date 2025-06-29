const Discapacitado = require('../models/Discapacitado');
const Acompanante = require('../models/Acompanante');
const Conductor = require('../models/Conductor');

exports.verificarCorreo = async (req, res) => {
  const { correo } = req.query;

  try {
    const existeEnDiscapacitados = await Discapacitado.findOne({ correo });
    const existeEnAcompanantes = await Acompanante.findOne({ correo });
    const existeEnConductores = await Conductor.findOne({ correo });

    const existe = existeEnDiscapacitados || existeEnAcompanantes || existeEnConductores;

    res.json({ existe: !!existe });
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar el correo' });
  }
};
