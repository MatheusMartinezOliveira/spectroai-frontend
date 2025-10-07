import React, { useState, useEffect, useRef } from 'react';
import { FiPlay, FiEdit2, FiTrash2, FiPlus, FiInfo, FiCheckCircle, FiXCircle, FiLoader, FiAlertCircle, FiStopCircle, FiX } from 'react-icons/fi';
import { WorkspaceSetup, AppLaunchStatus } from '../../types/workspace';
import CreateWorkspaceSetup from './CreateWorkspaceSetup';
import '../styles/WorkspaceSetupView.css';

interface WorkspaceSetupViewProps {
  onClose: () => void;
}

const WorkspaceSetupView: React.FC<WorkspaceSetupViewProps> = ({ onClose }) => {
  const [workspaces, setWorkspaces] = useState<WorkspaceSetup[]>([]);
  const [showCreateEdit, setShowCreateEdit] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<WorkspaceSetup | null>(null);
  const [launchingId, setLaunchingId] = useState<string | null>(null);
  const [closingId, setClosingId] = useState<string | null>(null);
  const [launchProgress, setLaunchProgress] = useState<AppLaunchStatus[]>([]);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [isClosingMode, setIsClosingMode] = useState(false);
  const [launchSummary, setLaunchSummary] = useState<{ total: number; success: number; alreadyRunning: number; errors: number } | null>(null);
  const launchProgressRef = useRef<AppLaunchStatus[]>([]);

  useEffect(() => {
    loadWorkspaces();
    
    // Listener para progresso de lançamento
    window.electronAPI.onWorkspaceLaunchProgress((status) => {
      // Evita adicionar status duplicados para o mesmo app e status
      const jaProcessado = launchProgressRef.current.some(
        (s) => {
          console.log('s:', s);
          console.log('status:', status);
          return s.appName === status.appName && s.status === status.status && s.message === status.message
        }
      );
      if (!jaProcessado) {
        console.log('jaProcessado:', jaProcessado);
        console.log('Status de lançamento:', status);
        launchProgressRef.current.push(status);
      }
    });

    // Listener para conclusão do lançamento
    window.electronAPI.onWorkspaceLaunchComplete((summary) => {
      console.log('Conclusão do lançamento:', summary);
      setLaunchSummary(summary);
      setLaunchingId(null);
      setClosingId(null);
    });
  }, []);

  const loadWorkspaces = async () => {
    try {
      const data = await window.electronAPI.getWorkspaces();
      setWorkspaces(data);
    } catch (error) {
      console.error('Erro ao carregar workspaces:', error);
    }
  };

  const handleLaunch = async (workspaceId: string) => {
    setLaunchingId(workspaceId);
    // setLaunchProgress([]);
    launchProgressRef.current = [];
    setLaunchSummary(null);
    setIsClosingMode(false);
    setShowLaunchModal(true);

    try {
      const results = await window.electronAPI.launchWorkspace(workspaceId);
      console.log('Workspace iniciado:', results);
    } catch (error) {
      console.error('Erro ao iniciar workspace:', error);
      launchProgressRef.current.push({
        appName: 'Erro',
        status: 'error',
        message: `Erro ao iniciar workspace: ${error}`
      });
      setLaunchingId(null);
    }
  };

  const handleClose = async (workspaceId: string) => {
    setClosingId(workspaceId);
    launchProgressRef.current = [];
    setLaunchSummary(null);
    setIsClosingMode(true);
    setShowLaunchModal(true);

    try {
      const results = await window.electronAPI.closeWorkspace(workspaceId);
      console.log('Workspace fechado:', results);
    } catch (error) {
      console.error('Erro ao fechar workspace:', error);
      launchProgressRef.current.push({
        appName: 'Erro',
        status: 'error',
        message: `Erro ao fechar workspace: ${error}`
      });
      setClosingId(null);
    }
  };

  const handleEdit = (workspace: WorkspaceSetup) => {
    setEditingWorkspace(workspace);
    setShowCreateEdit(true);
  };

  const handleDelete = async (workspaceId: string) => {
    if (confirm('Deseja realmente excluir este workspace?')) {
      try {
        await window.electronAPI.deleteWorkspace(workspaceId);
        await loadWorkspaces();
      } catch (error) {
        console.error('Erro ao deletar workspace:', error);
        alert('Erro ao deletar workspace');
      }
    }
  };

  const handleCreateNew = () => {
    setEditingWorkspace(null);
    setShowCreateEdit(true);
  };

  const handleSaveComplete = async () => {
    setShowCreateEdit(false);
    setEditingWorkspace(null);
    await loadWorkspaces();
  };

  const handleCancelCreate = () => {
    setShowCreateEdit(false);
    setEditingWorkspace(null);
  };

  const closeLaunchModal = () => {
    setShowLaunchModal(false);
    launchProgressRef.current = [];
    setLaunchSummary(null);
    setIsClosingMode(false);
  };

  const handleCancelLaunch = async () => {
    try {
      await window.electronAPI.cancelWorkspaceLaunch();
      setLaunchingId(null);
      setClosingId(null);
    } catch (error) {
      console.error('Erro ao cancelar:', error);
    }
  };

  if (showCreateEdit) {
    return (
      <CreateWorkspaceSetup
        workspace={editingWorkspace}
        onSave={handleSaveComplete}
        onCancel={handleCancelCreate}
      />
    );
  }

  return (
    <div className="workspace-setup-view">
      <div className="workspace-setup-header">
        <h2>Workspace Setup</h2>
      </div>

      <div className="workspace-info-section">
        <div className="info-card">
          <FiInfo size={24} className="info-icon" />
          <div className="info-content">
            <h3>Como funciona?</h3>
            <ul>
              <li>Crie múltiplos setups com diferentes conjuntos de aplicativos</li>
              <li>Salve a configuração dos seus aplicativos abertos</li>
              <li>Restaure todos os apps de um setup com um único clique</li>
              <li>Economize tempo configurando tudo automaticamente</li>
            </ul>
          </div>
        </div>
      </div>

      {workspaces.length > 0 && (
        <div className="workspaces-list">
          <h3>Setups Salvos</h3>
          <div className="workspaces-grid">
            {workspaces.map((workspace) => (
              <div key={workspace.id} className="workspace-card">
                <div className="workspace-card-header">
                  <h4>{workspace.workspace_name}</h4>
                  <span className="apps-count">{workspace.apps.length} apps</span>
                </div>
                <div className="workspace-card-apps">
                  {workspace.apps.slice(0, 3).map((app, index) => (
                    <span key={index} className="app-tag">{app.name}</span>
                  ))}
                  {workspace.apps.length > 3 && (
                    <span className="app-tag more">+{workspace.apps.length - 3}</span>
                  )}
                </div>
                <div className="workspace-card-actions">
                  <button
                    className="action-btn launch-btn"
                    onClick={() => handleLaunch(workspace.id)}
                    disabled={launchingId === workspace.id || closingId === workspace.id}
                  >
                    {launchingId === workspace.id ? (
                      <>
                        <FiLoader className="spinning" size={16} />
                        Iniciando...
                      </>
                    ) : (
                      <>
                        <FiPlay size={16} />
                        Iniciar
                      </>
                    )}
                  </button>
                  <button
                    className="action-btn close-btn"
                    onClick={() => handleClose(workspace.id)}
                    disabled={launchingId === workspace.id || closingId === workspace.id}
                  >
                    {closingId === workspace.id ? (
                      <>
                        <FiLoader className="spinning" size={16} />
                        Fechando...
                      </>
                    ) : (
                      <>
                        <FiX size={16} />
                        Fechar
                      </>
                    )}
                  </button>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(workspace)}
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(workspace.id)}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="create-workspace-section">
        <button className="create-workspace-btn" onClick={handleCreateNew}>
          <FiPlus size={20} />
          Criar Novo Setup
        </button>
      </div>

      {/* Modal de progresso de lançamento */}
      {showLaunchModal && (
        <div className="launch-modal-overlay" onClick={closeLaunchModal}>
          <div className="launch-modal" onClick={(e) => e.stopPropagation()}>
            <div className="launch-modal-header">
              <h3>{isClosingMode ? 'Fechando Workspace' : 'Iniciando Workspace'}</h3>
              <button className="close-modal-btn" onClick={closeLaunchModal}>×</button>
            </div>
            <div className="launch-progress-list">
              {launchProgressRef.current.length === 0 ? (
                <div className="progress-item launching">
                  <FiLoader className="spinning" size={20} />
                  <div className="progress-info">
                    <strong>{isClosingMode ? 'Fechando workspace...' : 'Iniciando workspace...'}</strong>
                    <span className="progress-message">
                      {isClosingMode ? 'Aguarde enquanto os aplicativos são fechados' : 'Aguarde enquanto os aplicativos são iniciados'}
                    </span>
                  </div>
                </div>
              ) : (
                launchProgressRef.current.map((status, index) => (
                  <div key={index} className={`progress-item ${status.status}`}>
                    {status.status === 'launching' && <FiLoader className="spinning" size={20} />}
                    {status.status === 'success' && <FiCheckCircle size={20} />}
                    {status.status === 'error' && <FiXCircle size={20} />}
                    {status.status === 'already_running' && <FiAlertCircle size={20} />}
                    <div className="progress-info">
                      <strong>{status.appName}</strong>
                      <span className="progress-message">{status.message}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Resumo final */}
            {launchSummary && (
              <div className="launch-summary">
                <div className="summary-icon">
                  <FiCheckCircle size={32} />
                </div>
                <div className="summary-content">
                  <h4>{isClosingMode ? 'Workspace Fechado!' : 'Setup Pronto!'}</h4>
                  <p>
                    {launchSummary.total} {launchSummary.total === 1 ? 'aplicativo' : 'aplicativos'} processado{launchSummary.total === 1 ? '' : 's'}
                    {launchSummary.success > 0 && ` • ${launchSummary.success} ${isClosingMode ? 'fechado' : 'iniciado'}${launchSummary.success === 1 ? '' : 's'}`}
                    {!isClosingMode && launchSummary.alreadyRunning > 0 && ` • ${launchSummary.alreadyRunning} já em execução`}
                    {launchSummary.errors > 0 && ` • ${launchSummary.errors} erro${launchSummary.errors === 1 ? '' : 's'}`}
                  </p>
                </div>
              </div>
            )}
            
            <div className="launch-modal-footer">
              {(launchingId !== null || closingId !== null) ? (
                <button className="cancel-launch-btn" onClick={handleCancelLaunch}>
                  <FiStopCircle size={18} />
                  {isClosingMode ? 'Cancelar Fechamento' : 'Cancelar Inicialização'}
                </button>
              ) : launchSummary && (
                <button className="close-modal-btn-primary" onClick={closeLaunchModal}>
                  Fechar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceSetupView;
