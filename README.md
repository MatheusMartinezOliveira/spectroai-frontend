# Spectro AI - Assistente IA Desktop

Spectro AI é um assistente IA desktop desenvolvido em Electron que auxilia profissionais no dia a dia com automações inteligentes, integrações com ferramentas de produtividade e pré-configurações para agilizar o setup do Windows.

## 🚀 Funcionalidades

### Dois Modos de Interface

**Modo Minimizado:**
- Ícone "vortex" no canto superior direito da tela
- Sempre em escuta aguardando comandos de voz
- Ativação por voz ("AI" ou "Spectro") ou Ctrl+Space
- Animação visual durante gravação

**Modo Expandido:**
- Janela 800x800 com interface completa
- Chat interativo com IA (mensagens, áudio, arquivos)
- Configurações de integrações
- Setup de workspace personalizado

### Integrações
- Google Agenda
- Google Meet
- E-mail
- WhatsApp (API Baileys)
- Slack

### Recursos Especiais
- **Workspace Setup**: Salve e restaure automaticamente todos os seus aplicativos abertos
- **Tema Dark/Light**: Design neomórfico moderno com cores preto e ciano
- **Notificações em Tempo Real**: Alertas sobre reuniões, e-mails e mensagens
- **Comandos de Voz**: Interaja naturalmente com seu assistente

## 🛠️ Tecnologias

- **Electron**: Framework para aplicação desktop
- **React**: Interface de usuário
- **TypeScript**: Tipagem estática
- **Yarn**: Gerenciador de pacotes

## 📦 Instalação

```bash
# Clone o repositório
git clone <repository-url>

# Entre no diretório
cd spectroai-electron

# Instale as dependências
yarn install
```

## 🏃‍♂️ Executando

### 💻 No Windows (Nativo)
```bash
# Modo desenvolvimento
yarn dev

# Build
yarn build

# Executar build
yarn start

# Criar pacote distribuível
yarn package
```

### 🐧 No WSL (Windows Subsystem for Linux)

**⚠️ IMPORTANTE:** O Electron precisa de interface gráfica. Veja o guia completo: [WSL-GUIDE.md](./WSL-GUIDE.md)

**Opção Recomendada - Build no WSL + Executar no Windows:**

1. **No WSL** - Deixe compilando:
```bash
yarn dev:build-only
```

2. **No Windows PowerShell** - Execute:
```powershell
cd \\wsl$\Ubuntu\home\matheus\dev\copia_projeto_dueloia\spectroai-electron
.\run-windows.ps1
```

📖 **Mais opções:** Consulte [WSL-GUIDE.md](./WSL-GUIDE.md) para outras formas de rodar (WSLg, VcXsrv, etc)

## 🎨 Design

O design segue princípios de:
- **Minimalismo**: Interface limpa e focada
- **Neomorfismo**: Elementos com sombras suaves e profundidade
- **Cores**: Preto (#0a0a0a) e Ciano (#00d9ff) como cores principais
- **Temas**: Suporte completo a dark e light mode

## 📁 Estrutura do Projeto

```
spectroai-electron/
├── src/
│   ├── main/           # Processo principal do Electron
│   ├── preload/        # Scripts de preload
│   ├── renderer/       # Interface React
│   │   ├── components/ # Componentes React
│   │   ├── context/    # Contextos (Theme, etc)
│   │   ├── styles/     # Arquivos CSS
│   │   └── types/      # Definições TypeScript
│   └── types/          # Types globais
├── dist/               # Build output
└── package.json
```

## 🔑 Atalhos

- **Ctrl+Space**: Ativar gravação de voz (modo minimizado)
- **Click no ícone**: Alternar entre modo minimizado/expandido

## 🔄 Próximos Passos

- [ ] Integração com back-end via REST API
- [ ] Implementação de reconhecimento de voz (Speech-to-Text)
- [ ] Síntese de voz (Text-to-Speech)
- [ ] Sistema de plugins para integrações
- [ ] Workspace Setup completo
- [ ] Notificações nativas do Windows
- [ ] Inicialização automática com o sistema

## 📄 Licença

MIT

---

Desenvolvido com ❤️ pela equipe Spectro AI

