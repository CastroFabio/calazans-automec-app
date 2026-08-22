@echo off
title Calazans Automec - Backend

echo ========================================
echo 🚗 Iniciando Backend em segundo plano...
echo ========================================
echo.

cd backend

:: Executa em segundo plano sem abrir janela
start /B npm run start:dev

echo ✅ Backend iniciado em segundo plano!
echo.
echo Pressione qualquer tecla para fechar...
pause >nul