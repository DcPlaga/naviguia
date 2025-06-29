const express = require('express');
const router = express.Router();
const { registrarDiscapacitado } = require('../controllers/discapacitadoController');

router.post('/RegistroDiscapacitados', registrarDiscapacitado);

module.exports = router;
