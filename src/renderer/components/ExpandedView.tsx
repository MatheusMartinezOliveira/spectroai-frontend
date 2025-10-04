import React, { useState } from 'react';
import TitleBar from './TitleBar';
import Sidebar from './Sidebar';
import ChatView from './ChatView';
import SettingsView from './SettingsView';
import '../styles/ExpandedView.css';

type ViewType = 'chat' | 'settings';

const ExpandedView: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('chat');

  return (
    <div className="expanded-view">
      <TitleBar />
      <div className="expanded-content">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <div className="main-content">
          {currentView === 'chat' ? <ChatView /> : <SettingsView />}
        </div>
      </div>
    </div>
  );
};

export default ExpandedView;

