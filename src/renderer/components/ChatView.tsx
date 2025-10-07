import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMic, FiPaperclip } from 'react-icons/fi';
import '../styles/ChatView.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou o Elarix AI, seu assistente pessoal. Como posso ajudar você hoje?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simula resposta da IA (depois integrar com back-end)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Recebi sua mensagem! Em breve terei acesso ao back-end para processar suas solicitações.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Implementar gravação de voz posteriormente
  };

  const handleFileAttach = () => {
    // Implementar anexo de arquivos posteriormente
    console.log('Anexar arquivo');
  };

  return (
    <div className="chat-view">
      <div className="chat-header">
        <h2>Chat com Elarix AI</h2>
      </div>
      
      <div className="chat-messages">
        {messages.map(message => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'message-user' : 'message-ai'}`}
          >
            <div className="message-content">
              <p>{message.text}</p>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <button 
          className="chat-action-btn" 
          onClick={handleFileAttach}
          title="Anexar arquivo"
        >
          <FiPaperclip size={20} />
        </button>
        
        <input
          type="text"
          className="chat-input"
          placeholder="Digite sua mensagem..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        
        <button 
          className={`chat-action-btn ${isRecording ? 'recording' : ''}`}
          onClick={handleVoiceRecord}
          title="Gravar áudio"
        >
          <FiMic size={20} />
        </button>
        
        <button 
          className="chat-send-btn" 
          onClick={handleSendMessage}
          title="Enviar mensagem"
        >
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatView;

