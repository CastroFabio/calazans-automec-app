@echo off
title PARANDO - Calazans Automec
color 0C

echo ========================================
echo    PARANDO SISTEMA CALAZANS AUTOMEC
echo ========================================
echo.

cd /d "%~dp0"

echo Parando todos os processos...
call pm2 stop all

echo.
echo Salvando estado para próximo boot...
call pm2 save

echo.
echo ========================================
echo    SISTEMA PARADO COM SUCESSO!
echo ========================================
echo.
pause