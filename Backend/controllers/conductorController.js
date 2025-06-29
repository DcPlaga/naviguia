const Conductor = require('../models/Conductor');

exports.registrarConductor = async (req, res) => {
  try {
    const fechaRevision = new Date(req.body.revision);
    const hoy = new Date();
    const haceUnAno = new Date();
    haceUnAno.setFullYear(hoy.getFullYear() - 1);
    const manana = new Date();
    manana.setDate(hoy.getDate() + 1);

    if (fechaRevision < haceUnAno || fechaRevision > manana) {
      return res.status(400).json({
        message: 'La fecha de revisión técnico-mecánica no es válida. Debe estar entre hace un año y mañana.'
      });
    }

    const datos = {
      nombreCompleto: req.body.nombreCompleto,
      documento: req.body.documento,
      licenciaArchivo: req.file ? req.file.filename : null,
      placa: req.body.placa,
      tipoVehiculo: req.body.tipoVehiculo,
      soat: req.body.soat,
      revision: req.body.revision,
      telefono: req.body.telefono,
      correo: req.body.correo,
      zona: req.body.zona,
      password: req.body.password
    };

    const nuevo = new Conductor(datos);
    await nuevo.save();
    res.json({ message: 'Conductor registrado con éxito' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al guardar conductor' });
  }
};
