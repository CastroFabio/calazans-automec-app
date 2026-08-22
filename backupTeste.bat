@echo off
chcp 65001 >nul
title Backup PostgreSQL - UTF-8

echo ========================================
echo 🗄️ Backup do Banco de Dados (UTF-8)
echo ========================================
echo.

:: ========== CONFIGURAÇÕES ==========
set DB_USER=postgres
set DB_NAME=calazans_automec_db
set DB_HOST=localhost
set DB_PORT=5432
set PGPASSWORD=123

:: ========== PASTA DE BACKUP ==========
set BACKUP_DIR=D:\Gravações
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

:: ========== NOME DO ARQUIVO ==========
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-3 delims=: " %%a in ('time /t') do (set mytime=%%a%%b)
set BACKUP_FILE=%BACKUP_DIR%\backup_%mydate%_%mytime%.sql

echo 📁 Pasta: %BACKUP_DIR%
echo 📄 Arquivo: %BACKUP_FILE%
echo.

:: ========== FAZER BACKUP ==========
echo [1/2] Realizando backup com encoding UTF-8...
echo.

:: ✅ FORÇAR UTF-8 NO PG_DUMP
pg_dump -U %DB_USER% -h %DB_HOST% -p %DB_PORT% -d %DB_NAME% -E UTF8 > "%BACKUP_FILE%"

if %errorlevel% equ 0 (
    echo ✅ Backup realizado com sucesso!
) else (
    echo ❌ Erro ao realizar backup!
    pause
    exit /b 1
)

:: ========== CONVERTER PARA UTF-8 (SE NECESSÁRIO) ==========
echo [2/2] Verificando codificacao...
echo.

:: Verificar se o arquivo está em UTF-8 com BOM
findstr /b /c:"ï»¿" "%BACKUP_FILE%" >nul
if %errorlevel% neq 0 (
    echo Adicionando BOM UTF-8...
    powershell -Command "[System.IO.File]::WriteAllText('%BACKUP_FILE%', [System.IO.File]::ReadAllText('%BACKUP_FILE%', [System.Text.Encoding]::UTF8), [System.Text.UTF8Encoding]::new($true))"
)

echo.
echo ========================================
echo ✅ Backup concluído!
echo ========================================
echo.
echo 📄 Arquivo: %BACKUP_FILE%
echo.
pause