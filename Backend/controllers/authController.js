const Discapacitado = require('../models/Discapacitado');
const Acompanante = require('../models/Acompanante');
const Conductor = require('../models/Conductor');

exports.login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    const user = await Discapacitado.findOne({ correo, password }) ||
                 await Acompanante.findOne({ correo, password }) ||
                 await Conductor.findOne({ correo, password });

    if (!user) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    res.json({ message: 'Login exitoso', user });
  } catch (error) {
    res.status(500).json({ message: 'Error en el inicio de sesión' });
  }
};
