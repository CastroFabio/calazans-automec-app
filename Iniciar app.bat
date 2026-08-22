@echo off
title INICIANDO - Calazans Automec
color 0A

echo ========================================
echo    INICIANDO SISTEMA CALAZANS AUTOMEC
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Parando processos antigos (se houver)...
call pm2 delete all 2>nul

echo.
echo [2/3] Iniciando Backend...
cd /d "%~dp0backend"
call pm2 start dist/src/main.js --name "calazans-automec-back"

echo.
echo [3/3] Iniciando Frontend...
cd /d "%~dp0frontend"
call pm2 serve dist 5173 --name "calazans-automec-front" --spa

echo.
echo ========================================
echo    SISTEMA RODANDO COM PM2!
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:3000
echo ========================================
echo.

start http://localhost:5173
exit