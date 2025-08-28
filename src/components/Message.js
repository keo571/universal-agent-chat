import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import './Message.css';

const Message = React.memo(({ message, isUser, agentName, onImageClick }) => {
  return (
    <div className={`message ${isUser ? 'user-message' : 'agent-message'}`}>
      <div className="message-header">
        <span className="message-sender">{isUser ? 'You' : agentName}</span>
        <span className="message-time">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <div className="message-content">
        {isUser ? (
          <div className="user-query">{message.content}</div>
        ) : (
          <div className="agent-response">
            <div className="response-text">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
            {message.visualization_path && (
              <div className="visualization">
                <img
                  src={message.visualization_path}
                  alt="Network Diagram"
                  className="diagram-image"
                  onClick={() => onImageClick(message.visualization_path)}
                />
              </div>
            )}
            {message.explanation && (
              <div className={`explanation ${!message.content && !message.visualization_path ? 'no-border' : ''}`}>
                <ReactMarkdown>{message.explanation}</ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

Message.displayName = 'Message';

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    explanation: PropTypes.string,
    visualization_path: PropTypes.string,
    results: PropTypes.any,
    isError: PropTypes.bool
  }).isRequired,
  isUser: PropTypes.bool.isRequired,
  agentName: PropTypes.string.isRequired,
  onImageClick: PropTypes.func.isRequired
};

export default Message;