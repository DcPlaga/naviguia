const express = require('express');
const router = express.Router();
const { registrarAcompanante } = require('../controllers/acompananteController');

router.post('/RegistroAcompanantes', registrarAcompanante);

module.exports = router;
