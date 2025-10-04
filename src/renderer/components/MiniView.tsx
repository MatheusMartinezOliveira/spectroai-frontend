import React, { useState, useEffect } from 'react';
import VortexIcon from './VortexIcon';
import '../styles/MiniView.css';

const MiniView: React.FC = () => {
  const [isListening, setIsListening] = useState(false);

  const handleClick = async () => {
    await window.electronAPI.toggleMode();
    window.location.reload();
  };

  const handleVoiceActivation = () => {
    setIsListening(true);
    window.electronAPI.setVortexActive(true);
    
    // Simula gravação de voz (depois integrar com API de reconhecimento de voz)
    setTimeout(() => {
      setIsListening(false);
      window.electronAPI.setVortexActive(false);
    }, 3000);
  };

  useEffect(() => {
    // Listener para ativação por palavra-chave (AI, Spectro)
    const handleKeyPress = (e: KeyboardEvent) => {
      // Por enquanto usa Ctrl+Space para ativar
      if (e.ctrlKey && e.code === 'Space') {
        handleVoiceActivation();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="mini-view" onClick={handleClick}>
      <VortexIcon isActive={isListening} />
    </div>
  );
};

export default MiniView;

