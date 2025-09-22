import React, { useState } from 'react';
import './styles/global.css';

// Components
import {
  Message,
  ChatInput,
  ImageModal,
  TypingIndicator,
  WelcomeMessage
} from './components';

// Hooks
import { useChat, useScrollToBottom } from './hooks';

// Utils
import { AGENT_CONFIG } from './utils/constants';

function App() {
  const [currentQuery, setCurrentQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // Custom hooks
  const { messages, loading, sendMessage } = useChat();
  const messagesEndRef = useScrollToBottom(messages);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentQuery.trim() || loading) return;

    await sendMessage(currentQuery);
    setCurrentQuery('');
  };


  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-header">
          <h1>{AGENT_CONFIG.name} Chat</h1>
        </div>


        <div className="chat-messages">
          {messages.length === 0 ? (
            <WelcomeMessage 
              title={AGENT_CONFIG.welcomeTitle}
              message={AGENT_CONFIG.welcomeMessage}
            />
          ) : (
            messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                isUser={message.isUser}
                agentName={AGENT_CONFIG.name}
                onImageClick={setSelectedImage}
              />
            ))
          )}

          {loading && (
            <TypingIndicator agentName={AGENT_CONFIG.name} />
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          currentQuery={currentQuery}
          setCurrentQuery={setCurrentQuery}
          loading={loading}
          onSubmit={handleSubmit}
          placeholder={AGENT_CONFIG.inputPlaceholder}
        />
      </div>

      <ImageModal 
        selectedImage={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </div>
  );
}

export default App;