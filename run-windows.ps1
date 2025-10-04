# Spectro AI - Script de Execução no Windows
# Execute este script no PowerShell do Windows enquanto o build roda no WSL

Write-Host "🚀 Spectro AI - Iniciando no Windows..." -ForegroundColor Cyan
Write-Host ""

# Verificar se Node.js está instalado
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "   Instale em: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar se Yarn está instalado
if (!(Get-Command yarn -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Yarn não encontrado. Instalando..." -ForegroundColor Yellow
    npm install -g yarn
}

Write-Host "✅ Node.js $(node -v)" -ForegroundColor Green
Write-Host "✅ Yarn $(yarn -v)" -ForegroundColor Green
Write-Host ""

# Verificar se node_modules existe
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    yarn install
    Write-Host ""
}

# Verificar se o build existe
if (!(Test-Path "dist/main.js")) {
    Write-Host "⚠️  Build não encontrado!" -ForegroundColor Yellow
    Write-Host "   Execute no WSL: yarn dev:build-only" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔨 Tentando buildar agora..." -ForegroundColor Yellow
    yarn build
    Write-Host ""
}

# Executar Electron
Write-Host "🎯 Iniciando Spectro AI..." -ForegroundColor Cyan
Write-Host "   Aguarde a janela abrir..." -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Dica: Deixe o 'yarn dev:build-only' rodando no WSL para hot reload!" -ForegroundColor Yellow
Write-Host ""

yarn start

