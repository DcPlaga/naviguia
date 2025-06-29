const express = require('express');
const cors = require('cors');
const conectarDB = require('./db');
const path = require('path');

// Rutas
const discapacitadoRoutes = require('./routes/discapacitadoRoutes');
const acompananteRoutes = require('./routes/acompananteRoutes');
const conductorRoutes = require('./routes/conductorRoutes');
const authRoutes = require('./routes/authRoutes');
const verificacionRoutes = require('./routes/verificacionRoutes');

const app = express();
const PORT = 4000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexión a la base de datos
conectarDB();

// Uso de rutas
app.use('/api', discapacitadoRoutes);
app.use('/api', acompananteRoutes);
app.use('/api', conductorRoutes);
app.use('/api', authRoutes);
app.use('/api', verificacionRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
