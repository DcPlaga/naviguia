@echo off
title NaviGuia - Deteniendo Proyecto
color 0C

echo ===============================================
echo          NAVIGUIA - DETENIENDO PROYECTO
echo ===============================================
echo.

echo Deteniendo procesos de Node.js...
taskkill /f /im node.exe >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Procesos de Node.js detenidos
) else (
    echo ⚠ No se encontraron procesos de Node.js ejecutándose
)

echo Deteniendo MongoDB...
taskkill /f /im mongod.exe >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ MongoDB detenido
) else (
    echo ⚠ No se encontró MongoDB ejecutándose
)

echo.
echo ===============================================
echo         TODOS LOS SERVICIOS DETENIDOS
echo ===============================================
echo.
pause
