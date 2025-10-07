# 🐧 Guia: Rodando Elarix AI no Windows via WSL

## 🚨 O Problema

O Electron precisa de um servidor gráfico (X Server) para abrir janelas. O WSL não tem interface gráfica nativa, então o Electron não consegue abrir as janelas diretamente.

## ✅ Soluções Disponíveis

### **Opção 1: Usar WSLg (Recomendado - Windows 11)**

Se você tem **Windows 11**, o WSLg já vem instalado e funciona automaticamente!

#### Verificar se tem WSLg:
```bash
echo $DISPLAY
```
Se retornar algo como `:0` ou `:1`, você tem WSLg instalado.

#### Instalar dependências necessárias:
```bash
# No WSL
sudo apt update
sudo apt install -y libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils libatspi2.0-0 libdrm2 libgbm1 libasound2
```

#### Rodar o app:
```bash
cd /home/matheus/dev/copia_projeto_dueloia/elarixai-electron
yarn dev
```

---

### **Opção 2: Build no WSL + Rodar no Windows (Mais Simples)**

Esta é a opção **mais prática e que funciona sempre**!

#### 1️⃣ No WSL: Apenas compilar o código
```bash
cd /home/matheus/dev/copia_projeto_dueloia/elarixai-electron

# Deixa compilando em watch mode
yarn dev:build-only
```

#### 2️⃣ No Windows: Abrir PowerShell ou CMD
```powershell
# Navegar para a pasta (ajuste o caminho)
cd \\wsl$\Ubuntu\home\matheus\dev\copia_projeto_dueloia\elarixai-electron

# Instalar dependências (primeira vez)
yarn install

# Rodar o Electron
yarn start
```

**💡 Vantagem:** Você edita no WSL, compila no WSL, mas executa no Windows!

---

### **Opção 3: Usar VcXsrv (Windows 10)**

Se você usa Windows 10, precisa instalar um servidor X.

#### Passo 1: Instalar VcXsrv no Windows
1. Baixe: https://sourceforge.net/projects/vcxsrv/
2. Instale o VcXsrv
3. Execute "XLaunch" com estas configurações:
   - Display number: 0
   - Start no client
   - Disable access control: ✅ (marcar)

#### Passo 2: Configurar DISPLAY no WSL
```bash
# Adicione ao ~/.bashrc
echo 'export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk "{print \$2}"):0' >> ~/.bashrc
source ~/.bashrc
```

#### Passo 3: Instalar dependências
```bash
sudo apt update
sudo apt install -y libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils libatspi2.0-0 libdrm2 libgbm1 libasound2
```

#### Passo 4: Rodar o app
```bash
yarn dev
```

---

### **Opção 4: Desenvolvimento 100% no Windows**

A opção mais simples se você quer evitar problemas com WSL.

#### 1️⃣ Instalar no Windows:
- Node.js: https://nodejs.org/
- Yarn: `npm install -g yarn`

#### 2️⃣ Abrir PowerShell ou CMD:
```powershell
# Navegar para pasta do projeto
cd C:\caminho\para\elarixai-electron

# Instalar dependências
yarn install

# Rodar em desenvolvimento
yarn dev
```

---

## 🎯 Qual opção escolher?

| Situação | Solução Recomendada |
|----------|---------------------|
| Windows 11 + WSL | **Opção 1: WSLg** |
| Windows 10 + WSL | **Opção 2: Build no WSL + Rodar no Windows** |
| Quer simplicidade | **Opção 4: 100% no Windows** |
| Quer usar VcXsrv | **Opção 3: VcXsrv** |

---

## 🔧 Script Auxiliar (Opção 2)

Criei um script para facilitar! Veja o arquivo `run-windows.ps1` na raiz do projeto.

### Como usar:

**No WSL:**
```bash
yarn dev:build-only
```

**No Windows PowerShell:**
```powershell
.\run-windows.ps1
```

---

## 🐛 Troubleshooting

### Erro: "Cannot open display"
- **Solução:** Use a Opção 2 (build no WSL + executar no Windows)

### Erro: "libgtk-3.so.0: cannot open shared object file"
```bash
sudo apt install -y libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils libatspi2.0-0
```

### Janela não abre no Windows 11
```bash
# Verificar WSLg
echo $DISPLAY

# Se não retornar nada, atualizar WSL
# No PowerShell do Windows (como administrador):
wsl --update
wsl --shutdown
# Reiniciar o WSL
```

### DISPLAY vazio no Windows 10
```bash
# Adicionar ao ~/.bashrc
export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}'):0
source ~/.bashrc
```

---

## 📝 Notas Importantes

1. **Performance:** Rodar no Windows (Opção 2 ou 4) geralmente tem melhor performance
2. **Hot Reload:** Funciona em todas as opções
3. **DevTools:** Abre automaticamente para debug
4. **Logs:** Aparecem no terminal onde você rodou `yarn dev` ou `yarn start`

---

## 🆘 Ainda não funcionou?

Execute o comando de diagnóstico:

```bash
# No WSL
cd /home/matheus/dev/copia_projeto_dueloia/elarixai-electron
yarn build
yarn start

# Observe os logs no terminal - eles vão mostrar exatamente onde está o problema
```

Os logs agora incluem emojis e mensagens claras:
- 🚀 App iniciando
- 📱 Criando janelas
- ✅ Janela pronta
- ❌ Erros (se houver)

---

**Recomendação Final:** Use a **Opção 2** (Build no WSL + Executar no Windows). É a mais confiável! 🎯

