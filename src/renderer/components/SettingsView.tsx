import React, { useState } from 'react';
import { FiCalendar, FiMail, FiMessageCircle, FiSlack, FiMonitor } from 'react-icons/fi';
import '../styles/SettingsView.css';

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'integrations' | 'workspace'>('integrations');

  return (
    <div className="settings-view">
      <div className="settings-header">
        <h2>Configurações</h2>
      </div>

      <div className="settings-tabs">
        <button
          className={`settings-tab ${activeTab === 'integrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('integrations')}
        >
          Integrações
        </button>
        <button
          className={`settings-tab ${activeTab === 'workspace' ? 'active' : ''}`}
          onClick={() => setActiveTab('workspace')}
        >
          Workspace Setup
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'integrations' ? (
          <div className="integrations-list">
            <IntegrationCard
              icon={<FiCalendar size={32} />}
              title="Google Agenda"
              description="Sincronize seus compromissos e reuniões"
              connected={false}
            />
            <IntegrationCard
              icon={<FiMail size={32} />}
              title="E-mail"
              description="Gerencie seus e-mails automaticamente"
              connected={false}
            />
            <IntegrationCard
              icon={<FiMessageCircle size={32} />}
              title="WhatsApp"
              description="Envie e receba mensagens via API Baileys"
              connected={false}
            />
            <IntegrationCard
              icon={<FiSlack size={32} />}
              title="Slack"
              description="Notificações e mensagens do Slack"
              connected={false}
            />
            <IntegrationCard
              icon={<FiCalendar size={32} />}
              title="Google Meet"
              description="Gerencie suas videoconferências"
              connected={false}
            />
          </div>
        ) : (
          <div className="workspace-setup">
            <h3>Setup de Workspace</h3>
            <p className="workspace-description">
              Configure quais aplicativos devem ser abertos automaticamente ao iniciar seu workspace.
            </p>
            
            <button className="workspace-btn primary">
              <FiMonitor size={20} />
              <span>Abrir Workspace Setup</span>
            </button>
            
            <div className="workspace-info">
              <h4>Como funciona?</h4>
              <ul>
                <li>Salve a configuração atual dos seus aplicativos abertos</li>
                <li>Restaure todos os apps com um clique ao iniciar o Windows</li>
                <li>Economize tempo configurando tudo automaticamente</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface IntegrationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  connected: boolean;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ icon, title, description, connected }) => {
  const handleConnect = () => {
    console.log(`Conectando ${title}...`);
    // Implementar conexão com back-end posteriormente
  };

  return (
    <div className="integration-card">
      <div className="integration-icon">{icon}</div>
      <div className="integration-info">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <button 
        className={`integration-btn ${connected ? 'connected' : ''}`}
        onClick={handleConnect}
      >
        {connected ? 'Conectado' : 'Conectar'}
      </button>
    </div>
  );
};

export default SettingsView;

