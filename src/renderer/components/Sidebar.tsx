import React from 'react';
import { FiMessageSquare, FiSettings } from 'react-icons/fi';
import '../styles/Sidebar.css';

interface SidebarProps {
  currentView: 'chat' | 'settings';
  onViewChange: (view: 'chat' | 'settings') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-items">
        <button
          className={`sidebar-item ${currentView === 'chat' ? 'active' : ''}`}
          onClick={() => onViewChange('chat')}
          title="Chat"
        >
          <FiMessageSquare size={24} />
        </button>
        <button
          className={`sidebar-item ${currentView === 'settings' ? 'active' : ''}`}
          onClick={() => onViewChange('settings')}
          title="Configurações"
        >
          <FiSettings size={24} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

