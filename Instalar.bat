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
echo [2/5] Configurando Backend...
cd /d "%~dp0backend"
call npm install

if not exist .env (
    echo Criando .env do Backend...
    echo DATABASE_URL="postgresql://postgres:123@localhost:5432/calazans_automec_db?schema=public" > .env
)

echo.
echo [3/5] Aplicando Migrations e compilando Backend...
call npx prisma generate
call npx prisma migrate deploy
call npm run build

echo.
echo [4/5] Configurando Frontend...
cd /d "%~dp0frontend"
call npm install

if not exist .env (
    echo Criando .env do Frontend...
    echo VITE_API_URL=http://localhost:3000/ > .env
)

echo.
echo [5/5] Gerando Build do Frontend...
call npm run build

echo.
echo ========================================
echo    INSTALAÇÃO CONCLUÍDA COM SUCESSO!
echo    Agora execute Iniciar app.bat
echo ========================================
echo.
pause