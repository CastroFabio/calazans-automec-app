@echo off
title ATUALIZAÇÃO - Calazans Automec
color 0B

echo ========================================
echo   INICIANDO ATUALIZADOR DO SISTEMA
echo ========================================
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0atualizar_app.ps1"

echo.
pause