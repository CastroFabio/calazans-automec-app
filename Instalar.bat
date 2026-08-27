@echo off
title INSTALAÇÃO - Calazans Automec
color 0E

echo ========================================
echo    INSTALANDO SISTEMA CALAZANS AUTOMEC
echo ========================================
echo.

echo [1/6] Instalando PM2 globalmente...
call npm install -g pm2

echo.
echo [2/6] Instalando dependências do Backend...
cd /d "%~dp0backend"
call npm install

echo.
echo [3/6] Gerando cliente Prisma e aplicando Migrations...
call npx prisma generate
call npx prisma migrate deploy

echo.
echo [4/6] Compilando o Backend...
call npm run build

echo.
echo [5/6] Instalando dependências do Frontend...
cd /d "%~dp0frontend"
call npm install

echo.
echo [6/6] Buildando o Frontend...
call npm run build

echo.
echo ========================================
echo    INSTALAÇÃO CONCLUÍDA COM SUCESSO!
echo    Agora execute INICIAR.bat
echo ========================================
echo.
pause