# Workspace Setup - Guia de Uso

## 📋 Visão Geral

O **Workspace Setup** é uma funcionalidade do Elarix AI que permite criar e gerenciar múltiplos setups de aplicativos, possibilitando iniciar automaticamente todos os seus programas favoritos com um único clique.

## ✨ Recursos

- ✅ Criar múltiplos setups personalizados
- ✅ Salvar aplicativos abertos atualmente
- ✅ Iniciar todos os apps de um setup automaticamente
- ✅ Editar setups existentes
- ✅ Excluir setups que não são mais necessários
- ✅ Feedback em tempo real durante a inicialização dos apps
- ✅ Verificação automática de apps já em execução
- ✅ Armazenamento local (preparado para integração futura com backend)

## 🚀 Como Usar

### 1. Acessar o Workspace Setup

1. Abra o Elarix AI
2. Vá para **Configurações** (ícone de engrenagem)
3. Clique na aba **Workspace Setup**
4. Clique em **Abrir Workspace Setup**

### 2. Criar um Novo Setup

1. Clique em **Criar Novo Setup**
2. Digite um nome para o seu setup (ex: "Setup de Desenvolvimento", "Setup de Design", etc.)
3. A lista de aplicativos abertos será carregada automaticamente
4. Selecione os aplicativos que deseja incluir no setup (use os checkboxes)
5. Use a busca para filtrar aplicativos específicos
6. Clique em **Salvar Setup**

### 3. Iniciar um Setup

1. Na lista de setups salvos, encontre o setup desejado
2. Clique no botão **Iniciar** (ícone de play)
3. Uma janela modal mostrará o progresso em tempo real:
   - 🔵 **Iniciando...** - App está sendo iniciado
   - ✅ **Sucesso** - App iniciado com sucesso
   - ⚠️ **Já em execução** - App já estava aberto
   - ❌ **Erro** - Falha ao iniciar o app

### 4. Editar um Setup

1. Clique no botão de **Editar** (ícone de lápis) no card do setup
2. Modifique o nome ou os aplicativos selecionados
3. Clique em **Salvar Setup**

### 5. Excluir um Setup

1. Clique no botão de **Excluir** (ícone de lixeira) no card do setup
2. Confirme a exclusão

## 🛠️ Arquitetura Técnica

### Estrutura de Arquivos

```
src/
├── main/
│   └── main.ts                 # Funções IPC para workspace (Electron main process)
├── preload/
│   └── preload.ts              # Bridge entre main e renderer
├── renderer/
│   ├── components/
│   │   ├── WorkspaceSetupView.tsx      # Tela principal de setups
│   │   ├── CreateWorkspaceSetup.tsx    # Tela de criação/edição
│   │   └── SettingsView.tsx            # Integração com configurações
│   └── styles/
│       ├── WorkspaceSetupView.css
│       └── CreateWorkspaceSetup.css
└── types/
    ├── workspace.d.ts          # Interfaces TypeScript
    └── electron.d.ts           # APIs do Electron
```

### APIs Implementadas

#### Main Process (main.ts)

- `get-running-apps`: Lista todos os aplicativos abertos no Windows
- `is-app-running`: Verifica se um app específico está em execução
- `launch-app`: Inicia um único aplicativo
- `launch-workspace`: Inicia todos os apps de um workspace
- `get-workspaces`: Retorna todos os setups salvos
- `create-workspace`: Cria um novo setup
- `update-workspace`: Atualiza um setup existente
- `delete-workspace`: Exclui um setup

#### Renderer Process

Todas as APIs estão disponíveis através de `window.electronAPI`:

```typescript
// Listar apps abertos
const apps = await window.electronAPI.getRunningApps();

// Criar workspace
const workspace = await window.electronAPI.createWorkspace({
  workspace_name: "Meu Setup",
  apps: [...]
});

// Iniciar workspace
await window.electronAPI.launchWorkspace(workspaceId);

// Ouvir progresso de lançamento
window.electronAPI.onWorkspaceLaunchProgress((status) => {
  console.log(status);
});
```

### Armazenamento de Dados

Os setups são salvos localmente em:
- **Windows**: `%APPDATA%\elarixai-electron\workspaces\setups.json`

Formato do arquivo:
```json
[
  {
    "id": "1234567890",
    "workspace_name": "Dev Setup",
    "apps": [
      {
        "name": "Code",
        "path": "C:\\Users\\...\\Code.exe"
      }
    ],
    "created_at": "2025-10-05T12:00:00.000Z",
    "updated_at": "2025-10-05T12:00:00.000Z"
  }
]
```

## 🔄 Integração Futura com Backend

A arquitetura está preparada para integração com backend:

1. Substituir as funções de armazenamento local por chamadas API
2. Adicionar autenticação de usuário
3. Sincronizar setups entre dispositivos
4. Adicionar compartilhamento de setups

Exemplo de implementação futura:

```typescript
// Em vez de salvar localmente
const saveWorkspaces = async (workspaces: WorkspaceSetup[]) => {
  await fetch('https://api.elarixai.com/workspaces', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(workspaces)
  });
};
```

## 🐛 Solução de Problemas

### Apps não estão sendo listados

- Certifique-se de que os aplicativos estejam abertos e visíveis
- Aplicativos do sistema (Windows/System32) são filtrados automaticamente
- Tente clicar em "Atualizar Lista"

### Erro ao iniciar app

- Verifique se o caminho do executável ainda é válido
- O app pode ter sido desinstalado ou movido
- Edite o setup e remova/adicione novamente o app

### Setup não salva

- Verifique se você deu um nome ao setup
- Verifique se selecionou pelo menos um aplicativo
- Verifique as permissões de escrita no diretório do app

## 📝 Notas

- Os apps são iniciados sequencialmente com delay de 1.5s entre cada um para evitar sobrecarga
- A verificação de apps já em execução é feita via PowerShell no Windows
- O sistema é otimizado para Windows (funcionalidade específica da plataforma)

## 🎯 Próximos Passos

- [ ] Integração com backend
- [ ] Sincronização em nuvem
- [ ] Compartilhamento de setups
- [ ] Suporte para macOS e Linux
- [ ] Opções avançadas (delay customizado, ordem de inicialização, etc.)
- [ ] Exportar/Importar setups
- [ ] Favoritar setups
