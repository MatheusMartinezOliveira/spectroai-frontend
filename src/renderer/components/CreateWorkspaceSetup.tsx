import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiRefreshCw, FiSearch, FiMonitor } from 'react-icons/fi';
import { 
  SiGooglechrome, 
  SiMicrosoftedge, 
  SiFirefox, 
  SiVisualstudiocode, 
  SiSpotify, 
  SiDiscord, 
  SiSlack, 
  SiNotion,
  SiObsidian,
  SiFigma,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiPostman,
  SiDocker,
  SiNvidia
} from 'react-icons/si';
import { WorkspaceSetup, RunningApp } from '../../types/workspace';
import '../styles/CreateWorkspaceSetup.css';

interface CreateWorkspaceSetupProps {
  workspace: WorkspaceSetup | null;
  onSave: () => void;
  onCancel: () => void;
}

const CreateWorkspaceSetup: React.FC<CreateWorkspaceSetupProps> = ({ workspace, onSave, onCancel }) => {
  const [workspaceName, setWorkspaceName] = useState(workspace?.workspace_name || '');
  const [runningApps, setRunningApps] = useState<RunningApp[]>([]);
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Função para obter o ícone do app baseado no nome
  const getAppIcon = (appName: string) => {
    const name = appName.toLowerCase();
    
    if (name.includes('chrome')) return <SiGooglechrome className="app-icon" />;
    if (name.includes('msedge') || name.includes('edge')) return <SiMicrosoftedge className="app-icon" />;
    if (name.includes('firefox')) return <SiFirefox className="app-icon" />;
    if (name.includes('code') || name.includes('vscode')) return <SiVisualstudiocode className="app-icon" />;
    if (name.includes('spotify')) return <SiSpotify className="app-icon" />;
    if (name.includes('discord')) return <SiDiscord className="app-icon" />;
    if (name.includes('slack')) return <SiSlack className="app-icon" />;
    if (name.includes('notion')) return <SiNotion className="app-icon" />;
    if (name.includes('obsidian')) return <SiObsidian className="app-icon" />;
    if (name.includes('figma')) return <SiFigma className="app-icon" />;
    if (name.includes('photoshop')) return <SiAdobephotoshop className="app-icon" />;
    if (name.includes('illustrator')) return <SiAdobeillustrator className="app-icon" />;
    if (name.includes('postman')) return <SiPostman className="app-icon" />;
    if (name.includes('docker')) return <SiDocker className="app-icon" />;
    if (name.includes('nvidia')) return <SiNvidia className="app-icon" />;
    if (name.includes('cursor')) return <SiVisualstudiocode className="app-icon" />;
    
    // Ícone padrão para apps desconhecidos
    return <FiMonitor className="app-icon" />;
  };

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    setLoading(true);
    try {
      // Se estiver editando, começar com os apps do workspace
      if (workspace) {
        // Converter apps do workspace para o formato RunningApp
        const workspaceApps: RunningApp[] = workspace.apps.map(app => ({
          name: app.name,
          path: app.path,
          pid: 0, // PID não é relevante para apps salvos
          windowCount: app.windowCount || 1,
          windows: app.windows || []
        }));
        
        // Carregar apps rodando atualmente
        const currentRunningApps = await window.electronAPI.getRunningApps();
        
        // Mesclar: apps do workspace + apps rodando que não estão no workspace
        const workspaceAppPaths = new Set(workspace.apps.map(app => app.path));
        const newRunningApps = currentRunningApps.filter(app => !workspaceAppPaths.has(app.path));
        
        // Combinar: workspace apps primeiro, depois novos apps rodando
        setRunningApps([...workspaceApps, ...newRunningApps]);
        
        // Marcar apps do workspace como selecionados
        const paths = new Set(workspace.apps.map(app => app.path));
        setSelectedApps(paths);
      } else {
        // Se estiver criando novo, apenas carregar apps rodando
        const apps = await window.electronAPI.getRunningApps();
        setRunningApps(apps);
      }
    } catch (error) {
      console.error('Erro ao carregar apps:', error);
      alert('Erro ao carregar aplicativos');
    } finally {
      setLoading(false);
    }
  };

  const loadRunningApps = async () => {
    setLoading(true);
    try {
      const apps = await window.electronAPI.getRunningApps();
      
      if (workspace) {
        // Se estiver editando, mesclar com apps do workspace
        const workspaceApps: RunningApp[] = workspace.apps.map(app => ({
          name: app.name,
          path: app.path,
          pid: 0,
          windowCount: app.windowCount || 1,
          windows: app.windows || []
        }));
        
        const workspaceAppPaths = new Set(workspace.apps.map(app => app.path));
        const newRunningApps = apps.filter(app => !workspaceAppPaths.has(app.path));
        
        setRunningApps([...workspaceApps, ...newRunningApps]);
      } else {
        setRunningApps(apps);
      }
    } catch (error) {
      console.error('Erro ao carregar apps:', error);
      alert('Erro ao carregar aplicativos abertos');
    } finally {
      setLoading(false);
    }
  };

  const toggleApp = (appPath: string) => {
    const newSelected = new Set(selectedApps);
    if (newSelected.has(appPath)) {
      newSelected.delete(appPath);
    } else {
      newSelected.add(appPath);
    }
    setSelectedApps(newSelected);
  };

  const handleSave = async () => {
    if (!workspaceName.trim()) {
      alert('Por favor, digite um nome para o workspace');
      return;
    }

    if (selectedApps.size === 0) {
      alert('Por favor, selecione pelo menos um aplicativo');
      return;
    }

    const selectedAppsList = runningApps
      .filter(app => selectedApps.has(app.path))
      .map(app => ({
        name: app.name,
        path: app.path,
        windowCount: app.windowCount,
        windows: app.windows
      }));

    try {
      if (workspace) {
        // Atualizar workspace existente
        await window.electronAPI.updateWorkspace(workspace.id, {
          workspace_name: workspaceName,
          apps: selectedAppsList
        });
      } else {
        // Criar novo workspace
        await window.electronAPI.createWorkspace({
          workspace_name: workspaceName,
          apps: selectedAppsList
        });
      }
      onSave();
    } catch (error) {
      console.error('Erro ao salvar workspace:', error);
      alert('Erro ao salvar workspace');
    }
  };

  const filteredApps = runningApps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="create-workspace-setup">
      <div className="create-workspace-header">
        <h2>{workspace ? 'Editar Setup' : 'Criar Novo Setup'}</h2>
        <button className="close-btn" onClick={onCancel}>×</button>
      </div>

      <div className="create-workspace-content">
        <div className="form-section">
          <label htmlFor="workspace-name">Nome do Setup</label>
          <input
            id="workspace-name"
            type="text"
            className="workspace-name-input"
            placeholder="Ex: Setup de Desenvolvimento"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
        </div>

        <div className="apps-section">
          <div className="apps-section-header">
            <h3>Selecione os Aplicativos</h3>
            <button 
              className="refresh-btn"
              onClick={loadRunningApps}
              disabled={loading}
            >
              <FiRefreshCw className={loading ? 'spinning' : ''} size={16} />
              Atualizar Lista
            </button>
          </div>

          <div className="search-box">
            <FiSearch size={18} />
            <input
              type="text"
              placeholder="Buscar aplicativo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="selected-count">
            {selectedApps.size} {selectedApps.size === 1 ? 'aplicativo selecionado' : 'aplicativos selecionados'}
          </div>

          {loading ? (
            <div className="loading-apps">
              <FiRefreshCw className="spinning" size={32} />
              <p>Carregando aplicativos...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="no-apps">
              <p>
                {searchTerm 
                  ? 'Nenhum aplicativo encontrado com esse nome' 
                  : 'Nenhum aplicativo aberto encontrado'}
              </p>
            </div>
          ) : (
            <div className="apps-list">
              {filteredApps.map((app) => {
                const isFromWorkspace = workspace && workspace.apps.some(wa => wa.path === app.path);
                return (
                  <div
                    key={app.path}
                    className={`app-item ${selectedApps.has(app.path) ? 'selected' : ''}`}
                    onClick={() => toggleApp(app.path)}
                  >
                    {getAppIcon(app.name)}
                    <div className="app-info">
                      <div className="app-name-row">
                        <strong>{app.name}</strong>
                        {app.windowCount && app.windowCount > 1 && (
                          <span className="window-count-badge">{app.windowCount} janelas</span>
                        )}
                        {isFromWorkspace && <span className="workspace-badge">No Setup</span>}
                      </div>
                      <span className="app-path">{app.path}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedApps.has(app.path)}
                      onChange={() => toggleApp(app.path)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button className="cancel-btn" onClick={onCancel}>
            <FiX size={18} />
            Cancelar
          </button>
          <button 
            className="save-btn"
            onClick={handleSave}
            disabled={!workspaceName.trim() || selectedApps.size === 0}
          >
            <FiSave size={18} />
            Salvar Setup
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspaceSetup;
