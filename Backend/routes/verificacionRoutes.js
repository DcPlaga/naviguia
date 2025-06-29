const express = require('express');
const router = express.Router();
const { verificarCorreo } = require('../controllers/verificacionController');

router.get('/verificar-correo', verificarCorreo);

module.exports = router;
