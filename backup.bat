@echo off
:: 1. Altera a codificação do terminal para UTF-8 (Resolve o problema de acentos)
chcp 65001 > nul

:: 2. Configura a senha do banco para o script não pedir digitação

:: 3. Define as variáveis do banco e das pastas
set PG_PATH="C:\Program Files\PostgreSQL\18\bin\pg_dump.exe"
set DB_NAME=calazans_automec_db
set DB_USER=postgres
::set BACKUP_DIR=D:\GoogleDrive\Backup_Mecanica
set BACKUP_DIR=D:\Gravações

:: 4. Cria o nome do arquivo com a data de hoje (Ex: backup*2026_08_21.sql)
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set DATE_STR=%datetime:~0,4%*%datetime:~4,2%_%datetime:~6,2%
set FILE_NAME=%BACKUP_DIR%\backup_%DATE_STR%.sql

:: 5. Executa o backup forçando a codificação UTF-8 na saída
%PG_PATH% -U %DB_USER% -h localhost -F p -b -v -E UTF8 -f "%FILE_NAME%" %DB_NAME%

:: 6. Limpa a senha da memória por segurança
set PGPASSWORD=