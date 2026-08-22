@echo off
title REINICIANDO - Calazans Automec
color 0E

echo ========================================
echo    REINICIANDO SISTEMA CALAZANS AUTOMEC
echo ========================================
echo.

cd /d "%~dp0"

echo Reiniciando todos os processos...
call pm2 restart all

echo.
echo ========================================
echo    SISTEMA REINICIADO!
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:3000
echo ========================================
echo.
pause