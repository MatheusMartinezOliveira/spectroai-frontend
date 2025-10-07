# 🚀 Guia de Início Rápido - Elarix AI

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- Yarn (gerenciador de pacotes)
- Windows, macOS ou Linux

## ⚡ Instalação e Execução

### 1. Instalar Dependências

```bash
cd /home/matheus/dev/copia_projeto_dueloia/elarixai-electron
yarn install
```

### 2. Iniciar em Modo Desenvolvimento

```bash
yarn dev
```

Este comando irá:
- Compilar o processo principal (main)
- Compilar o preload script
- Compilar a interface React (renderer)
- Iniciar o Electron automaticamente

### 3. Build de Produção

```bash
# Build completo
yarn build

# Executar build
yarn start

# Criar pacote distribuível
yarn package
```

## 🎮 Como Usar

### Modo Minimizado (Padrão)

Ao iniciar, o Elarix AI abre em **modo minimizado** com um ícone "vortex" no canto superior direito:

- **Click no ícone**: Expande para o modo completo
- **Ctrl+Space**: Ativa gravação de voz (animação do vortex)
- **Comando de voz**: "AI" ou "Elarix" (a implementar)

### Modo Expandido

Click no ícone minimizado para abrir a janela completa (800x800):

#### 1. Chat
- Digite mensagens no campo de entrada
- **Enter**: Envia mensagem
- **Shift+Enter**: Nova linha
- **Ícone de microfone**: Gravar áudio (a implementar)
- **Ícone de clip**: Anexar arquivo (a implementar)

#### 2. Configurações
Click no ícone de engrenagem na sidebar:

**Aba Integrações:**
- Google Agenda
- Google Meet
- E-mail
- WhatsApp
- Slack

**Aba Workspace Setup:**
- Configurar apps para abertura automática
- Salvar configurações de workspace

### Barra de Título

- **Ícone Sol/Lua**: Alterna entre tema Dark/Light
- **Minimizar**: Minimiza a janela
- **Maximizar**: Maximiza/restaura janela
- **Fechar (X)**: Volta para modo minimizado

## 🎨 Temas

### Tema Dark (Padrão)
Interface escura com accent em ciano brilhante.

### Tema Light
Interface clara com accent em ciano mais suave.

**Alternar**: Click no ícone de sol/lua na barra de título.

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl+Space` | Ativar gravação de voz (modo minimizado) |
| `Enter` | Enviar mensagem (no chat) |
| `Shift+Enter` | Nova linha (no chat) |

## 🔧 Estrutura de Scripts

```json
{
  "dev": "Modo desenvolvimento com hot reload",
  "build": "Build completo (main + preload + renderer)",
  "start": "Executar build de produção",
  "package": "Criar pacote distribuível",
  "build:main": "Compilar processo principal",
  "build:preload": "Compilar preload script",
  "build:renderer": "Compilar interface React"
}
```

## 📁 Arquivos Importantes

```
elarixai-electron/
├── src/
│   ├── main/main.ts           # Gerenciamento de janelas
│   ├── preload/preload.ts     # Bridge IPC seguro
│   └── renderer/
│       ├── App.tsx            # Componente raiz
│       ├── components/        # Componentes da UI
│       ├── context/           # Contextos (Theme)
│       └── styles/            # Estilos CSS
├── dist/                      # Build output
├── package.json               # Dependências
└── README.md                  # Documentação completa
```

## 🐛 Troubleshooting

### Erro: "Cannot find module 'electron'"

```bash
yarn install
```

### Janela não abre

Verifique se todos os processos foram compilados:
```bash
ls -la dist/
# Deve conter: main.js, preload/preload.js, renderer/
```

### Hot reload não funciona

1. Pare o processo (Ctrl+C)
2. Limpe o build:
```bash
rm -rf dist/
```
3. Reinicie:
```bash
yarn dev
```

### Erro de TypeScript

Verifique se todos os arquivos `.json` de configuração existem:
- `tsconfig.json`
- `tsconfig.main.json`
- `tsconfig.preload.json`

## 🔄 Próximos Passos

1. **Integração com Backend**
   - Implementar chamadas REST API
   - Configurar endpoints

2. **Reconhecimento de Voz**
   - Implementar Speech-to-Text
   - Ativar por palavra-chave

3. **Síntese de Voz**
   - Implementar Text-to-Speech
   - Resposta com voz ativa

4. **Workspace Setup**
   - Salvar apps abertos
   - Restaurar configurações

5. **Notificações**
   - Implementar notificações nativas
   - Alertas de reuniões e mensagens

## 📚 Documentação Adicional

- [README.md](./README.md) - Visão geral do projeto
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura detalhada
- [Electron Docs](https://www.electronjs.org/docs) - Documentação oficial
- [React Docs](https://react.dev/) - Documentação React

## 💡 Dicas

1. **Performance**: Use as DevTools do Chrome (F12 no modo expandido)
2. **Debug**: Adicione `console.log()` nos componentes React
3. **Logs**: Verifique o terminal onde rodou `yarn dev`
4. **Recarregar**: Ctrl+R na janela expandida recarrega a interface

## 🆘 Suporte

Em caso de dúvidas ou problemas:
1. Verifique os logs no terminal
2. Consulte a [documentação oficial do Electron](https://www.electronjs.org/)
3. Revise o arquivo [ARCHITECTURE.md](./ARCHITECTURE.md)

---

**Desenvolvido com ❤️ pela equipe Elarix AI**

