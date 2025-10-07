# ⚡ Início Rápido - Elarix AI no WSL

## 🎯 Solução Mais Simples (Recomendada)

### Passo 1: No WSL (Terminal Atual) 🐧
```bash
cd /home/matheus/dev/copia_projeto_dueloia/elarixai-electron

# Deixa compilando (não feche este terminal)
yarn dev:build-only
```

**✅ Pronto!** Deixe este terminal aberto. Ele vai recompilar automaticamente quando você editar arquivos.

---

### Passo 2: No Windows (Abra PowerShell) 💻

Opção A - **Usando o Script Automático:**
```powershell
# Navegue até a pasta (copie e cole)
cd \\wsl$\Ubuntu\home\matheus\dev\copia_projeto_dueloia\elarixai-electron

# Execute o script
.\run-windows.ps1
```

Opção B - **Manual:**
```powershell
# Navegue até a pasta
cd \\wsl$\Ubuntu\home\matheus\dev\copia_projeto_dueloia\elarixai-electron

# Instale dependências (primeira vez)
yarn install

# Execute o app
yarn start
```

---

## 🖼️ O que vai acontecer:

1. Uma janela **pequena com ícone vortex** vai aparecer no canto superior direito
2. **Click no ícone** para expandir e ver a interface completa
3. Você pode alternar entre os modos clicando no ícone

---

## 🔄 Workflow de Desenvolvimento

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  WSL Terminal (Esquerda)    │   Windows (Direita)      │
│  ─────────────────────────────────────────────────────  │
│                              │                          │
│  $ yarn dev:build-only       │   > yarn start          │
│                              │                          │
│  [Compilando...]             │   [Janela do Electron]  │
│  ✅ Compilado!               │   🎯 App rodando        │
│                              │                          │
│  [Detecta mudança]           │   [Hot reload           │
│  ✅ Recompilado!             │    automático]          │
│                              │                          │
└─────────────────────────────────────────────────────────┘
```

**Vantagens:**
- ✅ Edita código no WSL
- ✅ Compila no WSL (rápido)
- ✅ Executa no Windows (sem problemas de display)
- ✅ Hot reload funciona!

---

## 🐛 Problemas Comuns

### ❌ "yarn: command not found" no Windows
**Solução:**
```powershell
npm install -g yarn
```

### ❌ "Cannot find module 'electron'"
**Solução:**
```powershell
# No PowerShell do Windows
yarn install
```

### ❌ Janela não abre
**Verificar:** O build está completo?
```bash
# No WSL, verificar se existe:
ls -la dist/main.js
ls -la dist/preload/preload.js
ls -la dist/renderer/index.html
```

Se faltar algum arquivo:
```bash
yarn build
```

### ❌ Muitos erros no terminal WSL
**Isso é normal!** O Electron está tentando abrir no WSL mas não consegue. **Ignore esses erros** e execute no Windows como mostrado acima.

---

## 📊 Logs Úteis

Quando você rodar `yarn start` no Windows, vai ver:

```
🚀 Elarix AI iniciando...
📁 Diretório: C:\...\dist
🖥️ Plataforma: win32
⏳ Aguardando Electron ficar pronto...
✨ Electron app pronto!
🎯 Criando janelas...
📱 Criando janela principal...
🔷 Criando janela minimizada...
✅ Janela minimizada pronta e visível!
```

---

## 🎨 Interface

### Modo Minimizado (inicial):
- Ícone **vortex** no canto superior direito
- **Click** = Expande para modo completo

### Modo Expandido:
- Janela 800x800
- **Chat** = Conversar com IA
- **Configurações** = Integrações e workspace
- **Ícone Sol/Lua** = Trocar tema dark/light

---

## ⚡ Comandos Rápidos

```bash
# No WSL
yarn dev:build-only    # Compila e fica observando mudanças
yarn build             # Build único (sem watch)

# No Windows PowerShell
yarn start             # Executa o app
yarn package           # Cria instalador
```

---

## 💡 Dica Pro

Mantenha **2 terminais abertos**:

1. **WSL Terminal** → `yarn dev:build-only`
2. **Windows PowerShell** → `yarn start`

Assim você tem hot reload funcionando perfeitamente! Edite, salve, e as mudanças aparecem automaticamente.

---

## 🆘 Ainda com problemas?

Consulte o guia completo com outras opções: [WSL-GUIDE.md](./WSL-GUIDE.md)

Ou execute o diagnóstico:
```bash
# No WSL
cd /home/matheus/dev/copia_projeto_dueloia/elarixai-electron
yarn build
echo "✅ Se chegou aqui, o build está OK!"
```

---

**🎯 Resumindo:** Build no WSL, Execute no Windows = Funciona sempre! ✨

