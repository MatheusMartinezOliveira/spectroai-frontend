import React from 'react';
import { FiMinus, FiMaximize2, FiX, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import '../styles/TitleBar.css';

const TitleBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleMinimize = async () => {
    if (!window.electronAPI) {
      console.error('❌ electronAPI não disponível');
      return;
    }
    await window.electronAPI.minimizeWindow();
  };

  const handleMaximize = async () => {
    if (!window.electronAPI) {
      console.error('❌ electronAPI não disponível');
      return;
    }
    await window.electronAPI.maximizeWindow();
  };

  const handleClose = async () => {
    if (!window.electronAPI) {
      console.error('❌ electronAPI não disponível');
      return;
    }
    await window.electronAPI.closeWindow();
    // Recarrega para atualizar o estado do React
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="title-bar">
      <div className="title-bar-left">
        <span className="app-title">Elarix AI</span>
      </div>
      <div className="title-bar-right">
        <button className="title-bar-btn" onClick={toggleTheme}>
          {theme === 'light' ? <FiMoon size={16} /> : <FiSun size={16} />}
        </button>
        <button className="title-bar-btn" onClick={handleMinimize}>
          <FiMinus size={16} />
        </button>
        <button className="title-bar-btn" onClick={handleMaximize}>
          <FiMaximize2 size={16} />
        </button>
        <button className="title-bar-btn close-btn" onClick={handleClose}>
          <FiX size={16} />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;

