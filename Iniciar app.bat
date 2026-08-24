@echo off
title INICIANDO - Calazans Automec
color 0A

echo ========================================
echo     INICIANDO SISTEMA CALAZANS AUTOMEC
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Parando processos antigos (se houver)...
call pm2 delete all 2>nul

echo.
echo [2/4] Iniciando Backend...
cd /d "%~dp0backend"
call pm2 start dist/src/main.js --name "calazans-automec-back"

echo.
echo [3/4] Aguardando Backend ficar ativo no /health...
set MAX_RETRIES=50
set COUNT=0

:wait_loop
timeout /t 2 /nobreak >nul
curl -s -f http://localhost:3000/ >nul 2>&1

if %errorlevel% equ 0 (
    echo [OK] Backend respondeu com sucesso!
    goto start_front
)

set /a COUNT+=1
if %COUNT% geq %MAX_RETRIES% (
    echo [ERRO] Tempo limite atingido. O Backend nao respondeu no /health.
    pause
    exit /b 1
)

echo Aguardando Backend inicializar... (%COUNT%/%MAX_RETRIES%)
goto wait_loop

:start_front
echo.
echo [4/4] Iniciando Frontend...
cd /d "%~dp0frontend"
call pm2 serve dist 5173 --name "calazans-automec-front" --spa

echo.
echo ========================================
echo     SISTEMA RODANDO COM PM2!
echo     Frontend: http://localhost:5173
echo     Backend:  http://localhost:3000
echo ========================================
echo.

start http://localhost:5173
exit