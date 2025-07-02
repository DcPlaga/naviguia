# NaviGuia - Instrucciones de Arranque Automático

## 📋 Prerequisitos

Antes de ejecutar el proyecto, asegúrate de tener instalados:

1. **Node.js** (versión 14 o superior)
   - Descarga desde: https://nodejs.org/
   - Verifica la instalación con: `node --version`

2. **MongoDB Community Edition**
   - Descarga desde: https://www.mongodb.com/try/download/community
   - Verifica la instalación con: `mongod --version`

## 🚀 Cómo Usar

### Iniciar el Proyecto
1. Haz doble clic en `iniciar_proyecto.bat`
2. El script automáticamente:
   - ✅ Verificará que Node.js y MongoDB estén instalados
   - ✅ Iniciará MongoDB
   - ✅ Instalará dependencias del Backend (si es necesario)
   - ✅ Iniciará el servidor Backend en puerto 4000
   - ✅ Instalará dependencias del Frontend (si es necesario)
   - ✅ Iniciará el servidor Frontend en puerto 3000
   - ✅ Abrirá automáticamente la aplicación en tu navegador

### Detener el Proyecto
1. Haz doble clic en `detener_proyecto.bat`
2. O simplemente cierra las ventanas de "Backend Server" y "Frontend Server"

## 🌐 URLs de Acceso

- **Frontend (Aplicación Web)**: http://localhost:3000
- **Backend (API)**: http://localhost:4000

## ⚠️ Solución de Problemas

### Error: "Node.js no está instalado"
- Instala Node.js desde https://nodejs.org/
- Reinicia tu computadora después de la instalación

### Error: "MongoDB no está instalado"
- Instala MongoDB Community Edition
- Asegúrate de que MongoDB esté en el PATH del sistema

### Puerto ocupado
- Si ves errores de puerto ocupado, ejecuta `detener_proyecto.bat` primero
- O reinicia tu computadora para liberar todos los puertos

### Problemas de dependencias
- Elimina las carpetas `node_modules` en Backend y Frontend
- Ejecuta `iniciar_proyecto.bat` nuevamente para reinstalar dependencias

## En ultima instancia puedes ejecutar el proyecto de la siguiente forma:
- Inicia el backend en una terminal con los siguientes comandos:
   cd Backend
   node index.js
- En una nueva terminal el frontend:
   cd Frontend
   npm start

## 📁 Estructura del Proyecto
```
Proyecto Desarrollo 1/
├── Backend/                 # Servidor Node.js (Puerto 4000)
│   ├── controllers/         # Controladores de la API
│   ├── models/             # Modelos de MongoDB
│   ├── middlewares/        # Verificador de Token JWT
│   ├── routes/             # Rutas de la API
│   ├── uploads/            # Archivos subidos
│   ├── db.js               # Conexion a la base de datos
│   ├── index.js            # Archivo principal del servidor
│   └── package.json        # Dependencias del backend
├── Frontend/               # Aplicación React (Puerto 3000)
│   ├── public/            # Archivos públicos
│   ├── src/               # Código fuente de React
│   └── package.json       # Dependencias del frontend
├── iniciar_proyecto.bat    # Script de arranque automático
├── detener_proyecto.bat    # Script para detener servicios
└── INSTRUCCIONES_ARRANQUE.md # Instrucciones para iniciar la app web
```

## 💡 Consejos

- La primera ejecución puede tardar más tiempo debido a la instalación de dependencias
- Mantén las ventanas de "Backend Server" y "Frontend Server" abiertas mientras uses la aplicación
- Los cambios en el Frontend se reflejan automáticamente (Hot Reload)
- NO mover los archivos "inicar_proyecto.bat" y "detener_proyecto.bat" de la carpeta "Proyecto Desarrollo 1"
  para evitar problemas al iniciar el proyecto.

## 🆘 Soporte

Si tienes problemas:
1. Verifica que Node.js y MongoDB estén correctamente instalados
2. Ejecuta `detener_proyecto.bat` y luego `iniciar_proyecto.bat` nuevamente
3. Revisa las ventanas de "Backend Server" y "Frontend Server" para mensajes de error
