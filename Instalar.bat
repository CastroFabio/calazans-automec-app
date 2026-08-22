@echo off
title INSTALAÇÃO - Calazans Automec
color 0E

echo ========================================
echo    INSTALANDO SISTEMA CALAZANS AUTOMEC
echo ========================================
echo.

echo [1/5] Instalando PM2 globalmente...
call npm install -g pm2

echo.
echo [2/5] Instalando dependências do Backend...
cd /d "%~dp0backend"
call npm install

echo.
echo [3/5] Gerando cliente Prisma...
call npx prisma generate

echo.
echo [4/5] Aplicando migrações no banco...
call npx prisma migrate dev --name init

echo.
echo [5/5] Instalando dependências do Frontend...
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