#!/bin/bash
# Script para executar no Windows a partir do WSL

echo "🚀 Spectro AI - Preparando para executar no Windows..."
echo ""

# Compilar o projeto
echo "🔨 Compilando projeto..."
yarn build

if [ $? -ne 0 ]; then
    echo "❌ Erro ao compilar o projeto!"
    exit 1
fi

echo ""
echo "✅ Compilação concluída!"
echo ""
echo "📋 Agora execute no PowerShell do Windows:"
echo ""
echo "   cd \\\\wsl\$\\Ubuntu\\home\\matheus\\dev\\copia_projeto_dueloia\\spectroai-electron"
echo "   yarn install"
echo "   yarn start"
echo ""
echo "Ou use o script PowerShell:"
echo ""
echo "   .\\run-windows.ps1"
echo ""

