@echo off
title DESENVOLVIMENTO - Calazans Automec
color 0B

echo ========================================
echo   MODO DESENVOLVIMENTO - CALAZANS AUTOMEC
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Iniciando Backend em modo Dev...
start "Backend Dev - Calazans" cmd /k "cd /d "%~dp0backend" && npm run start:dev"

echo [2/2] Iniciando Frontend em modo Dev...
start "Frontend Dev - Calazans" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================
echo   Janelas do Frontend e Backend abertas!
echo ========================================
echo.

timeout /t 3 >nul
exit