import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { queryAgent } from './api';

// Get agent configuration from environment variables
const AGENT_NAME = process.env.REACT_APP_AGENT_NAME || 'AI Agent';
const AGENT_TYPE = process.env.REACT_APP_AGENT_TYPE || 'assistant';
const WELCOME_TITLE = process.env.REACT_APP_WELCOME_TITLE || `Welcome to ${AGENT_NAME}!`;
const WELCOME_MESSAGE = process.env.REACT_APP_WELCOME_MESSAGE || `Ask me anything! I'm here to help you with your ${AGENT_TYPE} needs.`;
const INPUT_PLACEHOLDER = process.env.REACT_APP_INPUT_PLACEHOLDER || 'Type your question or request...';

// Message component for individual chat messages
const Message = ({ message, isUser }) => {
  return (
    <div className={`message ${isUser ? 'user-message' : 'agent-message'}`}>
      <div className="message-header">
        <span className="message-sender">{isUser ? 'You' : AGENT_NAME}</span>
        <span className="message-time">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <div className="message-content">
        {isUser ? (
          <div className="user-query">{message.content}</div>
        ) : (
          <pre className="agent-response">{message.content}</pre>
        )}
      </div>
    </div>
  );
};

function App() {
  const [messages, setMessages] = useState([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentQuery.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      content: currentQuery,
      timestamp: new Date().toISOString(),
      isUser: true
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setCurrentQuery('');
    setLoading(true);

    try {
      const result = await queryAgent(currentQuery);

      const agentMessage = {
        id: Date.now() + 1,
        content: result.response,
        timestamp: new Date().toISOString(),
        isUser: false
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        content: `Error: ${error.message}`,
        timestamp: new Date().toISOString(),
        isUser: false,
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-header">
          <h1>{AGENT_NAME} Chat</h1>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <h3>{WELCOME_TITLE}</h3>
              <p>{WELCOME_MESSAGE}</p>
            </div>
          ) : (
            messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                isUser={message.isUser}
              />
            ))
          )}

          {loading && (
            <div className="message agent-message loading">
              <div className="message-header">
                <span className="message-sender">{AGENT_NAME}</span>
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="chat-input">
          <div className="input-container">
            <textarea
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={INPUT_PLACEHOLDER}
              rows={1}
              disabled={loading}
              className="message-input"
            />
            <button
              type="submit"
              disabled={loading || !currentQuery.trim()}
              className="send-button"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
