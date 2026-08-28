@echo off
setlocal enabledelayedexpansion

:: ========================================================
:: CONFIGURAÇÕES DO BANCO DE DADOS E PASTA DE DESTINO
:: ========================================================
set PGUSER=postgres
set PGPASSWORD=123
set PGHOST=localhost
set PGPORT=5432
set DBNAME=calazans_automec_db

:: Pasta de destino
set BACKUP_DIR=D:\Programacao\calazans-automec-app\backend\backup

:: Caminho para o executavel pg_dump
set PGDUMP="C:\Program Files\PostgreSQL\18\bin\pg_dump.exe"

:: Número máximo de backups mantidos na pasta
set MAX_BACKUPS=5

:: ========================================================
:: GERAÇÃO DO NOME DO ARQUIVO COM DATA E HORA
:: ========================================================
for /f "delims=" %%a in ('powershell -Command "Get-Date -Format 'yyyyMMdd_HHmmss'"') do set TIMESTAMP=%%a

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

set FILE_NAME=%DBNAME%_%TIMESTAMP%.dump
set FULL_PATH=%BACKUP_DIR%\%FILE_NAME%

echo [%date% %time%] Iniciando backup de %DBNAME%...

:: ========================================================
:: EXECUÇÃO DO BACKUP
:: ========================================================
%PGDUMP% -h %PGHOST% -p %PGPORT% -U %PGUSER% -d %DBNAME% -F c -f "%FULL_PATH%"

if %ERRORLEVEL% EQU 0 (
    echo [%date% %time%] Backup realizado com sucesso: %FILE_NAME%
) else (
    echo [%date% %time%] ERRO ao realizar o backup!
    pause
    exit /b %ERRORLEVEL%
)

:: ========================================================
:: ROTAÇÃO: MANTER APENAS OS ÚLTIMOS 5 ARQUIVOS .dump
:: ========================================================
echo Limpando backups antigos (mantendo apenas os %MAX_BACKUPS% mais recentes)...

set COUNT=0
for /f "delims=" %%F in ('dir /b /a-d /o-d "%BACKUP_DIR%\*.dump"') do (
    set /a COUNT+=1
    if !COUNT! GT %MAX_BACKUPS% (
        echo Deletando backup antigo: %%F
        del /f /q "%BACKUP_DIR%\%%F"
    )
)

echo [%date% %time%] Processo concluido!
timeout /t 5