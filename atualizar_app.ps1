# ========================================================
# CONFIGURAÇÕES DO PROJETO E REPOSITÓRIO GITHUB
# ========================================================
$REPO_URL = "https://github.com/SEU_USUARIO/SEU_REPOSITORIO/archive/refs/heads/main.zip" # Ajuste para seu link/branch
$PROJECT_DIR = "C:\Users\fmpc9\OneDrive\Área de Trabalho\Dockerfile"
$TEMP_DIR = Join-Path $PROJECT_DIR "temp_update"
$ZIP_PATH = Join-Path $PROJECT_DIR "update.zip"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ATUALIZANDO SISTEMA CALAZANS AUTOMEC   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Parar processos do PM2 para liberar os arquivos
Write-Host "[1/6] Parando servicos PM2 em execucao..." -ForegroundColor Yellow
call pm2 delete all 2>$null

# 2. Baixar a última versão do GitHub
Write-Host "[2/6] Baixando a ultima versao do GitHub..." -ForegroundColor Yellow
if (Test-Path $TEMP_DIR) { Remove-Item $TEMP_DIR -Recurse -Force }
if (Test-Path $ZIP_PATH) { Remove-Item $ZIP_PATH -Force }

Invoke-WebRequest -Uri $REPO_URL -OutFile $ZIP_PATH

# 3. Extrair arquivo ZIP baixado
Write-Host "[3/6] Extraindo o arquivo ZIP..." -ForegroundColor Yellow
Expand-Archive -Path $ZIP_PATH -DestinationPath $TEMP_DIR -Force

# Identificar a pasta extraída (o GitHub cria uma pasta com 'nome-repositorio-branch')
$EXTRACTED_FOLDER = Get-ChildItem -Path $TEMP_DIR | Where-Object { $_.PSIsContainer } | Select-Object -First 1

# 4. Substituir arquivos velhos pelos novos (preservando .env e node_modules)
Write-Host "[4/6] Substituindo arquivos e mantendo arquivos .env..." -ForegroundColor Yellow
Get-ChildItem -Path $EXTRACTED_FOLDER.FullName | ForEach-Object {
    $targetPath = Join-Path $PROJECT_DIR $_.Name
    
    # Se for diretório (ex: backend ou frontend), copia excluindo .env
    if ($_.PSIsContainer) {
        Copy-Item -Path "$($_.FullName)\*" -Destination $targetPath -Recurse -Force -Exclude ".env"
    } else {
        # Para arquivos da raiz, substitui diretamente
        Copy-Item -Path $_.FullName -Destination $PROJECT_DIR -Force
    }
}

# 5. Limpeza de arquivos temporários
Write-Host "[5/6] Removendo arquivos temporarios..." -ForegroundColor Yellow
Remove-Item $TEMP_DIR -Recurse -Force
Remove-Item $ZIP_PATH -Force

# 6. Atualizar dependências e rodar migrations do Prisma
Write-Host "[6/6] Atualizando dependencias e build do sistema..." -ForegroundColor Yellow

# Backend
Set-Location -Path "$PROJECT_DIR\backend"
call npm install
call npx prisma generate
call npx prisma migrate deploy
call npm run build

# Frontend
Set-Location -Path "$PROJECT_DIR\frontend"
call npm install
call npm run build

Set-Location -Path $PROJECT_DIR

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  SISTEMA ATUALIZADO COM SUCESSO!      " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""