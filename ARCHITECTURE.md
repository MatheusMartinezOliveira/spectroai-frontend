# Arquitetura do Elarix AI

## 📐 Visão Geral

O Elarix AI é uma aplicação Electron dividida em três processos principais:

```
┌─────────────────────────────────────────────────────────────┐
│                      ELARIX AI                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │  Main Process  │  │   Preload   │  │ Renderer Process│  │
│  │   (Electron)   │◄─┤   Scripts   ├─►│     (React)     │  │
│  │                │  │             │  │                 │  │
│  │  - Gerencia    │  │  - API      │  │  - Interface    │  │
│  │    janelas     │  │    Bridge   │  │    do usuário   │  │
│  │  - IPC Handler │  │  - Security │  │  - Chat         │  │
│  │  - Sistema     │  │             │  │  - Configurações│  │
│  └────────────────┘  └─────────────┘  └─────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │   Backend API    │
                  │   (REST API)     │
                  └──────────────────┘
```

## 🏗️ Estrutura de Pastas

```
elarixai-electron/
│
├── src/
│   ├── main/                     # Processo principal do Electron
│   │   └── main.ts              # Gerenciamento de janelas e IPC
│   │
│   ├── preload/                  # Scripts de preload
│   │   └── preload.ts           # Bridge seguro entre main e renderer
│   │
│   ├── renderer/                 # Interface React
│   │   ├── components/          # Componentes da UI
│   │   │   ├── ExpandedView.tsx    # Modo expandido
│   │   │   ├── MiniView.tsx        # Modo minimizado
│   │   │   ├── VortexIcon.tsx      # Ícone animado
│   │   │   ├── TitleBar.tsx        # Barra de título
│   │   │   ├── Sidebar.tsx         # Menu lateral
│   │   │   ├── ChatView.tsx        # Interface de chat
│   │   │   └── SettingsView.tsx    # Configurações
│   │   │
│   │   ├── context/             # Contextos React
│   │   │   └── ThemeContext.tsx    # Gerenciamento de tema
│   │   │
│   │   ├── styles/              # Estilos CSS
│   │   │   ├── global.css          # Estilos globais e variáveis
│   │   │   ├── ExpandedView.css    # Estilos do modo expandido
│   │   │   ├── MiniView.css        # Estilos do modo minimizado
│   │   │   ├── VortexIcon.css      # Animações do vortex
│   │   │   ├── TitleBar.css        # Estilos da barra de título
│   │   │   ├── Sidebar.css         # Estilos do menu lateral
│   │   │   ├── ChatView.css        # Estilos do chat
│   │   │   └── SettingsView.css    # Estilos das configurações
│   │   │
│   │   ├── App.tsx              # Componente raiz
│   │   ├── index.tsx            # Entry point do React
│   │   └── index.html           # HTML base
│   │
│   └── types/                    # Definições TypeScript
│       └── electron.d.ts        # Types da API do Electron
│
├── dist/                         # Build output (gerado)
├── release/                      # Pacotes distribuíveis (gerado)
│
├── package.json                  # Dependências e scripts
├── tsconfig.json                # Config TypeScript base
├── tsconfig.main.json           # Config para main process
├── tsconfig.preload.json        # Config para preload
├── webpack.renderer.config.js   # Config Webpack para renderer
├── .gitignore                   # Arquivos ignorados
└── README.md                    # Documentação
```

## 🔄 Fluxo de Comunicação

### 1. Modo Minimizado → Expandido

```
Usuario clica no ícone
        │
        ▼
  MiniView.tsx (onClick)
        │
        ▼
  window.electronAPI.toggleMode()
        │
        ▼
  preload.ts (IPC Bridge)
        │
        ▼
  main.ts (IPC Handler)
        │
        ▼
  Esconde miniWindow
  Mostra mainWindow
```

### 2. Ativação por Voz

```
Usuario fala "AI" ou pressiona Ctrl+Space
        │
        ▼
  MiniView.tsx (handleVoiceActivation)
        │
        ▼
  Animação do Vortex ativa
        │
        ▼
  Captura áudio (futuro: Speech-to-Text)
        │
        ▼
  Envia para Backend API
        │
        ▼
  Recebe resposta
        │
        ▼
  Text-to-Speech (voz ativa)
```

### 3. Chat no Modo Expandido

```
Usuario digita mensagem
        │
        ▼
  ChatView.tsx (handleSendMessage)
        │
        ▼
  Adiciona mensagem à lista
        │
        ▼
  Envia para Backend API (futuro)
        │
        ▼
  Recebe resposta da IA
        │
        ▼
  Exibe resposta no chat
```

## 🎨 Sistema de Temas

### Tema Dark (Padrão)
- Background: `#0a0a0a`, `#1a1a1a`, `#2a2a2a`
- Texto: `#ffffff`, `#a0a0a0`
- Accent: `#00d9ff`, `#00a3cc`

### Tema Light
- Background: `#f0f0f0`, `#e0e0e0`, `#d0d0d0`
- Texto: `#0a0a0a`, `#5a5a5a`
- Accent: `#00b8d4`, `#0091a7`

### Neomorfismo
- Sombras suaves (light + dark)
- Bordas arredondadas
- Efeitos de profundidade
- Estados: raised, pressed, flat

## 🔌 IPC (Inter-Process Communication)

### Handlers Disponíveis

| Handler | Descrição | Retorno |
|---------|-----------|---------|
| `toggle-mode` | Alterna entre modos | `'expanded' \| 'minimized'` |
| `get-mode` | Retorna modo atual | `'expanded' \| 'minimized'` |
| `minimize-window` | Minimiza janela | `void` |
| `maximize-window` | Maximiza/restaura janela | `void` |
| `close-window` | Fecha janela (não sai) | `void` |
| `quit-app` | Encerra aplicação | `void` |
| `set-vortex-active` | Ativa animação vortex | `void` |

## 🚀 Próximas Integrações

### Backend API (REST)
```typescript
interface ElarixAPI {
  // Chat
  sendMessage(text: string): Promise<AIResponse>;
  sendAudio(blob: Blob): Promise<AIResponse>;
  
  // Integrações
  connectGoogleCalendar(): Promise<void>;
  getUpcomingMeetings(): Promise<Meeting[]>;
  sendEmail(to: string, subject: string, body: string): Promise<void>;
  sendWhatsApp(to: string, message: string): Promise<void>;
  
  // Workspace
  saveWorkspaceConfig(apps: App[]): Promise<void>;
  loadWorkspaceConfig(): Promise<App[]>;
  openWorkspace(): Promise<void>;
}
```

## 📊 Diagrama de Estados

```
┌─────────────┐
│  Iniciando  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Minimizado  │◄─────────────┐
└──────┬──────┘              │
       │                     │
       │ (click/toggle)      │
       ▼                     │
┌─────────────┐              │
│  Expandido  │──────────────┘
└──────┬──────┘   (close)
       │
       │ (chat)
       ▼
┌─────────────┐
│ Interagindo │
└─────────────┘
```

## 🔐 Segurança

- `contextIsolation: true` - Isola contexto do renderer
- `nodeIntegration: false` - Desabilita Node.js no renderer
- `preload` scripts - Única ponte segura entre processos
- API exposta via `contextBridge` - Controle total das APIs disponíveis

## 📈 Performance

- **Janelas separadas**: Main e Mini independentes
- **Lazy loading**: Componentes carregam sob demanda
- **CSS optimizado**: Animações via GPU (transform, opacity)
- **React optimizado**: Hooks, memo, callbacks

