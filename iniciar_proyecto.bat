@echo off
title NaviGuia - Iniciando Proyecto
color 0A

echo ===============================================
echo          NAVIGUIA - INICIANDO PROYECTO
echo ===============================================
echo.

REM Verificar si Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js no está instalado o no está en el PATH
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si MongoDB está instalado
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: MongoDB no está instalado o no está en el PATH
    echo Por favor instala MongoDB desde https://www.mongodb.com/try/download/community
    pause
    exit /b 1
)

echo [1/5] Iniciando MongoDB...
start "MongoDB" mongod --noauth
timeout /t 3 >nul

echo [2/5] Instalando dependencias del Backend...
cd "%~dp0Backend"
if not exist node_modules (
    call npm install
)

echo [3/5] Iniciando Backend en puerto 4000...
start "Backend Server" cmd /k "node index.js"
timeout /t 3 >nul

echo [4/5] Instalando dependencias del Frontend...
cd "%~dp0Frontend"
if not exist node_modules (
    call npm install
)

echo [5/5] Iniciando Frontend en puerto 3000...
start "Frontend Server" cmd /k "npm start"

echo.
echo ===============================================
echo           PROYECTO INICIADO EXITOSAMENTE
echo ===============================================
echo.
echo Backend ejecutándose en: http://localhost:4000
echo Frontend ejecutándose en: http://localhost:3000
echo.
echo Esperando a que los servidores se inicien...
timeout /t 10 >nul

echo Abriendo aplicación en el navegador...
start http://localhost:3000

echo.
echo ===============================================
echo Para detener los servidores, cierra las ventanas
echo de "Backend Server" y "Frontend Server"
echo ===============================================
pause
