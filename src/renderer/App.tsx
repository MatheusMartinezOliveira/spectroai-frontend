import React, { useState, useEffect } from 'react';
import ExpandedView from './components/ExpandedView';
import MiniView from './components/MiniView';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  const [mode, setMode] = useState<'expanded' | 'minimized'>('expanded');

  useEffect(() => {
    const initMode = async () => {
      console.log('🔍 Verificando window.electronAPI:', window.electronAPI);
      if (!window.electronAPI) {
        console.error('❌ electronAPI não está disponível! Preload não foi carregado.');
        return;
      }
      const currentMode = await window.electronAPI.getMode();
      console.log('✅ Modo atual:', currentMode);
      setMode(currentMode);
    };
    initMode();
  }, []);

  return (
    <ThemeProvider>
      <div className="app-container">
        {mode === 'expanded' ? <ExpandedView /> : <MiniView />}
      </div>
    </ThemeProvider>
  );
};

export default App;

